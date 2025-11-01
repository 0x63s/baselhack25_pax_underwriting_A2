package ch.baselhack.underwriting.controller;

import ch.baselhack.underwriting.dto.questions.*;
import ch.baselhack.underwriting.service.QuestionService;
import ch.baselhack.underwriting.service.QuestionWeightsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static ch.baselhack.underwriting.resources.constants.ApplicationConstants.QUESTIONS_API;
import static ch.baselhack.underwriting.resources.constants.ApplicationConstants.QUESTION_WEIGHTS_API;

@RestController
@RequiredArgsConstructor
@RequestMapping(QUESTION_WEIGHTS_API)
public class QuestionWeightsController {

    private final QuestionWeightsService questionWeightsService;

    @GetMapping("/{questionsId}")
    public ResponseEntity<GetQuestionWeightsDTO> getQuestionWeights(@PathVariable Long questionsId) {
        return new ResponseEntity<>(questionWeightsService.getQuestionWeights(questionsId), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<GetQuestionWeightsDTO> createQuestionWeights(@RequestBody CreateQuestionWeightsDTO createQuestionWeightsDTO) {
        return new ResponseEntity<>(questionWeightsService.createQuestionWeights(createQuestionWeightsDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{questionsId}")
    public ResponseEntity<GetQuestionWeightsDTO> updateQuestionWeights(@PathVariable Long questionsId, @RequestBody UpdateQuestionWeightsDTO updateQuestionWeightsDTO) {

        GetQuestionWeightsDTO updated = questionWeightsService.updateQuestionWeights(questionsId, updateQuestionWeightsDTO);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
}
