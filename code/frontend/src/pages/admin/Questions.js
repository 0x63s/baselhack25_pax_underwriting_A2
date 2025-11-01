import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import { questionApi, offeringApi, questionWeightsApi } from '../../services/api';
import { QuestionType, QuestionTypeLabels } from '../../constants/types';
import './Questions.css';

const Questions = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const offeringFilter = searchParams.get('offering');

  const [questions, setQuestions] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showWeightsModal, setShowWeightsModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [weights, setWeights] = useState([]);
  const [newWeight, setNewWeight] = useState({ valueQuestion: '', scoreQuestion: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    offering_id: offeringFilter || '',
    type: QuestionType.TEXT,
    typeOptions: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [questionsRes, offeringsRes] = await Promise.all([
        questionApi.getAllQuestions(),
        offeringApi.getAllOfferings(),
      ]);
      setQuestions(questionsRes.data);
      setOfferings(offeringsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadWeights = async (questionId) => {
    try {
      const response = await questionWeightsApi.getQuestionWeights(questionId);
      setWeights(response.data);
    } catch (error) {
      console.error('Error loading weights:', error);
      setWeights([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await questionApi.createQuestion(formData);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        offering_id: offeringFilter || '',
        type: QuestionType.TEXT,
        typeOptions: '',
      });
      loadData();
      alert('Question created successfully!');
    } catch (error) {
      console.error('Error creating question:', error);
      alert('Failed to create question');
    }
  };

  const handleManageWeights = async (question) => {
    setSelectedQuestion(question);
    await loadWeights(question.id);
    setShowWeightsModal(true);
  };

  const handleAddWeight = async () => {
    if (!newWeight.valueQuestion || !newWeight.scoreQuestion) {
      alert('Please fill in all weight fields');
      return;
    }

    try {
      await questionWeightsApi.createQuestionWeights({
        questionId: selectedQuestion.id,
        offeringId: selectedQuestion.offering.id,
        valueQuestion: newWeight.valueQuestion,
        scoreQuestion: parseFloat(newWeight.scoreQuestion),
      });
      setNewWeight({ valueQuestion: '', scoreQuestion: '' });
      await loadWeights(selectedQuestion.id);
      alert('Weight added successfully!');
    } catch (error) {
      console.error('Error adding weight:', error);
      alert('Failed to add weight');
    }
  };

  const filteredQuestions = offeringFilter
    ? questions.filter((q) => q.offering && q.offering.id === parseInt(offeringFilter))
    : questions;

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'offering',
      label: 'Offering',
      render: (offering) => offering?.name || 'N/A',
    },
    { key: 'title', label: 'Question' },
    {
      key: 'type',
      label: 'Type',
      render: (type) => QuestionTypeLabels[type] || type,
    },
    { key: 'typeOptions', label: 'Options' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button size="small" onClick={() => handleManageWeights(row)}>
          Manage Weights
        </Button>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div className="questions-page">
      <div className="page-header">
        <div>
          <Button variant="secondary" onClick={() => navigate('/admin')}>
            ← Back
          </Button>
          <h1>Questions Management</h1>
          {offeringFilter && (
            <p className="filter-info">
              Filtered by Offering ID: {offeringFilter}
            </p>
          )}
        </div>
        <Button onClick={() => setShowModal(true)}>Create New Question</Button>
      </div>

      <Card>
        <Table columns={columns} data={filteredQuestions} />
      </Card>

      {/* Create Question Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Question"
        size="medium"
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Offering"
            name="offering_id"
            type="select"
            value={formData.offering_id}
            onChange={handleInputChange}
            required
            options={offerings.map((o) => ({ value: o.id, label: o.name }))}
          />
          <Input
            label="Question Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter the question"
          />
          <Input
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Additional details (optional)"
          />
          <Input
            label="Question Type"
            name="type"
            type="select"
            value={formData.type}
            onChange={handleInputChange}
            required
            options={Object.keys(QuestionType).map((key) => ({
              value: QuestionType[key],
              label: QuestionTypeLabels[QuestionType[key]],
            }))}
          />
          <Input
            label="Type Options (comma-separated for dropdowns/radio)"
            name="typeOptions"
            value={formData.typeOptions}
            onChange={handleInputChange}
            placeholder="e.g., Yes,No,Maybe"
          />
          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Question</Button>
          </div>
        </form>
      </Modal>

      {/* Manage Weights Modal */}
      <Modal
        isOpen={showWeightsModal}
        onClose={() => setShowWeightsModal(false)}
        title={`Manage Weights: ${selectedQuestion?.title}`}
        size="large"
      >
        <div className="weights-section">
          <h3>Existing Weights</h3>
          {weights.length === 0 ? (
            <p className="no-weights">No weights defined yet</p>
          ) : (
            <table className="weights-table">
              <thead>
                <tr>
                  <th>Value/Answer</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {weights.map((weight) => (
                  <tr key={weight.id}>
                    <td>{weight.valueQuestion}</td>
                    <td>{weight.scoreQuestion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h3 className="add-weight-title">Add New Weight</h3>
          <div className="add-weight-form">
            <Input
              label="Answer/Value"
              value={newWeight.valueQuestion}
              onChange={(e) =>
                setNewWeight((prev) => ({ ...prev, valueQuestion: e.target.value }))
              }
              placeholder="e.g., Yes, No, 25-35"
            />
            <Input
              label="Score"
              type="number"
              value={newWeight.scoreQuestion}
              onChange={(e) =>
                setNewWeight((prev) => ({ ...prev, scoreQuestion: e.target.value }))
              }
              placeholder="e.g., 1.5, -2.0"
            />
            <Button onClick={handleAddWeight}>Add Weight</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Questions;
