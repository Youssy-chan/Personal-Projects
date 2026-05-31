# --------------------------------------------
# Progetto ML - Classificazione del rischio diabete
# Autore: Youssef El jihad
# Obiettivo: addestrare modelli di classificazione su dati sanitari per
#            prevedere il rischio di diabete utilizzando diverse tecniche ML.
# --------------------------------------------

import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV, cross_validate
from sklearn.preprocessing import RobustScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from imblearn.pipeline import Pipeline as ImbPipeline
from imblearn.over_sampling import SMOTE
from sklearn.feature_selection import SelectFromModel

# -------------------------------
# 1) Caricamento dataset
# -------------------------------
df = pd.read_csv("../diabetes_binary_health_indicators_BRFSS2015.csv")

# -------------------------------
# 2) Feature Engineering
# -------------------------------
df["BMI_cat"] = pd.cut(df["BMI"],
                       bins=[0, 18.5, 25, 30, 35, np.inf],
                       labels=["Under", "Normal", "Over", "Obese", "Extreme"])
df["Age_PhysHlth"]  = df["Age"] * df["PhysHlth"]
df["BadHealthDays"] = df["MentHlth"] + df["PhysHlth"]

# Clipping per outlier
for col in ["BMI", "MentHlth", "PhysHlth", "BadHealthDays"]:
    lo, hi = df[col].quantile([0.01, 0.99])
    df[col] = df[col].clip(lo, hi)

# -------------------------------
# 3) Split train-test + subsample
# -------------------------------
X = df.drop("Diabetes_binary", axis=1)
y = df["Diabetes_binary"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
X_sub, _, y_sub, _ = train_test_split(
    X_train, y_train, train_size=50000,
    stratify=y_train, random_state=42
)

# -------------------------------
# 4) Preprocessing pipeline
# -------------------------------
numeric_feats = ["BMI", "MentHlth", "PhysHlth", "BadHealthDays", "Age_PhysHlth"]
ord_cat_feats = ["GenHlth", "Education", "Income", "Age", "BMI_cat"]

preprocessor = ColumnTransformer([
    ("num", RobustScaler(), numeric_feats),
    ("ohe", OneHotEncoder(drop="first", handle_unknown="ignore", sparse_output=False), ord_cat_feats)
], remainder="passthrough")

# -------------------------------
# 5) Pipeline: Logistic + SMOTE + L1
# -------------------------------
pipeline = ImbPipeline([
    ("preproc", preprocessor),
    ("smote", SMOTE(random_state=42)),
    ("feature_sel", SelectFromModel(
        LogisticRegression(penalty="l1", solver="liblinear", C=0.1, class_weight="balanced"),
        threshold="median"
    )),
    ("clf", LogisticRegression(solver="liblinear", max_iter=1000, class_weight="balanced"))
])

# -------------------------------
# 6) GridSearch su Logistic
# -------------------------------
param_grid = {"clf__C": [0.1, 1, 10]}
cv3 = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)

search = GridSearchCV(
    pipeline,
    param_grid,
    scoring="roc_auc",
    cv=cv3,
    n_jobs=-1,
    verbose=1
)
search.fit(X_sub, y_sub)

# -------------------------------
# 7) Valutazione Logistic finale
# -------------------------------
best = search.best_estimator_

y_pred = best.predict(X_test)
y_prob = best.predict_proba(X_test)[:, 1]

print("\n➔ Logistic – Miglior C:", search.best_params_["clf__C"])
print("\n➔ Logistic – Classification report (test):")
print(classification_report(y_test, y_pred, digits=4))
print("➔ Logistic – Test ROC-AUC:", roc_auc_score(y_test, y_prob))

# -------------------------------
# 8) Feature selection interpretabile
# -------------------------------
ct = best.named_steps["preproc"]
feat_names = ct.get_feature_names_out()

selector = best.named_steps["feature_sel"]
mask = selector.get_support()
coefs_all = best.named_steps["clf"].coef_[0]

sel_names = feat_names[mask]
sel_coefs = coefs_all

coef_ser = pd.Series(sel_coefs, index=sel_names).sort_values(ascending=False)

print("\n➔ Top 10 feature positive (Logistic L1):\n", coef_ser.head(10))
print("\n➔ Top 10 feature negative (Logistic L1):\n", coef_ser.tail(10))

# -------------------------------
# 9) Random Forest
# -------------------------------
rf_pipe = Pipeline([
    ("preproc", ct),
    ("rf", RandomForestClassifier(
        n_estimators=100,
        class_weight="balanced",
        random_state=42
    ))
])

cv5 = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores_rf = cross_validate(rf_pipe, X_train, y_train, cv=cv5, scoring="roc_auc", n_jobs=-1)

print(f"\n➔ RF mean ROC-AUC (5-fold CV): {scores_rf['test_score'].mean():.4f}")

rf_pipe.fit(X_train, y_train)
y_pred_rf = rf_pipe.predict(X_test)
y_proba_rf = rf_pipe.predict_proba(X_test)[:, 1]

print("\n➔ RF – Classification report (test):")
print(classification_report(y_test, y_pred_rf, digits=4))
print("➔ RF – Test ROC-AUC:", roc_auc_score(y_test, y_proba_rf))

# -------------------------------
# 10) Voting Ensemble
# -------------------------------
log_pipe = best
vote = VotingClassifier(
    estimators=[("lr", log_pipe), ("rf", rf_pipe)],
    voting="soft",
    n_jobs=-1
)

vote.fit(X_train, y_train)
y_pred_v = vote.predict(X_test)
y_proba_v = vote.predict_proba(X_test)[:, 1]

print("\n➔ Voting – Classification report (test):")
print(classification_report(y_test, y_pred_v, digits=4))
print("➔ Voting – Test ROC-AUC:", roc_auc_score(y_test, y_proba_v))
