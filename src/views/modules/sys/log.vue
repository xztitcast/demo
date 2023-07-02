<template>
  <el-card shadow="never" class="site-card--fill">
    <div class="mod-sys__log-login">
      <el-table 
        border
        :data="dataList"
        v-loading="dataListLoading"
        @sort-change="dataListSortChangeHandle"
        style="width: 100%;">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" class="log-table-expand">
              <el-form-item label="ID">
                <span>{{ scope.row.id }}</span>
              </el-form-item>
              <el-form-item :label="$t('log.username')">
                <span>{{ scope.row.username }}</span>
              </el-form-item>
              <el-form-item :label="$t('log.operation')">
                <span>{{ scope.row.operation }}</span>
              </el-form-item>
              <el-form-item :label="$t('log.method')">
                <span>{{ scope.row.method }}</span>
              </el-form-item>
              <el-form-item :label="$t('log.params')">
                <span>{{ scope.row.params }}</span>
              </el-form-item>
              <el-form-item :label="$t('log.time')">
                <span>{{ scope.row.time }}</span>
              </el-form-item>
              <el-form-item :label="$t('log.ip')">
                <span>{{ scope.row.ip }}</span>
              </el-form-item>
              <el-form-item :label="$t('created')">
                <span>{{ scope.row.created }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="id" 
          label="ID"
          header-align="center"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="username"
          :label="$t('log.username')"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column
          prop="operation"
          :label="$t('log.operation')"
          header-align="center"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="method"
          :label="$t('log.method')"
          header-align="center"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="params"
          :label="$t('log.params')"
          header-align="center"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="time"
          :label="$t('log.time')"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column
          prop="ip"
          :label="$t('log.ip')"
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
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/log/list',
        getDataListIsPage: true
      },
      dataForm: {
        creatorName: '',
        status: ''
      }
    }
  }
}
</script>
