package ch.baselhack.underwriting.exception.clients;

import java.util.UUID;

public class ClientNotFoundExceptions extends RuntimeException {
    public ClientNotFoundExceptions(UUID clientId) {
        super("Client with id " + clientId + " not found");
    }
}
