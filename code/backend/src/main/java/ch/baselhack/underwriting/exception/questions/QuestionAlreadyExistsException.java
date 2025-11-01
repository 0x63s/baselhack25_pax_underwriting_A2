package ch.baselhack.underwriting.exception.questions;

public class QuestionAlreadyExistsException extends RuntimeException {
    public QuestionAlreadyExistsException() {
        super("Question already exists");
    }
}
