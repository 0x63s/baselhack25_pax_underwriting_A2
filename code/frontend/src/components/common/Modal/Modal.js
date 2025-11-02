import React from "react";

export const Modal = () => {
  const [selectedClientData, setSelectedClientData] = useState(null);
  const [clientSubmissions, setClientSubmissions] = useState([]);
  const [offering, setOffering] = useState(null);
  const [weights, setWeights] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Risk assessment
  const [riskScore, setRiskScore] = useState(0);
  const [calculatedWeights, setCalculatedWeights] = useState([]);
  const [aiClassification, setAiClassification] = useState(null);
  const [adminClassification, setAdminClassification] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const classificationOptions = [
    "Acceptance",
    "Risk Surcharge Indicated",
    "Additional Clarification Indicated",
    "Rejection",
  ];

  const handleReviewClient = async (client) => {
    setSelectedClient(client);
    setSelectedClientData(client);
    setLoading(true);

    try {
      // Fetch submissions for this client
      const submissionsResponse = await submissionApi.getSubmissionsByClient(
        client.id
      );
      const clientSubs = submissionsResponse.data;
      setClientSubmissions(clientSubs);

      if (clientSubs.length > 0) {
        // Get offering from first submission
        const firstSubmission = clientSubs[0];
        const offeringId = firstSubmission.question.offering.id;

        const offeringResponse = await offeringApi.getOfferingById(offeringId);
        setOffering(offeringResponse.data);

        // Fetch all questions for this offering
        const questionsResponse = await questionApi.getAllQuestions();
        const offeringQuestions = questionsResponse.data.filter(
          (q) => q.offering.id === offeringId
        );
        setQuestions(offeringQuestions);

        // Fetch weights for all questions
        const weightsData = {};
        for (const question of offeringQuestions) {
          try {
            const weightResponse = await questionWeightsApi.getQuestionWeights(
              question.id
            );
            weightsData[question.id] = weightResponse.data;
          } catch (error) {
            // No weights for this question
            weightsData[question.id] = [];
          }
        }
        setWeights(weightsData);

        // Calculate risk score
        calculateRiskScore(clientSubs, weightsData);

        // Call AI service for classification
        await getAIClassification(client, clientSubs);
      }

      setShowReviewModal(true);
    } catch (error) {
      console.error("Error loading client review:", error);
      alert("Failed to load client review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateRiskScore = (submissions, weightsData) => {
    let totalScore = 0;
    const weightDetails = [];

    submissions.forEach((submission) => {
      const questionId = submission.question.id;
      const answer = submission.value;
      const questionWeights = weightsData[questionId] || [];

      // Find matching weight for this answer
      const matchingWeight = questionWeights.find(
        (w) => w.valueQuestion === answer
      );

      if (matchingWeight) {
        totalScore += matchingWeight.scoreQuestion;
        weightDetails.push({
          question: submission.question.title,
          answer: answer,
          weight: matchingWeight.scoreQuestion,
        });
      }
    });

    setRiskScore(totalScore);
    setCalculatedWeights(weightDetails);
  };

  const getAIClassification = async (client, submissions) => {
    try {
      // Prepare data for AI service
      const applicantData = {
        firstName: client.firstName,
        lastName: client.lastName,
        age: calculateAge(client.birthDate),
        gender: client.gender,
        location: `${client.city}, ${client.canton}`,
      };

      const riskFactors = {};
      submissions.forEach((sub) => {
        riskFactors[sub.question.title] = sub.value;
      });

      // Call AI service (backend-ai on port 8001)
      const response = await axios.post("http://localhost:8001/api/analyze", {
        application_id: client.id.toString(),
        applicant_data: applicantData,
        risk_factors: riskFactors,
      });

      setAiClassification(response.data);

      // Map AI recommendation to classification
      const recommendation = response.data.recommendation;
      if (recommendation === "APPROVE") {
        setAdminClassification("Acceptance");
      } else if (recommendation === "REVIEW") {
        setAdminClassification("Additional Clarification Indicated");
      } else if (recommendation === "REJECT") {
        setAdminClassification("Rejection");
      } else {
        setAdminClassification("Risk Surcharge Indicated");
      }
    } catch (error) {
      console.error("Error getting AI classification:", error);
      // Set default classification if AI fails
      if (riskScore < 1.0) {
        setAdminClassification("Acceptance");
      } else if (riskScore < 2.0) {
        setAdminClassification("Risk Surcharge Indicated");
      } else if (riskScore < 3.0) {
        setAdminClassification("Additional Clarification Indicated");
      } else {
        setAdminClassification("Rejection");
      }
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleFinalizeReview = () => {
    // TODO: Save review to backend when model exists
    alert(
      `Review finalized!\nClassification: ${adminClassification}\nNotes: ${
        adminNotes || "None"
      }`
    );
    setShowReviewModal(false);
    setSelectedClient(null);
    setAdminNotes("");
  };

  const columns = [
    { key: "id", label: "Client ID" },
    {
      key: "name",
      label: "Name",
      render: (row) => `${row.firstName} ${row.lastName}`,
    },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone" },
    {
      key: "birthDate",
      label: "Birth Date",
      render: (row) => new Date(row.birthDate).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Button variant="primary" onClick={() => handleReviewClient(row)}>
          Review Application
        </Button>
      ),
    },
  ];

  return (
    <Modal
      isOpen={showReviewModal}
      onClose={() => setShowReviewModal(false)}
      title={`Review Application - ${selectedClientData?.firstName} ${selectedClientData?.lastName}`}
      large
    >
      {loading ? (
        <Loading />
      ) : (
        <div className="review-modal-content">
          {/* Client Information */}
          <div className="review-section">
            <h3>Personal Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Name:</strong> {selectedClientData?.firstName}{" "}
                {selectedClientData?.lastName}
              </div>
              <div className="info-item">
                <strong>Email:</strong> {selectedClientData?.email}
              </div>
              <div className="info-item">
                <strong>Phone:</strong> {selectedClientData?.phoneNumber}
              </div>
              <div className="info-item">
                <strong>Birth Date:</strong>{" "}
                {selectedClientData?.birthDate
                  ? new Date(selectedClientData.birthDate).toLocaleDateString()
                  : "N/A"}{" "}
                (
                {selectedClientData?.birthDate
                  ? calculateAge(selectedClientData.birthDate)
                  : "N/A"}{" "}
                years old)
              </div>
              <div className="info-item">
                <strong>Gender:</strong> {selectedClientData?.gender}
              </div>
              <div className="info-item">
                <strong>Address:</strong> {selectedClientData?.address},{" "}
                {selectedClientData?.city} {selectedClientData?.zip},{" "}
                {selectedClientData?.canton}
              </div>
            </div>
          </div>

          {/* Offering Information */}
          {offering && (
            <div className="review-section">
              <h3>Insurance Offering</h3>
              <div className="offering-info">
                <strong>{offering.name}</strong>
                <p>{offering.description}</p>
              </div>
            </div>
          )}

          {/* Question Answers */}
          <div className="review-section">
            <h3>Questionnaire Answers</h3>
            <div className="answers-list">
              {clientSubmissions.map((submission) => (
                <div key={submission.id} className="answer-item">
                  <div className="question-title">
                    {submission.question.title}
                  </div>
                  <div className="answer-value">{submission.value}</div>
                  {weights[submission.question.id]?.find(
                    (w) => w.valueQuestion === submission.value
                  ) && (
                    <div className="answer-weight">
                      Weight:{" "}
                      {
                        weights[submission.question.id].find(
                          (w) => w.valueQuestion === submission.value
                        ).scoreQuestion
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="review-section">
            <h3>Risk Assessment</h3>
            <div className="risk-assessment">
              <div className="risk-score">
                <strong>Total Risk Score:</strong>
                <span
                  className={`score ${
                    riskScore < 1.0
                      ? "low"
                      : riskScore < 2.0
                      ? "medium"
                      : "high"
                  }`}
                >
                  {riskScore.toFixed(2)}
                </span>
              </div>
              {calculatedWeights.length > 0 && (
                <div className="weight-breakdown">
                  <h4>Weight Breakdown:</h4>
                  {calculatedWeights.map((item, index) => (
                    <div key={index} className="weight-item">
                      <span>
                        {item.question}: {item.answer}
                      </span>
                      <span className="weight-value">
                        {item.weight > 0 ? "+" : ""}
                        {item.weight}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Classification */}
          {aiClassification && (
            <div className="review-section">
              <h3>AI Analysis</h3>
              <div className="ai-analysis">
                <div className="ai-recommendation">
                  <strong>Recommendation:</strong>{" "}
                  {aiClassification.recommendation}
                </div>
                <div className="ai-confidence">
                  <strong>Confidence:</strong>{" "}
                  {(aiClassification.confidence * 100).toFixed(1)}%
                </div>
                {aiClassification.analysis && (
                  <div className="ai-findings">
                    <strong>Key Findings:</strong>{" "}
                    {aiClassification.analysis.key_findings}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admin Decision */}
          <div className="review-section">
            <h3>Underwriter Decision</h3>
            <Input
              label="Classification"
              type="select"
              value={adminClassification}
              onChange={(e) => setAdminClassification(e.target.value)}
              options={classificationOptions.map((opt) => ({
                value: opt,
                label: opt,
              }))}
              required
            />
            <Input
              label="Notes"
              type="textarea"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add any notes or comments about this application..."
            />
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => setShowReviewModal(false)}
            >
              Cancel
            </Button>
            <Button variant="success" onClick={handleFinalizeReview}>
              Finalize Review
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
