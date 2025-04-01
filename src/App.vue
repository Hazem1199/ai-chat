<script setup lang="ts">
import { useChatStore } from './stores/chat';
import ChatMessage from './components/ChatMessage.vue';
import ChatInput from './components/ChatInput.vue';

const chatStore = useChatStore();
</script>

<template>
  <div class="chat-container">
    <div class="max-w-4xl mx-auto p-4 md:p-6 h-screen flex flex-col">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col flex-1">
        <div class="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-semibold text-gray-900">Chat with Gemini AI</h1>
              <p class="text-sm text-gray-500">Powered by Google's Advanced AI</p>
            </div>
          </div>
        </div>
        
        <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div v-if="chatStore.error" 
               class="mb-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              {{ chatStore.error }}
            </div>
          </div>
          
          <template v-if="chatStore.messages.length > 0">
            <ChatMessage
              v-for="message in chatStore.messages"
              :key="message.id"
              :message="message"
            />
          </template>
          
          <div v-else class="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="text-lg font-medium mb-2">Start a Conversation</p>
            <p class="text-sm">Send a message or upload an image to begin chatting with Gemini AI</p>
          </div>
        </div>
        
        <ChatInput />
      </div>
    </div>
  </div>
</template>