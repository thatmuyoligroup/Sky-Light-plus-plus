import {equals, print} from "./Test.js";
import LocalDate from "../LocalDate.js";
import buildGameData from '../Neteasy.js'

let Neteasy = await buildGameData;
/**
 *
 * @type {CandlelightHarvestPoint}
 */
let candlelightHarvestPoint = Neteasy.candlelightHarvestPoint;

function testGetNames() {
    let testValue = [24, 10, 15, 5]
    let actual = candlelightHarvestPoint.getNames();
    let expected = ['雨林宴会长桌', '幽光山洞营地', '霞谷神殿迷宫', '巨兽荒原营地', '圆梦村温泉', '禁阁四层', '圣岛海龟、音乐大厅', '圆梦村落雪'];
    return {
        name: '【测试所有烛火收获点】',
        pass: equals(actual, expected),
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}

function testCandlelight() {
    let testValue = ['雨林宴会长桌', '幽光山洞营地', '圆梦村落雪']
    let actual = testValue.map(value => candlelightHarvestPoint.getCandlelightByName(value, LocalDate.of(2023, 1, 12)))
    let expected = [1000, 250, 400];
    return {
        name: '【测试指定烛火收获点可获取烛火】',
        pass: equals(actual, expected),
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}


print(testGetNames(), true)
print(testCandlelight())
