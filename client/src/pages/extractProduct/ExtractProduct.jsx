import {Navbar} from "./components/Navbar.jsx";
import axios from "axios";
import {useState} from "react";
import {io} from "socket.io-client";
import Description from "./components/Description.jsx";
import {MultiProduct} from "./MultiProduct.jsx";
import {UpdateWindow} from "./components/UpdateWindow.jsx";
import {AddList} from "./components/AddList.jsx";
import {BoxOffer, eachOffer, percent30} from "../../services/calculate_offer.js";
// import {useState} from "react";


// const Data = [
//     {
//         name: 'Mepiform Scar Management Dressing 4cmx30cm',
//         link: 'https://store.independenceaustralia.com/wound-care/scar-management/mepiform-scar-management-dressing-4cmx30cm-22291020',
//         specs: [
//             {name: 'Manufacturer', value: 'MEPIFORM'},
//             {name: 'Measurement', value: '4cmx30cm'}
//         ],
//         mpn: '293100',
//         sku: '22291020',
//         desc: 'The effective self-adherent dressing for the treatment of keloid and hypertrophic scar management',
//         stock: [
//             {name: 'ACT and NSW', available: true, quantity: 12},
//             {name: 'VIC', available: true, quantity: 15},
//             {name: 'QLD', available: false, quantity: 0},
//             {name: 'NT and SA', available: false, quantity: 0},
//             {name: 'TAS', available: false, quantity: 0},
//             {name: 'WA', available: false, quantity: 0}
//         ],
//         price: [
//             {title: 'EA', quantity: '1 Unit', priceNumber: '$36.35'},
//             {title: 'Carton', quantity: '5 EA(s)', priceNumber: '$181.75'}
//         ],
//         medisa: [
//             {
//                 typr: 'variant',
//                 id: 15125,
//                 name: 'Molnlycke Mepiform Scar Management Dressing - All Sizes',
//                 mpn: '293100',
//                 sku: 'MOL_Mepiform_S',
//                 price: [Array]
//             }
//         ]
//     }, {
//         name: 'Mepiform Scar Management Dressing 4cmx30cm',
//         link: 'https://store.independenceaustralia.com/wound-care/scar-management/mepiform-scar-management-dressing-4cmx30cm-22291020',
//         specs: [
//             {name: 'Manufacturer', value: 'MEPIFORM'},
//             {name: 'Measurement', value: '4cmx30cm'}
//         ],
//         mpn: '293100',
//         sku: '22291020',
//         desc: 'The effective self-adherent dressing for the treatment of keloid and hypertrophic scar management',
//         stock: [
//             {name: 'ACT and NSW', available: true, quantity: 12},
//             {name: 'VIC', available: true, quantity: 15},
//             {name: 'QLD', available: false, quantity: 0},
//             {name: 'NT and SA', available: false, quantity: 0},
//             {name: 'TAS', available: false, quantity: 0},
//             {name: 'WA', available: false, quantity: 0}
//         ],
//         price: [
//             {title: 'EA', quantity: '1 Unit', priceNumber: '$36.35'},
//             {title: 'Carton', quantity: '5 EA(s)', priceNumber: '$181.75'}
//         ],
//         medisa: [
//             {
//                 typr: 'variant',
//                 id: 15125,
//                 name: 'Molnlycke Mepiform Scar Management Dressing - All Sizes',
//                 mpn: '293100',
//                 sku: 'MOL_Mepiform_S',
//                 price: [Array]
//             }
//         ]
//     }, {
//         name: 'Mepiform Scar Management Dressing 4cmx30cm',
//         link: 'https://store.independenceaustralia.com/wound-care/scar-management/mepiform-scar-management-dressing-4cmx30cm-22291020',
//         specs: [
//             {name: 'Manufacturer', value: 'MEPIFORM'},
//             {name: 'Measurement', value: '4cmx30cm'}
//         ],
//         mpn: '293100',
//         sku: '22291020',
//         desc: 'The effective self-adherent dressing for the treatment of keloid and hypertrophic scar management',
//         stock: [
//             {name: 'ACT and NSW', available: true, quantity: 12},
//             {name: 'VIC', available: true, quantity: 15},
//             {name: 'QLD', available: false, quantity: 0},
//             {name: 'NT and SA', available: false, quantity: 0},
//             {name: 'TAS', available: false, quantity: 0},
//             {name: 'WA', available: false, quantity: 0}
//         ],
//         price: [
//             {title: 'EA', quantity: '1 Unit', priceNumber: '$36.35'},
//             {title: 'Carton', quantity: '5 EA(s)', priceNumber: '$181.75'}
//         ],
//         medisa: [
//             {
//                 typr: 'variant',
//                 id: 15125,
//                 name: 'Molnlycke Mepiform Scar Management Dressing - All Sizes',
//                 mpn: '293100',
//                 sku: 'MOL_Mepiform_S',
//                 price: [Array]
//             },
//             {
//                 typr: 'variant',
//                 id: 15125,
//                 name: 'Molnlycke Mepiform Scar Management Dressing - All Sizes',
//                 mpn: '293100',
//                 sku: 'MOL_Mepiform_S',
//                 price: [Array]
//             }
//         ]
//     }, {
//         name: 'Mepiform Scar Management Dressing 4cmx30cm',
//         link: 'https://store.independenceaustralia.com/wound-care/scar-management/mepiform-scar-management-dressing-4cmx30cm-22291020',
//         specs: [
//             {name: 'Manufacturer', value: 'MEPIFORM'},
//             {name: 'Measurement', value: '4cmx30cm'}
//         ],
//         mpn: '293100',
//         sku: '22291020',
//         desc: 'The effective self-adherent dressing for the treatment of keloid and hypertrophic scar management',
//         stock: [
//             {name: 'ACT and NSW', available: true, quantity: 12},
//             {name: 'VIC', available: true, quantity: 15},
//             {name: 'QLD', available: false, quantity: 0},
//             {name: 'NT and SA', available: false, quantity: 0},
//             {name: 'TAS', available: false, quantity: 0},
//             {name: 'WA', available: false, quantity: 0}
//         ],
//         price: [
//             {title: 'EA', quantity: '1 Unit', priceNumber: '$36.35'},
//             {title: 'Carton', quantity: '5 EA(s)', priceNumber: '$181.75'}
//         ],
//         medisa: [
//             {
//                 typr: 'variant',
//                 id: 15125,
//                 name: 'Molnlycke Mepiform Scar Management Dressing - All Sizes',
//                 mpn: '293100',
//                 sku: 'MOL_Mepiform_S',
//                 price: [Array]
//             }
//         ]
//     }, {
//         name: 'Mepiform Scar Management Dressing 4cmx30cm',
//         link: 'https://store.independenceaustralia.com/wound-care/scar-management/mepiform-scar-management-dressing-4cmx30cm-22291020',
//         specs: [
//             {name: 'Manufacturer', value: 'MEPIFORM'},
//             {name: 'Measurement', value: '4cmx30cm'}
//         ],
//         mpn: '293100',
//         sku: '22291020',
//         desc: 'The effective self-adherent dressing for the treatment of keloid and hypertrophic scar management',
//         stock: [
//             {name: 'ACT and NSW', available: true, quantity: 12},
//             {name: 'VIC', available: true, quantity: 15},
//             {name: 'QLD', available: false, quantity: 0},
//             {name: 'NT and SA', available: false, quantity: 0},
//             {name: 'TAS', available: false, quantity: 0},
//             {name: 'WA', available: false, quantity: 0}
//         ],
//         price: [
//             {title: 'EA', quantity: '1 Unit', priceNumber: '$36.35'},
//             {title: 'Carton', quantity: '5 EA(s)', priceNumber: '$181.75'}
//         ],
//         medisa: null
//     }, {
//         name: 'Mepiform Scar Management Dressing 4cmx30cm longggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
//         link: 'https://store.independenceaustralia.com/wound-care/scar-management/mepiform-scar-management-dressing-4cmx30cm-22291020',
//         specs: [
//             {name: 'Manufacturer', value: 'MEPIFORM'},
//             {name: 'Measurement', value: '4cmx30cm'}
//         ],
//         mpn: '293100',
//         sku: '22291020',
//         desc: 'The effective self-adherent dressing for the treatment of keloid and hypertrophic scar management',
//         stock: [
//             {name: 'ACT and NSW', available: true, quantity: 12},
//             {name: 'VIC', available: true, quantity: 15},
//             {name: 'QLD', available: false, quantity: 0},
//             {name: 'NT and SA', available: false, quantity: 0},
//             {name: 'TAS', available: false, quantity: 0},
//             {name: 'WA', available: false, quantity: 0}
//         ],
//         price: [
//             {title: 'EA', quantity: '1 Unit', priceNumber: '$36.35'},
//             {title: 'Carton', quantity: '5 EA(s)', priceNumber: '$181.75'}
//         ],
//         medisa: [
//             {
//                 typr: 'variant',
//                 id: 15125,
//                 name: 'Molnlycke Mepiform Scar Management Dressing - All Sizes',
//                 mpn: '293100',
//                 sku: 'MOL_Mepiform_S',
//                 price: [Array]
//             }
//         ]
//     },
// ]

const ExtractProduct = () => {
    const [fData, setFData] = useState([]);
    const [multip, setMultip] = useState({
        isOpen: false,
        data: []
    });
    const [addList, setAddList] = useState({
        isOpen: false,
        offer_price: null,
        data: null
    })
    const [updateWindow, setUpdateWindow] = useState({
        isOpen: false,
        data: null,
        offer_price: null,
        each: null,
        box: null
    });
    const [desc, setDesc] = useState({
        isOpen: false,
        desc: '',
        spec: []
    });
    const [loader, setLoader] = useState({
        status: 0,
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
                if (data.status === "link") {
                    setLoader(prev => ({
                        ...prev,
                        status: 1,
                        page: data.page
                    }))
                }
                if (data.status === "loading") {
                    setFData(data.data)
                    setLoader(prev => ({
                        ...prev,
                        status: 2,
                        total: data.total,
                        number: data.number,
                        percent: Math.round((data.number / data.total) * 100)
                    }))
                }
            })
            socket.on('finished', () => {
                socket.disconnect()
                setLoader((prev) => ({
                    ...prev,
                    status: 0
                }))
                console.log('disconnected')
            })
        } catch (e) {
            console.log(e)
        }
    }

    const updateWindowHandler = (data, offerPrice,ind, each = null, box = null) => {
        setUpdateWindow(prev => ({
            ...prev,
            isOpen: true,
            data: data,
            offer_price: offerPrice,
            indPrice : ind,
            each: each,
            box: box
        }))
    }
    const addListHandler = (data, offerPrice) => {
        setAddList(prev => ({
            ...prev,
            isOpen: true,
            data: data,
            offer_price: offerPrice
        }))
    }
    const multiProductHandler = (data) => {
        setMultip(prev => ({
            ...prev,
            isOpen: true,
            data: data
        }))
    }

    const desFunc = (des, spec) => {
        setDesc(prev => ({
            ...prev,
            isOpen: true,
            desc: des,
            spec: spec
        }))
        console.log(desc)
    }

    return (
        <div
            className="h-screen w-full overflow-auto bg-gray-700 relative scrollbar scrollbar-thin scrollbar-thumb-red-600">
            <Navbar click={getData}/>
            <Description data={desc} setData={setDesc}/>
            <MultiProduct data={multip} setData={setMultip} update={updateWindowHandler}/>
            <UpdateWindow data={updateWindow} setData={setUpdateWindow}/>
            <AddList data={addList} setData={setAddList}/>
            {

                loader.status === 2 &&
                <div className="mx-auto flex w-3/6 text-gray-200 mb-8">
                    <p>{`${loader.number}/${loader.total}`}</p>
                    <div className="mt-2 mb-4 ml-5 inline-flex w-full rounded-full bg-gray-200 h-2.5">
                        <div className="rounded-full bg-blue-600 h-2.5"
                             style={{"width": `${loader.percent}%`}}></div>
                    </div>
                </div>
            }
            {loader.status === 1 &&
                <div className="mx-auto w-3/6 text-gray-200 text-center text-red-500 font-bold mb-8">
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
                            <th className="border col-span-2" colSpan={5}>independence</th>
                            <th className="border" colSpan={5}>Medisa</th>
                        </tr>
                        <tr>
                            <th className="border">Name</th>
                            <th className="border px-1">Sku & Link</th>
                            <th className="border">mpn</th>
                            <th className="border">Stock</th>
                            <th className="border">Prices</th>
                            <th className="border">name</th>
                            <th className="border">Price</th>
                            <th className="border">sku</th>
                            <th className="border">update</th>
                        </tr>
                        </thead>
                        <tbody className="text-center">
                        {
                            fData.map((row, index) => {
                                const newdesc = row.desc !== '' ? row.desc : 'No Description';
                                const medisaName = row.medisa && row.medisa[0].name.split(' ').slice(0, 3).join(' ');


                                let show_Price, price_label, offer_price, offerVariantBox_price, offer2_price,
                                    offer2VariantBox_price,
                                    eachVariantPrice, BoxVariantPrice
                                if (row.medisa && row.medisa[0].type === 'normal') {
                                    //get the price of normal product
                                    if (row.medisa[0].prices[3] && row.medisa[0].prices[3].price !== 0) {
                                        show_Price = row.medisa[0].prices[3].price;
                                    } else if (row.medisa[0].prices[2] && row.medisa[0].prices[2].price !== 0) {
                                        show_Price = row.medisa[0].prices[2].price;
                                    } else {
                                        show_Price = row.medisa[0].prices[0].price;
                                    }

                                    //check if is box or not and check offer price
                                    if (row.medisa[0].name.includes('Each')) {
                                        price_label = 'each'
                                        if (row.price[0] && (row.price[0].quantity.includes('Unit') || row.price[0].quantity.includes('Units'))) {
                                            const fixed_price = row.price[0].priceNumber.replace('$', '').replace(',','')
                                            offer_price = eachOffer(show_Price, parseFloat(fixed_price))
                                            offer2_price = percent30(show_Price, parseFloat(fixed_price))
                                        } else {
                                            offer_price = 'first no'
                                            offer2_price = 'first no'
                                            // console.log('first price percent err', offer2_price, offer_price)
                                        }
                                    } else if (row.medisa[0].name.includes('Box') || row.medisa[0].name.includes('Pack') || row.medisa[0].name.includes('Pcs') || row.medisa[0].name.includes('pcs') || row.medisa[0].name.includes('Pkt') || row.medisa[0].name.includes('Pkts') || row.medisa[0].name.includes('Carton')) {
                                        price_label = 'Box'
                                        if (row.price[1]) {
                                            const fixed_price = row.price[1].priceNumber.replace('$', '').replace(',','')
                                            offer_price = BoxOffer(show_Price, parseFloat(fixed_price))
                                            offer2_price = percent30(show_Price, parseFloat(fixed_price))
                                        } else {
                                            offer_price = 'sec no'
                                            offer2_price = 'sec no'
                                            // console.log('second price percent err', offer2_price, offer_price)
                                        }
                                    } else {
                                        price_label = 'no-label'
                                    }
                                } else if (row.medisa && row.medisa[0].type === 'variant') {
                                    let fixedEach_price = null, fixedBox_price = null
                                    // eachVariantPrice = [row.medisa[0].price[0]]

                                    if (row.price[0] && row.price[1]) {
                                        fixedEach_price = parseFloat(row.price[0].priceNumber.replace('$', '').replace(',',''))
                                        fixedBox_price = parseFloat(row.price[1].priceNumber.replace('$', '').replace(',',''))

                                    } else if (row.price[0] && (row.price[0].quantity.includes('Unit') || row.price[0].quantity.includes('Units'))) {
                                        fixedEach_price = parseFloat(row.price[0].priceNumber.replace('$', '').replace(',',''))
                                    } else if (row.price[0] && (!row.price[0].quantity.includes('Unit') || !row.price[0].quantity.includes('Units'))) {
                                        fixedBox_price = parseFloat(row.price[0].priceNumber.replace('$', '').replace(',',''))
                                    }
                                    if (row.medisa[0].price && row.medisa[0].price.length > 0) {
                                        if (row.medisa[0].price[0].price[3] && row.medisa[0].price[0].price[3].price !== 0) {
                                            offer_price = eachOffer(row.medisa[0].price[0].price[3].price, fixedEach_price)
                                            offer2_price = percent30(row.medisa[0].price[0].price[3].price, fixedEach_price)
                                            if (row.medisa[0].price[0].label.length > 1) {
                                                eachVariantPrice = [`${row.medisa[0].price[0].label[0].label} - ${row.medisa[0].price[0].label[1].label}`, row.medisa[0].price[0].price[3].price];
                                            } else if (typeof (row.medisa[0].price[0].label[0]) === 'string') {
                                                eachVariantPrice = [`${row.medisa[0].price[0].label[0]} - ${row.medisa[0].price[0].label[1]}`, row.medisa[0].price[0].price[3].price];
                                            } else {
                                                eachVariantPrice = [row.medisa[0].price[0].label[0].label, row.medisa[0].price[0].price[3].price];
                                            }
                                        } else if (row.medisa[0].price[0].price[2] && row.medisa[0].price[0].price[2].price !== 0) {
                                            offer_price = eachOffer(row.medisa[0].price[0].price[2].price, fixedEach_price)
                                            offer2_price = percent30(row.medisa[0].price[0].price[2].price, fixedEach_price)
                                            if (row.medisa[0].price[0].label.length > 1) {
                                                eachVariantPrice = [`${row.medisa[0].price[0].label[0].label} - ${row.medisa[0].price[0].label[1].label}`, row.medisa[0].price[0].price[2].price];
                                            } else if (typeof (row.medisa[0].price[0].label[0]) === 'string') {
                                                eachVariantPrice = [`${row.medisa[0].price[0].label[0]} - ${row.medisa[0].price[0].label[1]}`, row.medisa[0].price[0].price[2].price];
                                            } else {
                                                eachVariantPrice = [row.medisa[0].price[0].label[0].label, row.medisa[0].price[0].price[2].price];
                                            }
                                        } else {
                                            offer_price = eachOffer(row.medisa[0].price[0].price[0].price, fixedEach_price)
                                            offer2_price = percent30(row.medisa[0].price[0].price[0].price, fixedEach_price)
                                            console.log(typeof (row.medisa[0].price[0].label[0]))
                                            if (row.medisa[0].price[0].label.length > 1) {
                                                eachVariantPrice = [`${row.medisa[0].price[0].label[0].label} - ${row.medisa[0].price[0].label[1].label}`, row.medisa[0].price[0].price[0].price];
                                            } else if (typeof (row.medisa[0].price[0].label[0]) === 'string') {
                                                eachVariantPrice = [`${row.medisa[0].price[0].label[0]} - ${row.medisa[0].price[0].label[1]}`, row.medisa[0].price[0].price[0].price];
                                            } else {
                                                eachVariantPrice = [row.medisa[0].price[0].label[0].label, row.medisa[0].price[0].price[0].price];
                                            }
                                        }
                                        // offerVariantBox_price
                                        if (row.medisa[0].price.length === 2) {
                                            offerVariantBox_price = BoxOffer(row.medisa[0].price[1].price[3].price, fixedBox_price)
                                            offer2VariantBox_price = percent30(row.medisa[0].price[1].price[3].price, fixedBox_price)
                                            if (row.medisa[0].price[1].price[3] && row.medisa[0].price[1].price[3].price !== 0) {
                                                if (row.medisa[0].price[1].label.length > 1) {
                                                    BoxVariantPrice = [`${row.medisa[0].price[1].label[0].label} - ${row.medisa[0].price[1].label[1].label}`, row.medisa[0].price[1].price[3].price];
                                                } else if (typeof (row.medisa[0].price[0].label[0]) === 'string') {
                                                    BoxVariantPrice = [`${row.medisa[0].price[1].label[0]} - ${row.medisa[0].price[1].label[1]}`, row.medisa[0].price[1].price[3].price];
                                                } else {
                                                    BoxVariantPrice = [row.medisa[0].price[1].label[0].label, row.medisa[0].price[1].price[3].price];
                                                }
                                            } else if (row.medisa[0].price[0].price[2] && row.medisa[0].price[1].price[2].price !== 0) {
                                                offerVariantBox_price = BoxOffer(row.medisa[0].price[1].price[2].price, fixedBox_price)
                                                offer2VariantBox_price = percent30(row.medisa[0].price[1].price[2].price, fixedBox_price)
                                                // BoxVariantPrice = row.medisa[0].price[1].price[2].price;
                                                if (row.medisa[0].price[1].label.length > 1) {
                                                    BoxVariantPrice = [`${row.medisa[0].price[1].label[0].label} - ${row.medisa[0].price[1].label[1].label}`, row.medisa[0].price[1].price[2].price];
                                                } else if (typeof (row.medisa[0].price[0].label[0]) === 'string') {
                                                    BoxVariantPrice = [`${row.medisa[0].price[1].label[0]} - ${row.medisa[0].price[1].label[1]}`, row.medisa[0].price[1].price[2].price];
                                                } else {
                                                    BoxVariantPrice = [row.medisa[0].price[1].label[0].label, row.medisa[0].price[1].price[2].price];
                                                }
                                            } else {
                                                offerVariantBox_price = BoxOffer(row.medisa[0].price[1].price[0].price, fixedBox_price)
                                                offer2VariantBox_price = percent30(row.medisa[0].price[1].price[0].price, fixedBox_price)
                                                // BoxVariantPrice = row.medisa[0].price[1].price[0].price;
                                                if (row.medisa[0].price[1].label.length > 1) {
                                                    BoxVariantPrice = [`${row.medisa[0].price[1].label[0].label} - ${row.medisa[0].price[1].label[1].label}`, row.medisa[0].price[1].price[0].price];
                                                } else if (typeof (row.medisa[0].price[1].label[0]) === 'string') {
                                                    BoxVariantPrice = [`${row.medisa[0].price[1].label[0]} - ${row.medisa[0].price[1].label[1]}`, row.medisa[0].price[1].price[0].price];
                                                } else {
                                                    BoxVariantPrice = [row.medisa[0].price[1].label[0].label, row.medisa[0].price[1].price[0].price];
                                                }
                                            }
                                        }
                                    }
                                    // else {
                                    //     console.log('error', row.medisa[0])
                                    // }
                                }

                                console.log(row.stock)

                                return (
                                    <tr key={index}
                                        className={`${row.exist === 0 && 'bg-red-700'} ${row.exist === 1 && 'bg-green-600/80'} text-slate-100`}>
                                        <td className="border break-all overflow-auto table-cell w-52 p-2 ">
                                            <div
                                                className="whitespace-pre-line flex justify-center items-center w-52 mx-auto px-3">
                                                {row.name}
                                            </div>
                                        </td>
                                        <td className="p-2 border whitespace-nowrap w-5">
                                            <a href={row.link} className="text-blue-500 underline">
                                                {row.sku}
                                            </a>
                                        </td>
                                        <td className="border p-2 whitespace-nowrap w-6"
                                            onClick={() => desFunc(newdesc, row.specs)}>
                                            {row.mpn}
                                        </td>
                                        <td className="border whitespace-nowrap p-2 w-52">
                                            <div className="grid grid-cols-2 text-xs mx-auto w-52">
                                                {
                                                    row.stock.map((each) => (
                                                        <div key={each.name}
                                                             className={`font-bold ${each.quantity > 5 ? "text-green-400" : (each.quantity > 0 && each.quantity <=5) ? 'text-orange-400' : "text-red-400" }`}>
                                                            {each.name} : {each.quantity}
                                                        </div>
                                                    ))
                                                }

                                            </div>
                                        </td>
                                        <td className="border whitespace-nowrap p-3 w-20 text-sm">
                                            {row.price.map((ePrice, i) => {
                                                return (
                                                    <div key={i}>
                                                        {ePrice.title} - {ePrice.quantity} - {ePrice.priceNumber}
                                                    </div>
                                                )
                                            })}
                                        </td>
                                        {
                                            row.medisa ?
                                                row.medisa.length === 1 ? <>
                                                        <td className="border w-48 whitespace-nowrap">
                                                            {medisaName}
                                                        </td>

                                                        {
                                                            row.medisa[0].type === 'normal' ?
                                                                <td className={`border w-32 whitespace-nowrap px-2 ${show_Price > offer2_price.maxPrice || show_Price < offer2_price.minPrice ? 'bg-red-600' : show_Price <= offer_price ? 'bg-green-600' : 'bg-orange-600'}`}>
                                                                    <p>
                                                                        {
                                                                            `${price_label} : $${show_Price}`
                                                                        }
                                                                    </p>
                                                                </td>
                                                                : row.medisa[0].type === 'variant' && row.medisa[0].price.length > 0 ?
                                                                    <td className={`border w-32 whitespace-nowrap px-2 `}>
                                                                        {
                                                                            eachVariantPrice &&
                                                                            <div
                                                                                className={`${eachVariantPrice[1] > offer2_price.maxPrice || eachVariantPrice[1] < offer2_price.minPrice ? 'text-red-600' : eachVariantPrice[1] <= offer_price ? 'text-green-600' : 'text-orange-600'}`}>
                                                                                {
                                                                                    `${eachVariantPrice[0]} : $${eachVariantPrice[1]}`
                                                                                }
                                                                            </div>
                                                                        }
                                                                        {BoxVariantPrice &&
                                                                            <div className={`${BoxVariantPrice[1] > offer2VariantBox_price.maxPrice || BoxVariantPrice[1] < offer2VariantBox_price.minPrice ? 'text-red-600' : BoxVariantPrice[1] <= offerVariantBox_price ? 'text-green-600' : 'text-orange-600' }`}>
                                                                                {/*{`${BoxVariantPrice[0]} : $${BoxVariantPrice[1]}-> ${offerVariantBox_price} -> M${offer2VariantBox_price.maxPrice} -> m${offer2VariantBox_price.minPrice} B`}*/}
                                                                                {`${BoxVariantPrice[0]} : $${BoxVariantPrice[1]}`}
                                                                            </div>
                                                                        }
                                                                    </td> :
                                                                    <td className={`border w-32 whitespace-nowrap px-2 `}>
                                                                        <p>error</p>
                                                                    </td>
                                                        }
                                                        <td className="border w-36 whitespace-nowrap px-2">{row.medisa[0].sku}</td>
                                                        <td className="border whitespace-nowrap">
                                                            <div
                                                                className="flex flex-col gap-1 justify-center items-center w-full px-2">

                                                                <button
                                                                    className="bg-red-400 px-4 py-1 rounded-lg hover:bg-red-600"
                                                                    onClick={() => updateWindowHandler(row.medisa[0], offer_price,row.price, eachVariantPrice, BoxVariantPrice)}>update
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                    :
                                                    <td className="border cursor-pointer w-full hover:bg-slate-600"
                                                        colSpan={4} onClick={() => multiProductHandler(row)}>
                                                        two product found
                                                    </td>
                                                :
                                                <td className="border" colSpan={5}>
                                                    <button
                                                        onClick={() => addListHandler(row, offer_price)}
                                                        className="px-4 py-1 bg-red-400 rounded-lg hover:bg-red-600">
                                                        add to list
                                                    </button>
                                                </td>
                                        }

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