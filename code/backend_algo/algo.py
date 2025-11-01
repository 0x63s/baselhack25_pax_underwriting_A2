import logging

import numpy as np
import requests

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
    "accept": 0.2,
    "ask_for_info_addon": 0.1,
    "reject_cutoff": 0.8
}

def evaluate_bins(bins, user_value, scores):
    for i, bin_ in enumerate(bins):
        if bin_[0] <= user_value <= bin_[1]:
            return scores[i]
    return 0

def evaluate_categories(categories, user_value, scores):
    if user_value in categories:
        i = categories.index(user_value)
        return scores[i]
    return 0

def calculate_maximum_score(data):
    keys = data.keys()
    max_score = 0
    for key in keys:
        scores = data[key]["scores"]
        question_weight = data[key]["question_weight"]
        max_score += max(scores) * question_weight

    return max_score

def evaluate_multivalue_categories(categories, user_value, scores):
    """
    Calculate multi-valued scores for categories
    """
    user_values = user_value.split(";")
    max_value = max(scores)
    total_value = 0
    for val in user_values:
        total_value += evaluate_categories(categories, val, scores)
        if total_value > max_value:
            return max_value
    return max_value

def get_score_for_user_input(data, user_input):
    model_categories = data.keys()
    total_score = 0

    for key in list(model_categories):
        scores = data[key]["scores"]
        user_value = user_input[key]
        model_type = data[key]["variable_type"]

        if model_type == "binned":
            bins = data[key]["bins"]
            score = evaluate_bins(bins, user_value, scores)*data[key]["question_weight"]
        else:
            categories = data[key]["categories"]
            if ";" in user_value:
                score = evaluate_multivalue_categories(categories, user_value, scores)*data[key]["question_weight"]
            else:
                score = evaluate_categories(categories, user_value, scores)*data[key]["question_weight"]

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

def parse_weights(weights):
    scores = []
    values = []
    if "|" in weights and "-" in weights:
        weights = weights.split(";")
        for weight in weights:
            value, score = weight.split(":")
            scores.append(float(score))
            x, y = value.split(",")

            if "-" in  x:
                x = -np.inf
            if "|" in y:
                y = np.inf

            values.append((float(x), float(y)))
    else:
        storage = weights.split(";")
        for store in storage:
            category, score = store.split(":")
            values.append(category)
            scores.append(float(score))

    return scores, values

def get_score_and_decision_based_on_id(user_id, offering_id):
    client_submissions = requests.get(f"http://pax-backend-dev:8080/api/v1/submissions/{user_id}").json()

    user_data = {}
    question_data = {}

    for submission in client_submissions:
        question_id = submission["question"]["id"]
        offering_id_new = submission["question"]["offering"]["id"]

        if int(offering_id_new) == int(offering_id):
            weight_array = requests.get(f"http://pax-backend-dev:8080/api/v1/question-weights/{question_id}").json()
            weights = weight_array["weights"]

            parameter_weight = weight_array["parameterWeight"]

            scores, values = parse_weights(weights)
            if type(values[0]) == str:
                question_data[question_id] = {
                    "variable_type": "categories",
                    "categories" : values,
                    "scores": scores,
                    "question_weight": parameter_weight
                }
            else:
                question_data[question_id] = {
                    "variable_type": "binned",
                    "bins" : values,
                    "scores": scores,
                    "question_weight": parameter_weight
                }
            try:
                user_data[question_id] = float(submission["value"])
            except (ValueError, TypeError):
                user_data[question_id] = submission["value"]

    score = get_score_for_user_input(question_data, user_data)
    max_score = calculate_maximum_score(question_data)

    if max_score > 0: # prevent division by zero for bad classification
        norm_score = score/max_score
    else:
        norm_score = score
    result = get_result_based_on_score(norm_score)
    logging.warning(f"{user_data}")
    logging.warning(f"{question_data}")
    return norm_score, result


if __name__ == "__main__":
    score_ = get_score_and_decision_based_on_id(1, 1)
    print(score_)
