import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import TagSelector from '../../components/common/TagSelector';
import Loading from '../../components/common/Loading';
import {
  offeringApi,
  questionApi,
  clientApi,
  submissionApi,
} from '../../services/api';
import { SwissCantons, GenderOptions, QuestionType, SubmissionValueType } from '../../constants/types';
import './ApplicationForm.css';

const ApplicationForm = () => {
  const navigate = useNavigate();
  const { offeringId } = useParams();

  const [offering, setOffering] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Client information form
  const [clientData, setClientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    canton: '',
    zip: '',
    birthDate: '',
    gender: '',
  });

  // Answers to questions
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    loadData();
  }, [offeringId]);

  const loadData = async () => {
    try {
      const [offeringRes, questionsRes] = await Promise.all([
        offeringApi.getOfferingById(offeringId),
        questionApi.getAllQuestions(),
      ]);

      setOffering(offeringRes.data);

      // Filter questions for this offering
      const offeringQuestions = questionsRes.data.filter(
        (q) => q.offering && q.offering.id === parseInt(offeringId)
      );
      setQuestions(offeringQuestions);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load application form');
      navigate('/user');
    } finally {
      setLoading(false);
    }
  };

  const handleClientInputChange = (e) => {
    const { name, value } = e.target;
    setClientData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Step 1: Create client
      const clientResponse = await clientApi.createClient(clientData);
      const clientId = clientResponse.data.id;

      // Step 2: Create submissions for each answered question
      const submissions = questions
        .filter((q) => answers[q.id])
        .map((q) => ({
          clientId,
          questionId: q.id,
          value: String(answers[q.id]),
          type: getSubmissionType(q.type),
        }));

      if (submissions.length > 0) {
        await submissionApi.createSubmissions(submissions);
      }

      // Navigate to success page
      navigate('/user/success', {
        state: { clientId, offeringName: offering.name },
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getSubmissionType = (questionType) => {
    switch (questionType) {
      case QuestionType.NUMBER:
        return SubmissionValueType.NUMBER;
      case QuestionType.DATE:
        return SubmissionValueType.DATE;
      default:
        return SubmissionValueType.TEXT;
    }
  };

  const renderQuestionInput = (question) => {
    const value = answers[question.id] || '';

    switch (question.type) {
      case QuestionType.TEXT:
        return (
          <Input
            key={question.id}
            label={question.title}
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.description}
          />
        );

      case QuestionType.NUMBER:
        return (
          <Input
            key={question.id}
            label={question.title}
            type="number"
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.description}
          />
        );

      case QuestionType.DATE:
        return (
          <Input
            key={question.id}
            label={question.title}
            type="date"
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          />
        );

      case QuestionType.DROPDOWN:
      case QuestionType.RADIO_BUTTON:
        const options = question.typeOptions
          ? question.typeOptions.split(',').map((opt) => opt.trim())
          : [];
        return (
          <Input
            key={question.id}
            label={question.title}
            type="select"
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            options={options}
            placeholder={question.description || 'Select an option'}
          />
        );

      case QuestionType.CHECKBOX:
        return (
          <div key={question.id} className="checkbox-group">
            <label className="input-label">{question.title}</label>
            {question.typeOptions &&
              question.typeOptions.split(',').map((option) => {
                const trimmedOption = option.trim();
                const selectedOptions = value ? value.split(',') : [];
                const isChecked = selectedOptions.includes(trimmedOption);

                return (
                  <label key={trimmedOption} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        let newValue;
                        if (e.target.checked) {
                          newValue = [...selectedOptions, trimmedOption].join(',');
                        } else {
                          newValue = selectedOptions
                            .filter((opt) => opt !== trimmedOption)
                            .join(',');
                        }
                        handleAnswerChange(question.id, newValue);
                      }}
                    />
                    {trimmedOption}
                  </label>
                );
              })}
          </div>
        );

      case QuestionType.TAGS:
        // Parse typeOptions: format is "SINGLE:tag1,tag2,tag3" or "MULTIPLE:tag1,tag2,tag3"
        let tagMode = 'MULTIPLE';
        let tagOptions = [];

        if (question.typeOptions) {
          const parts = question.typeOptions.split(':');
          if (parts.length === 2 && (parts[0] === 'SINGLE' || parts[0] === 'MULTIPLE')) {
            tagMode = parts[0];
            tagOptions = parts[1].split(',').map(tag => tag.trim()).filter(tag => tag);
          } else {
            // Fallback: treat entire string as comma-separated tags
            tagOptions = question.typeOptions.split(',').map(tag => tag.trim()).filter(tag => tag);
          }
        }

        return (
          <TagSelector
            key={question.id}
            label={question.title}
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            options={tagOptions}
            multiple={tagMode === 'MULTIPLE'}
          />
        );

      default:
        return (
          <Input
            key={question.id}
            label={question.title}
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.description}
          />
        );
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="application-form">
      <div className="form-header">
        <Button variant="secondary" onClick={() => navigate('/user')}>
          ← Back to Offerings
        </Button>
        <h1>Application for {offering?.name}</h1>
        <div className="progress-indicator">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            1. Personal Information
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            2. Questionnaire
          </div>
        </div>
      </div>

      {step === 1 && (
        <Card title="Personal Information">
          <form onSubmit={handleNextStep}>
            <div className="form-grid">
              <Input
                label="First Name"
                name="firstName"
                value={clientData.firstName}
                onChange={handleClientInputChange}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={clientData.lastName}
                onChange={handleClientInputChange}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={clientData.email}
                onChange={handleClientInputChange}
                required
              />
              <Input
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                value={clientData.phoneNumber}
                onChange={handleClientInputChange}
                required
              />
              <Input
                label="Date of Birth"
                name="birthDate"
                type="date"
                value={clientData.birthDate}
                onChange={handleClientInputChange}
                required
              />
              <Input
                label="Gender"
                name="gender"
                type="select"
                value={clientData.gender}
                onChange={handleClientInputChange}
                options={GenderOptions}
                required
              />
              <Input
                label="Address"
                name="address"
                value={clientData.address}
                onChange={handleClientInputChange}
                required
                className="full-width"
              />
              <Input
                label="City"
                name="city"
                value={clientData.city}
                onChange={handleClientInputChange}
                required
              />
              <Input
                label="ZIP Code"
                name="zip"
                type="number"
                value={clientData.zip}
                onChange={handleClientInputChange}
                required
              />
              <Input
                label="Canton"
                name="canton"
                type="select"
                value={clientData.canton}
                onChange={handleClientInputChange}
                options={SwissCantons}
                required
              />
            </div>
            <div className="form-actions">
              <Button type="submit" fullWidth>
                Next: Questionnaire →
              </Button>
            </div>
          </form>
        </Card>
      )}

      {step === 2 && (
        <Card title="Questionnaire">
          <form onSubmit={handleSubmit}>
            {questions.length === 0 ? (
              <p className="no-questions">
                No questions available for this offering. Click Submit to complete
                your application.
              </p>
            ) : (
              <div className="questions-container">
                {questions.map((question) => renderQuestionInput(question))}
              </div>
            )}
            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={handlePreviousStep}
              >
                ← Previous
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default ApplicationForm;
