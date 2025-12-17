import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => (
  <a
    className="whatsapp"
    href="https://wa.me/420722140302"
    target="_blank"
    rel="noreferrer"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle size={26} color="#ffffff" />
  </a>
);

export default WhatsAppButton;
