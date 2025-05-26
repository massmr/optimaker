import json
import pandas as pd
import plotly.express as px

# Charger les données
with open("results_cross3D.jsonl", "r", encoding="utf-8") as f:
    data = [json.loads(line) for line in f if line.strip()]
df = pd.DataFrame(data)

# Choisis ici la variable que tu veux colorer (ex: Z, satisfaction_score, progression_rate, etc.)
#metric = "Z"
#metric = "satisfaction_score"
#metric = "matching_score"
metric = "progression_rate"

# Supprimer les lignes sans valeur (ex: quand le solveur n'a pas trouvé de solution)
df = df[df[metric].notna()]

# Tracer le nuage 3D
fig = px.scatter_3d(
    df,
    x="alpha1",
    y="alpha2",
    z="alpha3",
    color=metric,
    color_continuous_scale="Viridis",
    title=f"Nuage 3D : valeur de {metric} en fonction des α"
)
fig.update_layout(scene=dict(
    xaxis_title="α1 (affinité)",
    yaxis_title="α2 (matching thématique)",
    zaxis_title="α3 (progression)"
))
# Enregistre la figure pour la réouvrir dans le navigateur
#fig.write_html("results/plot_3d_alphaZ.html")
#fig.write_html("results/plot_3d_alphaS.html")
#fig.write_html("results/plot_3d_alphaM.html")
fig.write_html("results/plot_3d_alphaP.html")
fig.show()