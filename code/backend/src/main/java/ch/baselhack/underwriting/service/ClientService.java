package ch.baselhack.underwriting.service;

import ch.baselhack.underwriting.dto.clients.CreateClientDTO;
import ch.baselhack.underwriting.dto.clients.GetClientDTO;

import java.util.List;
import java.util.UUID;

public interface ClientService {
    GetClientDTO createClient(CreateClientDTO createClient);
    List<GetClientDTO> getClients();
    GetClientDTO getClientsById(UUID id);
}
