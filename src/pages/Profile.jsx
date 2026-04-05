import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';

const Profile = () => {
  const { logout, userProfile, addAddress, removeAddress } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ name: '', address: '', city: '', zip: '', country: '' });

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (newAddr.name && newAddr.address) {
      addAddress(newAddr);
      setIsAddingAddress(false);
      setNewAddr({ name: '', address: '', city: '', zip: '', country: '' });
    }
  };

  const getTabClass = (tabName) => {
    return activeTab === tabName 
      ? "flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded-full font-bold transition-all duration-300 w-full text-left"
      : "flex items-center gap-3 px-4 py-3 text-secondary hover:bg-surface-container-low rounded-full transition-all duration-300 group w-full text-left";
  };

  const userName = userProfile?.name || 'Menzu Guest';

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <main className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 flex-grow w-full">
        {/* Preferences Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-28 flex flex-col gap-8">
            <div className="space-y-2">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-outline mb-6">Preferences</h3>
              <nav className="flex flex-col gap-1">
                <button onClick={() => setActiveTab('overview')} className={getTabClass('overview')}>
                  <span className="material-symbols-outlined text-sm">account_circle</span>
                  Overview 
                </button>
                <button onClick={() => setActiveTab('orders')} className={getTabClass('orders')}>
                  <span className="material-symbols-outlined text-sm">inventory_2</span>
                  Orders
                </button>
                <button onClick={() => setActiveTab('payment')} className={getTabClass('payment')}>
                  <span className="material-symbols-outlined text-sm">credit_card</span>
                  Payment Methods
                </button>

              </nav>
            </div>
            <div className="pt-8 border-t border-outline-variant/15">
              <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 px-4 py-3 text-error w-full font-bold hover:bg-error-container/20 rounded-full transition-all duration-300">
                <span className="material-symbols-outlined text-sm">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-12">
          
          {/* User Profile Header (Visible on Overview and Orders) */}
          {(activeTab === 'overview' || activeTab === 'orders') && (
            <header className="relative overflow-hidden bg-on-surface text-white p-12 rounded-lg flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 blur-[100px] -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-[10px] font-black uppercase tracking-widest">
                  <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  Elite Member
                </div>
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none mb-4 uppercase truncate max-w-lg">{userName}</h1>
                <p className="text-surface-container-highest/60 font-medium tracking-wide">Member since Nov 2024 • Verified Identity</p>
              </div>
              <div className="relative z-10 text-right hidden sm:block">
                <div className="text-xs uppercase tracking-[0.2em] text-surface-container-highest/60 mb-1">Loyalty Points</div>
                <div className="text-5xl font-black text-primary-container">1,450</div>
              </div>
            </header>
          )}

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Addresses Grid */}
              <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black italic tracking-tight uppercase">Saved Addresses</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProfile?.addresses?.map((addr, idx) => (
                    <div key={addr._id} className="bg-surface-container-lowest p-6 rounded-DEFAULT border border-outline-variant/10 group relative hover:border-primary-container transition-colors">
                      {idx === 0 && (
                        <div className="absolute top-4 right-4 px-2 py-0.5 bg-primary-container text-on-primary-container rounded text-[9px] font-black uppercase tracking-widest">Default</div>
                      )}
                      <h4 className="font-black uppercase tracking-tighter mb-4">{addr.name}</h4>
                      <p className="text-sm text-secondary leading-relaxed">
                        {addr.address}<br/>
                        {addr.city}, {addr.zip}<br/>
                        {addr.country}
                      </p>
                      <div className="mt-6 flex gap-4">
                        <button onClick={() => removeAddress(addr._id)} className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-error transition-colors">Remove</button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Address Modal Trigger */}
                  {!isAddingAddress ? (
                    <button onClick={() => setIsAddingAddress(true)} className="border-2 border-dashed border-outline-variant/30 rounded-DEFAULT flex flex-col items-center justify-center gap-2 p-6 hover:border-primary-container hover:bg-primary-container/5 transition-all group min-h-[200px]">
                      <span className="material-symbols-outlined text-outline-variant group-hover:text-primary-container transition-colors">add_location_alt</span>
                      <span className="text-xs font-black uppercase tracking-widest text-secondary group-hover:text-on-surface transition-colors">Add New Address</span>
                    </button>
                  ) : (
                    <div className="bg-surface-container-low p-6 rounded-DEFAULT border border-outline-variant/20 col-span-1 md:col-span-2 lg:col-span-3">
                      <h4 className="font-black uppercase tracking-tighter mb-4 text-primary">New Location</h4>
                      <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required type="text" placeholder="Full Name" value={newAddr.name} onChange={e => setNewAddr({...newAddr, name: e.target.value})} className="bg-surface border border-outline-variant/30 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                        <input required type="text" placeholder="Street Address" value={newAddr.address} onChange={e => setNewAddr({...newAddr, address: e.target.value})} className="bg-surface border border-outline-variant/30 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                        <input required type="text" placeholder="City" value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} className="bg-surface border border-outline-variant/30 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                        <div className="grid grid-cols-2 gap-4">
                          <input required type="text" placeholder="ZIP Code" value={newAddr.zip} onChange={e => setNewAddr({...newAddr, zip: e.target.value})} className="bg-surface border border-outline-variant/30 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                          <input required type="text" placeholder="Country" value={newAddr.country} onChange={e => setNewAddr({...newAddr, country: e.target.value})} className="bg-surface border border-outline-variant/30 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div className="md:col-span-2 flex gap-4 mt-2">
                          <button type="submit" className="bg-on-surface text-surface px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-container transition-colors">Save Address</button>
                          <button type="button" onClick={() => setIsAddingAddress(false)} className="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-secondary hover:text-error transition-colors">Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="space-y-6">
                <h2 className="text-2xl font-black italic tracking-tight uppercase">Active Orders</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shipped Order Placeholder */}
                  <div className="bg-surface-container-lowest p-6 rounded-DEFAULT border border-outline-variant/10 group transition-transform duration-300 hover:scale-[1.01]">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <img alt="Jacket" className="w-16 h-20 object-cover rounded shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBs1bhSwgP7TfOmS-Kzn2nprvFLZZd8WUsf6-h4NkSwHxWEwyVxM4s-JDkfaWOEEFOP-zMch_g8aMjnP6kKA-n47482PyqhUzBecdqnRPdkf3WzLl6RvrAd-0O-BhQnrpnLDVR7saEJW61vtk-LJr_9pZMP-nWbYf89jkAYwmYpRe1y9Ei-FB9CO3nEjTcqQ70Rsix8vSVaha-3NxFlLQpCrLJih3BBOS3gAsJzJg68pJVJ92mPXRbdzfM_Wd-c4HafYlEsD6T0l7U"/>
                        <div>
                          <div className="text-xs text-secondary uppercase tracking-widest font-bold mb-1">Order #KN-9021</div>
                          <div className="font-black text-lg">K-Series Parka</div>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">Shipped</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-secondary">
                        <span>Processing</span>
                        <span className="text-on-surface">Transit</span>
                        <span>Delivery</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-primary-container w-2/3"></div>
                      </div>
                      <p className="text-xs text-secondary">Estimated Arrival: <span className="text-on-surface font-bold">Tomorrow, 14:00</span></p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black italic tracking-tight uppercase">Order History</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant/15 text-[10px] uppercase tracking-[0.2em] font-black text-secondary">
                        <th className="py-4 px-2">Date</th>
                        <th className="py-4 px-2">Total</th>
                        <th className="py-4 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      <tr className="group hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-6 px-2 text-sm font-medium">Oct 12, 2023</td>
                        <td className="py-6 px-2 font-black">$442.00</td>
                        <td className="py-6 px-2 text-secondary text-sm">Delivered</td>
                      </tr>
                      <tr className="group hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-6 px-2 text-sm font-medium">Sep 05, 2023</td>
                        <td className="py-6 px-2 font-black">$189.00</td>
                        <td className="py-6 px-2 text-secondary text-sm">Delivered</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* TAB: PAYMENT METHODS */}
          {activeTab === 'payment' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <section className="space-y-6">
                 <h2 className="text-2xl font-black italic tracking-tight uppercase">Payment Methods</h2>
                 <div className="bg-surface-container-low p-12 rounded-lg text-center border-dashed border-2 border-outline-variant/30 flex flex-col items-center">
                   <span className="material-symbols-outlined text-4xl text-secondary mb-4">credit_card_off</span>
                   <p className="text-secondary mb-6 max-w-sm">You haven't saved any payment methods yet. Save a card during your next checkout for faster purchases.</p>
                   <button onClick={() => navigate('/products')} className="bg-on-surface text-surface px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-primary-container hover:text-on-primary-container transition-colors">Shop Now</button>
                 </div>
               </section>
             </div>
          )}



        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 mt-auto bg-stone-100 dark:bg-stone-900 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-lg font-black text-stone-900 dark:text-stone-50 tracking-tighter uppercase italic">KINETIC</span>
          <p className="font-inter text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500">© 2024 KINETIC EDITORIAL</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <Link className="font-inter text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 hover:text-yellow-400 transition-colors" to="/">Privacy</Link>
          <Link className="font-inter text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 hover:text-yellow-400 transition-colors" to="/">Terms</Link>
          <Link className="font-inter text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 hover:text-yellow-400 transition-colors" to="/">Shipping</Link>
          <Link className="font-inter text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 hover:text-yellow-400 transition-colors" to="/">Sustainability</Link>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
