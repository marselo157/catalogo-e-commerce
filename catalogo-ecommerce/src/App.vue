<template>
  <div class="bg-background text-text min-h-screen flex flex-col">
    <Navbar @search="handleSearch" />
    
    <main class="flex-1 p-4 pt-24">
      <router-view />
    </main>

    <Footer />

    <!-- Modal de Confirmação -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full shadow-2xl">
        <div class="p-6 text-center border-b">
          <div class="text-4xl mb-3">✅</div>
          <h2 class="text-xl font-bold text-gray-800 mb-2">Produto Adicionado!</h2>
          <p class="text-gray-600">O produto foi adicionado ao seu carrinho.</p>
        </div>
        
        <div class="p-6">
          <div class="flex gap-3">
            <button 
              @click="goToCart"
              class="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium"
            >
              Ver Carrinho
            </button>
            <button 
              @click="closeModal"
              class="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all font-medium"
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from "./components/Navbar.vue"
import Footer from "./components/Footer.vue"
import { useCart } from './composables/useCart'

const router = useRouter()
const searchTerm = ref('')
const showModal = ref(false)
const { loadCart } = useCart()

const closeModal = () => showModal.value = false
const goToCart = () => {
  showModal.value = false
  router.push('/carrinho')
}

const handleSearch = (query) => searchTerm.value = query

provide('searchTerm', searchTerm)

onMounted(() => {
  loadCart()
  window.addEventListener('product-added-to-cart', () => {
    showModal.value = true
  })
})
</script>
