package ch.baselhack.underwriting.service.impl;

import ch.baselhack.underwriting.dto.offerings.CreateOfferingDTO;
import ch.baselhack.underwriting.dto.offerings.GetOfferingDTO;
import ch.baselhack.underwriting.exception.offerings.NoOfferingsFoundException;
import ch.baselhack.underwriting.exception.offerings.OfferingAlreadyExistsException;
import ch.baselhack.underwriting.exception.offerings.OfferingNotFoundException;
import ch.baselhack.underwriting.model.Offering;
import ch.baselhack.underwriting.repository.OfferingRepository;
import ch.baselhack.underwriting.service.OfferingService;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.lang.reflect.Type;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class OfferingServiceImpl implements OfferingService {
    private final OfferingRepository offeringRepository;
    private final ModelMapper modelMapper;

    @Override
    public GetOfferingDTO createOffering(CreateOfferingDTO offeringDTO) {
        if (offeringRepository.existsByName(offeringDTO.getName())) {
            throw new OfferingAlreadyExistsException(offeringDTO.getName());
        }
        return modelMapper.map(offeringRepository.save(modelMapper.map(offeringDTO, Offering.class)), GetOfferingDTO.class);
    }

    @Override
    public List<GetOfferingDTO> getOfferings() {
        List<Offering> offerings = offeringRepository.findAll();

        if (offerings.isEmpty()) {
            throw new NoOfferingsFoundException();
        }
        Type listType = new TypeToken<List<GetOfferingDTO>>() {}.getType();
        return modelMapper.map(offerings, listType);
    }

    @Override
    public GetOfferingDTO getOfferingById(UUID id) {
        if (!offeringRepository.existsById(id)) {
            throw new OfferingNotFoundException(id);
        }
        return modelMapper.map(offeringRepository.findById(id).get(), GetOfferingDTO.class);
    }
}
