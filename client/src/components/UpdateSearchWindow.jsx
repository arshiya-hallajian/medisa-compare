import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import axios from "axios";

export const UpdateSearchWindow = ({data, setData}) => {
    const [images, setImages] = useState({
        each:null,
        box:null
    });
    const {register, unregister, handleSubmit, setValue} = useForm()
    // const [product, setProduct] = useState(null);
    let s_price = data.offer_prices.Neach, indPrice = data.indPrice, B_price = data.offer_prices.Vbox

    useEffect(() => {
        if (data.data) {
            console.log(data)
            if (data.data.type === 'normal') {
                // setProduct(data.data)
                if (data.data) {
                    setValue('id', data.data.id)
                    setValue('type', 'normal')
                    setValue('name', data.data.name)
                    setValue('mpn', data.data.mpn)
                    setValue('sku', data.data.sku)
                    setValue('price', data.data.prices['price'])
                    setValue('cost_price', data.data.prices['cost_price'])
                    setValue('sale_price', data.data.prices['sale_price'])
                    setValue('calc_price', data.data.prices['calc_price'])
                    unregister('each')
                    unregister('box')
                }
            } else if (data.data.type === 'variant') {
                setValue('D_mpn', data.default_mpn)
                setValue('name', data.data.name)
                setValue('id', data.data.id)
                setValue('mpn', data.data.mpn)
                setValue('sku', data.data.sku)
                unregister('price')
                unregister('calc_price')
                unregister('cost_price')
                unregister('sale_price')
                setValue('type', 'variant')

                setValue('each.price', data.data.variants[0].prices['price'])
                setValue('each.cost_price', data.data.variants[0].prices['cost_price'])
                setValue('each.sale_price', data.data.variants[0].prices['sale_price'])
                setValue('each.calc_price', data.data.variants[0].prices['calc_price'])
                setValue('each.sku', data.data.variants[0].sku)
                if (data.data.variants[0].image !== '') {

                    setImages(prev => ({
                        ...prev,
                        each: data.data.variants[0].image
                    }))
                }
                if (data.data.variants[1]) {
                    if (data.data.variants[1].image !== '') {

                        setImages(prev => ({
                            ...prev,
                            box: data.data.variants[1].image
                        }))
                    }
                    setValue('box.price', data.data.variants[1].prices['price'])
                    setValue('box.cost_price', data.data.variants[1].prices['cost_price'])
                    setValue('box.sale_price', data.data.variants[1].prices['sale_price'])
                    setValue('box.calc_price', data.data.variants[1].prices['calc_price'])
                    setValue('box.sku', data.data.variants[1].sku)
                } else {
                    setValue('box', null)
                }
            }
        }
    }, [data, setValue, unregister]);




    const onSubmit = async(d) => {
        console.log(d)
        try{
            const res = await axios.post(`${import.meta.env.VITE_API2}/api/extract/update`,d)
            // if(res.status === 200){
            //     setData(prev => ({...prev, isOpen: false, data: null}))
            // }
            console.log(res.data)
        }catch (e) {
            console.log(e)
        }
    }


    return (
        <div
            className={`w-full md:w-11/12 h-5/6 rounded-2xl p-10 bg-gray-800 text-white fixed top-1/2 left-1/2 -translate-y-1/2 ${data.isOpen ? '-translate-x-1/2 block opacity-100' : 'translate-x-[50rem] opacity-0'} flex flex-col transition duration-700 pb-16`}>
            <div className="overflow-auto scrollbar scrollbar-thin w-full p-4">
                {data.data && data.data.type === 'normal' ?
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10 md:pb-0">
                            <div className="flex flex-col md:flex-row gap-4">
                                <label className="text-lg text-center md:text-left">name: </label>
                                <input {...register("name")}
                                       placeholder="please enter product name"
                                       className="rounded-md py-1 w-full text-black text-center"/>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <label className="text-lg text-center md:text-left">mpn: </label>
                                <input {...register("mpn")}
                                       placeholder="please enter product mpn"
                                       className="rounded-md py-1 w-full text-black text-center"/>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <label className="text-lg text-center md:text-left">sku: </label>
                                <input {...register("sku")}
                                       placeholder="please enter product sku"
                                       className="rounded-md py-1 w-full text-black text-center"/>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <label className="text-lg text-center md:text-left">price: </label>
                                <input {...register("price")}
                                       placeholder="please enter product price"
                                       className="rounded-md py-1 w-full text-black text-center"/>
                                <div
                                    className="text-sm md:absolute flex justify-center items-center md:left-10 md:bottom-5"
                                    onClick={() => {
                                        setValue('price', s_price)
                                        setValue('calc_price', s_price)
                                    }}>suggested price: <span
                                    className="flex mx-2 flex-col justify-center items-center"><p>{indPrice[0].quantity}-{indPrice[0].priceNumber}</p><p>{indPrice[1] && `${indPrice[1].quantity}-${indPrice[1].priceNumber}`}</p></span>| {s_price}
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <label className="text-lg text-center md:text-left">cost_price: </label>
                                <input {...register("cost_price")}
                                       placeholder="please enter product cost_price"
                                       className="rounded-md py-1 w-full text-black text-center"/>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <label className="text-lg text-center md:text-left">sale_price: </label>
                                <input {...register("sale_price")}
                                       placeholder="please enter product sale_price"
                                       className="rounded-md py-1 w-full text-black text-center"/>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <label className="text-lg text-center md:text-left">calc_price: </label>
                                <input {...register("calc_price")}
                                       placeholder="please enter product calc_price"
                                       className="rounded-md py-1 w-full text-black text-center"/>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
                            <button type="button"
                                    onClick={() => setData(prev => ({...prev, isOpen: false, data: null}))}
                                    className="py-1 bg-red-400 hover:bg-red-600 rounded-xl w-20">Close
                            </button>
                            <button type="submit" className="py-1 bg-red-400 hover:bg-red-600 rounded-xl w-20">Update
                            </button>
                        </div>
                    </form> :
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10 md:pb-0">
                            <div className="flex flex-col md:flex-row gap-4">
                                <label className="text-lg text-center md:text-left">name: </label>
                                <input {...register("name")}
                                       placeholder="please enter product name"
                                       className="rounded-md py-1 w-full text-black text-center"/>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <label className="text-lg text-center md:text-left">mpn: </label>
                                <input {...register("mpn")}
                                       placeholder="please enter product mpn"
                                       className="rounded-md py-1 w-full text-black text-center"/>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <label className="text-lg text-center md:text-left">sku: </label>
                                <input {...register("sku")}
                                       placeholder="please enter product sku"
                                       className="rounded-md py-1 w-full text-black text-center"/>
                            </div>
                        </div>
                        {data.each && <>
                            <br/>
                            <hr/>
                            <br/>
                            <p className="text-center mb-3"> {data.data.variants[0].label}</p>
                            <div className="flex justify-center items-center mb-5">
                                {
                                    images.each &&
                                    <img className="w:full md:w-1/4" src={images.each} alt="img"/>
                                }
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <label className="text-lg text-center md:text-left md:w-24">price: </label>
                                <input {...register("each.price")}
                                       placeholder="please enter product price"
                                       defaultValue={null}
                                       className="rounded-md py-1 w-full text-black text-center"/>
                                <div
                                    className="text-sm md:absolute flex justify-center items-center md:left-10 md:bottom-5"
                                    onClick={() => {
                                        setValue('each.price', s_price)
                                        setValue('each.calc_price', s_price)
                                    }
                                    }>suggested price: <span
                                    className="flex mx-2 flex-col justify-center items-center"><p>{indPrice[0].quantity}-{indPrice[0].priceNumber}</p><p>{indPrice[1] && `${indPrice[1].quantity}-${indPrice[1].priceNumber}`}</p></span>| <span
                                    className={`${B_price && 'md:mb-5'} ml-2`}>{s_price}</span>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <label className="text-lg text-center md:text-left md:w-24">cost_price: </label>
                                <input {...register("each.cost_price")}
                                       placeholder="please enter product cost_price"
                                       defaultValue={null}
                                       className="rounded-md py-1 w-full text-black text-center"/>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <label className="text-lg text-center md:text-left md:w-24">sale_price: </label>
                                <input {...register("each.sale_price")}
                                       placeholder="please enter product sale_price"
                                       defaultValue={null}
                                       className="rounded-md py-1 w-full text-black text-center"/>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <label className="text-lg text-center md:text-left md:w-24">calc_price: </label>
                                <input {...register("each.calc_price")}
                                       placeholder="please enter product calc_price"
                                       defaultValue={null}
                                       className="rounded-md py-1 w-full text-black text-center"/>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <label className="text-lg text-center md:text-left md:w-24">sku: </label>
                                <input {...register("each.sku")}
                                       placeholder="please enter product sku"
                                       className="rounded-md py-1 w-full text-black text-center"/>
                            </div>
                        </>}
                        {data.box &&
                            <>
                                <br/>
                                <hr/>
                                <br/>
                                <p className="text-center mb-3"> {data.data.variants[1].label}</p>
                                <div className="flex justify-center items-center mb-5">
                                    {
                                        images.box &&
                                        <img className="w:full md:w-1/4" src={images.box} alt="img"/>
                                    }
                                </div>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <label className="text-lg text-center md:text-left md:w-24">price: </label>
                                    <input {...register("box.price")}
                                           placeholder="please enter product price"
                                           defaultValue={null}
                                           className="rounded-md py-1 w-full text-black text-center"/>
                                    <div
                                        className="text-sm md:absolute flex justify-center items-center md:left-10 md:bottom-5"
                                        onClick={() => {
                                            setValue('box.price', B_price)
                                            setValue('box.calc_price', B_price)
                                        }}>suggested price: <span
                                        className="flex mx-2 flex-col justify-center items-center"><p>{indPrice[0].quantity}-{indPrice[0].priceNumber}</p><p>{indPrice[1] && `${indPrice[1].quantity}-${indPrice[1].priceNumber}`}</p></span>| <span
                                        className={`md:mt-5 ml-2`}>{B_price && B_price}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <label className="text-lg text-center md:text-left md:w-24">cost_price: </label>
                                    <input {...register("box.cost_price")}
                                           placeholder="please enter product cost_price"
                                           defaultValue={null}
                                           className="rounded-md py-1 w-full text-black text-center"/>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <label className="text-lg text-center md:text-left md:w-24">sale_price: </label>
                                    <input {...register("box.sale_price")}
                                           placeholder="please enter product sale_price"
                                           defaultValue={null}
                                           className="rounded-md py-1 w-full text-black text-center"/>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <label className="text-lg text-center md:text-left md:w-24">calc_price: </label>
                                    <input {...register("box.calc_price")}
                                           placeholder="please enter product calc_price"
                                           defaultValue={null}
                                           className="rounded-md py-1 w-full text-black text-center"/>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <label className="text-lg text-center md:text-left md:w-24">sku: </label>
                                    <input {...register("box.sku")}
                                           placeholder="please enter product sku"
                                           className="rounded-md py-1 w-full text-black text-center"/>
                                </div>
                            </>}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
                            <button type="button"
                                    onClick={() => setData(prev => ({...prev, isOpen: false}))}
                                    className="py-1 bg-red-400 hover:bg-red-600 rounded-xl w-20">Close
                            </button>
                            <button type="submit" className="py-1 bg-red-400 hover:bg-red-600 rounded-xl w-20">Update
                            </button>
                        </div>
                    </form>
                }
            </div>
        </div>
    )
}


