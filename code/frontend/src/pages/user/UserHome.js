import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { offeringApi } from '../../services/api';
import './UserHome.css';

const UserHome = () => {
  const navigate = useNavigate();
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      const response = await offeringApi.getAllOfferings();
      setOfferings(response.data);
    } catch (error) {
      console.error('Error loading offerings:', error);
      alert('Failed to load offerings');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOffering = (offeringId) => {
    navigate(`/user/apply/${offeringId}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="user-home">
      <div className="user-home-header">
        <h1>Welcome to PAX Underwriting</h1>
        <p>Select an insurance offering to begin your application</p>
      </div>

      {offerings.length === 0 ? (
        <Card>
          <p className="no-offerings">
            No offerings available at this time. Please check back later.
          </p>
        </Card>
      ) : (
        <div className="offerings-grid">
          {offerings.map((offering) => (
            <Card key={offering.id} className="offering-card">
              <div className="offering-content">
                <div className="offering-icon">📋</div>
                <h2 className="offering-name">{offering.name}</h2>
                <p className="offering-description">
                  {offering.description || 'No description available'}
                </p>
                <Button
                  fullWidth
                  onClick={() => handleSelectOffering(offering.id)}
                >
                  Apply Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="admin-link">
        <Button variant="secondary" onClick={() => navigate('/admin')}>
          Admin Dashboard
        </Button>
      </div>
    </div>
  );
};

export default UserHome;
