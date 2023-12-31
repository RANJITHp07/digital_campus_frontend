import Api from "@/services/api"
import chatEndpoint from "../services/endpoint/chat"


export const getMessage=async(id:string,skip:number)=>{
    try{
        const res = await  Api.get(`${chatEndpoint.getMessage}/${id}`,{
            params:{
                skip
            }
        })
        return res
    }catch(err){
        console.log("jiii")
        throw new Error("Axios error"+ err)
    }
}