<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    import api from "../../fetch/Api";

    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-menu',
                        index: 'home',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-setting',
                        index: '1',
                        title: '系统管理',
                        subs: [
                            {
                                index: 'admin',
                                title: '用户管理'
                            },
                            {
                                index: 'menu',
                                title: '菜单管理'
                            },
                            {
                                index: 'role',
                                title: '角色管理'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-view',
                        index: '2',
                        title: '系统监控',
                        subs: [
                            {
                                index: 'api',
                                title: '接口文档'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-edit-outline',
                        index: '3',
                        title: '开发商管理',
                        subs: [
                            {
                                index: 'developer',
                                title: '开发商列表'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-edit-outline',
                        index: '4',
                        title: '开发商管理',
                        subs: [
                            {
                                index: 'distributor',
                                title: '分销商列表'
                            }
                        ]
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created: function(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
            let account = localStorage.getItem('account');
            api.getAuthorizationByAccount(account)
                .then(result => {
                    this.items = result;
                }).catch(error => {

            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
