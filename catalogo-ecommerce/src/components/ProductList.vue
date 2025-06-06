<template>
  <div>
    <!-- Grid de Produtos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white p-4 rounded shadow hover:shadow-lg transition"
      >
        <img :src="product.thumbnail" :alt="product.title" class="w-full h-40 object-cover rounded mb-2">
        <h2 class="text-lg font-semibold">{{ product.title }}</h2>
        <p class="text-gray-600">R$ {{ product.price }}</p>
        <p class="text-sm text-gray-500">Categoria: {{ product.category }}</p>
      </div>
    </div>

    <!-- Paginação (oculta se houver busca ou categoria selecionada) -->
    <div v-if="!isSearching && !isFiltering" class="flex justify-center gap-4">
      <button
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        :disabled="page === 1"
        @click="prevPage"
      >
        Anterior
      </button>
      <button
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        :disabled="!hasNextPage"
        @click="nextPage"
      >
        Próxima
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'

// Props recebidas de Home.vue
const props = defineProps({
  searchTerm: String,
  selectedCategory: String
})

// Estado local
const products = ref([])
const page = ref(1)
const limit = 10
const hasNextPage = ref(false)

// Cálculo de modo de busca/filtro
const isSearching = computed(() => props.searchTerm && props.searchTerm.length > 0)
const isFiltering = computed(() => props.selectedCategory && props.selectedCategory.length > 0)

// Função para buscar produtos
const fetchProducts = async () => {
  const skip = (page.value - 1) * limit
  let url = ''

  if (isSearching.value) {
    url = `https://dummyjson.com/products/search?q=${props.searchTerm}`
  } else if (isFiltering.value) {
    url = `https://dummyjson.com/products/category/${props.selectedCategory}`
  } else {
    url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
  }

  try {
    const response = await axios.get(url)
    products.value = response.data.products
    hasNextPage.value = !isSearching.value && !isFiltering.value && (skip + limit < response.data.total)
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
  }
}

// Inicializa e observa mudanças
onMounted(fetchProducts)
watch([() => props.searchTerm, () => props.selectedCategory], () => {
  page.value = 1
  fetchProducts()
})
watch(page, fetchProducts)

// Funções de paginação
const nextPage = () => {
  page.value++
}
const prevPage = () => {
  if (page.value > 1) page.value--
}
</script>




