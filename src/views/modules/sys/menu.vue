<template>
  <el-card shadow="never" class="site-card--fill">
    <div class="mod-sys__menu">
      <el-form :inline="true" :model="dataForm">
        <el-form-item>
          <el-button v-if="isAuth('sys:menu:save')" @click="addOrUpdateHandle()" type="success" icon="el-icon-plus" plain round>{{ $t('add') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        border
        :data="dataList"
        row-key="id"
        style="width: 100%;">
        <el-table-column
          prop="name"
          header-align="center"
          min-width="150"
          :label="$t('menu.name')">
        </el-table-column>
        <el-table-column
          prop="parentName"
          header-align="center"
          align="center"
          width="120"
          :label="$t('menu.parentName')">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :label="$t('menu.icon')">
          <template slot-scope="scope">
            <svg class="icon-svg" aria-hidden="true"><use :xlink:href="`#${scope.row.icon}`"></use></svg>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          header-align="center"
          align="center"
          :label="$t('menu.type')">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 0" size="small">{{ $t('menu.type0') }}</el-tag>
            <el-tag v-else-if="scope.row.type === 1" size="small" type="success">{{ $t('menu.type1') }}</el-tag>
            <el-tag v-else-if="scope.row.type === 2" size="small" type="info">{{ $t('menu.type2') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="sorted"
          header-align="center"
          align="center"
          :label="$t('menu.sorted')">
        </el-table-column>
        <el-table-column
          prop="url"
          header-align="center"
          align="center"
          width="150"
          :show-overflow-tooltip="true"
          :label="$t('menu.url')">
        </el-table-column>
        <el-table-column
          prop="perms"
          header-align="center"
          align="center"
          width="150"
          :show-overflow-tooltip="true"
          :label="$t('menu.perms')">
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAuth('sys:menu:update')" @click="addOrUpdateHandle(scope.row.id)" type="text" size="small">{{ $t('update') }}</el-button>
            <el-button v-if="isAuth('sys:menu:delete')" @click="deleteHandle(scope.row.id)" type="text" size="small">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import AddOrUpdate from './menu-add-or-update'
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/menu/list',
        deleteURL: '/sys/menu/delete'
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
