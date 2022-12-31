/**
 * 活动烛火
 */
import LocalDate from "./LocalDate.js";
import dayjs from "dayjs";

class InternalActivity {
    /**
     * 活动名
     * @type {string}
     */
    name;

    /**
     * 活动所在小图名
     */
    mapName;

    /**
     * 活动类型（目前仅支持类型 ：烛火收获点）
     * @type {('candlelightHarvestPoint')}
     */
    type;

    /**
     * 烛火
     * @type {number}
     */
    candlelight;

    /**
     *固定蜡烛
     * @type {number}
     */
    candle;

    /**
     * 活动描述
     * @type {string}
     */
    desc;
    /**
     * 预计用时
     * @type {number}
     */
    minute;

    /**
     * 日期介于[xxx-xxx]
     */
    dateBetween;

    /**
     * 选项
     */
    option;

    constructor(obj) {
        this.name = obj.name;
        if (!this.name) {
            throw new Error('创建活动烛火时发生错误；活动必须拥有名称');
        }

        this.dateBetween = obj.dateBetween;
        if (!this.dateBetween || this.dateBetween.length !== 2) {
            throw new Error('创建活动烛火[' + this.name + ']时发生错误；活动必须拥有日期范围');
        }


        if (!dayjs(this.dateBetween[1]).isSameOrAfter(this.dateBetween[0])) {
            throw new Error('创建活动烛火[' + this.name + ']时发生错误；截止日期不能在开始日期之前');
        }

        this.candlelight = obj.candlelight;
        this.mapName = obj.mapName;
        this.candle = obj.candle;
        this.minute = obj.minute;
        this.desc = obj.desc;
        this.type = obj.type;

    }


    /**
     * 获取当前活动可获取的固定蜡烛
     * @return {number} 固定蜡烛
     */
    getFixedCandle() {
        return this.candle ?? 0;
    }

    /**
     * 活动是否可用
     * @param date {LocalDate} 日期
     * @return {boolean} 是否进行中
     */
    available(date = LocalDate.now()) {
        return dayjs(date.getDate()).isBetween(this.dateBetween[0], this.dateBetween[1], 'date', "[]");
    }


    /**
     * 获取烛火
     * @param option {Object} 选项 （特殊类需要操作的活动烛火）
     * @param date {LocalDate} 日期
     * @return {number} 烛火
     */
    getCandlelight(option, date = LocalDate.now()) {
        if (!this.available(date)) {
            return 0;
        }
        if (this.type !== 'candlelightHarvestPoint') {
            return 0;
        }

        return this.candlelight;
    }
}


class Activity {
    /**
     * 活动Map <活动名，InternalActivity>
     * @type {Map<String,InternalActivity>}
     */
    activities = new Map();

    static createList(list) {
        let activity = new Activity();
        list && list.forEach(obj => activity.createObj(obj));
        return activity;
    }

    createObj(obj) {
        let internalActivity = new InternalActivity(obj);
        let name = internalActivity.name;
        this.activities.set(name, internalActivity)
    }

    /**
     * 获取活动烛火
     * @param value {{name:string,option:Object}} 活动
     * @param date {LocalDate} 日期
     * @return {number} 烛火
     */
    getCandlelightByName(value, date = LocalDate.now()) {
        let name = value.name;
        if (!this.activities.has(name)) {
            return 0;
        }
        let activity = this.activities.get(name);
        return activity.getCandlelight(value.option, date)
    }

    /**
     * 获取活动烛火
     * @param values {{name:string,option:Object}[]} 活动数组
     * @param date {LocalDate} 日期
     * @return {number} 烛火
     */
    getCandlelightByNames(values, date = LocalDate.now()) {
        let candlelight = 0
        if (values.length === 0) {
            return 0
        }

        values.forEach(value => {
            candlelight += this.getCandlelightByName(value, date)
        })

        return candlelight;
    }


    getActivity(name) {
        return this.activities.get(name)
    }

    /**
     * 获取所有的活动名称
     * @return {String[]}
     */
    getActivityNames() {
        return [...this.activities.keys()];
    }

    /**
     * 获取所有可用的的活动名称
     * @param date {LocalDate} 日期
     * @return {String[]} 可用的活动名
     */
    getAvailableActivityNames(date = LocalDate.now()) {
        return this.getActivityNames().filter(name => this.getActivity(name).available(date));
    }

}

export default Activity;
