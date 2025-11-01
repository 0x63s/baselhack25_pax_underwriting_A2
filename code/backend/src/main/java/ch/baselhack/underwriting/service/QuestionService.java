package ch.baselhack.underwriting.service;

import ch.baselhack.underwriting.dto.questions.*;

import java.util.List;

public interface QuestionService {
    GetQuestionDTO getQuestion(Long id);

    GetQuestionDTO createQuestion(CreateQuestionDTO getQuestionDTO);

    List<GetQuestionDTO> getQuestions();

}
