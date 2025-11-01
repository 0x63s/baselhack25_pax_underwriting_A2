package ch.baselhack.underwriting.exception.submissions;

public class SubmissionsByClientNotFoundException extends RuntimeException {
    public SubmissionsByClientNotFoundException(Long clientId) {
        super("Could not find submissions by client id " + clientId);
    }
}
