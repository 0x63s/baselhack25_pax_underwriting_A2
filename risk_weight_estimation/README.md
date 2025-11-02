# 🧠 Risk Weight Estimation — BaselHack 2025 PAX Challenge

This folder contains the **machine learning part** of our solution for the *Automate Underwriting* challenge.  
It trains a neural network to estimate **feature weights** from questionnaire data, supporting explainable and data-driven risk evaluation.

---

## 📂 Folder Contents
| File | Description |
|------|--------------|
| Pax_Basel_Hackathon_2025.ipynb | Main notebook: preprocessing, training, analysis. |
| synthetic_underwriting_offering1.csv | Synthetic dataset used for model training. |
| feature_importance.csv | Exported table of learned feature importances. |
| CalculatedWeights.png | Screenshot showing model weight output. |

---

## ⚙️ Notebook Summary

### 1️⃣ Setup & Preprocessing
- Loads data from Google Drive.  
- Converts numerical columns (age, BMI, doctor visits) into categorical bins.  
- Applies `OneHotEncoder` to convert all features into numeric form.  
- Splits into training/testing sets.  
✅ Output: *All features categorical and ready for training.*

### 2️⃣ Neural Network Training
- Keras Sequential model: `Dense(64, relu)` → `Dense(32, relu)` → `Dense(1)`.  
- Uses **MSE loss**, **Adam optimizer**, 89 epochs.  
- Saves trained model for reuse.  
📊 Example MAE ≈ 110 → indicates reasonable accuracy on synthetic data.

### 3️⃣ Feature Importance Extraction
- Calculates average absolute first-layer weights per feature.  
- Ranks features by influence on risk score:
```
doctor_visits_category_very_high  0.6878
extreme_sport_yes                 0.5170
occupational_risk_level_high      0.5154
bmi_category_obese                0.4462
smoking_yes                       0.3760
...
```
- Saved to `feature_importance.csv`.

### 4️⃣ DMN & Prediction
- DMN logic layer applies predefined business rules before model inference.  
- User input processed with same encoder → neural network predicts risk.  
- Combines both results for final decision (*Reject* / *Not Reject*).

---

## 💡 Key Takeaways
- Encoded features make risk scoring interpretable.  
- Model provides a transparent measure of question importance.  
- Top drivers: doctor visits, extreme sports, occupational risk.


