import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import welcomeBg from "../welcomeSite.png";
import siteBg from "../bg.png";

export default function WelcomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // set welcome background while this page is mounted
    const prev = document.body.style.backgroundImage;
    document.body.style.backgroundImage = `url(${welcomeBg})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    return () => {
      // restore site background
      document.body.style.backgroundImage = `url(${siteBg})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center' }}>
        <button className="btn" onClick={() => navigate('/login')}>
        Log In
        </button>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundImage: `url(${welcomeBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
};

const panelStyle = {
  background: 'rgba(255,255,255,0.85)',
  padding: 24,
  borderRadius: 8,
  boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
};
