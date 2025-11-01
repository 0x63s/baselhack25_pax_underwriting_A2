package ch.baselhack.underwriting.controller;

import ch.baselhack.underwriting.dto.clients.CreateClientDTO;
import ch.baselhack.underwriting.dto.clients.GetClientDTO;
import ch.baselhack.underwriting.dto.offerings.GetOfferingDTO;
import ch.baselhack.underwriting.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static ch.baselhack.underwriting.resources.constants.ApplicationConstants.CLIENTS_API;

@RestController
@RequiredArgsConstructor
@RequestMapping(CLIENTS_API)
public class ClientController {

    private final ClientService clientService;

    @PostMapping
    public ResponseEntity<GetClientDTO> createOffering(@Valid @RequestBody CreateClientDTO client) {
        return ResponseEntity.ok(clientService.createClient(client));
    }

    @GetMapping
    public ResponseEntity<List<GetClientDTO>> getOfferings() {
        return ResponseEntity.ok(clientService.getClients());
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<GetOfferingDTO> getOffering(@PathVariable UUID id) {
//        return  ResponseEntity.ok(offeringService.getOfferingById(id));
//    }
}
