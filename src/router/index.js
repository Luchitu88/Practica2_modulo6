import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Vehiculos from '@/views/Vehiculos.vue'
import Servicios from '@/views/Servicios.vue'


const routes = [
  {path: '/vehiculos', name: 'Vehiculos', component: Vehiculos},
  {path: '/servicios', name: 'Servicios', component: Servicios},
  {path: '/', name: 'home', component: HomeView},
  {path: '/about', name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router