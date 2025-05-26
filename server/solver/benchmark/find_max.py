import json

with open("benchmarks_data/results_cross3D.jsonl", "r", encoding="utf-8") as f:
    data = [json.loads(line) for line in f if line.strip()]

best = {
    "ideal_satisfaction": max(data, key=lambda x: x["satisfaction_score"]),
    "ideal_matching": max(data, key=lambda x: x["matching_score"]),
    "ideal_progression": max(data, key=lambda x: x["progression_rate"]),
    "Z": max(data, key=lambda x: x["Z"]),
}

for key, val in best.items():
    print(f"{key} at α = {val['alpha1']:.2f}, {val['alpha2']:.2f}, {val['alpha3']:.2f}")