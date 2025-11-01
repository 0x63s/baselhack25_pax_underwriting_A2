import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import './SuccessPage.css';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clientId, offeringName } = location.state || {};
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="success-page">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      <Card className="success-card">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h1>Application Submitted Successfully!</h1>
          <p className="success-message">
            Your application for <strong>{offeringName || 'the offering'}</strong> has
            been submitted successfully.
          </p>
          {clientId && (
            <p className="client-id">
              Your client reference ID: <strong>{clientId}</strong>
            </p>
          )}
          <p className="next-steps">
            We will review your application and contact you soon with the next steps.
          </p>

          <div className="success-actions">
            <Button onClick={() => navigate('/user')}>
              Submit Another Application
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin')}>
              View Admin Dashboard
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SuccessPage;
