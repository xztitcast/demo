<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="150px">
      <el-form-item :label="$t('dict.key')" prop="key">
        <el-input v-model="dataForm.key" :placeholder="$t('input') + $t('dict.key')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('dict.value')" prop="value">
        <el-input v-model="dataForm.value" :placeholder="$t('input') + $t('dict.value')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('dict.remark')" prop="remark">
        <el-input v-model="dataForm.remark" :placeholder="$t('input') + $t('dict.remark')"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" icon="el-icon-close">{{ $t('cancel') }}</el-button>
      <el-button @click="dataFormSubmitHandle()" type="primary" icon="el-icon-check">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import debounce from 'lodash/debounce'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: null,
          key: '',
          value: '',
          remark:''
        },
        dataRule: {
          key: [
            { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          value: [
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
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      },
      getInfo(){
        this.$http.get(`/sys/dict/info/${this.dataForm.id}`).then(({data}) => {
          if(data && data.code === 0){
            this.dataForm.id = data.result.id
            this.dataForm.key = data.result.key
            this.dataForm.value = data.result.value
            this.dataForm.remark = data.result.remark
          }
        })
      },
      // 表单提交
      dataFormSubmitHandle: debounce(function() {
        this.$refs['dataForm'].validate((valid) => {
          if(valid){
            this.$http.post(`/sys/dict/${this.dataForm.id ? 'update' : 'save'}`,{
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
                this.$message.error(data.msg)
              }
            })
          }
        })
      },1000, { 'leading': true, 'trailing': false })   
    }
  }
</script>
