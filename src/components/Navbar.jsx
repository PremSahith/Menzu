import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Navbar = () => {
  const { isAuthenticated, getCartItemCount, loginUser, registerUser, googleLoginUser, showLoginModal, setShowLoginModal } = useContext(GlobalContext);
  const navigate = useNavigate();
  const cartCount = getCartItemCount();

  const [isLoginMode, setIsLoginMode] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      setShowLoginModal(true);
      setErrorMsg('');
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isLoginMode) {
        await loginUser(email, password);
      } else {
        await registerUser(name, email, password);
      }
      setShowLoginModal(false);
    } catch (error) {
      setErrorMsg(error.message || "Failed to authenticate");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setErrorMsg('');
    try {
      await googleLoginUser(credentialResponse.credential);
      setShowLoginModal(false);
    } catch (error) {
      setErrorMsg(error.message || "Google Sign-In failed");
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-zinc-950/80 backdrop-blur-xl flex justify-between items-center px-8 py-4 max-w-full">
        <Link to="/" className="text-4xl font-black italic tracking-tighter text-zinc-900 dark:text-zinc-50">
          Menzu
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          <Link to="/products" className="text-lg font-['Plus_Jakarta_Sans'] tracking-tighter uppercase font-bold text-zinc-900 dark:text-white border-b-2 border-yellow-400 pb-1 hover:scale-105 transition-transform duration-200">
            Collection
          </Link>
          <Link to="/tshirts" className="text-lg font-['Plus_Jakarta_Sans'] tracking-tighter uppercase font-bold text-zinc-900 dark:text-white hover:border-b-2 hover:border-yellow-400 pb-1 hover:scale-105 transition-all duration-200">
            T-Shirts
          </Link>
          <Link to="/hoodies" className="text-lg font-['Plus_Jakarta_Sans'] tracking-tighter uppercase font-bold text-zinc-900 dark:text-white hover:border-b-2 hover:border-yellow-400 pb-1 hover:scale-105 transition-all duration-200">
            Hoodies
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/cart')} className="relative hover:scale-105 transition-transform duration-200 active:scale-95">
            <span className="material-symbols-outlined text-3xl text-on-surface">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-on-primary text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <button onClick={handleAuthClick} className="hover:scale-105 transition-transform duration-200 active:scale-95">
            <span className="material-symbols-outlined text-3xl text-on-surface">
              {isAuthenticated ? 'person' : 'login'}
            </span>
          </button>
        </div>
      </nav>

      {/* Advanced Auth Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface w-full max-w-md rounded-2xl shadow-2xl p-10 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 material-symbols-outlined text-secondary hover:text-on-surface"
            >
              close
            </button>
            <h2 className="text-3xl font-black italic tracking-tighter mb-2 text-center uppercase">
              {isLoginMode ? 'Welcome Back' : 'Join Menzu'}
            </h2>
            <p className="text-secondary text-sm text-center mb-6">
              {isLoginMode ? 'Log in to access your account.' : 'Create an account for exclusive drops.'}
            </p>

            {errorMsg && (
              <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm font-medium text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {!isLoginMode && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-container text-on-primary-container py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl mt-4"
              >
                {isLoginMode ? 'Log In' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 border-t border-outline-variant/30 pt-6">
              <div className="flex justify-center mb-4">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setErrorMsg("Google Sign-In was unsuccessful. Try again.")}
                />
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => { setIsLoginMode(!isLoginMode); setErrorMsg(''); }}
                className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-on-surface"
              >
                {isLoginMode ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
              </button>
            </div>
          </div>
        </div>
      )}
    </GoogleOAuthProvider>
  );
};

export default Navbar;
