package ch.baselhack.underwriting.dto.clients;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateClientDTO {
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
    private LocalDate birthDate;

    @NotNull(message = "Email must not be empty")
    private String email;

    @NotNull(message = "Phone number must not be empty")
    private String phoneNumber;

    @NotNull(message = "gender must not be empty")
    private String gender;

    @NotNull(message = "zip number must not be empty")
    private Number zip;

}