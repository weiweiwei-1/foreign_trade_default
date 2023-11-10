import { createRouter, createWebHistory } from 'vue-router'
const Market = () => import('@/views/content/market/Market.vue');
const Message = () => import('@/views/content/message/Message.vue');
const Quote = () => import('@/views/content/quote/Quote.vue');
const Friend = () => import('@/views/content/friend/Friend.vue');
const Suggestion = () => import('@/views/content/suggestions/Suggestion.vue');
const routes = [
    //主路由
    {
        path: '',
        name: 'DefaultHome',
        component: Market
    },
    {
        path: '/',
        name: 'Home',
        component: Market,
    },
    {
        path: '/market',
        name: 'Market',
        component: Market,
    },
    //消息路由
    {
        path: '/message',
        name: 'Message',
        component: Message,
    },

    //报价路由
    {
        path: '/quote',
        name: 'Quote',
        component: Quote,
    },

    //好友路由
    {
        path: '/friend',
        name: 'Friend',
        component: Friend,
    },

    //建议路由
    {
        path: '/suggestion',
        name: 'Suggestion',
        component: Suggestion,
    }
];

const router = createRouter({
   history: createWebHistory(process.env.BASE_URL),
   // history: createWebHistory(),
   routes
});

export default router
