package ch.baselhack.underwriting.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name="client")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "First name must not be empty")
    private String firstName;

    @NotNull(message = "Last name must not be empty")
    private String lastName;

    @NotNull(message = "Address must not be empty")
    private String address;

    @NotNull(message = "City must not be empty")
    private String city;

    @NotNull(message = "Canton must not be empty")
    private String canton;

    @NotNull(message = "Birth date must not be empty")
    private Date birthDate;

    @NotNull(message = "Email must not be empty")
    private String email;

    @NotNull(message = "Phone number must not be empty")
    private String phoneNumber;

    private String gender;

    @NotNull(message = "zip number must not be empty")
    private Number zip;

    private Number height;

    private Number weight;

    private Boolean isSmoker;

    private String medicalConditions;

    private String job_occupation;

    private Number annual_income;
}
