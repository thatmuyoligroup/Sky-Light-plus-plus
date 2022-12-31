import LocalDate from "./LocalDate.js";
import buildGameData from './Neteasy.js'

let Neteasy = await buildGameData;
// dayjs.extend(isBetween)
// dayjs.extend(isSameOrAfter)
//
// let dayjs1 = dayjs();
// dayjs().isSameOrAfter('2011-01-01', 'date')
//
// console.log(dayjs1.isBetween('2010-10-19', '2022-12-28', 'days', "[]"))
// //
// // let allBasename = Neteasy.skyMap.getAllBasename();
// // console.log("目前的所有根地图：" + allBasename);
// console.log("全图烛火点：", Neteasy.skyMap.getCandlelight(), "固定蜡烛:" + Neteasy.skyMap.getFixedCandle() + "根")
// // allBasename.forEach(basename => {
// //     let candlelight = Neteasy.skyMap.getCandlelightByBasename(basename);
// //     console.log('--', basename, "烛火点：", candlelight, "固定蜡烛:" + Neteasy.skyMap.getFixedCandleByBasename(basename) + "根")
// //     let maps = Neteasy.skyMap.getMapsByBasename(basename);
// //     maps.forEach((skyMap, name) => {
// //         console.log('----', name, "烛火点：", Neteasy.skyMap.getCandlelightByName(name), "固定蜡烛:" + skyMap.getFixedCandle() + "根")
// //         skyMap.candlelightPoints.forEach(value => {
// //             console.log('------', value.name, "烛火点：", value.getCandlelight())
// //         })
// //     })
// // })
//
//
Neteasy.service.analyze(LocalDate.of(2022, 12, 30), {
    maps: [{
        name: '静谧庭院'
    }],
    special: [],
    harvestPoint: []
},).then(value => {
    console.log(JSON.stringify(value.used.candlelight, null, 2))
})
