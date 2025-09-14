"use client";

import React from "react";

export default function WhatsAppFloatingIcon() {
  const handleWhatsAppClick = () => {
    // You can customize this phone number
    const phoneNumber = "+1234567890"; // Replace with your WhatsApp number
    const message = "Hello! I need help with my insurance policy.";
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label="Contact us on WhatsApp"
      >
        <img src="/icons/whatsapp.gif" alt="WhatsApp" className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
      </button>
      
      {/* Optional tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Chat with us on WhatsApp
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
}
