import {equals, print} from "./Test.js";
import buildGameData from '../Neteasy.js'

let Neteasy = await buildGameData;
let specialCandlelight = Neteasy.specialCandlelight;

function testGetNames() {
    let testValue = [24, 10, 15, 5]
    let actual = specialCandlelight.getNames();
    let expected = ['每日大蜡烛', '乐谱挑战', '黑暗降临', '雪人竞速', '冰上垂钓'];
    return {
        name: '【测试所有特殊烛火】',
        pass: equals(actual, expected),
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}

function testGeT() {
    let testValue = ['每日大蜡烛', '乐谱挑战', '黑暗降临']
    let actual = specialCandlelight.getByNames(testValue).map(v => v.maxSize)
    let expected = [52, 2, 1];
    return {
        name: '【测试所有特殊住火最多可完成次数】',
        pass: equals(actual, expected),
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}

function testGetCandlelight() {
    let testValue = [['每日大蜡烛', 12], ['乐谱挑战', 2], ['黑暗降临', 3]]
    let actual = testValue.map(item => specialCandlelight.getCandlelight({name: item[0], size: item[1]}))
    let expected = [600, 100, 200];
    return {
        name: '【测试特殊住火数量】',
        pass: equals(actual, expected),
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}


print(testGetNames())
print(testGeT())
print(testGetCandlelight())
