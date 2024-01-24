import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/Start.vue')
        },
        {
          path: '/control',
          name: 'control',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/GisControl.vue')
        },
        {
            path: '/start',
            name: 'start',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/Start.vue')
        }, {
            path: '/util',
            name: 'util',
            component: () => import('../views/Util.vue')
        }, {
            path: '/help',
            name: 'help',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/HelpView.vue')
        }, {
            path: '/about',
            name: 'about',
            component: HomeView
        },
    ]
})

export default router
