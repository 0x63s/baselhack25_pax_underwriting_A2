package ch.baselhack.underwriting.dto.offerings;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetOfferingDTO {
    private Long id;
    private String name;
    private String description;
}
