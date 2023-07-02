<template>
  <div class="mod-sys__oss">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()"> 
      <el-form-item>
        <el-select v-model="dataForm.name" placeholder="请选择存储商">
          <el-option value="ALIYUN" label="阿里云"></el-option>
          <el-option value="QCLOUD" label="腾讯云"></el-option>
          <el-option value="QINIU" label="七牛云"></el-option>
          <el-option value="HUAWEI" label="华为云"></el-option>
          <el-option value="MINIO" label="MIN云"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" type="primary" icon="el-icon-search" plain round>查询</el-button>
        <el-button @click="addOrUpdateHandle()" type="success" icon="el-icon-search" plain round>新增</el-button>
        <el-button @click="deleteHandle()" :disabled="dataListSelections.length <= 0" type="danger" icon="el-icon-delete" plain round>批量删除</el-button>
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
        prop="name"
        header-align="center"
        align="center"
        label="存储商">
      </el-table-column>
      <el-table-column
        prop="domain"
        header-align="center"
        align="center"
        label="域名"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="point"
        header-align="center"
        align="center"
        label="端点">
      </el-table-column>
      <el-table-column
        prop="bucket"
        header-align="center"
        align="center"
        label="桶">
      </el-table-column>
      <el-table-column
        prop="prefix"
        header-align="center"
        align="center"
        label="目录">
      </el-table-column>
      <el-table-column
        prop="accessKey"
        header-align="center"
        align="center"
        label="KEY">
      </el-table-column>
      <el-table-column
        prop="secretKey"
        header-align="center"
        align="center"
        label="SECRET">
      </el-table-column>
      <el-table-column
        prop="created"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="addOrUpdateHandle(scope.row.id)" type="text" size="small">修改</el-button>
          <el-button @click="deleteHandle(scope.row.id)" type="text" size="small">删除</el-button>
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
  import AddOrUpdate from './oss-add-or-update'
  export default {
    mixins: [mixinViewModule],
    data () {
      return {
        mixinViewModuleOptions: {
          getDataListURL: '/sys/oss/list',
          getDataListIsPage: true,
          deleteURL: '/sys/oss/delete',
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
