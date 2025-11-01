package ch.baselhack.underwriting.service;

import ch.baselhack.underwriting.dto.questions.*;

import java.util.List;

public interface QuestionWeightsService {

    GetQuestionWeightsDTO getQuestionWeights(Long questionId);

    GetQuestionWeightsDTO createQuestionWeights(CreateQuestionWeightsDTO createQuestionWeightsDTO);

    GetQuestionWeightsDTO updateQuestionWeights(Long id, UpdateQuestionWeightsDTO updateQuestionWeightsDTO);
}
