import React from 'react';
import whatsapp from "/icons/social.png";

interface props {
  share: Function
}

const WhatsAppButton: React.FC<props> = ({ share }) => {
  return (
    <button
      className="absolute bottom-4 right-4 bg-[#25D366] p-3 rounded-full text-white shadow-lg hover:bg-[#20b15c] transition-colors"
      aria-label="Share on WhatsApp"
      onClick={share}
    >
      <img src={whatsapp} alt="whatsapp icon" className='w-8 h-8'/>
    </button>
  );
};

export default WhatsAppButton;
