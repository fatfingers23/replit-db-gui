import { createRouter, createWebHistory } from 'vue-router';
import DatabaseEnter from '@/components/DatabaseEnter.vue';
import store from '@/store';




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),

    },
    {
      path: '/view/:id',
      name: 'db-view',
      component: () => import('@/views/DatabaseCRUDView.vue'),
    },
    {
      path: '/databases/list',
      name: 'db-list',
      component: () => import('@/views/DatabasesView.vue'),
      meta:{ requiresAuth: true}
    },
    {
      path: '/databases/backups/:id',
      name: 'db-backups',
      component: () => import('@/views/BackupsList.vue'),
      meta:{ requiresAuth: true}
    }
  ]
});

router.beforeEach(async (to, from) => {
  if(!store.loggedIn){
    try {
      await store.checkLogin();
    }catch (e: unknown){
      console.log('not able to check for login');
    }
  }

  if(to.meta.requiresAuth){

    if(!store.loggedIn){
      return {name:'home'};
    }
    return store.loggedIn;
  }

  if(to.name === 'home' && store.loggedIn){
    return {name: 'db-list'};
  }
  return true;
});

export default router;
