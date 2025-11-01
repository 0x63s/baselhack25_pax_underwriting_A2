package ch.baselhack.underwriting.exception.offerings;

public class NoOfferingsFoundException extends RuntimeException {
    public NoOfferingsFoundException() {
        super("No offerings found");
    }
}
