import React, { useState, useEffect } from 'react';
import { ShoppingCart, Facebook, Instagram, X, Upload } from 'lucide-react';


const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;


export default function AmarMomoWebsite() {
  const [isLoading, setIsLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [orderType, setOrderType] = useState(null); // 'with-payment' or 'without-payment'
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vegPlates: 0,
    vegHalfPlates: 0,
    chickenPlates: 0,
    chickenHalfPlates: 0
  });

  // Calculate totals with half plate pricing
  const vegPrice = 40;
  const chickenPrice = 60;
  const halfPlateMultiplier = 0.5;
  
  const totalVegAmount = (formData.vegPlates * vegPrice) + (formData.vegHalfPlates * vegPrice * halfPlateMultiplier);
  const totalChickenAmount = (formData.chickenPlates * chickenPrice) + (formData.chickenHalfPlates * chickenPrice * halfPlateMultiplier);
  const totalAmount = totalVegAmount + totalChickenAmount;
  const totalItems = formData.vegPlates + formData.vegHalfPlates + formData.chickenPlates + formData.chickenHalfPlates;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshot(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const sendEmailNotification = async () => {
    try {
      if (!window.emailjs) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
        
        window.emailjs.init(EMAILJS_PUBLIC_KEY);
      }

      const paymentStatus = orderType === 'with-payment' 
        ? 'Paid (Screenshot uploaded)' 
        : 'Cash on pickup';
      
      const templateParams = {
        to_email: 'amarmomozzzz@gmail.com',
        customer_name: formData.name,
        customer_phone: formData.phone,
        veg_plates: formData.vegPlates,
        veg_half_plates: formData.vegHalfPlates,
        chicken_plates: formData.chickenPlates,
        chicken_half_plates: formData.chickenHalfPlates,
        total_amount: totalAmount,
        payment_status: paymentStatus,
        order_date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        pickup_time: '4PM - 9PM',
        pickup_location: 'Balarampur, Near SBI, Purulia - 723143'
      };

      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );
      
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  };

 const handleFinalSubmit = async () => {
  if (!formData.name || !formData.phone || totalItems === 0) {
    alert('Please fill all required fields (Name & Phone) and order at least 1 plate!');
    return;
  }

  if (orderType === 'with-payment' && !paymentScreenshot) {
    alert('Please upload payment screenshot for verification!');
    return;
  }

  // Generate order number
  const orderNum = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  setOrderNumber(orderNum);

  // Send email notification
  const emailSent = await sendEmailNotification();

  // Show confirmation modal
  setShowConfirmation(true);
};

  const handleClose = () => {
    setShowOrderForm(false);
    setOrderType(null);
    setPaymentScreenshot(null);
  };

  const handleOrderTypeSelect = (type) => {
    setOrderType(type);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactData.name && contactData.phone && contactData.message) {
      alert(`Message Sent!\n\nName: ${contactData.name}\nEmail: ${contactData.email || 'Not provided'}\nPhone: ${contactData.phone}\n\nMessage: ${contactData.message}\n\nWe will get back to you soon!`);
      setContactData({ name: '', email: '', phone: '', message: '' });
      setShowContactForm(false);
    } else {
      alert('Please fill in all required fields (Name, Phone, and Message)!');
    }
  };

  const handleContactClose = () => {
    setShowContactForm(false);
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-orange-600 via-red-500 to-orange-600 flex items-center justify-center z-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-loading-float"></div>
          <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-xl animate-loading-float animation-delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-36 h-36 bg-white/10 rounded-full blur-xl animate-loading-float animation-delay-2000"></div>
        </div>

        <div className="text-center relative z-10">
          {/* Floating Momo Dumplings */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
              <div className="text-6xl">🥟</div>
            </div>
            <div className="absolute bottom-0 left-0 animate-bounce-slow animation-delay-300">
              <div className="text-4xl opacity-70">🥟</div>
            </div>
            <div className="absolute bottom-0 right-0 animate-bounce-slow animation-delay-600">
              <div className="text-4xl opacity-70">🥟</div>
            </div>
          </div>

          {/* Brand Name */}
          <div className="mb-4 animate-loading-text">
            <h2 className="text-5xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight">
              <span className="inline-block animate-loading-letter">A</span>
              <span className="inline-block animate-loading-letter animation-delay-100">m</span>
              <span className="inline-block animate-loading-letter animation-delay-200">a</span>
              <span className="inline-block animate-loading-letter animation-delay-300">r</span>
              <span className="inline-block ml-4 animate-loading-letter animation-delay-400">M</span>
              <span className="inline-block animate-loading-letter animation-delay-500">o</span>
              <span className="inline-block animate-loading-letter animation-delay-600">m</span>
              <span className="inline-block animate-loading-letter animation-delay-700">o</span>
            </h2>
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center space-x-2 mb-6">
            <div className="w-3 h-3 bg-white rounded-full animate-loading-dot"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-loading-dot animation-delay-200"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-loading-dot animation-delay-400"></div>
          </div>

          <p className="text-white/90 text-lg font-medium animate-pulse">Preparing your delicious experience...</p>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div className="h-full bg-white animate-loading-progress"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 overflow-x-hidden font-sans">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/amar-momo-logo.png" 
              alt="Amar Momo Logo" 
              className="h-12 sm:h-16 md:h-20 w-auto object-contain"
              onError={() => setLogoError(true)}
              style={{ display: logoError ? 'none' : 'block' }}
            />
            <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Amar Momo
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <button className="text-gray-700 font-medium hover:text-orange-600 transition-colors">HOME</button>
            <button 
              onClick={() => setShowContactForm(true)}
              className="text-gray-700 font-medium hover:text-orange-600 transition-colors"
            >
              CONTACT
            </button>
            <button 
              onClick={() => setShowOrderForm(true)} 
              className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 font-semibold"
            >
              ORDER NOW
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowOrderForm(true)}
              className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </button>
            <div className="md:hidden flex items-center space-x-2">
              <button 
                onClick={() => setShowContactForm(true)}
                className="px-3 py-2 text-gray-700 hover:text-orange-600 transition font-medium text-sm"
              >
                Contact
              </button>
              <button 
                onClick={() => setShowOrderForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white text-sm rounded-lg hover:shadow-md transition font-semibold"
              >
                Order
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="text-center md:text-left space-y-6 animate-fade-in-up">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
                <span className="block text-gray-900">Delicious</span>
                <span className="block bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent animate-gradient">
                  Momos
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 font-medium">Made with Love & Fresh Ingredients</p>
              <div className="flex flex-col space-y-3 justify-center md:justify-start">
                <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-700">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm sm:text-base">Balarampur, Near SBI, Purulia - 723143</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2 text-orange-600 font-semibold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm sm:text-base">Open: 4PM - 9PM</span>
                </div>
              </div>
              <button 
                onClick={() => setShowOrderForm(true)}
                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto md:mx-0 group"
              >
                <span>Order Now</span>
                <ShoppingCart className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right Content - Food Items with Animation */}
            <div className="relative h-96 md:h-[500px] lg:h-[600px] animate-fade-in-up animation-delay-200">
              {/* Main Momo Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
                  <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl flex items-center justify-center transform animate-float-slow overflow-hidden">
                    <div className="text-center p-8">
                      <img 
                        src="/momo-main.jpg" 
                        alt="Fresh Steamed Momos" 
                        className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 object-cover rounded-full mx-auto mb-4 shadow-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="text-gray-400 text-center"><div class="text-6xl mb-2">🥟</div><p class="text-sm">Add momo-main.jpg image</p></div>';
                        }}
                      />
                      <p className="text-lg sm:text-xl font-bold text-gray-800">Fresh Steamed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Veg Momo Floating */}
              <div className="absolute top-0 left-0 sm:left-8 md:left-12 animate-float">
                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 transform hover:scale-110 transition-transform cursor-pointer border-2 border-green-100">
                  <img 
                    src="/momo-veg.jpg" 
                    alt="Veg Momo" 
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg mb-2 mx-auto"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="text-center"><div class="text-3xl mb-2">🥟</div><p class="font-bold text-green-600 text-sm">Veg Momo</p><p class="text-xs text-gray-600">₹40/plate</p><p class="text-xs text-gray-500">₹20/half</p></div>';
                    }}
                  />
                  <p className="font-bold text-green-600 text-sm sm:text-base text-center">Veg Momo</p>
                  <p className="text-xs sm:text-sm text-gray-600 text-center">₹40/plate</p>
                  <p className="text-xs text-gray-500 text-center">₹20/half</p>
                </div>
              </div>

              {/* Chicken Momo Floating */}
              <div className="absolute bottom-0 right-0 sm:right-8 md:right-12 animate-float animation-delay-1000">
                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 transform hover:scale-110 transition-transform cursor-pointer border-2 border-orange-100">
                  <img 
                    src="/momo-chicken.jpg" 
                    alt="Chicken Momo" 
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg mb-2 mx-auto"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="text-center"><div class="text-3xl mb-2">🍗</div><p class="font-bold text-orange-600 text-sm">Chicken Momo</p><p class="text-xs text-gray-600">₹60/plate</p><p class="text-xs text-gray-500">₹30/half</p></div>';
                    }}
                  />
                  <p className="font-bold text-orange-600 text-sm sm:text-base text-center">Chicken Momo</p>
                  <p className="text-xs sm:text-sm text-gray-600 text-center">₹60/plate</p>
                  <p className="text-xs text-gray-500 text-center">₹30/half</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Shop Owner Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-gray-800">Meet Our Chef</h2>
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
              <div className="relative bg-white rounded-full p-3 shadow-2xl">
                <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src="/chef.jpg" 
                    alt="Chef" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="text-8xl">👨‍🍳</div>';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <p className="text-center mt-10 text-gray-600 text-xl sm:text-2xl font-medium">Crafting Delicious Momos Since Day One</p>
        </div>
      </section>

      {/* Social Icons */}
      <div className="fixed bottom-8 left-4 sm:left-8 z-30 flex flex-col space-y-4">
        <a 
          href="https://www.facebook.com/share/17nuFtauhL/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 group"
        >
          <Facebook className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
        </a>
        <a 
          href="https://www.instagram.com/amar_pal80?igsh=ang3ZnI2YnczazVi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all transform hover:scale-110 group"
        >
          <Instagram className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
        </a>
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {!orderType ? 'Choose Order Type' : 'Place Your Order'}
                </h2>
                <button 
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!orderType ? (
                // Order Type Selection
                <div className="order-type-selection">
                  <p className="text-gray-600 mb-6 text-center">Select how you would like to proceed with payment</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div 
                      className="order-type-card border-2 border-orange-200 hover:border-orange-500 transition-all cursor-pointer transform hover:scale-105"
                      onClick={() => handleOrderTypeSelect('with-payment')}
                    >
                      <div className="text-4xl mb-4">💳</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Order with Payment</h3>
                      <p className="text-gray-600 text-sm">Pay online via QR code and upload screenshot</p>
                    </div>
                    <div 
                      className="order-type-card border-2 border-gray-200 hover:border-orange-500 transition-all cursor-pointer transform hover:scale-105"
                      onClick={() => handleOrderTypeSelect('without-payment')}
                    >
                      <div className="text-4xl mb-4">💰</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Order without Payment</h3>
                      <p className="text-gray-600 text-sm">Pay cash when you pickup your order</p>
                    </div>
                  </div>
                </div>
              ) : (
                // Order Form
                <div className="order-form">
                  {/* Important Notice */}
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded-r-lg">
                    <p className="text-sm font-semibold text-orange-800 mb-2">⚠️ Important Notice:</p>
                    <ul className="text-xs sm:text-sm text-orange-700 space-y-1">
                      <li>• Home delivery service is NOT available</li>
                      <li>• Only PRE-ORDERS are accepted</li>
                      <li>• Pickup Time: 4PM - 9PM</li>
                      <li>• Location: Balarampur, Near SBI, Purulia - 723143</li>
                    </ul>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
                        placeholder="Enter 10-digit phone number"
                        maxLength="10"
                        required
                      />
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-800">Select Items</h3>
                      
                      {/* Veg Momo */}
                      <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src="/momo-veg.jpg" 
                              alt="Veg Momo" 
                              className="w-12 h-12 object-cover rounded-lg"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div>
                              <p className="font-bold text-gray-800 text-base sm:text-lg">Veg Momo</p>
                              <p className="text-sm text-gray-600">₹40/plate • ₹20/half plate</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {/* Full Plates */}
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">Full Plates</p>
                            <div className="flex items-center space-x-3">
                              <button
                                type="button"
                                onClick={() => setFormData({...formData, vegPlates: Math.max(0, formData.vegPlates - 1)})}
                                className="w-10 h-10 bg-white rounded-full shadow hover:bg-gray-100 transition font-bold text-lg flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-12 text-center font-bold text-lg">{formData.vegPlates}</span>
                              <button
                                type="button"
                                onClick={() => setFormData({...formData, vegPlates: formData.vegPlates + 1})}
                                className="w-10 h-10 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition font-bold text-lg flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          {/* Half Plates */}
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">Half Plates</p>
                            <div className="flex items-center space-x-3">
                              <button
                                type="button"
                                onClick={() => setFormData({...formData, vegHalfPlates: Math.max(0, formData.vegHalfPlates - 1)})}
                                className="w-10 h-10 bg-white rounded-full shadow hover:bg-gray-100 transition font-bold text-lg flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-12 text-center font-bold text-lg">{formData.vegHalfPlates}</span>
                              <button
                                type="button"
                                onClick={() => setFormData({...formData, vegHalfPlates: formData.vegHalfPlates + 1})}
                                className="w-10 h-10 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition font-bold text-lg flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Chicken Momo */}
                      <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src="/momo-chicken.jpg" 
                              alt="Chicken Momo" 
                              className="w-12 h-12 object-cover rounded-lg"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div>
                              <p className="font-bold text-gray-800 text-base sm:text-lg">Chicken Momo</p>
                              <p className="text-sm text-gray-600">₹60/plate • ₹30/half plate</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {/* Full Plates */}
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">Full Plates</p>
                            <div className="flex items-center space-x-3">
                              <button
                                type="button"
                                onClick={() => setFormData({...formData, chickenPlates: Math.max(0, formData.chickenPlates - 1)})}
                                className="w-10 h-10 bg-white rounded-full shadow hover:bg-gray-100 transition font-bold text-lg flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-12 text-center font-bold text-lg">{formData.chickenPlates}</span>
                              <button
                                type="button"
                                onClick={() => setFormData({...formData, chickenPlates: formData.chickenPlates + 1})}
                                className="w-10 h-10 bg-orange-600 text-white rounded-full shadow hover:bg-orange-700 transition font-bold text-lg flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          {/* Half Plates */}
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">Half Plates</p>
                            <div className="flex items-center space-x-3">
                              <button
                                type="button"
                                onClick={() => setFormData({...formData, chickenHalfPlates: Math.max(0, formData.chickenHalfPlates - 1)})}
                                className="w-10 h-10 bg-white rounded-full shadow hover:bg-gray-100 transition font-bold text-lg flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-12 text-center font-bold text-lg">{formData.chickenHalfPlates}</span>
                              <button
                                type="button"
                                onClick={() => setFormData({...formData, chickenHalfPlates: formData.chickenHalfPlates + 1})}
                                className="w-10 h-10 bg-orange-600 text-white rounded-full shadow hover:bg-orange-700 transition font-bold text-lg flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t-2 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                        <span className="text-2xl font-bold text-orange-600">₹{totalAmount}</span>
                      </div>
                    </div>

                    {/* Payment Section - Only show if with-payment */}
                    {orderType === 'with-payment' && (
                      <div className="payment-section border-t-2 pt-6 mt-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Payment</h3>
                        
                        {/* QR Code */}
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 flex flex-col items-center mb-6">
                          <p className="text-base font-bold text-gray-700 mb-4">QR Only</p>
                          <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
                            <img 
                              src="/qr.jpg" 
                              alt="QR Code" 
                              className="w-full h-full object-contain rounded-lg"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<div class="text-center p-4"><div class="text-4xl text-gray-400 mb-2">📱</div><p class="text-xs text-gray-500">Add qr-code.png</p></div>';
                              }}
                            />
                          </div>
                          <p className="text-sm text-gray-600 font-medium">
                            Amount: <span className="font-bold text-orange-600">₹{totalAmount}</span>
                          </p>
                        </div>

                        {/* Payment Screenshot Upload */}
                        <div className="upload-section">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Upload Payment Screenshot * <span className="text-red-500">(Required for verification)</span>
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors bg-gray-50">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="payment-upload"
                            />
                            <label htmlFor="payment-upload" className="cursor-pointer">
                              {paymentScreenshot ? (
                                <div className="space-y-2">
                                  <img src={paymentScreenshot} alt="Payment" className="max-w-full h-48 object-contain mx-auto rounded-lg shadow-md" />
                                  <p className="text-sm text-green-600 font-semibold">✓ Screenshot uploaded</p>
                                  <button
                                    type="button"
                                    onClick={() => setPaymentScreenshot(null)}
                                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                                  >
                                    Change image
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                                  <p className="text-sm text-gray-600 font-medium">Click to upload payment screenshot</p>
                                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setOrderType(null)}
                        className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleFinalSubmit}
                        className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        Confirm Order
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Order Confirmation Modal */}
{showConfirmation && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-scale-in overflow-hidden">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Thank You!</h2>
          <p className="text-green-50 text-lg font-semibold">Order Confirmed</p>
        </div>
        <button 
          onClick={() => {
            setShowConfirmation(false);
            setShowOrderForm(false);
            setOrderType(null);
            setPaymentScreenshot(null);
            setFormData({ name: '', phone: '', vegPlates: 0, vegHalfPlates: 0, chickenPlates: 0, chickenHalfPlates: 0 });
          }}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-20 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Message */}
      <div className="px-6 py-8 text-center space-y-4">
        <p className="text-gray-700 text-lg">Your order has been received successfully!</p>
        
        
        {/* Close Button */}
        <button
          onClick={() => {
            setShowConfirmation(false);
            setShowOrderForm(false);
            setOrderType(null);
            setPaymentScreenshot(null);
            setFormData({ name: '', phone: '', vegPlates: 0, vegHalfPlates: 0, chickenPlates: 0, chickenHalfPlates: 0 });
          }}
          className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      {/* Contact Form Modal */}
{showContactForm && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Contact Us</h2>
          <button 
            onClick={handleContactClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <div className="bg-orange-50 border-l-4 border-orange-500 p-5 rounded-r-lg">
            <div className="flex items-start space-x-3 mb-4">
              <svg className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-sm font-bold text-orange-800 mb-1">📍 Location</p>
                <p className="text-sm text-orange-700">Balarampur, Near SBI<br/>Purulia - 723143</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 mb-4">
              <svg className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="text-sm font-bold text-orange-800 mb-1">📞 Phone</p>
                <a href="tel:9046135660" className="text-lg font-bold text-orange-600 hover:text-orange-700">9046135660</a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-bold text-orange-800 mb-1">⏰ Opening Hours</p>
                <p className="text-sm text-orange-700 font-semibold">4PM - 9PM</p>
              </div>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  </div>
)}

      {/* Footer */}
      <footer className="relative z-10 bg-gradient-to-r from-orange-600 to-red-600 text-white py-5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm sm:text-base font-medium">
          © Copyright <span className="font-bold">Amar Momo</span>. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
