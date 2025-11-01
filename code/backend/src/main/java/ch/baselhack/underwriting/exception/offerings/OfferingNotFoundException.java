package ch.baselhack.underwriting.exception.offerings;

public class OfferingNotFoundException extends RuntimeException {
    public OfferingNotFoundException(Long id) {
        super("Offer with id " + id + " not found");
    }
}
