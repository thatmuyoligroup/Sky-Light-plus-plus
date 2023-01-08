import buildGameData from "../Neteasy.js";
import {equals, print} from "./Test.js";

let Neteasy = await buildGameData;

let whileCandleRule = Neteasy.whileCandleRule;

function testSurplus() {
    let testValue = [1080, 1920, 5600, 160]
    let actual = testValue.map(value => whileCandleRule.calculateSurplus(value))
    let expected = [80, 20, 180, 0];

    return {
        name: '【测试烛火余量】',
        pass: equals(actual, expected),
        testInfo: '测试烛火余量',
        testValue: testValue,
        expected: expected,
        actual: actual
    }

}

function testCandlelight() {
    let testValue = [24, 10, 15, 5]
    let actual = testValue.map(value => whileCandleRule.calculateCandlelight(value))
    let expected = [5420, 1000, 1900, 400];
    return {
        name: '【测试蜡烛所需烛火】',
        pass: equals(actual, expected),
        testInfo: '分别计算 24，10，15根所需烛火',
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}

function testCandle() {
    let testValue = [1080, 420, 1900]
    let expected = [10, 5, 15];
    let actual = testValue.map(value => whileCandleRule.calculateCandle(value))
    return {
        name: '【测试烛火合成蜡烛】',
        pass: equals(actual, expected),
        testInfo: '分别计算烛火可合成蜡烛数量，余量将忽略',
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}

function testTwoCandlelight() {
    let testValue = [[5, 10], [10, 15], [15, 20], [20, 24]]
    let expected = [600, 900, 1170, 2350];
    let actual = testValue.map((value) => whileCandleRule.calculateTwoCandlelight(value[0], value[1]))
    return {
        name: '【测试x->y蜡烛所需烛火】',
        pass: equals(actual, expected),
        testInfo: '分别计算烛火可合成蜡烛数量，余量将忽略',
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}

function testNeedCandlelight() {
    let testValue = [[400, 2], [400, 5], [5000, 1], [1000, 5]]
    let expected = [240, 600, 420, 900];
    let actual = testValue.map((value) => whileCandleRule.calculateNeedCandlelight(value[0], value[1]))

    return {
        name: '【测试后续蜡烛所需烛火】',
        pass: equals(actual, expected),
        testInfo: '测试后续蜡烛所需烛火',
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}

function testNextProgressCandlelight() {
    let testValue = [412, 406, 460, 466];
    let expected = [10, 5, 50, 55];
    let actual = testValue.map((value) => whileCandleRule.calculateNextNeedCandlelightProgress(value))

    return {
        name: '【测试合成后续蜡烛进度】',
        pass: equals(actual, expected),
        testInfo: '测试合成后续蜡烛进度',
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}

console.log('【白蜡烛规则测试用例】')
print(testCandlelight())
print(testCandle())
print(testTwoCandlelight())
print(testNeedCandlelight())
print(testNextProgressCandlelight())
print(testSurplus())
