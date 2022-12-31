class WhileCandleRule {
    /**
     * 每根合成烛火数映射表
     * @type {Map<number,number>} 白蜡烛 每根合成烛火数 映射表
     */
    CANDLE = new Map();
    
    /**
     * 通过蜡烛数量计算所需烛火
     * @param candleNum {number} 蜡烛数量
     * @returns {number} 烛火数量
     */
    calculateCandlelight(candleNum) {
        const CANDLE = this.CANDLE;
        if (candleNum <= 0) {
            return 0;
        }

        let size = 0;
        while (candleNum !== 0) {
            if (CANDLE.has(candleNum)) {
                size += CANDLE.get(candleNum--);
            } else {
                return Infinity;
            }

        }
        return size;
    }

    /**
     * 计算从第几根到第几根所需烛火
     * @param beginCandleNum 从第几根(通常是已经拿到的蜡烛数量)
     * @param endCandleNum 到第几根
     * @returns {number} 烛火数量
     */
    calculateTwoCandlelight(beginCandleNum, endCandleNum) {
        return this.calculateCandlelight(endCandleNum) - this.calculateCandlelight(beginCandleNum);
    }

    /**
     * 通过烛火数量计算蜡烛
     * @param candlelight 烛火数量
     * @returns {number} 蜡烛数量
     */
    calculateCandle(candlelight) {
        let base = this.CANDLE.size;
        while (base >= 0) {
            if (this.calculateCandlelight(base) <= candlelight) {
                return base;
            }
            --base;
        }
        return 0;
    }


    /**
     * 通过烛火数量计算余量
     * @param candlelight 烛火数量
     * @returns {number} 合成后 多余出来的烛火
     */
    calculateSurplus(candlelight) {
        let candle = this.calculateCandle(candlelight);
        let justNeed = this.calculateCandlelight(candle);
        return candlelight - justNeed;
    }

    /**
     * 计算以当前烛火数量再获取几根后还需要的烛火数量
     * @param currentCandlelight {number}当前烛火数量
     * @param needCandleNum{number} 再获取几根
     * @returns {number}  还需要的烛火数量
     */
    calculateNeedCandlelight(currentCandlelight, needCandleNum) {
        let candleNum = this.calculateCandle(currentCandlelight);
        return this.calculateTwoCandlelight(candleNum, candleNum + needCandleNum) - (currentCandlelight - this.calculateCandlelight(candleNum));
    }


    /**
     * 计算以当前烛火数量再获取1根后还需要的烛火数量
     * @param currentCandlelight {number}当前烛火数量
     * @returns {number}  还需要的烛火数量
     */
    calculateNextNeedCandlelight(currentCandlelight) {
        return this.calculateNeedCandlelight(currentCandlelight, 1);
    }

    /**
     * 计算以当前烛火数量 获取下一根的百分比进度（不包含小数点后的进度）
     * @param currentCandlelight {number}当前烛火数量
     * @returns {number}  还需要的烛火数量
     */
    calculateNextNeedCandlelightProgress(currentCandlelight) {
        let candleNum = this.calculateCandle(currentCandlelight);
        let need = this.calculateTwoCandlelight(candleNum, candleNum + 1);
        return Math.floor((need - this.calculateNeedCandlelight(currentCandlelight, 1)) / need * 100);
    }
}

export default WhileCandleRule;
