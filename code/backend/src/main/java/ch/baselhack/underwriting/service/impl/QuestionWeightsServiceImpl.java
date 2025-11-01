package ch.baselhack.underwriting.service.impl;

import ch.baselhack.underwriting.dto.questions.*;
import ch.baselhack.underwriting.exception.offerings.OfferingNotFoundException;
import ch.baselhack.underwriting.exception.questions.QuestionAlreadyExistsException;
import ch.baselhack.underwriting.exception.questions.QuestionNotFoundException;
import ch.baselhack.underwriting.exception.questions.QuestionWeightsAlreadyExistsException;
import ch.baselhack.underwriting.exception.questions.QuestionWeightsNotFoundException;
import ch.baselhack.underwriting.model.Offering;
import ch.baselhack.underwriting.model.Question;
import ch.baselhack.underwriting.model.QuestionWeights;
import ch.baselhack.underwriting.repository.OfferingRepository;
import ch.baselhack.underwriting.repository.QuestionRepository;
import ch.baselhack.underwriting.repository.QuestionWeightsRepository;
import ch.baselhack.underwriting.service.QuestionService;
import ch.baselhack.underwriting.service.QuestionWeightsService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionWeightsServiceImpl implements QuestionWeightsService {
    private final QuestionRepository questionRepository;
    private final QuestionWeightsRepository questionWeightsRepository;
    private final ModelMapper modelMapper;

    private QuestionWeights buildQuestion(QuestionWeights questionWeights, CreateQuestionWeightsDTO questionWeightsDTO) {
        questionWeights.setWeights(questionWeightsDTO.getWeights());
        questionWeights.setQuestion(modelMapper.map(questionRepository.findById(questionWeightsDTO.getQuestionId()), Question.class));

        return questionWeights;
    }

    @Override
    public GetQuestionWeightsDTO getQuestionWeights(Long questionId) {
        if (!questionRepository.existsById(questionId)) {
            throw new QuestionNotFoundException(questionId);
        }

        if (questionWeightsRepository.findByQuestionId(questionId).isEmpty()) {
            throw new QuestionWeightsNotFoundException(questionId);
        }

        return modelMapper.map(questionWeightsRepository.findByQuestionId(questionId).get(), GetQuestionWeightsDTO.class);

    }

    @Override
    public GetQuestionWeightsDTO createQuestionWeights(CreateQuestionWeightsDTO createQuestionWeightsDTO) {
        if (questionWeightsRepository.findByQuestionId(createQuestionWeightsDTO.getQuestionId()).isPresent()) {
            throw new QuestionWeightsAlreadyExistsException(createQuestionWeightsDTO.getQuestionId());
        }

        return modelMapper.map(questionWeightsRepository.save(buildQuestion(new QuestionWeights(), createQuestionWeightsDTO)), GetQuestionWeightsDTO.class);
    }

    @Override
    public GetQuestionWeightsDTO updateQuestionWeights(Long questionId, UpdateQuestionWeightsDTO updateQuestionWeightsDTO) {
        QuestionWeights questionWeights = questionWeightsRepository.findByQuestionId(questionId).get();

        questionWeights.setWeights(updateQuestionWeightsDTO.getWeights());
        QuestionWeights updatedQuestionWeights = questionWeightsRepository.save(questionWeights);

        return modelMapper.map(updatedQuestionWeights, GetQuestionWeightsDTO.class);
    }
}
