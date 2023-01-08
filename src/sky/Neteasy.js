import WhileCandleRule from "./WhileCandleRule.js";
import SkyMap from "./SkyMap.js";
import SpecialCandlelight from "./SpecialCandlelight.js";
import CandlelightHarvestPoint from "./CandlelightHarvestPoint.js";
import axios from 'axios';
import ElSystemNotice from "../util/ElSystemNotice.js";
import Data from "./i18n/Default.js"
import {stores} from "../stores/stores.js";
import Activity from "./Activity.js";

/**
 * 推荐跑图
 * TODO 推荐跑图
 * @type {{basename:name[]}}
 */
const RECOMMEND = {}
let cache = null;
const debug = false;

const api = {
    data: 'https://sky-api.muyoli.com/data/neteasy/NeteasyData.json',
    mapViewData: 'https://sky-api.muyoli.com/data/neteasy/MapViewData.json'
};

let chinaData;
let mapViewData;

let whileCandleRule;
let skyMap;
let specialCandlelight;
let candlelightHarvestPoint;
/**
 * @type {Activity}
 */
let activity;

let tryNum = 3;

async function loadServerData() {
    if (debug) {
        return {code: 403, msg: 'debug'};
    }
    if (!tryNum) {
        return {code: 403, msg: 'fuse'};
    }
    --tryNum;
    try {
        let dataResp = await axios.get(api.data, {timeout: 1000});
        let mapViewDataResp = await axios.get(api.mapViewData, {timeout: 1000});
        chinaData = dataResp.data;
        mapViewData = mapViewDataResp.data;
        return {code: 200};
    } catch (e) {
        return {code: 500, msg: e};
    }
}

async function loadData() {
    let lastUseLocalGameData = stores['main'].useLocalGameData;
    while (true) {
        let result = await loadServerData();
        if (result.code === 403) {
            console.warn(Data.noticeTemplate.useLocalData.message)
            ElSystemNotice.sendNotice(Data.noticeTemplate.useLocalData)
            let dataResp = await import('./data/NeteasyData.js');
            let mapViewDataResp = await import('./data/MapViewData.js');
            delete dataResp.default.version;
            chinaData = dataResp.default;
            mapViewData = mapViewDataResp.default;
            stores['main'].useLocalGameData = true
            break;
        }
        if (result.code === 200) {
            stores['main'].useLocalGameData = false
            break;
        }
    }
    // 数据版本更细策略
    {
        if (chinaData.version && chinaData.version !== stores['main'].gameDataVersion) {
            //stores['main'].clear()
            stores['main'].gameDataVersion = chinaData.version
            ElSystemNotice.sendNotice(Data.noticeTemplate.newGameDataVersion, {version: chinaData.version});
        }
    }

    // 本地数据替换到服务器数据
    {
        if (lastUseLocalGameData && !stores['main'].useLocalGameData) {
            stores['main'].gameDataVersion = chinaData.version
            ElSystemNotice.sendNotice(Data.noticeTemplate.newGameDataVersion, {version: chinaData.version});
        }
    }
}


function initWhileCandle() {
    let whileCandleRule = new WhileCandleRule();
    [...chinaData.whileCandleRule].forEach((value, index) => {
        whileCandleRule.CANDLE.set(index + 1, value);
    })

    return whileCandleRule;
}

/**
 * 初始化地图
 * @returns {SkyMap}
 */
function initSkyMap() {
    let skyMap = new SkyMap();
    let skyMap0 = new Map(Object.entries(chinaData.skyMap))
    skyMap0.forEach((maps, basename) => {
        maps.forEach(map => {
            map['basename'] = basename
            skyMap.createObj(map);
        })
    })

    return skyMap;
}

function initSpecialCandlelight() {
    let list = chinaData.specialCandlelight;
    return SpecialCandlelight.createList(list);
}

function initCandlelightHarvestPoint() {
    let list = chinaData.candlelightHarvestPoint;
    return CandlelightHarvestPoint.createList(list);
}

/**
 * 初始化活动烛火
 */
function initActivity() {
    let list = chinaData.activities ?? [];
    return Activity.createList(list);
}


function checkMapViewData() {
    let mapView = mapViewData.mapView;
    for (let key of Object.keys(mapView)) {
        let map;
        try {
            map = skyMap.getMapByName(key);
        } catch (e) {
            throw new Error(`单点地图[${key}]获取源地图失败:${e}`)
        }
        let obj = mapView[key];
        let type = obj.type;
        if (!type) {
            throw new Error('单点地图[' + key + ']数据type不能为空')
        }
        if (!['un_support', 'gis'].includes(type)) {
            throw new Error(`单点地图[${key}]数据type[${type}]不支持`)
        }

        if ('gis' === type) {
            let img = obj.img;
            let points = obj.points;
            if (!img) {
                throw new Error(`gis类型单点地图[${key}]必须存在img图片数据`)
            }
            if (!points) {
                throw new Error(`gis类型单点地图[${key}]必须存在points图片数据`)
            }
            if (!points instanceof Array) {
                throw new Error(`gis类型单点地图[${key}]points数据类型必须为数组`)
            }
            points.forEach((point, index) => {
                let code = point.code;
                let geoJSON = point.geoJSON;
                if (!code) {
                    throw new Error(`gis类型单点地图[${key}]points数据第${index + 1}条code不能为空，且必须属于地图烛火点中`)
                }
                if (!geoJSON) {
                    throw new Error(`gis类型单点地图[${key}]points数据第${index + 1}条geoJSON不能为空`)
                }
                if (!skyMap.getCandlelightPointCodesByName(key).includes(code)) {
                    throw new Error(`gis类型单点地图[${key}]points数据第${index + 1}条code[${code}]不属于该地图烛火点`)
                }
            })
        }

    }
}

/**
 * 分析可获取的蜡烛，下一根合成进度、后续蜡烛需要的烛火（1，2，3）
 * @param {LocalDate} date
 * @param { {maps:[{name:string,ignoreCodes:string[],importCodes:string[]}],special:[{name:string,size:number}],harvestPoint:string[]} } option
 * @return { Promise<{candle:number,surplus:number,nextProgress:number,after:number[],used:{candlelight:number,candle:number,floatCandlelight:{fixed:number,float:number},detail:{}},unused:{candlelight:number,candle:number,floatCandlelight:{fixed:number,float:number},detail:{}}}> }
 */
async function analyze(date, option) {
    let candle = 0;
    let nextProgress = 0;
    let surplus = 0;
    let after = [0, 0, 0];
    let used = {
        candlelight: 0,
        candle: 0,
        floatCandlelight: {fixed: 0, float: 0},
        detail: {
            maps: {
                candlelight: {
                    candlelight: 0,
                    candle: 0,
                    floatCandlelight: {fixed: 0, float: 0}
                }, item: {}
            },
            special: {candlelight: 0, item: {}},
            harvestPoint: {candlelight: 0, item: {}},
            activity: {candlelight: 0, item: {}},
            script: {
                maps: [],
                special: [],
                harvestPoint: [],
                activity: []
            }
        }
    };
    let unused = {
        candlelight: 0,
        candle: 0,
        floatCandlelight: {fixed: 0, float: 0},
        detail: {
            maps: {
                candlelight: {
                    candlelight: 0,
                    candle: 0,
                    floatCandlelight: {fixed: 0, float: 0}
                }, item: {}
            },
            special: {candlelight: 0, item: {}},
            harvestPoint: {candlelight: 0, item: {}},
            activity: {candlelight: 0, item: {}},
            script: {
                maps: [],
                special: [],
                harvestPoint: [],
                activity: []
            }
        }
    };

    await analyzeMap(date, option, used, unused);
    analyzeSpecial(option, used, unused)
    analyzeHarvestPoint(option, used, unused, date)
    analyzeActivity(option, used, unused, date)

    let canGetCandlelight = used.candlelight + used.floatCandlelight.fixed - used.floatCandlelight.float;
    let canGetCandle = used.candle;

    candle = whileCandleRule.calculateCandle(canGetCandlelight) + canGetCandle;
    nextProgress = whileCandleRule.calculateNextNeedCandlelightProgress(canGetCandlelight);
    after.forEach((i, index) => {
        after[index] = whileCandleRule.calculateNeedCandlelight(canGetCandlelight, index + 1)
    })
    surplus = whileCandleRule.calculateSurplus(canGetCandlelight)
    return {candle, surplus, nextProgress, after, used, unused};
}

function analyzeSpecial(option, used, unused) {
    let special = option.special ?? [];
    let specialObj = {};

    let names = specialCandlelight.getNames();
    let useNames = special.map(value => {
        specialObj[value.name] = value.size
        return value.name;
    });
    let unusedNames = names.filter(name => !useNames.includes(name));
    let candlelight = special.length ? specialCandlelight.getCandlelight(...special) : 0;
    used.candlelight += candlelight

    used.detail.special.candlelight = candlelight
    useNames.forEach(name => {
        used.detail.special.item[name] = {
            base: specialCandlelight.getByName(name),
            size: specialObj[name],
            candlelight: specialCandlelight.getCandlelight({name: name, size: specialObj[name]})
        }
    })
    used.detail.script.special.push(...special)


}

function analyzeHarvestPoint(option, used, unused, date) {
    let harvestPoint = option.harvestPoint ?? [];
    let names = candlelightHarvestPoint.getNames();
    let useNames = [...harvestPoint] ?? [];
    let unusedNames = names.filter(name => !useNames.includes(name)) ?? [];

    let usedCandlelight = useNames.length ? candlelightHarvestPoint.getCandlelightByNames(useNames, date) : 0;
    used.candlelight += usedCandlelight
    used.detail.harvestPoint.candlelight = usedCandlelight
    useNames.forEach(name => {
        used.detail.harvestPoint.item[name] = {
            base: candlelightHarvestPoint.getByName(name),
            candlelight: candlelightHarvestPoint.getCandlelightByNames([name], date)
        }
    })
    used.detail.script.harvestPoint.push(...useNames)

    let unusedCandlelight = unusedNames.length ? candlelightHarvestPoint.getCandlelightByNames(unusedNames, date) : 0;
    unused.candlelight += unusedCandlelight
    unused.detail.harvestPoint.candlelight = unusedCandlelight
    unusedNames.forEach(name => {
        unused.detail.harvestPoint.item[name] = {
            base: candlelightHarvestPoint.getByName(name),
            candlelight: candlelightHarvestPoint.getCandlelightByNames([name], date)
        }
    })
    unused.detail.script.harvestPoint.push(...unusedNames)

}

function analyzeActivity(option, used, unused, date) {
    let activities = option.activities ?? [];

    let usedCandlelight = activities.length ? activity.getCandlelightByNames(activities, date) : 0;
    used.candlelight += usedCandlelight
    used.detail.activity.candlelight = usedCandlelight
    activities.forEach(activity0 => {
        used.detail.activity.item[activity0.name] = {
            base: activity.getActivity(activity0.name),
            candlelight: activity.getCandlelightByName(activity0, date)
        }
    })
    used.detail.script.activity.push(...activities)
}

async function analyzeMap(date, option, used, unused) {
    let maps = option?.maps ?? [];
    let usedName = maps.map(value => value.name) ?? [];
    let allName = skyMap.getAllName();
    let unusedName = allName.filter(name => !usedName.includes(name));

    const usedTask = new Promise((resolve, reject) => {
        maps.forEach(map => {
            let name = map.name;
            let ignoreCodes = map.ignoreCodes ?? [];
            let importCodes = map.importCodes;

            // 组火特殊逻辑
            let groupCandlelight = skyMap.getMapByName(name).groupCandlelight;
            if (groupCandlelight) {
                let unusedCodes = []
                let useCodes = [];
                if (importCodes) {
                    importCodes.forEach(code => {
                        [...groupCandlelight.keys()].filter(prefix => code.startsWith(prefix)).forEach(prefix => {
                            let size = parseInt(code.replaceAll(prefix, ''));
                            let maxSize = groupCandlelight.get(prefix);
                            let count = Math.min(size, maxSize);
                            useCodes.push(prefix + count)
                            if (maxSize - count > 0) {
                                unusedCodes.push(prefix + (maxSize - count))
                            }
                        })
                    })

                }

                if (unusedCodes.length) {
                    calculateMap(name, date, unusedCodes, unused.detail.maps.candlelight);
                    calculateMap(name, date, unusedCodes, unused)
                    handleDetailMap(unused, name, unusedCodes, date);
                }
                calculateMap(name, date, useCodes, used.detail.maps.candlelight);
                calculateMap(name, date, useCodes, used);
                handleDetailMap(used, name, useCodes, date);
                return;
            }


            // 正常烛火逻辑
            let codes = skyMap.getCandlelightPointCodesByName(name);
            let unusedCodes = []
            let useCodes = [];
            if (importCodes && importCodes.length) {
                codes.filter(code => {
                    if (!importCodes.includes(code)) {
                        unusedCodes.push(code)
                        return false
                    } else {
                        useCodes.push(code)
                        return true
                    }
                });
            } else {
                codes.filter(code => {
                    if (ignoreCodes.includes(code)) {
                        unusedCodes.push(code)
                        return false
                    } else {
                        useCodes.push(code)
                        return true
                    }
                });
            }


            if (unusedCodes.length) {
                calculateMap(name, date, unusedCodes, unused.detail.maps.candlelight);
                calculateMap(name, date, unusedCodes, unused)
                handleDetailMap(unused, name, unusedCodes, date);
            }
            calculateMap(name, date, useCodes, used.detail.maps.candlelight);
            calculateMap(name, date, useCodes, used);
            handleDetailMap(used, name, useCodes, date);
        })
        resolve()
    })

    const unusedTask = new Promise((resolve, reject) => {
        unusedName.forEach(name => {
            calculateMap(name, date, [], unused.detail.maps.candlelight);
            calculateMap(name, date, [], unused)
            handleDetailMap(unused, name, [], date);
        })
        resolve();
    })

    let done = await Promise.all([usedTask, unusedTask]);
}

function calculateMap(name, date, codes, obj) {
    let candlelight = skyMap.getCandlelightByName(name, date, codes);
    obj.candle += skyMap.getFixedCandleByName(name, date);
    obj.candlelight += candlelight.candlelight;
    obj.floatCandlelight.fixed += candlelight.floatCandlelight.fixed ?? 0;
    obj.floatCandlelight.float += candlelight.floatCandlelight.float ?? candlelight.floatCandlelight;
}

function handleDetailMap(obj, name, codes, date) {
    let basename = skyMap.getMapByName(name).basename;
    let base;
    if (obj.detail.maps.item[basename]) {
        base = obj.detail.maps.item[basename];
    } else {
        base = obj.detail.maps.item[basename] = {
            candlelight: {candlelight: 0, candle: 0, floatCandlelight: {fixed: 0, float: 0}},
            item: {}
        };
    }

    let item = base.item[name] = {
        basename: basename,
        desc: skyMap.getMapByName(name).desc,
        candlelight: {candlelight: 0, candle: 0, floatCandlelight: {fixed: 0, float: 0}},
    }
    if (codes.length) {
        item.importCodes = [...codes];
        obj.detail.script.maps.push({name: name, importCodes: codes})
    } else {
        obj.detail.script.maps.push({name: name})
    }
    calculateMap(name, date, codes, item.candlelight)
    calculateMap(name, date, codes, base.candlelight)
}

async function build() {

    await loadData();
    whileCandleRule = initWhileCandle();
    skyMap = initSkyMap();
    /**
     * @type {SpecialCandlelight}
     */
    specialCandlelight = initSpecialCandlelight();
    /**
     *
     * @type {CandlelightHarvestPoint}
     */
    candlelightHarvestPoint = initCandlelightHarvestPoint();
    activity = initActivity();
    checkMapViewData();


    return {
        aesKey: "jianjianghui",
        cache: cache,
        recommend: RECOMMEND,
        whileCandleRule: whileCandleRule,
        skyMap: skyMap,
        specialCandlelight: specialCandlelight,
        candlelightHarvestPoint: candlelightHarvestPoint,
        activity: activity,
        mapViewData: mapViewData,
        service: {
            analyze: analyze
        },
    }
}

export default build()
