package ch.baselhack.underwriting.controller;

import ch.baselhack.underwriting.dto.questions.*;
import ch.baselhack.underwriting.repository.QuestionRepository;
import ch.baselhack.underwriting.service.QuestionService;
import ch.baselhack.underwriting.service.QuestionWeightsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static ch.baselhack.underwriting.resources.constants.ApplicationConstants.QUESTIONS_API;

@RestController
@RequiredArgsConstructor
@RequestMapping(QUESTIONS_API)
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public ResponseEntity<List<GetQuestionDTO>> getQuestions() {
        return new ResponseEntity<>(questionService.getQuestions(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GetQuestionDTO> getQuestionById(@PathVariable Long id) {
        return new ResponseEntity<>(questionService.getQuestion(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<GetQuestionDTO> createQuestion(@Valid @RequestBody CreateQuestionDTO question) {
        return new ResponseEntity<>(questionService.createQuestion(question), HttpStatus.CREATED);
    }
}
