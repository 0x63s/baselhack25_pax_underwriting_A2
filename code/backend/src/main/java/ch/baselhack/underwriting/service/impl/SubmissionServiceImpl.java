package ch.baselhack.underwriting.service.impl;

import ch.baselhack.underwriting.dto.offerings.GetOfferingDTO;
import ch.baselhack.underwriting.dto.questions.CreateQuestionDTO;
import ch.baselhack.underwriting.dto.questions.GetQuestionDTO;
import ch.baselhack.underwriting.dto.submissions.CreateSubmissionDTO;
import ch.baselhack.underwriting.dto.submissions.GetSubmissionDTO;
import ch.baselhack.underwriting.exception.clients.ClientNotFoundExceptions;
import ch.baselhack.underwriting.exception.submissions.SubmissionAlreadyExistsException;
import ch.baselhack.underwriting.exception.submissions.SubmissionNotFoundException;
import ch.baselhack.underwriting.exception.submissions.SubmissionsByClientNotFoundException;
import ch.baselhack.underwriting.model.Client;
import ch.baselhack.underwriting.model.Question;
import ch.baselhack.underwriting.model.Submission;
import ch.baselhack.underwriting.repository.ClientRepository;
import ch.baselhack.underwriting.repository.QuestionRepository;
import ch.baselhack.underwriting.repository.SubmissionRepository;
import ch.baselhack.underwriting.service.QuestionService;
import ch.baselhack.underwriting.service.SubmissionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class SubmissionServiceImpl implements SubmissionService {

    private final QuestionRepository questionRepository;
    private final ClientRepository clientRepository;
    private final SubmissionRepository submissionRepository;
    private final ModelMapper modelMapper;

    private Submission updateSubmission(Submission submission, CreateSubmissionDTO createSubmissionDTO) {
        submission.setType(createSubmissionDTO.getType());
        submission.setValue(createSubmissionDTO.getValue());
        submission.setQuestion(modelMapper.map(questionRepository.findById(createSubmissionDTO.getQuestionId()), Question.class));
        submission.setClient(modelMapper.map(clientRepository.findById(createSubmissionDTO.getClientId()), Client.class));

        return submission;
    }

    @Override
    public GetSubmissionDTO getSubmission(Long submissionId) {
        if (!submissionRepository.existsById(submissionId)) {
            throw new SubmissionNotFoundException(submissionId);
        }
        return modelMapper.map(submissionRepository.findById(submissionId), GetSubmissionDTO.class);
    }

    @Override
    public List<GetSubmissionDTO> getSubmissionsByClient(Long clientId) {
        if (!clientRepository.existsById(clientId)) {
            throw new ClientNotFoundExceptions(clientId);
        }
        List<Submission> submissions = submissionRepository.findAllByClientId(clientId);
        if (submissions.isEmpty()) {
            throw new SubmissionsByClientNotFoundException(clientId);
        }

        Type listType = new TypeToken<List<GetSubmissionDTO>>() {}.getType();
        return modelMapper.map(submissions, listType);
    }

    @Override
    @Transactional
    public List<GetSubmissionDTO> createSubmission(List<CreateSubmissionDTO> submissionFields) {
        List<GetSubmissionDTO> result = new ArrayList<>();

        submissionFields.forEach(createSubmissionDTO -> {
            if (!submissionRepository.existsByClientIdAndQuestionId(createSubmissionDTO.getClientId(), createSubmissionDTO.getQuestionId())) {
                throw new SubmissionAlreadyExistsException();
            }

            result.add(modelMapper.map(submissionRepository.save(updateSubmission(new Submission(), createSubmissionDTO)), GetSubmissionDTO.class));
        });

        return result;
    }
}
