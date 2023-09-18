import {Navbar} from "./components/Navbar.jsx";
import axios from "axios";
import {useState} from "react";
import {io} from "socket.io-client";
// import {useState} from "react";


const data = [{
    name: 'Wash Bowl Small 140mm Green',
    link: 'https://store.independenceaustralia.com/daily-living-mobility-aids/household-aids/wash-bowl-small-140mm-green-33004140',
    specs: [
        {name: 'Manufacturer', value: 'DOUGLAS BEAN'},
        {name: 'Colour', value: 'GREEN'},
        {name: 'Measurement', value: '140mm'},
        {name: 'Size', value: 'SMALL'}
    ],
    sku: '33004140',
    desc: 'small green wash bowl',
    stock: [
        {name: 'ACT and NSW', available: true, quantity: 9},
        {name: 'VIC', available: true, quantity: 13},
        {name: 'QLD', available: false, quantity: 0},
        {name: 'NT and SA', available: false, quantity: 0},
        {name: 'TAS', available: false, quantity: 0},
        {name: 'WA', available: false, quantity: 0}
    ],
    price: [
        {P_title: 'EA', P_quantity: '1 Unit', P_priceNumber: '$6.49'},
        {
            C_title: 'Carton',
            C_quantity: '10 EA(s)',
            C_priceNumber: '$64.90'
        }
    ]
}, {
    name: 'Wash Bowl Small 140mm Green',
    link: 'https://store.independenceaustralia.com/daily-living-mobility-aids/household-aids/wash-bowl-small-140mm-green-33004140',
    specs: [
        {name: 'Manufacturer', value: 'DOUGLAS BEAN'},
        {name: 'Colour', value: 'GREEN'},
        {name: 'Measurement', value: '140mm'},
        {name: 'Size', value: 'SMALL'}
    ],
    sku: '33004140',
    desc: 'small green wash bowl',
    stock: [
        {name: 'ACT and NSW', available: true, quantity: 9},
        {name: 'VIC', available: true, quantity: 13},
        {name: 'QLD', available: false, quantity: 0},
        {name: 'NT and SA', available: false, quantity: 0},
        {name: 'TAS', available: false, quantity: 0},
        {name: 'WA', available: false, quantity: 0}
    ],
    price: [
        {P_title: 'EA', P_quantity: '1 Unit', P_priceNumber: '$6.49'},
        {
            C_title: 'Carton',
            C_quantity: '10 EA(s)',
            C_priceNumber: '$64.90'
        }
    ]
}, {
    name: 'Wash Bowl Small 140mm Green',
    link: 'https://store.independenceaustralia.com/daily-living-mobility-aids/household-aids/wash-bowl-small-140mm-green-33004140',
    specs: [
        {name: 'Manufacturer', value: 'DOUGLAS BEAN'},
        {name: 'Colour', value: 'GREEN'},
        {name: 'Measurement', value: '140mm'},
        {name: 'Size', value: 'SMALL'}
    ],
    sku: '33004140',
    desc: 'small green wash bowl',
    stock: [
        {name: 'ACT and NSW', available: true, quantity: 9},
        {name: 'VIC', available: true, quantity: 13},
        {name: 'QLD', available: false, quantity: 0},
        {name: 'NT and SA', available: false, quantity: 0},
        {name: 'TAS', available: false, quantity: 0},
        {name: 'WA', available: false, quantity: 0}
    ],
    price: [
        {P_title: 'EA', P_quantity: '1 Unit', P_priceNumber: '$6.49'},
        {
            C_title: 'Carton',
            C_quantity: '10 EA(s)',
            C_priceNumber: '$64.90'
        }
    ]
}, {
    name: 'Wash Bowl Small 140mm Green',
    link: 'https://store.independenceaustralia.com/daily-living-mobility-aids/household-aids/wash-bowl-small-140mm-green-33004140',
    specs: [
        {name: 'Manufacturer', value: 'DOUGLAS BEAN'},
        {name: 'Colour', value: 'GREEN'},
        {name: 'Measurement', value: '140mm'},
        {name: 'Size', value: 'SMALL'}
    ],
    sku: '33004140',
    desc: 'small green wash bowl',
    stock: [
        {name: 'ACT and NSW', available: true, quantity: 9},
        {name: 'VIC', available: true, quantity: 13},
        {name: 'QLD', available: false, quantity: 0},
        {name: 'NT and SA', available: false, quantity: 0},
        {name: 'TAS', available: false, quantity: 0},
        {name: 'WA', available: false, quantity: 0}
    ],
    price: [
        {P_title: 'EA', P_quantity: '1 Unit', P_priceNumber: '$6.49'},
        {
            C_title: 'Carton',
            C_quantity: '10 EA(s)',
            C_priceNumber: '$64.90'
        }
    ]
}, {
    name: 'Wash Bowl Small 140mm Green',
    link: 'https://store.independenceaustralia.com/daily-living-mobility-aids/household-aids/wash-bowl-small-140mm-green-33004140',
    specs: [
        {name: 'Manufacturer', value: 'DOUGLAS BEAN'},
        {name: 'Colour', value: 'GREEN'},
        {name: 'Measurement', value: '140mm'},
        {name: 'Size', value: 'SMALL'}
    ],
    sku: '33004140',
    desc: 'small green wash bowl',
    stock: [
        {name: 'ACT and NSW', available: true, quantity: 9},
        {name: 'VIC', available: true, quantity: 13},
        {name: 'QLD', available: false, quantity: 0},
        {name: 'NT and SA', available: false, quantity: 0},
        {name: 'TAS', available: false, quantity: 0},
        {name: 'WA', available: false, quantity: 0}
    ],
    price: [
        {P_title: 'EA', P_quantity: '1 Unit', P_priceNumber: '$6.49'},
        {
            C_title: 'Carton',
            C_quantity: '10 EA(s)',
            C_priceNumber: '$64.90'
        }
    ]
}, {
    name: 'Wash Bowl Small 140mm Green',
    link: 'https://store.independenceaustralia.com/daily-living-mobility-aids/household-aids/wash-bowl-small-140mm-green-33004140',
    specs: [
        {name: 'Manufacturer', value: 'DOUGLAS BEAN'},
        {name: 'Colour', value: 'GREEN'},
        {name: 'Measurement', value: '140mm'},
        {name: 'Size', value: 'SMALL'}
    ],
    sku: '33004140',
    desc: 'small green wash bowl',
    stock: [
        {name: 'ACT and NSW', available: true, quantity: 9},
        {name: 'VIC', available: true, quantity: 13},
        {name: 'QLD', available: false, quantity: 0},
        {name: 'NT and SA', available: false, quantity: 0},
        {name: 'TAS', available: false, quantity: 0},
        {name: 'WA', available: false, quantity: 0}
    ],
    price: [
        {P_title: 'EA', P_quantity: '1 Unit', P_priceNumber: '$6.49'},
        {
            C_title: 'Carton',
            C_quantity: '10 EA(s)',
            C_priceNumber: '$64.90'
        }
    ]
}, {
    name: 'Wash Bowl Small 140mm Green',
    link: 'https://store.independenceaustralia.com/daily-living-mobility-aids/household-aids/wash-bowl-small-140mm-green-33004140',
    specs: [
        {name: 'Manufacturer', value: 'DOUGLAS BEAN'},
        {name: 'Colour', value: 'GREEN'},
        {name: 'Measurement', value: '140mm'},
        {name: 'Size', value: 'SMALL'}
    ],
    sku: '33004140',
    desc: 'small green wash bowl',
    stock: [
        {name: 'ACT and NSW', available: true, quantity: 9},
        {name: 'VIC', available: true, quantity: 13},
        {name: 'QLD', available: false, quantity: 0},
        {name: 'NT and SA', available: false, quantity: 0},
        {name: 'TAS', available: false, quantity: 0},
        {name: 'WA', available: false, quantity: 0}
    ],
    price: [
        {P_title: 'EA', P_quantity: '1 Unit', P_priceNumber: '$6.49'},
        {
            C_title: 'Carton',
            C_quantity: '10 EA(s)',
            C_priceNumber: '$64.90'
        }
    ]
}]

const ExtractProduct = () => {
    const [fData, setFData] = useState([]);
    const [loader, setLoader] = useState({
        status: false,
        number: 0,
        page: 0,
        total: 0,
        percent: 0
    });


    const getData = async (url) => {
        try {
            const socket = await io(import.meta.env.VITE_API2)
            // const res = await axios.get(`https://rhn9zs-8080.csb.app/?url=${url}`);
            const res = await axios.get(`${import.meta.env.VITE_API2}/api/extract/getAllProducts?url=${url}`)
            console.log(res.data)


            socket.on('connect', () => {
                console.log("connected")
            })

            socket.on('extract-loader', (data) => {
                console.log(data.data)
                if(data.status === "link"){
                    loader.status = 1
                    loader.page = data.page
                    loader.total = 1
                    loader.number = 1
                    loader.percent = 50
                    setLoader( {
                        ...loader
                    })
                }
                if(data.status === "loading"){
                    loader.status = 2
                    loader.total = data.total
                    loader.number = data.number
                    setFData(data.data)
                    loader.percent = Math.round((data.number / data.total)*100)
                    setLoader({
                        ...loader,
                    })
                }



            })
            socket.on('finished', () => {
                socket.disconnect()
                loader.status = false
                console.log('disconnected')
            })


        } catch (e) {
            console.log(e)
        }


    }

    return (
        <div className="h-screen w-full overflow-auto bg-gray-700">
            <Navbar click={getData}/>


            {
                loader.status === 2 &&
                <div className="mx-auto flex w-3/6 text-gray-200">
                    {/*<p className="">{loader.number}/{loader.total}</p>*/}
                    <p>{`${loader.number}/${loader.total}`}</p>
                    <div className="mt-2 mb-4 ml-5 inline-flex w-full rounded-full bg-gray-200 h-2.5">
                        <div className="rounded-full bg-blue-600 h-2.5" style={{"width": `${loader.percent}%`}}></div>
                    </div>
                </div>
            }
            {loader.status === 1 && <div className="mx-auto w-3/6 text-gray-200 text-center text-red-500 font-bold mb-8">
                {/*<p className="">{loader.number}/{loader.total}</p>*/}
                <p>{`scrap links on page(${loader.page})`}</p>

            </div>

            }

            {
                fData[0] &&
            <div className="overflow-auto">
                <table className="w-full border-separate border-spacing-y-2 text-slate-300">
                    <thead>
                    <tr>
                        <th className="border">Name</th>
                        <th className="border">Sku & Link</th>
                        <th className="border">Spec</th>
                        <th className="border">Description</th>
                        <th className="border">Stock</th>
                        <th className="border">Prices</th>
                    </tr>
                    </thead>
                    <tbody className="text-center">
                    {
                        fData.map((row, index) => {
                            return (
                                <tr key={index} className={`${row.exist === 0 && 'bg-red-700'} ${row.exist === 1 && 'bg-green-600/80'} text-slate-100`}>
                                    <td className=" p-3 border whitespace-nowrap">
                                        <div className="w-60 line-clamp-2 mx-auto">
                                            <p className="break-all">
                                                {row.name}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-3 border whitespace-nowrap"><a href={row.link}
                                                                                    className="text-blue-500 underline">{row.sku}</a>
                                    </td>
                                    <td className="border whitespace-nowrap ">
                                        {
                                            row.specs[0] ?
                                                <div className="grid grid-cols-1 text-sm p-3 w-60 p-3">
                                                    {row.specs.map((each) => (
                                                        <div
                                                            key={each.name}>{each.name} : {each.value}</div>
                                                    ))}
                                                </div> :
                                                <p>nothing</p>
                                        }
                                    </td>
                                    <td className="p-3 border whitespace-nowrap">click to open description</td>
                                    <td className="border whitespace-nowrap">
                                        <div className="grid grid-cols-2 text-sm w-60 p-3 mx-auto">
                                            {
                                                row.stock.map((each) => (
                                                    <div key={each.name}
                                                         className={`font-bold ${each.available ? "text-green-400" : "text-red-400"}`}>
                                                        {each.name} : {each.quantity}
                                                    </div>
                                                ))
                                            }

                                        </div>
                                    </td>
                                    <td className="border whitespace-nowrap p-3">
                                        {row.price.map((ePrice, i) => {
                                            return (
                                                <div key={i}>
                                                    {ePrice.title} - {ePrice.quantity} - {ePrice.priceNumber}
                                                </div>
                                            )
                                        })}
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>

            </div>
            }
        </div>
    )
}
export default ExtractProduct