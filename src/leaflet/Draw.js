import 'leaflet'
import '@geoman-io/leaflet-geoman-free';

class Draw {
    /**
     * 地图实例 （绘制基于地图）
     * @type {Map}
     */
    map;

    /**
     * 是否绘制中
     * @type{boolean}
     */
    drawing = false;

    /**
     * 绘制的图层
     */
    drawLayers = [];

    constructor(map) {
        this.map = map
    }

    /**
     * 启用绘制
     *
     * @param shape {'Marker'
     * | 'Circle'
     * | 'Line'
     * | 'Rectangle'
     * | 'Polygon'
     * | 'Cut'
     * | 'CircleMarker'
     * | 'ImageOverlay'
     * | 'Text'} 形状
     * @param single {boolean} 是否仅绘制一个
     * @param options {L.PM.DrawModeOptions} 参数 https://github.com/geoman-io/leaflet-geoman#draw-mode
     * @param workingLayerFunc {function(L.Layer):void}
     * @param createdFunc {function(L.Layer):void}
     */
    enableDraw(shape, single, options, workingLayerFunc = null, createdFunc = null) {
        if (this.drawing) {
            throw "当前正在处于绘制中状态";
        }

        workingLayerFunc &&
        this.map.on("pm:drawstart", (ev) => {
            workingLayerFunc(ev.workingLayer);
        });
        this.map.on("pm:create", (e) => {
            e.layer.setStyle({pmIgnore: false});
            if (single) {
                this.drawLayers[0] && this.drawLayers[0].remove();
                this.drawLayers[0] = e.layer;
            } else {
                this.drawLayers.push(e.layer);
            }
            createdFunc && createdFunc(e.layer)

            L.PM.reInitLayer(e.layer);
            e.layer.addTo(this.map);
            this.drawing = false;
        });

        this.map.pm.enableDraw(shape, options);
        this.drawing = true;
    }

    clearDraw() {
        this.drawLayers.forEach(layer => {
            layer.remove();
        })
        this.drawLayers = [];
    }

    disableDraw() {
        this.drawing && this.map.pm.disableDraw();
        this.drawing = false;
    }

    disable() {
        this.disableDraw();
        this.drawLayers.forEach((e) => {
            console.log(e);
            e && e.remove();
        });
        this.drawLayers = [];
    }

    getDrawLayers(index) {
        return this.drawLayers[index] ?? null;
    }

    /**
     * 获取绘制的第一个图层
     * @returns {L.Layer} 图层
     */
    getFirstDrawLayer() {
        return this.getDrawLayers(0);
    }

    hasLayer() {
        return this.drawLayers.length !== 0;
    }
}

export default Draw;

