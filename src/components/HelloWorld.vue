<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">العدد هو {{ count }}</button>
    <p>
      قم بتعديل
      <code>components/HelloWorld.vue</code> 
      لاختبار التحديث المباشر
    </p>
  </div>

  <p>
    تحقق من
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>
    ، مشروع Vue + Vite الرسمي
  </p>
  <p>
    تعلم المزيد عن دعم IDE لـ Vue في
    <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank">دليل Vue للتطوير</a>
  </p>
  <p class="read-the-docs">انقر على شعارات Vite و Vue لمعرفة المزيد</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>