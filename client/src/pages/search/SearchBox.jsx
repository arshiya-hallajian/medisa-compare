import {MagnifyingGlassIcon} from "@heroicons/react/24/solid"
import {useState} from "react";

export const SearchBox = ({click}) => {
    const [SearchInput, setSearchInput] = useState("")



    const onChangeSearch = (e) => {
        setSearchInput(e.target.value)
    }
    const onSubmitHandler = (e) => {
        e.preventDefault();
        if(SearchInput !== ""){
        const fixedInput = SearchInput.replace(" ", "+")
        click(fixedInput)
        }
    }


    return (
        <div className="flex w-screen md:w-full justify-center items-center py-2 md:py-7">
            <form onSubmit={onSubmitHandler}>
                <div className="flex bg-white rounded-full overflow-hidden">
                    <input type="text" onChange={onChangeSearch} className=" md:w-96 px-3 border-0 outline-none" name="search"
                           placeholder="search your product here"/>
                    <button className="bg-amber-400 rounded-full text-black p-1 md:p-2 transition hover:scale-125 hover:animate-pulse active:bg-amber-600">
                        <MagnifyingGlassIcon className="w-8"/>
                    </button>
                </div>
            </form>
        </div>
    )
}