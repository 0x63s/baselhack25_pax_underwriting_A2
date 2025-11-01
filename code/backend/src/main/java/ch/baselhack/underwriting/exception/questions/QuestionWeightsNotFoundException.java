package ch.baselhack.underwriting.exception.questions;

public class QuestionWeightsNotFoundException extends RuntimeException {
    public QuestionWeightsNotFoundException(Long questionId) {
        super("Could not find question with id " + questionId);
    }
}
