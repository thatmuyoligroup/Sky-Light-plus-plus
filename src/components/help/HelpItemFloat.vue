<script setup>
let props = defineProps({
  index: String,
  title: String,
  content: String,
  icon: String
})

</script>
<template>
  <el-sub-menu :index="index">
    <template #title>
      <el-icon v-if="icon" style="color: var(--el-text-color-primary)">
        <component :is="icon"/>
      </el-icon>
      <span style="color: var(--el-text-color-primary)">{{ title }}</span>
    </template>
    <div class="helpChooseItem">
      <slot></slot>
    </div>
  </el-sub-menu>
</template>
