import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext.jsx';
import axios from "axios"

const Verify = () => {

    //to find the url parameter we will use the useSeachParams
    const [searchParams,setSearchParams] = useSearchParams() ;
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    //now we will get the backend url from the context api
    const {url} = useContext(StoreContext);
    const navigate = useNavigate() ;


    const verifyPayment = async() => {
        const response = await axios.post(url+"/api/order/verify",{success,orderId});
        if(response.data.success){
            navigate("/myorders");
        }
        else{
            navigate("/")    //if payment fails navigate the user to homepage
        }
    }

    useEffect(() => {
        verifyPayment() ;
    },[])
    
  return (
    <div className='verify'>
    <div className="spinner"></div>
    </div>
  )
}

export default Verify
