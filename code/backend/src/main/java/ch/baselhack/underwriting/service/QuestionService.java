package ch.baselhack.underwriting.service;

import ch.baselhack.underwriting.dto.questions.CreateQuestionDTO;
import ch.baselhack.underwriting.dto.questions.GetQuestionDTO;

import java.util.List;
import java.util.UUID;

public interface QuestionService {
    GetQuestionDTO getQuestion(UUID id);

    GetQuestionDTO createQuestion(CreateQuestionDTO getQuestionDTO);

    List<GetQuestionDTO> getQuestions();
}
