package ch.baselhack.underwriting.service;

import ch.baselhack.underwriting.dto.questions.*;

import java.util.List;

public interface QuestionService {
    GetQuestionDTO getQuestion(Long id);

    GetQuestionDTO createQuestion(CreateQuestionDTO getQuestionDTO);

    List<GetQuestionDTO> getQuestions();

    List<GetQuestionDTO> getQuestionsByOfferingId(Long offeringId);

    GetQuestionDTO updateQuestion(Long id, UpdateQuestionDTO updateQuestionDTO);

    void deleteQuestion(Long id);
}
