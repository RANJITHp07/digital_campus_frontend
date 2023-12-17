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
            name:"6months subscription",
            description:"6 months plan in digital ocean",
            subscription_id:data.data.id,
            callback_url:data.data.short_url
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
    }

    return (
        <div className="App">
            <header className="App-header">
                {/* <img src={logo} className="App-logo" alt="logo" /> */}
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    onClick={displayRazorpay}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Donate $5
                </a>
            </header>
        </div>
    );
}

export default App;
