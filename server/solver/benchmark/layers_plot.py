import pandas as pd
import matplotlib.pyplot as plt
import json
import os

# Fichiers à tracer
alphas = {
    "alpha1": "results_alpha1.jsonl",
    "alpha2": "results_alpha2.jsonl",
    "alpha3": "results_alpha3.jsonl"
}

# Dossier de sortie
os.makedirs("results", exist_ok=True)

# Fonction de normalisation min-max
def normalize(series):
    return (series - series.min()) / (series.max() - series.min())

# Pour chaque alpha
for label, filepath in alphas.items():
    df = pd.read_json(filepath, lines=True)
    df["alphax"] = df["mode"].astype(int) / 99

    # Normalisation des colonnes
    norm_satisfaction = normalize(df["satisfaction_score"])
    norm_progression = normalize(df["progression_rate"])
    norm_matching = normalize(df["matching_score"])

    # Tracé
    plt.figure(figsize=(10, 5))
    plt.plot(df["alphax"], norm_satisfaction, label="Satisfaction (normalisée)")
    plt.plot(df["alphax"], norm_progression, label="Progression (normalisée)")
    plt.plot(df["alphax"], norm_matching, label="Matching thématique (normalisé)")

    plt.xlabel("Valeur de α")
    plt.ylabel("Valeur normalisée")
    plt.title(f"Impact d'{label} sur les indicateurs clés")
    plt.grid(True)
    plt.legend()
    plt.tight_layout()
    plt.savefig(f"results/superposed_{label}.png")
    plt.close()

print("Graphiques normalisés générés dans `results/`.")