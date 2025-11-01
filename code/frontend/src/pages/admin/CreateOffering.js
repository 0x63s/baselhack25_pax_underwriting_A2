import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { offeringApi, questionApi, questionWeightsApi } from '../../services/api';
import { QuestionType, QuestionTypeLabels } from '../../constants/types';
import './CreateOffering.css';

const CreateOffering = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [offeringData, setOfferingData] = useState({
    name: '',
    description: '',
  });

  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        title: '',
        description: '',
        type: QuestionType.TEXT,
        typeOptions: '',
        tagMode: 'MULTIPLE', // For TAGS type: SINGLE or MULTIPLE
        weights: [],
      },
    ]);
  };

  const removeQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const updateQuestion = (questionId, field, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    );
  };

  const addWeight = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              weights: [
                ...q.weights,
                { id: Date.now(), valueQuestion: '', scoreQuestion: '' },
              ],
            }
          : q
      )
    );
  };

  const removeWeight = (questionId, weightId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              weights: q.weights.filter((w) => w.id !== weightId),
            }
          : q
      )
    );
  };

  const updateWeight = (questionId, weightId, field, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              weights: q.weights.map((w) =>
                w.id === weightId ? { ...w, [field]: value } : w
              ),
            }
          : q
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Step 1: Create the offering
      const offeringResponse = await offeringApi.createOffering(offeringData);
      const offeringId = offeringResponse.data.id;

      // Step 2: Create all questions
      for (const question of questions) {
        // For TAGS type, prepend the mode (SINGLE or MULTIPLE)
        let typeOptions = question.typeOptions;
        if (question.type === QuestionType.TAGS && question.tagMode) {
          typeOptions = `${question.tagMode}:${question.typeOptions}`;
        }

        const questionPayload = {
          title: question.title,
          description: question.description,
          offering_id: offeringId,
          type: question.type,
          typeOptions: typeOptions,
        };

        const questionResponse = await questionApi.createQuestion(questionPayload);
        const questionId = questionResponse.data.id;

        // Step 3: Create weights for this question
        for (const weight of question.weights) {
          if (weight.valueQuestion && weight.scoreQuestion) {
            await questionWeightsApi.createQuestionWeights({
              questionId: questionId,
              offeringId: offeringId,
              valueQuestion: weight.valueQuestion,
              scoreQuestion: parseFloat(weight.scoreQuestion),
            });
          }
        }
      }

      alert('Offering created successfully with all questions and weights!');
      navigate('/admin/offerings');
    } catch (error) {
      console.error('Error creating offering:', error);
      alert('Failed to create offering. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const needsOptions = (type) => {
    return [
      QuestionType.RADIO_BUTTON,
      QuestionType.CHECKBOX,
      QuestionType.DROPDOWN,
    ].includes(type);
  };

  return (
    <div className="create-offering-page">
      <div className="page-header">
        <div>
          <Button variant="secondary" onClick={() => navigate('/admin/offerings')}>
            ← Back to Offerings
          </Button>
          <h1>Create New Offering with Questions</h1>
          <p className="subtitle">Build your insurance offering with a complete questionnaire</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card title="Offering Information">
          <Input
            label="Offering Name"
            name="name"
            value={offeringData.name}
            onChange={(e) =>
              setOfferingData({ ...offeringData, name: e.target.value })
            }
            required
            placeholder="e.g., Life Insurance, Health Insurance"
          />
          <Input
            label="Description"
            name="description"
            type="textarea"
            value={offeringData.description}
            onChange={(e) =>
              setOfferingData({ ...offeringData, description: e.target.value })
            }
            placeholder="Describe this offering..."
          />
        </Card>

        <Card
          title="Questions"
          actions={
            <Button type="button" variant="success" onClick={addQuestion}>
              + Add Question
            </Button>
          }
        >
          {questions.length === 0 ? (
            <p className="no-questions">
              No questions added yet. Click "Add Question" to start building your
              questionnaire.
            </p>
          ) : (
            <div className="questions-list">
              {questions.map((question, index) => (
                <div key={question.id} className="question-builder">
                  <div className="question-header">
                    <h3>Question {index + 1}</h3>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => removeQuestion(question.id)}
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="question-fields">
                    <Input
                      label="Question Title"
                      value={question.title}
                      onChange={(e) =>
                        updateQuestion(question.id, 'title', e.target.value)
                      }
                      required
                      placeholder="Enter your question"
                    />

                    <Input
                      label="Description"
                      type="textarea"
                      value={question.description}
                      onChange={(e) =>
                        updateQuestion(question.id, 'description', e.target.value)
                      }
                      placeholder="Additional information (optional)"
                    />

                    <Input
                      label="Question Type"
                      type="select"
                      value={question.type}
                      onChange={(e) =>
                        updateQuestion(question.id, 'type', e.target.value)
                      }
                      required
                      options={Object.keys(QuestionType).map((key) => ({
                        value: QuestionType[key],
                        label: QuestionTypeLabels[QuestionType[key]],
                      }))}
                    />

                    {needsOptions(question.type) && (
                      <Input
                        label="Options (comma-separated)"
                        value={question.typeOptions}
                        onChange={(e) =>
                          updateQuestion(question.id, 'typeOptions', e.target.value)
                        }
                        placeholder="e.g., Yes,No,Maybe"
                        required
                      />
                    )}

                    {question.type === QuestionType.TAGS && (
                      <>
                        <Input
                          label="Tag Selection Mode"
                          type="select"
                          value={question.tagMode || 'MULTIPLE'}
                          onChange={(e) =>
                            updateQuestion(question.id, 'tagMode', e.target.value)
                          }
                          required
                          options={[
                            { value: 'SINGLE', label: 'Single Selection (user picks one tag)' },
                            { value: 'MULTIPLE', label: 'Multiple Selection (user picks many tags)' },
                          ]}
                        />
                        <Input
                          label="Available Tags (comma-separated)"
                          value={question.typeOptions}
                          onChange={(e) =>
                            updateQuestion(question.id, 'typeOptions', e.target.value)
                          }
                          placeholder="e.g., Swimming,Running,Cycling,Extreme Sports"
                          required
                        />
                        <div className="help-text">
                          Users will see these tags as clickable chips to select from
                        </div>
                      </>
                    )}
                  </div>

                  <div className="weights-section">
                    <div className="weights-header">
                      <h4>Answer Weights (for scoring)</h4>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => addWeight(question.id)}
                      >
                        + Add Weight
                      </Button>
                    </div>

                    {question.weights.length === 0 ? (
                      <p className="no-weights">
                        No weights defined. Weights are optional for scoring answers.
                      </p>
                    ) : (
                      <div className="weights-list">
                        {question.weights.map((weight) => (
                          <div key={weight.id} className="weight-row">
                            <Input
                              label="Answer/Value"
                              value={weight.valueQuestion}
                              onChange={(e) =>
                                updateWeight(
                                  question.id,
                                  weight.id,
                                  'valueQuestion',
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Yes, No, 25-35"
                            />
                            <Input
                              label="Score"
                              type="number"
                              value={weight.scoreQuestion}
                              onChange={(e) =>
                                updateWeight(
                                  question.id,
                                  weight.id,
                                  'scoreQuestion',
                                  e.target.value
                                )
                              }
                              placeholder="e.g., 1.5, -2.0"
                            />
                            <Button
                              type="button"
                              variant="danger"
                              onClick={() => removeWeight(question.id, weight.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/offerings')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Offering with Questions'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateOffering;
