package ch.baselhack.underwriting.service;

import ch.baselhack.underwriting.dto.clients.CreateClientDTO;
import ch.baselhack.underwriting.dto.clients.GetClientDTO;

import java.util.List;

public interface ClientService {
    GetClientDTO createClient(CreateClientDTO createClient);
    List<GetClientDTO> getClients();
}
