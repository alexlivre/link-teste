// main.js
// Ponto de entrada da aplicação Vue.js seguindo Clean Code

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/styles.css'

// Importações de views (lazy loading para performance)
const Home = () => import('./views/Home.vue')
const WhatsApp = () => import('./views/WhatsApp.vue')
const LinkShortener = () => import('./views/LinkShortener.vue')
const FolderManager = () => import('./views/FolderManager.vue')
const AdminLogin = () => import('./views/admin/AdminLogin.vue')

// Importação de rotas admin
import { createAdminRoutes } from './router/adminRoutes.js'

// Função pequena para criar rotas (< 20 linhas)
const createRoutes = () => {
  const publicRoutes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/whatsapp', name: 'WhatsApp', component: WhatsApp },
    { path: '/encurtar', name: 'LinkShortener', component: LinkShortener },
    { path: '/pasta', name: 'FolderManager', component: FolderManager },
    { path: '/admin/login', name: 'AdminLogin', component: AdminLogin },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: Home }
  ]
  
  const adminRoutes = createAdminRoutes()
  
  return [...publicRoutes, ...adminRoutes]
}

// Função pequena para criar router (< 20 linhas)
const createRouterInstance = () => {
  return createRouter({
    history: createWebHistory(),
    routes: createRoutes(),
    linkActiveClass: 'text-primary-600 font-semibold'
  })
}

// Função principal de inicialização (< 20 linhas)
const initializeApp = () => {
  const app = createApp(App)
  const router = createRouterInstance()
  
  app.use(router)
  app.mount('#app')
  
  return app
}

// Inicializar aplicação
initializeApp()
