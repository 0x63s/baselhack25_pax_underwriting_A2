package ch.baselhack.underwriting.exception.submissions;

import java.util.UUID;

public class SubmissionsByClientNotFoundException extends RuntimeException {
    public SubmissionsByClientNotFoundException(UUID clientId) {
        super("Could not find submissions by client id " + clientId);
    }
}
