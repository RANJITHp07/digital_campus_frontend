import axios from 'axios'
import { adminEndpoint } from '@/services/endpoint/admin'


export const createAdmin=async(email:string,password:string)=>{

      const res=await axios.post(`http://localhost:4000${adminEndpoint.create}`,{email,password})
      return res
}