import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import { clientApi, applicationApi } from '../../services/api';
import './Clients.css';

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await clientApi.getAllClients();
      setClients(response.data);
    } catch (error) {
      console.error('Error loading clients:', error);
      alert('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplications = async (client) => {
    setSelectedClient(client);
    setLoadingApplications(true);
    try {
      // Get all applications and filter by client ID
      const allAppsResponse = await applicationApi.getAllApplications();
      const clientApps = allAppsResponse.data.filter(app => app.client.id === client.id);
      setApplications(clientApps);
      setShowApplicationsModal(true);
    } catch (error) {
      console.error('Error loading applications:', error);
      if (error.response?.status === 404) {
        setApplications([]);
        setShowApplicationsModal(true);
      } else {
        alert('Failed to load applications');
      }
    } finally {
      setLoadingApplications(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'fullName',
      label: 'Name',
      render: (_, row) => `${row.firstName} ${row.lastName}`,
    },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'city', label: 'City' },
    { key: 'canton', label: 'Canton' },
    {
      key: 'birthDate',
      label: 'Birth Date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button size="small" onClick={() => handleViewApplications(row)}>
          View Applications
        </Button>
      ),
    },
  ];

  const applicationColumns = [
    { key: 'id', label: 'Application ID' },
    {
      key: 'offering',
      label: 'Offering',
      render: (offering) => offering?.name || 'N/A',
    },
    {
      key: 'createdAt',
      label: 'Submitted',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      key: 'isReviewed',
      label: 'Status',
      render: (isReviewed) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          backgroundColor: isReviewed ? '#10b981' : '#f59e0b',
          color: 'white',
          fontSize: '0.85rem'
        }}>
          {isReviewed ? 'Reviewed' : 'Pending'}
        </span>
      ),
    },
    {
      key: 'riskCategory',
      label: 'Risk Category',
      render: (category) => category ? category.replace(/_/g, ' ') : 'Not assessed',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button
          size="small"
          variant="secondary"
          onClick={() => navigate(`/admin/applications?id=${row.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div className="clients-page">
      <div className="page-header">
        <div>
          <Button variant="secondary" onClick={() => navigate('/admin')}>
            ← Back
          </Button>
          <h1>Clients Management</h1>
        </div>
      </div>

      <Card>
        <Table columns={columns} data={clients} />
      </Card>

      <Modal
        isOpen={showApplicationsModal}
        onClose={() => setShowApplicationsModal(false)}
        title={`Applications for ${selectedClient?.firstName} ${selectedClient?.lastName}`}
        size="large"
      >
        {loadingApplications ? (
          <Loading />
        ) : applications.length === 0 ? (
          <p className="no-submissions">No applications found for this client</p>
        ) : (
          <Table columns={applicationColumns} data={applications} />
        )}
      </Modal>
    </div>
  );
};

export default Clients;
