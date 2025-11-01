package ch.baselhack.underwriting.repository;

import ch.baselhack.underwriting.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ClientRepository extends JpaRepository<Client, UUID> {
    boolean existsByFirstNameAndLastName(String firstName, String lastName);
}
