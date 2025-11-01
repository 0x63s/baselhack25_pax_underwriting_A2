package ch.baselhack.underwriting.repository;

import ch.baselhack.underwriting.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {
    boolean existsByOfferingIdAndTitle(UUID offeringId, String title);
}
