package ch.baselhack.underwriting.exception.offerings;

import java.util.UUID;

public class OfferingNotFoundException extends RuntimeException {
    public OfferingNotFoundException(UUID id) {
        super("Offer with id " + id + " not found");
    }
}
