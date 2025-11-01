package ch.baselhack.underwriting.service;

import java.util.List;

import ch.baselhack.underwriting.dto.offerings.CreateOfferingDTO;
import ch.baselhack.underwriting.dto.offerings.GetOfferingDTO;
import ch.baselhack.underwriting.dto.offerings.UpdateOfferingDTO;

public interface OfferingService {
    GetOfferingDTO createOffering(CreateOfferingDTO createOffering);

    List<GetOfferingDTO> getOfferings();

    GetOfferingDTO getOfferingById(Long id);

    GetOfferingDTO updateOffering(Long id, UpdateOfferingDTO updateOffering);

    void deleteOffering(Long id);
}
