<template>
  <div class="flex-1">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-white mb-4">
        Produtos
        <span v-if="filteredProducts.length > 0" class="text-lg text-gray-300">({{ filteredProducts.length }})</span>
      </h1>

      <!-- Filtros Ativos -->
      <div v-if="hasActiveFilters" class="bg-white rounded-lg p-4">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-sm font-medium text-gray-700">Filtros ativos:</span>
          
          <span
            v-for="category in filters.categories"
            :key="category"
            class="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
          >
            {{ formatCategoryName(category) }}
            <button @click="$emit('remove-category', category)" class="hover:text-purple-900">×</button>
          </span>

          <span
            v-if="filters.priceRange.min || filters.priceRange.max"
            class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
          >
            R$ {{ filters.priceRange.min || 0 }} - R$ {{ filters.priceRange.max || '∞' }}
            <button @click="$emit('clear-price')" class="hover:text-green-900">×</button>
          </span>

          <span
            v-if="filters.rating"
            class="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium"
          >
            {{ filters.rating }}+ estrelas
            <button @click="$emit('clear-rating')" class="hover:text-yellow-900">×</button>
          </span>
        </div>
      </div>
    </div>

    <!-- Grid de Produtos -->
    <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center text-center group relative"
      >
        <img :src="product.thumbnail" :alt="product.title" class="w-full h-40 object-contain mb-3" />
        <h2 class="text-lg font-semibold text-gray-800 mb-2 h-12 overflow-hidden">{{ product.title }}</h2>
        <p class="text-green-600 font-bold text-xl mb-2">R$ {{ product.price.toFixed(2) }}</p>
        
        <div v-if="product.rating" class="mb-2">
          <StarRating :rating="product.rating" />
        </div>

        <p class="text-sm text-gray-500 mb-4 capitalize">{{ formatCategoryName(product.category) }}</p>

        <div class="flex gap-2 w-full mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            @click="openModal(product.id)"
            class="flex-1 bg-purple-100 text-purple-700 py-2 px-3 rounded-lg hover:bg-purple-200 transition text-sm font-medium"
          >
            Preview
          </button>
          <router-link
            :to="`/produto/${product.id}`"
            class="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition text-sm font-medium text-center"
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
    <div v-if="filteredProducts.length > productsPerPage" class="flex justify-center items-center gap-4 mt-8">
      <button
        class="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        ← Anterior
      </button>
      
      <span class="flex items-center px-4 py-3 text-white font-medium bg-gray-800 rounded-lg">
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

    <ProductModal :isOpen="modalOpen" :productId="selectedProductId" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import StarRating from './StarRating.vue'
import ProductModal from './ProductModal.vue'

const props = defineProps({
  searchTerm: String,
  filters: { type: Object, default: () => ({ categories: [], priceRange: { min: null, max: null }, rating: null, sort: '' }) },
  allProducts: { type: Array, default: () => [] }
})

defineEmits(['clear-price', 'clear-rating', 'remove-category'])

const currentPage = ref(1)
const productsPerPage = 12
const modalOpen = ref(false)
const selectedProductId = ref(null)

const formatCategoryName = (categoryName) => 
  categoryName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

const hasActiveFilters = computed(() => 
  props.filters.categories.length > 0 || props.filters.priceRange.min || props.filters.priceRange.max || 
  props.filters.rating || props.filters.sort || (props.searchTerm && props.searchTerm.length > 0)
)

const filteredProducts = computed(() => {
  let products = [...props.allProducts]

  if (props.searchTerm?.length > 0) {
    const term = props.searchTerm.toLowerCase()
    products = products.filter(product =>
      product.title.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    )
  }

  if (props.filters.categories.length > 0) {
    products = products.filter(product => props.filters.categories.includes(product.category))
  }

  if (props.filters.priceRange.min !== null) {
    products = products.filter(product => product.price >= props.filters.priceRange.min)
  }
  if (props.filters.priceRange.max !== null) {
    products = products.filter(product => product.price <= props.filters.priceRange.max)
  }

  if (props.filters.rating) {
    products = products.filter(product => product.rating >= props.filters.rating)
  }

  if (props.filters.sort) {
    const sortMap = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      'name-asc': (a, b) => a.title.localeCompare(b.title),
      'name-desc': (a, b) => b.title.localeCompare(a.title),
      'rating-desc': (a, b) => b.rating - a.rating
    }
    products.sort(sortMap[props.filters.sort])
  }

  return products
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * productsPerPage
  return filteredProducts.value.slice(start, start + productsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / productsPerPage))

const openModal = (productId) => {
  selectedProductId.value = productId
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  selectedProductId.value = null
}

watch(() => props.filters, () => currentPage.value = 1, { deep: true })
watch(() => props.searchTerm, () => currentPage.value = 1)
</script>
