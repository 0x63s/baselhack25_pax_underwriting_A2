package ch.baselhack.underwriting.service.impl;

import ch.baselhack.underwriting.dto.applications.CreateApplicationDTO;
import ch.baselhack.underwriting.dto.applications.GetApplicationDTO;
import ch.baselhack.underwriting.dto.applications.UpdateApplicationReviewDTO;
import ch.baselhack.underwriting.exception.clients.ClientNotFoundExceptions;
import ch.baselhack.underwriting.exception.offerings.OfferingNotFoundException;
import ch.baselhack.underwriting.model.Application;
import ch.baselhack.underwriting.model.Client;
import ch.baselhack.underwriting.model.Offering;
import ch.baselhack.underwriting.model.QuestionWeights;
import ch.baselhack.underwriting.model.Submission;
import ch.baselhack.underwriting.repository.ApplicationRepository;
import ch.baselhack.underwriting.repository.ClientRepository;
import ch.baselhack.underwriting.repository.OfferingRepository;
import ch.baselhack.underwriting.repository.QuestionWeightsRepository;
import ch.baselhack.underwriting.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final ClientRepository clientRepository;
    private final OfferingRepository offeringRepository;
    private final QuestionWeightsRepository questionWeightsRepository;
    private final ModelMapper modelMapper;

    @Override
    public GetApplicationDTO createApplication(CreateApplicationDTO createApplicationDTO) {
        Client client = clientRepository.findById(createApplicationDTO.getClientId())
            .orElseThrow(() -> new ClientNotFoundExceptions(createApplicationDTO.getClientId()));

        Offering offering = offeringRepository.findById(createApplicationDTO.getOfferingId())
            .orElseThrow(() -> new OfferingNotFoundException(createApplicationDTO.getOfferingId()));

        Application application = new Application();
        application.setClient(client);
        application.setOffering(offering);
        application.setIsReviewed(false);
        application.setCreatedAt(LocalDateTime.now());

        Application savedApplication = applicationRepository.save(application);
        return modelMapper.map(savedApplication, GetApplicationDTO.class);
    }

    @Override
    public GetApplicationDTO getApplicationById(Long id) {
        Application application = applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
        return modelMapper.map(application, GetApplicationDTO.class);
    }

    @Override
    public List<GetApplicationDTO> getAllApplications() {
        List<Application> applications = applicationRepository.findAll();
        Type listType = new TypeToken<List<GetApplicationDTO>>() {}.getType();
        return modelMapper.map(applications, listType);
    }

    @Override
    public List<GetApplicationDTO> getUnreviewedApplications() {
        List<Application> applications = applicationRepository.findByIsReviewed(false);
        Type listType = new TypeToken<List<GetApplicationDTO>>() {}.getType();
        return modelMapper.map(applications, listType);
    }

    @Override
    public List<GetApplicationDTO> getApplicationsByClientId(Long clientId) {
        List<Application> applications = applicationRepository.findByClientId(clientId);
        Type listType = new TypeToken<List<GetApplicationDTO>>() {}.getType();
        return modelMapper.map(applications, listType);
    }

    @Override
    public GetApplicationDTO updateApplicationReview(Long id, UpdateApplicationReviewDTO updateApplicationReviewDTO) {
        Application application = applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));

        application.setRiskCategory(updateApplicationReviewDTO.getRiskCategory());
        application.setAdminNotes(updateApplicationReviewDTO.getAdminNotes());
        application.setReviewedBy(updateApplicationReviewDTO.getReviewedBy());
        application.setReviewedAt(LocalDateTime.now());
        application.setIsReviewed(true);

        Application savedApplication = applicationRepository.save(application);
        return modelMapper.map(savedApplication, GetApplicationDTO.class);
    }

    @Override
    public Double calculateRiskScore(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

        double totalScore = 0.0;
        int weightCount = 0;

        for (Submission submission : application.getSubmissions()) {
            if (submission.getQuestion() != null) {
                QuestionWeights weights = questionWeightsRepository.findByQuestionId(submission.getQuestion().getId())
                    .orElse(null);

                if (weights != null && weights.getWeights() != null) {
                    // Simple scoring: parse weights and calculate based on answer
                    try {
                        String weightStr = weights.getWeights();
                        // Basic implementation - admin can customize this logic
                        double weight = Double.parseDouble(weightStr);
                        totalScore += weight;
                        weightCount++;
                    } catch (NumberFormatException e) {
                        // Skip if weights format is invalid
                    }
                }
            }
        }

        double riskScore = weightCount > 0 ? totalScore / weightCount : 0.0;
        application.setRiskScore(riskScore);
        applicationRepository.save(application);

        return riskScore;
    }
}
