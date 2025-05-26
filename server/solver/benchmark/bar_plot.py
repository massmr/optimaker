import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import json
import os

# Chargement des résultats
with open("results.jsonl", "r", encoding="utf-8") as f:
    lines = [json.loads(line) for line in f if line.strip()]
df = pd.DataFrame(lines)

# Définir l’ordre des modes
#mode_order = ["learn", "happiness", "balance", "soft", "performance"]
mode_order = [str(i) for i in range(100)]
palette = sns.color_palette("Set2", len(mode_order))

# Crée le dossier results si nécessaire
os.makedirs("results", exist_ok=True)

# Fonction de génération générique pour barplots
def make_barplot(y_variable, title, ylabel, filename):
    plt.figure(figsize=(12, 6))
    sns.barplot(
        data=df,
        x="alpha3",
        y=y_variable,
        hue="mode",
        hue_order=mode_order,
        palette=palette,
        ci=None,  # pas d’intervalle de confiance
        dodge=True
    )
    plt.title(title)
    plt.xlabel("Jeu de données")
    plt.ylabel(ylabel)
    plt.xticks(rotation=45)
    plt.legend(title="Mode", bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.tight_layout()
    plt.savefig(f"results/{filename}")
    plt.close()

# Génération des graphiques avec barres
make_barplot("Z", "Valeur de la fonction objectif Z", "Z", "Z_plot.png")
make_barplot("satisfaction", "Satisfaction moyenne par dataset", "Affinité moyenne", "satisfaction_barplot.png")
make_barplot("progression_rate", "Taux de progression par dataset", "Progression (%)", "progression_barplot.png")
make_barplot("balance_std", "Équilibrage ADI1/ADI2 (écart-type)", "Écart-type de balance", "balance_std_barplot.png")

print("Graphiques à barres générés dans le dossier `results/`.")
