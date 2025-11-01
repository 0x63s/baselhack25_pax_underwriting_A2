import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import { clientApi, submissionApi } from '../../services/api';
import './Clients.css';

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [submissions, setSubmissions] = useState([]);

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

  const handleViewSubmissions = async (client) => {
    setSelectedClient(client);
    try {
      const response = await submissionApi.getSubmissionsByClient(client.id);
      setSubmissions(response.data);
      setShowSubmissionsModal(true);
    } catch (error) {
      console.error('Error loading submissions:', error);
      alert('Failed to load submissions');
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
        <Button size="small" onClick={() => handleViewSubmissions(row)}>
          View Submissions
        </Button>
      ),
    },
  ];

  const submissionColumns = [
    { key: 'id', label: 'ID' },
    {
      key: 'question',
      label: 'Question',
      render: (question) => question?.title || 'N/A',
    },
    { key: 'value', label: 'Answer' },
    { key: 'type', label: 'Type' },
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
        isOpen={showSubmissionsModal}
        onClose={() => setShowSubmissionsModal(false)}
        title={`Submissions for ${selectedClient?.firstName} ${selectedClient?.lastName}`}
        size="large"
      >
        {submissions.length === 0 ? (
          <p className="no-submissions">No submissions found for this client</p>
        ) : (
          <Table columns={submissionColumns} data={submissions} />
        )}
      </Modal>
    </div>
  );
};

export default Clients;
