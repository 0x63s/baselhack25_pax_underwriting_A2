package ch.baselhack.underwriting.dto.clients;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetClientDTO {
    private Long id;

    private String firstName;

    private String lastName;

    private String address;

    private String city;

    private String canton;

    private LocalDate birthDate;

    private String email;

    private String phoneNumber;

    private String gender;

    private Number zip;

}