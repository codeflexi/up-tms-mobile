import { useUserStore } from '../stores/user-store'

const routes = [
  {
    path: '/',
    beforeEnter: (to, from, next) => {
      to.fullPath === '/' ? next('/account') : next()
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/pickup',
        component: () => import('pages/PickupPage.vue'),
        children: [
          {
            path: '',
            component: () => import('pages/pickup/SelectPickup.vue')
          },
          {
            path: 'add-pickup',
            component: () => import('pages/pickup/AddPickup.vue')
          }
        ]
      },
      {
        path: '/direct',
        component: () => import('pages/PickupPage.vue'),
        children: [
          {
            path: '',
            // component: () => import('components/directPuckupPage/SInfo.vue')
            component: () => import('pages/direct/ListDirectPickup.vue')
          },
          {
            path: 'add-direct/:id',
            component: () => import('pages/direct/AddDirectPickup.vue')
            // component: () => import('pages/pickup/AddCamera1.vue')
          }
        ]
      },
      {
        path: '/pick',
        component: () => import('pages/PickupPage.vue'),
        children: [
          {
            path: '',
            // component: () => import('components/directPuckupPage/SInfo.vue')
            component: () => import('pages/pick/ListPickup.vue')
          },
          {
            path: 'add-pick/:id',
            component: () => import('pages/pick/AddPickup.vue')
            // component: () => import('pages/pickup/AddCamera1.vue')
          }
        ]
      },
      {
        path: '/load',
        component: () => import('pages/PickupPage.vue'),
        children: [
          {
            path: '',
            // component: () => import('components/directPuckupPage/SInfo.vue')
            component: () => import('src/pages/load/ListLoading.vue')
          },
          {
            path: 'add-load/:id',
            component: () => import('pages/load/AddLoading.vue')
            // component: () => import('pages/pickup/AddCamera1.vue')
          }
        ]
      },
      {
        path: '/dispatch',
        component: () => import('pages/DispatchPage.vue'),
        children: [
          {
            path: '',
            // component: () => import('components/directPuckupPage/SInfo.vue')
            component: () => import('pages/dispatch/ListDispatch.vue')
          },
          {
            path: 'add-dispatch/:id',
            component: () => import('pages/dispatch/AddDispatch.vue')
            // component: () => import('pages/pickup/AddCamera1.vue')
          },
          {
            path: 'un-dispatch/:id',
            component: () => import('pages/dispatch/UnDispatch.vue')
            // component: () => import('pages/pickup/AddCamera1.vue')
          }
        ]
      },
      {
        path: '/auth',
        beforeEnter: (to, from, next) => {
          const userStore = useUserStore()
          !userStore.email ? next() : next(from.fullPath)
        },
        component: () => import('pages/AuthPage.vue'),
        children: [
          { path: '', component: () => import('pages/auth/LoginSection.vue') },
          { path: 'register', component: () => import('pages/auth/RegisterSection.vue') }
        ]
      },
      {
        path: '/account',
        component: () => import('pages/AccountPage.vue'),
        children: [
          { path: '', component: () => import('pages/account/AccountMenu.vue') },
          { path: 'my-details', component: () => import('pages/account/MyDetails.vue') }
        ]
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
