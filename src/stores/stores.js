import {ref} from 'vue'
import {defineStore} from 'pinia'
import Data from "../sky/i18n/Default.js";
import StringUtils from "../util/StringUtils.js";
import ElSystemNotice from "../util/ElSystemNotice.js";

const useMainStore = function () {
    let storeDefinition = defineStore('main', () => {
        const pageLoading = ref(false)
        const chooseData = ref(null)
        const gameDataVersion = ref(null)
        const hasError = ref(false)
        const loadDate = ref([]);
        const notificationQueue = ref([]);
        const messageQueue = ref([]);
        const version = ref(Data.about.version)

        function clear() {
            chooseData.value = null;
            gameDataVersion.value = null;
            version.value = Data.about.version;
        }

        return {
            pageLoading,
            chooseData,
            gameDataVersion,
            version,
            loadDate,
            notificationQueue,
            messageQueue,
            hasError,
            clear
        }
    }, {
        persist: {
            enabled: true
        }
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

const stores = {}
export {
    useMainStore,
    stores
}

