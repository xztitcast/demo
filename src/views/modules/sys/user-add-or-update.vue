<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="username" :label="$t('user.username')">
        <el-input v-model="dataForm.username" :placeholder="$t('input') + $t('user.username')" :maxlength="10"></el-input>
      </el-form-item>
      <div v-if="!dataForm.id">
        <el-form-item prop="password" :label="$t('user.password')" :class="{ 'is-required': !dataForm.id }">
          <el-input v-model="dataForm.password" type="password" :placeholder="$t('input') + $t('user.password')" :maxlength="20" show-password></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword" :label="$t('user.confirmPassword')" :class="{ 'is-required': !dataForm.id }">
          <el-input v-model="dataForm.confirmPassword" type="password" :placeholder="$t('input') + $t('user.confirmPassword')" :maxlength="20" show-password></el-input>
        </el-form-item>
      </div>
      <el-form-item prop="roleIdList" :label="$t('user.roleIdList')" class="role-list">
        <el-select v-model="dataForm.roleIdList" multiple :placeholder="$t('select') + $t('user.roleIdList')">
          <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status" :label="$t('user.status')" size="mini">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{ $t('user.status0') }}</el-radio>
          <el-radio :label="1">{{ $t('user.status1') }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false" icon="el-icon-close">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()" icon="el-icon-check">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      roleList: [],
      roleIdListDefault: [],
      dataForm: {
        id: null,
        username: '',
        password: '',
        confirmPassword: '',
        roleIdList: [],
        status: 0
      }
    }
  },
  computed: {
    dataRule () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          return callback(new Error(this.$t('validate.required')))
        }
        callback()
      }
      var validateConfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          return callback(new Error(this.$t('validate.required')))
        }
        if (this.dataForm.password !== value) {
          return callback(new Error(this.$t('user.validate.confirmPassword')))
        }
        callback()
      }
      return {
        username: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.roleIdListDefault = []
        Promise.all([
          this.getRoleList()
        ]).then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      })
    },
    // 获取角色列表
    getRoleList () {
      this.$http.get('/sys/role/select').then(({data}) => {
        if(data && data.code === 0){
          this.roleList = data.result
        }else{
          this.$message.error(data.msg)
        }
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/sys/user/info/${this.dataForm.id}`).then(({data}) => {
        if(data && data.code === 0){
          this.dataForm = {
            ...this.dataForm,
            ...data.result,
            roleIdList: []
          }
          // 角色配置, 区分是否为默认角色
          for (var i = 0; i < data.result.roleIdList.length; i++) {
            if (this.roleList.filter(item => item.id === data.result.roleIdList[i])[0]) {
              this.dataForm.roleIdList.push(data.result.roleIdList[i])
            }else{
              this.roleIdListDefault.push(data.result.roleIdList[i])
            }
          }
        }else{
          this.$message.error(data.msg)
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http.post(`/sys/user/${this.dataForm.id ? 'update' : 'save'}`, {
            ...this.dataForm,
            roleIdList: [
              ...this.dataForm.roleIdList,
              ...this.roleIdListDefault
            ]
          }).then(({data}) => {
            if(data && data.code === 0){
              this.$message({
                message: this.$t('prompt.success'),
                type: 'success',
                duration: 500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            }else{
              this.$message.error(data.msg)
            }
          }).catch(() => {})
        }
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>

<style lang="scss">
.mod-sys__user {
  .role-list {
    .el-select {
      width: 100%;
    }
  }
}
</style>
