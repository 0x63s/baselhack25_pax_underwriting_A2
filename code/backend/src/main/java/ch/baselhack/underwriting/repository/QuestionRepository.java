package ch.baselhack.underwriting.repository;

import ch.baselhack.underwriting.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    boolean existsByOfferingIdAndTitle(Long offeringId, String title);
}
