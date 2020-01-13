<template>
    <el-container>
        <el-header class="header">
            <div>微人事</div>
            <el-dropdown @command="commandHandler">
                <span class="user">
                    <img class="userface" :src="user.userface" alt="">{{user.name}}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="my">个人中心</el-dropdown-item>
                    <el-dropdown-item command="setting">设置</el-dropdown-item>
                    <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        <el-container>
            <el-aside class="aside" width="200px">
                <el-menu router unique-opened v-for="(item, index) in this.$router.options.routes" :key="index+10">
                    <el-submenu :index="index.toString()" v-if="!item.hidden">
                        <template slot="title">
                            <i :class="item.iconcls" style="color: blueviolet; margin-right: 5px;"></i>
                            <span>{{item.name}}</span>
                        </template>
                        <el-menu-item :index="child.path" v-for="child in item.children" :key="child.path">
                            {{child.name}}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
                <el-menu router unique-opened v-for="(item, index) in routes" :key="index">
                    <el-submenu :index="index.toString()" v-if="!item.hidden">
                        <template slot="title">
                            <i :class="item.iconcls" style="color: blueviolet; margin-right: 5px;"></i>
                            <span>{{item.name}}</span>
                        </template>
                        <el-menu-item :index="child.path" v-for="child in item.children" :key="child.path">
                            {{child.name}}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <el-breadcrumb separator="/" v-if="this.$router.currentRoute.path!=='/home'">
                    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
                    <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                    <el-breadcrumb-item>活动详情</el-breadcrumb-item>
                </el-breadcrumb>
                <div v-else>微人事首页</div>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import {getRequest} from "../utils/api";

    export default {
        name: "Home",
        data() {
            return {
                user: JSON.parse(window.sessionStorage.getItem('user')),
                opens: []
            }
        },
        methods: {
            commandHandler(cmd) {
                let _this = this;
                if (cmd === 'logout') {
                    _this.$confirm('点击确定退出登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        getRequest('/logout');
                        window.sessionStorage.removeItem('user');
                        _this.$store.state.commit('initMenu', []);
                        _this.$router.replace('/');
                    }).catch(() => {
                        _this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                }
            }
        },
        computed: {
            routes() {
                return this.$store.state.routes;
            }
        }
    }
</script>

<style>
    .header {
        background-color: #5394ec;
        color: #eee;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .user {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .userface {
        width: 32px;
        height: 32px;
        -webkit-border-radius: 16px;
        -moz-border-radius: 16px;
        border-radius: 16px;
        margin-right: 10px;
    }

    .aside {
        height: 100%;
    }
</style>