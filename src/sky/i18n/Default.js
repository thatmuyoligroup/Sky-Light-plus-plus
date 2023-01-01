import locale from 'element-plus/dist/locale/zh-cn.mjs'

const dataVersion = "Ver.7.0.5.207708";
const gameVersion = "国服 v0.10.3";
const version = "V1.2.3 (20230101113248)";

const contributor = [
    '<a href="https://m.weibo.cn/u/7360748659">游离</a>',
    '<a href="https://weibo.com/u/5685423899">包包</a>',
    '<a href="https://v.kuaishou.com/Ejc9ZN">氢腥</a>',
    '<a href="https://www.gitee.com/jianjianghui" >江晖</a>',
    '松奈',
    '<a href="https://m.weibo.cn/u/2630772743">冰介</a>',
    '<a href="https://m.weibo.cn/u/5861905692">雨季</a>',
    '<a href="https://v.kuaishou.com/ESzeL1">海天</a>',
    '阿圤',
];

const noticeTemplate = {
    template: {
        showClose: false,
        title: '注意',
        type: 'warning',
        duration: 3000,
        message: '这是一条测试通知!'
    },
    hasChooseActivity: {
        showClose: true,
        title: '注意',
        type: 'warning',
        duration: 0,
        message: '目前已选择活动烛火，请确认所选天数仍在活动范围内!'
    },
    error: {
        showClose: false,
        title: '错误',
        type: 'error',
        duration: 3000,
        message: '发生错误， 请刷新页面！'
    },
    newVersion: {
        showClose: true,
        title: '成功',
        type: 'success',
        duration: 3000,
        message: '新版本${version}已准备好!'
    },
    newGameDataVersion: {
        showClose: true,
        title: '成功',
        type: 'success',
        duration: 3000,
        message: '新的数据库${version}已准备好!'
    },
    forceClear: {
        showClose: true,
        title: '成功',
        type: 'success',
        duration: 3000,
        message: '已强制清除本地缓存！'
    },
    useLocalData: {
        showClose: true,
        title: '注意',
        type: 'warning',
        message: '无法获取服务器数据，将使用已缓存的本地数据库文件！'
    }
};
const messageTemplate = {
    keepEyeSafe: {message: '要保护好眼睛哦！'},
    calculating: {message: '正在计算分析中...', type: 'warning', duration: 0},
    loadingGameData: {message: '正在加载数据中...', type: 'info', duration: 0},
};

const about = {
    authorTitle: '作者: ',
    authorSeparator: '&nbsp;&nbsp;&nbsp;',
    dailyTasks: {
        title: '每日任务',
        url: 'https://m.weibo.cn/u/7360748659',
        html: '<a href="https://m.weibo.cn/u/7360748659" target="_blank">立即前往微博</a>',
        desc: '查看季节蜡烛及本日大蜡烛位置、每日任务详解、本日大蜡烛点、黑暗降临落石点、日程提醒、活动日历攻略',
        author: '<a href="https://m.weibo.cn/u/7360748659">今天游离翻车了吗</a>'
    },
    dataSupport: {
        title: "数据支持",
        desc: "计算服务使用到的各类数据",
        author: "<a href='https://m.weibo.cn/u/2630772743'>Icetric冰介</a>",
        versionTitle: "数据版本: ",
        version: dataVersion,
        href: "https://m.weibo.cn/status/4802073034752716"
    },
    openSource: {
        title: '关于',
        html: '这是一个开源项目<a href="https://github.com/thatmuyoligroup/Sky-Light-plus-plus" rel="noopener" target="_blank">SkyLight++</a>不存在任何盈利行为，为爱发电<br/>',
        url: "https://gitee.com/thatmuyoligroup/Sky-Light-plus-plus",
    },
    form: {
        title: '让光成为向导',
        html: '从冒险季节、游戏内活动到不断扩大的友谊世界和待解锁的收藏品，Sky中有很多事情要做。通过帮助他人将坠落的光芒恢复到星座。王国入门介绍在这里\n' +
            '<a href="https://sky.163.com/">游戏官网</a>'
    },
    author: ["<a href='https://gitee.com/thatmuyoligroup'>Muyoli 团队</a>"],
    contributor: contributor,
    gameVersionTitle: '游戏版本: ',
    gameVersion: gameVersion,
    versionTitle: '程序版本: ',
    version: version
}
const start = {
    candlelightTitle: {
        map: '地图烛火点',
        special: '特别烛火',
        point: '烛火收获点',
        activity: '活动烛火',
    },
    datePlaceholder: "指定计算日期(为空时默认选择当日）",
    resultTitle: {
        overview: {
            title: '总览',
            candle: '可获得白蜡烛: ',
            next: '当前档位中本根蜡烛已收集烛火${surplus}滴（${nextProgress}%）',
            after: '合成后续3根需收集烛火分别为: ',
        },
        detail: {
            title: '烛火收取进度',
            used: '已收取烛火',
            unused: '未收取烛火',
        },
        predict: {
            title: '预测',
            hasCandle: '已有白蜡烛',
            hasNextProgress: '下根合成进度%(0-99)',
            hasCount_before: '持续跑图',
            hasCount_after: '天',
            result: '持续跑图${count}天后蜡烛数量为${candle}',
            nextProgress: '下根蜡烛收集进度${nextProgress}%',
            nextNeedCandlelight: '再收集${candlelight}滴烛火可合成下根',
        },
        button: {
            calculate: '计算',
            clear: '清空',
            export: {
                title: '导出',
                success: '方案代码已复制至剪贴板，快去保存分享吧！',
                fail: '复制方案代码发生错误，请重试！',
            },
            import: {
                title: '导入',
                boxTitle: '导入方案',
                placeholder: '请粘贴已保存的方案',
                confirm: '确认',
                error: '无法识别方案',
                success: '方案导入成功',
            },
        }
    },
    groupCandlelight: {
        'Heaven-ancestor-': '先祖',
        'Heaven-friend-': '朋友',
    },
    runWhere: {
        building: "正在建设中",
        title: "请选择烛火点",
        error: "加载失败，请重试！"
    }
}
const help = {
    defaultActive: "2",
    contributor: {
        title: "贡献者",
        notRanked: "以下排名不分先后"
    },
    copyright: {title: "版权声明"},
    howToUse: [
        {
            title: '烛火计算',
            icon: 'Position',
            type: 'menu',
            item: [{
                title: '选择烛火',
                icon: 'Place',
                type: 'menu',
                item: [
                    {
                        title: '地图烛火点',
                        type: 'itemFloat',
                        content: `点击"地图烛火点"展开所有地图,<br/>
                                    点击地图左侧复选框可全选本图所有烛火点，再次点击以取消全选。<br/>
                                    点击地图展开本图中的所有小地图，双击小地图名称可选择地图中所有烛火，再次双击小地图名称以取消选择,<br/>
                                    单击小地图名称可选择具体烛火点。<br/>
                        `,
                    },
                    {
                        title: '特别烛火',
                        type: 'itemFloat',
                        content: `点击即可选择，再次点击以取消选择,<br/>部分烛火点可手动选择收集数量。
                        `,
                    },
                    {
                        title: '烛火收获点',
                        type: 'itemFloat',
                        content: `点击即可选择，再次点击以取消选择。<br/>`,
                    },
                    {
                        title: '活动烛火',
                        type: 'itemFloat',
                        content: `本项仅在活动期间显示,<br/>点击即可选择，再次点击以取消选择.<br/>`,
                    }
                ]
            }, {
                title: '查看分析',
                type: 'menu',
                icon: 'document',
                item: [{
                    title: '总览',
                    type: 'itemFloat',
                    content: `当选择烛火点后，会进行自动计算，下滑至底部以查看总览结果。
                        `,
                }, {
                    title: '烛火收取进度',
                    type: 'itemFloat',
                    content: `当选择烛火点后，会进行自动计算，下滑至底部以查看本次所选择的烛火详情。<br/>
                        `,
                }, {
                    title: '预测',
                    type: 'itemFloat',
                    content: `当存在计算分析结果时，可使用预测功能根据此结果进行多日后蜡烛总数的预测<br/>
                            合成进度参考图：
                            <img style="width: 100%" alt="无法加载" src="https://sky-res.muyoli.com/images/SkyCandleDemo.jpg"/>
                        `,
                }, {
                    title: '清空',
                    type: 'itemFloat',
                    content: `点击下方清空按钮可快速清除已选择的烛火，<br/>
                        请注意：本次计算分析及预测的结果也将一并清空。
                        `,
                }],
            }, {
                title: '分享结果及缓存清除',
                type: 'menu',
                icon: 'share',
                item: [
                    {
                        title: '导出',
                        type: 'itemFloat',
                        content: `当想要将选择的烛火方案共享给他人或自己保存以便下次查看时，<br/>点击底部导出按钮，提示导出成功后，方案代码将自动复制至剪切板，可直接粘贴至任意地方保存分享。
  
                        `,
                    },
                    {
                        title: '导入',
                        type: 'itemFloat',
                        content: `当想要查看他人共享或已保存的方案时，可点击下底部导入按钮，<br/>
                        粘贴方案代码至文本框，点击确认，导入成功后自动计算本方案的分析结果。
                        `,
                    },
                    {
                        title: '清除本服务缓存',
                        type: 'itemFloat',
                        content: `如发生页面显示异常等意外情况时，<br/>
                                    可尝试连续刷新三次页面以清空本服务缓存文件，<br/>
                                    缓存清除后，将自动获取最新版本及数据文件。
                                    `,
                    }
                ],
            }],
        },
        {
            title: '地图级别(烛火统计图)',
            icon: 'box',
            type: 'itemFloat',
            content: `<img style="width: 100%" alt="无法加载" src="https://sky-res.muyoli.com/images/烛火统计.jpg"/>`,
        },

    ]
}


export default {
    title: '烛火计算服务',
    welcome: '欢迎使用光·遇烛火计算服务<span style="white-space:nowrap; ">（国服）</span>',
    loadingText: '正在加载中...',
    routerTitle: {'home': '主页', 'start': '开始', 'help': '帮助'},
    elLocal: {locale: locale},
    separator: '、',
    start: start,
    about: about,
    help: help,
    noticeTemplate: noticeTemplate,
    messageTemplate: messageTemplate,
    copyright: `
        本项目为开源项目，所使用的任何代码、工具不隶属于thatgamecompany及其附属公司，也不受其赞助或<span style="white-space:nowrap; ">授权。</span><br/>
        本项目中所使用的地图名称及游戏截图中的建模<span style="white-space:nowrap; ">版权所属thatgamecompany。</span><a href="https://m.weibo.cn/u/6073956879">@Muyoli_木有里</a>
     
    `,

}
