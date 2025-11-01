import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import { questionApi, offeringApi, questionWeightsApi } from '../../services/api';
import { QuestionType } from '../../constants/types';
import './Admin.css';

const ManageQuestions = () => {
  const { offeringId } = useParams();
  const navigate = useNavigate();
  const [offering, setOffering] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: QuestionType.TEXT,
    typeOptions: '',
    weight: '',
  });

  const questionTypes = [
    { value: QuestionType.TEXT, label: 'Text' },
    { value: QuestionType.NUMBER, label: 'Number' },
    { value: QuestionType.DATE, label: 'Date' },
    { value: QuestionType.DROPDOWN, label: 'Dropdown' },
    { value: QuestionType.RADIO_BUTTON, label: 'Radio Button' },
    { value: QuestionType.CHECKBOX, label: 'Checkbox' },
    { value: QuestionType.TAGS, label: 'Tags (Multi-select)' },
  ];

  useEffect(() => {
    fetchOffering();
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offeringId]);

  const fetchOffering = async () => {
    try {
      const response = await offeringApi.getOfferingById(offeringId);
      setOffering(response.data);
    } catch (error) {
      console.error('Error fetching offering:', error);
      alert('Failed to load offering');
      navigate('/admin/offerings');
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await questionApi.getQuestionsByOfferingId(offeringId);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingQuestion(null);
    setFormData({
      title: '',
      description: '',
      type: QuestionType.TEXT,
      typeOptions: '',
      weight: '',
    });
    setShowModal(true);
  };

  const handleEdit = async (question) => {
    setEditingQuestion(question);

    // Fetch weights for this question
    let weight = '';
    try {
      const weightsResponse = await questionWeightsApi.getQuestionWeights(question.id);
      weight = weightsResponse.data.weights || '';
    } catch (error) {
      // Weights don't exist yet
    }

    setFormData({
      title: question.title,
      description: question.description || '',
      type: question.type,
      typeOptions: question.typeOptions || '',
      weight: weight,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await questionApi.deleteQuestion(id);
      alert('Question deleted successfully!');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter question title');
      return;
    }

    // Validate type options for dropdown, radio, checkbox
    if ([QuestionType.DROPDOWN, QuestionType.RADIO_BUTTON, QuestionType.CHECKBOX, QuestionType.TAGS].includes(formData.type)) {
      if (!formData.typeOptions.trim()) {
        alert('Please provide options for this question type (comma-separated)');
        return;
      }
    }

    try {
      const questionData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        typeOptions: formData.typeOptions,
        offering_id: parseInt(offeringId),
      };

      let questionId;
      if (editingQuestion) {
        const response = await questionApi.updateQuestion(editingQuestion.id, questionData);
        questionId = response.data.id;
        alert('Question updated successfully!');
      } else {
        const response = await questionApi.createQuestion(questionData);
        questionId = response.data.id;
        alert('Question created successfully!');
      }

      // Save or update weights if provided
      if (formData.weight.trim()) {
        try {
          const weightsData = {
            questionId: questionId,
            weights: formData.weight,
          };

          if (editingQuestion) {
            await questionWeightsApi.updateQuestionWeights(questionId, weightsData);
          } else {
            await questionWeightsApi.createQuestionWeights(weightsData);
          }
        } catch (weightError) {
          console.error('Error saving weights:', weightError);
          // Don't fail the whole operation if weights fail
        }
      }

      setShowModal(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Failed to save question. ' + (error.response?.data?.message || ''));
    }
  };

  const needsOptions = [QuestionType.DROPDOWN, QuestionType.RADIO_BUTTON, QuestionType.CHECKBOX, QuestionType.TAGS].includes(formData.type);

  if (loading && !offering) {
    return (
      <div className="admin-container">
        <Loading />
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <Button onClick={() => navigate('/admin/offerings')} variant="secondary">
            ← Back to Offerings
          </Button>
          <h1>Manage Questions: {offering?.name}</h1>
        </div>
        <Button onClick={handleAddNew} variant="primary">
          Add New Question
        </Button>
      </div>

      <div className="questions-list">
        {loading ? (
          <Loading />
        ) : questions.length === 0 ? (
          <Card>
            <p>No questions found. Add your first question to get started.</p>
          </Card>
        ) : (
          questions.map((question) => (
            <Card key={question.id} className="question-card">
              <div className="question-card-content">
                <h3>{question.title}</h3>
                <p className="question-description">{question.description || 'No description'}</p>
                <div className="question-meta">
                  <span className="question-type-badge">{question.type}</span>
                  {question.typeOptions && (
                    <span className="question-options">Options: {question.typeOptions}</span>
                  )}
                </div>
              </div>
              <div className="question-card-actions">
                <Button onClick={() => handleEdit(question)} variant="secondary">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(question.id)} variant="danger">
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={showModal}
        title={editingQuestion ? 'Edit Question' : 'Add New Question'}
        onClose={() => setShowModal(false)}
      >
          <form onSubmit={handleSubmit} className="question-form">
            <Input
              label="Question Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., What is your height?"
              required
            />
            <Input
              label="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional context or help text"
              type="textarea"
            />
            <Input
              label="Question Type"
              type="select"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={questionTypes}
              required
            />
            {needsOptions && (
              <Input
                label="Options (comma-separated)"
                value={formData.typeOptions}
                onChange={(e) => setFormData({ ...formData, typeOptions: e.target.value })}
                placeholder="e.g., Yes, No, Maybe"
                required={needsOptions}
              />
            )}
            <Input
              label="Weight (for risk calculation)"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="e.g., 10 or JSON format"
            />
            <div className="modal-actions">
              <Button type="button" onClick={() => setShowModal(false)} variant="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingQuestion ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>
    </div>
  );
};

export default ManageQuestions;
