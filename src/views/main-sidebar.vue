<template>
  <aside :class="['site-sidebar', `site-sidebar--${$store.state.sidebarLayoutSkin}`]">
    <div class="site-sidebar__inner">
      <el-menu
        :default-active="$store.state.sidebarMenuActiveName + ''"
        :collapse="$store.state.sidebarFold"
        :unique-opened="true"
        :collapseTransition="false"
        class="site-sidebar__menu">
        <sub-menu v-for="menu in $store.state.sidebarMenuList" :key="menu.id" :menu="menu" />
      </el-menu>
    </div>
  </aside>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
export default {
  data () {
    return {
    }
  },
  components: {
    SubMenu
  },
  created () {
    this.$store.state.sidebarMenuList = window.SITE_CONFIG['menuList']
  }
}
</script>
