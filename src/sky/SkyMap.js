import LocalDate from "./LocalDate.js";
import CandlelightPoint from "./CandlelightPoint.js";

LocalDate;

function appendFloatCandlelight(original, append) {
    let result = {fixed: 0, float: 0};

    if (typeof original === "number") {
        result.float = original;
    }

    if (typeof original === "object") {
        result.fixed = original.fixed ?? 0
        result.float = original.float ?? 0
    }

    if (typeof append === "number") {
        result.float = result.float + append;
    }
    if (typeof append === "object") {
        result.fixed = result.fixed + (append.fixed ?? 0)
        result.float = result.float + (append.float ?? 0)
    }

    if (!result.fixed) {
        return result.float;
    }

    return result;
}

/**
 * 地图烛火点
 * @alias（CODE:地图装饰器）
 */
class SkyMap {

    /**
     * 根名Map
     *@type  {Map<string,Map<string,InternalSkyMap>>}
     */
    baseMap = new Map();

    /**
     * 地图Map
     *@type  {Map<string,InternalSkyMap>}
     */
    nameMap = new Map();


    /**
     *  内部方法
     * @private 内部专用
     */
    setMap(basename, name, skyMap) {
        if (!this.baseMap.has(basename)) {
            this.baseMap.set(basename, new Map());
        }
        this.baseMap.get(basename).set(name, skyMap);
        this.nameMap.set(name, skyMap);
    }


    create(basename, name, candlelightPoints) {
        let skyMap = new InternalSkyMap(basename, name, candlelightPoints, 0, '', null);
        this.setMap(basename, name, skyMap);
        return skyMap
    }

    createFixed(basename, name, fixedCandle) {
        let skyMap = new InternalSkyMap(basename, name, null, fixedCandle, null);
        this.setMap(basename, name, skyMap);
        return skyMap
    }

    createObj(map) {
        let basename = map.basename;
        let name = map.name;
        let desc = map.desc;
        let fixedCandle = map.fixedCandle;

        let groupCandlelight = null;
        let candlelightPoints = new Map();
        map.candlelightPoints && [...map.candlelightPoints].forEach(candlelightPointObj => {
            let candlelightPoint = CandlelightPoint.createByObj(candlelightPointObj);
            candlelightPoints.set(candlelightPoint.code, candlelightPoint)
        });
        if (map.groupCandlelight) {
            let candlelightRules = map.groupCandlelight;
            groupCandlelight = new Map();
            candlelightRules.forEach(rule => {
                let namePrefix = rule.namePrefix;
                let codePrefix = rule.codePrefix;
                let type = rule.type;
                let candlelight = rule.candlelight;
                let count = rule.count;
                groupCandlelight.set(codePrefix, count);
                for (let i = 1; i <= count; i++) {
                    let candlelightPoint = CandlelightPoint.create(namePrefix + i, codePrefix + i, type, candlelight);
                    candlelightPoints.set(candlelightPoint.code, candlelightPoint)
                }
            })
        }

        let skyMap = new InternalSkyMap(basename, name, candlelightPoints, fixedCandle, desc, groupCandlelight);
        this.setMap(basename, name, skyMap);
        return skyMap
    }


    /**
     * 获取所有根地图名称
     * @return {string[]}
     */
    getAllBasename() {
        return [...this.baseMap.keys()];
    }

    /**
     * 获取所有地图名称
     * @return {string[]}
     */
    getAllName() {
        return [...this.nameMap.keys()];
    }

    /**
     * 获取指定根地图的所有地图
     *@param  {string}  basename
     * @return {Map<string,InternalSkyMap>}
     */
    getMapsByBasename(basename) {
        if (!this.baseMap.has(basename)) throw new Error(`该大图[` + basename + `]不存在`)
        return this.baseMap.get(basename)
    }

    /**
     * 获取指定根地图的所有地图名
     *@param  {string}  basename
     * @return {string[]}
     */
    getNamesByBasename(basename) {
        return [...this.getMapsByBasename(basename).keys()];
    }

    /**
     * 根据指定地图名获取地图
     *@param  {string}  name
     * @return {InternalSkyMap}
     */
    getMapByName(name) {
        if (!this.nameMap.has(name)) throw new Error(`该小图[` + name + `]不存在`)
        return this.nameMap.get(name)
    }


    /**
     * 根据日期获取所有地图的烛火数量
     * @param candlelightPointCodes 特定烛火点编码
     * @param date
     *
     * @return {{candlelight:number,floatCandlelight:number|{fixed:number,float:number}} 烛火,浮动烛火
     */
    getCandlelight(date = LocalDate.now(), candlelightPointCodes = []) {
        let allBasename = this.getAllBasename();
        if (!allBasename.length) {
            return {candlelight: 0, floatCandlelight: 0}
        }
        let candlelight = 0;
        let floatCandlelight = 0;


        allBasename.forEach(basename => {
            let result = this.getCandlelightByBasename(basename, date, candlelightPointCodes);
            candlelight += result.candlelight
            floatCandlelight = appendFloatCandlelight(floatCandlelight, result.floatCandlelight)
        })
        return {candlelight, floatCandlelight};
    }

    /**
     * 根据根地图名和日期获取该根地图的烛火
     * @param {string}  basename
     * @param candlelightPointCodes 特定烛火点编码
     * @param date {LocalDate} 日期
     * @return {{candlelight:number,floatCandlelight:number|{fixed:number,float:number}} 烛火,浮动烛火
     */
    getCandlelightByBasename(basename, date = LocalDate.now(), candlelightPointCodes = []) {
        let candlelight = 0;
        let floatCandlelight = 0;
        let map = this.getMapsByBasename(basename);
        for (let value of map.values()) {
            let result = value.getCandlelight(date, candlelightPointCodes)
            candlelight += result.candlelight
            floatCandlelight = appendFloatCandlelight(floatCandlelight, result.floatCandlelight)
        }
        return {candlelight, floatCandlelight};
    }

    /**
     * 根据地图名和日期获取该地图的烛火
     * @param {string}  name
     * @param date {LocalDate} 日期
     * @param candlelightPointCodes  特定烛火点编码
     * @return {{candlelight:number,floatCandlelight:number|{fixed:number,float:number}} 烛火,浮动烛火
     */
    getCandlelightByName(name, date = LocalDate.now(), candlelightPointCodes = []) {
        return this.getMapByName(name).getCandlelight(date, candlelightPointCodes)
    }

    /**
     *根据地图名数组和日期获取该地图的烛火
     * @param {LocalDate} date
     * @param {string[]} names
     * @param candlelightPointCodes 特定烛火点编码
     * @return {{candlelight:number,floatCandlelight:number|{fixed:number,float:number}} 烛火,浮动烛火
     */
    getCandlelightByNames(date, names = [], candlelightPointCodes = []) {
        let candlelight = 0;
        let floatCandlelight = 0;
        names.forEach(name => {
            let result = this.getCandlelightByName(name, date, candlelightPointCodes)
            candlelight += result.candlelight
            floatCandlelight = appendFloatCandlelight(floatCandlelight, result.floatCandlelight)
        })
        return {candlelight, floatCandlelight};
    }


    /**
     * 根据日期获取所有地图的固定蜡烛数
     * @param date {LocalDate}
     */
    getFixedCandle(date = LocalDate.now()) {
        let fixedCandle = 0;
        for (let skyMap of this.nameMap.values()) {
            let v = skyMap.getFixedCandle(date)
            if (v) {
                fixedCandle += v
            }
        }
        return fixedCandle;
    }

    /**
     * 根据根地图名和日期获取 固定蜡烛数
     * @param basename {string}
     * @param date {LocalDate}
     */
    getFixedCandleByBasename(basename, date = LocalDate.now()) {
        let fixedCandle = 0;
        for (let skyMap of this.getMapsByBasename(basename)?.values()) {
            let v = skyMap.getFixedCandle(date)
            if (v) {
                fixedCandle += v
            }
        }
        return fixedCandle;
    }

    /**
     * 根据地图名和日期获取 固定蜡烛数
     * @param name {string}
     * @param date {LocalDate}
     */
    getFixedCandleByName(name, date = LocalDate.now()) {
        let skyMap = this.getMapByName(name);
        return skyMap.getFixedCandle(date);
    }

    /**
     *根据地图名数组和日期获取该地图的固定蜡烛
     * @param {LocalDate} date
     * @param {string[]} names 地图名数组
     * @return {number} 固定蜡烛数量
     */
    getFixedCandleByNames(date, names = []) {
        let fixedCandle = 0;
        names.forEach(name => fixedCandle += this.getFixedCandleByName(name, date))
        return fixedCandle;
    }


    getCandlelightPointCodes() {
        let allBasename = this.getAllBasename();
        if (!allBasename.length) {
            return [];
        }

        let codes = [];
        allBasename.forEach(basename => {
            codes.push(...this.getCandlelightPointCodesByBasename(basename))
        })
        return codes
    }


    getCandlelightPointCodesByBasename(basename) {
        let mapNames = this.getMapsByBasename(basename).keys();
        let codes = [];
        mapNames.forEach(name => {
            codes.push(...this.getCandlelightPointCodesByName(name))
        })
        return codes
    }

    /**
     * 根据地图名获取所有烛火点Code
     * @param name 地图名
     * @return {string[]} 烛火点code集合
     */
    getCandlelightPointCodesByName(name) {
        return this.getCandlelightPointsByName(name).map(value => value.code);
    }

    /**
     * 根据地图名获取所有烛火点
     * @param name 地图名
     * @return {CandlelightPoint[]} 烛火点集合
     */
    getCandlelightPointsByName(name) {
        let map = this.getMapByName(name);
        return [...map.candlelightPoints.values()];
    }

}

/**
 * 地图烛火点
 * @internal
 */
class InternalSkyMap {

    /**
     * 地图名（小图名）
     *@type {string} 地图名
     */
    name;
    /**
     * 根名（大图名）
     *@type {string} 根名
     */
    basename;

    /**
     * 描述
     */
    desc;

    /**
     * 烛火点<code,CandlelightPoint>
     * @type {Map<String,CandlelightPoint>}
     */
    candlelightPoints;

    /**
     * 团组烛火 （实验型，仅用于重生之路）
     * @desc 计算烛火时，如果识别为团组烛火，则使用编号
     * @type {Map<string,number>} (<特定前缀烛火的codePrefix,几组>)
     */
    groupCandlelight;
    /**
     * 烛火点位置图片url
     * @type string[]
     */
    candlelightImgUrl;

    /**
     * 可获取的固定蜡烛数量
     */
    EVERYDAY_OBTAINABLE_MAX_FIXED_CANDLE = {};

    /**
     *
     * @param basename {string} 大图名
     * @param name {string} 小图名
     * @param candlelightPoints {Map<string,CandlelightPoint>}
     * @param fixedCandle {number} 固定蜡烛数量（默认解析为全天都可获取的）
     * @param desc {string} 地图描述
     * @param groupCandlelight {Map<string,number>}  (<特定前缀烛火的codePrefix,几组>)
     */
    constructor(basename, name, candlelightPoints, fixedCandle, desc, groupCandlelight) {
        if (!basename || !name) {
            throw new Error('大图名(' + basename + ')和小图名(' + name + ')必须不为空，请检查数据合法性');
        }

        this.basename = basename;
        this.name = name;
        this.candlelightPoints = candlelightPoints ?? new Map();
        if (fixedCandle) {
            [1, 2, 3, 4, 5, 6, 7].forEach(i => this.EVERYDAY_OBTAINABLE_MAX_FIXED_CANDLE[i] = fixedCandle);
        }
        this.desc = desc;
        this.groupCandlelight = groupCandlelight;
    }


    /**
     * 获取当前地图可获取的固定蜡烛
     * @param date {LocalDate}
     * @return {number} 固定蜡烛
     */
    getFixedCandle(date = LocalDate.now()) {
        if (!date) {
            return 0;
        }

        let dayOfWeek = date.getDayOfWeek();
        return this.EVERYDAY_OBTAINABLE_MAX_FIXED_CANDLE[dayOfWeek] ?? 0;
    }

    /**
     * 获取当前地图可获取的烛火
     * @param date {LocalDate}
     * @param candlelightPointCodes[] 特定烛火点编码
     * @return {{candlelight:number,floatCandlelight:number|{fixed:number,float:number}}} 烛火,浮动烛火
     */
    getCandlelight(date = LocalDate.now(), candlelightPointCodes = []) {
        if (!date) {
            return {candlelight: 0, floatCandlelight: 0};
        }

        let candlelightPoints = this.candlelightPoints;
        if (!candlelightPoints) {
            return {candlelight: 0, floatCandlelight: 0};
        }

        if (candlelightPointCodes.length) {
            candlelightPoints = new Map();
            candlelightPointCodes.forEach(code => {
                this.candlelightPoints.has(code) && candlelightPoints.set(code, this.candlelightPoints.get(code));

                if (!this.groupCandlelight || !this.groupCandlelight.size) {
                    return;
                }

                // 计算特殊团组烛火
                this.groupCandlelight.forEach((count, prefix) => {
                    let hit = code.startsWith(prefix);
                    if (!hit) {
                        return;
                    }
                    //多少组
                    let num = Math.min(count, parseInt(code.replaceAll(prefix, '')));
                    for (let i = 1; i <= num; i++) {
                        let groupItemCode = prefix + i;
                        this.candlelightPoints.has(groupItemCode) && !candlelightPoints.has(groupItemCode) && candlelightPoints.set(groupItemCode, this.candlelightPoints.get(groupItemCode));
                    }
                })
            })
        }

        let candlelight = 0
        let floatCandlelight = 0
        candlelightPoints.forEach((value) => {
            let result = value.getCandlelight(date);
            candlelight += result.candlelight
            floatCandlelight = appendFloatCandlelight(floatCandlelight, result.floatCandlelight)
        })

        return {candlelight, floatCandlelight};
    }

    /**
     * 获取数据
     * @param date {LocalDate}
     * @return {{candle:number,candlelight:{candlelight:number,floatCandlelight:number}}} 聚合数据
     */
    get(date = LocalDate.now()) {
        return {candle: this.getFixedCandle(date), candlelight: this.getCandlelight(date)}
    }


    toString() {
        return this.name
    }
}


export default SkyMap;
