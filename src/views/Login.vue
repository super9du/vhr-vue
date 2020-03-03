<template>
    <el-form class="login-panel" ref="loginForm" :model="loginForm" :rules="rules">
        <h2 class="my-color">用户登录</h2>
        <el-form-item>
            <hr>
        </el-form-item>
        <el-form-item prop="username">
            <el-input type="text" v-model="loginForm.username" placeholder="请输入账号" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" auto-complete="off"
                      @keypress.enter.native="submitLogin"></el-input>
        </el-form-item>
        <el-checkbox label="记住密码" v-model="loginForm.rememberMe" style="margin: 0 auto 10px"></el-checkbox>
        <el-form-item>
            <el-button style="width: 100%;" type="primary" @click="submitLogin">登录</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {postKvRequest} from "../utils/api";

    export default {
        name: 'Login',
        data() {
            return {
                loginForm: {
                    username: '',
                    password: '',
                    rememberMe: false
                },
                rules: {
                    username: [{required: true, message: '您的账号未输入', toggle: 'blur'}],
                    password: [{required: true, message: '您的密码未输入', toggle: 'blur'}]
                }
            }
        },
        methods: {
            submitLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        postKvRequest('doLogin', this.loginForm).then(resp => {
                            if (resp) {
                                window.sessionStorage.setItem('user', JSON.stringify(resp.obj));
                                let path = this.$route.query.redirect;
                                this.$router.replace((path === '/' || path === undefined) ? '/home' : path);

                                this.$store.commit('INIT_CURRENT_HR', JSON.parse(window.sessionStorage.getItem('user')));
                                this.$store.dispatch('connect');
                            }
                        });
                    } else {
                        this.$message.error('您输入的内容不符合要求');
                        return false;
                    }
                })
            }
        }
    }
</script>

<style>
    .login-panel {
        width: 300px;
        margin: 160px auto auto;
        padding: 10px 20px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        -webkit-box-shadow: 0 0 20px #22222244;
        -moz-box-shadow: 0 0 20px #22222244;
        box-shadow: 0 0 20px #22222244;
    }

    hr {
        border-bottom: 0 solid #ccc;
    }

    .my-color {
        color: #272727;
    }
</style>