import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';

const ProductList = ({ category }) => {
  const { addToCart } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState(2500);

  const [appliedSizes, setAppliedSizes] = useState([]);
  const [appliedColors, setAppliedColors] = useState([]);
  const [appliedPriceRange, setAppliedPriceRange] = useState(2500);

  const toggleSelection = (arr, item) => arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];

  const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
  const ALL_COLORS = [
    { label: 'black', hex: 'bg-zinc-900 text-white' },
    { label: 'grey', hex: 'bg-zinc-400' },
    { label: 'white', hex: 'bg-white border border-outline-variant' },
    { label: 'navy', hex: 'bg-blue-900' },
    { label: 'olive', hex: 'bg-lime-900' },
    { label: 'yellow', hex: 'bg-yellow-400' },
    { label: 'red', hex: 'bg-red-600' }
  ];

  const filteredProducts = products.filter(p => {
    let matchSize = true;
    let matchColor = true;
    let matchPrice = true;

    if (appliedSizes.length > 0) {
      matchSize = p.sizes && p.sizes.some(s => appliedSizes.includes(s));
    }
    if (appliedColors.length > 0) {
      matchColor = p.colors && p.colors.some(c => appliedColors.includes(c));
    }
    if (appliedPriceRange < 2500 && p.price > appliedPriceRange) {
      matchPrice = false;
    }
    
    return matchSize && matchColor && matchPrice;
  });

  const applyFilters = () => {
    setAppliedSizes(selectedSizes);
    setAppliedColors(selectedColors);
    setAppliedPriceRange(priceRange);
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange(2500);
    setAppliedSizes([]);
    setAppliedColors([]);
    setAppliedPriceRange(2500);
  };

  useEffect(() => {
    const url = category
      ? `http://localhost:5001/api/products?category=${category}`
      : 'http://localhost:5001/api/products';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [category]);

  const handleAddToCart = (product) => {
    // If size isn't passed, default to M
    addToCart({ ...product, size: product.size || 'M', quantity: 1, selected: true });
  };

  return (
    <div className="bg-surface text-on-surface antialiased pt-28 pb-16 px-8 min-h-screen">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-10">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-6">Filter By Size</h3>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map(sz => (
                <button 
                  key={sz}
                  onClick={() => setSelectedSizes(toggleSelection(selectedSizes, sz))}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${selectedSizes.includes(sz) ? 'bg-primary-fixed text-on-primary-fixed font-bold' : 'border border-outline-variant/15 font-medium hover:bg-primary-fixed'}`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-6">Colors</h3>
            <div className="flex flex-wrap gap-3 w-4/5">
              {ALL_COLORS.map(c => (
                <button 
                  key={c.label}
                  onClick={() => setSelectedColors(toggleSelection(selectedColors, c.label))}
                  className={`w-8 h-8 rounded-full ${c.hex} ${selectedColors.includes(c.label) ? 'ring-2 ring-offset-2 ring-primary-container' : 'ring-1 ring-outline/20 hover:scale-110'}`} 
                  title={c.label}
                ></button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-6">Max Price Constraint</h3>
            <div className="space-y-4">
              <input 
                className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container" 
                type="range"
                min="500"
                max="2500"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
              <div className="flex justify-between text-sm font-medium text-on-surface">
                <span>₹500</span>
                <span>₹{priceRange === 2500 ? '2500+' : priceRange}</span>
              </div>
            </div>
          </div>
          <div className="pt-6 flex gap-4">
            <button 
              onClick={applyFilters}
              className="w-1/2 py-4 rounded-full bg-primary-container text-on-primary-container font-black text-sm tracking-tight hover:scale-[1.02] active:scale-95 transition-transform shadow-lg shadow-primary-container/20"
            >
              Apply Filter
            </button>
            <button 
              onClick={clearFilters}
              className="w-1/2 py-4 rounded-full bg-surface-container-highest font-bold text-sm tracking-tight hover:scale-[1.02] active:scale-95 transition-transform"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-1">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary font-bold tracking-tighter uppercase text-sm mb-2 block">Curated Selection</span>
              <h1 className="text-5xl font-black tracking-tighter leading-none">
                {category === 'tshirt' ? 'T-SHIRTS' : category === 'hoodie' ? 'HOODIES' : 'NEW ARRIVALS'}
                <span className="text-primary-container">.</span>
              </h1>
            </div>
            <div className="hidden md:block">
              <p className="text-secondary text-sm font-medium">Showing {filteredProducts.length} Items</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {loading ? (
              <div className="col-span-full py-12 text-center text-secondary font-bold tracking-widest uppercase">Loading curations...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-secondary font-bold tracking-widest uppercase flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-4xl">inventory_2</span>
                No products match the selected filters.
              </div>
            ) : (
              filteredProducts.map(product => (
                <div key={product._id} className="group relative cursor-pointer" onClick={() => navigate(`/products/${product._id}`)}>
                  <div className="aspect-[4/5] rounded-DEFAULT overflow-hidden bg-surface-container-low mb-6 relative">
                    <img 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      src={product.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuC0nEpmIrI11ThrtCzFurp0NEiqwS-fw8mGk-D5sET4le_v06fmZlVWa5pSWOQ-sjb5S76VYaG4BWJxac5TGbyVD1tKVjX_KnwnvNgG4CiGkHVbNBqj6RxaY7VUUEK6vY_dSkBWOiE-OoGgwTAtIBV5JGnv4Fno27WKsKEcyIl2PNZAsRaxnZ-FJuxIKDCRq2PnGCSLZJV9OhQS-5KsQnwzgIKrZPyxqzzHK1qx5Obo2HP2uMm04txPx5StgFsk1eK60aL9dpc8A4I"}
                    />
                    
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      {product.sizes && product.sizes.length > 0 ? (
                        product.sizes.map(sz => (
                          <button 
                            key={sz}
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleAddToCart({ 
                                _id: product._id, 
                                title: product.title, 
                                price: product.price, 
                                image: product.image,
                                size: sz
                              }); 
                            }}
                            className="bg-primary-container text-on-primary-container w-10 h-10 rounded-full font-bold text-sm hover:scale-110 active:scale-95 shadow-xl transition-transform"
                          >
                            {sz}
                          </button>
                        ))
                      ) : (
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleAddToCart({ 
                              _id: product._id, 
                              title: product.title, 
                              price: product.price, 
                              image: product.image
                            }); 
                          }}
                          className="bg-primary-container text-on-primary-container px-6 py-3 rounded-full font-bold text-sm shadow-xl"
                        >
                          Quick Add
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-start px-2">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight mb-1">{product.title}</h2>
                      <div className="flex items-center gap-1 mb-2 text-primary-container">
                        ★★★★<span className="text-secondary">★</span>
                      </div>
                    </div>
                    <span className="text-lg font-black tracking-tighter">₹{parseFloat(product.price).toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More */}
          <div className="mt-24 text-center">
            <button className="px-12 py-5 rounded-full border-2 border-on-surface font-black text-sm tracking-tighter uppercase hover:bg-on-surface hover:text-surface transition-all">
              Load More Styles
            </button>
          </div>
        </section>
      </div>

    </div>
  );
};

export default ProductList;
