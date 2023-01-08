import {reactive, ref} from 'vue'
import {defineStore} from 'pinia'
import Data from "../sky/i18n/Default.js";
import StringUtils from "../util/StringUtils.js";
import ElSystemNotice from "../util/ElSystemNotice.js";

const useMainStore = function () {
    if (stores['main']) {
        return stores['main'];
    }

    let storeDefinition = defineStore('main', () => {
        let pageLoading = ref(false)
        let chooseData = ref(null)
        let isDark = ref(false)
        let useLocalGameData = ref(false)
        let gameDataVersion = ref(null)
        let hasError = ref(false)
        let loadDate = ref([]);
        let notificationQueue = ref([]);
        let messageQueue = ref([]);
        let version = ref(Data.about.version)
        const predictParam = reactive({
            candle: 0,
            nextProgress: 0,
            num: 1,
        })
        const utilData = reactive({
            calculateTwoCandlelight: {args: {beginCandleNum: 0, endCandleNum: 1, fineTuning: 0}},
            calculateCandlelightByCandle: {args: {candleNum: 0, fineTuning: 0}},
            calculateCandleByCandlelight: {args: {candlelight: 0}},
        });

        function clear() {
            chooseData.value = null;
            predictParam.candle = 0;
            predictParam.nextProgress = 0;
            predictParam.num = 1;
            gameDataVersion.value = null;
            version.value = Data.about.version;
            utilData.calculateTwoCandlelight = {args: {beginCandleNum: 0, endCandleNum: 1, fineTuning: 0}}
            utilData.calculateCandlelightByCandle = {args: {candleNum: 0, fineTuning: 0}}
            utilData.calculateCandleByCandlelight = {args: {candlelight: 0}}
        }

        function clearUtilData() {
            utilData.calculateTwoCandlelight.args.beginCandleNum = 0
            utilData.calculateTwoCandlelight.args.endCandleNum = 1
            utilData.calculateTwoCandlelight.args.fineTuning = 0

            utilData.calculateCandlelightByCandle.args.candleNum = 0
            utilData.calculateCandlelightByCandle.args.fineTuning = 0

            utilData.calculateCandleByCandlelight.args.candlelight = 0
        }

        return {
            isDark,
            useLocalGameData,
            pageLoading,
            chooseData,
            gameDataVersion,
            version,
            loadDate,
            notificationQueue,
            messageQueue,
            hasError,
            utilData,
            predictParam,
            clear,
            clearUtilData
        }
    }, {
        persist: true
    })();


    function addNotice(noticeTemplate, obj = null) {
        let notification = {...noticeTemplate};
        notification.message = StringUtils.format(notification.message, obj)
        ElSystemNotice.sendNotice(notification)
    }

    // 版本更细策略
    {
        if (storeDefinition.version !== Data.about.version) {
            storeDefinition.clear()
            addNotice(Data.noticeTemplate.newVersion, {version: Data.about.version});
        }
    }


    //强制清除策略
    {
        if (storeDefinition.loadDate.length >= 3) {
            storeDefinition.loadDate.shift()
        }
        storeDefinition.loadDate.push(new Date().getTime())
        if (storeDefinition.loadDate.length === 3) {
            let time1 = storeDefinition.loadDate[0];
            let time3 = storeDefinition.loadDate[2];
            let number = time3 - time1;
            if (number <= 5000) {
                addNotice(Data.noticeTemplate.forceClear);
                storeDefinition.clear()
                storeDefinition.loadDate.splice(0, 3)
            }
        }
    }

    //发生错误策略
    {
        if (storeDefinition.hasError) {
            storeDefinition.hasError = false
            storeDefinition.clear()
            addNotice(Data.noticeTemplate.forceClear);
        }

    }

    stores['main'] = storeDefinition
    return storeDefinition;
}

/**
 *
 * @return {{informed:boolean,isLoyalCustomer:boolean}}
 */
const loyalCustomerStore = function () {
    if (stores['loyalCustomer']) {
        return stores['loyalCustomer'];
    }

    let storeDefinition = defineStore('loyalCustomer', () => {
        const informed = ref(false)
        const isLoyalCustomer = ref(false)

        return {
            informed, isLoyalCustomer
        }
    }, {
        persist: true
    })();

    stores['loyalCustomer'] = storeDefinition
    return storeDefinition;
}

const stores = {}
export {
    useMainStore,
    loyalCustomerStore,
    stores
}

