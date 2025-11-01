package ch.baselhack.underwriting.dto.submissions;

import ch.baselhack.underwriting.model.Client;
import ch.baselhack.underwriting.model.Question;
import ch.baselhack.underwriting.model.enums.SubmissionValueType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateSubmissionDTO {
    @NotNull
    Long clientId;

    @NotNull
    Long questionId;

    @NotNull
    private String value;

    @Enumerated(EnumType.STRING)
    @NotNull
    private SubmissionValueType type;
}
