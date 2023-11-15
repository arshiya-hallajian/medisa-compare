import {DropDown} from "./DropDown.jsx";
import {useEffect, useState} from "react";
import axios from 'axios'

// const navigationData = [
//     {
//         name: "Continence Aids",
//         submenu: [
//             'Bedding, Chair & Floor Protection',
//             'Bowel Care',
//             'Children\'s Nappies & Accessories',
//             'Disposable Pads, Pants & Liners',
//             'Swimwear',
//             'Washable Products',
//         ]
//     },
//     {
//         name: 'Daily Living & Mobility Aids',
//         submenu: [
//             'Clothing & Dressing Aids',
//             'Eating, Drinking & Meal Preparation',
//             'Household Aids',
//             'Household Products',
//             'Pressure Sore Prevention & Care',
//             'Rehabilitation & Training',
//             'Walking & Mobility Aids'
//         ]
//     },
//     {
//         name: 'Medical Aids',
//         submenu: [
//             'Enteral Feeding',
//             'First Aid',
//             'General',
//             'Needles, Syringes & Solutions',
//             'Respiratory (Breathing) Aids',
//             'Tracheotomy (Opening into the throat) Aids'
//         ]
//     },
//     {
//         name: 'Nutrition',
//         submenu: [
//             'Supplements',
//             'Vitamins'
//         ]
//     },
//     {
//         name: 'Skin Care',
//         submenu: [
//             'Adhesive & Adhesive Removers',
//             'Creams, Body Lotions, Gels & Oils',
//             'Wipes & Wash Cloths'
//         ]
//     },
//     {
//         name: 'Urology',
//         submenu: [
//             'Catheters',
//             'Condom Drainage / External Catheters',
//             'Drain and Leg Bags',
//             'Urinals & Bed Pans',
//             'Urostomy, Ostomy & Cecostomy Products'
//         ]
//     },
//     {
//         name: 'Other',
//         submenu: [
//             'Clothing & Eye Protection',
//             'Disinfectants & Cleaners',
//             'Personal Grooming & Hygiene'
//         ]
//     }
// ]

export const Navbar = ({click}) => {
    const [navbarData, setNavbarData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // setIsLoading(true)
        const fetch = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API2}/api/extract/`);
                setNavbarData(res.data.navbar)
            } catch (e) {
                console.log(e, "Error getting data");
            }
        }
        fetch()


    }, []);


    return (
        <header className="flex flex-col md:flex-row justify-center items-center md:h-32">
            <svg onClick={() => setIsOpen(!isOpen)} xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24" strokeWidth="1.5"
                 stroke="currentColor" className="w-8 h-8 text-blue-400 mr-3 mt-3 md:hidden self-end">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
            </svg>
            <nav className={`${isOpen ? "block" : "hidden"} transition md:block md:flex justify-around gap-5 text-blue-400 font-medium`}>

                {
                    navbarData &&
                    navbarData.map((each) => {
                        return (
                            <ul key={each.name}>
                                <li className="flex justify-center items-center gap-1 group py-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor"
                                         className="w-6 h-6 group-hover:rotate-180 transition duration-500">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M4.5 15.75l7.5-7.5 7.5 7.5"/>
                                    </svg>


                                    <p>
                                        {each.name}
                                    </p>
                                    <DropDown submenu={each.submenu} loading={isLoading} click={click} total={each.total}/>
                                </li>
                            </ul>

                        )
                    })
                }

            </nav>
        </header>
    )
}