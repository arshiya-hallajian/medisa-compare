import axios from "axios";
import { useState } from "react";
import {toast,ToastContainer} from "react-toastify"
import Confirm from "./components/Confirm"
// import {ClickOut} from "./components/ClickOut"
import {io} from 'socket.io-client'




// const myData = [
//   {
//       "Dprice": [{
//         price:100,
//         sku:"11111"
//     },{
//       price:200,
//       sku:"22222"
//   }],
//       "Cprice": [],
//       "_id": "64df3134e7945afc36f9872e",
//       "mpn": "1886894",
//       "Name": "test11111111111111111111111111111111111111111111111111111111",
//       "createdAt": "2023-08-18T08:52:30.488Z",
//       "updatedAt": "2023-08-18T08:52:30.488Z",
//       "__v": 0
//   },
//   {
//       "Dprice": [{
//         price:300,
//         sku:"33333"
//     }],
//       "Cprice": [],
//       "_id": "64df314ee7945afc36f98731",
//       "mpn": "2211160",
//       "Name": "test2",
//       "createdAt": "2023-08-18T08:52:57.017Z",
//       "updatedAt": "2023-08-18T08:52:57.017Z",
//       "__v": 0
//   }
// ]




function App() {
  const [file,setFile] = useState(null)
  const [data,setData] = useState(null)
  const [loader,setLoader] = useState(null)
  const [isConfirm, setIsConfirm] = useState({isOpen:false,single:false,index:null})
  const [inputSelected,setInputSelected] = useState([])



  const onSubmitHandler = async (e) => {  
    e.preventDefault();
    console.log(file);
    const formData = new FormData();
    formData.append("csv", file[0])
    try{
      toast.info("Recieving Data..", { autoClose: false , toastId:85,position: "bottom-right", });
     

      // loaderSystem()
      const res = await axios.post(`${import.meta.env.VITE_API}/api/csv`,formData);
      
      
      if(res.status== 200){

        toast.update(85, { 
          render: "Done",
          type: toast.TYPE.SUCCESS,
           autoClose: 5000 ,
           position: "bottom-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
          });

        // console.log(res.data)
        const socket = io(`${import.meta.env.VITE_API2}`)

        const mpn = res.data;
        const total = mpn.length;
        setLoader(1)
        
        console.log(mpn)
        socket.emit('mpns',{array: res.data})

        socket.on('loader', (loadData) =>{
          console.log("loader lunched",loadData.count,"/",total)
          const percent = Math.round((loadData.count / total)*100)
          setLoader(percent)
          // setData()
          if(loadData.count == total){
            const timer = setTimeout(() => {
              setLoader(null)
              


            }, 2000);
          }
        });

        socket.on('data',(data)=>{

          setData(data.data)
          console.log(data.data)
          
          socket.disconnect()
          console.log('socket disconnected')
        })

        

        // const getdata = await axios.get(`${import.meta.env.VITE_API}/api/list`);

        // setData(getdata.data)
      }
    
    }catch(e){
      console.log(e)
      toast.update(85, { 
        render: "Error Please Try again",
        type: toast.TYPE.ERROR,
         autoClose: 5000 ,
         position: "bottom-right",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
        });
    }

  }


  const handleUpdate = async (sku,price) => {

    if(sku){
      console.log(sku,price)
      try{
        toast.info("Updating ...", { autoClose: false , toastId:80,position: "bottom-right" });
        setIsConfirm({isOpen:false,single:false,index:null})
        const res = await axios.get(`${import.meta.env.VITE_API}/api/updateProduct/${sku}?price=${price}`)
        if(res.status== 200){
          console.log(res)
          toast.update(80, { 
            render: "Updated",
            type: toast.TYPE.SUCCESS,
             autoClose: 5000 ,
             position: "bottom-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
            });
        }

      }catch(e){
        console.log(e)
        toast.update(80, { 
          render: "Error Please Try again",
          type: toast.TYPE.ERROR,
           autoClose: 5000 ,
           position: "bottom-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
          });
      }
    }else{
      toast.update(80, { 
        render: "Error Please Try again",
        type: toast.TYPE.ERROR,
         autoClose: 5000 ,
         position: "bottom-right",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
        });
      return
    }
  }

  const handleOnChange = (e) => {
    setFile(e.target.files)
    console.log(e.target.files)
  }



  const handleFormSubmit = async(e) => {
    e.preventDefault()
    console.log(inputSelected,"submited")
    if(inputSelected.length == 0){
      return console.log("you didnt select anything")
    }
    try{
      toast.info("Updating ...", { autoClose: false , toastId:90,position: "bottom-right" });
      const res = await axios.post(`${import.meta.env.VITE_API}/api/UpdateBatchProduct`, inputSelected);
      console.log(res.data)
      setInputSelected([])
      toast.update(90, { 
        render: "Updated",
        type: toast.TYPE.SUCCESS,
         autoClose: 5000 ,
         position: "bottom-right",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
        });
      
    }catch(e){
      console.log(e)
        toast.update(90, { 
          render: "Error Please Try again",
          type: toast.TYPE.ERROR,
           autoClose: 5000 ,
           position: "bottom-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
          });
    }
  }



  const hanedleFormChange = (sku,price) => {
    if(inputSelected.some(each => each.sku == sku)){
      setInputSelected(inputSelected.filter(each => each.sku !== sku))
    }else{
      setInputSelected([...inputSelected,{sku: sku, price: price}])
    }
  }

  

  return (
    <div className={`h-screen w-[200%] md:w-full overflow-x-auto bg-slate-800 relative `}>   
    {/* <div> */}
    {
    isConfirm.isOpen && <Confirm
            close={()=>setIsConfirm({isOpen:false,single:false,index:null})}
            data={{data,isConfirm}}
            confirm={handleUpdate}
            />
    }
    {/* <ClickOut  show={isConfirm.isOpen} onClickOutside={() => setIsConfirm({isOpen:false,single:false,index:null})} />
    </div> */}
    <p className="text-xs md:text-base text-center fixed w-full left-1/2 bottom-0 -translate-x-1/2 -translate-y-1/2 text-slate-400 shadow-md shadow-purple-800/40">This Program Made With ❤️ By Arshiya</p>
    <div className={`${isConfirm.isOpen && "blur-sm"} h-screen w-full md:w-full overflow-x-auto flex flex-col items-center gap-2 pt-10`}>
    <ToastContainer/>
    <div className="text-white flex gap-4">
      <p>please the csv of mpn here:</p>
      <form onSubmit={onSubmitHandler} >
        <input type="file" accept=".csv" name="file" onChange={handleOnChange} />
        <input type="submit" value="start searching" className="bg-orange-500 hover:bg-orange-400/70 rounded-lg py-2 px-5 text-white mb-20"/>
      </form>
    </div>

    {loader && <div className="flex w-3/6 text-gray-200">
      <p className="">{loader}%</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 mt-2 ml-5 inline-flex">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{"width":`${loader}%`}}></div>
      </div>
    </div>}


  {data && <>
    <table className="my-10 w-5/6 min-h-20 h-20 text-center table-fixed border-separate border-spacing-y-1 border text-white border-gray-200">
      <thead className="bg-gray-600">
        <tr> 
          <th>NAMES</th>
          <th className="truncate">{import.meta.env.VITE_COMP_SITE}</th>
          <th className="truncate">{import.meta.env.VITE_DEF_SITE}</th>
          <th>New Price</th>
        </tr>
      </thead>
      <tbody>
        {data ? data.map((code,index) => {
          let color

          if((code.Dprice[0] && code.Cprice[0] < code.Dprice[0].price) | (code.Dprice[1] && code.Cprice[1] < code.Dprice[1].price)){
            color = "bg-red-700"
          }else{
            color = "bg-green-700"
          }
 
          let singlePrice = (code.Cprice[0] - 1/100).toFixed(2);
          let boxPrice = (code.Cprice[1] - 2/100).toFixed(2);
          
          return(
          <tr className={color} key={index}>
          <td className="bg-gray-700 overflow-hidden w-[300px]">
            <p className="break-words line-clamp-2">{code.Name}</p>
          </td>
          <td>
            <p>price for single: ${code.Cprice[0] ? code.Cprice[0] : "null"}</p>
            <p>price for Box: ${code.Cprice[1] ? code.Cprice[1] : "null"}</p>
          </td>
          <td>
            <p>price for singe: ${code.Dprice[0] ? code.Dprice[0].price : "null"}</p>
            <p>price for Box: ${code.Dprice[1] ? code.Dprice[1].price : "null"}</p>
          </td>
          <td className="p-2 flex gap-3 justify-center items-center">
            <div>
              <div className={`cursor-pointer ${code.Dprice[0] ? "bg-orange-500" : "bg-gray-500/70"} rounded-lg px-3`}  onClick={() => setIsConfirm({isOpen:true,single:true,index:index})}>
              <p>single : {singlePrice} </p>
              </div>
              <div className={`cursor-pointer ${code.Dprice[1] ? "bg-orange-500" : "bg-gray-500/70"} rounded-lg mt-4 px-3`}  onClick={() => setIsConfirm({isOpen:true,single:false,index:index})}  >
              <p>Box : {boxPrice} </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
            <label htmlFor="">
              <input type="checkbox" disabled={code.Dprice[0] ? false : true} checked={code.Dprice[0] && inputSelected.some(each => each.sku === code.Dprice[0].sku)} onChange={() => hanedleFormChange(code.Dprice[0].sku,singlePrice)} className="h-6 w-6 border rounded-xl" />
            </label>
            <label htmlFor="">
              <input type="checkbox" disabled={code.Dprice[1] ? false : true} checked={code.Dprice[1] && inputSelected.some(each => each.sku === code.Dprice[1].sku)} onChange={() => hanedleFormChange(code.Dprice[1].sku, boxPrice)} className="h-6 w-6 border rounded-xl" />
            </label>
            </div>
          </td>
        </tr>
          )
        }) : <tr><td>there is nothing to show</td><td>there is nothing to show</td><td>there is nothing to show</td><td>there is nothing to show</td></tr>}
      
      </tbody>
    </table>
    {inputSelected.length != 0 && <div className="flex gap-6">
        <button onClick={handleFormSubmit} className="bg-orange-500 rounded-lg py-2 px-5 text-white mb-20">
          Update All Selected
        </button>
    </div>}
    </>}
    </div>
    </div>
  )
}

export default App

