package ch.baselhack.underwriting.service;

import ch.baselhack.underwriting.dto.questions.CreateQuestionDTO;
import ch.baselhack.underwriting.dto.questions.GetQuestionDTO;
import ch.baselhack.underwriting.dto.submissions.CreateSubmissionDTO;
import ch.baselhack.underwriting.dto.submissions.GetSubmissionDTO;

import java.util.List;

public interface SubmissionService {
    GetSubmissionDTO getSubmission(Long questionId);

    List<GetSubmissionDTO> getSubmissionsByClient(Long clientId);

    List<GetSubmissionDTO> createSubmission(List<CreateSubmissionDTO> createSubmissionDTO);
}
