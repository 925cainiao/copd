<template>
  <div class="login_container">
    <div class="login_box">
      <h1 class="login_title">慢性气道疾病管理与AI辅助诊断决策</h1>
      <el-form :model="form"
               label-width="0"
               ref="form"
               :rules="rules"
               v-loading="loading"
               class="login_form">
        <el-form-item label=""
                      prop="phone">
          <el-input v-model="form.phone"
                    placeholder="请输入手机号"
                    maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label=""
                      prop="password">
          <el-input show-password
                    v-model="form.password"
                    placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm"
                     style="width: 100%;">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        phone: '',
        password: ''
      },
      rules: {
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: this.$reg.mobile,
            message: '手机号码格式不正确',
            trigger: 'blur'
          }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      },
      loading: false
    }
  },
  methods: {
    async submitForm () {
      let _this = this
      _this.loading = true

      this.$refs.form.validate(async valid => {
        if (valid) {
          _this.loading = false
          _this.form.doctorId = 1
          _this.form.doctorName = 'zz'
          _this.form.registHospital = '1'
          sessionStorage.setItem('doctorInfo', JSON.stringify(_this.form))
          _this.$router.push({ path: '/main' })
        } else {
          _this.form.doctorId = 1
          _this.form.doctorName = 'zz'
          sessionStorage.setItem('doctorInfo', JSON.stringify(_this.form))
          _this.loading = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  text-align: center;
  position: absolute;
  background: url(../assets/img/login-bg.a3a8467.jpg) no-repeat;
  background-size: cover;
}
.login_box {
  padding: 20px;
  width: 470px;
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  box-shadow: 0px -1px 0px 0px #eee, -1px 0px 0px 0px #eee, 1px 0px 0px 0px #eee,
    0px 1px 0px 0px #eee;
  border-radius: 5px;
  .login_title {
    margin: 50px auto;
    text-align: center;
    font-weight: normal;
    // color: #333;
    font-size: 26px;
  }
  .login_form {
    padding: 0 24px;
    .el-input__inner {
      height: 44px !important;
    }
  }
}
</style>
