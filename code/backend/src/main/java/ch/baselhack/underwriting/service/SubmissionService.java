package ch.baselhack.underwriting.service;

import ch.baselhack.underwriting.dto.questions.CreateQuestionDTO;
import ch.baselhack.underwriting.dto.questions.GetQuestionDTO;
import ch.baselhack.underwriting.dto.submissions.CreateSubmissionDTO;
import ch.baselhack.underwriting.dto.submissions.GetSubmissionDTO;

import java.util.List;
import java.util.UUID;

public interface SubmissionService {
    GetSubmissionDTO getSubmission(UUID questionId);

    List<GetSubmissionDTO> getSubmissionsByClient(UUID clientId);

    List<GetSubmissionDTO> createSubmission(List<CreateSubmissionDTO> createSubmissionDTO);
}
