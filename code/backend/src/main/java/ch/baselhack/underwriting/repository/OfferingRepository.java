package ch.baselhack.underwriting.repository;

import ch.baselhack.underwriting.model.Offering;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OfferingRepository extends JpaRepository<Offering, Long> {
    boolean existsByName(String name);
}
