// /stores/chat.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Message, ChatState } from '../types/chat';

// استعملنا حزمة @google/genai بدلاً من @google/generative-ai
import { GoogleGenAI } from '@google/genai';

/**
 * واجهة مخصّصة نتوقع أن تُعيدها نماذج توليد الصور
 * (التي تعيد property اسمها media تحتوي على صور مولدة)
 */
interface ImageGenerateResponse {
  text?: string;
  media?: Array<{
    data: string;
    mimeType: string;
  }>;
}

export const useChatStore = defineStore('chat', () => {
  // الحالة الرئيسية
  const state = ref<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  // أنشئ كائن GoogleGenAI باستخدام مفتاح الـAPI
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  // دالة لإضافة رسالة
  const addMessage = (message: Message) => {
    state.value.messages.push(message);
  };

  /**
   * دالة لإرسال رسالة:
   * - إذا لم يأتِ imageUrl، نفترض أنها نص فقط ونستخدم نموذج النص (gemini-2.0-flash).
   * - إذا وُجد imageUrl، نقوم بتحميل الصورة وتحويلها base64 ثم نرسلها إلى نموذج الصور (gemini-2.0-flash-exp-image-generation).
   */
  const sendMessage = async (content: string, imageUrl?: string) => {
    try {
      state.value.isLoading = true;
      state.value.error = null;

      // أضف رسالة المستخدم (User)
      const userMessage: Message = {
        id: crypto.randomUUID(),
        content,
        role: 'user',
        timestamp: new Date(),
        imageUrl,
      };
      addMessage(userMessage);

      let responseText = '';
      let responseImageUrl = '';

      if (imageUrl) {
        console.log('imageUrl', imageUrl);
        // 1) لدينا رابط صورة من المستخدم
        // 2) نجلب الصورة ونحوِّلها إلى base64
        const imageData = await fetch(imageUrl);
        const imageBlob = await imageData.blob();
        const base64Image = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageBlob);
        });
        // إزالة بادئة data:image/png;base64, ...
        const base64Data = base64Image.split(',')[1];

        // 3) نرسل (النص + الصورة) إلى نموذج الصور
        const result = await ai.models.generateContent({
          model: 'gemini-2.0-flash-exp-image-generation', // غيِّر الاسم إذا لزم
          contents: [
            content,
            {
              inlineData: {
                data: base64Data,
                mimeType: imageBlob.type,
              },
            },
          ],
        });

        // هنا نقوم بتحويل كائن النتيجة إلى نوع ImageGenerateResponse
        // حتى لا يعترض TypeScript على 'media'
        const typedResult = result as unknown as ImageGenerateResponse;

        // إذا كان هناك نص
        responseText = typedResult.text || '';

        // إذا كان الموديل يولّد صوراً ويخزّنها في media
        if (typedResult.media && typedResult.media.length > 0) {
          const generatedImage = typedResult.media[0];
          const base64OutputImage = generatedImage.data;
          const mimeTypeOutput = generatedImage.mimeType;

          // تكوين رابط data URL لنعرض الصورة الناتجة في الواجهة
          responseImageUrl = `data:${mimeTypeOutput};base64,${base64OutputImage}`;
        }

      } else {
        // نص فقط -> نستخدم نموذج نصي (بدون صور)
        const result = await ai.models.generateContent({
          model: 'gemini-2.0-flash', // غيِّر الاسم إذا لزم
          contents: content,
        });

        // في هذه الحالة لا نتوقع وجود media، فنكتفي بالتكست
        responseText = result.text || '';
        console.log('responseText', responseText);
      }

      // أضف رسالة المساعد (Assistant)
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: responseText,
        role: 'assistant',
        timestamp: new Date(),
      };

      // إذا جرى توليد صورة، أرفقها بالرسالة
      if (responseImageUrl) {
        console.log('responseImageUrl', responseImageUrl);
        assistantMessage.imageUrl = responseImageUrl;
      }
      

      addMessage(assistantMessage);

    } catch (error) {
      console.error('Gemini API Error:', error);
      state.value.error = error instanceof Error ? error.message : 'حدث خطأ أثناء معالجة الطلب';
    } finally {
      state.value.isLoading = false;
    }
  };

  // Getters
  const messages = computed(() => state.value.messages);
  const isLoading = computed(() => state.value.isLoading);
  const error = computed(() => state.value.error);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
});
