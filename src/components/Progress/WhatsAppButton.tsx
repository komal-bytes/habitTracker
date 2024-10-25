import React, { forwardRef } from 'react';
import whatsapp from "/icons/social.png";
import { handleShareOnWhatsApp } from '@/utils/habitFunctions';

const WhatsAppButton = forwardRef<HTMLDivElement, {}>((_, ref) => {
  return (
    <button
      className="absolute bottom-4 right-4 p-1 rounded-full text-white hover:bg-[#20b15c] transition-colors"
      aria-label="Share on WhatsApp"
      onClick={() => handleShareOnWhatsApp(ref)}
    >
      <img src={whatsapp} alt="whatsapp icon" className="w-10 h-10" />
    </button>
  );
});

export default WhatsAppButton;
