<template>
  <div class="mb-4">
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <label class="text-white font-medium text-sm">Ordenar por:</label>
      <div class="relative">
        <select 
          v-model="selectedSort"
          @change="$emit('sort-change', selectedSort)"
          class="appearance-none bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 pr-8 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:from-purple-700 focus:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium cursor-pointer min-w-[200px]"
        >
          <option value="" class="bg-white text-gray-800">Padrão</option>
          <optgroup label="Por Nome" class="bg-white text-gray-800">
            <option value="name-asc" class="bg-white text-gray-800">Nome: A → Z</option>
            <option value="name-desc" class="bg-white text-gray-800">Nome: Z → A</option>
          </optgroup>
          <optgroup label="Por Categoria" class="bg-white text-gray-800">
            <option value="category-asc" class="bg-white text-gray-800">Categoria: A → Z</option>
            <option value="category-desc" class="bg-white text-gray-800">Categoria: Z → A</option>
          </optgroup>
          <optgroup label="Por Preço" class="bg-white text-gray-800">
            <option value="price-asc" class="bg-white text-gray-800">Preço: Menor → Maior</option>
            <option value="price-desc" class="bg-white text-gray-800">Preço: Maior → Menor</option>
          </optgroup>
        </select>
        
        <!-- Ícone de seta customizado -->
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      
      <!-- Indicador visual do filtro ativo -->
      <div v-if="selectedSort" class="flex items-center gap-2">
        <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
          {{ getSortLabel(selectedSort) }}
        </span>
        <button 
          @click="clearSort"
          class="text-white hover:text-purple-200 transition-colors"
          title="Limpar ordenação"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedSort = ref('');

const emit = defineEmits(['sort-change']);

const getSortLabel = (sortValue) => {
  const labels = {
    'name-asc': 'Nome A→Z',
    'name-desc': 'Nome Z→A',
    'category-asc': 'Categoria A→Z',
    'category-desc': 'Categoria Z→A',
    'price-asc': 'Preço ↑',
    'price-desc': 'Preço ↓'
  };
  return labels[sortValue] || 'Ordenado';
};

const clearSort = () => {
  selectedSort.value = '';
  emit('sort-change', '');
};
</script>

<style scoped>
/* Estilização customizada para o select */
select option {
  padding: 8px 12px;
}

select optgroup {
  font-weight: bold;
  color: #374151;
  background-color: #f9fafb;
}
</style>
