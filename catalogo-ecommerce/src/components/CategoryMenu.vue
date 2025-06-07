<template>
  <div class="flex flex-wrap gap-2 mb-4">
    <!-- Botão para todos -->
    <button
      @click="$emit('select-category', '')"
      class="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
    >
      Todos
    </button>

    <!-- Botões das categorias -->
    <button
      v-for="category in categories"
      :key="category.slug"
      @click="$emit('select-category', category.slug)"
      class="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 capitalize"
    >
      {{ category.name }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const categories = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('https://dummyjson.com/products/categories')
    categories.value = res.data
  } catch (err) {
    console.error('Erro ao carregar categorias:', err)
  }
})
</script>

