import json
import pandas as pd
import numpy as np
from cross_3d_ideal_plot import plot_3d_normalized_scores

# Chargement des données
with open("benchmarks_data/results_cross3D.jsonl", "r", encoding="utf-8") as f:
    lines = [json.loads(line.strip()) for line in f if line.strip()]
df = pd.DataFrame(lines)

# Trouver tous les min et max de chaque critere d'évaluation
s_min, s_max = df["satisfaction_score"].min(), df["satisfaction_score"].max()
m_min, m_max = df["matching_score"].min(), df["matching_score"].max()
p_min, p_max = df["progression_rate"].min(), df["progression_rate"].max()

# Normaliser chaque critère entre 0 et 1
df["s_norm"] = (df["satisfaction_score"] - s_min) / (s_max - s_min)
df["m_norm"] = (df["matching_score"] - m_min) / (m_max - m_min)
df["p_norm"] = (df["progression_rate"] - p_min) / (p_max - p_min)

# Calcul de la distance euclidienne au point idéal (1, 1, 1)
df["distance_to_ideal"] = ((0.4 - df["s_norm"])**2 + (0.4 - df["m_norm"])**2 + (0.8 - df["p_norm"])**2)**0.5
# plot_3d_normalized_scores(df)

# Extraction du point le plus proche
best_row = df.loc[df["distance_to_ideal"].idxmin()]
best_alphas = best_row[["alpha1", "alpha2", "alpha3"]].to_dict()

print(best_alphas)