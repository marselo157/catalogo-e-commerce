<template>
  <div class="flex flex-wrap gap-2 mb-4">
    <button
      @click="$emit('select-category', '')"
      class="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
    >
      Todos
    </button>

    <button
      v-for="category in categories"
      :key="category.Slug"
      @click="$emit('select-category', category.Slug)"
      class="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 capitalize"
    >
      {{ category.Name }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const categories = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('https://dummyjson.com/products/categories')
    
    // ADAPTAÇÃO para mock local que retorna objetos
    if (Array.isArray(response.data) && typeof response.data[0] === 'object') {
      categories.value = response.data
    } else {
      // Resposta original da API
      categories.value = response.data.map(cat => ({ Slug: cat, Name: cat }))
    }

  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
  }
})
</script>
