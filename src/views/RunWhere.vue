<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import L from "leaflet";
import LocalDate from "../sky/LocalDate.js";
import Data from '../sky/i18n/Default'


let props = defineProps({
  runWhere: Object
});
let runWhere = props.runWhere;
runWhere.windows = {loading: false}
let map = null
let imageLayer = null
let layerGroup = L.layerGroup();
let LayerMap = {};
let ready = ref(false);
let choose = reactive({
  all: false,
  any: false,
})
let groupCandlelight = ref();
let groupData = reactive({
  item: {}
});

onMounted(() => {
})

/**
 * @deprecated
 */
function watchMapData() {
  watch(runWhere.chooseData.maps, () => {
    if (!runWhere.gis) {
      return;
    }

    loadCheckboxByRunWhere();
  })
}

function loadCheckbox(obj, skyMap) {
  let name = obj.name;
  let candlelightPointCodesByName = skyMap.getCandlelightPointCodesByName(name);

  /**
   *
   * @type {InternalSkyMap}
   */
  let mapByName = skyMap.getMapByName(name);
  let mapData = runWhere.chooseData.maps[name];

  if (!mapData) {
    return;
  }

  let date = runWhere.date;
  let availableCodes = candlelightPointCodesByName
      .filter(code0 => {
        return mapByName.candlelightPoints.get(code0)
            .available(date ? LocalDate.ofDate(date) : LocalDate.now());
      });


  let ignoreCodes = mapData.ignoreCodes?.filter(code0 => availableCodes.includes(code0)) ?? [];
  if (!ignoreCodes || !ignoreCodes.length) {
    choose.all = true
    choose.any = false
    return;
  }

  if (ignoreCodes && ignoreCodes.length && ignoreCodes.length < availableCodes.length) {
    choose.all = false
    choose.any = true
    return;
  }


  choose.any = false
  choose.all = false

}

function load() {

  map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -3,
    maxZoom: 0,
    zoomControl: false,
    attributionControl: false,

  });
  layerGroup.addTo(map);

  imageLayer && imageLayer.remove()
  imageLayer = null;
  layerGroup.clearLayers();
  LayerMap = {};
  groupData.item = {};
  groupCandlelight.value = null;
  ready.value = false;
  runWhere.gis = false;
  runWhere.group = false;
  runWhere.error = false;
  runWhere.loading = false;
  runWhere.group = false;
  runWhere.unknow = false;


  let data = runWhere.data;
  /**
   * @type{ SkyMap}
   */
  let skyMap = data.skyMap;

  let chooseData = runWhere.chooseData;

  /**
   *
   * @type {InternalSkyMap}
   */
  const obj = runWhere.obj
  let name = obj.name

  if (obj.groupCandlelight) {
    // 以组划分的
    groupCandlelight.value = Object.fromEntries(obj.groupCandlelight)
    runWhere.group = true;
    if (!chooseData.maps[obj.name]) {
      chooseData.maps[obj.name] = {name: obj.name}
    }

    if (!chooseData.maps[obj.name].group) {
      chooseData.maps[obj.name].group = {}
    }

    obj.groupCandlelight.forEach((value, key) => {
      if (!chooseData.maps[obj.name].group[key]) {
        chooseData.maps[obj.name].group[key] = {size: 0, maxSize: value};
      }
    })


    return;
  }


  let mapView = data.mapViewData.mapView[obj.name];
  if (mapView && mapView.type === 'gis') {
    runWhere.loading = true;
    runWhere.gis = true;
    let image = new Image();
    image.onload = function () {
      if (!map || name !== runWhere.obj.name) {
        return;
      }

      // dynamic
      // let imgBounds = [[0, 0], [image.height, image.width]];
      let imgBounds = [[0, 0], [mapView.height, mapView.width]];
      let maxBounds = [[-(mapView.height / 5), (-mapView.width / 5)], [mapView.height + mapView.height / 5, mapView.width + mapView.width / 5]];
      imageLayer = L.imageOverlay(image, imgBounds).addTo(map);
      runWhere.loading = false;
      map.setMaxBounds(maxBounds)
      ready.value = true;
      setTimeout(() => {
        map.fitBounds(imgBounds);
      }, 20)


      //加载地图数据
      if (!chooseData.maps[obj.name]) {
        chooseData.maps[obj.name] = {name: obj.name}
      }
      loadCheckboxByRunWhere();

      // 加载地图点数据
      let mapByName = skyMap.getMapByName(obj.name);
      let candlelightPoints = mapByName.candlelightPoints;
      mapView.points.forEach(point => {
        let code = point.code;
        let date = runWhere.date;
        let geoJSON = point.geoJSON;
        let layer;
        if (candlelightPoints.get(code).appearIn && candlelightPoints.get(code).appearIn.length &&
            !candlelightPoints.get(code).appearIn.includes((date ? LocalDate.ofDate(date) : LocalDate.now()).getDayOfWeek())) {
          layer = L.geoJSON(geoJSON, {
            style: function () {
              return runWhere.data.mapViewData.metadata.gis.ignore
            }
          })
        } else if (chooseData.maps[obj.name].ignoreCodes &&
            chooseData.maps[obj.name].ignoreCodes.includes(code)) {
          layer = createWhite(geoJSON);
        } else {
          layer = createGreed(geoJSON)
        }

        LayerMap[code] = {code: code, layer: layer};
        layerGroup.addLayer(layer)

      })


    }
    image.onerror = function () {
      if (!map) {
        return;
      }

      runWhere.loading = false;
      runWhere.gis = false;
      runWhere.error = true;
    }
    image.src = mapView.img
    return;
  }

  runWhere.unknow = true
}

function createGreed(geoJSON) {
  const obj = runWhere.obj
  return L.geoJSON(geoJSON, {
    style: function () {
      return runWhere.data.mapViewData.metadata.gis.selected
    }
  }).on('click', function (e) {
    let code1 = e.layer.feature.properties.code;
    layerGroup.removeLayer(LayerMap[code1].layer)
    delete LayerMap[code1]

    if (runWhere.chooseData.maps[obj.name].ignoreCodes) {
      runWhere.chooseData.maps[obj.name].ignoreCodes.push(code1)
    } else {
      runWhere.chooseData.maps[obj.name].ignoreCodes = []
      runWhere.chooseData.maps[obj.name].ignoreCodes.push(code1)
    }


    let layer0 = createWhite(geoJSON)
    LayerMap[code1] = {code: code1, layer: layer0};
    layerGroup.addLayer(layer0)
    loadCheckboxByRunWhere();
  })

}

function loadCheckboxByRunWhere() {
  let obj = runWhere.obj;
  let data = runWhere.data;
  /**
   * @type {SkyMap}
   */
  let skyMap = data.skyMap;

  loadCheckbox(obj, skyMap);
}

function createWhite(geoJSON) {
  const obj = runWhere.obj
  return L.geoJSON(geoJSON, {
    style: function () {
      return runWhere.data.mapViewData.metadata.gis.unselected
    }
  }).on('click', function (e) {
    let code1 = e.layer.feature.properties.code;
    layerGroup.removeLayer(LayerMap[code1].layer)
    delete LayerMap[code1]

    runWhere.chooseData.maps[obj.name].ignoreCodes = runWhere.chooseData.maps[obj.name].ignoreCodes.filter(code0 => code0 !== code1)
    if (!runWhere.chooseData.maps[obj.name].ignoreCodes.length) {
      delete runWhere.chooseData.maps[obj.name].ignoreCodes
    }


    let layer0 = createGreed(geoJSON)
    LayerMap[code1] = {code: code1, layer: layer0};
    layerGroup.addLayer(layer0)
    loadCheckboxByRunWhere();
  })

}

function handleCheckAllChange(change) {

  let obj = runWhere.obj;

  let data = runWhere.data;
  /**
   * @type {SkyMap}
   */
  let skyMap = data.skyMap;
  let name = obj.name;
  let candlelightPointCodesByName = skyMap.getCandlelightPointCodesByName(name);
  let mapData = runWhere.chooseData.maps[name];
  if (!mapData) {
    return;
  }

  if (change) {
    delete mapData.ignoreCodes;
  } else {
    mapData.ignoreCodes = [...candlelightPointCodesByName];
  }
  loadCheckboxByRunWhere();
  layerGroup.clearLayers()
  LayerMap = {};
  let mapByName = skyMap.getMapByName(obj.name);
  let candlelightPoints = mapByName.candlelightPoints;
  data.mapViewData.mapView[obj.name].points.forEach(point => {
    let code = point.code;
    let date = runWhere.date;
    let geoJSON = point.geoJSON;
    let layer;
    if (candlelightPoints.get(code).appearIn && candlelightPoints.get(code).appearIn.length &&
        !candlelightPoints.get(code).appearIn.includes((date ? LocalDate.ofDate(date) : LocalDate.now()).getDayOfWeek())) {
      layer = L.geoJSON(geoJSON, {
        style: function () {
          return runWhere.data.mapViewData.metadata.gis.ignore
        }
      })
    } else if (mapData.ignoreCodes &&
        mapData.ignoreCodes.includes(code)) {
      layer = createWhite(geoJSON);
    } else {
      layer = createGreed(geoJSON)
    }

    LayerMap[code] = {code: code, layer: layer};
    layerGroup.addLayer(layer)

  })
}

function close() {
  if (runWhere.group) {
    let value = runWhere.chooseData.maps[runWhere.obj.name];
    if (value && value.group && Object.keys(value.group).length) {
      let filter = Object.keys(value.group).filter(key => {
        return value.group[key].size > 0;
      });

      if (!filter.length) {
        delete runWhere.chooseData.maps[runWhere.obj.name];
      }
    }
  }

  map = null
  imageLayer && imageLayer.remove()
  imageLayer = null
  layerGroup.clearLayers();
  LayerMap = {};
  groupData.item = {};
  groupCandlelight.value = null;
  ready.value = false;
  runWhere.gis = false;
  runWhere.group = false;
  runWhere.error = false;
  runWhere.loading = false;
  runWhere.group = false;
  runWhere.unknow = false;

}
</script>

<template>
  <el-dialog
      v-model="props.runWhere.show"
      :show-close="true"
      :title="Data.start.runWhere.title"
      align-center
      class="run-where-box"
      width="90%"
      @close="close"
      @open="load"
  >
    <div v-if="props.runWhere.show" class="run">
      <div id="box" v-loading="runWhere.loading">
        <div v-show="runWhere.gis" id="map" style="width: 100%; height:60vh">
          <div style="z-index: 999;">
            <el-checkbox
                v-show="ready"
                v-model="choose.all"
                :indeterminate="choose.any"
                size="large"
                style="margin-left: 22px;margin-top: 2px;transform: scale(1.8);"
                @change="handleCheckAllChange"
                @click.stop="()=>{}"
                @dblclick.stop="()=>{}"
            >{{ '' }}
            </el-checkbox>
          </div>
        </div>
        <div v-show="runWhere.group" style="width: 100%; height:60vh">
          <template v-for="(value,key) in groupCandlelight">
            <el-divider/>
            <el-row>
              <el-col>
                {{ runWhere.data.start.groupCandlelight[key] }}
                <el-input-number v-model="runWhere.chooseData.maps[runWhere.obj.name].group[key].size" :max="value"
                                 :min="0"
                                 size="large"/>
              </el-col>
            </el-row>

          </template>
        </div>
        <div v-show="runWhere.unknow" style="width: 100%; height:60vh">
          <el-empty :description="Data.start.runWhere.building" style="width: 100%; height:60vh"/>
        </div>
        <div v-show="runWhere.error" style="width: 100%; height:60vh">
          <el-empty :description="Data.start.runWhere.error" style="width: 100%; height:60vh"/>
        </div>
      </div>

    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>

#box {
  min-height: 60vh;
}

@media (prefers-color-scheme: dark) {
  #map {
    background-color: #000;
  }

}


</style>
