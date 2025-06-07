<template>
  <div class="max-w-3xl mx-auto">
    <button @click="$router.push('/')" class="mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
      ← Voltar ao Catálogo
    </button>

    <div v-if="product" class="bg-white shadow rounded p-4">
      <img :src="product.thumbnail" :alt="product.title" class="w-full h-64 object-contain mb-4" />
      <h1 class="text-3xl font-bold mb-4 text-gray-800">{{ product.title }}</h1>
      <p class="text-2xl font-bold text-green-600 mb-4">R$ {{ product.price.toFixed(2) }}</p>
      
      <div v-if="product.rating" class="mb-4">
        <StarRating :rating="product.rating" />
      </div>
      
      <p class="text-gray-700 mb-4 text-lg">{{ product.description }}</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
        <p><strong>Categoria:</strong> {{ product.category }}</p>
        <p><strong>Marca:</strong> {{ product.brand }}</p>
        <p><strong>Estoque:</strong> {{ product.stock }} unidades</p>
      </div>
      
      <button 
        @click="addToCart"
        class="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium"
      >
        Adicionar ao Carrinho
      </button>
    </div>

    <div v-else class="text-center text-gray-500">
      Carregando detalhes do produto...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import StarRating from '../components/StarRating.vue'
import { useCart } from '../composables/useCart'

const route = useRoute()
const product = ref(null)
const { addToCart: addProductToCart } = useCart()

const loadProduct = async () => {
  try {
    const { data } = await axios.get(`https://dummyjson.com/products/${route.params.id}`)
    product.value = data
  } catch (err) {
    console.error('Erro ao carregar produto:', err)
  }
}

onMounted(() => {
  loadProduct()
})

const addToCart = () => {
  if (product.value) addProductToCart(product.value)
}
</script>
