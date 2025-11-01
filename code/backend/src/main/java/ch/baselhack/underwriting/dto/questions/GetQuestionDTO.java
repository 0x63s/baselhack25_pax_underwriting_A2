package ch.baselhack.underwriting.dto.questions;

import ch.baselhack.underwriting.model.Offering;
import ch.baselhack.underwriting.model.enums.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetQuestionDTO {
    private UUID id;
    private Offering offering;
    private String title;
    private String description;
    private QuestionType type;
    private String typeOptions;
}
