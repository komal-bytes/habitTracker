import React from 'react';
import whatsapp from "/icons/social.png";

interface props {
  share: Function
}

const WhatsAppButton: React.FC<props> = ({ share }) => {
  return (
    <button
      className="absolute bottom-4 right-4 p-1 rounded-full text-white hover:bg-[#20b15c] transition-colors"
      aria-label="Share on WhatsApp"
      onClick={share}
    >
      <img src={whatsapp} alt="whatsapp icon" className='w-10 h-10' />
    </button>
  );
};

export default WhatsAppButton;
