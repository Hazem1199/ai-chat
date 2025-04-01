<script setup lang="ts">
import type { Message } from '../types/chat';

defineProps<{
  message: Message;
}>();
</script>

<template>
  <div :class="[
    'mb-6 flex',
    message.role === 'user' ? 'justify-end' : 'justify-start'
  ]">
    <div :class="[
      'message-bubble max-w-[80%] px-6 py-4',
      message.role === 'user' ? 'user' : 'assistant'
    ]">
      <div class="flex items-start gap-4">
        <div class="flex-1">
          <p :class="[
            'text-[15px] leading-relaxed',
            message.role === 'user' ? 'text-white' : 'text-gray-700'
          ]">{{ message.content }}</p>
          
          <img
            v-if="message.imageUrl"
            :src="message.imageUrl"
            alt="Uploaded image"
            class="mt-3 rounded-lg max-w-full h-auto"
          />
          
          <span :class="[
            'text-xs mt-2 block',
            message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
          ]">
            {{ new Date(message.timestamp).toLocaleTimeString() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>