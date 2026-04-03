// src/router/adminRoutes.js
// Rotas administrativas protegidas seguindo Clean Code (< 50 linhas)

// Lazy loading das views admin para performance
const AdminDashboard = () => import('@/views/admin/AdminDashboard.vue')
const AdminLinks = () => import('@/views/admin/AdminLinks.vue')
const AdminFolders = () => import('@/views/admin/AdminFolders.vue')
const AdminAnalytics = () => import('@/views/admin/AdminAnalytics.vue')
const AdminSettings = () => import('@/views/admin/AdminSettings.vue')
const AdminCommands = () => import('@/views/admin/AdminCommands.vue')

/**
 * Guard de autenticação para rotas admin
 * Single Responsibility: Apenas verificar autenticação
 */
const adminAuthGuard = async (to, from, next) => {
  // Verificar token no localStorage
  const token = localStorage.getItem('inkpage_admin_token')
  
  if (!token) {
    next('/admin/login')
    return
  }
  
  try {
    // Validar token mock
    const payload = JSON.parse(window.atob(token.split('.')[1]))
    const now = Date.now() / 1000
    
    if (payload.exp > now) {
      next()
    } else {
      // Token expirado
      localStorage.removeItem('inkpage_admin_token')
      next('/admin/login')
    }
  } catch {
    // Token inválido
    localStorage.removeItem('inkpage_admin_token')
    next('/admin/login')
  }
}

/**
 * Função para criar rotas admin (< 20 linhas)
 */
export const createAdminRoutes = () => {
  return [
    {
      path: '/admin',
      name: 'AdminDashboard',
      component: AdminDashboard,
      beforeEnter: adminAuthGuard,
      meta: { title: 'Dashboard Admin' }
    },
    {
      path: '/admin/links',
      name: 'AdminLinks',
      component: AdminLinks,
      beforeEnter: adminAuthGuard,
      meta: { title: 'Gestão de Links' }
    },
    {
      path: '/admin/folders',
      name: 'AdminFolders',
      component: AdminFolders,
      beforeEnter: adminAuthGuard,
      meta: { title: 'Gestão de Pastas' }
    },
    {
      path: '/admin/analytics',
      name: 'AdminAnalytics',
      component: AdminAnalytics,
      beforeEnter: adminAuthGuard,
      meta: { title: 'Analytics Admin' }
    },
    {
      path: '/admin/settings',
      name: 'AdminSettings',
      component: AdminSettings,
      beforeEnter: adminAuthGuard,
      meta: { title: 'Configurações' }
    },
    {
      path: '/admin/commands',
      name: 'AdminCommands',
      component: AdminCommands,
      beforeEnter: adminAuthGuard,
      meta: { title: 'Comandos de Super Usuário' }
    }
  ]
}
