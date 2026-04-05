import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';

const Cart = () => {
  const { cartItems, removeFromCart, addToCart } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/products`)
      .then(r => r.json())
      .then(all => {
        // Exclude items already in cart, shuffle, take up to 4
        const cartIds = cartItems.map(i => i.id);
        const pool = all.filter(p => !cartIds.includes(p._id));
        const shuffled = pool.sort(() => 0.5 - Math.random());
        setSuggestions(shuffled.slice(0, 4));
      })
      .catch(() => {});
  }, [cartItems]);

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <main className="pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter uppercase italic leading-none">Your Bag</h1>
          <p className="mt-4 text-secondary font-medium tracking-tight">Review your editorial selection ({cartItems.length} items)</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Cart Items List */}
          <section className="lg:col-span-8 space-y-6">
            {cartItems.length === 0 ? (
              <p className="text-secondary font-medium text-lg">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="bg-surface-container-lowest p-6 rounded-lg flex flex-col md:flex-row gap-8 items-center transition-transform hover:scale-[1.01]">
                  <div className="w-full md:w-40 h-48 rounded bg-surface-container-low overflow-hidden flex-shrink-0">
                    <img alt={item.name} className="w-full h-full object-cover" src={item.image}/>
                  </div>
                  <div className="flex-grow w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-headline font-bold tracking-tight uppercase">{item.name}</h3>
                        <p className="text-secondary text-sm font-medium uppercase tracking-widest mt-1">Obsidian Black / {item.size || 'M'}</p>
                      </div>
                      <p className="text-xl font-headline font-bold">₹{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center mt-12">
                      <div className="flex items-center bg-surface-container-low rounded-full px-4 py-1.5 gap-6">
                        <button className="material-symbols-outlined text-on-surface-variant hover:text-on-surface">remove</button>
                        <span className="font-headline font-bold">{item.quantity}</span>
                        <button className="material-symbols-outlined text-on-surface-variant hover:text-on-surface">add</button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-secondary hover:text-error transition-colors flex items-center gap-1 text-sm font-bold uppercase tracking-tighter"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Checkout Sidebar */}
          <aside className="lg:col-span-4 sticky top-28">
            <div className="bg-surface-container-low p-8 rounded-lg">
              <h2 className="text-xl font-headline font-black uppercase tracking-tighter mb-8 italic">Order Summary</h2>
              <div className="space-y-4 font-body">
                <div className="flex justify-between text-secondary">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-on-surface">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span className="font-medium">Shipping</span>
                  <span className="font-bold text-on-surface">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span className="font-medium">Tax</span>
                  <span className="font-bold text-on-surface">₹0.00</span>
                </div>
                <div className="pt-6 mt-6 border-t border-outline-variant/20 flex justify-between items-end">
                  <span className="font-headline font-black uppercase tracking-tighter text-lg italic">Total Est.</span>
                  <span className="text-4xl font-headline font-black tracking-tighter">₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/payment')} 
                disabled={cartItems.length === 0}
                className={`w-full mt-8 py-5 rounded-full font-bold tracking-widest uppercase transition-all shadow-xl ${
                  cartItems.length === 0
                    ? 'bg-surface-container-highest text-secondary cursor-not-allowed opacity-50'
                    : 'bg-primary-container text-on-primary-container hover:scale-[1.02] active:scale-95 shadow-primary-container/20'
                }`}
              >
                  {cartItems.length === 0 ? 'Add Items to Checkout' : 'Proceed to Checkout'}
              </button>
              <div className="flex gap-4 justify-center mt-6">
                  <span className="material-symbols-outlined text-secondary opacity-50">gpp_good</span>
                  <span className="material-symbols-outlined text-secondary opacity-50">local_shipping</span>
                  <span className="material-symbols-outlined text-secondary opacity-50">currency_exchange</span>
              </div>
            </div>
            
            <div className="bg-surface-container-low p-8 rounded-lg mt-4">
                <h4 className="font-bold text-sm tracking-widest uppercase mb-4 text-on-surface">Need Help?</h4>
                <div className="flex flex-col gap-2 font-['Inter'] text-sm">
                    <Link to="/" className="text-secondary hover:text-primary transition-colors">Shipping & Returns</Link>
                    <Link to="/" className="text-secondary hover:text-primary transition-colors">Contact Us</Link>
                </div>
            </div>
          </aside>
        </div>

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <section className="mt-24">
            <div className="flex items-center gap-6 mb-12">
              <h2 className="text-3xl font-headline font-black uppercase tracking-tighter italic">You Might Also Like</h2>
              <div className="h-1 flex-grow bg-primary-container/30"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {suggestions.map(p => (
                <div
                  key={p._id}
                  className="group relative bg-surface-container-lowest rounded-lg p-4 transition-all hover:translate-y-[-4px] cursor-pointer"
                  onClick={() => navigate(`/products/${p._id}`)}
                >
                  <div className="aspect-square rounded overflow-hidden mb-4 bg-surface-container-low">
                    {p.image ? (
                      <img
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        src={p.image}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-4xl">image_not_supported</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold tracking-tight text-sm leading-tight">{p.title}</h4>
                      <p className="text-secondary font-medium text-xs mt-1">₹{parseFloat(p.price).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); addToCart({ id: p._id, name: p.title, price: p.price, image: p.image, size: p.sizes?.[0] || 'M', quantity: 1 }); }}
                      className="material-symbols-outlined bg-primary-container p-2 rounded-full text-on-primary-container hover:scale-110 transition-transform flex-shrink-0"
                    >add</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-100 dark:bg-zinc-900 grid grid-cols-1 md:grid-cols-4 gap-8 px-12 py-16 w-full">
        <div className="col-span-1 md:col-span-1">
            <div className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4 italic">The Kinetic Editorial</div>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm font-['Inter']">Curating the pace of digital style. High contrast, high energy, zero boundaries.</p>
        </div>
        <div>
            <h4 className="font-headline font-extrabold uppercase text-xs tracking-widest mb-6">Service</h4>
            <ul className="space-y-4 font-['Inter'] text-sm tracking-normal">
                <li><a className="text-zinc-600 dark:text-zinc-400 hover:underline decoration-yellow-400 underline-offset-4" href="#">Shipping</a></li>
                <li><a className="text-zinc-600 dark:text-zinc-400 hover:underline decoration-yellow-400 underline-offset-4" href="#">Returns</a></li>
                <li><a className="text-zinc-600 dark:text-zinc-400 hover:underline decoration-yellow-400 underline-offset-4" href="#">Store Locator</a></li>
            </ul>
        </div>
        <div>
            <h4 className="font-headline font-extrabold uppercase text-xs tracking-widest mb-6">Manifesto</h4>
            <ul className="space-y-4 font-['Inter'] text-sm tracking-normal">
                <li><a className="text-zinc-600 dark:text-zinc-400 hover:underline decoration-yellow-400 underline-offset-4" href="#">Privacy Policy</a></li>
                <li><a className="text-zinc-600 dark:text-zinc-400 hover:underline decoration-yellow-400 underline-offset-4" href="#">Sustainability</a></li>
            </ul>
        </div>
        <div>
            <h4 className="font-headline font-extrabold uppercase text-xs tracking-widest mb-6">Newsletter</h4>
            <div className="flex border-b border-zinc-300 dark:border-zinc-700 pb-2">
                <input className="bg-transparent border-none p-0 text-xs font-headline font-bold focus:ring-0 w-full" placeholder="JOIN THE PULSE" type="email"/>
                <button className="material-symbols-outlined text-zinc-400">arrow_forward</button>
            </div>
            <div className="mt-12 text-[10px] text-zinc-500 font-['Inter'] uppercase tracking-widest">
                © 2024 The Kinetic Editorial. All Rights Reserved.
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
