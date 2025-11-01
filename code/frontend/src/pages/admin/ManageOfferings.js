import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import { offeringApi } from '../../services/api';
import './Admin.css';

const ManageOfferings = () => {
  const navigate = useNavigate();
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingOffering, setEditingOffering] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    setLoading(true);
    try {
      const response = await offeringApi.getAllOfferings();
      setOfferings(response.data);
    } catch (error) {
      console.error('Error fetching offerings:', error);
      if (error.response?.status !== 404) {
        alert('Failed to load offerings');
      } else {
        setOfferings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingOffering(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleEdit = (offering) => {
    setEditingOffering(offering);
    setFormData({ name: offering.name, description: offering.description || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offering? All associated questions will also be deleted.')) {
      return;
    }

    try {
      await offeringApi.deleteOffering(id);
      alert('Offering deleted successfully!');
      fetchOfferings();
    } catch (error) {
      console.error('Error deleting offering:', error);
      alert('Failed to delete offering. It may have associated data.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter offering name');
      return;
    }

    try {
      if (editingOffering) {
        await offeringApi.updateOffering(editingOffering.id, formData);
        alert('Offering updated successfully!');
      } else {
        await offeringApi.createOffering(formData);
        alert('Offering created successfully!');
      }
      setShowModal(false);
      fetchOfferings();
    } catch (error) {
      console.error('Error saving offering:', error);
      alert('Failed to save offering. ' + (error.response?.data?.message || ''));
    }
  };

  const handleManageQuestions = (offering) => {
    navigate(`/admin/offerings/${offering.id}/questions`);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <Loading />
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Manage Offerings</h1>
        <Button onClick={handleAddNew} variant="primary">
          Add New Offering
        </Button>
      </div>

      <div className="offerings-grid">
        {offerings.length === 0 ? (
          <Card>
            <p>No offerings found. Create your first offering to get started.</p>
          </Card>
        ) : (
          offerings.map((offering) => (
            <Card key={offering.id} className="offering-card">
              <div className="offering-card-content">
                <h3>{offering.name}</h3>
                <p>{offering.description || 'No description provided'}</p>
              </div>
              <div className="offering-card-actions">
                <Button onClick={() => handleManageQuestions(offering)} variant="secondary">
                  Manage Questions
                </Button>
                <Button onClick={() => handleEdit(offering)} variant="secondary">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(offering.id)} variant="danger">
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={showModal}
        title={editingOffering ? 'Edit Offering' : 'Add New Offering'}
        onClose={() => setShowModal(false)}
      >
          <form onSubmit={handleSubmit} className="offering-form">
            <Input
              label="Offering Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Life Insurance"
              required
            />
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the offering"
              type="textarea"
            />
            <div className="modal-actions">
              <Button type="button" onClick={() => setShowModal(false)} variant="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingOffering ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>
    </div>
  );
};

export default ManageOfferings;
