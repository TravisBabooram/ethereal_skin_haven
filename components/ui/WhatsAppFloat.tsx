"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  return (
    <>
      <a
        href="https://wa.me/18687057023"
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={22} className="wa-icon" />
        <span className="wa-label">Chat with us</span>
      </a>
      <style>{`
        .wa-float {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 999;
          display: flex;
          align-items: center;
          gap: 0;
          padding: 14px;
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          border-radius: 50px;
          box-shadow: 0 4px 20px rgba(37,211,102,0.35);
          text-decoration: none;
          color: #fff;
          overflow: hidden;
          max-width: 52px;
          transition: max-width 0.4s cubic-bezier(0.22,1,0.36,1),
                      gap 0.4s cubic-bezier(0.22,1,0.36,1),
                      padding 0.4s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.3s ease;
        }
        .wa-float:hover {
          max-width: 200px;
          gap: 10px;
          padding: 14px 20px 14px 16px;
          box-shadow: 0 8px 36px rgba(37,211,102,0.55);
        }
        .wa-icon { flex-shrink: 0; }
        .wa-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          white-space: nowrap;
          opacity: 0;
          transform: translateX(-8px);
          transition: opacity 0.25s ease 0.1s, transform 0.3s ease 0.05s;
          pointer-events: none;
        }
        .wa-float:hover .wa-label {
          opacity: 1;
          transform: translateX(0);
        }
        @media (max-width: 480px) {
          .wa-float { bottom: 20px; right: 20px; }
        }
      `}</style>
    </>
  );
}
