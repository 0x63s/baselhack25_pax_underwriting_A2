package ch.baselhack.underwriting.service.impl;

import ch.baselhack.underwriting.dto.questions.CreateQuestionDTO;
import ch.baselhack.underwriting.dto.questions.GetQuestionDTO;
import ch.baselhack.underwriting.exception.offerings.OfferingNotFoundException;
import ch.baselhack.underwriting.exception.questions.NoQuestionsFoundException;
import ch.baselhack.underwriting.exception.questions.QuestionAlreadyExistsException;
import ch.baselhack.underwriting.exception.questions.QuestionNotFoundException;
import ch.baselhack.underwriting.model.Question;
import ch.baselhack.underwriting.repository.OfferingRepository;
import ch.baselhack.underwriting.repository.QuestionRepository;
import ch.baselhack.underwriting.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {
    private final QuestionRepository questionRepository;
    private final OfferingRepository offeringRepository;
    private final ModelMapper modelMapper;


    @Override
    public GetQuestionDTO getQuestion(UUID id) {
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
        return modelMapper.map(questionRepository.save(modelMapper.map(question, Question.class)), GetQuestionDTO.class);
    }

    @Override
    public List<GetQuestionDTO> getQuestions() {
        List<Question> questions = questionRepository.findAll();

        Type listType = new TypeToken<List<GetQuestionDTO>>() {}.getType();
        return modelMapper.map(questions, listType);
    }
}
