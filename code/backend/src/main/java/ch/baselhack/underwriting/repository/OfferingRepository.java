package ch.baselhack.underwriting.repository;

import ch.baselhack.underwriting.model.Offering;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OfferingRepository extends JpaRepository<Offering, UUID> {
    boolean existsByName(String name);
}
