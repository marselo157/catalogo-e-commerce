<template>
  <div class="p-4">
    <h1 class="text-2xl font-semibold mb-4">Catálogo de Produtos</h1>

    <!-- Campo de busca -->
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Buscar por nome..."
      class="border p-2 rounded mb-4 w-full max-w-md"
    />

    <!-- Menu de categorias -->
    <CategoryMenu @select-category="setCategory" />

    <!-- Lista de produtos -->
    <ProductList
      :searchTerm="searchTerm"
      :selectedCategory="selectedCategory"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProductList from '../components/ProductList.vue'
import CategoryMenu from '../components/CategoryMenu.vue'

const searchTerm = ref('')
const selectedCategory = ref('')

const setCategory = (category) => {
  selectedCategory.value = category
}
</script>

