import { adminEndpoint } from '@/services/endpoint/admin'
import Api from '@/services/api'


export const createAdmin=async(email:string,password:string)=>{

      const res=await Api.post(adminEndpoint.create,{email,password})
      return res
}