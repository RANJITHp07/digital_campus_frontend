import axios from "axios"
import chatEndpoint from "../services/endpoint/chat"


export const getMessage=async(id:string)=>{
    try{
        const res = await  axios.get(`http://localhost:8000${chatEndpoint.getMessage}/${id}`)
        return res
    }catch(err){
        throw new Error("Axios error"+ err)
    }
}