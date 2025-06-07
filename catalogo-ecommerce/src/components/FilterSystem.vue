<template>
  <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
    <div class="flex flex-col lg:flex-row gap-6">
      
      <!-- Filtros por Categoria -->
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Categorias</h3>
        <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          <button
            v-for="category in categories"
            :key="category.slug"
            @click="toggleCategory(category.slug)"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm',
              selectedCategories.includes(category.slug)
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ category.name }}
          </button>
        </div>
        <button
          v-if="selectedCategories.length > 0"
          @click="clearCategories"
          class="mt-2 text-sm text-purple-600 hover:text-purple-800 font-medium"
        >
          Limpar categorias
        </button>
      </div>

      <!-- Filtros por Preço -->
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Faixa de Preço</h3>
        <div class="space-y-3">
          <div class="flex gap-3">
            <div class="flex-1">
              <label class="block text-sm text-gray-600 mb-1">Preço mínimo</label>
              <input
                v-model.number="priceRange.min"
                type="number"
                min="0"
                placeholder="R$ 0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm text-gray-600 mb-1">Preço máximo</label>
              <input
                v-model.number="priceRange.max"
                type="number"
                min="0"
                placeholder="R$ 1000"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="range in priceRanges"
              :key="range.label"
              @click="setPriceRange(range.min, range.max)"
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm"
            >
              {{ range.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Filtros por Avaliação -->
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Avaliação Mínima</h3>
        <div class="space-y-2">
          <div
            v-for="rating in [5, 4, 3, 2, 1]"
            :key="rating"
            class="flex items-center gap-2"
          >
            <input
              :id="`rating-${rating}`"
              v-model="selectedRating"
              :value="rating"
              type="radio"
              name="rating"
              class="text-purple-600 focus:ring-purple-500"
            />
            <label :for="`rating-${rating}`" class="flex items-center gap-1 cursor-pointer">
              <StarRating :rating="rating" :show-text="false" />
              <span class="text-sm text-gray-600">e acima</span>
            </label>
          </div>
          <button
            v-if="selectedRating"
            @click="selectedRating = null"
            class="text-sm text-purple-600 hover:text-purple-800 font-medium"
          >
            Limpar avaliação
          </button>
        </div>
      </div>

      <!-- Ordenação -->
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Ordenar por</h3>
        <select 
          v-model="sortOption"
          class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200 shadow-md font-medium"
        >
          <option value="" class="bg-white text-gray-800">Padrão</option>
          <option value="name-asc" class="bg-white text-gray-800">Nome: A → Z</option>
          <option value="name-desc" class="bg-white text-gray-800">Nome: Z → A</option>
          <option value="price-asc" class="bg-white text-gray-800">Preço: Menor → Maior</option>
          <option value="price-desc" class="bg-white text-gray-800">Preço: Maior → Menor</option>
          <option value="rating-desc" class="bg-white text-gray-800">Melhor Avaliação</option>
        </select>
      </div>
    </div>

    <!-- Filtros Ativos -->
    <div v-if="hasActiveFilters" class="mt-6 pt-4 border-t border-gray-200">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-medium text-gray-700">Filtros ativos:</span>
        
        <!-- Categorias ativas -->
        <span
          v-for="category in selectedCategories"
          :key="`active-${category}`"
          class="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
        >
          {{ getCategoryName(category) }}
          <button @click="toggleCategory(category)" class="hover:text-purple-900">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </span>

        <!-- Faixa de preço ativa -->
        <span
          v-if="priceRange.min || priceRange.max"
          class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
        >
          R$ {{ priceRange.min || 0 }} - R$ {{ priceRange.max || '∞' }}
          <button @click="clearPriceRange" class="hover:text-green-900">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </span>

        <!-- Avaliação ativa -->
        <span
          v-if="selectedRating"
          class="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium"
        >
          {{ selectedRating }}+ estrelas
          <button @click="selectedRating = null" class="hover:text-yellow-900">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </span>

        <!-- Ordenação ativa -->
        <span
          v-if="sortOption"
          class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
        >
          {{ getSortLabel(sortOption) }}
          <button @click="sortOption = ''" class="hover:text-blue-900">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </span>

        <!-- Botão para limpar todos os filtros -->
        <button
          @click="clearAllFilters"
          class="ml-2 px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-all text-xs font-medium"
        >
          Limpar todos
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import StarRating from './StarRating.vue'

const emit = defineEmits(['filters-change'])

// Estado dos filtros
const categories = ref([])
const selectedCategories = ref([])
const priceRange = ref({ min: null, max: null })
const selectedRating = ref(null)
const sortOption = ref('')

// Faixas de preço predefinidas
const priceRanges = [
  { label: 'Até R$ 50', min: 0, max: 50 },
  { label: 'R$ 50 - R$ 100', min: 50, max: 100 },
  { label: 'R$ 100 - R$ 500', min: 100, max: 500 },
  { label: 'R$ 500+', min: 500, max: null }
]

// Computed para verificar se há filtros ativos
const hasActiveFilters = computed(() => {
  return selectedCategories.value.length > 0 ||
         priceRange.value.min ||
         priceRange.value.max ||
         selectedRating.value ||
         sortOption.value
})

// Carregar categorias
onMounted(async () => {
  try {
    const res = await axios.get('https://dummyjson.com/products/categories')
    categories.value = res.data
  } catch (err) {
    console.error('Erro ao carregar categorias:', err)
  }
})

// Funções de manipulação de filtros
const toggleCategory = (categorySlug) => {
  const index = selectedCategories.value.indexOf(categorySlug)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(categorySlug)
  }
}

const clearCategories = () => {
  selectedCategories.value = []
}

const setPriceRange = (min, max) => {
  priceRange.value = { min, max }
}

const clearPriceRange = () => {
  priceRange.value = { min: null, max: null }
}

const clearAllFilters = () => {
  selectedCategories.value = []
  priceRange.value = { min: null, max: null }
  selectedRating.value = null
  sortOption.value = ''
}

// Funções auxiliares
const getCategoryName = (slug) => {
  const category = categories.value.find(cat => cat.slug === slug)
  return category ? category.name : slug
}

const getSortLabel = (sortValue) => {
  const labels = {
    'name-asc': 'Nome A→Z',
    'name-desc': 'Nome Z→A',
    'price-asc': 'Preço ↑',
    'price-desc': 'Preço ↓',
    'rating-desc': 'Melhor Avaliação'
  }
  return labels[sortValue] || 'Ordenado'
}

// Emitir mudanças nos filtros
const emitFilters = () => {
  emit('filters-change', {
    categories: selectedCategories.value,
    priceRange: priceRange.value,
    rating: selectedRating.value,
    sort: sortOption.value
  })
}

// Watchers para emitir mudanças
watch([selectedCategories, priceRange, selectedRating, sortOption], emitFilters, { deep: true })
</script>
