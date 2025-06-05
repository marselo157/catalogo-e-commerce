import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/produto/:id',
    name: 'Produto',
    component: () => import('../views/ProductView.vue')
  },
  {
    path: '/carrinho',
    name: 'Carrinho',
    component: () => import('../views/CartView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router