export default {
    "metadata": {
        "gis": {
            "selected": {"color": "#00ff07", "fillColor": "rgba(89,255,104,0.68)", "opacity": 0.2},
            "unselected": {"color": "#ffffff", "fillColor": "#c6c6c6", "opacity": 0.4},
            "ignore": {"color": "#ff0000", "fillColor": "#ff0000", "opacity": 0.4}
        }

    },
    "default": {
        "defaultType": "un_support",
        "un_support": {
            "tag": "success",
            "title": "提示",
            "content": "${name}不支持单独选择烛火点！该图共有${size}个烛火点，共计最少有${candlelight}滴烛火"
        }
    },

    "mapView": {
        "遇境大厅": {
            "tag": "success",
            "type": "un_support",
            "title": "提示",
            "content": "${name}有${size}烛火点共${candlelight}烛火！ 位置相近，无需单独选择烛火点"
        },
        "藏宝岛礁": {
            "type": "un_support"
        },
        "风之试炼": {
            "type": "un_support",
            "title": "提示",
            "content": "${name}有四堆大蜡烛共${candlelight}烛火全在一起，无需单独选择烛火点"
        },
        "火之试炼": {
            "type": "un_support",
            "title": "提示",
            "content": "${name}有四堆大蜡烛共${candlelight}烛火全在一起，无需单独选择烛火点"
        },
        "晨岛": {
            "img": "https://sky-res.muyoli.com/images/maps/晨岛/晨岛-晨岛.jpg",
            "type": "gis",
            "points": [{
                "code": "010101",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010101"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[1652.990599, 474.503786], [1850.988021, 474.503786], [1845.988086, 279.502829], [1652.990599, 282.502844], [1652.990599, 474.503786]]]
                    }
                }
            }, {
                "code": "010102",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010102"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[1465.980729, 993.006679], [1651.978308, 997.006699], [1653.978282, 811.005786], [1467.980703, 809.005776], [1465.980729, 993.006679]]]
                    }
                }
            }, {
                "code": "010103",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010103"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[865.988542, 1445.020616], [1041.98625, 1447.020626], [1037.986302, 1285.019831], [867.988516, 1285.019831], [865.988542, 1445.020616]]]
                    }
                }
            }, {
                "code": "010104",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010104"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[1030.993255, 1259.51763], [1188.991198, 1256.517615], [1187.991211, 1099.516845], [1035.99319, 1107.516884], [1030.993255, 1259.51763]]]
                    }
                }
            }, {
                "code": "010105",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010105"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[607.998763, 1325.516], [768.996667, 1323.515991], [765.996706, 1157.515176], [607.998763, 1163.515205], [607.998763, 1325.516]]]
                    }
                }
            }, {
                "code": "010106",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010106"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[746.995964, 1083.522778], [917.993737, 1084.522782], [919.993711, 913.521943], [748.995938, 911.521934], [746.995964, 1083.522778]]]
                    }
                }
            }, {
                "code": "010107",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010107"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[290.61925, 822.998307], [672.614276, 826.998327], [667.233552, 251.993041], [476.619354, 254.996953], [474.61938, 635.998822], [284.621854, 632.998808], [290.61925, 822.998307]]]
                    }
                }
            }, {
                "code": "010108",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010108"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[1098.610279, 940.999804], [1246.608351, 943.999818], [1251.608286, 650.998381], [1102.610226, 651.998385], [1098.610279, 940.999804]]]
                    }
                }
            }],
            "width": 2388,
            "height": 1668
        },
        "预言山谷": {
            "img": "https://sky-res.muyoli.com/images/maps/晨岛/晨岛-预言山谷.jpg",
            "type": "gis",
            "points": [{
                "code": "010201",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010201"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[309.994297, 218.503369], [517.991589, 216.503359], [513.991641, 436.504439], [304.994362, 429.504404], [309.994297, 218.503369]]]
                    }
                }
            }, {
                "code": "010202",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010202"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[832.992318, 574.501332], [1040.98961, 572.501323], [1040.98961, 786.502373], [827.992383, 780.502343], [832.992318, 574.501332]]]
                    }
                }
            }],
            "width": 2388,
            "height": 1668
        },
        "水之试炼": {
            "img": "https://sky-res.muyoli.com/images/maps/晨岛/晨岛-水之试炼.jpg",
            "type": "gis",
            "points": [{
                "code": "010301",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010301"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[1902.996293, 1311.139653], [2164.994758, 1312.140286], [2161.994776, 1576.307396], [1898.996317, 1572.304865], [1902.996293, 1311.139653]]]
                    }
                }
            }, {
                "code": "010302",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010302"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[1327.999662, 1410.205793], [1565.998268, 1408.204527], [1562.998285, 1636.34885], [1330.999645, 1638.350116], [1327.999662, 1410.205793]]]
                    }
                }
            }, {
                "code": "010303",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010303"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[127.998291, 1360.182008], [404.996668, 1360.182008], [403.996674, 1637.357347], [127.998291, 1636.356714], [127.998291, 1360.182008]]]
                    }
                }
            }],
            "width": 2388,
            "height": 1668
        },
        "土之试炼": {
            "img": "https://sky-res.muyoli.com/images/maps/晨岛/晨岛-土之试炼.jpg",
            "type": "gis",
            "points": [{
                "code": "010401",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010401"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[1285.990886, 1001.003811], [1421.989102, 1002.003924], [1414.989193, 1130.004686], [1284.990886, 1135.004716], [1285.990886, 1001.003811]]]
                    }
                }
            }, {
                "code": "010402",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010402"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[1537.986029, 2148.002394], [1656.984479, 2148.002394], [1655.984492, 2026.001667], [1533.986081, 2028.001679], [1537.986029, 2148.002394]]]
                    }
                }
            }, {
                "code": "010403",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010403"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[875.991537, 1337.007759], [996.989961, 1338.007765], [992.990013, 1453.00845], [874.99155, 1453.00845], [875.991537, 1337.007759]]]
                    }
                }
            }, {
                "code": "010404",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010404"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[235.988229, 1980.03131], [67.990417, 1980.03131], [75.990313, 2136.032239], [237.988203, 2138.032251], [235.988229, 1980.03131]]]
                    }
                }
            }, {
                "code": "010405",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010405"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[1105.226911, 2191.997416], [939.229073, 2197.997451], [948.614875, 2348.999196], [1102.61287, 2350.999208], [1105.226911, 2191.997416]]]
                    }
                }
            }, {
                "code": "010406",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010406"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[1201.612818, 1476.12253], [1318.611294, 1479.122547], [1316.61132, 1596.123244], [1202.612805, 1591.123214], [1201.612818, 1476.12253]]]
                    }
                }
            }, {
                "code": "010407",
                "geoJSON": {
                    "type": "Feature",
                    "properties": {"code": "010407"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[1092.614237, 1693.123822], [964.615903, 1694.123828], [966.615877, 1816.124554], [1092.614237, 1818.124566], [1092.614237, 1693.123822]]]
                    }
                }
            }],
            "width": 1668,
            "height": 2388
        },
        "云野小广场": {
            "type": "un_support",
            "title": "提示",
            "content": "${name}有${size}烛火点共${candlelight}烛火！ 位置相近，无需单独选择烛火点"
        }
    }
}
