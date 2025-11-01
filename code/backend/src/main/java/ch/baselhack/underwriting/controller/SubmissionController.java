package ch.baselhack.underwriting.controller;

import ch.baselhack.underwriting.dto.submissions.CreateSubmissionDTO;
import ch.baselhack.underwriting.dto.submissions.GetSubmissionDTO;
import ch.baselhack.underwriting.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static ch.baselhack.underwriting.resources.constants.ApplicationConstants.SUBMISSION_API;

@RestController
@RequiredArgsConstructor
@RequestMapping(SUBMISSION_API)
public class SubmissionController {

    private final SubmissionService submissionService;

    @GetMapping("/{clientId}")
    public ResponseEntity<List<GetSubmissionDTO>> getSubmissionsByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByClient(clientId));
    }

    @PostMapping
    public ResponseEntity<List<GetSubmissionDTO>> createSubmission(@RequestBody List<CreateSubmissionDTO> createSubmissionDTO) {
        return ResponseEntity.ok(submissionService.createSubmission(createSubmissionDTO));
    }
}
