package ch.baselhack.underwriting.dto.questions;

import ch.baselhack.underwriting.model.enums.QuestionType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateQuestionDTO {
    @NotNull
    private String title;

    @NotNull
    private UUID offering_id;

    private String description;

    @NotNull
    @Enumerated(value = EnumType.STRING)
    private QuestionType type;

    private String typeOptions;
}
