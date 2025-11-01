
import numpy as np

data_sample = {
  "age": {
    "variable_type": "binned",
    "bins": [(-np.inf, 18), (18, 29), (30,39), (40,49), (50,59), (60, np.inf)],
    "scores": [5, 12, 25, 40, 60]
  },
  "bmi": {
    "variable_type": "binned",
    "bins": [(-np.inf,18.5), (18.5,24.9), (25.0,29.9), (30.0,34.9), (35.0,np.inf)],
    "scores": [15, -10, 10, 25, 40]
  },
  "job_category": {
    "variable_type": "categorical",
    "categories": ["Office/Clerical", "Skilled Trade", "Manual Labor", "Unemployed", "High Risk"],
    "scores": [-10, 5, 20, 15, 45]
  },
  "smoker_status": {
    "variable_type": "categorical",
    "categories": ["Non-Smoker", "Smoker"],
    "scores": [0, 35]
  }
}

user_data_sample = {
  "age": 32,
  "bmi": 23,
  "job_category": "Skilled Trade",
  "smoker_status": "Non-Smoker"
}

decision_thresholds =  {
    "accept": 40,
    "ask_for_info_addon": 10,
    "reject_cutoff": 81
}

def evaluate_bins(bins, user_value, scores):
    for i, bin_ in enumerate(bins):
        if bin_[0] <= user_value <= bin_[1]:
            return scores[i]
    return 0

def evaluate_categories(categories, user_value, scores):
    i = categories.index(user_value)
    return scores[i]


def get_score_for_user_input(data, user_input):
    model_categories = data.keys()

    total_score = 0

    for key in list(model_categories):
        scores = data[key]["scores"]
        user_value = user_input[key]
        model_type = data[key]["variable_type"]

        if model_type == "binned":
            bins = data[key]["bins"]
            score = evaluate_bins(bins, user_value, scores)
        else:
            categories = data[key]["categories"]
            score = evaluate_categories(categories, user_value, scores)

        print(score, key)

        total_score += score

    return total_score

def get_result_based_on_score(score):
    if score <= decision_thresholds["accept"]:
        return "accept"
    elif score > decision_thresholds["reject_cutoff"]:
        return "reject"
    elif (score > decision_thresholds["reject_cutoff"] - decision_thresholds["ask_for_info_addon"] or
          score < decision_thresholds["reject_cutoff"] + decision_thresholds["ask_for_info_addon"]):
        return "ask_for_additional_info"
    else:
        return "risk_surcharge_suggested"


if __name__ == "__main__":
    score_ = get_score_for_user_input(user_input=user_data_sample, data=data_sample)
    print(score_)
    print(get_result_based_on_score(score_))
