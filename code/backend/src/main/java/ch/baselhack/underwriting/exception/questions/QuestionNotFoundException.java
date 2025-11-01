package ch.baselhack.underwriting.exception.questions;

public class QuestionNotFoundException extends RuntimeException {
    public QuestionNotFoundException(Long id) {
        super("Could not find question with id: " + id);
    }
}
