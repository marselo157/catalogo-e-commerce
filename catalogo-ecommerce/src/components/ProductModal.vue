<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click="closeModal"
  >
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" @click.stop>
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-xl font-bold text-gray-800">Preview do Produto</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700 text-2xl font-bold">×</button>
      </div>

      <div v-if="product" class="p-6">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="flex justify-center">
            <img :src="product.thumbnail" :alt="product.title" class="w-full h-64 object-contain rounded-lg" />
          </div>

          <div class="space-y-4">
            <h3 class="text-2xl font-bold text-gray-800">{{ product.title }}</h3>
            
            <div class="flex items-center gap-4">
              <span class="text-3xl font-bold text-green-600">R$ {{ product.price.toFixed(2) }}</span>
              <StarRating v-if="product.rating" :rating="product.rating" />
            </div>

            <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>

            <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <p><strong>Categoria:</strong> {{ product.category }}</p>
              <p><strong>Marca:</strong> {{ product.brand }}</p>
              <p><strong>Estoque:</strong> {{ product.stock }} unidades</p>
            </div>

            <div class="flex gap-3 pt-4">
              <button 
                class="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium"
                @click="addToCart"
              >
                Adicionar ao Carrinho
              </button>
              <router-link 
                :to="`/produto/${product.id}`"
                class="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all text-center font-medium"
                @click="closeModal"
              >
                Ver Detalhes Completos
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Carregando produto...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import StarRating from './StarRating.vue'
import { useCart } from '../composables/useCart'

const props = defineProps({
  isOpen: Boolean,
  productId: [String, Number]
})

const emit = defineEmits(['close'])
const { addToCart: addProductToCart } = useCart()
const product = ref(null)
const loading = ref(false)

const closeModal = () => emit('close')

const addToCart = () => {
  if (product.value) {
    addProductToCart(product.value)
    closeModal()
  }
}

const fetchProduct = async (id) => {
  if (!id) return
  
  try {
    loading.value = true
    product.value = null
    const { data } = await axios.get(`https://dummyjson.com/products/${id}`)
    product.value = data
  } catch (error) {
    console.error('Erro ao carregar produto:', error)
  } finally {
    loading.value = false
  }
}

watch([() => props.isOpen, () => props.productId], ([isOpen, productId]) => {
  if (isOpen && productId) fetchProduct(productId)
})
</script>
