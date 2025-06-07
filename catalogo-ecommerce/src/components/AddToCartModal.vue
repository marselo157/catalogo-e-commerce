<template>
  <!-- Overlay do Modal -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click="$emit('close')"
  >
    <!-- Conteúdo do Modal -->
    <div 
      class="bg-white rounded-lg max-w-md w-full shadow-2xl"
      @click.stop
    >
      <!-- Header do Modal -->
      <div class="p-6 text-center border-b">
        <h2 class="text-xl font-bold text-gray-800 mb-2">Produto Adicionado!</h2>
        <p class="text-gray-600">O produto foi adicionado ao seu carrinho.</p>
      </div>

      <!-- Produto Adicionado -->
 
      <div v-if="product" class="p-4 bg-gray-50">
        <div class="flex items-center gap-3">
          <img 
            :src="product.thumbnail" 
            :alt="product.title"
            class="w-16 h-16 object-contain rounded"
          />
          <div class="flex-1">
            <h3 class="font-medium text-gray-800">{{ product.title }}</h3>
            <p class="text-green-600 font-bold">R$ {{ product.price.toFixed(2) }}</p>
            <p class="text-sm text-gray-500">Quantidade: 1</p>
          </div>
        </div>
      </div>

      Resumo do Carrinho
      <div class="p-4 bg-purple-50 border-t border-b">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Itens no carrinho:</span>
          <span class="font-medium text-gray-800">{{ cartItemCount }} {{ cartItemCount === 1 ? 'produto' : 'produtos' }}</span>
        </div>
        <div class="flex justify-between text-sm mt-1">
          <span class="text-gray-600">Total do carrinho:</span>
          <span class="font-bold text-purple-600">R$ {{ cartSubtotal.toFixed(2) }}</span>
        </div>
      </div>


      <!-- Botões de Ação -->
      <div class="p-6">
        <div class="flex gap-3">
          <button 
            @click="goToCart"
            class="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium"
          >
            Ver Carrinho
          </button>
          <button 
            @click="$emit('close')"
            class="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all font-medium"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: Boolean
  },
  methods: {
    goToCart() {
      this.$router.push('/carrinho');
      this.$emit('close');
    }
  }
}
</script>
