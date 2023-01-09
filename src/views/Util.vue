<script setup>
import {onBeforeMount, onMounted, ref} from 'vue';
import UtilFunction0 from "../components/util/UtilFunction.js";
import Data from '../sky/i18n/Default'

let functions;
let UtilFunction;
console.log(functions)
let ready = ref(false)
const data = {};
onBeforeMount(async () => {
  UtilFunction = await UtilFunction0
  ready.value = true

  functions = UtilFunction.functions;
})
onMounted(() => {

})


let utilConfig = Data.util;
console.log(utilConfig)
let ok = ref(true);


function clear() {
}

</script>
<template>
  <div v-if="ready">
    <el-container>
      <el-main>
        <el-collapse class="start-box">
          <el-collapse-item v-for="(value,index) of utilConfig.available" :name="value"
                            :title="utilConfig.i18n[value]?.name">
            <div style="padding-top: 15px">
              <component :is="functions[value]"/>
            </div>
          </el-collapse-item>
          <!-- 输入蜡烛数，获取总需wax，       -->
          <!-- 输入住火量，输出可合成，支持微调（-5000~5000），       -->
          <!--输入从x到y的蜡烛，输出需要的烛火，  支持微调（-5000~5000），         -->
        </el-collapse>
      </el-main>
      <!--   按钮     -->
      <el-footer>
        <el-affix :offset="20" position="bottom">
          <div class="start-bottom-box">
            <!--              <el-button :loading="calculating" round type="primary" @click="calculate" @dblclick.stop="()=>{}">-->
            <!--                {{ Data.start.resultTitle.button.calculate }}-->
            <!--              </el-button>-->
            <el-button :loading="!ready" round type="success" @click="UtilFunction.clear()" @dblclick.stop="()=>{}">
              {{ Data.start.resultTitle.button.clear }}
            </el-button>
          </div>
        </el-affix>
      </el-footer>
    </el-container>
  </div>
</template>
