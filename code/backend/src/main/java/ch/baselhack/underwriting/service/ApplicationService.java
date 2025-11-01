package ch.baselhack.underwriting.service;

import ch.baselhack.underwriting.dto.applications.CreateApplicationDTO;
import ch.baselhack.underwriting.dto.applications.GetApplicationDTO;
import ch.baselhack.underwriting.dto.applications.UpdateApplicationReviewDTO;

import java.util.List;

public interface ApplicationService {
    GetApplicationDTO createApplication(CreateApplicationDTO createApplicationDTO);

    GetApplicationDTO getApplicationById(Long id);

    List<GetApplicationDTO> getAllApplications();

    List<GetApplicationDTO> getUnreviewedApplications();

    List<GetApplicationDTO> getApplicationsByClientId(Long clientId);

    GetApplicationDTO updateApplicationReview(Long id, UpdateApplicationReviewDTO updateApplicationReviewDTO);

    Double calculateRiskScore(Long applicationId);
}
