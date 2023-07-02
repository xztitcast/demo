<template>
  <div class="mod-sys__dict">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数（Key）键" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" type="success" icon="el-icon-search" plain round>查询</el-button>
        <el-button v-if="isAuth('sys:dict:save')" @click="addOrUpdateHandle()" type="success" icon="el-icon-search" plain round>{{ $t('add') }}</el-button>
        <el-button v-if="isAuth('sys:dict:delete')" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" type="danger" icon="el-icon-delete" plain round>{{ $t('deleteBatch') }}</el-button>
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
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="key"
        header-align="center"
        align="center"
        :label="$t('dict.key')">
      </el-table-column>
      <el-table-column
        prop="value"
        header-align="center"
        align="center"
        :label="$t('dict.value')">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        :label="$t('dict.remark')">
      </el-table-column>
      <el-table-column
        prop="created"
        sortable="custom"
        header-align="center"
        align="center"
        :label="$t('created')">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('handle')">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:dict:update')" @click="addOrUpdateHandle(scope.row.id)" type="text" size="small">{{ $t('update') }}</el-button>
          <el-button v-if="isAuth('sys:dict:delete')" @click="deleteHandle(scope.row.id)" type="text" size="small">{{ $t('delete') }}</el-button>
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
</template>

<script>
  import mixinViewModule from '@/mixins/view-module'
  import AddOrUpdate from './dict-add-or-update'
  export default {
    mixins: [mixinViewModule],
    data () {
      return {
        mixinViewModuleOptions: {
          getDataListURL: '/sys/dict/list',
          getDataListIsPage: true,
          deleteURL: '/sys/dict/delete',
          deleteIsBatch: true,
        },
        dataForm: {
          key: ''
        }
      }
    },
    components: {
      AddOrUpdate
    }
  }
</script>
