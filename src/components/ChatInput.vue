<script setup lang="ts">
import { ref } from 'vue';
import { useChatStore } from '../stores/chat';

const chatStore = useChatStore();
const message = ref('');
const fileInput = ref<HTMLInputElement | null>(null);
const imagePreview = ref<string | null>(null);

const handleSubmit = async () => {
  if (!message.value.trim() && !imagePreview.value) return;
  
  await chatStore.sendMessage(message.value, imagePreview.value || undefined);
  message.value = '';
  imagePreview.value = null;
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  imagePreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};
</script>

<template>
  <div class="input-container p-6">
    <div v-if="imagePreview" class="mb-4">
      <div class="relative inline-block group">
        <img
          :src="imagePreview"
          alt="Preview"
          class="max-w-[200px] rounded-xl shadow-sm"
        />
        <button
          @click="removeImage"
          class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 
                 transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="flex items-center gap-4">
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        class="hidden"
        @change="handleFileUpload"
      />
      
      <button
        @click="() => fileInput?.click()"
        class="button-secondary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
        </svg>
        Upload Image
      </button>
      
      <div class="flex-1 relative">
        <input
          v-model="message"
          type="text"
          placeholder="Type your message..."
          class="chat-input"
          @keyup.enter="handleSubmit"
        />
      </div>
      
      <button
        @click="handleSubmit"
        class="button-primary"
        :disabled="chatStore.isLoading"
      >
        <span v-if="chatStore.isLoading">
          <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
        <span v-else>Send</span>
      </button>
    </div>
  </div>
</template>