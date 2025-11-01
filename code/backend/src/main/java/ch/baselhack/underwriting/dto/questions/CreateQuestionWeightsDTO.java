package ch.baselhack.underwriting.dto.questions;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateQuestionWeightsDTO {
    @NotNull
    private Long questionId;

    @NotNull
    private String weights;

    private double parameterWeight;
}
