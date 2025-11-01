package ch.baselhack.underwriting.model;

import ch.baselhack.underwriting.model.enums.QuestionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "offering_id")
    Offering offering;

    @NotNull
    private String title;

    private String description;

    @Enumerated(value = EnumType.STRING)
    @NotNull
    private QuestionType type;

    private String typeOptions;
}
