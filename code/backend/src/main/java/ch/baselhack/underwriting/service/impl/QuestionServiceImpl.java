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
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {
    private final QuestionRepository questionRepository;
    private final QuestionWeightsRepository questionWeightsRepository;
    private final OfferingRepository offeringRepository;
    private final ModelMapper modelMapper;

    private Question updateQuestion(Question question, CreateQuestionDTO questionDto) {
        question.setTitle(questionDto.getTitle());
        question.setDescription(questionDto.getDescription());
        question.setType(questionDto.getType());
        question.setTypeOptions(questionDto.getTypeOptions());
        question.setOffering(modelMapper.map(offeringRepository.findById(questionDto.getOffering_id()), Offering.class));

        return question;
    }

    private Question updateQuestion(Question question, UpdateQuestionDTO questionDto) {
        question.setTitle(questionDto.getTitle());
        question.setDescription(questionDto.getDescription());
        question.setType(questionDto.getType());
        question.setTypeOptions(questionDto.getTypeOptions());
        question.setOffering(modelMapper.map(offeringRepository.findById(questionDto.getOffering_id()), Offering.class));

        return question;
    }

    private QuestionWeights buildQuestion(QuestionWeights questionWeights, CreateQuestionWeightsDTO questionWeightsDTO) {
        questionWeights.setWeights(questionWeightsDTO.getWeights());
        questionWeights.setQuestion(modelMapper.map(questionRepository.findById(questionWeightsDTO.getQuestionId()), Question.class));

        return questionWeights;
    }


    @Override
    public GetQuestionDTO getQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new QuestionNotFoundException(id);
        }
        return modelMapper.map(questionRepository.findById(id).get(), GetQuestionDTO.class);
    }

    @Override
    public GetQuestionDTO createQuestion(CreateQuestionDTO question) {
        if (questionRepository.existsByOfferingIdAndTitle(question.getOffering_id(), question.getTitle())) {
            throw new QuestionAlreadyExistsException();
        }
        if (!offeringRepository.existsById(question.getOffering_id())) {
            throw new OfferingNotFoundException(question.getOffering_id());
        }

        return modelMapper.map(questionRepository.save(updateQuestion(new Question(), question)), GetQuestionDTO.class);
    }

    @Override
    public List<GetQuestionDTO> getQuestions() {
        List<Question> questions = questionRepository.findAll();

        Type listType = new TypeToken<List<GetQuestionDTO>>() {}.getType();
        return modelMapper.map(questions, listType);
    }

    @Override
    public List<GetQuestionDTO> getQuestionsByOfferingId(Long offeringId) {
        if (!offeringRepository.existsById(offeringId)) {
            throw new OfferingNotFoundException(offeringId);
        }
        List<Question> questions = questionRepository.findByOfferingId(offeringId);
        Type listType = new TypeToken<List<GetQuestionDTO>>() {}.getType();
        return modelMapper.map(questions, listType);
    }

    @Override
    public GetQuestionDTO updateQuestion(Long id, UpdateQuestionDTO questionDTO) {
        Question question = questionRepository.findById(id)
            .orElseThrow(() -> new QuestionNotFoundException(id));

        if (!offeringRepository.existsById(questionDTO.getOffering_id())) {
            throw new OfferingNotFoundException(questionDTO.getOffering_id());
        }

        question = updateQuestion(question, questionDTO);
        return modelMapper.map(questionRepository.save(question), GetQuestionDTO.class);
    }

    @Override
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new QuestionNotFoundException(id);
        }
        questionRepository.deleteById(id);
    }
}
