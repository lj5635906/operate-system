import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/home',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/admin',
                    component: resolve => require(['../components/page/SysManageAdmin.vue'], resolve),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/menu',
                    component: resolve => require(['../components/page/SysManageMenu.vue'], resolve),
                    meta: { title: '菜单管理' }
                },
                {
                    path: '/role',
                    component: resolve => require(['../components/page/SysManageRole.vue'], resolve),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/zipkin',
                    component: resolve => require(['../components/page/Zipkin.vue'], resolve),
                    meta: { title: '链路追踪' }
                },
                {
                    path: '/eureka',
                    component: resolve => require(['../components/page/Eureka.vue'], resolve),
                    meta: { title: '注册中心' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
