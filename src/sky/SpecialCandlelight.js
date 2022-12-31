/**
 * 特别烛火
 */
class SpecialCandlelight {
    /**
     * @type Map<String,{name: String,candlelight: number,lowestCandlelight:number, desc: String, maxSize: number,option:{selectItem:[{name:string,size:number}],input:false,inputPlaceholder:string,selectPlaceholder:string}}>
     */
    waxs;

    constructor() {
        this.waxs = new Map();

    }

    /**
     *
     * @param list {Object[]}
     */
    static createList(list) {
        let specialCandlelight = new SpecialCandlelight();
        list && list.forEach(obj => specialCandlelight.createObj(obj));
        return specialCandlelight;
    }

    /**
     *
     * @param name {String}
     * @param candlelight {number}
     * @param desc {String}
     * @param maxSize {number}
     * @param option {{selectItem:[{name:string,size:number}],input:false,inputPlaceholder:string,selectPlaceholder:string}}
     * @param lowestCandlelight {number}
     */
    create(name, candlelight, desc, maxSize, option, lowestCandlelight) {
        this.waxs.set(name, {
            name: name,
            candlelight: candlelight,
            desc: desc,
            maxSize: maxSize,
            option: option,
            lowestCandlelight: lowestCandlelight
        });
    }

    createObj(obj) {
        let name = obj.name;
        let candlelight = obj.candlelight;
        let lowestCandlelight = obj.lowestCandlelight ?? 0;
        let desc = obj.desc;
        let maxSize = obj.maxSize;
        let option = obj.option;

        this.create(name, candlelight, desc, maxSize, option, lowestCandlelight)
    }

    /**
     *
     * @return {String[]}
     */
    getNames() {
        return [...this.waxs.keys()]
    }


    /**
     *通过名称s获取
     * @param names
     * @return {{name: String,candlelight: number, desc: String, lowestCandlelight:number,maxSize: number,lowestCandlelight:number,option:{group: {"name": string, "type": string},selectItem:[{name:string,size:number}],input:false,inputPlaceholder:string,selectPlaceholder:string}}[]}
     */
    getByNames(names) {
        return names.map(name => this.getByName(name))
    }

    /**
     *通过名称获取
     * @param name
     * @return {{name: String,candlelight: number,lowestCandlelight:number, desc: String, maxSize: number,option:{group: {"name": string, "type": string},selectItem:[{name:string,size:number}],input:false,inputPlaceholder:string,selectPlaceholder:string}}}
     */
    getByName(name) {
        return this.waxs.get(name);
    }

    /**
     * 通过给定的特殊烛火名获取烛火数量
     * @param {{name:string,size:number}} values
     * @return number
     */
    getCandlelight(...values) {
        let candlelight = 0
        if (values.length === 0) {
            return 0
        }

        values.forEach(({name, size}) => {
            let special = this.getByName(name);
            if (!special) {
                candlelight += 0;
                return;
            }
            candlelight += special.lowestCandlelight + (special.candlelight * Math.min(size, special.maxSize)) ?? 0;
        })
        
        return candlelight
    }

}

export default SpecialCandlelight
