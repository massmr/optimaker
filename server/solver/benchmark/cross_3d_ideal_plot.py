import plotly.graph_objs as go
import webbrowser

def plot_3d_normalized_scores(df, output_html="plot_normalized_3d.html"):
    """
    Trace un nuage de points 3D normalisé avec Plotly.

    df : DataFrame contenant les colonnes s_norm, m_norm, p_norm et alpha1/2/3.
    output_html : nom du fichier HTML de sortie.
    """

    fig = go.Figure(data=[
        go.Scatter3d(
            x=df["s_norm"],
            y=df["m_norm"],
            z=df["p_norm"],
            mode="markers",
            marker=dict(
                size=4,
                color=df["distance_to_ideal"],  # Plus proche de 0 = meilleur
                colorscale="Viridis",
                opacity=0.8,
                colorbar=dict(title="Distance à l’idéal")
            ),
            text=[
                f"α=({a1:.2f}, {a2:.2f}, {a3:.2f})"
                for a1, a2, a3 in zip(df["alpha1"], df["alpha2"], df["alpha3"])
            ]
        ),
        # Ajoute le point idéal (1,1,1) en rouge
        go.Scatter3d(
            x=[1],
            y=[1],
            z=[1],
            mode="markers",
            marker=dict(size=6, color="red"),
            name="Point idéal"
        ),
        # Ajoute le point trouvé comme le plus proche
        go.Scatter3d(
            x=[df.loc[df["distance_to_ideal"].idxmin(), "s_norm"]],
            y=[df.loc[df["distance_to_ideal"].idxmin(), "m_norm"]],
            z=[df.loc[df["distance_to_ideal"].idxmin(), "p_norm"]],
            mode="markers",
            marker=dict(size=6, color="green"),
            name="Meilleur α"
        )
    ])

    fig.update_layout(
    scene=dict(
        xaxis=dict(title="Satisfaction (normalisée)", range=[0, 1]),
        yaxis=dict(title="Matching (normalisé)", range=[0, 1]),
        zaxis=dict(title="Progression (normalisée)", range=[0, 1])
    ),
    title="Nuage 3D des scores normalisés",
    margin=dict(l=0, r=0, b=0, t=40)
    )


    fig.write_html(f"results/{output_html}")
    webbrowser.open(f"results/{output_html}")
    print(f"Graphique sauvegardé dans results/{output_html}")