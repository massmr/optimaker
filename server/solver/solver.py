import json
import sys
import os
import argparse
import importlib
import statistics
import importlib
from pulp import LpProblem, LpMaximize, LpVariable, lpSum, LpBinary, LpStatus

# Final modes
# Benchmarked :
#   dataset = baseline
#   3D_matrix (alpha_1, alpha_2, alpha_3) => [0,1] : 0.05
#   ideal point method
MODES = {
    'balance': [0.2, 0.05, 0.7],
    'satisfaction': [0.05, 0, 0],
    'matching': [0, 0.05, 0],
    'progression': [0, 0, 0.05],
    'performance': [1, 1, 1] # Z_max
}

def load_test_data(path_to_data):
    dataset_module = importlib.import_module(f"datasets.python.{path_to_data}")
    return (
        dataset_module.E,
        dataset_module.P,
        dataset_module.places,
        dataset_module.classe,
        dataset_module.affinity,
        dataset_module.t_pref,
        dataset_module.t_aimes,
        dataset_module.t_prim,
        dataset_module.t_anx,
        dataset_module.difficulty,
        dataset_module.N,
        dataset_module.note,
        dataset_module.difficulty_old,
        dataset_module.B_minus
    )

def load_api_data():
    raw = json.load(sys.stdin)
    E = [s['id'] for s in raw['students']]
    P = [p['id'] for p in raw['projects']]
    places = {p['id']: p['places'] for p in raw['projects']}
    difficulty = {p['id']: p['difficulty'] for p in raw['projects']}
    t_prim = {p['id']: p['primary_theme'] for p in raw['projects']}
    t_anx = {p['id']: p['secondary_themes'] for p in raw['projects']}
    t_pref = {s['id']: s['preferences']['theme_prefered'] for s in raw['students']}
    t_aimes = {s['id']: s['preferences']['themes_liked'] for s in raw['students']}
    affinity = {(a['studentId'], a['projectId']): a['affinity'] for a in raw['affinities']}
    # valeurs par défaut simples
    N = []
    note = {}
    difficulty_old = {}
    classe = {e: "ADI1" for e in E}
    B_minus = []
    return E, P, places, classe, affinity, t_pref, t_aimes, t_prim, t_anx, difficulty, N, note, difficulty_old, B_minus

def matching_score(i, j, t_pref, t_prim, t_anx, t_aimes):
    score = 0
    tpi = t_pref.get(i)
    tpj = t_prim.get(j)
    taj = t_anx.get(j, [])
    tai = t_aimes.get(i, [])

    if tpi is None or tpj is None:
        return 0

    if tpi == tpj:
        score += 10
    if tpi in taj:
        score += 5
    if tpj in tai:
        score += 3
    score += sum(1 for t in tai if t in taj)
    return score

def n_perf(i, N, note, difficulty_old):
    notes = [(note[(i, p)], difficulty_old[p]) for (e, p) in N if e == i]
    if not notes:
        return 2.0
    total_weight = sum(w for (_, w) in notes)
    weighted_sum = sum(n * w for (n, w) in notes)
    return (weighted_sum / total_weight) * (4 / 20)

def epsilon(i, N, note, difficulty_old):
    return 0.25 * n_perf(i, N, note, difficulty_old) + 0.25

def progression(i, j, difficulty, N, note, difficulty_old):
    return 1 if n_perf(i, N, note, difficulty_old) - difficulty[j] + epsilon(i, N, note, difficulty_old) >= 0 else 0

def M(i, j, affinity):
    return 1 if affinity.get((i, j), 0) > 0 else 0

def solve(E, P, places, classe, affinity, t_pref, t_aimes, t_prim, t_anx, difficulty, N, note, difficulty_old, B_minus, weights, exec_mode):
    prob = LpProblem("Affectation_E_P", LpMaximize)
    x = {(i, j): LpVariable(name=f"x_{i}_{j}", cat=LpBinary) for i in E for j in P}

    alpha1 = weights[0]
    alpha2 = weights[1]
    alpha3 = weights[2]
    
    # This is constant C used in penalty
    # In model V2 it is not dynamic
    C = 10

    # Z fn 
    prob += lpSum(
        x[i, j] * (
            alpha1 * affinity.get((i, j), 0) +
            alpha2 * matching_score(i, j, t_pref, t_prim, t_anx, t_aimes) +
            alpha3 * progression(i, j, difficulty, N, note, difficulty_old) -
            C * (1 - M(i, j, affinity))
        ) for (i, j) in x
    )

    # Constraint 1
    for j in P:
        prob += lpSum(x[i, j] for i in E if (i, j) in x) <= places[j]

    # Constraint 2
    for i in E:
        prob += lpSum(x[i, j] for j in P if (i, j) in x) == 1

    # Constraint 3
    for (i1, i2) in B_minus:
        for j in P:
            if (i1, j) in x and (i2, j) in x:
                prob += x[i1, j] + x[i2, j] <= 1

    # Constraint 4
    # Delta will soon be dynamically imported by superuser
    delta = 4
    for j in P:
        adi1 = lpSum(x[i, j] for i in E if classe[i] == "ADI1" and (i, j) in x)
        adi2 = lpSum(x[i, j] for i in E if classe[i] == "ADI2" and (i, j) in x)
        prob += (adi1 - adi2 <= delta)
        prob += (adi2 - adi1 <= delta)

    prob.solve()

    # Results :
    # when no solution are found :
    # In production => block solver exec and quit
    # In test mode => return empty solutions
    if LpStatus[prob.status] != "Optimal":
        print(f"Aucune solution optimale trouvée. Statut : {LpStatus[prob.status]}")
        if exec_mode == "test":
            return {
                #"results": [],
                #"Z": None,
                #"nb_affectés": 0,
                #"satisfaction_score": None,
                #"matching_score": None,
                #"progression_rate": None,
                #"balance_std": None,
                "constraint_ok": False
            }
        else:
            exit(1)

    results = []
    for (i, j) in x:
        if x[i, j].value() == 1:
            results.append({"studentId": i, "projectId": j})

    return {
        #"results": results,
        #"Z": prob.objective.value(),
        #"nb_affectés": len(results),
        #"satisfaction_score": sum(affinity.get((r["studentId"], r["projectId"]), 0) for r in results) / len(results),
        #"matching_score": sum(matching_score(r["studentId"], r["projectId"], t_pref, t_prim, t_anx, t_aimes) for r in results) / len(results),
        #"progression_rate": sum(progression(r["studentId"], r["projectId"], difficulty, N, note, difficulty_old) for r in results) / len(results),
        #"balance_std": compute_balance_std(results, classe, P),
        "constraint_ok": True
    }

# Is used for benchmarking
def compute_balance_std(results, classe, P):
    counts = {p: {'ADI1': 0, 'ADI2': 0} for p in P}
    for r in results:
        student = r["studentId"]
        project = r["projectId"]
        grp = classe[student]
        counts[project][grp] += 1
    ratios = [abs(v['ADI1'] - v['ADI2']) for v in counts.values()]
    return statistics.stdev(ratios) if len(ratios) > 1 else 0

def main():
    # command line arguments : 
    # --exec : test or api
    # --mode : usage profiles
    # --dataset : only for test mode -> path to dataset
    parser = argparse.ArgumentParser(description="Solveur d'affectation E ⇨ P")
    parser.add_argument('--exec', choices=['test', 'api'], default='api', help="Execution mode : test or api (stdin JSON)")
    parser.add_argument('--mode', choices=['balance', 'satisfaction', 'matching', 'progression', 'performance'], default='balance', help="Usage types : learn or happiness or balance or soft or performance")
    parser.add_argument(
    '--dataset',
    type=str,
    default="datasets.template",
    help="Import path to the dataset Python module (ex: datasets.template)"
    )
    args = parser.parse_args()
    path_to_data = args.dataset
   
    #Usage profiles
    weights = MODES[args.mode]

    if args.exec == 'test':
        data = load_test_data(path_to_data)
        metrics = solve(*data, weights, args.exec)
        metrics["dataset"] = path_to_data.split('.')[-1]
        metrics["mode"] = args.mode
        # Final result is used for benchmarking
        print(json.dumps(metrics, ensure_ascii=False)) 
    else:   
        data = load_api_data()
        metrics = solve(*data, weights, args.exec)
        # final result saved will be saved into mongodb solverSnapshot
        print(json.dumps(metrics["results"], ensure_ascii=False))

if __name__ == "__main__":
    main()