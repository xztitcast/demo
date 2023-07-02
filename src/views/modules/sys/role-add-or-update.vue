<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="name" :label="$t('role.name')">
        <el-input v-model="dataForm.name" :placeholder="$t('input') + $t('role.name')" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item prop="remark" :label="$t('role.remark')">
        <el-input v-model="dataForm.remark" :placeholder="$t('input') + $t('role.remark')" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item size="mini" :label="$t('role.menuList')">
        <el-tree
          :data="menuList"
          :props="{ label: 'name', children: 'children' }"
          node-key="id"
          ref="menuListTree"
          accordion
          show-checkbox>
        </el-tree>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false" icon="el-icon-check">{{ $t('cancel') }}</el-button>
      <el-button @click="dataFormSubmitHandle()" type="primary" icon="el-icon-check">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      menuList: [],
      dataForm: {
        id: null,
        name: '',
        menuIdList: [],
        remark: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs.menuListTree.setCheckedKeys([])
        Promise.all([
          this.getMenuList()
        ]).then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      })
    },
    // 获取菜单列表
    getMenuList () {
      return this.$http.get('/sys/menu/list').then(({data}) => {
        if(data && data.code === 0){
          this.menuList = data.result
        }else{
          this.$message.error(data.msg)
        }
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/sys/role/info/${this.dataForm.id}`).then(({data}) => {
        if(data && data.code === 0){
          this.dataForm = {
            ...this.dataForm,
            ...data.result
          }
          this.dataForm.menuIdList.forEach(item => this.$refs.menuListTree.setChecked(item, true))
        }else{
          this.$message.error(data.msg)
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataForm.menuIdList = [
            ...this.$refs.menuListTree.getHalfCheckedKeys(),
            ...this.$refs.menuListTree.getCheckedKeys()
          ]
          this.$http.post(`/sys/role/${this.dataForm.id ? 'update' : 'save'}`, {
            ...this.dataForm
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
              this.$message.error(res.msg)
            }
          }).catch(() => {})
        }
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
