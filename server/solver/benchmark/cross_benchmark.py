import subprocess
import json

# Générer toutes les combinaisons alpha1, alpha2, alpha3 avec pas 0.05
step = 0.05
values = [round(i * step, 2) for i in range(int(1 / step) + 1)]
combinations = [
    (a1, a2, a3) for a1 in values for a2 in values for a3 in values
]

# Fichier de sortie
RESULTS_FILE = "results_cross3D.jsonl"
SOLVER_SCRIPT = "../solver_benchmark.py"
DATASET = "baseline"

with open(RESULTS_FILE, "w", encoding="utf-8") as f_out:
    for idx, (a1, a2, a3) in enumerate(combinations):
        print(f"▶ Benchmarking #{idx+1}/{len(combinations)} — α1={a1}, α2={a2}, α3={a3}")
        result = subprocess.run(
            [
                "python3", SOLVER_SCRIPT,
                "--exec", "test",
                "--dataset", DATASET,
                "--alpha1", str(a1),
                "--alpha2", str(a2),
                "--alpha3", str(a3)
            ],
            capture_output=True,
            text=True
        )
        if result.returncode != 0:
            print(f"Erreur sur α=({a1}, {a2}, {a3}) :\n{result.stderr}")
            continue
        try:
            stdout_lines = result.stdout.strip().splitlines()
            last_line = stdout_lines[-1] if stdout_lines else ""
            output_json = json.loads(last_line)
            output_json["alpha1"] = a1
            output_json["alpha2"] = a2
            output_json["alpha3"] = a3
            f_out.write(json.dumps(output_json, ensure_ascii=False) + "\n")
        except json.JSONDecodeError:
            print(f"Résultat invalide pour α=({a1}, {a2}, {a3}) :\n{result.stdout[:300]}...")

print(f"\nTous les benchmarks 3D sont terminés. Résultats dans `{RESULTS_FILE}`.")