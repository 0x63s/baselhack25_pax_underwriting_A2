package ch.baselhack.underwriting.controller;

import ch.baselhack.underwriting.dto.offerings.CreateOfferingDTO;
import ch.baselhack.underwriting.dto.offerings.GetOfferingDTO;
import ch.baselhack.underwriting.dto.offerings.UpdateOfferingDTO;
import ch.baselhack.underwriting.model.Offering;
import ch.baselhack.underwriting.service.OfferingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static ch.baselhack.underwriting.resources.constants.ApplicationConstants.OFFERINGS_API;

@RestController
@RequiredArgsConstructor
@RequestMapping(OFFERINGS_API)
public class OfferingController {

    private final OfferingService offeringService;

    @PostMapping
    public ResponseEntity<GetOfferingDTO> createOffering(@Valid @RequestBody CreateOfferingDTO offering) {
        return ResponseEntity.ok(offeringService.createOffering(offering));
    }

    @GetMapping
    public ResponseEntity<List<GetOfferingDTO>> getOfferings() {
        return ResponseEntity.ok(offeringService.getOfferings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GetOfferingDTO> getOffering(@PathVariable Long id) {
        return  ResponseEntity.ok(offeringService.getOfferingById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GetOfferingDTO> updateOffering(@PathVariable Long id, @Valid @RequestBody UpdateOfferingDTO offering) {
        return ResponseEntity.ok(offeringService.updateOffering(id, offering));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOffering(@PathVariable Long id) {
        offeringService.deleteOffering(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
