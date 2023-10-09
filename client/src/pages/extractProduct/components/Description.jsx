
const Description = ({data,setData}) => {
    return (
        <div className={`w-3/4 md:w-3/5 h-3/5 rounded-2xl p-10 bg-gray-800 text-white fixed top-1/2 left-1/2 -translate-y-1/2 ${data.isOpen ? '-translate-x-1/2 block opacity-100' : 'translate-x-[50rem] opacity-0'} flex flex-col transition duration-700`}>
            <div className="flex-1 flex justify-center overflow-auto">{data.desc && data.desc}</div>
            {
                data.spec[0] ?
                    <div className="grid grid-cols-1 text-sm p-3 w-full text-center p-3">
                        {data.spec.map((each) => (
                            <div
                                key={each.name}>{each.name} : {each.value}</div>
                        ))}
                    </div> :
                    <p>nothing</p>
            }
            <button onClick={()=>setData(prev=>({...prev,isOpen:false}))} className="mt-10 self-center px-8 py-2 bg-red-600 hover:bg-red-700/90 rounded-2xl">Close</button>
        </div>
    )
}
export default Description