package ch.baselhack.underwriting.service;

import ch.baselhack.underwriting.dto.questions.CreateQuestionDTO;
import ch.baselhack.underwriting.dto.questions.GetQuestionDTO;

import java.util.List;

public interface QuestionService {
    GetQuestionDTO getQuestion(Long id);

    GetQuestionDTO createQuestion(CreateQuestionDTO getQuestionDTO);

    List<GetQuestionDTO> getQuestions();
}
