import dayjs from "dayjs";
import LocalDate from "./LocalDate.js";

/**
 * 烛火收获点
 */
class CandlelightHarvestPoint {
    /**
     *收获点名称/收获点map
     * @type {Map<String,{name:String,mapNames:String[],candlelight:number,desc:String,
     * limit?:{ "type": "date_same_after", "date": "YYYY-MM-DD","rule": {"appearIn": [(1|2|3|4|5|6|7)]}}
     * }>}
     */
    points;

    /**
     * 小图名/收获点map
     * @type  {Map<String,[{name:String,mapNames:String[],candlelight:number,desc:String}]>}
     */
    mapPoints;

    constructor() {
        this.points = new Map();
        this.mapPoints = new Map();
    }

    /**
     *
     * @param list {Object[]}
     */
    static createList(list) {
        let candlelightHarvestPoint = new CandlelightHarvestPoint();
        list && list.forEach(obj => candlelightHarvestPoint.createObj(obj));
        return candlelightHarvestPoint;
    }

    createObj(obj) {
        let name = obj.name;
        let mapNames = obj.mapNames;
        let candlelight = obj.candlelight;
        let desc = obj.desc;
        let limit = obj.limit;

        this.create(name, mapNames, candlelight, desc, limit)
    }

    /**
     * 创建烛火收获点
     * @param name {string}
     * @param mapNames {string[]}
     * @param candlelight {number}
     * @param desc {string}
     * @param limit {Object}
     */
    create(name, mapNames, candlelight, desc, limit) {
        if (!name) {
            throw new Error('创建烛火收获点时发生错误；烛火收获点必须存在值');
        }

        if (mapNames?.length && mapNames.length < 1) {
            throw new Error('创建烛火收获点时发生错误；烛火收获点必须存在于至少一个地图中');
        }

        if (!candlelight || typeof candlelight !== 'number' || candlelight <= 0) {
            throw new Error('创建烛火收获点时发生错误；烛火(' + candlelight + ')必须为可解析的内容')
        }

        let point = {name: name, mapNames: mapNames, candlelight: candlelight, desc: desc, limit: limit}
        this.points.set(name, point);
        if (mapNames?.length) {
            mapNames.forEach(mapName => {
                if (!this.mapPoints.has(mapName)) {
                    this.mapPoints.set(mapName, [point])
                    return;
                }
                this.mapPoints.get(mapName).push(point)
            })
        }

    }


    getNames() {
        return [...this.points.keys()]
    }

    getAvailableNames(date = LocalDate.now()) {
        return this.getNames().filter(name => this.available(name, date));
    }

    getByMapName(mapName) {
        if (!this.mapPoints.has(mapName)) {
            return null;
        }
        return [...this.mapPoints.get(mapName)]
    }

    getByName(name) {
        return this.points.get(name)
    }

    getByNames(names) {
        return names.map(name => this.getByName(name))
    }

    /**
     *
     * @param names {string[]} 烛火收获点名称数组
     * @param date {LocalDate} 日期
     * @return {number} 烛火
     */
    getCandlelightByNames(names, date = LocalDate.now()) {
        let candlelight = 0
        if (names.length === 0) {
            names = [...this.points.keys()];
        }

        names.forEach((name) => candlelight += this.getCandlelightByName(name, date))
        return candlelight
    }

    available(name, date = LocalDate.now()) {
        let point = this.points.get(name);
        let limit = point.limit;
        if (!limit) {
            return true;
        }

        let dateStr = limit.date;
        let hasSameAfterLimit = limit.type === 'date_same_after' && dayjs(date.getDate()).isSameOrAfter(dateStr, 'date');
        if (hasSameAfterLimit && !limit.rule.appearIn.includes(date.getDayOfWeek())) {
            return false;
        }
        let hasOtherLimit = false;

        return true;
    }

    /**
     *
     * @param name {string} 烛火收获点名称
     * @param date {LocalDate} 日期
     * @return {number} 烛火
     */
    getCandlelightByName(name, date = LocalDate.now()) {
        let point = this.points.get(name);
        if (!point) {
            return 0;
        }

        let limit = point.limit;
        if (!limit) {
            return point.candlelight
        }

        if (!this.available(name, date)) {
            return 0;
        }

        return point.candlelight
    }

}

export default CandlelightHarvestPoint;
