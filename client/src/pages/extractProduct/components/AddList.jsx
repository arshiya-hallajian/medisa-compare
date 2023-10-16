import {useEffect} from "react";
import {useForm} from "react-hook-form";

export const AddList = ({data, setData}) => {
    const {register, handleSubmit, setValue} = useForm()

    let s_price = data.offer_price
    useEffect(() => {
        if (data.data) {
            setValue('name', data.data.name);
            setValue('mpn', data.data.mpn);
            setValue('sku', data.data.sku);
            setValue('type', 'physical');
        }
    }, [data]);

    const onSubmit = (form) => {
        console.log(form)
    }


return (
    <div
        className={`w-full md:w-11/12 h-5/6 rounded-2xl p-10 bg-gray-800 text-white fixed top-1/2 left-1/2 -translate-y-1/2 ${data.isOpen ? '-translate-x-1/2 block opacity-100' : 'translate-x-[50rem] opacity-0'} flex flex-col transition duration-700`}>
        <div className="overflow-auto scrollbar scrollbar-thin w-full">
            <form onSubmit={() => handleSubmit(onSubmit)}>
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
                               placeholder="please enter product name"
                               className="rounded-md py-1 w-full text-black text-center"/>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <label className="text-lg text-center md:text-left">sku: </label>
                        <input {...register("sku")}
                               placeholder="please enter product name"
                               className="rounded-md py-1 w-full text-black text-center"/>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <label className="text-lg text-center md:text-left md:w-24">price: </label>
                        <input {...register("price")}
                               placeholder="please enter product price"
                               className="rounded-md py-1 w-full text-black text-center"/>
                        <p className="text-sm md:absolute md:left-10 md:bottom-5">suggested
                            price: {s_price}</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <label className="text-lg text-center md:text-left">weight: </label>
                        <input {...register("weight")}
                               placeholder="please enter product weight"
                               className="rounded-md py-1 w-full text-black text-center"/>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <label className="text-lg text-center md:text-left">height: </label>
                        <input {...register("height")}
                               placeholder="please enter product weight"
                               className="rounded-md py-1 w-full text-black text-center"/>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <label className="text-lg text-center md:text-left">weight: </label>
                        <input {...register("weight")}
                               placeholder="please enter product weight"
                               className="rounded-md py-1 w-full text-black text-center"/>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <label className="text-lg text-center md:text-left">weight: </label>
                        <input {...register("weight")}
                               placeholder="please enter product weight"
                               className="rounded-md py-1 w-full text-black text-center"/>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <label className="text-lg text-center md:text-left">weight: </label>
                        <input {...register("weight")}
                               placeholder="please enter product weight"
                               className="rounded-md py-1 w-full text-black text-center"/>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <label className="text-lg text-center md:text-left md:w-24">cost_price: </label>
                        <input {...register("cost_price")}
                               placeholder="please enter product cost_price"
                               className="rounded-md py-1 w-full text-black text-center"/>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <label className="text-lg text-center md:text-left md:w-24">sale_price: </label>
                        <input {...register("sale_price")}
                               placeholder="please enter product sale_price"
                               className="rounded-md py-1 w-full text-black text-center"/>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <label className="text-lg text-center md:text-left md:w-24">calc_price: </label>
                        <input {...register("calc_price")}
                               placeholder="please enter product calc_price"
                               className="rounded-md py-1 w-full text-black text-center"/>
                    </div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
                    <button type="button"
                            onClick={() => setData(prev => ({...prev, isOpen: false}))}
                            className="py-1 bg-red-400 hover:bg-red-600 rounded-xl w-20">Close
                    </button>
                    <button type="submit" className="py-1 bg-red-400 hover:bg-red-600 rounded-xl w-20">
                        Add
                    </button>
                </div>
            </form>
        </div>
    </div>
)}