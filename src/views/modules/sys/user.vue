<template>
  <el-card shadow="never" class="site-card--fill">
    <div class="mod-sys__user">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item :label="$t('user.username')">
          <el-input v-model="dataForm.username" :placeholder="$t('input') + $t('user.username')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()" type="primary" icon="el-icon-search" plain round>{{ $t('query') }}</el-button>
          <el-button v-if="isAuth('sys:user:save')" @click="addOrUpdateHandle()" type="success" icon="el-icon-search" plain round>{{ $t('add') }}</el-button>
          <el-button v-if="isAuth('sys:user:delete')" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" type="danger" icon="el-icon-delete" plain round>{{ $t('deleteBatch') }}</el-button>
          <el-button v-if="isAuth('sys:user:export')" @click="exportHandle()" type="info">{{ $t('export') }}</el-button>
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
          prop="id"
          label="ID"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column
          prop="username"
          :label="$t('user.username')"
          sortable="custom"
          header-align="center"
          align="center">
      </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('user.status')"
          sortable="custom"
          header-align="center"
          align="center">
          <template slotScope="scope">
            <el-switch 
              v-model="scope.row.status" 
              style="display: block" 
              :active-value="0" 
              :inactive-value="1" 
              active-color="#13ce66" 
              inactive-color="#ff4949" 
              :active-text="$t('user.status0')" 
              :inactive-text="$t('user.status1')"
              @change="statusSwitchChangeEvent($event, scope.row.id)">
            </el-switch>
          </template>
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
          <template slotScope="scope">
            <el-button v-if="isAuth('sys:user:update')" @click="addOrUpdateHandle(scope.row.id)" type="text" size="small" >{{ $t('update') }}</el-button>
            <el-button v-if="isAuth('sys:user:delete')" @click="deleteHandle(scope.row.id)" type="text" size="small" >{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './user-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/user/list',
        getDataListIsPage: true,
        deleteURL: '/sys/user/delete',
        deleteIsBatch: true,
        exportURL: '/sys/user/export'
      },
      dataForm: {
        username: ''
      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    statusSwitchChangeHandle(row){
      this.$http.post('/sys/user/change', {
        "id": row.id,
        "status": row.status
      }).then(({data}) => {
        if(data && data.code === 0){
          this.getDataList()
        }else{
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>
