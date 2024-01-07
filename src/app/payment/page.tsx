'use client'
import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react';


function loadScript(src: string): Promise<boolean> {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}



function Payment() {
    const [name, setName] = useState('Mehul');

    async function displayRazorpay() {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        
            const response = await axios.post('http://localhost:6003/v1/api/payment/subscription', {
              planName: '6months',
              interval: 6,
              amount: 900,
              username: 'Ranjith',
              email: 'ranjith@gmail.com',
              plan_id: '89890',
            });
          
            const data = response.data;
            console.log(data.data);
          
        const options = {
            key:"rzp_test_f2VkhZBqoeOqME" ,
            name:"6 months subscription",
            description:"6 months plan in digital ocean",
            subscription_id:data.data.id,
            callback_url:'http://localhost:6003/v1/api/payment/verification'
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
    }

    return (
        <div>
           <Image
            src={"/Logo.png"}
            width="40"
            height="60"
            alt="logo"
            className='mx-3 my-3'
          />
          <div className='flex justify-center items-center'>
          <div className='w-1/2 mx-9 my-16'>
            <p className='heading font-semibold mt-9 text-[60px] text-[#194866] '>Transforming the digital campus experience is not just a choice</p>
            <p className='text my-3 text-[#194866]'>it's a journey of discovery, empowerment, and limitless opportunities. Elevate your journey with our exclusive subscription, unlocking a world where innovation meets education, and each moment is a step towards a brighter future. Join us to redefine your learning adventure—subscribe now and embark on a digital campus advantage like never before. Your gateway to knowledge, connectivity, and unparalleled growth awaits!</p>
          </div>
          <div className='w-1/2'>
              <div className='box_shadow w-3/4 mx-auto my-5 p-5 text text-slate-600'>
                <p>6 month subscription</p>
                <p>online class availble</p>
                <p>Infinte number of classrooms avaible</p>
                <button className='w-full bg-green-600 text-white p-2 my-3 ' onClick={displayRazorpay}>Subscribe</button>
              </div>
              
          </div>
          
          </div>
        </div>
    );
}

export default Payment;
