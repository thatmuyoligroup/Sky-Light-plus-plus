import WhileCandleRule from "../../sky/WhileCandleRule";
import buildGameData from "../../sky/Neteasy";
import Data from '../../sky/i18n/Default';
import {stores} from "../../stores/stores";

let Neteasy;

async function load() {
    Neteasy = await buildGameData;


    /**
     * @type {WhileCandleRule}
     */
    let whileCandleRule = Neteasy.whileCandleRule;

    let maxCandle = Neteasy.whileCandleRule.CANDLE.size;
    let maxCandlelight = Neteasy.whileCandleRule.calculateCandlelight(maxCandle);
    /**
     * 方法功能枚举
     * @type {{functionName:  {args: {argName:any}, func: function}}}
     */
    const utilFunctions = {
        'calculateTwoCandlelight': {
            methods: {
                result: (beginCandleNum, endCandleNum) => WhileCandleRule.prototype.calculateTwoCandlelight.call(whileCandleRule, beginCandleNum, endCandleNum)
            },
            data: () => {
                return stores['main'].utilData.calculateTwoCandlelight.args
            },
            template: `
              <el-row style="margin-bottom: 5px">
              <el-col>
                ${Data.util.i18n.calculateTwoCandlelight.args.beginCandleNum_before}
                <van-stepper v-model="beginCandleNum" integer min="0" :max="endCandleNum-1"/>
                ${Data.util.i18n.calculateTwoCandlelight.args.beginCandleNum_after}${Data.util.i18n.calculateTwoCandlelight.args.endCandleNum_before}
                <van-stepper v-model="endCandleNum" integer :min="Math.min(beginCandleNum+1,${maxCandle})"
                             max="${maxCandle}"/>
                ${Data.util.i18n.calculateTwoCandlelight.args.endCandleNum_after}
              </el-col>
              </el-row>
              <el-row style="margin-bottom: 5px">
              <el-col>
                ${Data.util.i18n.calculateTwoCandlelight.args.result}
                {{ result(beginCandleNum, endCandleNum) }}
              </el-col>
              </el-row>
            `
        },
        'calculateCandlelightByCandle': {
            methods: {
                result: (candleNum, fineTuning) => WhileCandleRule.prototype.calculateCandlelight.call(whileCandleRule, candleNum) + fineTuning,
            },
            data: () => {
                return stores['main'].utilData.calculateCandlelightByCandle.args
            },
            template: `
              <el-row style="margin-bottom: 5px">
              <el-col>
                ${Data.util.i18n.calculateCandlelightByCandle.args.candleNum_before}
                <van-stepper v-model="candleNum" integer min="0" :max="${maxCandle}"/>
                ${Data.util.i18n.calculateCandlelightByCandle.args.candleNum_after}

              </el-col>
              </el-row>
              <el-row style="margin-bottom: 5px">
              <el-col>
                ${Data.util.i18n.calculateCandlelightByCandle.args.result}
                {{ result(candleNum, fineTuning) }}
              </el-col>
              </el-row>
            `
        },
        'calculateCandleByCandlelight': {
            methods: {
                result: (candlelight) => WhileCandleRule.prototype.calculateCandle.call(whileCandleRule, candlelight),
            },
            data: () => {
                return stores['main'].utilData.calculateCandleByCandlelight.args
            },
            template: `
              <el-row style="margin-bottom: 5px">
              <el-col>
                ${Data.util.i18n.calculateCandleByCandlelight.args.candlelightNum}
                <van-stepper v-model="candlelight" integer input-width="60px" min="0" :max="${maxCandlelight}"/>
              </el-col>
              </el-row>
              <el-row style="margin-bottom: 5px">
              <el-col>
                ${Data.util.i18n.calculateCandleByCandlelight.args.result}
                {{ result(candlelight) }}
              </el-col>
              </el-row>`
        }
    }

    function clear() {
        stores['main'].clearUtilData();
    }

    return {
        functions: utilFunctions,
        clear: clear
    }
}


export default load()
