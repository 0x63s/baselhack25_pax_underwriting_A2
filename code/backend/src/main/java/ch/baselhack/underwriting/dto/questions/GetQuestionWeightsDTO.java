package ch.baselhack.underwriting.dto.questions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetQuestionWeightsDTO {
    private Long id;
    private Long questionId;
    private String weights;
    private double parameterWeight;
}
