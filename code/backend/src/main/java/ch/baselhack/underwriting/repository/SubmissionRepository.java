package ch.baselhack.underwriting.repository;

import ch.baselhack.underwriting.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findAllByClientId(Long clientId);

    boolean existsByClientIdAndQuestionId(Long clientId, Long questionId);

    boolean existsByApplicationIdAndQuestionId(Long applicationId, Long questionId);
}
