<template>
  <div class="flex items-center gap-1">
    <div class="flex">
      <svg
        v-for="star in 5"
        :key="star"
        class="w-5 h-5"
        :class="star <= Math.floor(rating) ? 'text-yellow-400' : star === Math.ceil(rating) && rating % 1 !== 0 ? 'text-yellow-300' : 'text-gray-300'"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </div>
    
    <span v-if="showText !== false" class="text-sm text-gray-600 ml-1">{{ rating.toFixed(1) }}/5</span>
    <span v-if="reviewCount && showText !== false" class="text-xs text-gray-500 ml-1">({{ reviewCount }} avaliações)</span>
  </div>
</template>

<script setup>
defineProps({
  rating: { type: Number, required: true, default: 0 },
  reviewCount: { type: Number, default: null },
  showText: { type: Boolean, default: true }
})
</script>
