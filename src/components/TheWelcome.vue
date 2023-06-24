<script setup>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
import Data from '../sky/i18n/Default'

let about = Data.about

</script>

<template>
  <!-- 每日任务 -->
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon/>
    </template>
    <template #heading>{{ about.dailyTasks.title }}</template>
    <span v-html="about.dailyTasks.html"></span>
    {{ about.dailyTasks.desc }}
    <br/>
    <span>{{ about.authorTitle }}<span v-html="about.dailyTasks.author"></span></span>
  </WelcomeItem>

  <!-- 数据支持（版本） -->
  <WelcomeItem>
    <template #icon>
      <EcosystemIcon/>
    </template>
    <template #heading>{{ about.dataSupport.title }}</template>
    <template v-if="about.dataSupport.desc">
      {{ about.dataSupport.desc }}
      <br/>
    </template>
    {{ about.authorTitle }}
    <span v-html="about.dataSupport.author"></span>
    <div></div>
    {{ about.dataSupport.versionTitle }}
    {{ about.dataSupport.version }}
  </WelcomeItem>

  <!-- 关于项 -->
  <WelcomeItem>
    <template #icon>
      <CommunityIcon/>
    </template>
    <template #heading>{{ about.openSource.title }}</template>
    <div v-html="about.openSource.html"></div>
    {{ about.authorTitle }}
    <span v-for=" (item,index) in about.author" :key="index" v-html="(index>0?about.authorSeparator:'')+item"></span>
    <br/>
    {{ about.gameVersionTitle }}{{ about.gameVersion }}<br/>
    {{ about.versionTitle }} {{ about.version }}
  </WelcomeItem>

  <!-- 官方地址 -->
  <WelcomeItem>
    <template #icon>
      <SupportIcon/>
    </template>
    <template #heading>{{ about.form.title }}</template>
    <div v-html="about.form.html"></div>
  </WelcomeItem>
</template>
