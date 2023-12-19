'use client'
import axios from 'axios';
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



function App() {
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
        <div className="App">
            <header className="App-header">
                {/* <img src={logo} className="App-logo" alt="logo" /> */}
                <div className="flex justify-center my-24">
                 <div className="w-1/4 box_shadow p-5 pt-16 my-12 mx-12 ">
                <div className="grid place-content-center">
      {/* <Image src={`/${selectedPlan.image}`} width={100} height={100} alt="photo" className="rounded-full grid place-content-center my-6" /> */}
      </div>
      <p className='text-center text-2xl font-bold text-indigo-950'>Free trials</p>
      
      <p className='text-center text-xl font-bold '>0 rupees</p>
      <hr />
      <ul className="list-disc mx-5 my-5">
        <li>Free trial</li>
        <li>Can create maximum classrooms</li>
        <li>Online class not there</li>
        <li>Priority Search Results</li>
        <li>Chat available</li>
        <li>24/7 Customer Support</li>
      </ul>
      <a href='/classroom' className="w-full block text-center text-white font-semibold bg-indigo-950 rounded-md p-3 hover:bg-indigo-700" >Free trial</a>
      </div>
      <div className="w-1/4 box_shadow p-5  pt-16 my-12">
                <div className="grid place-content-center">
      {/* <Image src={`/${selectedPlan.image}`} width={100} height={100} alt="photo" className="rounded-full grid place-content-center my-6" /> */}
      </div>
      <p className='text-center text-2xl font-bold text-indigo-950'>6 months plans</p>
      
      <p className='text-center text-xl font-bold '>1000 rupees</p>
      <hr />
      <ul className="list-disc mx-5 my-5">
        <li>6 -Month Subscription Plan</li>
        <li>Unlimited Job Postings</li>
        <li>Wide Talent Pool</li>
        <li>Priority Search Results</li>
        <li>Easy Job Management</li>
        <li>24/7 Customer Support</li>
      </ul>
      <a
                  
                    onClick={displayRazorpay}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block text-center text-white font-semibold bg-indigo-950 rounded-md p-3 hover:bg-indigo-700 "
                >
                    Pay Now
                </a>
      </div>
      </div>
                
            </header>
        </div>
    );
}

export default App;
