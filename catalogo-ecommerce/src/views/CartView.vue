<template>
  <div class="max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-white">Carrinho de Compras</h1>

    <div v-if="cartItems.length === 0" class="bg-white p-8 rounded-lg shadow text-center">
      <div class="text-6xl mb-4">🛒</div>
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">Seu carrinho está vazio</h2>
      <p class="text-gray-600 mb-6">Adicione produtos ao seu carrinho para continuar comprando.</p>
      <router-link 
        to="/" 
        class="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium"
      >
        Continuar Comprando
      </router-link>
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="grid grid-cols-12 bg-gray-100 p-4 text-sm font-medium text-gray-700">
            <div class="col-span-6">Produto</div>
            <div class="col-span-2 text-center">Preço</div>
            <div class="col-span-2 text-center">Quantidade</div>
            <div class="col-span-2 text-center">Subtotal</div>
          </div>
          
          <div v-for="item in cartItems" :key="item.id" class="grid grid-cols-12 p-4 border-b items-center">
            <div class="col-span-6 flex items-center gap-3">
              <img :src="item.thumbnail" :alt="item.title" class="w-16 h-16 object-contain rounded" />
              <div>
                <h3 class="font-medium text-gray-800">{{ item.title }}</h3>
                <p class="text-sm text-gray-500">{{ item.category }}</p>
              </div>
            </div>
            
            <div class="col-span-2 text-center text-green-600 font-medium">
              R$ {{ item.price.toFixed(2) }}
            </div>
            
            <div class="col-span-2 flex justify-center">
              <div class="flex border rounded">
                <button 
                  @click="updateQuantity(item.id, item.quantity - 1)"
                  class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  :disabled="item.quantity <= 1"
                  :class="{ 'opacity-50 cursor-not-allowed': item.quantity <= 1 }"
                >
                  -
                </button>
                <span class="px-4 py-1 text-gray-800 bg-white border-l border-r">{{ item.quantity }}</span>
                <button 
                  @click="updateQuantity(item.id, item.quantity + 1)"
                  class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                >
                  +
                </button>
              </div>
            </div>
            
            <div class="col-span-2 text-center">
              <div class="font-medium text-gray-800 mb-2">R$ {{ (item.price * item.quantity).toFixed(2) }}</div>
              <button 
                @click="removeFromCart(item.id)"
                class="text-red-500 text-sm hover:text-red-700 font-medium"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
        
        <div class="mt-4 text-right">
          <button 
            @click="clearCart"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Limpar Carrinho
          </button>
        </div>
      </div>
      
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-bold mb-4 text-gray-800">Resumo do Pedido</h2>
          
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-gray-700">
              <span>Itens ({{ cartItemCount }})</span>
              <span>{{ cartItemCount }} {{ cartItemCount === 1 ? 'produto' : 'produtos' }}</span>
            </div>
            <div class="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>R$ {{ cartSubtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-700">
              <span>Frete</span>
              <span>R$ 10,00</span>
            </div>
            <div class="border-t pt-3 font-bold flex justify-between text-gray-800 text-lg">
              <span>Total</span>
              <span>R$ {{ (cartSubtotal + 10).toFixed(2) }}</span>
            </div>
          </div>
          
          <button class="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium mb-4">
            Finalizar Compra
          </button>
          
          <div class="text-center">
            <router-link to="/" class="text-purple-600 hover:text-purple-800 text-sm">
              ← Continuar Comprando
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCart } from '../composables/useCart'

const { cartItems, removeFromCart, updateQuantity, clearCart, cartSubtotal, cartItemCount, loadCart } = useCart()

onMounted(loadCart)
</script>
