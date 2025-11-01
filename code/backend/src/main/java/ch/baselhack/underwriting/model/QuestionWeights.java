package ch.baselhack.underwriting.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "question_weights")
public class QuestionWeights {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "question_id")
    Question question;

    private String weights;

    private double parameterWeight;
}
