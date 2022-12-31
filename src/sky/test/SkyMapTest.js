import {equals, print} from "./Test.js";
import LocalDate from "../LocalDate.js";
import buildGameData from '../Neteasy.js'

let Neteasy = await buildGameData;


let skyMap = Neteasy.skyMap;

function testAllBasename() {
    let testValue = [];
    let expected = ["遇境", "晨岛", "云野", "雨林", "霞谷", "墓土", "禁阁", "伊甸"];
    let actual = skyMap.getAllBasename();

    return {
        name: "【测试所有大图】",
        pass: equals(actual, expected),
        testInfo: "测试所有大图",
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}

function testCandlelight() {
    let testValue = {
        date: [
            LocalDate.of(2022, 12, 16),
            LocalDate.of(2022, 12, 17),
            LocalDate.of(2022, 12, 18)
        ],
        basename: ["遇境", "晨岛", "云野", "雨林", "霞谷", "墓土", "禁阁", "伊甸"]
    };
    let expected = [23, 863, {candlelight: 836, floatCandlelight: [185, 35]},
            [895, 894, 1006],
            {candlelight: 432, candle: 2, floatCandlelight: [30, 15]},
            [
                {candlelight: 650, floatCandlelight: [270, 35]},
                {candlelight: 651, floatCandlelight: [270, 35]},
                {candlelight: 765, floatCandlelight: [270, 35]}
            ],
            679, 235
        ]
    ;
    let actual = testValue.basename.map((basename) => {
        let result = new Set();
        testValue.date.forEach(date => {
            let candlelight = skyMap.getCandlelightByBasename(basename, date);
            let fixedCandle = skyMap.getFixedCandleByBasename(basename, date);
            let data = {};
            data["candlelight"] = candlelight.candlelight
            if (fixedCandle) {
                data["candle"] = fixedCandle;
            }
            if (candlelight.floatCandlelight) {
                if (typeof candlelight.floatCandlelight === "object") {
                    let fixed = candlelight?.floatCandlelight?.fixed ?? 0;
                    let float = candlelight?.floatCandlelight?.float ?? 0;
                    data["floatCandlelight"] = [fixed, float]
                } else {
                    data["floatCandlelight"] = candlelight?.floatCandlelight?.float ? [0, float] : 0
                }
            }

            let addD = true;
            result.forEach(data0 => {
                let b = equals(data0, data);
                if (b) {
                    addD = false
                }
            })
            addD && result.add(Object.keys(data).length > 1 ? data : data["candlelight"])
        })
        return result.size > 1 ? [...result.values()] : [...result.values()][0];

    });

    return {
        name: "【测试大图烛火】",
        pass: equals(actual, expected),
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}

console.log("【地图测试用例】")

function testGet() {
    let testValue = {basename: ["遇境", "晨岛1", "雨林", "伊甸"], name: ["水之试炼1", "仙乡"]};
    let expected = [true, false, true, true, false, true];
    let actual = [...testValue.basename.map(basename => {
        try {
            return skyMap.getMapsByBasename(basename).size !== 0;
        } catch (e) {
            return false;
        }

    }), ...testValue.name.map(name => {
        try {
            return skyMap.getMapByName(name) !== null;
        } catch (e) {
            return false;
        }
    })]

    return {
        name: "【测试获取指定地图】",
        pass: equals(actual, expected),
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}


function testMapCandlelight(name, expected) {
    let testValue = {
        date: [
            LocalDate.of(2022, 12, 16),
            LocalDate.of(2022, 12, 17),
            LocalDate.of(2022, 12, 18)
        ], name: name
    };
    let actual = [];
    testValue.date.forEach(date => {
        actual.push(skyMap.getCandlelightByName(name, date).candlelight);
    })


    return {
        name: "【测试指定小图烛火】",
        pass: equals(actual, expected),
        testInfo: "测试指定小图烛火",
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}


print(testAllBasename())
print(testGet())
print(testCandlelight(), true)
console.log('雨林')
print(testMapCandlelight("雨林小广场", [0, 0, 0]))
print(testMapCandlelight("风行网道", [208, 208, 208]))
print(testMapCandlelight("静谧庭院", [46, 45, 69]))
print(testMapCandlelight("大树屋", [55, 55, 55]))
print(testMapCandlelight("荧光森林", [228, 228, 228]))
print(testMapCandlelight("秘密花园", [42, 42, 63]))
print(testMapCandlelight("地下溶洞", [57, 57, 57]))
print(testMapCandlelight("密林遗迹", [173, 173, 216]))
print(testMapCandlelight("风行网道", [208, 208, 208]))
console.log('霞谷')
print(testMapCandlelight("霞谷小广场", [0, 0, 0]))
print(testMapCandlelight("圆梦村", [51, 51, 51]))
print(testMapCandlelight("圆梦村剧场", [0, 0, 0]))
print(testMapCandlelight("音乐大厅", [3, 3, 3]))
print(testMapCandlelight("雪隐峰", [50, 50, 50]))
print(testMapCandlelight("冰道", [55, 55, 55]))
print(testMapCandlelight("滑冰场", [64, 64, 64]))
print(testMapCandlelight("霞光城", [79, 79, 79]))
print(testMapCandlelight("飞行赛道神殿", [10, 10, 10]))
print(testMapCandlelight("飞行赛道", [0, 0, 0]))
print(testMapCandlelight("滑雪赛道", [0, 0, 0]))
print(testMapCandlelight("落日竞技场", [27, 27, 27]))
print(testMapCandlelight("霞谷神殿", [93, 93, 93]))
console.log('墓土')
print(testMapCandlelight("墓土小广场", [0, 0, 0]))
print(testMapCandlelight("藏宝岛礁", [128, 128, 128]))
print(testMapCandlelight("边陲荒漠", [64, 65, 86]))
print(testMapCandlelight("失落方舟", [109, 109, 109]))
print(testMapCandlelight("巨兽荒原", [132, 132, 159]))
print(testMapCandlelight("黑水港湾", [63, 63, 101]))
print(testMapCandlelight("远古战场", [111, 111, 139]))
print(testMapCandlelight("墓土神殿", [43, 43, 43]))
console.log('禁阁')
print(testMapCandlelight("底层", [68, 68, 68]))
print(testMapCandlelight("秘密基地", [58, 58, 58]))
print(testMapCandlelight("星光沙漠", [140, 140, 140]))
print(testMapCandlelight("档案阁", [50, 50, 50]))
print(testMapCandlelight("二层", [106, 106, 106]))
print(testMapCandlelight("三层", [15, 15, 15]))
print(testMapCandlelight("四层", [172, 172, 172]))
print(testMapCandlelight("五层", [0, 0, 0]))
print(testMapCandlelight("顶层", [70, 70, 70]))


