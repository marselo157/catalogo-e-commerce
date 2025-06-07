<template>
  <div class="p-6 max-w-3xl mx-auto">
    <!-- Botão de Voltar -->
    <button
      @click="goBack"
      class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      ← Voltar ao Catálogo
    </button>

    <!-- Detalhes do produto -->
    <div v-if="product" class="bg-white shadow rounded p-4">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="w-full h-64 object-contain mb-4"
      />
      <h1 class="text-2xl font-bold mb-2">{{ product.title }}</h1>
      <p class="text-gray-600 mb-2">Preço: R$ {{ product.price }}</p>
      <p class="text-gray-700 mb-4">{{ product.description }}</p>
      <p class="text-sm text-gray-500">Categoria: {{ product.category }}</p>
      <p class="text-sm text-gray-500">Marca: {{ product.brand }}</p>
      <p class="text-sm text-gray-500">Estoque: {{ product.stock }}</p>
    </div>

    <!-- Carregando -->
    <div v-else class="text-center text-gray-500">
      Carregando detalhes do produto...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

// Router e rota
const route = useRoute()
const router = useRouter()

// Produto carregado
const product = ref(null)

// Buscar dados do produto ao montar
onMounted(async () => {
  try {
    const res = await axios.get(`https://dummyjson.com/products/${route.params.id}`)
    product.value = res.data
  } catch (err) {
    console.error('Erro ao carregar produto:', err)
  }
})

// Navegar de volta à página inicial
const goBack = () => {
  router.push('/')
}
</script>