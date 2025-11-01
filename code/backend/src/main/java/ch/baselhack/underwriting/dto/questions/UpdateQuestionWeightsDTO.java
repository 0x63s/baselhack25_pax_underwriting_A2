package ch.baselhack.underwriting.dto.questions;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateQuestionWeightsDTO {
    private Long id;

    @NotNull
    private String weights;
}
