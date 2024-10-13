import { GeoJsonObject } from 'geojson';
import { Feature, FeatureCollection, Polygon } from 'geojson';
import { Land } from '~~/types/land';

interface LandProperties {
    Id: number;
    num: string;
    nom: string;
    surface: number;
    surf_reel: string;
}
export const simpleData: Land[] = [
    {
        "id": 2,
        "num": "A4563P(5)",
        "nom": "RAHARIJAONA",
        "surface": "0.3121345231234",
        "surf_reel": "0,3512",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        47.052377329339386,
                        -19.88699299450313
                    ],
                    [
                        47.05236664737469,
                        -19.887022535828972
                    ],
                    [
                        47.052210531903704,
                        -19.887281719089234
                    ],
                    [
                        47.05221076228749,
                        -19.887282477012626
                    ],
                    [
                        47.05223837511944,
                        -19.887373318478904
                    ],
                    [
                        47.05223809105185,
                        -19.88737350425748
                    ],
                    [
                        47.05206375827076,
                        -19.887487516753712
                    ],
                    [
                        47.0518726549776,
                        -19.887453963705603
                    ],
                    [
                        47.05182781634976,
                        -19.887456856149853
                    ],
                    [
                        47.05169194816915,
                        -19.887486025950764
                    ],
                    [
                        47.05169259553846,
                        -19.887414628533875
                    ],
                    [
                        47.051707091222156,
                        -19.887241531222298
                    ],
                    [
                        47.05157285596026,
                        -19.887088674289842
                    ],
                    [
                        47.0515194106816,
                        -19.886993817811398
                    ],
                    [
                        47.05144763108024,
                        -19.886814742718535
                    ],
                    [
                        47.05149132072431,
                        -19.886837903592866
                    ],
                    [
                        47.05153318062998,
                        -19.886878106518328
                    ],
                    [
                        47.05219812830639,
                        -19.88662823497272
                    ],
                    [
                        47.05227180160782,
                        -19.886692643144208
                    ],
                    [
                        47.05232505755922,
                        -19.886815014991164
                    ],
                    [
                        47.05236992093432,
                        -19.88693855068062
                    ],
                    [
                        47.052377329339386,
                        -19.88699299450313
                    ]
                ]
            ]
        },
        "price": 1500000000000000000
    }
]
export const geojsonData: FeatureCollection<Polygon, LandProperties> = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {
            "Id": 0,
            "num": "T7260P(2)",
            "nom": "MAHASOAVA",
            "surface": 0.24245910533199999,
            "surf_reel": "0,2994"
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        47.05264176331643,
                        -19.887306227883506
                    ],
                    [
                        47.052678202427657,
                        -19.887375899879981
                    ],
                    [
                        47.052463495690908,
                        -19.887598356504579
                    ],
                    [
                        47.052161210154118,
                        -19.887544256622991
                    ],
                    [
                        47.052133721432547,
                        -19.887621396699188
                    ],
                    [
                        47.052010594036986,
                        -19.887582133935556
                    ],
                    [
                        47.051938055272856,
                        -19.887530378549304
                    ],
                    [
                        47.051873797148033,
                        -19.887455298238329
                    ],
                    [
                        47.051872654977601,
                        -19.887453963705603
                    ],
                    [
                        47.052063758270762,
                        -19.887487516753712
                    ],
                    [
                        47.052238091051848,
                        -19.887373504257479
                    ],
                    [
                        47.052238375119437,
                        -19.887373318478904
                    ],
                    [
                        47.052210762287487,
                        -19.887282477012626
                    ],
                    [
                        47.052210531903704,
                        -19.887281719089234
                    ],
                    [
                        47.05236664737469,
                        -19.887022535828972
                    ],
                    [
                        47.052377329339386,
                        -19.886992994503132
                    ],
                    [
                        47.052501316775661,
                        -19.887103773349637
                    ],
                    [
                        47.052570879762719,
                        -19.887255096421462
                    ],
                    [
                        47.05264176331643,
                        -19.887306227883506
                    ]
                ]
            ]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "Id": 0,
            "num": "T7260P(1)",
            "nom": "MAHASOAVA",
            "surface": 0.069332607280399999,
            "surf_reel": "0"
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        47.051691933117446,
                        -19.887486067073873
                    ],
                    [
                        47.051827816349757,
                        -19.887456856149853
                    ],
                    [
                        47.051901955379634,
                        -19.887548295293648
                    ],
                    [
                        47.051984669063401,
                        -19.887612332809539
                    ],
                    [
                        47.051820406735537,
                        -19.887785344575587
                    ],
                    [
                        47.051737024477418,
                        -19.887714503207015
                    ],
                    [
                        47.051679489432281,
                        -19.887635286997106
                    ],
                    [
                        47.051688966274924,
                        -19.887521644337337
                    ],
                    [
                        47.051691933117446,
                        -19.887486067073873
                    ]
                ]
            ]
        }
    }]
}