import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  applicationApi,
} from '../../services/api';
import { SwissCantons, GenderOptions, QuestionType, SubmissionValueType } from '../../constants/types';
import './ApplicationForm.css';

const NewApplicationForm = () => {
  const navigate = useNavigate();

  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [offeringsLoading, setOfferingsLoading] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Client data
  const [clientData, setClientData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    canton: '',
    zip: '',
    birthDate: '',
    email: '',
    phoneNumber: '',
    gender: '',
  });

  // Offerings
  const [offerings, setOfferings] = useState([]);
  const [selectedOffering, setSelectedOffering] = useState(null);

  // Questions and answers
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  // Fetch all offerings when component mounts
  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    setOfferingsLoading(true);
    try {
      const response = await offeringApi.getAllOfferings();
      setOfferings(response.data);
    } catch (error) {
      console.error('Error fetching offerings:', error);
      alert('Failed to load offerings. Please try again.');
    } finally {
      setOfferingsLoading(false);
    }
  };

  // Fetch questions when offering is selected
  const fetchQuestions = async (offeringId) => {
    setQuestionsLoading(true);
    try {
      const response = await questionApi.getQuestionsByOfferingId(offeringId);
      setQuestions(response.data);

      // Initialize answers object
      const initialAnswers = {};
      response.data.forEach((q) => {
        initialAnswers[q.id] = '';
      });
      setAnswers(initialAnswers);
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Failed to load questions. Please try again.');
    } finally {
      setQuestionsLoading(false);
    }
  };

  // Handle client data changes
  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  // Handle answer changes
  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  // Validate client data
  const validateClientData = () => {
    const requiredFields = [
      'firstName',
      'lastName',
      'address',
      'city',
      'canton',
      'zip',
      'birthDate',
      'email',
      'phoneNumber',
      'gender',
    ];

    for (const field of requiredFields) {
      if (!clientData[field]) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  // Step 1 -> Step 2: Validate client data
  const handleStep1Next = () => {
    if (validateClientData()) {
      setCurrentStep(2);
    }
  };

  // Step 2 -> Step 3: Select offering and load questions
  const handleOfferingSelect = async (offering) => {
    setSelectedOffering(offering);
    await fetchQuestions(offering.id);
    setCurrentStep(3);
  };

  // Step 3 -> Submit
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Step 1: Create the client
      const clientResponse = await clientApi.createClient({
        ...clientData,
        zip: parseInt(clientData.zip),
      });
      const clientId = clientResponse.data.id;

      // Step 2: Create the application
      const applicationResponse = await applicationApi.createApplication({
        clientId: clientId,
        offeringId: selectedOffering.id,
      });
      const applicationId = applicationResponse.data.id;

      // Step 3: Prepare submissions
      const submissions = questions.map((question) => ({
        applicationId: applicationId,
        clientId: clientId,
        questionId: question.id,
        value: String(answers[question.id] || ''),
        type: mapQuestionTypeToSubmissionType(question.type),
      }));

      // Step 4: Create all submissions
      await submissionApi.createSubmissions(submissions);

      // Navigate to success page
      navigate('/user/success');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Map question type to submission value type
  const mapQuestionTypeToSubmissionType = (questionType) => {
    switch (questionType) {
      case QuestionType.NUMBER:
        return SubmissionValueType.NUMBER;
      case QuestionType.DATE:
        return SubmissionValueType.DATE;
      case QuestionType.RADIO_BUTTON:
      case QuestionType.DROPDOWN:
        return SubmissionValueType.CATEGORY;
      case QuestionType.CHECKBOX:
      case QuestionType.TAGS:
        return SubmissionValueType.TAGS;
      default:
        return SubmissionValueType.TEXT;
    }
  };

  // Render question input based on type
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
        if (!question.typeOptions) return null;
        return (
          <Input
            key={question.id}
            label={question.title}
            type="select"
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            options={question.typeOptions.split(',').map((option) => ({
              value: option.trim(),
              label: option.trim(),
            }))}
          />
        );

      case QuestionType.RADIO_BUTTON:
        if (!question.typeOptions) return null;
        return (
          <div key={question.id} className="form-group">
            <label className="form-label">{question.title}</label>
            {question.description && (
              <p className="form-description">{question.description}</p>
            )}
            <div className="radio-group">
              {question.typeOptions
                .split(',')
                .map((option) => option.trim())
                .map((option) => (
                  <label key={option} className="radio-label">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={value === option}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                    />
                    {option}
                  </label>
                ))}
            </div>
          </div>
        );

      case QuestionType.CHECKBOX:
        if (!question.typeOptions) return null;
        const selectedOptions = value ? value.split(',').map((v) => v.trim()) : [];
        return (
          <div key={question.id} className="form-group">
            <label className="form-label">{question.title}</label>
            {question.description && (
              <p className="form-description">{question.description}</p>
            )}
            <div className="checkbox-group">
              {question.typeOptions
                .split(',')
                .map((option) => option.trim())
                .map((option) => (
                  <label key={option} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={option}
                      checked={selectedOptions.includes(option)}
                      onChange={(e) => {
                        let newOptions;
                        if (e.target.checked) {
                          newOptions = [...selectedOptions, option];
                        } else {
                          newOptions = selectedOptions.filter((o) => o !== option);
                        }
                        handleAnswerChange(question.id, newOptions.join(','));
                      }}
                    />
                    {option}
                  </label>
                ))}
            </div>
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="application-form-page">
      <div className="page-header">
        <h1>Insurance Application</h1>
        <div className="step-indicator">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Personal Information</div>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Select Offering</div>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Questionnaire</div>
          </div>
        </div>
      </div>

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <Card title="Personal Information">
          <form onSubmit={(e) => { e.preventDefault(); handleStep1Next(); }}>
            <div className="form-row">
              <Input
                label="First Name"
                name="firstName"
                value={clientData.firstName}
                onChange={handleClientChange}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={clientData.lastName}
                onChange={handleClientChange}
                required
              />
            </div>

            <Input
              label="Email"
              name="email"
              type="email"
              value={clientData.email}
              onChange={handleClientChange}
              required
            />

            <Input
              label="Phone Number"
              name="phoneNumber"
              value={clientData.phoneNumber}
              onChange={handleClientChange}
              required
            />

            <Input
              label="Birth Date"
              name="birthDate"
              type="date"
              value={clientData.birthDate}
              onChange={handleClientChange}
              required
            />

            <Input
              label="Gender"
              name="gender"
              type="select"
              value={clientData.gender}
              onChange={handleClientChange}
              options={GenderOptions}
              required
            />

            <Input
              label="Address"
              name="address"
              value={clientData.address}
              onChange={handleClientChange}
              required
            />

            <div className="form-row">
              <Input
                label="City"
                name="city"
                value={clientData.city}
                onChange={handleClientChange}
                required
              />
              <Input
                label="ZIP Code"
                name="zip"
                type="number"
                value={clientData.zip}
                onChange={handleClientChange}
                required
              />
            </div>

            <Input
              label="Canton"
              name="canton"
              type="select"
              value={clientData.canton}
              onChange={handleClientChange}
              options={SwissCantons}
              required
            />

            <div className="form-actions">
              <Button type="submit">Next: Select Offering</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Step 2: Select Offering */}
      {currentStep === 2 && (
        <Card title="Select Insurance Offering">
          {offeringsLoading ? (
            <Loading />
          ) : offerings.length === 0 ? (
            <p className="no-data">No offerings available at this time.</p>
          ) : (
            <div className="offerings-grid">
              {offerings.map((offering) => (
                <div
                  key={offering.id}
                  className="offering-card"
                  onClick={() => handleOfferingSelect(offering)}
                >
                  <h3>{offering.name}</h3>
                  <p>{offering.description}</p>
                  <Button variant="primary">Select This Offering</Button>
                </div>
              ))}
            </div>
          )}
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setCurrentStep(1)}>
              Back to Personal Information
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Questionnaire */}
      {currentStep === 3 && (
        <Card title={`Questionnaire - ${selectedOffering?.name}`}>
          {questionsLoading ? (
            <Loading />
          ) : questions.length === 0 ? (
            <p className="no-data">No questions available for this offering.</p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="questions-container">
                {questions.map((question) => renderQuestionInput(question))}
              </div>

              <div className="form-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setCurrentStep(2)}
                >
                  Back to Offerings
                </Button>
                <Button type="submit">Submit Application</Button>
              </div>
            </form>
          )}
        </Card>
      )}
    </div>
  );
};

export default NewApplicationForm;
