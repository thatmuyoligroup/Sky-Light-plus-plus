<script setup>
let props = defineProps({
  obj: [Object, Number]
});
</script>

<template>
  <template v-if="obj instanceof Object">
    ({{
      obj?.candlelight + (obj?.floatCandlelight?.fixed ?? 0)
    }}{{
      (obj?.floatCandlelight?.float ?? obj?.floatCandlelight) ? '±' + (obj?.floatCandlelight?.float ?? obj?.floatCandlelight) : ''
    }}) {{ obj?.candle ? '+' + obj?.candle : '' }}
  </template>
  <template v-else>
    ({{ obj }})
  </template>

</template>

<style scoped>


</style>
