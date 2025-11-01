package ch.baselhack.underwriting.dto.clients;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetClientDTO {
    private UUID id;

    private String firstName;

    private String lastName;

    private String address;

    private String city;

    private String canton;

    //private Date birthDate;

    private String email;

    private String phoneNumber;
}