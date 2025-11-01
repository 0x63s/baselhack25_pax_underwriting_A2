package ch.baselhack.underwriting.service;

import java.util.List;

import ch.baselhack.underwriting.dto.offerings.CreateOfferingDTO;
import ch.baselhack.underwriting.dto.offerings.GetOfferingDTO;

public interface OfferingService {
    GetOfferingDTO createOffering(CreateOfferingDTO createOffering);

    List<GetOfferingDTO> getOfferings();

    GetOfferingDTO getOfferingById(Long id);
}
