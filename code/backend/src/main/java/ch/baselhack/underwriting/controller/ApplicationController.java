package ch.baselhack.underwriting.controller;

import ch.baselhack.underwriting.dto.applications.CreateApplicationDTO;
import ch.baselhack.underwriting.dto.applications.GetApplicationDTO;
import ch.baselhack.underwriting.dto.applications.UpdateApplicationReviewDTO;
import ch.baselhack.underwriting.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static ch.baselhack.underwriting.resources.constants.ApplicationConstants.APPLICATIONS_API;

@RestController
@RequiredArgsConstructor
@RequestMapping(APPLICATIONS_API)
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<GetApplicationDTO> createApplication(@Valid @RequestBody CreateApplicationDTO applicationDTO) {
        return new ResponseEntity<>(applicationService.createApplication(applicationDTO), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<GetApplicationDTO>> getApplications(@RequestParam(required = false) Boolean unreviewed) {
        if (unreviewed != null && unreviewed) {
            return ResponseEntity.ok(applicationService.getUnreviewedApplications());
        }
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GetApplicationDTO> getApplication(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<GetApplicationDTO> updateApplicationReview(
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationReviewDTO reviewDTO) {
        return ResponseEntity.ok(applicationService.updateApplicationReview(id, reviewDTO));
    }

    @PostMapping("/{id}/calculate-risk")
    public ResponseEntity<Double> calculateRiskScore(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.calculateRiskScore(id));
    }
}
