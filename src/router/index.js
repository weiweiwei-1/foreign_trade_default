import { createRouter, createWebHistory } from 'vue-router'
const Market = () => import('views/content/market/Market.vue');
const Message = () => import('views/content/message/Message.vue');
const Quote = () => import('views/content/quote/Quote.vue');
const Friend = () => import('views/content/friend/Friend.vue');
const Suggestion = () => import('views/content/suggestions/Suggestion.vue');
const MessageContent = () => import('views/content/message/MessageContent.vue');
const BlankContent = () => import('views/content/message/BlankContent.vue');
const QuoteDetail = () => import('views/content/quote/QuoteDetail.vue');
const QuoteDetailDefault = () => import('views/content/quote/QuoteDetailDefault.vue');

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
        path: '/fa/market',
        name: 'Market',
        component: Market,
    },
    //消息路由
    {
        path: '/fa/message',
        name: 'Messsage',
        component: Message,
        children: [
            {
                path: '',
                component: BlankContent
            },
            {
                path: ':ftsid',
                component: MessageContent
            }

        ]
    },

    //报价路由
    {
        path: '/fa/quote',
        name: 'Quote',
        component: Quote,
        children: [
            {
                path: '',
                component: QuoteDetailDefault
            },

            {
                path: ':productId',
                component: QuoteDetail
            }
        ]
    },
    {
        path: '/fa/friend',
        name: 'Friend',
        component: Friend,
    },
    {
        path: '/fa/suggestion',
        name: 'Suggestion',
        component: Suggestion,
    }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router
