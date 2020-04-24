<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFromRules" label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop="uname">
                    <el-input v-model="loginForm.uname" prefix-icon="fa fa-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="fa fa-lock" type="password"></el-input>
                </el-form-item>
                <!-- 登录和重置按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        uname: '',
        password: ''
      },
      // 这是表单的验证规则对象
      loginFromRules: {
        // 验证用户名是否合法
        uname: [
          { required: true, message: '请输入登录用户名！', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符！', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码！', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //   点击重置按钮，重置登录表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 表单预验证
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
          // console.log('验证通过');
          const { data: result } = await this.$http.post("login", this.loginForm);
          console.log(result);
          if(result.code !== 200){
            return this.$message.error('登录失败！账号或密码错误');
          } else {
            this.$message.success('登录成功');
            // 在当前网站打开期间有效，所以将 token 保存在 sessionStorage 中
            window.sessionStorage.setItem('token',result.data.token)
            // 通过编程式导航跳转到后台主页
            this.$router.push('/home');
          }
        } else {
          // console.log('验证失败')
          return;
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
    height: 100%;
    background-color: #2b4b6b;

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px; // 圆角
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%); // 定义 2D 转换

        .avatar_box{
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%; // 圆角
            padding: 10px;
            box-shadow: 0 0 10px #ddd; // 向外增加阴影
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);// 定义 2D 转换
            background-color: #fff;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;// 圆角
                background-color: #eee;
            }
        }
        .login_form{
            position:absolute;
            bottom: 0;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box; // 规定两个并排的带边框的框
            .btns{
                display: flex;
                justify-content: flex-end; // 水平居右
            }
        }

    }
}

</style>
