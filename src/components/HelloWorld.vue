<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
import Data from '../sky/i18n/Default'</script>

<template>
  <div class="greetings">
    <h1 class="sky">{{ msg }}</h1>
    <h3 v-html=" Data.welcome">
    </h3>
    <h6 class="copyright">
      <span v-html="Data.copyright">
      </span>

    </h6>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  /*font-size: 2.6rem;*/
  font-size: 1.7rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
