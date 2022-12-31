<script setup>
let props = defineProps({
  index: String,
  title: String,
  content: String,
  icon: String,
  iconSvg: String,

})

</script>
<template>
  <div>
    <div class="helpItem">
      <el-icon v-if="icon || iconSvg">
        <template v-if="iconSvg">
          <svg v-html="iconSvg"></svg>
        </template>
        <component :is="icon" v-if="icon"/>
      </el-icon>
      <span>{{ title }}</span>
    </div>
    <div class="helpChooseItem">
      <slot></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>

.helpItem {
  .el-icon {
    vertical-align: middle;
    margin-right: 5px;
    width: var(--el-menu-icon-width);
    text-align: center;
    font-size: 18px;
  }

  color: var(--el-text-color-primary);
  display: flex;
  align-items: center;
  height: var(--el-menu-item-height);
  line-height: var(--el-menu-item-height);
  font-size: var(--el-menu-item-font-size);
  padding: calc(var(--el-menu-base-level-padding) + var(--el-menu-level) * var(--el-menu-level-padding));
  list-style: none;
  //cursor: pointer;
  position: relative;
  transition: border-color var(--el-transition-duration), background-color var(--el-transition-duration), color var(--el-transition-duration);
  box-sizing: border-box;
  white-space: nowrap;
  padding-right: calc(var(--el-menu-base-level-padding) + var(--el-menu-icon-width));
}


</style>
