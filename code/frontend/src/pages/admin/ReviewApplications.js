import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import { applicationApi, questionApi } from '../../services/api';
import './Admin.css';

const RiskCategory = {
  ACCEPTANCE: 'ACCEPTANCE',
  RISK_SURCHARGE_INDICATED: 'RISK_SURCHARGE_INDICATED',
  ADDITIONAL_CLARIFICATION_INDICATED: 'ADDITIONAL_CLARIFICATION_INDICATED',
  REJECTION: 'REJECTION',
};

const ReviewApplications = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [riskScore, setRiskScore] = useState(null);
  const [reviewData, setReviewData] = useState({
    riskCategory: RiskCategory.ACCEPTANCE,
    adminNotes: '',
    reviewedBy: 'Admin',
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    // Check if there's an ID in the query params
    const params = new URLSearchParams(location.search);
    const appId = params.get('id');
    if (appId && applications.length > 0) {
      const app = applications.find(a => a.id === parseInt(appId));
      if (app) {
        handleSelectApplication(app);
      }
    }
  }, [location.search, applications, handleSelectApplication]);

  useEffect(() => {
    // Filter applications based on search query
    if (!searchQuery.trim()) {
      setFilteredApplications(applications);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = applications.filter(app =>
        `${app.client.firstName} ${app.client.lastName}`.toLowerCase().includes(query) ||
        app.offering.name.toLowerCase().includes(query) ||
        app.id.toString().includes(query) ||
        app.client.email.toLowerCase().includes(query)
      );
      setFilteredApplications(filtered);
    }
  }, [searchQuery, applications]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationApi.getAllApplications();
      setApplications(response.data);
      setFilteredApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
      setFilteredApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApplication = useCallback(async (application) => {
    setSelectedApplication(application);
    setRiskScore(application.riskScore || null);
    setQuestions([]);

    // Set existing review data if application was already reviewed
    setReviewData({
      riskCategory: application.riskCategory || RiskCategory.ACCEPTANCE,
      adminNotes: application.adminNotes || '',
      reviewedBy: application.reviewedBy || 'Admin',
    });

    // Fetch questions for this offering
    try {
      const response = await questionApi.getQuestionsByOfferingId(application.offering.id);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    }

    // Update URL with application ID
    navigate(`/admin/applications?id=${application.id}`, { replace: true });
  }, [navigate]);

  const handleCalculateRisk = async () => {
    if (!selectedApplication) return;

    setLoading(true);
    try {
      const response = await applicationApi.calculateRiskScore(selectedApplication.id);
      setRiskScore(response.data);

      // Auto-suggest category based on risk score
      if (response.data < 30) {
        setReviewData({ ...reviewData, riskCategory: RiskCategory.ACCEPTANCE });
      } else if (response.data < 60) {
        setReviewData({ ...reviewData, riskCategory: RiskCategory.RISK_SURCHARGE_INDICATED });
      } else if (response.data < 80) {
        setReviewData({ ...reviewData, riskCategory: RiskCategory.ADDITIONAL_CLARIFICATION_INDICATED });
      } else {
        setReviewData({ ...reviewData, riskCategory: RiskCategory.REJECTION });
      }
    } catch (error) {
      console.error('Error calculating risk:', error);
      alert('Failed to calculate risk score');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedApplication) return;

    if (!reviewData.reviewedBy.trim()) {
      alert('Please enter reviewer name');
      return;
    }

    if (!window.confirm('Are you sure you want to finalize this review? This action cannot be undone.')) {
      return;
    }

    setReviewing(true);
    try {
      await applicationApi.updateApplicationReview(selectedApplication.id, reviewData);
      alert('Application review submitted successfully!');
      setSelectedApplication(null);
      fetchApplications();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setReviewing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case RiskCategory.ACCEPTANCE:
        return '#10b981';
      case RiskCategory.RISK_SURCHARGE_INDICATED:
        return '#f59e0b';
      case RiskCategory.ADDITIONAL_CLARIFICATION_INDICATED:
        return '#f97316';
      case RiskCategory.REJECTION:
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getSubmissionValue = (questionId) => {
    if (!selectedApplication?.submissions) return '';
    const submission = selectedApplication.submissions.find(s => s.question?.id === questionId);
    return submission?.value || '';
  };

  const getQuestionWeight = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    return question?.weight || 0;
  };

  if (loading && applications.length === 0) {
    return (
      <div className="admin-container">
        <Loading />
      </div>
    );
  }

  return (
    <div className="admin-container review-applications">
      <h1>Review Applications</h1>

      <div className="review-layout">
        {/* Left sidebar - Application list */}
        <div className="applications-sidebar">
          <h2>All Applications ({applications.length})</h2>

          {/* Search bar */}
          <div className="search-bar" style={{ marginBottom: '1rem' }}>
            <Input
              type="text"
              placeholder="Search by name, email, offering, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredApplications.length === 0 ? (
            <Card>
              <p>{searchQuery ? 'No applications found matching your search.' : 'No applications available.'}</p>
            </Card>
          ) : (
            <div className="applications-list">
              {filteredApplications.map((app) => (
                <Card
                  key={app.id}
                  className={`application-item ${selectedApplication?.id === app.id ? 'selected' : ''}`}
                  onClick={() => handleSelectApplication(app)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3>
                        {app.client.firstName} {app.client.lastName}
                      </h3>
                      <p className="app-offering">{app.offering.name}</p>
                      <p className="app-date">{formatDate(app.createdAt)}</p>
                    </div>
                    <div>
                      {app.isReviewed && (
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          fontSize: '0.75rem',
                        }}>
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right panel - Application details */}
        <div className="application-details">
          {!selectedApplication ? (
            <Card className="empty-state">
              <h2>Select an application to review</h2>
              <p>Choose an application from the list to view details and submit your review.</p>
            </Card>
          ) : (
            <>
              {/* Client Information */}
              <Card className="client-info-card">
                <h2>Client Information</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Name:</label>
                    <span>
                      {selectedApplication.client.firstName} {selectedApplication.client.lastName}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{selectedApplication.client.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone:</label>
                    <span>{selectedApplication.client.phoneNumber}</span>
                  </div>
                  <div className="info-item">
                    <label>Birth Date:</label>
                    <span>{formatDate(selectedApplication.client.birthDate)}</span>
                  </div>
                  <div className="info-item">
                    <label>Gender:</label>
                    <span>{selectedApplication.client.gender}</span>
                  </div>
                  <div className="info-item">
                    <label>Address:</label>
                    <span>
                      {selectedApplication.client.address}, {selectedApplication.client.city},{' '}
                      {selectedApplication.client.canton} {selectedApplication.client.zip}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Offering Info */}
              <Card>
                <h2>Offering: {selectedApplication.offering.name}</h2>
                <p>{selectedApplication.offering.description}</p>
              </Card>

              {/* Questionnaire Responses - Form View */}
              <Card>
                <h2>Questionnaire Responses</h2>
                <div className="questionnaire-form">
                  {questions.length > 0 ? (
                    questions.map((question) => {
                      const value = getSubmissionValue(question.id);
                      const weight = getQuestionWeight(question.id);

                      return (
                        <div key={question.id} className="form-field-readonly" style={{ marginBottom: '1.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                            <label style={{ fontWeight: '600', color: '#374151' }}>
                              {question.title}
                              {question.required && <span style={{ color: '#ef4444' }}> *</span>}
                            </label>
                            {weight > 0 && (
                              <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}>
                                Weight: {weight}
                              </span>
                            )}
                          </div>

                          {question.description && (
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                              {question.description}
                            </p>
                          )}

                          {question.type === 'TEXT' && (
                            <input
                              type="text"
                              value={value}
                              disabled
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                backgroundColor: '#f9fafb',
                                color: '#374151',
                              }}
                            />
                          )}

                          {question.type === 'NUMBER' && (
                            <input
                              type="number"
                              value={value}
                              disabled
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                backgroundColor: '#f9fafb',
                                color: '#374151',
                              }}
                            />
                          )}

                          {question.type === 'DATE' && (
                            <input
                              type="date"
                              value={value}
                              disabled
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                backgroundColor: '#f9fafb',
                                color: '#374151',
                              }}
                            />
                          )}

                          {question.type === 'SELECT' && (
                            <select
                              value={value}
                              disabled
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                backgroundColor: '#f9fafb',
                                color: '#374151',
                              }}
                            >
                              <option value="">{value || 'No answer provided'}</option>
                            </select>
                          )}

                          {question.type === 'TAGS' && (
                            <div style={{
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              backgroundColor: '#f9fafb',
                              minHeight: '2.5rem',
                            }}>
                              {value ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                  {value.split(',').map((tag, idx) => (
                                    <span
                                      key={idx}
                                      style={{
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        borderRadius: '9999px',
                                        fontSize: '0.875rem',
                                      }}
                                    >
                                      {tag.trim()}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span style={{ color: '#9ca3af' }}>No tags provided</span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ color: '#6b7280' }}>Loading questionnaire...</p>
                  )}
                </div>
              </Card>

              {/* Risk Assessment */}
              <Card className="risk-assessment-card">
                <h2>Risk Assessment</h2>

                <Button onClick={handleCalculateRisk} variant="secondary" disabled={loading}>
                  {loading ? 'Calculating...' : 'Calculate Risk Score'}
                </Button>

                {riskScore !== null && (
                  <div className="risk-score-display">
                    <h3>Risk Score: {riskScore.toFixed(2)}</h3>
                  </div>
                )}

                <div className="review-form">
                  <Input
                    label="Risk Category"
                    type="select"
                    value={reviewData.riskCategory}
                    onChange={(e) => setReviewData({ ...reviewData, riskCategory: e.target.value })}
                    options={[
                      { value: RiskCategory.ACCEPTANCE, label: 'Acceptance' },
                      { value: RiskCategory.RISK_SURCHARGE_INDICATED, label: 'Risk Surcharge Indicated' },
                      {
                        value: RiskCategory.ADDITIONAL_CLARIFICATION_INDICATED,
                        label: 'Additional Clarification Indicated',
                      },
                      { value: RiskCategory.REJECTION, label: 'Rejection' },
                    ]}
                    required
                  />

                  <div
                    className="category-preview"
                    style={{ backgroundColor: getCategoryColor(reviewData.riskCategory), padding: '10px', borderRadius: '5px', color: 'white', textAlign: 'center', marginBottom: '20px' }}
                  >
                    {reviewData.riskCategory.replace(/_/g, ' ')}
                  </div>

                  <Input
                    label="Admin Notes"
                    type="textarea"
                    value={reviewData.adminNotes}
                    onChange={(e) => setReviewData({ ...reviewData, adminNotes: e.target.value })}
                    placeholder="Add any notes or comments about this application..."
                    rows={4}
                  />

                  <Input
                    label="Reviewed By"
                    value={reviewData.reviewedBy}
                    onChange={(e) => setReviewData({ ...reviewData, reviewedBy: e.target.value })}
                    placeholder="Enter your name"
                    required
                  />

                  <Button
                    onClick={handleSubmitReview}
                    variant="primary"
                    disabled={reviewing}
                    style={{ width: '100%', marginTop: '20px' }}
                  >
                    {reviewing ? 'Submitting...' : 'Finalize Review'}
                  </Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewApplications;
