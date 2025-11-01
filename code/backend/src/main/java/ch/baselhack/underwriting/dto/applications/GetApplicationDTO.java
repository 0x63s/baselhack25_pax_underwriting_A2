package ch.baselhack.underwriting.dto.applications;

import ch.baselhack.underwriting.dto.clients.GetClientDTO;
import ch.baselhack.underwriting.dto.offerings.GetOfferingDTO;
import ch.baselhack.underwriting.dto.submissions.GetSubmissionDTO;
import ch.baselhack.underwriting.model.enums.RiskCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetApplicationDTO {
    private Long id;
    private GetClientDTO client;
    private GetOfferingDTO offering;
    private List<GetSubmissionDTO> submissions;
    private Double riskScore;
    private RiskCategory riskCategory;
    private String adminNotes;
    private String reviewedBy;
    private LocalDateTime reviewedAt;
    private Boolean isReviewed;
    private LocalDateTime createdAt;
}
