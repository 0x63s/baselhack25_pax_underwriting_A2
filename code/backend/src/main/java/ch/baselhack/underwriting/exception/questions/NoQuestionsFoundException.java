package ch.baselhack.underwriting.exception.questions;

public class NoQuestionsFoundException extends RuntimeException {
    public NoQuestionsFoundException() {
        super("No questions found");
    }
}
