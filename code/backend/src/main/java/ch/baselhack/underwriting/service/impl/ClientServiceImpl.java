package ch.baselhack.underwriting.service.impl;

import ch.baselhack.underwriting.dto.clients.CreateClientDTO;
import ch.baselhack.underwriting.dto.clients.GetClientDTO;
import ch.baselhack.underwriting.exception.offerings.OfferingAlreadyExistsException;
import ch.baselhack.underwriting.model.Client;
import ch.baselhack.underwriting.repository.ClientRepository;
import ch.baselhack.underwriting.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ClientServiceImpl implements ClientService {
    private final ClientRepository clientRepository;
    private final ModelMapper modelMapper;

    @Override
    public GetClientDTO createClient(CreateClientDTO createClient) {
        if (clientRepository.existsByFirstNameAndLastName(createClient.getFirstName(), createClient.getLastName())) {
            throw new OfferingAlreadyExistsException("Client with name " + createClient.getFirstName() + createClient.getLastName() + " already exists");
        }
        return modelMapper.map(clientRepository.save(modelMapper.map(createClient, Client.class)), GetClientDTO.class);
    }
}
