import pandas as pd
import numpy as np
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy.linalg as la
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.base import BaseEstimator, TransformerMixin

# ============================================================
# 1. Classe nécessaire pour recharger le modèle sauvegardé
# ============================================================
def varimax(Phi, gamma=1.0, q=100, tol=1e-6):
    p, k = Phi.shape
    R = np.eye(k)
    d = 0

    for i in range(q):
        d_old = d
        Lambda = np.dot(Phi, R)

        u, s, vh = np.linalg.svd(
            np.dot(
                Phi.T,
                Lambda ** 3
                - (gamma / p)
                * np.dot(
                    Lambda,
                    np.diag(np.diag(np.dot(Lambda.T, Lambda)))
                )
            )
        )

        R = np.dot(u, vh)
        d = np.sum(s)

        if d_old != 0 and d / d_old < 1 + tol:
            break

    return np.dot(Phi, R), R


class PCAVarimaxTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, n_components=4):
        self.n_components = n_components

    def fit(self, X, y=None):
        self.feature_names_in_ = list(X.columns)

        self.scaler_ = StandardScaler()
        Z = self.scaler_.fit_transform(X)

        self.pca_ = PCA(n_components=self.n_components, random_state=42)
        self.pca_.fit(Z)

        loadings = self.pca_.components_.T * np.sqrt(
            self.pca_.explained_variance_
        )

        self.rotated_loadings_, self.rotation_matrix_ = varimax(loadings)

        return self

    def transform(self, X):
        Z = self.scaler_.transform(X)
        pca_scores = self.pca_.transform(Z)
        rotated_scores = pca_scores @ self.rotation_matrix_
        return rotated_scores

    def get_loading_table(self):
        return pd.DataFrame(
            self.rotated_loadings_,
            index=self.feature_names_in_,
            columns=["D1", "D2", "D3", "D4"]
        )

# Fix pour joblib : on injecte la classe dans __main__ car elle a été sauvegardée dans ce namespace
import sys
import __main__
setattr(__main__, "PCAVarimaxTransformer", PCAVarimaxTransformer)
sys.modules['__main__'].PCAVarimaxTransformer = PCAVarimaxTransformer

# ============================================================
# 2. Chargement du modèle et initialisation de l'API
# ============================================================

app = FastAPI(title="Prédiction Académique API")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chargement du modèle au démarrage (utilise le chemin relatif vers le parent)
import os
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "modele_application_performance.pkl")

try:
    artifact = joblib.load(MODEL_PATH)
    model = artifact["model"]
    features = artifact["features"]
    dimension_names = artifact["dimension_names"]
    threshold = artifact["threshold"]
    metrics = artifact["metrics"]
except Exception as e:
    print(f"Erreur lors du chargement du modèle : {e}")

# ============================================================
# 3. Modèles Pydantic pour les requêtes
# ============================================================

class StudentProfile(BaseModel):
    SX: int
    AG: int
    SERIE_BAC: int
    MENT_BAC: int
    MOT_MAST: int
    EMP_ETU: int
    CLUB_ASS: int
    TMP_ETU: int
    TMP_LOIS: int
    COURS_SUP: int
    TRAV_GRP: int
    MAT_REDOUB: int
    NB_FR_SR: int  # Streamlit a "NB_FR-SR"
    NIV_PERE: int
    NIV_MERE: int
    STAT_PARENT: int
    SIT_ECO: int
    LIEU_RES: int
    PRI_TACH: int
    INFO: int
    ID_NUM: int
    NTIC: int
    IA: int
    COM_SC: int

# ============================================================
# 4. Logique de prédiction et de recommandation
# ============================================================

def generate_recommendations(predicted_class, contribution_df):
    recommendations = []

    if predicted_class == 1:
        recommendations.append({
            "Priorité": "Maintien",
            "Dimension": "Profil global",
            "Recommandation": (
                "Le profil est prédit comme favorable à une performance élevée. "
                "Il est recommandé de maintenir les méthodes actuelles, de continuer "
                "à développer les compétences numériques, et de conserver une organisation régulière du travail."
            )
        })
        return recommendations

    negative_dims = contribution_df[
        contribution_df["Contribution au logit"] < 0
    ].copy()

    negative_dims["Impact négatif"] = negative_dims[
        "Contribution au logit"
    ].abs()

    negative_dims = negative_dims.sort_values(
        "Impact négatif",
        ascending=False
    )

    if negative_dims.empty:
        recommendations.append({
            "Priorité": "Priorité générale",
            "Dimension": "Capital cognitivo-numérique et académique",
            "Recommandation": (
                "La probabilité reste inférieure au seuil malgré l’absence de contribution fortement négative. "
                "Il est recommandé de renforcer en priorité le capital cognitivo-numérique et académique, "
                "car cette dimension possède le coefficient logistique le plus élevé."
            )
        })
        return recommendations

    priority_rank = 1

    for _, row in negative_dims.iterrows():
        dim = row["Dimension"]

        if dim == "D1":
            rec = (
                "Renforcer le capital cognitivo-numérique et académique : augmenter le temps d’étude personnel, "
                "améliorer les compétences en IA, NTIC, informatique, communication scientifique, "
                "utiliser des outils de planification et réduire les lacunes liées aux matières redoublées."
            )
        elif dim == "D2":
            rec = (
                "Renforcer le soutien socio-familial et les ressources éducatives : utiliser les ressources "
                "universitaires, demander un tutorat, fréquenter la bibliothèque, solliciter un encadrement pédagogique "
                "et chercher un appui académique lorsque les ressources familiales sont limitées."
            )
        elif dim == "D3":
            rec = (
                "Tenir compte du contexte biographique et résidentiel : mieux planifier les déplacements, "
                "organiser un environnement d’étude stable, anticiper les contraintes familiales ou territoriales, "
                "et demander un accompagnement académique si le contexte personnel limite l’apprentissage."
            )
        elif dim == "D4":
            rec = (
                "Améliorer l’engagement stratégique : clarifier la motivation pour le Master, participer à un groupe "
                "de travail, mieux équilibrer emploi et études, suivre des cours complémentaires si nécessaire, "
                "et prioriser les tâches universitaires."
            )
        else:
            rec = "Recommandation générale : renforcer les habitudes d’apprentissage et demander un accompagnement."

        recommendations.append({
            "Priorité": f"Priorité {priority_rank}",
            "Dimension": row["Nom scientifique"],
            "Recommandation": rec
        })

        priority_rank += 1

    return recommendations


@app.post("/predict")
def predict_student(profile: StudentProfile):
    input_data = profile.dict()
    if "NB_FR_SR" in input_data:
        input_data["NB_FR-SR"] = input_data.pop("NB_FR_SR")

    X_new = pd.DataFrame([input_data])
    
    try:
        X_new = X_new[features]
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Colonnes manquantes: {str(e)}")

    predicted_class = int(model.predict(X_new)[0])
    probability_class_1 = float(model.predict_proba(X_new)[0, 1])

    factorial = model.named_steps["factorial"]
    logistic = model.named_steps["logistic"]

    factor_scores = factorial.transform(X_new)

    factor_dict = {
        "D1": float(factor_scores[0][0]),
        "D2": float(factor_scores[0][1]),
        "D3": float(factor_scores[0][2]),
        "D4": float(factor_scores[0][3])
    }

    coefficients = logistic.coef_[0]
    intercept = float(logistic.intercept_[0])

    contributions = coefficients * factor_scores[0]

    contribution_df = pd.DataFrame({
        "Dimension": ["D1", "D2", "D3", "D4"],
        "Nom scientifique": [
            dimension_names["D1"],
            dimension_names["D2"],
            dimension_names["D3"],
            dimension_names["D4"]
        ],
        "Score factoriel": factor_scores[0],
        "Coefficient logistique": coefficients,
        "Contribution au logit": contributions
    })

    logit_score = intercept + float(contributions.sum())

    recs = generate_recommendations(predicted_class, contribution_df)

    contributions_list = contribution_df.to_dict(orient="records")
    for i in range(len(contributions_list)):
        contributions_list[i]["Score factoriel"] = float(contributions_list[i]["Score factoriel"])
        contributions_list[i]["Coefficient logistique"] = float(contributions_list[i]["Coefficient logistique"])
        contributions_list[i]["Contribution au logit"] = float(contributions_list[i]["Contribution au logit"])

    return {
        "predicted_class": predicted_class,
        "probability_class_1": probability_class_1,
        "logit_score": logit_score,
        "factor_scores": factor_dict,
        "dimension_names": dimension_names,
        "contributions": contributions_list,
        "recommendations": recs
    }

# ============================================================
# 5. Endpoint de prédiction en lot (Batch Excel)
# ============================================================
@app.get("/predict_batch")
def predict_batch():
    EXCEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "donnee400VR.xlsx")
    if not os.path.exists(EXCEL_PATH):
        raise HTTPException(status_code=404, detail="Fichier donnee400VR.xlsx introuvable.")
    
    try:
        df = pd.read_excel(EXCEL_PATH)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur de lecture du fichier: {str(e)}")

    # Gérer la colonne "NB_FR_SR" vs "NB_FR-SR" au cas où
    if "NB_FR_SR" in df.columns:
        df.rename(columns={"NB_FR_SR": "NB_FR-SR"}, inplace=True)

    try:
        X_batch = df[features]
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Colonnes manquantes dans le fichier Excel: {str(e)}")

    # Prédictions
    preds = model.predict(X_batch)
    probs = model.predict_proba(X_batch)[:, 1]

    results = []
    for i in range(len(df)):
        results.append({
            "index": int(i),
            "predicted_class": int(preds[i]),
            "probability_class_1": float(probs[i])
        })
    
    return {
        "total_rows": len(df),
        "results": results
    }

