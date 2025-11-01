package ch.baselhack.underwriting.service.impl;

import ch.baselhack.underwriting.dto.clients.CreateClientDTO;
import ch.baselhack.underwriting.dto.clients.GetClientDTO;
import ch.baselhack.underwriting.dto.offerings.GetOfferingDTO;
import ch.baselhack.underwriting.exception.offerings.NoOfferingsFoundException;
import ch.baselhack.underwriting.exception.offerings.OfferingAlreadyExistsException;
import ch.baselhack.underwriting.exception.offerings.OfferingNotFoundException;
import ch.baselhack.underwriting.model.Client;
import ch.baselhack.underwriting.repository.ClientRepository;
import ch.baselhack.underwriting.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.util.List;
import java.util.UUID;

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

    @Override
    public List<GetClientDTO> getClients() {
        List<Client> clients = clientRepository.findAll();

        if (clients.isEmpty()) {
            throw new NoOfferingsFoundException();
        }
        Type listType = new TypeToken<List<GetClientDTO>>() {}.getType();
        return modelMapper.map(clients, listType);
    }

    @Override
    public GetClientDTO getClientsById(UUID id) {
        if (!clientRepository.existsById(id)) {
            throw new OfferingNotFoundException(id);
        }
        return modelMapper.map(clientRepository.findById(id).get(), GetClientDTO.class);
    }
}
