import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';

const Payment = () => {
  const { getCartTotal, cartItems, userProfile, addAddress, createOrder } = useContext(GlobalContext);
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isSuccess, setIsSuccess] = useState(false);

  // Address logic
  const addresses = userProfile?.addresses || [];
  const [addingAddress, setAddingAddress] = useState(addresses.length === 0);
  const [newAddr, setNewAddr] = useState({ name: '', address: '', city: '', zip: '', country: '' });

  const total = getCartTotal() || 0;
  const shipping = total > 0 ? 15.00 : 0;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'razorpay') {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      try {
        // Amount needs to be in smallest currency unit (paise/cents)
        const orderAmount = Math.round(grandTotal * 100);
        const result = await fetch("http://localhost:5001/api/payments/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: orderAmount })
        });

        if (!result.ok) throw new Error("Server Error creating Razorpay order");

        const orderData = await result.json();

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Menzu E-Commerce",
          description: "Order Checkout",
          order_id: orderData.id,
          handler: async function (response) {
              console.log("Payment Successful:", response);
              
              const chosenAddress = addresses.find(a => a._id === selectedAddress) || addresses[0] || {};
              const orderData = {
                  userId: userProfile._id,
                  orderItems: buyingItems.map(item => ({
                      name: item.name,
                      price: parseFloat(item.price),
                      quantity: item.quantity,
                      image: item.image || item.imageUrl,
                      size: item.size,
                      product: item.id
                  })),
                  shippingAddress: {
                      name: chosenAddress.name || userProfile.name,
                      address: chosenAddress.address || "",
                      city: chosenAddress.city || "",
                      zip: chosenAddress.zip || "",
                      country: chosenAddress.country || ""
                  },
                  paymentMethod: paymentMethod,
                  taxPrice: tax,
                  shippingPrice: shipping,
                  totalPrice: grandTotal,
                  isPaid: true
              };

              await createOrder(orderData);
              setIsSuccess(true);
          },
          prefill: {
              name: userProfile?.name || "",
              email: userProfile?.email || "",
              contact: "9999999999",
          },
          theme: {
              color: "#1a1a1a",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

      } catch (err) {
        console.error(err);
        alert("Failed to initialize Razorpay payment. Check backend logs.");
      }
    } else {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center p-8 selection:bg-primary-container selection:text-on-primary-container">
        <div className="bg-surface-container-low p-12 rounded-lg max-w-lg w-full text-center border-t-4 border-primary shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/20 blur-[80px] -mr-32 -mt-32"></div>
          <span className="material-symbols-outlined text-[80px] text-primary mb-6" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-4">Order Confirmed</h1>
          <p className="text-secondary leading-relaxed mb-8">
            Your kinetic pieces are being orchestrated. Order <strong className="text-on-surface">#KN-0914X</strong> has been placed and a receipt is sent to your email.
          </p>
          <button onClick={() => navigate('/')} className="bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm hover:scale-105 active:scale-95 transition-transform w-full">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Filter only items actually selected to buy
  const buyingItems = cartItems.filter(i => i.selected);

  return (
    <div className="bg-surface text-on-surface min-h-screen selection:bg-primary-container selection:text-on-primary-container">
      <main className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-12 border-b border-outline-variant/20 pb-6">Secure Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Column: Accordion Flow */}
          <div className="lg:w-2/3 space-y-8 w-full">
            
            {/* Step 1: Delivery Address */}
            <div className={`border border-outline-variant/20 rounded-lg overflow-hidden transition-all duration-300 ${activeStep === 1 ? 'shadow-xl shadow-surface-container-high/50' : 'opacity-60'}`}>
              <div className={`p-6 flex justify-between items-center ${activeStep === 1 ? 'bg-surface-container-high' : 'bg-surface-container-low'}`}>
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-on-surface text-surface font-black text-sm">1</span>
                  <h2 className="text-xl font-bold uppercase tracking-tight">Delivery Address</h2>
                </div>
                {activeStep > 1 && (
                  <button onClick={() => setActiveStep(1)} className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">Change</button>
                )}
              </div>
              
              {activeStep === 1 && (
                <div className="p-8 bg-surface-container-lowest">
                  {addingAddress || addresses.length === 0 ? (
                    <form className="space-y-4" onSubmit={async (e) => {
                      e.preventDefault();
                      await addAddress(newAddr);
                      setAddingAddress(false);
                      setNewAddr({ name: '', address: '', city: '', zip: '', country: '' });
                    }}>
                      <h3 className="font-bold uppercase tracking-widest text-sm mb-4">Add a New Delivery Address</h3>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Full Name</label>
                        <input required type="text" value={newAddr.name} onChange={e => setNewAddr({...newAddr, name: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Address</label>
                        <input required type="text" value={newAddr.address} onChange={e => setNewAddr({...newAddr, address: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">City</label>
                           <input required type="text" value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                           <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">ZIP Code</label>
                           <input required type="text" value={newAddr.zip} onChange={e => setNewAddr({...newAddr, zip: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Country</label>
                        <input required type="text" value={newAddr.country} onChange={e => setNewAddr({...newAddr, country: e.target.value})} className="w-full bg-surface-container border border-outline-variant/30 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                      <div className="flex items-center gap-4 mt-8 pt-4">
                        <button type="submit" className="bg-on-surface text-surface px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all">Save Address</button>
                        {addresses.length > 0 && (
                          <button type="button" onClick={() => setAddingAddress(false)} className="text-secondary hover:text-on-surface font-bold uppercase tracking-widest text-xs transition-colors">Cancel</button>
                        )}
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {addresses.map((addr) => (
                          <label key={addr._id} className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAddress === addr._id ? 'border-primary bg-primary-container/10' : 'border-outline-variant/30 hover:border-outline-variant'}`}>
                            <div className="flex items-center h-5 mt-1">
                              <input 
                                type="radio" 
                                name="address" 
                                className="w-4 h-4 text-primary bg-surface border-outline focus:ring-primary focus:ring-2"
                                checked={selectedAddress === addr._id}
                                onChange={() => setSelectedAddress(addr._id)}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-bold mb-1">{addr.name}</div>
                              <div className="text-sm text-secondary leading-relaxed">
                                {addr.address}<br/>
                                {addr.city}, {addr.zip}<br/>
                                {addr.country}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-8">
                        <button 
                          disabled={!selectedAddress}
                          onClick={() => setActiveStep(2)} 
                          className="bg-on-surface text-surface px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Use this Address
                        </button>
                        <button 
                          onClick={() => setAddingAddress(true)}
                          className="text-primary hover:text-on-surface font-bold uppercase tracking-widest text-xs transition-colors"
                        >
                          + Add New Address
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className={`border border-outline-variant/20 rounded-lg overflow-hidden transition-all duration-300 ${activeStep === 2 ? 'shadow-xl shadow-surface-container-high/50' : 'opacity-60'}`}>
              <div className={`p-6 flex justify-between items-center ${activeStep === 2 ? 'bg-surface-container-high' : 'bg-surface-container-low'}`}>
                <div className="flex items-center gap-4">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full font-black text-sm ${activeStep >= 2 ? 'bg-on-surface text-surface' : 'bg-outline-variant text-surface'}`}>2</span>
                  <h2 className="text-xl font-bold uppercase tracking-tight">Payment Method</h2>
                </div>
                {activeStep > 2 && (
                   <button onClick={() => setActiveStep(2)} className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">Change</button>
                )}
              </div>

              {activeStep === 2 && (
                <div className="p-8 bg-surface-container-lowest">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <button onClick={() => setPaymentMethod('card')} className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg font-bold text-sm transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary-container/10 text-primary' : 'border-outline-variant/30 text-secondary hover:border-outline-variant'}`}>
                      <span className="material-symbols-outlined mb-1 text-2xl">credit_card</span>
                      Credit Card
                    </button>
                    <button onClick={() => setPaymentMethod('upi')} className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg font-bold text-sm transition-colors ${paymentMethod === 'upi' ? 'border-primary bg-primary-container/10 text-primary' : 'border-outline-variant/30 text-secondary hover:border-outline-variant'}`}>
                      <span className="material-symbols-outlined mb-1 text-2xl">qr_code_scanner</span>
                      UPI / Wallet
                    </button>
                    <button onClick={() => setPaymentMethod('razorpay')} className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg font-bold text-sm transition-colors ${paymentMethod === 'razorpay' ? 'border-primary bg-primary-container/10 text-primary' : 'border-outline-variant/30 text-secondary hover:border-outline-variant'}`}>
                      <span className="material-symbols-outlined mb-1 text-2xl">account_balance_wallet</span>
                      Razorpay
                    </button>
                  </div>

                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setActiveStep(3); }}>
                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Card Number</label>
                          <input required type="text" placeholder="0000 0000 0000 0000" className="w-full bg-surface-container border border-outline-variant/30 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Expiry</label>
                            <input required type="text" placeholder="MM/YY" className="w-full bg-surface-container border border-outline-variant/30 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">CVV</label>
                            <input required type="password" placeholder="***" className="w-full bg-surface-container border border-outline-variant/30 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Name on Card</label>
                          <input required type="text" placeholder="JULIAN VOSS" className="w-full bg-surface-container border border-outline-variant/30 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'upi' && (
                       <div>
                         <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">UPI ID</label>
                         <input required type="text" placeholder="username@upi" className="w-full bg-surface-container border border-outline-variant/30 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                       </div>
                    )}

                    {paymentMethod === 'razorpay' && (
                       <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-8 text-center space-y-4">
                         <p className="text-secondary text-sm font-medium">Pay securely using Cards, UPI, or NetBanking.</p>
                         <div className="flex justify-center items-center gap-6 text-secondary/40 py-4">
                             <span className="material-symbols-outlined text-[40px]">credit_card</span>
                             <span className="material-symbols-outlined text-[40px]">qr_code_scanner</span>
                             <span className="material-symbols-outlined text-[40px]">account_balance</span>
                         </div>
                         <div className="bg-primary/5 text-primary px-4 py-2 rounded-full inline-block text-xs font-bold uppercase tracking-widest border border-primary/20">
                           <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">verified</span> Razorpay Ready</span>
                         </div>
                       </div>
                    )}
                    
                    <button type="submit" className="mt-8 bg-on-surface text-surface px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all">
                      Review Order
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Step 3: Review Items */}
            <div className={`border border-outline-variant/20 rounded-lg overflow-hidden transition-all duration-300 ${activeStep === 3 ? 'shadow-xl shadow-surface-container-high/50' : 'opacity-60'}`}>
              <div className={`p-6 flex justify-between items-center ${activeStep === 3 ? 'bg-surface-container-high' : 'bg-surface-container-low'}`}>
                <div className="flex items-center gap-4">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full font-black text-sm ${activeStep >= 3 ? 'bg-on-surface text-surface' : 'bg-outline-variant text-surface'}`}>3</span>
                  <h2 className="text-xl font-bold uppercase tracking-tight">Review Items</h2>
                </div>
              </div>
              
              {activeStep === 3 && (
                <div className="p-8 bg-surface-container-lowest space-y-6">
                  {buyingItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 pb-6 border-b border-outline-variant/20 last:border-0 last:pb-0">
                       <img src={item.imageUrl || item.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuBs1bhSwgP7TfOmS-Kzn2nprvFLZZd8WUsf6-h4NkSwHxWEwyVxM4s-JDkfaWOEEFOP-zMch_g8aMjnP6kKA-n47482PyqhUzBecdqnRPdkf3WzLl6RvrAd-0O-BhQnrpnLDVR7saEJW61vtk-LJr_9pZMP-nWbYf89jkAYwmYpRe1y9Ei-FB9CO3nEjTcqQ70Rsix8vSVaha-3NxFlLQpCrLJih3BBOS3gAsJzJg68pJVJ92mPXRbdzfM_Wd-c4HafYlEsD6T0l7U"} alt="Product" className="w-16 h-20 object-cover rounded bg-surface-container" />
                       <div className="flex-1">
                          <h4 className="font-bold">{item.name}</h4>
                          <p className="text-xs text-secondary mb-1">Qty: {item.quantity}</p>
                          <p className="font-black">₹{parseFloat(item.price).toFixed(2)}</p>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary Sidebar */}
          <aside className="lg:w-1/3 w-full sticky top-28">
            <div className="bg-surface-container p-8 rounded-lg border border-outline-variant/10 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 blur-[50px] -mr-16 -mt-16"></div>
              
              <h3 className="text-2xl font-black italic tracking-tighter uppercase border-b border-outline-variant/20 pb-4 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-secondary">
                  <span>Items ({buyingItems.reduce((a,b) => a+(b.quantity||1), 0)}):</span>
                  <span className="font-bold text-on-surface">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Shipping & handling:</span>
                  <span className="font-bold text-on-surface">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Estimated Tax:</span>
                  <span className="font-bold text-on-surface">₹{tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-outline-variant/20 pt-6 mb-8">
                <div className="flex justify-between items-center text-xl text-primary">
                  <span className="font-bold uppercase tracking-widest text-xs">Total</span>
                  <span className="font-black italic tracking-tighter">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handlePlaceOrder}>
                <button 
                  type="submit"
                  disabled={activeStep !== 3}
                  className={`w-full py-5 rounded-full font-bold tracking-widest uppercase transition-all flex justify-center items-center gap-2 ${activeStep === 3 ? 'bg-primary-container text-on-primary-container hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary-container/20' : 'bg-surface-container-high text-secondary cursor-not-allowed opacity-50'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Place Your Order
                </button>
              </form>
              
              <p className="text-[10px] text-center uppercase tracking-widest text-secondary mt-6 font-bold leading-relaxed">
                By placing your order, you agree to Menzu's <br/>Privacy Notice and Conditions of Use.
              </p>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default Payment;
