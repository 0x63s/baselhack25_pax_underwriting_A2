package ch.baselhack.underwriting.exception.submissions;

public class SubmissionNotFoundException extends RuntimeException {
    public SubmissionNotFoundException(Long submissionId) {
        super("Could not find submission with id " + submissionId);
    }
}
