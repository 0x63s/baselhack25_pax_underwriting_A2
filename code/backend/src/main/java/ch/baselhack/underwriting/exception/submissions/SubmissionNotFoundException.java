package ch.baselhack.underwriting.exception.submissions;

import java.util.UUID;

public class SubmissionNotFoundException extends RuntimeException {
    public SubmissionNotFoundException(UUID submissionId) {
        super("Could not find submission with id " + submissionId);
    }
}
