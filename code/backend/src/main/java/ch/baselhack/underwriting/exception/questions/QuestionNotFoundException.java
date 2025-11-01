package ch.baselhack.underwriting.exception.questions;

import java.util.UUID;

public class QuestionNotFoundException extends RuntimeException {
    public QuestionNotFoundException(UUID id) {
        super("Could not find question with id: " + id);
    }
}
