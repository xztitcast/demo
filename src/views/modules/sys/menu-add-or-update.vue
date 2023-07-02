<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" @close="resetFieldHandle">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="type" :label="$t('menu.type')" size="mini">
        <el-radio-group v-model="dataForm.type" :disabled="!!dataForm.id">
          <el-radio v-for="(type, index) in typeList" :label="index" :key="index">{{ $t(type) }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="name" :label="$t(typeList[dataForm.type]) + $t('menu.name')">
        <el-input v-model="dataForm.name" :placeholder="$t('input') + $t(typeList[dataForm.type]) + $t('menu.name')" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item prop="parentName" :label="$t('menu.parentName')" class="menu-list">
        <el-popover v-model="menuListVisible" ref="menuListPopover" placement="bottom-start" trigger="click">
          <el-tree
            :data="menuList"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            ref="menuListTree"
            :highlight-current="true"
            :expand-on-click-node="false"
            :default-expand-all="false"
            accordion
            @current-change="menuListTreeCurrentChangeHandle">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" :placeholder="$t('menu.parentName')" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 1" prop="url" :label="$t('menu.url')">
        <el-input v-model="dataForm.url" :placeholder="$t('input') + $t('menu.url')" :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 2" prop="perms" :label="$t('menu.perms')">
        <el-input v-model="dataForm.perms" :placeholder="$t('menu.permTips')" :maxlength="255"></el-input>
      </el-form-item>
      <el-form-item prop="icon" :label="$t('menu.icon')" class="icon-list">
        <el-popover v-model="iconListVisible" ref="iconListPopover" placement="bottom-start" trigger="click" popper-class="mod-sys__menu-icon-popover">
          <div class="mod-sys__menu-icon-inner">
            <div class="mod-sys__menu-icon-list">
              <el-button
                v-for="(item, index) in iconList"
                :key="index"
                @click="iconActiveHandle(item)"
                :class="{ 'is-active': dataForm.icon === item }">
                <svg class="icon-svg" aria-hidden="true"><use :xlink:href="`#${item}`"></use></svg>
              </el-button>
            </div>
          </div>
        </el-popover>
        <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" :placeholder="$t('select') + $t('menu.icon')"></el-input>
      </el-form-item>
      <el-form-item prop="sorted" :label="$t('menu.sorted')">
        <el-input-number v-model="dataForm.sorted" controls-position="right" :min="0" :max="999" :step="1" :label="$t('menu.sorted')"></el-input-number>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false;" icon="el-icon-close">{{ $t('cancel') }}</el-button>
      <el-button @click="dataFormSubmitHandle()" type="primary" icon="el-icon-check">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import { getIconList } from '@/utils'
export default {
  data () {
    return {
      visible: false,
      menuList: [],
      menuListVisible: false,
      iconList: [],
      iconListVisible: false,
      dataForm: {
        id: null,
        type: 0,
        name: '',
        parentId: 0,
        parentName: '',
        url: '',
        perms: '',
        sorted: 0,
        icon: ''
      },
      typeList: ['menu.type0', 'menu.type1', 'menu.type2'],
    }
  },
  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        url: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        perms: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'dataForm.type' (val) {
      this.$refs['dataForm'].clearValidate()
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.iconList = getIconList()
        this.dataForm.parentName = this.$t('menu.parentNameDefault')
        this.getMenuList().then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      })
    },
    // 获取菜单列表
    getMenuList () {
      return this.$http.get('/sys/menu/select').then(({data}) => {
        if(data && data.code === 0){
          this.menuList = data.result
        }else{
          this.$message.error(data.msg)
        }
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/sys/menu/info/${this.dataForm.id}`).then(({data}) => {
        if(data && data.code === 0){
          this.dataForm = {
            ...this.dataForm,
            ...data.result
          }
          this.menuListTreeSetCurrentNode()
        }else{
          this.$message.error(data.msg)
        }
      }).catch(() => {})
    },
    // 上级菜单树, 选中
    menuListTreeCurrentChangeHandle (data) {
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.name
      this.menuListVisible = false
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode () {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
      this.dataForm.parentName = this.dataForm.parentId === 0 ? this.$t('menu.parentNameDefault') : (this.$refs.menuListTree.getCurrentNode() || {})['name']
    },
    // 图标, 选中
    iconActiveHandle (icon) {
      this.dataForm.icon = icon
      this.iconListVisible = false
    },
    resetFieldHandle(){
      this.dataForm = this.$options.data().dataForm
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if(valid) {
          this.$http.post(`/sys/menu/${this.dataForm.id ? 'update' : 'save'}`, {
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
          }).catch(() => {})
        }
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>

<style lang="scss">
.mod-sys__menu {
  .menu-list__input,
    .icon-list__input {
       > .el-input__inner {
        cursor: pointer;
      }
    }
  &-icon-popover {
    width: 458px;
    overflow: hidden;
  }
  &-icon-inner {
    width: 478px;
    max-height: 258px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &-icon-list {
    width: 458px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
}
</style>
