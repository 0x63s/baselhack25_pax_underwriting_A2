package ch.baselhack.underwriting.repository;

import ch.baselhack.underwriting.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, UUID> {
    List<Submission> findAllByClientId(UUID clientId);

    boolean existsByClientIdAndQuestionId(UUID clientId, UUID questionId);
}
