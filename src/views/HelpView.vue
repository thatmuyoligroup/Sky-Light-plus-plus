<script setup>
import Data from '../sky/i18n/Default'
import HelpItem from "../components/help/HelpItem.vue";
import Help from "../components/help/Help.vue";

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}

let a = `
<svg  viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
<path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="currentColor"></path>
<path d="M517.6 351.3c53 0 89 33.8 93 83.4 0.3 4.2 3.8 7.4 8 7.4h56.7c2.6 0 4.7-2.1 4.7-4.7 0-86.7-68.4-147.4-162.7-147.4C407.4 290 344 364.2 344 486.8v52.3C344 660.8 407.4 734 517.3 734c94 0 162.7-58.8 162.7-141.4 0-2.6-2.1-4.7-4.7-4.7h-56.8c-4.2 0-7.6 3.2-8 7.3-4.2 46.1-40.1 77.8-93 77.8-65.3 0-102.1-47.9-102.1-133.6v-52.6c0.1-87 37-135.5 102.2-135.5z" fill="currentColor"></path></svg>
`


</script>

<template>
  <main>
    <div class="helpBox">
      <el-menu
          :default-active="Data.help.defaultActive"
          background-color="Transparent"
          style="border: none"
          @close="handleClose"
          @open="handleOpen"
      >
        <help :item="Data.help.howToUse"/>
        <help-item :icon="'User'" :index="''+Data.help.howToUse.length+1" :title="Data.help.contributor.title">
          <div>{{ Data.help.contributor.notRanked }}</div>
          <div style="display: flex;flex-wrap: wrap;">
            <template v-for=" (item,index) in Data.about.contributor">
              <span v-html="item"></span><span
                v-if="index+1 <Data.about.contributor.length" v-html="Data.about.authorSeparator"></span>
            </template>
          </div>
        </help-item>
        <help-item :icon-svg="a" :index="''+Data.help.howToUse.length+2" :title="Data.help.copyright.title">
          <div v-html="Data.copyright "></div>
        </help-item>
      </el-menu>
    </div>
  </main>
</template>

<style lang="scss" scoped>


</style>
