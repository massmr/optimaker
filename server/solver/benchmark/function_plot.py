import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import json
import os

# Chargement des résultats
with open("results.jsonl", "r", encoding="utf-8") as f:
    lines = [json.loads(line) for line in f if line.strip()]
df = pd.DataFrame(lines)

# Crée une nouvelle colonne alphax (ex: alpha1, alpha2 ou alpha3 selon l'étude)
# Si tu varies alpha3 :
df["alphax"] = df["mode"].astype(int) / 99  # ou / 100 selon ton pas

# Crée le dossier results si nécessaire
os.makedirs("results", exist_ok=True)

# Fonction générique pour tracer alphax → y_variable
def make_lineplot(y_variable, title, ylabel, filename):
    plt.figure(figsize=(10, 5))
    sns.lineplot(
        data=df,
        x="alphax",
        y=y_variable,
        color="steelblue"
    )
    plt.title(title)
    plt.xlabel("Valeur de α")
    plt.ylabel(ylabel)
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(f"results/{filename}")
    plt.close()

# Traces
make_lineplot("Z", "Évolution de la fonction objectif Z en fonction de α3", "Z", "Z_plot.png")
make_lineplot("satisfaction_score", "Satisfaction moyenne en fonction de α3", "Affinité moyenne", "satisfaction_plot.png")
make_lineplot("matching_score", "Matching des thématiques moyen en fonction de α3", "Matching score moyen", "matching_plot.png")
make_lineplot("progression_rate", "Progression moyenne en fonction de α3", "Taux de progression", "progression_plot.png")

print("Graphiques générés dans le dossier `results/`.")