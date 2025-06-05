<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="product in products" :key="product.id" class="bg-white p-4 rounded shadow">
        <img :src="product.thumbnail" :alt="product.title" class="w-full h-40 object-cover rounded mb-2">
        <h2 class="text-lg font-semibold">{{ product.title }}</h2>
        <p class="text-gray-600">R$ {{ product.price }}</p>
        <p class="text-sm text-gray-500">Categoria: {{ product.category }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const products = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('https://dummyjson.com/products')
    products.value = response.data.products
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
  }
})
</script>
