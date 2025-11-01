package ch.baselhack.underwriting.dto.applications;

import ch.baselhack.underwriting.model.enums.RiskCategory;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateApplicationReviewDTO {
    @NotNull
    private RiskCategory riskCategory;

    private String adminNotes;

    @NotNull
    private String reviewedBy;
}
