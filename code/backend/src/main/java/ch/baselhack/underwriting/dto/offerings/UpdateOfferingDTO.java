package ch.baselhack.underwriting.dto.offerings;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateOfferingDTO {
    @NotNull(message = "Name must not be empty")
    private String name;

    private String description;
}
