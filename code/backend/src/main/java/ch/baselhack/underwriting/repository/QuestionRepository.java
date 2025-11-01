package ch.baselhack.underwriting.repository;

import ch.baselhack.underwriting.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    boolean existsByOfferingIdAndTitle(Long offeringId, String title);

    List<Question> findByOfferingId(Long offeringId);
}
