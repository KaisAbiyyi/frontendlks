import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      component: () => import('@/views/index.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/',
      alias: '/admin',
      component: () => import('@/views/admin/index.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      component: () => import('@/views/auth/login.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(e => e.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
