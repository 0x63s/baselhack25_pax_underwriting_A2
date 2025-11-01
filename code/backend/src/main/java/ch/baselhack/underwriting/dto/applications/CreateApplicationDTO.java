package ch.baselhack.underwriting.dto.applications;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateApplicationDTO {
    @NotNull
    private Long clientId;

    @NotNull
    private Long offeringId;
}
