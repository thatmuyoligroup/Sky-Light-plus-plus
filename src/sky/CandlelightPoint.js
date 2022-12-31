import LocalDate from "./LocalDate.js";

class CandlelightPoint {
    static INDEX = new Set();

    /**
     * 标识
     * @type string
     */
    name;
    /**
     * 全局唯一标识
     * @type string
     */
    code;

    /**
     * 类型
     */
    type;
    /**
     * 描述
     * @type string
     */
    desc;
    /**
     * 烛火
     * @type number
     */
    candlelight;

    /**
     * 浮动烛火（±） 如果为number 则表示只有float
     * @type number | {fixed:number,float:number}
     */
    floatCandlelight;

    /**
     * 坐标信息（预留）
     */
    coordinate;

    /**
     * 坐标位置图片url
     * @type string[]
     */
    coordinateImgUrl;

    /**
     * 出现的时间（星期）
     * @type (1,2,3,3,4,5,6,7)[]
     */
    appearIn;

    constructor(name, code, type, candlelight, floatCandlelight, appearIn, desc, coordinate, coordinateImgUrl) {
        if (!name || !code) {
            throw new Error('烛火点标识(' + name + ')与编码(' + code + ')必须不为空，请检查数据合法性');
        }

        if (CandlelightPoint.INDEX.has(code)) {
            throw new Error('烛火点编码(' + code + ')必须全局不唯一!!!请检查数据合法性');
        }

        CandlelightPoint.INDEX.add(code);
        this.name = name
        this.code = code
        this.type = type
        this.candlelight = candlelight
        this.floatCandlelight = floatCandlelight
        this.appearIn = appearIn ?? [];
        this.desc = desc
        this.coordinate = coordinate
        this.coordinateImgUrl = coordinateImgUrl
    }

    static createByObj(obj) {
        let name = obj.name ?? obj.code;
        let code = obj.code;
        let type = obj.type;
        let desc = obj.desc ?? null;
        let candlelight = obj.candlelight ?? 0;
        let floatCandlelight = obj.floatCandlelight ?? 0;
        if (floatCandlelight instanceof Array) {
            floatCandlelight = {fixed: floatCandlelight[0], float: floatCandlelight[1]}
        }
        // 处理存在于逻辑
        let appearIn = null;
        {

            if (obj.appearIn instanceof Array) {
                appearIn = obj.appearIn
            } else {
                if ([135, '135', 'odd', 'o'].includes(obj.appearIn)) {
                    appearIn = [1, 3, 5, 7]
                }
                if ([246, '246', 'even', 'e'].includes(obj.appearIn)) {
                    appearIn = [2, 4, 6, 7]
                }
            }

            if (!obj.appearIn) {
                appearIn = [1, 2, 3, 4, 5, 6, 7];
            }
        }

        return this.create7(name, code, type, candlelight, appearIn, floatCandlelight, desc)
    }

    static create(name, code, type, candlelight, floatCandlelight = null) {
        return new CandlelightPoint(name, code, type, candlelight, floatCandlelight, [1, 2, 3, 4, 5, 6, 7], null);
    }

    static create7(name, code, type, candlelight, appearIn, floatCandlelight = null, desc = null) {
        return new CandlelightPoint(name, code, type, candlelight, floatCandlelight, appearIn, desc);
    }

    /**
     * 获取当前烛火点可获取的烛火
     * @param date {LocalDate}
     * @return {{candlelight:number,floatCandlelight:number|{fixed:number,float:number}}} 烛火,浮动烛火
     */
    getCandlelight(date = LocalDate.now()) {
        if (!this.available()) {
            return {candlelight: 0, floatCandlelight: 0};
        }

        let candlelight = this.candlelight ?? 0;
        let floatCandlelight = this.floatCandlelight ?? 0;
        return {candlelight, floatCandlelight};
    }

    available(date = LocalDate.now()) {
        if (!this.appearIn || !this.appearIn.length) {
            return true;
        }
        if (date && !this.appearIn.includes(date.getDayOfWeek())) {
            return false;
        }

        return true;
    }
}

export default CandlelightPoint;
