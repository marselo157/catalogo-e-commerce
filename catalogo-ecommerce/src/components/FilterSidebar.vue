<template>
  <div class="bg-white rounded-lg shadow-lg p-6 lg:sticky lg:top-24">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-800 mb-2">Filtros</h2>
      <p class="text-sm text-gray-600">{{ totalProducts }} produtos</p>
    </div>

    <!-- Categorias -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Categorias</h3>
      <div class="space-y-2 max-h-64 overflow-y-auto">
        <label
          v-for="category in categoriesWithCount"
          :key="category.name"
          class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <input
            type="checkbox"
            :value="category.name"
            v-model="selectedCategories"
            class="text-purple-600 focus:ring-purple-500 rounded"
          />
          <span class="text-sm text-gray-700 capitalize flex-1">{{ category.displayName }}</span>
          <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{{ category.count }}</span>
        </label>
      </div>
      <button
        v-if="selectedCategories.length > 0"
        @click="selectedCategories = []"
        class="mt-3 text-sm text-purple-600 hover:text-purple-800 font-medium"
      >
        Limpar categorias
      </button>
    </div>

    <!-- Preço -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Preço</h3>
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-2">
          <input
            v-model.number="priceRange.min"
            type="number"
            min="0"
            placeholder="R$ 0"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <input
            v-model.number="priceRange.max"
            type="number"
            min="0"
            placeholder="R$ 1000"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>
        
        <div class="space-y-1">
          <button
            v-for="range in priceRanges"
            :key="range.label"
            @click="priceRange = { min: range.min, max: range.max }"
            class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            {{ range.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Avaliação -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Avaliação</h3>
      <div class="space-y-2">
        <label
          v-for="rating in [5, 4, 3, 2, 1]"
          :key="rating"
          class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <input
            v-model="selectedRating"
            :value="rating"
            type="radio"
            name="rating"
            class="text-purple-600 focus:ring-purple-500"
          />
          <StarRating :rating="rating" :show-text="false" />
          <span class="text-sm text-gray-600">e acima</span>
        </label>
        <button
          v-if="selectedRating"
          @click="selectedRating = null"
          class="text-sm text-purple-600 hover:text-purple-800 font-medium ml-2"
        >
          Limpar avaliação
        </button>
      </div>
    </div>

    <!-- Ordenação -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Ordenar por</h3>
      <select 
        v-model="sortOption"
        class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200 shadow-md font-medium text-sm"
      >
        <option value="" class="bg-white text-gray-800">Padrão</option>
        <option value="name-asc" class="bg-white text-gray-800">Nome: A → Z</option>
        <option value="name-desc" class="bg-white text-gray-800">Nome: Z → A</option>
        <option value="price-asc" class="bg-white text-gray-800">Preço: Menor → Maior</option>
        <option value="price-desc" class="bg-white text-gray-800">Preço: Maior → Menor</option>
        <option value="rating-desc" class="bg-white text-gray-800">Melhor Avaliação</option>
      </select>
    </div>

    <!-- Limpar filtros -->
    <div v-if="hasActiveFilters">
      <button
        @click="clearAllFilters"
        class="w-full px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-all text-sm font-medium"
      >
        Limpar todos os filtros
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import StarRating from './StarRating.vue'

const props = defineProps({
  totalProducts: { type: Number, default: 0 },
  allProducts: { type: Array, default: () => [] }
})

const emit = defineEmits(['filters-change'])

const selectedCategories = ref([])
const priceRange = ref({ min: null, max: null })
const selectedRating = ref(null)
const sortOption = ref('')

const priceRanges = [
  { label: 'Até R$ 50', min: 0, max: 50 },
  { label: 'R$ 50 - R$ 100', min: 50, max: 100 },
  { label: 'R$ 100 - R$ 500', min: 100, max: 500 },
  { label: 'R$ 500 - R$ 1000', min: 500, max: 1000 },
  { label: 'Acima de R$ 1000', min: 1000, max: null }
]

const categoriesWithCount = computed(() => {
  if (!props.allProducts.length) return []
  
  const categoryMap = new Map()
  props.allProducts.forEach(product => {
    const category = product.category
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
  })
  
  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({
      name,
      displayName: name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      count
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
})

const hasActiveFilters = computed(() => 
  selectedCategories.value.length > 0 || priceRange.value.min || priceRange.value.max || selectedRating.value || sortOption.value
)

const clearAllFilters = () => {
  selectedCategories.value = []
  priceRange.value = { min: null, max: null }
  selectedRating.value = null
  sortOption.value = ''
}

const emitFilters = () => emit('filters-change', {
  categories: selectedCategories.value,
  priceRange: priceRange.value,
  rating: selectedRating.value,
  sort: sortOption.value
})

watch([selectedCategories, priceRange, selectedRating, sortOption], emitFilters, { deep: true })
</script>
