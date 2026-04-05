import React, { createContext, useState, useEffect } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({
    _id: '',
    name: '',
    email: '',
    addresses: []
  });

  // Global Auth Modal State
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Shopping Cart
  const [cartItems, setCartItems] = useState([]);

  // Boot check for JWT token and saved user info
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      setIsAuthenticated(true);
      setUserProfile((prev) => ({
        ...prev,
        _id: userInfo._id,
        name: userInfo.name,
        email: userInfo.email,
        token: userInfo.token,
        addresses: userInfo.addresses || []
      }));
    }
  }, []);

  // Fetch active MongoDB Cart on mount or after login
  useEffect(() => {
    if (isAuthenticated && userProfile._id) {
      fetch(`http://localhost:5001/api/cart/${userProfile._id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.items) {
            const mapped = data.items.map(item => ({
              id: item.productId?._id,
              name: item.productId?.title,
              price: item.productId?.price,
              image: item.productId?.image,
              quantity: item.quantity,
              selected: true
            })).filter(item => item.id); // Filter out invalid populated refs
            setCartItems(mapped);
          } else {
             setCartItems([]);
          }
        })
        .catch(console.error);
    } else {
       // if not authenticated, clear cart
       setCartItems([]);
    }
  }, [isAuthenticated, userProfile._id]);

  // Methods
  const registerUser = async (name, email, password) => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration Failed");
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      setIsAuthenticated(true);
      setUserProfile((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login Failed");

      localStorage.setItem('userInfo', JSON.stringify(data));
      setIsAuthenticated(true);
      setUserProfile((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const googleLoginUser = async (credential) => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google Login Failed");

      localStorage.setItem('userInfo', JSON.stringify(data));
      setIsAuthenticated(true);
      setUserProfile((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    setUserProfile({ _id: '', name: '', email: '', addresses: [] });
    // Reset local UI cart state on logout
    setCartItems([]);
  };

  const addToCart = async (product) => {
    if (!isAuthenticated || !userProfile._id) {
       setShowLoginModal(true); // Automatically open the login modal
       return;
    }

    // 1. Optimistic local UI State transition
    setCartItems((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, selected: true }];
    });

    // 2. Persist synchronously to MongoDB via Express
    try {
      await fetch('http://localhost:5001/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userProfile._id, productId: product.id })
      });
    } catch (error) {
      console.error("Cart API Error: Failed to add to database.", error);
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter(item => item.id !== id));
    // optionally: sync delete to backend
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return { ...item, quantity: newQ > 0 ? newQ : 1 };
      }
      return item;
    }));
    // optionally: sync quantity to backend
  };

  const toggleSelection = (id) => {
    setCartItems((prev) => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const getCartTotal = () => {
    return cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const addAddress = async (address) => {
    if (!isAuthenticated || !userProfile._id) return;
    try {
      const res = await fetch(`http://localhost:5001/api/users/${userProfile._id}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address)
      });
      if (res.ok) {
        const updatedAddresses = await res.json();
        setUserProfile(prev => {
           const newProfile = { ...prev, addresses: updatedAddresses };
           localStorage.setItem('userInfo', JSON.stringify({ ...JSON.parse(localStorage.getItem('userInfo')), addresses: updatedAddresses }));
           return newProfile;
        });
      }
    } catch (error) {
      console.error("Failed to save address", error);
    }
  };

  const updateAddress = (id, address) => {
    setUserProfile(prev => ({
      ...prev,
      addresses: prev.addresses.map(a => a._id === id ? { ...a, ...address } : a)
    }));
  };

  const removeAddress = async (id) => {
    if (!isAuthenticated || !userProfile._id) return;
    try {
      const res = await fetch(`http://localhost:5001/api/users/${userProfile._id}/addresses/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const updatedAddresses = await res.json();
        setUserProfile(prev => {
           const newProfile = { ...prev, addresses: updatedAddresses };
           localStorage.setItem('userInfo', JSON.stringify({ ...JSON.parse(localStorage.getItem('userInfo')), addresses: updatedAddresses }));
           return newProfile;
        });
      }
    } catch (error) {
      console.error("Failed to delete address", error);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        isAuthenticated,
        userProfile,
        cartItems,
        loginUser,
        registerUser,
        googleLoginUser,
        logout,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSelection,
        getCartTotal,
        getCartItemCount,
        addAddress,
        updateAddress,
        removeAddress,
        showLoginModal,
        setShowLoginModal
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
