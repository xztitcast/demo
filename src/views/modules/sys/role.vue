<template>
  <el-card shadow="never" class="site-card--fill">
    <div class="mod-sys__role">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item :label="$t('role.name')">
          <el-input v-model="dataForm.name" :placeholder="$t('input') + $t('role.name')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()" type="primary" icon="el-icon-search" plain round>{{ $t('query') }}</el-button>
          <el-button v-if="isAuth('sys:role:save')" @click="addOrUpdateHandle()" type="success" icon="el-icon-search" plain round>{{ $t('add') }}</el-button>
          <el-button v-if="isAuth('sys:role:delete')" @click="deleteHandle()" type="danger">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        border
        :data="dataList"
        v-loading="dataListLoading"
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
        style="width: 100%;">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          :label="$t('role.name')"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column
          prop="remark"
          :label="$t('role.remark')"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column
          prop="created"
          :label="$t('created')"
          sortable="custom"
          header-align="center"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="150">
          <template slot-scope="scope">
            <el-button v-if="isAuth('sys:role:update')" @click="addOrUpdateHandle(scope.row.id)" type="text" size="small">{{ $t('update') }}</el-button>
            <el-button v-if="isAuth('sys:role:delete')" @click="deleteHandle(scope.row.id)" type="text" size="small">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="total"
        :page-size="pageSize"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './role-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/role/list',
        getDataListIsPage: true,
        deleteURL: '/sys/role/delete',
        deleteIsBatch: true
      },
      dataForm: {
        name: ''
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
