import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import { offeringApi } from '../../services/api';
import './Offerings.css';

const Offerings = () => {
  const navigate = useNavigate();
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await offeringApi.createOffering(formData);
      setShowModal(false);
      setFormData({ name: '', description: '' });
      loadOfferings();
      alert('Offering created successfully!');
    } catch (error) {
      console.error('Error creating offering:', error);
      alert('Failed to create offering');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button
          size="small"
          onClick={() => navigate(`/admin/questions?offering=${row.id}`)}
        >
          View Questions
        </Button>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div className="offerings-page">
      <div className="page-header">
        <div>
          <Button variant="secondary" onClick={() => navigate('/admin')}>
            ← Back
          </Button>
          <h1>Offerings Management</h1>
        </div>
        <div className="header-actions">
          <Button variant="success" onClick={() => navigate('/admin/offerings/new')}>
            + Create with Form Builder
          </Button>
          <Button onClick={() => setShowModal(true)}>Quick Create (No Questions)</Button>
        </div>
      </div>

      <Card>
        <Table columns={columns} data={offerings} />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Offering"
        size="medium"
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Offering Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="e.g., Life Insurance, Health Insurance"
          />
          <Input
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe this offering..."
          />
          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Offering</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Offerings;
