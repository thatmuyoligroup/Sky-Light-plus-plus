<script setup>

import {onMounted, reactive, ref} from "vue";
import Draw from "../leaflet/Draw";

let runWhere = {}
let result = reactive({})
runWhere.windows = {
    loading: false
}

onMounted(() => {
    window.onkeydown = ev => {
        if (ev.key === 'k') bDraw();
        if (ev.key === 'j') aDraw();


    }
})
let map = null
let imageLayer = null
/**
 *
 * @type {Draw}
 */
let draw = null;
let num = 1;

onMounted(() => {
    load()
})

let imageUrl = 'https://sky-res.muyoli.com/' +
    'images/maps/家园/遇境.jpg';
let codePrefix = "0611"

let iconLayerGroup = null

function load() {
    if (!map) {
        map = L.map('map', {
            crs: L.CRS.Simple,
            minZoom: -3,
            maxZoom: 2,
            zoomControl: false,
            attributionControl: false,
        });
        iconLayerGroup = L.layerGroup()
        iconLayerGroup.addTo(map)
        draw = new Draw(map);
        map.pm.addControls({
            position: 'topleft',
            drawCircle: false,
        });
    }
    let src = imageUrl

    result.img = src
    result.type = 'gis'
    result.points = []
    let image = new Image();

    image.onload = function () {

        console.log(image.width)
        console.log(image.height)
        if (imageLayer) {
            imageLayer.remove()
        }

        var sol = L.latLng([0, 0]);
        L.marker(sol).addTo(map);
        result.width = image.width
        result.height = image.height
        let imgBounds = [[0, 0], [image.height, image.width]];
        let maxBounds = [[-(image.height / 4), (-image.width / 4)], [image.height + image.height / 4, image.width + image.width / 4]];
        imageLayer = L.imageOverlay(image, imgBounds).addTo(map);
        map.setMaxBounds(maxBounds)
        map.setView([0, 0], 0);

        // define rectangle geographical bounds

// create an orange rectangle
        L.rectangle(maxBounds, {color: "#ff7800", weight: 1}).addTo(map);

// zoom the map to the rectangle bounds
        map.fitBounds(maxBounds, {maxZoom: 0});

    }
    image.src = src


}

function aDraw() {
    draw.enableDraw('Polygon', true, {
        snappable: true,
        templineStyle: {
            color: "red",
        },
        // 提⽰线从最后⼀个标记到⿏标光标的线
        hintlineStyle: {
            color: "#c2effd",
            dashArray: [5, 5],
        },
        // 绘制完成的样式
        pathOptions: {
            color: "#7de8ff",
            // fillColor: "green",
        }
    }, null, (e) => {
        console.log(geoJSON.value = draw.getFirstDrawLayer().toGeoJSON());

        show.value = true;
    })
}

function bDraw() {
    draw.enableDraw('Rectangle', true, {
        snappable: true,
        templineStyle: {
            color: "red",
        },
        // 提⽰线从最后⼀个标记到⿏标光标的线
        hintlineStyle: {
            color: "#c2effd",
            dashArray: [5, 5],
        },
        // 绘制完成的样式
        pathOptions: {
            color: "#7de8ff",
            // fillColor: "green",
        }
    }, null, (e) => {
        console.log(geoJSON.value = draw.getFirstDrawLayer().toGeoJSON());

        show.value = true;
    })
}

let show = ref(false);
let code = ref(codePrefix + (Math.floor(num / 10) ? ("" + num) : ("" + "0" + num)));
let candlelight = ref(0);
let geoJSON = ref(null);
let gameResult = ref([]);


function close() {
    let codeValue = code.value
    geoJSON.value.properties = {code: codeValue, candlelight: candlelight.value}
    let geoJSONValue = geoJSON.value;
    gameResult.value.push({code: codeValue, candlelight: +candlelight.value})
    result.points.push({code: codeValue, geoJSON: geoJSONValue})
    num = num + 1;
    code.value = codePrefix + (Math.floor(num / 10) ? ("" + num) : ("" + "0" + num));

    let geoJSON1 = L.geoJSON(geoJSONValue, {
        style: () => {
            return {"color": '#00FF00'}
        }
    });
    const myIcon = L.divIcon({
        className: 'xxx-text',
        html: '<p style="white-space: nowrap;">' + codeValue + '</p>'
    })

    geoJSON1.addTo(iconLayerGroup)
    L.marker(geoJSON1.getBounds().getCenter(), {
        icon: myIcon,
        interactive: false
    }).addTo(iconLayerGroup)

    candlelight.value = 0
    geoJSON.value = null
    show.value = false;
}

window.result = () => JSON.stringify(result)
window.gameResult = () => JSON.stringify(gameResult.value)
window.geoJSON = geoJSON
window.printResult = () => {
    console.log(window.result())
    console.log(window.gameResult())
}
</script>

<template>

  <div class="run">
    <div id="box" v-loading="runWhere.loading">
      <div id="map" style="width: 100%; height:80vh">

      </div>
      <div>
        <el-button @click="aDraw">绘制</el-button>
        <el-button @click="bDraw">绘制矩形</el-button>
        <div style="color: red;">{{ JSON.stringify(result, null, 2) }}</div>

        <div style="color: blue">{{ JSON.stringify(gameResult, null, 2) }}</div>
      </div>


    </div>
    <el-dialog v-model="show" title="导入方案">
      <el-input
              v-model="code"
              placeholder="请输入Code"
      />
      <el-input
              v-model="candlelight"
              placeholder="请输入烛火"
      />

      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="close">
          确认
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.run {
    box-shadow: 0 0 20px 0 rgba(211, 211, 211, 0.22) inset;
    background-color: #f9f9f9;
    border-radius: 10px;
    min-height: 60vh;
    padding: 10px;
    left: -750px;
    width: 250%;
}

#box {
    min-height: 80vh;
}
</style>
