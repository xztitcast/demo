<template>
  <el-card shadow="never" class="site-card--fill">
    <div class="mod-home">
      <echarts></echarts>
    </div>
  </el-card>
</template>
<script>
  import Echarts from "@/components/echarts";
  export default {
    components: {
      Echarts
    }
  }
</script>
<style>
.mod-home {
  line-height: 1.5;
}
</style>
