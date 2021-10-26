import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    beforeEnter: guard
  },
  {
    path: '/signUp',
    name: 'Registro',
    beforeEnter: antiGuard,
    component: () => import(/* webpackChunkName: "SignUp" */ '../views/SignUp.vue')
  },
  {
    path: '/',
    name: 'Inicio de sesión',
    beforeEnter: antiGuard,
    component: () => import(/* webpackChunkName: "SignIn" */ '../views/SignIn.vue')
  },
  {
    path: '/room',
    name: 'Opciones de sala',
    beforeEnter: guard,
    component: () => import(/* webpackChunkName: "Room" */ '../views/Room.vue')
  },
  {
    path: '/addPartner',
    name: 'Añadir usuario',
    beforeEnter: guard,
    component: () => import(/* webpackChunkName: "AddPartner" */ '../views/AddPartner.vue')
  }
]

function guard(to, from, next) {
  if(store.state.user.id){
    next()
  } else {
    next('/')
  }
}

function antiGuard(to, from, next) {
  if(store.state.user.id){
    next('/home')
  } else {
    next()
  }
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
