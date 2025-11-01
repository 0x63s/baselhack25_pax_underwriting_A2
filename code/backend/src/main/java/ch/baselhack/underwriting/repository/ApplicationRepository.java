package ch.baselhack.underwriting.repository;

import ch.baselhack.underwriting.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByIsReviewed(Boolean isReviewed);

    List<Application> findByClientId(Long clientId);

    List<Application> findByOfferingId(Long offeringId);
}
