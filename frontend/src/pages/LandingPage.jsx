import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';

const LandingPage = () => {
  const navigate = useNavigate();
  const { orders, isAuthenticated } = useContext(GlobalContext);
  const activeOrders = orders?.filter(o => o.status !== 'Delivered') || [];
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/products`)
      .then(res => res.json())
      .then(data => {
        // Grab the last 4 added items
        setLatestProducts(data.slice(-4).reverse());
      })
      .catch(console.error);
  }, []);

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <main className="pt-24">
        {/* Hero Section: Intentional Asymmetry */}
        <section className="relative min-h-[870px] flex items-center px-8 lg:px-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container opacity-5 -z-10"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            <div className="lg:col-span-5 z-10">
              <h1 className="text-6xl lg:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-6">
                  Bold<br/>
                  <span className="bg-primary-container px-4 text-on-primary-container">Wear</span>
              </h1>
              <p className="text-lg text-secondary max-w-md mb-8 font-body leading-relaxed">
                  Menzu lets you create T-shirts and hoodies that match your vibe. Express yourself with designs made just for you.
              </p>
              <div className="flex gap-4">
                  <button onClick={() => navigate('/products')} className="bg-primary-container text-on-primary-container px-12 py-6 rounded-full font-bold text-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary-container/20">
                      Shop Now
                  </button>
              </div>
            </div>
            <div className="lg:col-span-7 relative">
              <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img alt="Editorial Fashion" className="w-full h-full object-cover" src="/hero-image.jpg"/>
              </div>
              <div className="absolute -bottom-10 -left-10 bg-primary-container p-8 rounded-lg hidden lg:block shadow-xl">
                  <span className="block text-4xl font-black italic">NEW ERA</span>
                  <span className="block text-sm font-bold tracking-widest uppercase">Drop 001 / FW24</span>
              </div>
            </div>
          </div>
        </section>

        {/* Category Circles */}
        <section className="py-20 px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-3xl font-black tracking-tighter uppercase">Browse Categories</h2>
              <div className="w-1/2 h-px bg-outline-variant/30 ml-8 mb-4"></div>
            </div>
            <div className="flex gap-8 overflow-x-auto pb-8 no-scrollbar">
              <div className="flex-shrink-0 flex flex-col items-center group cursor-pointer" onClick={() => navigate('/products')}>
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 ring-2 ring-transparent group-hover:ring-primary-container transition-all duration-300">
                  <img alt="T-shirts" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgYMRYrjT5CIun4CNXzBnNYpzA-_tBKT83a6ChV9vE07ho6-cmgIhLWbQRd5hyZovvSkZr3zajOXwoVdLOafEKr0Mc58z4kLcxa_k2nb6KDOPoI-HJE05uUfOsFD3cn0ldlPetpkGZkANsIN2xz2ZzXL0MLMubIWQEChJCOGgmBbMGuIQicsquzn5pNKYShlkhUDAyk9YaEEKeLff6j3YY0Fu-ioH_5ZXfm8wx5Y0xOkPdWEjFwB7MWMfgawFo23Wr5rDckqL0UkY"/>
                </div>
                <span className="font-bold tracking-tight text-secondary group-hover:text-on-surface">T-shirts</span>
              </div>
              
              <div className="flex-shrink-0 flex flex-col items-center group cursor-pointer" onClick={() => navigate('/products')}>
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 ring-2 ring-transparent group-hover:ring-primary-container transition-all duration-300">
                  <img alt="Hoodies" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0EENBeYVIBpD8EL4JCodm5VOjotdrBwlq8dbW-cUCPyNcZThpzpUNmV1OV9td4YfBMPRkzlwVGgDSlOrvstAc61NIqC0SqSD563TriL2Ti52wymblvzc9avcD2qVbE-zg_Sd-gTUwUMLcJL61r4uCc1qkVTQRf5igW4zE1Ll0yI6ZRDGiTMqyrb-2lYftGmdpDOKqqn6qy4vi6FFtQ7nomMqNkSqI_7mpGyt-mLvLJ5PxdAzREk48RtffU1-M0mkPWiospZQW29E"/>
                </div>
                <span className="font-bold tracking-tight text-secondary group-hover:text-on-surface">Hoodies</span>
              </div>
            </div>
          </div>
        </section>

        {/* Active Order Tracking */}
        {isAuthenticated && activeOrders.length > 0 && (
          <section className="py-12 px-8 max-w-7xl mx-auto border-t border-outline-variant/10">
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-8">Active Shipments</h2>
            <div className="space-y-6">
              {activeOrders.map(order => {
                 const statusSteps = ['Ordered', 'Shipped', 'Out for Delivery', 'Delivered'];
                 const currentStepIndex = statusSteps.indexOf(order.status) === -1 ? 0 : statusSteps.indexOf(order.status);
                 
                 return (
                    <div key={order._id} className="bg-surface-container border border-outline-variant/30 rounded-lg p-8 shadow-sm">
                       <div className="flex justify-between items-center mb-8">
                         <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-secondary">Order ID</p>
                            <p className="font-mono text-sm">{order._id}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-secondary">Total</p>
                            <p className="font-black text-primary">₹{order.totalPrice?.toFixed(2)}</p>
                         </div>
                       </div>
                       
                       {/* Timeline visual */}
                       <div className="relative mt-4">
                         <div className="absolute top-4 left-4 w-[calc(100%-2rem)] h-1 bg-outline-variant/20 -translate-y-1/2 rounded-full hidden md:block"></div>
                         <div className="absolute top-4 left-4 h-1 bg-primary -translate-y-1/2 rounded-full hidden md:block transition-all duration-700" style={{ width: `calc(${(currentStepIndex / 3) * 100}% - 2rem)` }}></div>
                         
                         <div className="flex flex-col md:flex-row justify-between relative z-10 gap-6 md:gap-0">
                           {statusSteps.map((step, idx) => {
                             const isCompleted = idx <= currentStepIndex;
                             const isActive = idx === currentStepIndex;
                             
                             return (
                               <div key={step} className={`flex flex-col md:items-center ${isCompleted ? 'text-primary' : 'text-secondary/50'}`}>
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs mb-3 border-2 ring-[6px] ring-surface-container transition-colors ${isCompleted ? 'bg-primary text-on-primary border-primary' : 'bg-surface border-outline-variant'}`}>
                                    {isCompleted ? <span className="material-symbols-outlined text-[16px]">check</span> : idx + 1}
                                  </div>
                                  <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-on-surface' : ''}`}>{step}</span>
                               </div>
                             );
                           })}
                         </div>
                       </div>
                    </div>
                 );
              })}
            </div>
          </section>
        )}

        {/* New Arrivals: Bento Grid Layout */}
        <section className="py-12 md:py-24 px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm block mb-2">The Latest Drop</span>
              <h2 className="text-5xl font-black tracking-tighter uppercase">New Arrivals</h2>
            </div>
            <p className="text-secondary max-w-xs font-body italic">
                Limited run items designed for the kinetic lifestyle.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {latestProducts.map((prod) => (
              <div key={prod._id} className="flex flex-col group cursor-pointer" onClick={() => navigate('/products')}>
                <div className="aspect-[3/4] overflow-hidden rounded-lg mb-6 bg-surface-container-low relative">
                    <img alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={prod.image} />
                </div>
                <h3 className="text-xl font-bold tracking-tight">{prod.title}</h3>
                <p className="text-secondary mb-2">{prod.category} • {prod.description}</p>
                <span className="text-lg font-black">₹{prod.price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Menzu Pro Upgrade Block */}
        <section className="my-24 px-8">
          <div className="max-w-7xl mx-auto bg-on-background rounded-lg p-12 md:p-20 text-surface overflow-hidden relative">
            <div className="absolute top-0 right-0 opacity-20 transform translate-x-1/4 -translate-y-1/4">
                <span className="text-[20rem] font-black italic tracking-tighter leading-none select-none">PRO</span>
            </div>
            <div className="relative z-10 max-w-2xl">
              <span className="text-primary-container font-black uppercase tracking-widest text-xs mb-4 block">Menzu Membership</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 leading-tight">Go Pro.<br/>Get More.</h2>
              <p className="text-surface-variant text-lg mb-10 leading-relaxed">
                Upgrade to Menzu Pro and unlock an entirely elevated experience — built for people who take their wardrobe seriously.
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">local_shipping</span>
                  </div>
                  <div>
                    <h3 className="font-black text-surface uppercase tracking-tight text-base">Fast Delivery</h3>
                    <p className="text-surface-variant text-sm leading-relaxed mt-1">Priority shipping on every order. Your drops arrive first — no waiting.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">bolt</span>
                  </div>
                  <div>
                    <h3 className="font-black text-surface uppercase tracking-tight text-base">Early Access</h3>
                    <p className="text-surface-variant text-sm leading-relaxed mt-1">Be the first to shop new stock before anyone else. Exclusive pre-release windows, every time.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={() => window.location.href = '/payment'}
                    className="bg-primary-container text-on-primary-container px-12 py-5 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-primary-container/20 flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined">workspace_premium</span>
                    Upgrade to Pro
                  </button>
                  <button className="border border-surface/20 text-surface px-8 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-surface/10 transition-colors">
                    Learn More
                  </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-zinc-100 dark:bg-zinc-900 grid grid-cols-1 md:grid-cols-4 gap-8 px-12 py-16 w-full font-['Inter'] text-sm tracking-normal">
        <div className="flex flex-col gap-4">
          <div className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter">The Kinetic Editorial</div>
          <p className="text-zinc-600 dark:text-zinc-400">Curating the future of street luxury since 2024.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Quick Links</h4>
          <Link to="/" className="text-zinc-600 dark:text-zinc-400 hover:underline decoration-yellow-400 underline-offset-4">Shipping</Link>
          <Link to="/" className="text-zinc-600 dark:text-zinc-400 hover:underline decoration-yellow-400 underline-offset-4">Returns</Link>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Policy</h4>
          <Link to="/" className="text-zinc-600 dark:text-zinc-400 hover:underline decoration-yellow-400 underline-offset-4">Privacy Policy</Link>
          <Link to="/" className="text-zinc-600 dark:text-zinc-400 hover:underline decoration-yellow-400 underline-offset-4">Terms of Service</Link>
        </div>
        <div className="flex flex-col gap-6">
          <h4 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Contact</h4>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            General: hello@kinetic-ed.com<br/>
            Support: 1-800-KINETIC
          </p>
          <p className="text-xs text-zinc-500 mt-auto">© 2024 The Kinetic Editorial. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
