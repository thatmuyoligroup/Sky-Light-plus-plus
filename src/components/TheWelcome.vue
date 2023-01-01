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


  <WelcomeItem>
    <template #icon>
      <EcosystemIcon/>
    </template>
    <template #heading>{{ about.dataSupport.title }}</template>
    {{ about.dataSupport.desc }}
    <br/>
    {{ about.authorTitle }}
    <span v-html="about.dataSupport.author"></span>
    <div></div>
    {{ about.dataSupport.versionTitle }}
    {{ about.dataSupport.version }}
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon/>
    </template>
    <template #heading>{{ about.openSource.title }}</template>
    <div v-html="about.openSource.html"></div>
    {{ about.authorTitle }}
    <span v-for=" (item,index) in about.author" v-html="(index>0?about.authorSeparator:'')+item"></span>
    <br/>
    {{ about.gameVersionTitle }}{{ about.gameVersion }}<br/>
    {{ about.versionTitle }} {{ about.version }}


  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon/>
    </template>
    <template #heading>{{ about.form.title }}</template>
    <div v-html="about.form.html"></div>
  </WelcomeItem>
</template>
