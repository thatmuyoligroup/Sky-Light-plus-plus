<script setup>
import Data from '../sky/i18n/Default'
import buildGameData from '../sky/Neteasy'
import {computed, getCurrentInstance, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {ElMessage, ElNotification} from "element-plus";
import RunWhere from "./RunWhere.vue";
import WaxShow from "./WaxShow.vue";
import LocalDate from "../sky/LocalDate";
import {stores} from "../stores/stores";
import StringUtils from "./../util/StringUtils.js";
import CryptoJS from "crypto-js";


// --------------------------------------------------------
// 游戏基础数据
// --------------------------------------------------------
let gameData;
/**
 * @type {SkyMap}
 */
let skyMap;
/**
 *
 * @type {SpecialCandlelight}
 */
let specialCandlelight;
/**
 * @type {WhileCandleRule}
 */
let whileCandleRule;
/**
 * @type {CandlelightHarvestPoint}
 */
let candlelightHarvestPoint;
/**
 * @type {Activity}
 */
let activity;
let allBasename;
// --------------------------------------------------------


// --------------------------------------------------------
// 游戏数据
// --------------------------------------------------------
let mapData = reactive({})
let specials;
let harvestPointNames = ref();
let activityData = ref();
// --------------------------------------------------------


// --------------------------------------------------------
// 选择数据
// --------------------------------------------------------
let defaultSpecial = {};
let chooseData = null;
let date = ref(null);
let runWhere = reactive({
  show: false,
  date: date
})

let basemap = reactive({
  all: {},
  any: {}
})
let importData = reactive({
  param: '',
  show: true,
});
// --------------------------------------------------------


// --------------------------------------------------------
// 状态数据
// --------------------------------------------------------
let load = ref(false)
let calculating = ref(false)
let clickControl = {cursor: 0, item: []};
let hasChooseDateLimit = computed(() => {
  let filter = Object.values(chooseData.activity).filter(value => {
    return activityData.value && activityData.value.includes(value.name);
  });
  return filter.length > 0
});

// --------------------------------------------------------


// --------------------------------------------------------
// 结果数据
// --------------------------------------------------------
// 分析结果
let analyzeResult = reactive({});
// 预测参数
let predictParam = reactive({
  candle: 0,
  nextProgress: 0,
  num: 1,
})
// 计算属性-预测数据
const predictData = computed(() => {
  let number = predictParam.candle + (analyzeResult.candle * predictParam.num) +
      Math.floor((analyzeResult.nextProgress * predictParam.num + predictParam.nextProgress) / 100)
  let progress = (analyzeResult.nextProgress * predictParam.num + predictParam.nextProgress) % 100;
  let candlelight = 0;

  if (predictParam.num === 1) {
    //本档合成已收集烛火
    let surplus = analyzeResult.surplus;
    //用户当前的合成进度
    let userProgress = predictParam.nextProgress;
    // 可合成蜡烛
    let candle = (analyzeResult?.candle ?? 0) - (analyzeResult?.used?.candle ?? 0);
    // 本档速率
    let all = gameData.whileCandleRule.calculateTwoCandlelight(candle, candle + 1);
    // 下档速率
    let nextAll = gameData.whileCandleRule.calculateTwoCandlelight(candle + 1, candle + 2);

    candlelight = Math.ceil(合成至完整一根所需烛火(surplus, all, nextAll, userProgress * 0.01))
  }
  return {number, progress, candlelight}
})
// --------------------------------------------------------

// --------------------------------------------------------
// 系统数据
// --------------------------------------------------------
/**
 * 单击延时控制
 * 用于控制小图按钮双击单击事件
 * @desc 原生的双击事件也会触发两次单击事件，为了
 */
let timer = null
let calculateTimer;
let calculateBox;
let loadTimer;
let loadBox;
let hasChooseDateLimitNotification;
// --------------------------------------------------------


onMounted(async () => {
  importData.show = false
  importData.param = ''
  load.value = false;

  loadTimer = setTimeout(() => {
    if (!load.value) {
      loadBox = ElMessage(Data.messageTemplate.loadingGameData);
    }
    loadTimer = null
  }, 500)


  await loadGameBaseData();
  loadGameData();
  loadRuntimeData();


  watch(chooseData, () => {
    loadMapCheckBox();
    calculate();
  });
  watch(date, () => {
    loadMapCheckBox();
    loadGameData();
    calculate();
  })

  watch(() => predictParam.num, () => {
    handleChooseDateLimit();
  })
  watch(() => hasChooseDateLimit.value, () => {
    handleChooseDateLimit();
  })
  load.value = true
  loadBox && loadBox.close()
  calculate()
})
onUnmounted(() => {
  loadTimer && clearTimeout(loadTimer)
  loadTimer = null;
  loadBox && loadBox.close()
  loadBox = null

  calculateTimer && clearTimeout(calculateTimer)
  calculateTimer = null;
  calculateBox && calculateBox.close()
  calculateBox = null
})

function handleChooseDateLimit() {
  if (predictParam.num > 1 && hasChooseDateLimit.value) {
    !hasChooseDateLimitNotification && (hasChooseDateLimitNotification = ElNotification(Data.noticeTemplate.hasChooseActivity));
  } else {
    hasChooseDateLimitNotification && hasChooseDateLimitNotification.close();
    hasChooseDateLimitNotification = null;
  }
}


async function loadGameBaseData() {
  gameData = await buildGameData;
  runWhere.data = {...Data, ...gameData}
  /**
   * @type {SkyMap}
   */
  skyMap = gameData.skyMap;
  /**
   *
   * @type {SpecialCandlelight}
   */
  specialCandlelight = gameData.specialCandlelight;
  /**
   * @type {WhileCandleRule}
   */
  whileCandleRule = gameData.whileCandleRule;
  /**
   * @type {CandlelightHarvestPoint}
   */
  candlelightHarvestPoint = gameData.candlelightHarvestPoint;
  /**
   *
   * @type {Activity}
   */
  activity = gameData.activity;
  allBasename = skyMap.getAllBasename();
}

/**
 * 加载运行时数据
 */
function loadRuntimeData() {
  loadDefaultChooseSpecialCandlelightData()
  loadChooseData()
  loadMapCheckBox()
}

function loadGameData() {
  loadMapData();
  loadSpecialsData();
  loadHarvestPointNames();
  loadActivityData();
}

function loadMapData() {
  allBasename.forEach(basename => {
    let maps = skyMap.getMapsByBasename(basename);
    let newMaps = {};
    let localDate = date.value ? LocalDate.ofDate(date.value) : LocalDate.now();
    maps.forEach((value, key) => {
      let result = value.getCandlelight(localDate);
      let candlelight = result.candlelight;
      let candle = value.getFixedCandle(localDate);
      let float = result.floatCandlelight.float ?? result.floatCandlelight;
      if (candlelight || candle || float) {
        newMaps[key] = value
      }

    })
    mapData[basename] = newMaps
  })
}

function loadSpecialsData() {
  let temp = specialCandlelight.getByNames(specialCandlelight.getNames());
  let result = {};
  temp.forEach(special => {
    if (!special.option.group) {
      result[special.name] = special
      return;
    }

    if (!result[special.option.group.name]) {
      result[special.option.group.name] = {group: special.option.group.name, type: special.option.group.type, item: []};
    }
    result[special.option.group.name].item.push(special)
  })
  specials = Object.values(result);
}

function loadActivityData() {
  activityData.value = activity.getAvailableActivityNames(date.value ? LocalDate.ofDate(date.value) : LocalDate.now());
}

function loadHarvestPointNames() {
  harvestPointNames.value = candlelightHarvestPoint.getAvailableNames(date.value ? LocalDate.ofDate(date.value) : LocalDate.now());
}

/**
 * before the chooseData load
 */
function loadDefaultChooseSpecialCandlelightData() {
  let names = specialCandlelight.getNames();
  names.forEach(name => {
    if (specialCandlelight.getByName(name).lowestCandlelight) {
      defaultSpecial[name] = {name: name, size: 0, enable: false}
      return;
    }

    defaultSpecial[name] = {name: name, size: 0}
  })
}


function loadChooseData() {
  let storeCache = stores['main'].chooseData;
  if (!storeCache) {
    chooseData = gameData.cache = stores['main'].chooseData = reactive({
      maps: {},
      special: {...JSON.parse(JSON.stringify(defaultSpecial))},
      harvestPoint: {},
      activity: {}
    })

  } else {
    chooseData = gameData.cache = storeCache
  }
  runWhere.chooseData = chooseData
}


/**
 * 使用烛火量计算 （合成至完整一根所需烛火）
 * @param 剩余烛火3
 * @param 本档速率4
 * @param 下档速率5
 * @param 用户拥有烛火6
 * @author <a href='https://m.weibo.cn/u/2630772743'>Icetric冰介</a>
 * @return {number} 合成至完整一根所需烛火
 */
function 合成至完整一根所需烛火(剩余烛火3, 本档速率4, 下档速率5, 用户拥有烛火6) {
  let 初始线至合成烛所需烛火 = 本档速率4 - 本档速率4 * 用户拥有烛火6;
  let 至初始线所需烛火降档所需烛火 = 本档速率4 - 初始线至合成烛所需烛火;

  if (剩余烛火3 <= 初始线至合成烛所需烛火) {
    return 初始线至合成烛所需烛火 - 剩余烛火3;
  } else if (剩余烛火3 > 初始线至合成烛所需烛火) {
    let 中间值11;
    中间值11 = 剩余烛火3 - 初始线至合成烛所需烛火;
    let 新速率初始线至合成烛所需烛火12;
    新速率初始线至合成烛所需烛火12 = 下档速率5 - 下档速率5 * 用户拥有烛火6;

    return 至初始线所需烛火降档所需烛火 - 中间值11 + 新速率初始线至合成烛所需烛火12
  }
}

/**
 * 使用百分比计算 （合成至完整一根所需烛火）
 * @param userProgress 用户当前合成进度
 * @param nextAll 下档速率
 * @return {number} 合成至完整一根所需烛火
 * @author jianjianghui
 */
function calculateNextCandleNeedWaxByPercentage(userProgress, nextAll) {
  //本档合成进度
  let progress = analyzeResult.nextProgress;
  //本档合成还需要的进度
  let needProgress = 100 - progress;
  // 本档合成还需收集烛火
  let need = analyzeResult.after[0];
  // 可合成蜡烛
  let candle = (analyzeResult?.candle ?? 0) - (analyzeResult?.used?.candle ?? 0);
  // 最终的合成进度=本档合成的进度 +用户当前的合成进度
  let finalProgress = (progress + userProgress);
  // 最终显示的合成进度 = 最终的合成进度%100
  let finalShowProgress = finalProgress % 100;
  // 再合成一根时下档需要的烛火
  let nextNeed = (100 - (finalShowProgress + needProgress)) / 100 * nextAll;
  return Math.ceil(need + nextNeed)
}

function singleClick(handle, delay, ...args) {
  return function () {
    let cursor = clickControl.cursor = clickControl.cursor ? 0 : 1;
    if (clickControl.cursor) {
      clickControl.item[0] = args[0]
    } else {
      clickControl.item[1] = args[0]
    }


    if (timer) {
      clearTimeout(timer)
      timer = null
      return
    }

    timer = setTimeout(() => {

      handle(...args)
      clearTimeout(timer)
      timer = null
    }, delay)
  }
}

function doubleClick(map) {
  if (clickControl.item[0].name !== clickControl.item[1].name) {
    return;
  }

  allRun(map)
}

function allRun(map) {
  clearTimeout(timer)
  timer = null
  if (chooseData.maps[map.name]) {
    delete chooseData.maps[map.name]
  } else {
    if (skyMap.getMapByName(map.name).groupCandlelight) {
      chooseData.maps[map.name] = {name: map.name, group: {}}
    } else {
      chooseData.maps[map.name] = {name: map.name}
    }

  }

}

function run(map) {
  let mapViewElement = gameData.mapViewData.mapView[map.name];
  if (mapViewElement?.type === 'un_support') {
    ElNotification({
      title: mapViewElement?.title ?? gameData.mapViewData.default.un_support.title,
      message: (mapViewElement?.content ?? gameData.mapViewData.default.un_support.content)
          .replaceAll('${name}', map.name)
          .replaceAll('${size}', map.candlelightPoints.size)
          .replaceAll("${candlelight}", skyMap.getCandlelightByName(map.name).candlelight + ((skyMap.getCandlelightByName(map.name).floatCandlelight.fixed ?? 0) - (skyMap.getCandlelightByName(map.name).floatCandlelight.float ?? skyMap.getCandlelightByName(map.name).floatCandlelight)))
      ,
      type: mapViewElement?.tag ?? gameData.mapViewData.default.un_support.tag,
    })
    allRun(map)
    return;
  }
  runWhere.obj = map;
  runWhere.show = true;
}

function special(item) {
  if (chooseData.special[item.name]) {
    let specialElement = chooseData.special[item.name];
    if (specialElement.size === item.size) {
      chooseData.special[item.name] = {name: item.name, size: 0}
      return;
    }
  }
  chooseData.special[item.name] = {name: item.name, size: item.size}
}

function point(name) {
  if (chooseData.harvestPoint[name]) {
    delete chooseData.harvestPoint[name];
  } else {
    chooseData.harvestPoint[name] = 1
  }
}

function activityFunc(item) {
  if (chooseData.activity[item.name]) {
    delete chooseData.activity[item.name];
  } else {
    chooseData.activity[item.name] = {name: item.name, option: {}};
  }
}

function resolveAnalyzeData() {
  let maps = Object.values(chooseData.maps).filter(value => {
    return !(value.ignoreCodes && value.ignoreCodes.length === skyMap.getCandlelightPointCodesByName(value.name).length);

  }).map(value => {
    if (value.group) {
      if (value.group && !Object.keys(value.group).length) {
        return {name: value.name}
      }
      let importCodes = [];
      Object.keys(value.group).forEach(key => {
        let code = key + value.group[key].size;
        importCodes.push(code)
      })
      return {name: value.name, importCodes};
    } else {
      return {name: value.name, ignoreCodes: value.ignoreCodes ? [...value.ignoreCodes] : []}
    }
  })

  let specials = Object.values(chooseData.special).filter(value => {
    if (value.enable === true) {
      return true
    }

    return value.enable === false ? false : value.size > 0
  }).map(value => {
    return {name: value.name, size: value.size};
  });

  let points = Object.keys(chooseData.harvestPoint)

  let activities = Object.values(chooseData.activity).filter(value => {
    return activityData.value && activityData.value.includes(value.name);
  });
  return {maps, specials, points, activities};
}

function calculate() {
  calculating.value = true
  if (calculateTimer) {
    clearTimeout(calculateTimer)
    calculateBox = null
    calculateTimer = null
  }

  calculateTimer = setTimeout(() => {
    if (calculating.value) {
      calculateBox = ElMessage(Data.messageTemplate.calculating);
    }
    calculateTimer = null
  }, 300)

  setTimeout(() => {
    analyze0(date.value ? LocalDate.ofDate(date.value) : LocalDate.now()).then(value => {
      for (let key of Object.keys(value)) analyzeResult[key] = value[key];
      calculateBox && calculateBox.close()
      calculating.value = false
      let s = getCurrentInstance()
      s?.ctx?.$forceUpdate();
    })
  }, 1)
}

async function analyze0(date = LocalDate.now()) {
  let {maps, specials, points, activities} = resolveAnalyzeData();
  return await gameData.service.analyze(date, {
    maps: maps,
    special: specials,
    harvestPoint: points,
    activities: activities
  });

}

function clear() {
  chooseData.maps = {}
  chooseData.special = {...JSON.parse(JSON.stringify(defaultSpecial))};
  chooseData.harvestPoint = {};
  chooseData.activity = {};

  Object.keys(analyzeResult).map(key => {
    delete analyzeResult[key]
  })

  predictParam.candle = 0;
  predictParam.nextProgress = 0
  predictParam.num = 1

  date.value = null

  importData.param = ''
  let s = getCurrentInstance()
  s?.ctx?.$forceUpdate();
  importData.show = false
}

function exportParam() {
  let text = encryptObj(chooseData);

  function oldVersion() {
    const input = document.createElement("textarea");
    input.style.position = 'fixed';
    input.style.top = 0;
    input.style.left = 0;
    input.style.width = '2em';
    input.style.height = '2em';
    // We don't need padding, reducing the size if it does flash render.
    input.style.padding = 0;

    // Clean up any borders.
    input.style.border = 'none';
    input.style.outline = 'none';
    input.style.boxShadow = 'none';
    input.style.background = 'transparent';
    input.value = text;


    // input.setAttribute('readonly', 'readonly');
    // input.setAttribute('style', 'position:float;');
    // input.setAttribute('value', encryptObj(chooseData));
    document.body.appendChild(input);
    input.focus();
    input.select();
    let successful = document.execCommand('copy');
    if (successful) {
      ElMessage({
        message: Data.start.resultTitle.button.export.success,
        type: 'success',
      })
    } else {
      ElMessage({
        message: Data.start.resultTitle.button.export.fail,
        type: 'error',
      })
    }
    document.body.removeChild(input);
  }

  if (!navigator.clipboard) {
    oldVersion();
    return;
  }

  navigator.clipboard.writeText(text).then(function () {
    ElMessage({
      message: Data.start.resultTitle.button.export.success,
      type: 'success',
    })
  }, function (err) {
    oldVersion();
  });


}

function importBegin() {
  importData.show = true
}

function importEnd() {
  let param = importData.param;

  try {
    let data = decryptObj(param)

    let hasKey = data['maps'] && data['special'] && data['harvestPoint'] && data['activity'] && true;
    let hasContent = data['maps'] instanceof Object && data['special'] instanceof Object
        && data['harvestPoint'] instanceof Object && data['activity'] instanceof Object && true;
    let success = hasKey && hasContent
    if (!success) {
      ElMessage({
        message: Data.start.resultTitle.button.import.error, type: 'error'
      });
      return;
    }

    importData.show = false
    chooseData.maps = data['maps'];
    chooseData.special = data['special'];
    chooseData.harvestPoint = data['harvestPoint'];
    chooseData.activity = data['activity'];
    ElMessage({
      message: Data.start.resultTitle.button.import.success,
      type: 'success',
    })

  } catch (e) {
    console.error(e)
    ElMessage({
      message: Data.start.resultTitle.button.import.error, type: 'error'
    });
  }
}


function loadMapCheckBox() {
  allBasename.forEach(basename => {
    let mapNames = [...skyMap.getMapsByBasename(basename).keys()];
    let all = true;
    let any = false;
    mapNames.forEach(name => {
      let value = skyMap.getMapByName(name);
      let result = value.getCandlelight();
      let candlelight = result.candlelight;
      let candle = value.getFixedCandle();
      let float = result.floatCandlelight.float ?? result.floatCandlelight;
      if (candlelight || candle || float) {
        let map = chooseData.maps[name];
        let contains = !!map;
        all = all && contains && noLimit(name)
        any = any || (contains && noAllIgnore(name))
      }
    })
    basemap.all[basename] = all ?? false;
    basemap.any[basename] = (any && !all) ?? false;
  })
}

function noAllIgnore(name) {
  let map = skyMap.getMapByName(name);
  let isGroup = !!(map.groupCandlelight && map.groupCandlelight.size);
  let chooseMap = chooseData.maps[name];

  function noAllIgnoreGroup() {
    let condition1 = () => !chooseMap.group;
    let condition2 = () => !Object.keys(chooseMap.group).length;
    if (condition1() || condition2()) {
      return true;

    }
    let allIgnore = true;
    let keys = Object.keys(chooseMap.group);
    for (let key of keys) {
      allIgnore = allIgnore && (chooseMap.group[key].size === 0)
    }
    return !allIgnore;
  }

  if (isGroup) {
    return noAllIgnoreGroup()
  }

  let availableCodes = skyMap.getCandlelightPointCodesByName(name)
      .filter(code0 => {
        return skyMap.getMapByName(name).candlelightPoints.get(code0)
            .available(date.value ? LocalDate.ofDate(date.value) : LocalDate.now());
      });

  let ignoreCodes = chooseData.maps[name].ignoreCodes?.filter(code0 => availableCodes.includes(code0)) ?? [];

  return ignoreCodes.length < availableCodes.length;
}

function noLimit(name) {
  let map = skyMap.getMapByName(name);
  let isGroup = !!(map.groupCandlelight && map.groupCandlelight.size);
  let chooseMap = chooseData.maps[name];

  function noLimitGroup() {
    ``
    let condition1 = () => !chooseMap.group;
    let condition2 = () => !Object.keys(chooseMap.group).length;
    if (condition1() || condition2()) {
      return true;

    }
    let noLimit = true;
    let keys = Object.keys(chooseMap.group);
    for (let key of keys) {
      noLimit = noLimit && (chooseMap.group[key].size === chooseMap.group[key].maxSize)
    }
    return noLimit;
  }

  if (isGroup) {
    return noLimitGroup()
  }

  let availableCodes = skyMap.getCandlelightPointCodesByName(name)
      .filter(code0 => {
        return skyMap.getMapByName(name).candlelightPoints.get(code0)
            .available(date.value ? LocalDate.ofDate(date.value) : LocalDate.now());
      });

  let ignoreCodes = chooseData.maps[name].ignoreCodes?.filter(code0 => availableCodes.includes(code0)) ?? [];

  return ignoreCodes.length === 0;
}

function baseAll(checked, basename) {
  [...skyMap.getMapsByBasename(basename).keys()].forEach(name => {
    let value = skyMap.getMapByName(name);
    let result = value.getCandlelight();
    let candlelight = result.candlelight;
    let candle = value.getFixedCandle();
    let float = result.floatCandlelight.float ?? result.floatCandlelight;
    if (candlelight || candle || float) {
      checked ? chooseData.maps[name] = {name: name} : delete chooseData.maps[name]
    }

  })
}

function getMapType(name) {
  let hasMap = chooseData && chooseData.maps && chooseData.maps[name];
  if (!hasMap) {
    return ''
  }

  let map = chooseData.maps[name];
  if (map.group) {
    let all = true
    let empty = true;
    if (map.group && !Object.keys(map.group).length) {
      return 'success'
    }

    map.group && Object.keys(map.group).forEach((key) => {
      empty = empty && (map.group[key].size === 0)
      all = all && (map.group[key].size === map.group[key].maxSize);
    })
    return empty ? '' : all ? 'success' : 'primary';
  }

  if (!chooseData.maps[name].ignoreCodes || !chooseData.maps[name].ignoreCodes.length) {
    return 'success';
  }

  let availableCodes = skyMap.getCandlelightPointCodesByName(name)
      .filter(code0 => {
        return skyMap.getMapByName(name).candlelightPoints.get(code0)
            .available(date.value ? LocalDate.ofDate(date.value) : LocalDate.now());
      });


  let ignoreCodes = chooseData.maps[name].ignoreCodes?.filter(code0 => availableCodes.includes(code0)) ?? [];

  if (ignoreCodes.length === 0) {
    return 'success'
  }

  if (ignoreCodes.length >= availableCodes.length) {
    return ''
  }

  return 'primary'
}

function getSpecialType(name) {
  let has = chooseData && chooseData.special && chooseData.special[name];
  if (!has) {
    return ''
  }

  let special = specialCandlelight.getByName(name);
  let maxSize = special.maxSize;
  let lowestCandlelight = special.lowestCandlelight;
  if (!lowestCandlelight && chooseData.special[name].size === 0) {
    return ''
  }
  if (lowestCandlelight && !chooseData.special[name].enable) {
    return ''
  }
  if (!lowestCandlelight && chooseData.special[name].size === 0) {
    return ''
  }

  if (maxSize > chooseData.special[name].size) {
    return 'primary';
  }

  if (lowestCandlelight && chooseData.special[name].enable && chooseData.special[name].size > maxSize) {
    return 'primary'
  }

  return 'success'
}

function chooseSpecial(name) {
  let specialElement = chooseData.special[name];
  let special = specialCandlelight.getByName(name);

  // 非最低烛火的特殊处理
  if (!special.lowestCandlelight) {
    if (chooseData.special[name].size) {
      chooseData.special[name].size = 0
    } else {
      chooseData.special[name].size = special?.option?.inputStep?.step ?? 1
    }
    return;
  }

  if (specialElement.enable) {
    chooseData.special[name] = JSON.parse(JSON.stringify(defaultSpecial[name]))
  } else {
    chooseData.special[name].enable = true
  }

}

/**
 *
 * @param obj  {Object}
 * @return  {String} ciphertext
 */
function encryptObj(obj) {
  return CryptoJS.AES.encrypt(JSON.stringify(obj), gameData.aesKey).toString();
}

/**
 *
 * @param ciphertext {String}
 * @return {Object}
 */
function decryptObj(ciphertext) {
  let bytes = CryptoJS.AES.decrypt(ciphertext, gameData.aesKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}


</script>
<template>
  <div class="about">
    <div class="common-layout">
      <el-container>
        <el-main>
          <!--  选择        -->
          <el-collapse class="start-box">
            <el-collapse-item :title="Data.start.candlelightTitle.map" name="1">
              <el-collapse style="margin: 0 auto; width: 90%">
                <el-collapse-item v-for="(value,key,index) in mapData" :name="index">
                  <template #title>
                    <el-checkbox
                        :key="basemap"
                        v-model="basemap.all[key]"
                        :indeterminate="basemap.any[key]"
                        @change="checked=>baseAll(checked,key)" @click.stop.native="()=>{}"
                    >{{ '' }}
                    </el-checkbox>
                    {{ key }}
                  </template>
                  <el-button v-for="(item,name) in value"
                             :type="getMapType(name)"
                             style="margin: 5px 0 0 5px"
                             @click="singleClick(run,550,item)()"
                             @dblclick.stop="doubleClick(item)">
                    {{ name }}
                  </el-button>
                </el-collapse-item>
              </el-collapse>
            </el-collapse-item>
            <el-collapse-item :title="Data.start.candlelightTitle.special" name="2">
              <el-collapse style="margin: 0 auto; width: 90%">
                <template v-for="item in specials">
                  <!--     group             -->
                  <div v-if="item.group && item.type === 'button'">
                    <el-collapse-item :title="item.group">
                      <div style="margin: 0 auto; width: 96%">
                        <el-row v-for="special of item.item" style="margin-bottom: 5px">
                          <el-col>
                            <el-button
                                :type="getSpecialType(special.name)"
                                @click.stop="chooseSpecial(special.name)"
                                @dblclick.stop="()=>{}">
                              {{ special.name }}
                            </el-button>
                            {{ special.option.inputPlaceholder }}
                            <el-input-number v-if="special.option.input"
                                             v-model="chooseData.special[special.name].size"
                                             :disabled="special.lowestCandlelight?!chooseData.special[special.name].enable:false"
                                             :max="special.maxSize"
                                             :min="0"
                                             v-bind="{
                                           step: special.option.inputStep && special.option.inputStep.step && (special.option.inputStep.step),
                                        'step-strictly' : special.option.inputStep && special.option.inputStep.strictly &&  (special.option.inputStep.strictly)
                                         }"
                                             @dblclick.stop="()=>{}"
                            />
                          </el-col>
                        </el-row>
                      </div>
                    </el-collapse-item>
                  </div>

                  <div v-if="chooseData && chooseData.special && chooseData.special[item.name]">
                    <el-collapse-item v-if="item.option" :title="item.name">
                      <div style="margin: 0 auto; width: 96%">
                        <div>
                          {{ item.option.inputPlaceholder }}
                          <el-input-number v-if="item.option.input"
                                           v-model="chooseData.special[item.name].size"
                                           :max="item.maxSize" :min="0"
                                           v-bind="{
                                           step: item.option.inputStep && item.option.inputStep.step && (item.option.inputStep.step),
                                        'step-strictly' : item.option.inputStep && item.option.inputStep.strictly &&  (item.option.inputStep.strictly)
                                         }"
                                           @dblclick.stop="()=>{}"
                          />
                        </div>
                        <div style="margin-top: 5px">
                          {{ item.option.selectPlaceholder }}
                          <el-button v-for="selectItem in item.option.selectItem" :type="chooseData.special[item.name].size === selectItem.size
                              ?'success':''"
                                     style="margin: 0 0 5px 5px"
                                     @click="special({name:item.name,size:selectItem.size,selectItem:selectItem})"
                                     @dblclick.stop="()=>{}">
                            {{ selectItem.name }}
                          </el-button>
                        </div>
                      </div>
                    </el-collapse-item>
                    <el-button v-else :type="getSpecialType(item.name)"
                               style="margin: 5px 0 5px 5px"
                               @click="special({name:item.name,size:item.maxSize})">
                      {{ item.name }}
                    </el-button>
                  </div>
                </template>
              </el-collapse>
            </el-collapse-item>
            <el-collapse-item :title="Data.start.candlelightTitle.point" name="3">
              <el-button v-for="(item) in harvestPointNames"
                         :type="chooseData && chooseData.harvestPoint[item] ?'success':''"
                         style="margin:5px 0 0  5px"
                         @click="point(item)"
                         @dblclick.stop="()=>{}">
                {{ item }}
              </el-button>
            </el-collapse-item>
            <el-collapse-item v-if="activityData && activityData.length" :title="Data.start.candlelightTitle.activity"
                              name="4">
              <el-button v-for="(item) in activityData"
                         :type="chooseData && chooseData.activity[item] ?'success':''"
                         style="margin:5px 0 0  5px"
                         @click="activityFunc({name:item})"
                         @dblclick.stop="()=>{}">
                {{ item }}
              </el-button>
            </el-collapse-item>
            <el-row>
              <el-col :span="24">
                <el-date-picker
                    v-model="date"
                    :placeholder="Data.start.datePlaceholder"
                    style="margin: 3px auto; width: 100%"
                    type="date"
                />
              </el-col>
            </el-row>
          </el-collapse>

          <!--  结果    -->
          <div class="start-box" style="margin-top: 20px">
            <el-row>
              <el-col :span="24">
                <el-divider><span style="font-weight: 700">{{ Data.start.resultTitle.overview.title }}</span>
                </el-divider>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div>{{ Data.start.resultTitle.overview.candle }}{{
                    (analyzeResult?.candle ?? 0)
                  }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                {{
                  StringUtils.format(Data.start.resultTitle.overview.next, {
                    surplus: analyzeResult.surplus ?? 0,
                    nextProgress: analyzeResult.nextProgress ?? 0
                  })
                }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                {{ Data.start.resultTitle.overview.after }}
                <span
                    v-for="(item,index) in analyzeResult.after">{{
                    item === Infinity ? '∞' : item
                  }}{{ index !== analyzeResult.after.length - 1 ? Data.separator : '' }}</span>
              </el-col>
            </el-row>

            <template v-if="analyzeResult.nextProgress || analyzeResult.candle">
              <el-row>
                <el-col>
                  <el-divider style="margin-top: 40px">
                    <span style="font-weight: 700">{{ Data.start.resultTitle.detail.title }}</span>
                  </el-divider>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-collapse accordion>
                    <!-- 计划以内 -->
                    <el-collapse-item v-if="analyzeResult.used" name="1"
                                      style="text-overflow:ellipsis;overflow: no-display">
                      <template #title>
                        <el-row style="width: 100%;height: 100%;overflow: hidden">
                          <el-col style="width: 100%;height: 100%">
                            {{ Data.start.resultTitle.detail.used }}
                            <el-divider direction="vertical"/>
                            <WaxShow :obj="analyzeResult?.used"></WaxShow>
                          </el-col>
                        </el-row>
                      </template>

                      <el-collapse accordion>
                        <el-collapse-item name="1" style="margin: 0 auto; width: 96%">
                          <template #title>
                            <el-row style="width: 100%;height: 100%;overflow: hidden">
                              <el-col style="width: 100%;height: 100%">
                                {{ Data.start.candlelightTitle.map }}
                                <el-divider direction="vertical"/>
                                <WaxShow :obj="analyzeResult?.used?.detail?.maps?.candlelight"></WaxShow>
                              </el-col>
                            </el-row>
                          </template>
                          <el-collapse style="margin: 0 auto; width: 96%">
                            <el-collapse-item v-for="(value,key,index) in  analyzeResult?.used?.detail?.maps?.item"
                                              :name="index">
                              <template #title>
                                <el-row style="width: 100%;height: 100%;overflow: hidden">
                                  <el-col style="width: 100%;height: 100%">
                                    {{ key }}
                                    <el-divider direction="vertical"/>
                                    <WaxShow :obj="value.candlelight"></WaxShow>
                                  </el-col>
                                </el-row>
                              </template>
                              <!-- 小图-->
                              <el-row v-for="(value,key,index) in  value?.item"
                                      :name="index" style="margin: 0 auto; width: 96%">
                                <el-col>
                                  {{ key }}
                                  <el-divider direction="vertical"/>
                                  <WaxShow :obj="value.candlelight"></WaxShow>
                                </el-col>
                              </el-row>
                            </el-collapse-item>
                          </el-collapse>
                        </el-collapse-item>
                        <el-collapse-item name="2" style="margin: 0 auto; width: 96%">
                          <template #title>
                            {{ Data.start.candlelightTitle.special }}
                            <el-divider direction="vertical"/>
                            <WaxShow :obj="analyzeResult?.used?.detail?.special?.candlelight"></WaxShow>
                          </template>
                          <el-collapse style="margin: 0 auto; width: 96%">
                            <el-row v-for="(value,key,index) in  analyzeResult?.used?.detail?.special?.item"
                                    :name="index">
                              <el-col>
                                {{ key }}
                                <el-divider direction="vertical"/>
                                <WaxShow :obj="value.candlelight"></WaxShow>
                              </el-col>
                            </el-row>
                          </el-collapse>
                        </el-collapse-item>
                        <el-collapse-item name="3" style="margin: 0 auto; width: 96%">
                          <template #title>
                            {{ Data.start.candlelightTitle.point }}
                            <el-divider direction="vertical"/>
                            <WaxShow :obj="analyzeResult?.used?.detail?.harvestPoint?.candlelight"></WaxShow>
                          </template>
                          <el-row v-for="(value,key,index) in  analyzeResult?.used?.detail?.harvestPoint?.item"
                                  :name="index">
                            <el-col>
                              {{ key }}
                              <el-divider direction="vertical"/>
                              <WaxShow :obj="value.candlelight"></WaxShow>
                            </el-col>
                          </el-row>
                        </el-collapse-item>
                        <el-collapse-item name="4" style="margin: 0 auto; width: 96%">
                          <template #title>
                            {{ Data.start.candlelightTitle.activity }}
                            <el-divider direction="vertical"/>
                            <WaxShow :obj="analyzeResult?.used?.detail?.activity?.candlelight"></WaxShow>
                          </template>
                          <el-row v-for="(value,key,index) in  analyzeResult?.used?.detail?.activity?.item"
                                  :name="index">
                            <el-col>
                              {{ key }}
                              <el-divider direction="vertical"/>
                              <WaxShow :obj="value.candlelight"></WaxShow>
                            </el-col>
                          </el-row>
                        </el-collapse-item>
                      </el-collapse>
                    </el-collapse-item>

                    <!-- 计划以外 -->
                    <el-collapse-item v-if="analyzeResult.unused" name="2">
                      <template #title>
                        <el-row style="width: 100%;height: 100%;overflow: hidden">
                          <el-col style="width: 100%;height: 100%">
                            {{ Data.start.resultTitle.detail.unused }}
                            <el-divider direction="vertical"/>
                            <WaxShow :obj=" analyzeResult?.unused"></WaxShow>
                          </el-col>
                        </el-row>
                      </template>
                      <el-collapse accordion>
                        <el-collapse-item name="1" style="margin: 0 auto; width: 96%">
                          <template #title>
                            {{ Data.start.candlelightTitle.map }}
                            <el-divider direction="vertical"/>
                            <WaxShow :obj=" analyzeResult?.unused?.detail?.maps?.candlelight"></WaxShow>
                          </template>
                          <el-collapse style="margin: 0 auto; width: 96%">
                            <el-collapse-item v-for="(value,key,index) in  analyzeResult?.unused?.detail?.maps?.item"
                                              :name="index">
                              <template #title>
                                {{ key }}
                                <el-divider direction="vertical"/>
                                <WaxShow :obj="value.candlelight"></WaxShow>
                              </template>
                              <!-- 小图-->
                              <el-row v-for="(value,key,index) in  value?.item"
                                      :name="index" style="margin: 0 auto; width: 96%">
                                <el-col>
                                  {{ key }}
                                  <el-divider direction="vertical"/>
                                  <WaxShow :obj="value.candlelight"></WaxShow>
                                </el-col>
                              </el-row>
                            </el-collapse-item>
                          </el-collapse>
                        </el-collapse-item>


                        <el-collapse-item name="3" style="margin: 0 auto; width: 96%">
                          <template #title>
                            {{ Data.start.candlelightTitle.point }}
                            <el-divider direction="vertical"/>
                            <WaxShow :obj="analyzeResult?.unused?.detail?.harvestPoint?.candlelight"></WaxShow>
                          </template>
                          <el-row v-for="(value,key,index) in  analyzeResult?.unused?.detail?.harvestPoint?.item"
                                  :name="index">
                            <el-col>
                              {{ key }}
                              <el-divider direction="vertical"/>
                              <WaxShow :obj="value.candlelight"></WaxShow>
                            </el-col>
                          </el-row>
                        </el-collapse-item>
                      </el-collapse>
                    </el-collapse-item>
                  </el-collapse>
                </el-col>
              </el-row>
            </template>


            <!--      预测      -->
            <template v-if="analyzeResult.nextProgress || analyzeResult.candle">
              <el-row>
                <el-col :span="24">
                  <el-divider style="margin-top: 40px"><span
                      style="font-weight: 700">{{ Data.start.resultTitle.predict.title }}</span></el-divider>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  {{ Data.start.resultTitle.predict.hasCandle }}
                  <el-input-number v-model="predictParam.candle" :max="100000" :min="0" @dblclick.stop="()=>{}"/>
                </el-col>
              </el-row>
              <el-divider/>
              <el-row>
                <el-col>
                  {{ Data.start.resultTitle.predict.hasNextProgress }}
                  <el-input-number v-model="predictParam.nextProgress" :max="99" :min="0" @dblclick.stop="()=>{}"/>
                </el-col>
              </el-row>
              <el-divider/>
              <el-row>
                <el-col>
                  {{ Data.start.resultTitle.predict.hasCount_before }}
                  <el-input-number v-model="predictParam.num" :max="3650" :min="1" @dblclick.stop="()=>{}"/>
                  {{ Data.start.resultTitle.predict.hasCount_after }}
                </el-col>
              </el-row>
              <el-divider/>
              <el-row>
                <el-col :span="24">
                  {{
                    StringUtils.format(Data.start.resultTitle.predict.result, {
                      count: predictParam.num,
                      candle: predictData.number
                    })
                  }}
                </el-col>
              </el-row>
              <el-row>
                <el-col v-if="predictParam.num <=1" :span="24">
                  {{
                    StringUtils.format(Data.start.resultTitle.predict.nextProgress, {nextProgress: predictData.progress})
                  }}
                </el-col>
              </el-row>
              <el-row v-if="predictParam.num <=1 && predictData.candlelight">
                <el-col :span="24">
                  {{
                    StringUtils.format(Data.start.resultTitle.predict.nextNeedCandlelight, {
                      candlelight: predictData.candlelight
                    })
                  }}
                </el-col>
              </el-row>
            </template>
          </div>
        </el-main>
        <!--   按钮     -->
        <el-footer>
          <el-affix :offset="20" position="bottom">
            <div class="start-bottom-box">
              <!--              <el-button :loading="calculating" round type="primary" @click="calculate" @dblclick.stop="()=>{}">-->
              <!--                {{ Data.start.resultTitle.button.calculate }}-->
              <!--              </el-button>-->
              <el-button :loading="!load" round type="success" @click="clear" @dblclick.stop="()=>{}">
                {{ Data.start.resultTitle.button.clear }}
              </el-button>
              <el-button :loading="!load" round type="danger" @click="exportParam" @dblclick.stop="()=>{}">
                {{ Data.start.resultTitle.button.export.title }}
              </el-button>
              <el-button :loading="!load" round type="warning" @click="importBegin" @dblclick.stop="()=>{}">
                {{ Data.start.resultTitle.button.import.title }}
              </el-button>
            </div>
          </el-affix>
        </el-footer>
      </el-container>
    </div>
    <RunWhere v-if="load" :run-where="runWhere"/>
    <el-dialog v-model="importData.show" :title="Data.start.resultTitle.button.import.boxTitle">
      <!--   ios Bug   -->
      <!--      <el-input-->
      <!--          v-model="importData.param"-->
      <!--          :autosize="{ minRows: 5}"-->
      <!--          :placeholder="Data.start.resultTitle.button.import.placeholder"-->
      <!--          type="textarea"-->
      <!--      />-->
      <div class="el-textarea"><!-- input --><!-- textarea -->
        <textarea v-model="importData.param"
                  :placeholder="Data.start.resultTitle.button.import.placeholder"
                  autocomplete="off"
                  class="el-textarea__inner"
                  style="min-height: 115px; height: 115px;" tabindex="0"></textarea>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="importEnd">
          {{ Data.start.resultTitle.button.import.confirm }}
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>

.common-layout {
  width: 100%;
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
