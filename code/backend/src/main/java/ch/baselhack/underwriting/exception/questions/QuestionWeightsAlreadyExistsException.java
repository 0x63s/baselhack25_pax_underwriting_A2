package ch.baselhack.underwriting.exception.questions;

public class QuestionWeightsAlreadyExistsException extends RuntimeException {
    public QuestionWeightsAlreadyExistsException(Long questionId) {
        super("Question weights already exists: " + questionId);
    }
}
