import {stores} from "../stores/stores.js";
import {watch} from "vue";
import {ElMessage, ElNotification} from "element-plus";
import StringUtils from "./StringUtils.js";

export default class ElSystemNotice {
    static #ready = false;
    static #tempNoticeQueue = []
    static #tempMessageQueue = []

    static load() {
        if (ElSystemNotice.#ready) {
            return;
        }

        let main = stores['main'];
        if (!main) {
            throw new Error('无法加载存储模块,请确保存储模块已事先加载!')
        }
        ElSystemNotice.#ready = true;
        ElSystemNotice.#tempNoticeQueue.forEach(value => ElSystemNotice.sendNotice(value))
        ElSystemNotice.#tempMessageQueue.forEach(value => ElSystemNotice.sendMsg(value))
        loadNoticeModule();
        loadMessageModule();

        function loadNoticeModule() {
            let notificationQueue = main.notificationQueue;
            if (notificationQueue.length) {
                let notification = notificationQueue.shift();
                ElSystemNotice.#handleNotification(notification)

            }
            watch(notificationQueue, () => {
                if (notificationQueue.length) {
                    let notification = notificationQueue.shift();
                    ElSystemNotice.#handleNotification(notification)
                }
            })
        }

        function loadMessageModule() {
            let messageQueue = main.messageQueue;
            if (messageQueue.length) {
                let message = messageQueue.shift();
                ElSystemNotice.#handleMessage(message)
            }
            watch(messageQueue, () => {
                if (messageQueue.length) {
                    let message = messageQueue.shift();
                    ElSystemNotice.#handleMessage(message)
                }
            })
        }
    }

    static #handleNotification(notification) {
        ElNotification(notification)
    }

    static #handleMessage(notification) {
        ElMessage(notification)
    }


    /**
     * 发送消息
     * @param content {String| { grouping: false, showClose: false,duration:300,dangerouslyUseHTMLString:false,type:('success'|'warning'|'error'|'info'),message:String}}
     * @param obj {Object} 模板数据
     */
    static sendMsg(content, obj) {
        if (typeof content === 'string') {
            content = {message: content}
        }

        let message = {...content};
        if (obj) {
            message.message = StringUtils.format(message.message, obj)
        }
        console.log(message)


        if (!ElSystemNotice.#ready) {
            console.warn('系统通知模块未加载！已增加至临时队列！');
            ElSystemNotice.#tempMessageQueue.push(message)
            return;
        }

        stores['main'].messageQueue.push(message);

    }

    /**
     * 发送通知
     * @param content { {
     * dangerouslyUseHTMLString?:false,
     * showClose?: true,
     * title: String,
     * message: String,
     * duration?: 3000,
     * type?:'info'|('success'|'warning'|'error')
     * } }
     * @param obj {Object} 模板数据
     */
    static sendNotice(content, obj) {
        let notification = {...content};
        if (obj) {
            notification.message = StringUtils.format(notification.message, obj)
        }


        if (!ElSystemNotice.#ready) {
            console.warn('系统通知模块未加载！已增加至临时队列！');
            ElSystemNotice.#tempNoticeQueue.push(notification)
            return;
        }

        stores['main'].notificationQueue.push(notification);

    }
}
