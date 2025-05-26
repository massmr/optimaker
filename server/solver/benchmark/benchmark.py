import os
import subprocess
import json
from pathlib import Path

# Dossiers et fichiers
"""
# All datasets
DATASETS = [
    "baseline", "high_difficulty", "imbalanced_classe", "limited_themes",
    "missing_preferences", "no_affinity", "old_perf_bias", "random_affinity",
    "with_b_minus", "skewed_places"
]
"""

# Isolate datasets
DATASETS = [
    "baseline"
]

# MODES = ["learn", "happiness", "balance", "soft", "performance"]
MODES = ["balance"]

RESULTS_FILE = "results_constraints_alpha1.jsonl"
SOLVER_SCRIPT = "../solver.py"

# Lancement des benchmarks
with open(RESULTS_FILE, "w", encoding="utf-8") as f_out:
    # iterate in each datasets specified
        # hardcoded, more could be added later
    # iterate in each usage profile
        # also hard coded but more could be added
    for dataset in DATASETS:
        #for mode in MODES:
        for mode in MODES:
            # Launches solver.py ALWAYS in exec test
            print(f"▶ Benchmarking dataset={dataset} mode={mode}...")
            result = subprocess.run(
                [
                    "python3", SOLVER_SCRIPT,
                    "--exec", "test",
                    "--dataset", dataset,
                    "--mode", mode
                ],
                capture_output=True,
                text=True
            )
            if result.returncode != 0:
                print(f"Erreur sur {dataset} ({mode}) :\n{result.stderr}")
                continue
            try:
                # Solver returns CBC + Json and only LAST LIE_NE is the JSON part
                stdout_lines = result.stdout.strip().splitlines()
                last_line = stdout_lines[-1] if stdout_lines else ""
                output_json = json.loads(last_line)
                f_out.write(json.dumps(output_json, ensure_ascii=False) + "\n")
            except json.JSONDecodeError:
                print(f"Résultat invalide pour {dataset} ({mode}) :\n{result.stdout[:300]}...")

print(f"\nTous les benchmarks sont terminés. Résultats sauvegardés dans {RESULTS_FILE}")