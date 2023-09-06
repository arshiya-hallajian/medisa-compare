




const Confirm = ({close,data, confirm}) => {

    const index = data.isConfirm.index
    
    const singlePrice = (data.data[index].Cprice[0] - 1/100).toFixed(2);
    const boxPrice = (data.data[index].Cprice[1] - 2/100).toFixed(2);

    const handleOnClick = () =>{

        if(data.isConfirm.single){
            if(data.data[index].Dprice[0] == null){
                console.log("you cannot update this product")
            }else{
                console.log("ok","single")
                confirm(data.data[index].Dprice[0].sku, singlePrice)
            }
        }else{
            if(data.data[index].Dprice[1] == null){
                console.log("you cannot update this product")
            }else{
                console.log("ok","box")
                confirm(data.data[index].Dprice[1].sku, boxPrice)
            }
        }
    }
    
    return(
        <div className="fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 px-28 py-10 bg-gray-700 text-gray-300 rounded-3xl z-10 ">
            <h1>{`do you want to update ${data.isConfirm.single ? "single" : "box"} product price from ${data.isConfirm.single ? data.data[index].Dprice[0] !== null ? data.data[index].Dprice[0].price : "null" : data.data[index].Dprice[1] !== null ? data.data[index].Dprice[1].price : "null"} to ${data.isConfirm.single ? singlePrice : boxPrice} ?`}</h1>
            <div className="flex justify-around mt-5">
            <button className="rounded-xl px-10 py-1 hover:bg-gray-950/70 bg-gray-950 flex justify-center items-center" onClick={handleOnClick}>yes</button>
            <button className="rounded-xl px-10 py-1 hover:bg-gray-950/70 bg-gray-950 flex justify-center items-center" onClick={close}>no</button>
            </div>
        </div>
    )
}

export default Confirm