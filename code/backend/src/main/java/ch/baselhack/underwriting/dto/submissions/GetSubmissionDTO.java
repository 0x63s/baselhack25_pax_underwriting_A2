package ch.baselhack.underwriting.dto.submissions;

import ch.baselhack.underwriting.model.Client;
import ch.baselhack.underwriting.model.Question;
import ch.baselhack.underwriting.model.enums.SubmissionValueType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetSubmissionDTO {
    private Long id;
    Client client;
    Question question;
    private String value;
    private SubmissionValueType type;
}
