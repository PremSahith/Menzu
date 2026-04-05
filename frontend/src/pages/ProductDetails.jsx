import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setActiveImage(data.image || null);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);

        // Fetch related products from same category, exclude current
        if (data.category) {
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/products?category=${data.category}`)
            .then(r => r.json())
            .then(all => setRelatedProducts(all.filter(p => p._id !== data._id).slice(0, 4)))
            .catch(() => {});
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product._id,
      name: product.title,
      price: product.price,
      image: product.image,
      size: selectedSize || 'M',
      quantity: 1,
      selected: true
    });
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center">
        <p className="text-secondary font-bold tracking-widest uppercase animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center flex-col gap-4">
        <span className="material-symbols-outlined text-5xl text-secondary">error</span>
        <p className="text-secondary font-bold tracking-widest uppercase">Product not found.</p>
        <button onClick={() => navigate('/products')} className="mt-4 px-8 py-3 rounded-full bg-primary-container text-on-primary-container font-bold">
          Back to Collection
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface antialiased">
      <main className="pt-24 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column: Main image + gallery thumbnails */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
            {/* Thumbnail sidebar — only shows if gallery has images */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[600px]">
                {/* Main image thumbnail */}
                {product.image && (
                  <button
                    onClick={() => setActiveImage(product.image)}
                    className={`w-20 h-24 md:w-24 md:h-32 flex-shrink-0 rounded-lg overflow-hidden transition-all ${activeImage === product.image ? 'ring-2 ring-primary-container' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <img alt="Main" className="w-full h-full object-cover" src={product.image} />
                  </button>
                )}
                {/* Gallery thumbnails */}
                {product.gallery.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-24 md:w-24 md:h-32 flex-shrink-0 rounded-lg overflow-hidden transition-all ${activeImage === img ? 'ring-2 ring-primary-container' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <img alt={`View ${i + 1}`} className="w-full h-full object-cover" src={img} />
                  </button>
                ))}
              </div>
            )}

            {/* Main displayed image */}
            <div className="relative flex-1 group">
              <div className="aspect-[4/5] w-full rounded-lg overflow-hidden bg-surface-container-low relative">
                {activeImage ? (
                  <img
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={activeImage}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center flex-col gap-3 text-secondary">
                    <span className="material-symbols-outlined text-6xl">image_not_supported</span>
                    <p className="text-sm font-medium uppercase tracking-widest">No Image Available</p>
                  </div>
                )}
                <span className="absolute top-6 left-6 bg-primary-container text-on-primary-container font-bold text-xs px-3 py-1.5 rounded-full tracking-widest uppercase">
                  {product.category || 'Menzu'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <nav className="flex items-center gap-2 mb-6 text-secondary text-xs uppercase tracking-widest font-medium">
              <Link to="/products" className="hover:text-on-surface transition-colors">Collection</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span>{product.category || 'Item'}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold tracking-tighter text-on-surface mb-2 leading-[0.9] uppercase">
              {product.title}
            </h1>
            <div className="flex items-baseline gap-4 mt-6 mb-10">
              <span className="text-3xl font-headline font-bold text-on-surface">₹{parseFloat(product.price).toFixed(2)}</span>
            </div>

            {/* Product Configurator */}
            <div className="space-y-10">
              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface">
                    Available Colors: <span className="text-secondary font-medium">{product.colors.join(', ')}</span>
                  </span>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface">
                      Select Size: <span className="text-secondary font-medium">{selectedSize}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(sz => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-5 py-3 rounded-full text-sm font-bold transition-all ${
                          selectedSize === sz
                            ? 'bg-on-surface text-surface'
                            : 'border border-outline-variant/30 hover:bg-surface-container-low'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleAddToCart}
                  className="group flex items-center justify-between bg-primary-container text-on-primary-container px-8 py-5 rounded-full font-headline font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <span>ADD TO CART</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <button
                  onClick={() => { handleAddToCart(); navigate('/payment'); }}
                  className="flex items-center justify-center gap-2 bg-surface-container-high text-on-surface px-8 py-5 rounded-full font-headline font-bold text-sm hover:bg-surface-container-highest transition-colors"
                >
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

        {/* Description Block */}
        {product.description && (
          <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32">
            <div className="space-y-6">
              <h2 className="text-2xl font-headline font-extrabold tracking-tight">ABOUT THIS PIECE</h2>
              <p className="text-on-surface-variant leading-relaxed font-body">{product.description}</p>
            </div>
            <div className="bg-primary-container p-10 rounded-lg relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-on-primary-container text-2xl font-headline font-extrabold tracking-tight mb-8">STYLE TIPS</h2>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <span className="text-3xl font-black text-on-primary-container/20">01</span>
                    <div className="space-y-1">
                      <h4 className="font-bold text-on-primary-container text-sm uppercase">The Layered Core</h4>
                      <p className="text-on-primary-container/80 text-sm">Wear with relaxed trousers for an effortless editorial silhouette.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-3xl font-black text-on-primary-container/20">02</span>
                    <div className="space-y-1">
                      <h4 className="font-bold text-on-primary-container text-sm uppercase">Monochrome Shift</h4>
                      <p className="text-on-primary-container/80 text-sm">Go tonal with matching pieces for a high-impact, minimal look.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary rotate-45 opacity-10 rounded-xl group-hover:scale-110 transition-transform duration-700"></div>
            </div>
          </div>
        )}

        {/* More Like This */}
        {relatedProducts.length > 0 && (
          <section className="mt-32">
            <div className="flex items-center gap-6 mb-12">
              <h3 className="text-3xl font-headline font-extrabold tracking-tighter uppercase">
                More {product.category === 'hoodie' ? 'Hoodies' : 'T-Shirts'} You'll Love
              </h3>
              <div className="h-1 flex-grow bg-primary-container/30"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <div
                  key={p._id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/products/${p._id}`)}
                >
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface-container-low mb-4 relative">
                    {p.image ? (
                      <img
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        src={p.image}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-4xl">image_not_supported</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start px-1">
                    <div>
                      <h4 className="font-bold tracking-tight text-sm leading-tight">{p.title}</h4>
                      <p className="text-secondary text-xs mt-1 uppercase tracking-widest">{p.category}</p>
                    </div>
                    <span className="font-black text-sm">₹{parseFloat(p.price).toFixed(0)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
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
