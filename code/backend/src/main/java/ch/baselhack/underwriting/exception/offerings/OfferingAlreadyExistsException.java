package ch.baselhack.underwriting.exception.offerings;

public class OfferingAlreadyExistsException extends RuntimeException {
    public OfferingAlreadyExistsException(String message) {
        super("Offering with name " + message + " already exists");
    }
}
