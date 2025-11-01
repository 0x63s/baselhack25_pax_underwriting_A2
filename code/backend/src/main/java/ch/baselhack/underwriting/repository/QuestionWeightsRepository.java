package ch.baselhack.underwriting.repository;

import ch.baselhack.underwriting.model.QuestionWeights;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuestionWeightsRepository extends JpaRepository<QuestionWeights, Long> {
    Optional<QuestionWeights> findByQuestionId(Long questionId);
}
