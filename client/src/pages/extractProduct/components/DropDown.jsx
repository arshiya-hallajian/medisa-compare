import {CircleLoader} from "react-spinners";

export const DropDown = (props) => {
    return (
        <div className="relative">
            <ul className="bg-slate-600 rounded-xl absolute w-60 h-content top-full mt-6 py-2 px-4 right-0 opacity-0 pointer-events-none -translate-y-20 transition duration-500 group-hover:cursor-pointer group-hover:opacity-100 group-hover:pointer-events-auto group-hover:-translate-y-0 flex text-left flex-col">
                {/* eslint-disable-next-line react/prop-types */}
                {props.submenu.map((item, index) => {
                    return (
                        <li key={index}
                            className="text-sm block transition hover:bg-blue-500 hover:text-white py-1 pl-2 rounded my-2">
                            <h1>{item}</h1>
                            {/* eslint-disable-next-line react/prop-types */}
                            {props.loading ? <p className="block flex justify-center mt-2">
                                <CircleLoader size={20} color={"#4a8cf1"} />
                            </p> : <p className="text-xs text-center text-slate-400">number:<pan className="text-red-300"> 10</pan></p>
                            }


                        </li>
                    )
                })}
                <hr className="opacity-90"/>
                {/* eslint-disable-next-line react/prop-types */}
                {props.loading ? <p className="block flex justify-center mt-2">
                    <CircleLoader size={20} color={"#4a8cf1"} />
                </p> : <p className="text-slate-400 text-center mt-2">total:<span className="text-red-300">60</span></p>
                }

            </ul>

        </div>
    )
}