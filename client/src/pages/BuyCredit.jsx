import React, { useContext } from 'react';
import { assets, plans } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const BuyCredit = () => {
  const { backendUrl, loadCreditsData } = useContext(AppContext);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();

  const initPay = async (order, receipt) => {
    if (!order?.amount || typeof order.amount !== 'number') {
      toast.error("Invalid payment amount");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Credits Payment',
      description: 'Purchase credits using Razorpay',
      order_id: order.id,
      handler: async (response) => {
        try {
          const token = await getToken();
          const { data } = await axios.post(
            `${backendUrl}/api/user/verify-razor`,
            {
              razorpay_order_id: response.razorpay_order_id,
              clerkID: user?.id,
              receipt, // ✅ Pass to backend so it can match Transaction
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (data.success) {
            await loadCreditsData();
            navigate('/');
            toast.success("Credits added successfully!");
          } else {
            toast.error(data.message || "Payment verification failed");
          }
        } catch (error) {
          console.error("Verification error:", error);
          toast.error(error.message || "Verification failed");
        }
      },
      prefill: {
        name: user?.fullName || "Guest",
        email: user?.primaryEmailAddress?.emailAddress || "user@example.com",
      },
      theme: {
        color: "#333",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const paymentRazorpay = async (planId) => {
    try {
      const token = await getToken();
      const clerkID = user?.id;

      if (!clerkID) {
        toast.error("User ID missing");
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/pay-razor`,
        { planId, clerkID },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        initPay(data.order, data.order.receipt); // ✅ Pass receipt forward
      } else {
        toast.error("Payment initialization failed");
      }
    } catch (error) {
      console.error("❌ Payment error:", error);
      toast.error(error.response?.data?.error || "Payment request failed");
    }
  };

  return (
    <div className="min-h-screen text-center pt-14 mb-10">
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">
        Our Plans
      </button>
      <h1 className="text-3xl font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent mb-10">
        Choose the plan that's right for you
      </h1>
      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item, index) => (
          <div key={index} className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-700 hover:scale-105 transition-all duration-700">
            <img width={40} height={40} src={assets.logo_icon} alt="Logo" />
            <p className="font-semibold mt-3">{item.id}</p>
            <p className="text-sm">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">${item.price}</span> / {item.credits}
            </p>
            <button
              onClick={() => paymentRazorpay(item.id)}
              className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5"
            >
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyCredit;
