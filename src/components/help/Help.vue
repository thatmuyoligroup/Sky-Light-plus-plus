<script>

import HelpMenu from "./HelpMenu.vue";
import HelpItemFloat from "./HelpItemFloat.vue";
import HelpItem from "./HelpItem.vue";


export default {
  name: "help",
  components: {HelpMenu, HelpItemFloat, HelpItem},
  props: {
    item: Array,
    prefix: String,
  },

};

</script>
<script setup>
import {showImagePreview} from "vant";
import device from "current-device";
import {useMainStore} from "../../stores/stores";
import {toRefs} from "vue";


const main = useMainStore()

</script>

<template>
  <template v-for="(obj,index) of item">
    <HelpMenu v-if="obj.type === 'menu'" :icon="obj.icon" :index="prefix?''+prefix+(index+1):''+(index+1)"
              :title="obj.title">
      <help :item="obj.item" :prefix="prefix?''+prefix+''+(index+1)+'-':''+(index+1)+'-'"></help>
    </HelpMenu>
    <el-menu-item-group v-else-if="obj.type === 'group'" :title="obj.title">
      <help :item="obj.item" :prefix="prefix?''+prefix+''+(index+1)+'-':''+(index+1)+'-'"/>
    </el-menu-item-group>
    <help-item-float v-else-if="obj.type==='itemFloat'" :icon="obj.icon"
                     :index="prefix? ''+prefix+(index+1) : ''+(index+1)"
                     :title="obj.title">
      <component
          :is="{data:()=>{return {isDark:toRefs(main).isDark}},template: obj.content,methods:{showImagePreview,isMobile:device.mobile,isTablet:device.tablet,isDesktop:device.desktop}}"/>

    </help-item-float>

    <help-item v-else-if="obj.type==='item'" :icon="obj.icon" :index="prefix?''+prefix+(index+1):''+(index+1)"
               :title="obj.title">
      <component
          :is="{data:()=>{return {isDark:toRefs(main).isDark}},template: obj.content,methods:{showImagePreview,isMobile:device.mobile,isTablet:device.tablet,isDesktop:device.desktop}}"/>
    </help-item>
  </template>
</template>
<style lang="scss" scoped>
</style>
