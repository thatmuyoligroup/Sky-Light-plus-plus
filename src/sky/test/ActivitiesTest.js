import {equals, print} from "./Test.js";
import buildGameData from '../Neteasy.js'
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import LocalDate from "../LocalDate.js";


dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)

let Neteasy = await buildGameData;
let activity = Neteasy.activity;

function testAll() {
    let testValue = []
    let actual = activity.getActivityNames()
    let expected = ['宴会节篝火'];
    return {
        name: '【所有活动烛火】',
        pass: equals(actual, expected),
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}

function testAvailable() {
    let testValue = []
    let actual = activity.getAvailableActivityNames(LocalDate.of(2022, 12, 23))
    let expected = [];
    return {
        name: '【可用活动烛火】',
        pass: equals(actual, expected),
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}


function testCandlelight() {
    let testValue = [
        {value: {name: '宴会节篝火'}, date: LocalDate.of(2022, 12, 24)},
        {value: {name: '宴会节篝火'}, date: LocalDate.of(2022, 12, 23)},
        {value: {name: '宴会节篝火'}, date: LocalDate.of(2023, 1, 14)},
        {value: {name: '宴会节篝火'}, date: LocalDate.of(2023, 1, 13)},
    ];
    let actual = testValue.map(value => {
        return activity.getCandlelightByName(value.value, value.date);
    })
    let expected = [1000, 0, 0, 1000];
    return {
        name: '【测试不同日期烛火】',
        pass: equals(actual, expected),
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}

function testNamesCandlelight() {
    let testValue = {
        value: [
            {name: '宴会节篝火'},
            {name: '宴会节篝火2'}
        ], date: LocalDate.of(2023, 1, 13)
    };

    let testValue2 = {
        value: [
            {name: '宴会节篝火'},
            {name: '宴会节篝火2'}
        ], date: LocalDate.of(2022, 12, 23)
    };
    let testValue3 = {
        value: [
            {name: '宴会节篝火'},
            {name: '宴会节篝火2'}
        ], date: LocalDate.of(2022, 12, 24)
    };
    let actual = [activity.getCandlelightByNames(testValue.value, testValue.date),
        activity.getCandlelightByNames(testValue2.value, testValue2.date),
        activity.getCandlelightByNames(testValue3.value, testValue3.date),
    ]
    let expected = [1000, 500, 1500];
    return {
        name: '【测试多个活动不同日期烛火】',
        pass: equals(actual, expected),
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}

print(testAll())
print(testAvailable())
print(testCandlelight())
print(testNamesCandlelight())

/*
"activities": [{
        "name": "宴会节篝火",
        "candlelight": 1000,
        "type": "candlelightHarvestPoint",
        "desc": "4秒/滴，需要66分40秒挂满",
        "minute": 67,
        "dateBetween": ["2022-12-24", "2023-01-13"]
    }, {
        "name": "宴会节篝火2",
        "candlelight": 500,
        "type": "candlelightHarvestPoint",
        "desc": "4秒/滴，需要66分40秒挂满",
        "minute": 67,
        "dateBetween": ["2022-12-23", "2023-01-12"]
    }]
 */
