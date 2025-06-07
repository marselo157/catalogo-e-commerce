<template>
  <div class="flex flex-col lg:flex-row gap-6">
    <div class="w-full lg:w-80 lg:flex-shrink-0">
      <FilterSidebar 
        :total-products="allProducts.length"
        :all-products="allProducts"
        @filters-change="activeFilters = $event"
      />
    </div>

    <ProductGrid
      :search-term="searchTerm"
      :filters="activeFilters"
      :all-products="allProducts"
      @clear-price="activeFilters.priceRange = { min: null, max: null }"
      @clear-rating="activeFilters.rating = null"
      @remove-category="removeCategory"
    />
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import axios from 'axios'
import FilterSidebar from '../components/FilterSidebar.vue'
import ProductGrid from '../components/ProductGrid.vue'

const searchTerm = inject('searchTerm')
const allProducts = ref([])
const activeFilters = ref({
  categories: [],
  priceRange: { min: null, max: null },
  rating: null,
  sort: ''
})

onMounted(async () => {
  try {
    const { data } = await axios.get('https://dummyjson.com/products?limit=0')
    allProducts.value = data.products
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
  }
})

const removeCategory = (categoryName) => {
  const index = activeFilters.value.categories.indexOf(categoryName)
  if (index > -1) activeFilters.value.categories.splice(index, 1)
}
</script>
