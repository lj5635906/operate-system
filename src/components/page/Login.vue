<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-row :span="24">
                        <el-col :span="14">
                            <el-input placeholder="请输入验证码" v-model="ruleForm.code"
                                      @keyup.enter.native="submitForm('ruleForm')"></el-input>
                        </el-col>
                        <el-col :span="10">
                            <img :src="imageCode.src" @click="refreshCode" style="padding-left: 10px;padding-top: 2px"/>
                        </el-col>
                    </el-row>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import api from "../../fetch/Api"

    export default {
        data: function () {
            return {
                ruleForm: {
                    username: '',
                    password: '',
                    code: '',
                    random: ''
                },
                imageCode: {
                    src: 'data:image/png;base64,'
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入验证码', trigger: 'blur'}
                    ]
                }
            }
        },
        created: function () {
            this.refreshCode();
        },
        methods: {
            refreshCode() {
                var type = 'image';
                api.getCode(type)
                    .then(result => {
                        this.ruleForm.random = result.random;
                        this.imageCode.src = 'data:image/png;base64,' + result.image;
                    })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        api.loginByUsername(this.ruleForm)
                            .then(result => {
                                console.log(result)
                                localStorage.setItem('account', this.ruleForm.username);
                                localStorage.setItem('access_token',result.access_token);
                                localStorage.setItem('refresh_token',result.refresh_token);
                                localStorage.setItem('token_type',result.token_type);
                                this.$router.push('/');
                            }).catch(error => {

                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .ms-title {
        position: absolute;
        top: 50%;
        width: 100%;
        margin-top: -230px;
        text-align: center;
        font-size: 30px;
        color: #fff;

    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 300px;
        height: 170px;
        margin: -150px 0 0 -190px;
        padding: 40px;
        border-radius: 5px;
        background: #fff;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
    }
</style>
