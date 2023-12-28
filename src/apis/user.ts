import Api from "@/services/api"
import { userEndpoint } from "@/services/endpoint/user"

// to get the details according to the pagination
export async function paginationUser(pagination:number){
    try{
        const res = await  Api.get(userEndpoint.getPaginatedUsers + `=${pagination}`)
        return res
    }catch(err){
        throw new Error("Api error"+ err)
    }
}



// to block and unblock users
export async function updateUser(id:number,blocked:boolean) {
    try{
        const res = await  Api.put(userEndpoint.userUpdate,{id,update:{blocked}})
        return res
    }catch(err){
       
        throw new Error("Api error"+ err)
    } 

  }
  
 
// to send email to user's email  
export async function SendEmail(email:string,username:string){
    try{
        const res=Api.post(userEndpoint.sendEmail,{email,username})
        return res
    }catch(err){
        throw new Error("Api error"+ err)
    }
}  


// to get the detail of a particular user using email
export async function getUser(email:string){
    try{
        const res=Api.get(userEndpoint.getUser+'/'+email)
        return res
    }catch(err){
        throw new Error("Api error"+ err)
    }
} 

//to update the user profile
export async function updateProfile(id:number,profile:string) {
    try{
        const res = await  Api.put(userEndpoint.userUpdate,{id,update:{profile}})
        return res
    }catch(err){
       
        throw new Error("Api error"+ err)
    } 

  }

  //update user details
  export async function updateDetails(id:number,details:{
    education:string | null,about:string | null
  }) {
    try{
        const res = await  Api.put(userEndpoint.userUpdate,{id,update:details})
        return res
    }catch(err){
       
        throw new Error("Api error"+ err)
    } 

  }

//update password
  export async function updatePassword(id:number,password:string) {
    try{
        const res = await  Api.put(userEndpoint.userUpdate,{id,update:{password}})
        return res
    }catch(err){
       
        throw new Error("Api error"+ err)
    } 

  }

//reset password
export async function resetPassword(id:number,password:string,oldpassword:string,bcryptPassword:string) {
        const res = await  Api.patch(userEndpoint.resetPassword,{id,oldpassword,bcryptPassword,update:{password}})
        return res
  }



//user signup
export async function userSignup(user:any){
    try{
        const res=Api.post(userEndpoint.signUp,user)
        return res
    }catch(err){
        throw new Error("Api error"+ err)
    }
}  


//get all users 
export async function getAllusers(){
    try{
        const res=Api.get(`http://localhost:4000/v1/api/auth/user/get/getAllusers`,)
        return res
    }catch(err){
        throw new Error("Api error"+ err)
    }
} 


//user login
export async function userLogin(user:{email:string,password:string}){
    try{
        const res=Api.post(userEndpoint.login,user)
        return res
    }catch(err){
        throw new Error("Api error"+ err)
    }
}  


//user email verification
export async function emailVerification(otp:string,email:string){
    try{
        const res=Api.post(userEndpoint.verifyEmail,{otp,email})
        return res
    }catch(err){
        throw new Error("Api error"+ err)
    }
}


  