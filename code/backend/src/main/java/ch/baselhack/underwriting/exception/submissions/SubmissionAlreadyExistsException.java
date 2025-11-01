package ch.baselhack.underwriting.exception.submissions;

public class SubmissionAlreadyExistsException  extends RuntimeException {
    public SubmissionAlreadyExistsException() {
        super("Submission already exists");
    }
}
