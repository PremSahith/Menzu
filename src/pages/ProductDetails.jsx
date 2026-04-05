import React, { useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart({ 
      id: id || '1', 
      name: 'KINETIC STRUCTURE SHIRT', 
      price: 185.00, 
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvX_UziIa8T7rvlD2tUO_E3tCjeNrGgVvRMd3zksRqpOGYtQMguUQqF8H5jqouqViAs8hlxtE2lz1SMo9mJO55yP5XdleDAmOa6rQB-CuhtHrVjjb0pn_TrxuQ0Y1fdSriYPvCByDgMxwH7uCYN1_s5gVIYslCuxYnPf7duKrJAkvnPseAE0L8y5vHh9x06rM7ivbk5c2aC2ZiqG4T3kmcng9UgDOATFJHS0oCwMx7HQXfRBvxLMH1QPCRpiGr0H4ZK8fvZUVUg3s',
      size: 'M',
      quantity: 1,
      selected: true
    });
    navigate('/cart');
  };

  return (
    <div className="bg-surface text-on-surface antialiased">
      <main className="pt-24 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
        {/* Product Section: Intentional Asymmetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-visible">
              <div className="w-20 h-24 md:w-24 md:h-32 flex-shrink-0 rounded-DEFAULT bg-surface-container-low overflow-hidden cursor-pointer hover:ring-2 ring-primary-container transition-all">
                  <img alt="Thumbnail 1" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaz29FpaKcZlcWZsQpBHcTJMjvlCiFZYUlEkmNNSqVgHiukRbqpiVpt-698arcxAfTRsaX_GonywiptWrh7n4vqXnStnK7SZRdSpQeFCrJxQVGLEtqm2FzrfGdqolaEGxwxmEbCUnxYak4XLMCDmUTWiK1JNm4l5Tvmz-ApnnVO0xyVDejs7Hw7yCGgJ85aewXJVqbiCQFRl7FNLAAcE1h1IyXMv6ZsyJy3HnQP9Z-lBjsCNKsrqRhOzs5uG1K3Qv4acfgbx7ZBIs"/>
              </div>
              <div className="w-20 h-24 md:w-24 md:h-32 flex-shrink-0 rounded-DEFAULT bg-surface-container-low overflow-hidden cursor-pointer">
                  <img alt="Thumbnail 2" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2AjZCTstbEojVhouyqn8B3oWQeIbeJU9h_9WvqobsxlNzNJN5SpR6M6rF-Q4-_LEThG-0hsH05d1wkSrGimu2JDBXjf6vNjfxYC6AQbw-NS8tPR-ydaBRPELWOIaROHlJbx4DV3XMTqKw_Sw7mbOoWwEGzS8F0GL01-iJfrFbmjkhjV4AsUBBG46zFGqCEId_cLcXth6t3RJVWqIbIw-BvGwPwf426JzhJjUOgiyu7s-Z6yRojl91VVvv8CWCCk-1m8SFiDnk8B0"/>
              </div>
              <div className="w-20 h-24 md:w-24 md:h-32 flex-shrink-0 rounded-DEFAULT bg-surface-container-low overflow-hidden cursor-pointer">
                  <img alt="Thumbnail 3" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3pW1uOC1n72aTvLcEscBYNbpEr1zygrpG_g7W1B2exmq6xKOT7n2nXhpDv7b5ZyNZZF5sCCcXio1Eg3lQzuIRM6qNPmxcWWEv-lPSisdjKnn1iHEU5NYn654IdvE9EV2rslIpeO73UMb3CBV5YBQF5NiFk8MphJPFpddDTg1_0ogAvgAvmBLsD9ItQbxjmh_YIi6huXmLcrAQkVkQ46qGWOO7z7wMRV8WKJO1oUsR2E-CO6tG4A3OkZqwkIWM4hEpBU4x3yypw6I"/>
              </div>
              <div className="w-20 h-24 md:w-24 md:h-32 flex-shrink-0 rounded-DEFAULT bg-surface-container-low overflow-hidden cursor-pointer">
                  <img alt="Thumbnail 4" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9hnQoZy2uIUeEXYAuhfN8w8zU78iWhAYQXTB14yIH2_MVPkmlFz_VP3cWH_q_P9y1GokjN1wtJ1aFWDwHS8e_80_a_uDCnhJjOWl21IA-EArQb0cKBDQoaqZS-MbcjNj8i7_8M4JL1bCt1aE6Xld8IZNpTpr_1WMc8zzB6774zr9mgIwU-a5R-1UNx-btEOBTTWdDvpOK7uJoYIbm-NmXon_xy7lSaCi72g0ZoXtYz3YkAyuo5hipuL2asKIInKbaSAU-EKjNhvE"/>
              </div>
            </div>
            {/* Main Image */}
            <div className="relative flex-1 group">
              <div className="aspect-[4/5] w-full rounded-lg overflow-hidden bg-surface-container-low relative">
                  <img alt="Main Product" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvX_UziIa8T7rvlD2tUO_E3tCjeNrGgVvRMd3zksRqpOGYtQMguUQqF8H5jqouqViAs8hlxtE2lz1SMo9mJO55yP5XdleDAmOa6rQB-CuhtHrVjjb0pn_TrxuQ0Y1fdSriYPvCByDgMxwH7uCYN1_s5gVIYslCuxYnPf7duKrJAkvnPseAE0L8y5vHh9x06rM7ivbk5c2aC2ZiqG4T3kmcng9UgDOATFJHS0oCwMx7HQXfRBvxLMH1QPCRpiGr0H4ZK8fvZUVUg3s"/>
                  <span className="absolute top-6 left-6 bg-primary-container text-on-primary-container font-headline font-bold text-xs px-3 py-1.5 rounded-full tracking-widest uppercase">New Editorial Pick</span>
              </div>
            </div>
          </div>
          
          {/* Right Column: Details */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <nav className="flex items-center gap-2 mb-6 text-secondary text-xs uppercase tracking-widest font-medium">
              <Link to="/products" className="hover:text-on-surface transition-colors">Topwear</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <Link to="/products" className="hover:text-on-surface transition-colors">Shirts</Link>
            </nav>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold tracking-tighter text-on-surface mb-2 leading-[0.9]">
                KINETIC<br/>STRUCTURE<br/>SHIRT
            </h1>
            <div className="flex items-baseline gap-4 mt-6 mb-10">
              <span className="text-3xl font-headline font-bold text-on-surface">$185.00</span>
              <span className="text-secondary line-through text-lg font-medium">$220.00</span>
            </div>
            
            {/* Product Configurator */}
            <div className="space-y-10">
              {/* Color Swatches */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface">Color: <span className="text-secondary font-medium">Oatmeal Bone</span></span>
                </div>
                <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full border-2 border-primary-container p-0.5 transition-transform hover:scale-110">
                        <div className="w-full h-full rounded-full bg-[#E5E2DB]"></div>
                    </button>
                    <button className="w-10 h-10 rounded-full border-2 border-transparent p-0.5 transition-transform hover:scale-110">
                        <div className="w-full h-full rounded-full bg-[#1B1C1C]"></div>
                    </button>
                    <button className="w-10 h-10 rounded-full border-2 border-transparent p-0.5 transition-transform hover:scale-110">
                        <div className="w-full h-full rounded-full bg-[#4A5D4E]"></div>
                    </button>
                </div>
              </div>
              {/* Size Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface">Select Size</span>
                    <button className="text-xs underline underline-offset-4 text-secondary hover:text-on-surface transition-colors">Size Guide</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    <button className="py-3 rounded-full border border-outline-variant/30 text-sm font-bold hover:bg-surface-container-low transition-colors">S</button>
                    <button className="py-3 rounded-full bg-on-surface text-surface text-sm font-bold">M</button>
                    <button className="py-3 rounded-full border border-outline-variant/30 text-sm font-bold hover:bg-surface-container-low transition-colors">L</button>
                    <button className="py-3 rounded-full border border-outline-variant/30 text-sm font-bold hover:bg-surface-container-low transition-colors">XL</button>
                </div>
              </div>
              {/* Actions */}
              <div className="flex flex-col gap-4">
                <button onClick={handleAddToCart} className="group flex items-center justify-between bg-primary-container text-on-primary-container px-8 py-5 rounded-full font-headline font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all">
                    <span>ADD TO CART</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <button onClick={() => { handleAddToCart(); navigate('/payment'); }} className="flex items-center justify-center gap-2 bg-surface-container-high text-on-surface px-8 py-5 rounded-full font-headline font-bold text-sm hover:bg-surface-container-highest transition-colors">
                    <span className="material-symbols-outlined text-lg">shopping_bag</span>
                    BUY NOW
                </button>
              </div>
            </div>
            {/* Trust Badges */}
            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-outline-variant/15 pt-8">
              <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">local_shipping</span>
                  <span className="text-xs font-medium text-secondary">Express Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">eco</span>
                  <span className="text-xs font-medium text-secondary">Organic Cotton</span>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Info Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32">
          {/* Description */}
          <div className="space-y-6">
            <h2 className="text-2xl font-headline font-extrabold tracking-tight">THE PHILOSOPHY</h2>
            <div className="space-y-4 text-on-surface-variant leading-relaxed font-body">
                <p>Designed for the kinetic city dweller, this shirt breaks the boundaries between formal tailoring and streetwear utility. The heavy-weight 320gsm organic cotton twill provides a architectural silhouette that holds its shape through movement.</p>
                <p>Featuring reinforced internal seams, hidden placket buttons, and our signature "Editorial Drop" hem. This is not just a shirt; it's a structural layer for the modern wardrobe.</p>
            </div>
            <div className="pt-4 flex flex-wrap gap-2">
                <span className="px-4 py-1.5 rounded-full bg-surface-container-low text-on-surface text-[10px] font-bold uppercase tracking-widest">320gsm Twill</span>
                <span className="px-4 py-1.5 rounded-full bg-surface-container-low text-on-surface text-[10px] font-bold uppercase tracking-widest">Oversized Fit</span>
                <span className="px-4 py-1.5 rounded-full bg-surface-container-low text-on-surface text-[10px] font-bold uppercase tracking-widest">Zero-Bleach Dye</span>
            </div>
          </div>
          {/* Style Tips */}
          <div className="bg-primary-container p-10 rounded-lg relative overflow-hidden group">
            <div className="relative z-10">
                <h2 className="text-on-primary-container text-2xl font-headline font-extrabold tracking-tight mb-8">STYLE TIPS</h2>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                      <span className="text-3xl font-black text-on-primary-container/20">01</span>
                      <div className="space-y-1">
                          <h4 className="font-bold text-on-primary-container text-sm uppercase">The Layered Core</h4>
                          <p className="text-on-primary-container/80 text-sm">Wear open over a white ribbed tank and relaxed grey wool trousers for an effortless editorial silhouette.</p>
                      </div>
                  </li>
                  <li className="flex gap-4">
                      <span className="text-3xl font-black text-on-primary-container/20">02</span>
                      <div className="space-y-1">
                          <h4 className="font-bold text-on-primary-container text-sm uppercase">Monochrome Shift</h4>
                          <p className="text-on-primary-container/80 text-sm">Pair with our Bone Tailored Shorts and chunky loafers for a tonal, high-summer power look.</p>
                      </div>
                  </li>
                </ul>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary rotate-45 opacity-10 rounded-xl group-hover:scale-110 transition-transform duration-700"></div>
          </div>
        </div>

        {/* Trend Slider */}
        <section className="mt-32">
          <div className="flex justify-between items-end mb-12">
            <h3 className="text-3xl font-headline font-extrabold tracking-tighter">COMPLETE THE LOOK</h3>
            <div className="flex gap-2">
                <button className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-on-surface hover:text-surface transition-all">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <button className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-on-surface hover:text-surface transition-all">
                    <span className="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
            {/* Card 1 */}
            <div className="min-w-[70%] md:min-w-[40%] snap-start group cursor-pointer" onClick={() => navigate('/products/10')}>
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface-container-low mb-6 relative">
                  <img alt="Bottomwear" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1vO2KnImkmADnPNfHFEz1pWW35dijRCuDOgp0DYzEPlSpjOfHDlADdQhTVDG0Fj34ewsrflcbc_McaYwC8yKxnqU-TJUlo-Sof8hUtqqt0I1GivGTjZlUG8TbE0SYR6iBXDpV4V4WsllIZoCQt1niy20ByaoLesKN65KSiXPfjek2iAUIWlBuqYfWOchn9Vo5PI4M-xIAMCN9LC2V_R_ei5ZRQcH5Em-otEcvOW4SoYteSU39UqGlqzuDPS7Re1Z4yKx3pfpo1fI"/>
              </div>
              <div className="flex justify-between items-start">
                  <div>
                      <h4 className="font-headline font-bold text-lg">CHARCOAL STRUCTURE PANT</h4>
                      <p className="text-secondary text-sm">BOTTOMWEAR</p>
                  </div>
                  <span className="font-bold">$245</span>
              </div>
            </div>
            {/* Card 2 */}
            <div className="min-w-[60%] md:min-w-[30%] snap-start group cursor-pointer" onClick={() => navigate('/products/11')}>
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface-container-low mb-6 relative">
                  <img alt="Tank" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaLWW-0LjtDhmE-1XJjAgWfk8ez7-nwCdfU8HZqHwZmVz6xMD2wi2q1tARRsdVPAGr5sPad8h_Vj0E46BC122tchF7StJXhYQuym4bGFDl0bp_5EJntoats3iiSkVYzzL2LRGmnqLV1Khqecm0UqjlOvqA4Y956whKiXqY_1PQ8DZETT7e77Hp1dt2zOrn7HFhQdlYsao0Wr_MVnZtHTzvRIU6vSI8_n6vcJ9GH44DYNxKxtB2oSRpPVYcCfCkmGGaWrcRg0ylRYM"/>
              </div>
              <div className="flex justify-between items-start">
                  <div>
                      <h4 className="font-headline font-bold text-lg">ESSENTIAL RIB TANK</h4>
                      <p className="text-secondary text-sm">BASICS</p>
                  </div>
                  <span className="font-bold">$45</span>
              </div>
            </div>
            {/* Card 3 */}
            <div className="min-w-[70%] md:min-w-[40%] snap-start group cursor-pointer" onClick={() => navigate('/products/12')}>
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface-container-low mb-6 relative">
                  <img alt="Footwear" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8aO4VuomabyvrPsAMCAQ3lHWAbpsy7AfOR6e9HP-oDHyMEanOgGrAB2vYLDEDgVSk-3AkWMoOqseAOqmJ0m3trROiSssr4sEM1GBK9s9eUWSlNlgMIYTS2enoJuBPs9BUjli-F0pKxQcAWTls_5Bj0usE-zmReARITtC6VL878HsqaDXtrNpSyB6HzWe-aNSA3J7qY5QvmI97wy4HaFHwD1-zpgi0CXSrpzAjntJOnxzM3wVJX-L1ofHsSfNHF_48AsqX64eooMQ"/>
              </div>
              <div className="flex justify-between items-start">
                  <div>
                      <h4 className="font-headline font-bold text-lg">KINETIC CHUNKY LOAFER</h4>
                      <p className="text-secondary text-sm">FOOTWEAR</p>
                  </div>
                  <span className="font-bold">$310</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-zinc-100 dark:bg-zinc-900 w-full rounded-t-none mt-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-12 py-16 w-full">
            <div className="space-y-4">
                <div className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic">The Kinetic Editorial</div>
                <p className="font-['Inter'] text-sm tracking-normal text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xs">
                    Redefining the digital shopping experience through editorial movement and architectural precision.
                </p>
            </div>
            <div className="space-y-4">
                <h5 className="text-zinc-900 dark:text-white font-bold text-xs uppercase tracking-widest">Collection</h5>
                <ul className="space-y-2">
                    <li><a className="text-zinc-600 dark:text-zinc-400 font-['Inter'] text-sm hover:underline decoration-yellow-400 underline-offset-4" href="#">New Arrivals</a></li>
                    <li><a className="text-zinc-600 dark:text-zinc-400 font-['Inter'] text-sm hover:underline decoration-yellow-400 underline-offset-4" href="#">Topwear</a></li>
                    <li><a className="text-zinc-600 dark:text-zinc-400 font-['Inter'] text-sm hover:underline decoration-yellow-400 underline-offset-4" href="#">Bottomwear</a></li>
                    <li><a className="text-zinc-600 dark:text-zinc-400 font-['Inter'] text-sm hover:underline decoration-yellow-400 underline-offset-4" href="#">Accessories</a></li>
                </ul>
            </div>
            <div className="space-y-4">
                <h5 className="text-zinc-900 dark:text-white font-bold text-xs uppercase tracking-widest">Support</h5>
                <ul className="space-y-4 font-['Inter'] text-sm tracking-normal">
                    <li><Link className="text-zinc-600 dark:text-zinc-400 hover:underline decoration-yellow-400 underline-offset-4" to="/">Shipping</Link></li>
                    <li><Link className="text-zinc-600 dark:text-zinc-400 hover:underline decoration-yellow-400 underline-offset-4" to="/">Returns</Link></li>
                    <li><Link className="text-zinc-600 dark:text-zinc-400 hover:underline decoration-yellow-400 underline-offset-4" to="/">Store Locator</Link></li>
                </ul>
            </div>
            <div className="space-y-4">
                <h4 className="font-headline font-extrabold uppercase text-xs tracking-widest mb-6">Manifesto</h4>
                <ul className="space-y-4 font-['Inter'] text-sm tracking-normal">
                    <li><Link className="text-zinc-600 dark:text-zinc-400 hover:underline decoration-yellow-400 underline-offset-4" to="/">Privacy Policy</Link></li>
                    <li><Link className="text-zinc-600 dark:text-zinc-400 hover:underline decoration-yellow-400 underline-offset-4" to="/">Sustainability</Link></li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 font-['Inter'] text-sm">Join the editorial circle for early access.</p>
                <div className="flex">
                    <input className="bg-surface border-none rounded-l-full px-4 py-2 text-sm w-full focus:ring-1 ring-primary-container" placeholder="Email Address" type="email"/>
                    <button className="bg-primary-container text-on-primary-container rounded-r-full px-4 py-2 hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
        <div className="px-12 py-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-['Inter'] text-sm tracking-normal text-zinc-600 dark:text-zinc-400">© 2024 The Kinetic Editorial. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetails;
