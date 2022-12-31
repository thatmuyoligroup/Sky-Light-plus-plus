import LocalDate from "../LocalDate.js";

function format(testValue) {
    if (testValue instanceof Array) {
        let text = '[';
        testValue.forEach((v, index) => {
            text += format(v)
            if (index + 1 < testValue.length) {
                text += ','
            }
        });
        text += ']'
        return text;
    } else if (testValue instanceof LocalDate) {
        return `${testValue.date.getFullYear()}-${testValue.getMonth()}-${testValue.getDayOfMonth()}(星期${testValue.getDayOfWeek()})`;
    } else if (testValue instanceof Object) {
        let s = '{';
        Object.keys(testValue).forEach((value, index) => {
            return s += `${value}:${format(testValue[value])}${index + 1 === Object.keys(testValue).length ? '' : ','}`
        })
        return s + "}";
    } else {
        return testValue;
    }
}

/**
 * 打印测试项
 * @param obj {{name:string,pass:boolean, testInfo?: string, testValue:any,expected: any, actual: any}}
 * @param formatThen 是否格式化输入输出（预期/实际），默认为false
 */
export function print(obj, formatThen = false) {
    // console.log(obj.name, obj.name.length)
    let table = obj.name.length > 10 ? '\t' : '\t\t';
    let testValue = format(obj.testValue);

    if (obj.pass) {
        console.log(`【${obj.pass}】 ${obj.name} ${table}${formatThen ? '\n' : ' '}testValue:${format(testValue)}${formatThen ? '\n' : ' '}expected:${format(obj.expected)}${formatThen ? '\n' : ' '}actual:  ${format(obj.actual)}`)
        return;
    }
    console.error(`【${obj.pass}】${obj.name} ${table}${formatThen ? '\n' : ' '}testValue:${format(testValue)}${formatThen ? '\n' : ' '}expected:${format(obj.expected)}${formatThen ? '\n' : ' '}actual:  ${format(obj.actual)}`)
}

/**
 * 比较两个数组是否相等
 * @param obj1 {any}
 * @param obj2 {any}
 */
export function equals(obj1 = [], obj2 = []) {
    if (obj2 === null && obj1 === null) {
        return true;
    }

    if (obj2 === null) {
        return false;
    }

    if (obj1 === obj2) {
        return true;
    }
    if (typeof obj1 !== typeof obj2) {
        return false;
    }

    if (obj1 instanceof Array && obj2 instanceof Array) {
        if (obj1.length !== obj2.length) {
            return false;
        }
        for (let i = 0; i < obj1.length; i++) {
            if (!equals(obj1[i], obj2[i])) {
                return false
            }
        }
    } else if (typeof obj1 === 'object' && typeof obj2 === 'object') {
        if (Object.keys(obj1).length !== Object.keys(obj2).length) {
            return false;
        }
        let go = true;
        Object.keys(obj1).forEach(key => {
            if (!equals(obj1[key], obj2[key])) {
                go = false;
            }
        })
        if (!go) {
            return false;
        }
    } else {
        if (obj1 !== obj2) {
            return false;
        }
    }


    return true;
}


function testTemplate() {
    let testValue = [24, 10, 15, 5]
    let actual = [1, 2, 3, 4]
    let expected = [5420, 1000, 1900, 400];
    return {
        name: '【xxx】',
        pass: equals(actual, expected),
        testValue: testValue,
        expected: expected,
        actual: actual
    }
}

