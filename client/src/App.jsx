import axios from "axios";
import { useState } from "react";
import {toast,ToastContainer} from "react-toastify"
import Confirm from "./components/Confirm"
// import {ClickOut} from "./components/ClickOut"
import {io} from 'socket.io-client'


function App() {
  const [file,setFile] = useState(null)
  const [data,setData] = useState(false)
  const [loader,setLoader] = useState(null)
  const [isConfirm, setIsConfirm] = useState({isOpen:false,single:false,index:null})





  

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
        const socket = io(`${import.meta.env.VITE_API}`)

        const mpn = res.data;
        const total = mpn.length;
        setLoader(1)
        
        
        socket.emit('mpns',{array: res.data})

        socket.on('loader', (loadData) =>{
          console.log("loader lunched",loadData.count,"/",total)
          const percent = (loadData.count / total)*100
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


  return (
    <div className={`h-screen w-[260%] md:w-full overflow-x-auto bg-slate-800 relative `}>   
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
    <div className={`${isConfirm.isOpen && "blur-sm"} flex flex-col items-center gap-2 pt-10`}>
    <ToastContainer/>
    <div className="text-white flex gap-4">
      <p>please the csv of mpn here:</p>
      <form onSubmit={onSubmitHandler} >
      <input type="file" accept=".csv" name="file" onChange={handleOnChange} />
      <input type="submit" value="start searching" className="bg-orange-500 rounded-lg py-2 px-5 text-white mb-20"/>
      </form>
    </div>

    {loader && <div className="flex w-3/6 text-gray-200">
      <p className="">{loader}%</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 mt-2 ml-5 inline-flex">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{"width":`${loader}%`}}></div>
      </div>
    </div>}


  {data && <>
    <table className="my-10 w-5/6 min-h-20 h-20 text-center table-auto border-separate border-spacing-y-1 border text-white border-gray-200">
      <thead className="bg-gray-600">
        <tr> 
          <th>NAMES</th>
          <th>{import.meta.env.VITE_COMP_SITE}</th>
          <th>{import.meta.env.VITE_DEF_SITE}</th>
          <th>New Price</th>
        </tr>
      </thead>
      <tbody>
        {data ? data.map((code,index) => {
          let color

          
          if((code.Cprice[0] && code.Cprice[0] < code.Dprice[0].price) | (code.Dprice[1] && code.Cprice[1] < code.Dprice[1].price)){
            color = "bg-red-700"
          }else{
            color = "bg-green-700"
          }
 
          let singlePrice = code.Cprice[0] - 1/100;
          let boxPrice = code.Cprice[1] - 2/100;
          
          return(
          <tr className={color} key={index}>
          <td className="bg-gray-700">
            <p>{code.Name}</p>
          </td>
          <td>
            <p>price for single: ${code.Cprice[0] ? code.Cprice[0] : "null"}</p>
            <p>price for Box: ${code.Cprice[1] ? code.Cprice[1] : "null"}</p>
          </td>
          <td>
            <p>price for singe: ${code.Dprice[0] ? code.Dprice[0].price : "null"}</p>
            <p>price for Box: ${code.Dprice[1] ? code.Dprice[1].price : "null"}</p>
          </td>
          <td className="p-2">
            <div className={`cursor-pointer ${code.Dprice[0] ? "bg-orange-500" : "bg-gray-500/70"} rounded-lg px-3`}  onClick={() => setIsConfirm({isOpen:true,single:true,index:index})}>
             <p>single : {singlePrice} </p>
            </div>
            <div className={`cursor-pointer ${code.Dprice[1] ? "bg-orange-500" : "bg-gray-500/70"} rounded-lg mt-4 px-3`}  onClick={() => setIsConfirm({isOpen:true,single:false,index:index})}  >
             <p>Box : {boxPrice} </p>
            </div>
          </td>
          <td>
            <label htmlFor="">
              <input type="checkbox" className="h-8 w-8 border rounded-xl" />
              {/* <input type="checkbox" className="h-10 w-10 border appearance-none rounded-xl" checked/> */}
            </label>
          </td>
        </tr>
          )
        }) : <tr><td>there is nothing to show</td><td>there is nothing to show</td><td>there is nothing to show</td><td>there is nothing to show</td></tr>}
        

      </tbody>
    </table>
    <button className="bg-orange-500 rounded-lg py-2 px-5 text-white mb-20">
      Update All Selected
    </button>
    </>}
    </div>
    </div>
  )
}

export default App

