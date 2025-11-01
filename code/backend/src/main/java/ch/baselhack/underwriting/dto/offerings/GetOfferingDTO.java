package ch.baselhack.underwriting.dto.offerings;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetOfferingDTO {
    private UUID id;
    private String name;
    private String description;
}
