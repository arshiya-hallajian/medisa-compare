import axios from "axios";
import { useState } from "react";
import {toast,ToastContainer} from "react-toastify"


function App() {
  const [file,setFile] = useState(null)
  const [data,setData] = useState(false)

  const onSubmitHandler = async (e) => {
    
    e.preventDefault();
    console.log(file);
    
    const formData = new FormData();
    formData.append("csv", file[0])
    try{
      toast.info("Recieving Data..", { autoClose: false , toastId:85,position: "bottom-right", });
      const res = await axios.post(`${import.meta.env.VITE_API}/api/csv`,formData);
      
      
      if(res.status== 200){
        const getdata = await axios.get(`${import.meta.env.VITE_API}/api/list`);
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
        // setData(getdata);
        setData(getdata.data)
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



  const handleOnChange = (e) => {
    setFile(e.target.files)
    console.log(e.target.files)
    
  }

  return (
    <div className="h-screen w-[260%] md:w-full overflow-x-auto flex flex-col items-center gap-2 pt-10 bg-slate-800 ">   
    <ToastContainer/>
    <div className="text-white flex gap-4">
      <p>please the csv of mpn here:</p>
      <form onSubmit={onSubmitHandler} >
      <input type="file" accept=".csv" name="file" onChange={handleOnChange} />
      <input type="submit" value="start searching" className="bg-orange-500 rounded-lg py-2 px-5 text-white mb-20"/>
      </form>
    </div>
    <table className="my-10 md:w-5/6 h-20 text-center table-auto border-separate border-spacing-y-1 border text-white border-gray-200">
      <thead className="bg-gray-600">
        <tr> 
          <th>NAMES</th>
          <th>{import.meta.env.VITE_COMP_SITE}</th>
          <th>{import.meta.env.VITE_DEF_SITE}</th>
          <th>New Price</th>
        </tr>
      </thead>
      <tbody>
        {data ? data.map(code => {
          let color
          if(code.Cprice[0] < code.Dprice[0] | code.Cprice[1] < code.Dprice[1]){
            color = "bg-red-700"
          }else{
            color = "bg-green-700"
          }
          return(
          <tr className={color} key={code.mpn}>
          <td className="bg-gray-700">
            <p>{code.Name}</p>
          </td>
          <td>
            <p>price for single: ${code.Cprice[0] ? code.Cprice[0] : "null"}</p>
            <p>price for satck: ${code.Cprice[1] ? code.Cprice[1] : "null"}</p>
          </td>
          <td>
            <p>price for singe: ${code.Dprice[0] ? code.Dprice[0] : "null"}</p>
            <p>price for stack: ${code.Dprice[1] ? code.Dprice[1] : "null"}</p>
          </td>
          <td className="p-2">
            <div className="cursor-pointer bg-orange-500 rounded-lg px-3">
             <p>single : - </p>
            </div>
            <div className="cursor-pointer bg-orange-500 rounded-lg mt-4 px-3">
             <p>stack : - </p>
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
    </div>
  )
}

export default App
