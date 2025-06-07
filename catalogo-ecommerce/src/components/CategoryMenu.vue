<template>
  <div class="flex flex-wrap gap-2 mb-4">
    <!-- Botão para todos -->
    <button
      @click="$emit('select-category', '')"
      class="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
    >
      Todos
    </button>

    <!-- Botões das categorias -->
    <button
      v-for="category in categories"
      :key="category.slug"
      @click="$emit('select-category', category.slug)"
      class="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-lg hover:from-purple-200 hover:to-purple-300 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm capitalize"
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
