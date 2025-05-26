#!/bin/bash

# Chemin de ton script de génération Python
CONVERTER="convert_dataset.py"

# Tableau des noms de datasets sans extension
DATASETS=(
  "baseline"
  "no_affinity"
  "random_affinity"
  "skewed_places"
  "imbalanced_classe"
  "limited_themes"
  "missing_preferences"
  "high_difficulty"
  "old_perf_bias"
  "with_b_minus"
)

# Exécution du convertisseur pour chaque dataset
for dataset in "${DATASETS[@]}"; do
  echo "Conversion de $dataset.json..."
  python3 $CONVERTER --path "json/${dataset}.json"
done

echo "Tous les datasets ont été convertis."
