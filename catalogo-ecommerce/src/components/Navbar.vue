<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-primary text-white px-6 py-4 flex justify-between items-center shadow-lg">
    <router-link to="/" class="text-2xl font-bold">Catálogo E-Commerce</router-link>
    
    <div class="flex items-center gap-4">
      <input
        v-model="searchQuery"
        @input="$emit('search', searchQuery)"
        type="text"
        placeholder="Buscar produtos..."
        class="bg-white text-black px-3 py-2 rounded-md w-64"
      />
      
      <router-link to="/carrinho" class="relative">
        <div class="p-2 hover:bg-purple-700 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        
        <div 
          v-if="cartItemCount > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
        >
          {{ cartItemCount }}
        </div>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useCart } from '../composables/useCart'

const searchQuery = ref("")
const { cartItemCount, loadCart } = useCart()

loadCart()
defineEmits(['search'])
</script>
