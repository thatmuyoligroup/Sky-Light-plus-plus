<script setup>
import {RouterView, useRoute, useRouter} from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import {loyalCustomerStore, useMainStore} from "./stores/stores";
import {nextTick, onMounted, ref, toRefs} from "vue";
import ElSystemNotice from "./util/ElSystemNotice";
import Data from "./sky/i18n/Default.js";

let main = useMainStore();
let loyalCustomer = loyalCustomerStore();
let router = useRouter()
let route = useRoute();
let navDivider = ref(false)
let isDark = toRefs(main).isDark;

function to(path) {
  if (route.path === path) {
    return;
  }

  main.pageLoading = true
  setTimeout(async () => {
    await nextTick();
    await router.replace(path)
    main.pageLoading = false
  }, 10)

}

function loadPrefersColorScheme() {
  function darkMode() {
    for (/**@type{HTMLElement} */let element of document.getElementsByTagName("html")) {
      element.setAttribute('class', 'dark')
    }
  }

  function lightMode() {
    for (/**@type{HTMLElement} */let element of document.getElementsByTagName("html")) {
      element.setAttribute('class', '')
    }
  }

  if (window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches) {
    darkMode();
    isDark.value = true;
  } else {
    isDark.value = false;
    lightMode();
  }
  window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
        if (event.matches) {
          //dark mode
          ElSystemNotice.sendMsg(Data.messageTemplate.keepEyeSafe)
          darkMode();
          isDark.value = true;
        } else {
          //light mode
          isDark.value = false;
          lightMode();
        }
      })
}


function loadMediaWidthSetting() {
  navDivider.value = !(window.matchMedia &&
      window.matchMedia('(min-width: 1024px)').matches);
  window.matchMedia('(min-width: 1024px)')
      .addEventListener('change', event => {
        navDivider.value = !event.matches;
      })
}

function loadLoyalCustomer() {
  function isRunningStandalone() {
    loyalCustomer.isLoyalCustomer = false
    return (window.matchMedia('(display-mode: standalone)').matches);
  }

  if (!navigator.standalone && !isRunningStandalone()) {
    loyalCustomer.isLoyalCustomer = false
    return;
  }

  loyalCustomer.isLoyalCustomer = true

  if (loyalCustomer.informed) {
    return;
  }

  setTimeout(() => {
    ElSystemNotice.sendNotice(Data.noticeTemplate.loyalCustomers);
    loyalCustomer.informed = true
  }, 50)

}

function reload() {
  document.getElementsByClassName('replay')[0].className += ' replaying'
  setTimeout(() => location.reload(), 200)
}

onMounted(() => {
  ElSystemNotice.load();
  loadLoyalCustomer();
  loadPrefersColorScheme();
  loadMediaWidthSetting();
})


</script>

<template>
  <header>
    <img v-if="isDark" alt="logo" class="logo" height="90" src="@/assets/logo-dark.png" width="180"/>
    <img v-else alt="logo" class="logo" height="90" src="@/assets/logo.png" width="180"/>
    <div class="wrapper">
      <HelloWorld :msg="Data.title">
        <template v-if="loyalCustomer.isLoyalCustomer" #title>
          <van-icon class="replay" name="replay"
                    @click="reload()"/>
        </template>
      </HelloWorld>
      <nav>
        <a :class="route.name==='home'?'router-link-exact-active':''" @click="to('/')">{{ Data.routerTitle.home }}</a>
        <a :class="route.name==='start'?'router-link-exact-active':''"
           @click="to('/start')">{{ Data.routerTitle.start }}</a>
        <a :class="route.name==='util'?'router-link-exact-active':''"
           @click="to('/util')">{{ Data.routerTitle.util }}</a>
        <a :class="route.name==='help'?'router-link-exact-active':''"
           @click="to('/help')">{{ Data.routerTitle.help }}</a>
      </nav>
      <el-divider v-if="navDivider"
                  style="margin-top: 10px;border-top: 1px  var(--color-border) var(--el-border-style);"/>
    </div>
  </header>
  <div>
    <van-config-provider :theme="isDark?'dark':'light'"/>
    <div
        v-show="main.pageLoading"
        v-loading="main.pageLoading"
        :element-loading-spinner="null"
        :element-loading-text=" Data.loadingText "
        class="loading-green"
        element-loading-background="rgba(0, 0, 0, 0.0)"
        element-loading-svg-view-box="0,0,0,0"
        style="margin-top: 10vh;"
    >

    </div>
    <RouterView v-slot="{ Component,route }">
      <transition name="fade">
        <div>

          <div v-show="!main.pageLoading">
            <component :is="Component" :key="route"/>
          </div>

        </div>
      </transition>
    </RouterView>
  </div>
</template>

<style scoped>

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.replaying {
  animation: rotate 0.5s linear infinite;
}

header {
  line-height: 1.5;
  margin-top: 2vh;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: .95rem;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  cursor: pointer;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1.05rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
