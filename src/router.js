import { createRouter, createWebHistory } from 'vue-router'


// Компоненты страниц
import ChatPage from './views/ChatPage.vue';
import UserPage from './views/UserPage.vue';
import ChatEditPage from './views/ChatEditPage.vue';


export default createRouter({
    // История переходов сохраняется
    history: createWebHistory(),


    // Роуты и компоненты
    routes: [
        {
            path: '/',
            name: 'main',
            component: ChatPage,
        },
        {
            path: '/:chat',
            name: 'chat',
            component: ChatPage,
        },
        {
            path: '/add/',
            name: 'addChat',
            component: ChatEditPage,
        },
        {
            path: '/edit/:chat',
            name: 'editChat',
            component: ChatEditPage,
        },
        {
            path: '/user',
            name: 'profile',
            component: UserPage,
        },
    ]
})