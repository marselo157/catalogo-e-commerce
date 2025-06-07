<template>
  <div>
    <!-- Contador de produtos -->
    <div v-if="filteredProducts.length > 0" class="mb-4">
      <p class="text-white text-sm">
        Mostrando {{ filteredProducts.length }} produto{{ filteredProducts.length !== 1 ? 's' : '' }}
        <span v-if="hasActiveFilters"> com os filtros aplicados</span>
      </p>
    </div>

    <!-- Grid de Produtos -->
    <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="bg-white p-4 rounded shadow hover:shadow-lg transition flex flex-col items-center text-center group relative"
      >
        <img
          :src="product.thumbnail"
          :alt="product.title"
          class="w-full h-40 object-contain mb-2"
        />
        <h2 class="text-lg font-semibold text-gray-800 mb-2">{{ product.title }}</h2>
        <p class="text-green-600 font-bold mb-2">R$ {{ product.price.toFixed(2) }}</p>

        <!-- Avaliação com estrelas nos cards -->
        <div v-if="product.rating" class="mb-2">
          <StarRating :rating="product.rating" />
        </div>

        <p class="text-sm text-gray-500 mb-4">Categoria: {{ product.category }}</p>

        <!-- Botões de Ação - Visíveis apenas no hover -->
        <div class="flex gap-2 w-full mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            @click="openModal(product.id)"
            class="flex-1 bg-purple-100 text-purple-700 py-2 px-3 rounded hover:bg-purple-200 transition text-sm font-medium"
          >
            Preview
          </button>
          <router-link
            :to="`/produto/${product.id}`"
            class="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200 transition text-sm font-medium text-center"
          >
            Ver Mais
          </router-link>
        </div>
      </div>
    </div>

    <!-- Mensagem quando não há produtos -->
    <div v-else class="bg-white p-8 rounded-lg shadow text-center">
      <div class="text-6xl mb-4">🔍</div>
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">Nenhum produto encontrado</h2>
      <p class="text-gray-600 mb-6">Tente ajustar os filtros ou fazer uma nova busca.</p>
    </div>

    <!-- Paginação -->
    <div v-if="filteredProducts.length > productsPerPage" class="flex justify-center gap-4">
      <button
        class="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        ← Anterior
      </button>
      
      <span class="flex items-center px-4 py-3 text-white font-medium">
        Página {{ currentPage }} de {{ totalPages }}
      </span>
      
      <button
        class="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Próxima →
      </button>
    </div>

    <!-- Modal de Produto -->
    <ProductModal
      :isOpen="modalOpen"
      :productId="selectedProductId"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import StarRating from './StarRating.vue'
import ProductModal from './ProductModal.vue'

// Props
const props = defineProps({
  searchTerm: String,
  filters: {
    type: Object,
    default: () => ({
      categories: [],
      priceRange: { min: null, max: null },
      rating: null,
      sort: ''
    })
  }
})

// Estado
const allProducts = ref([])
const currentPage = ref(1)
const productsPerPage = 12

// Estado do Modal
const modalOpen = ref(false)
const selectedProductId = ref(null)

// Computed para verificar se há filtros ativos
const hasActiveFilters = computed(() => {
  return props.filters.categories.length > 0 ||
         props.filters.priceRange.min ||
         props.filters.priceRange.max ||
         props.filters.rating ||
         props.filters.sort ||
         (props.searchTerm && props.searchTerm.length > 0)
})

// Produtos filtrados
const filteredProducts = computed(() => {
  let products = [...allProducts.value]

  // Filtro por busca
  if (props.searchTerm && props.searchTerm.length > 0) {
    products = products.filter(product =>
      product.title.toLowerCase().includes(props.searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(props.searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(props.searchTerm.toLowerCase())
    )
  }

  // Filtro por categorias
  if (props.filters.categories.length > 0) {
    products = products.filter(product =>
      props.filters.categories.includes(product.category)
    )
  }

  // Filtro por faixa de preço
  if (props.filters.priceRange.min !== null) {
    products = products.filter(product => product.price >= props.filters.priceRange.min)
  }
  if (props.filters.priceRange.max !== null) {
    products = products.filter(product => product.price <= props.filters.priceRange.max)
  }

  // Filtro por avaliação
  if (props.filters.rating) {
    products = products.filter(product => product.rating >= props.filters.rating)
  }

  // Ordenação
  if (props.filters.sort) {
    switch (props.filters.sort) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        products.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        products.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'name-desc':
        products.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'rating-desc':
        products.sort((a, b) => b.rating - a.rating)
        break
    }
  }

  return products
})

// Produtos paginados
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * productsPerPage
  const end = start + productsPerPage
  return filteredProducts.value.slice(start, end)
})

// Total de páginas
const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / productsPerPage)
})

// Funções do Modal
const openModal = (productId) => {
  selectedProductId.value = productId
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  selectedProductId.value = null
}

// Buscar todos os produtos
const fetchAllProducts = async () => {
  try {
    // Buscar todos os produtos (a API permite até 100 por vez)
    const response = await axios.get('https://dummyjson.com/products?limit=100')
    allProducts.value = response.data.products
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
  }
}

// Resetar página quando filtros mudarem
watch(() => props.filters, () => {
  currentPage.value = 1
}, { deep: true })

watch(() => props.searchTerm, () => {
  currentPage.value = 1
})

// Carregar produtos ao montar
onMounted(fetchAllProducts)
</script>
