package ch.baselhack.underwriting.exception.clients;

public class ClientNotFoundExceptions extends RuntimeException {
    public ClientNotFoundExceptions(Long clientId) {
        super("Client with id " + clientId + " not found");
    }
}
