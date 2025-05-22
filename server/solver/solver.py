# Please read ./modelisation_V1.md

from pulp import LpProblem, LpMaximize, LpVariable, lpSum, LpBinary
import json
import sys

# Test dataset
"""
E = ["e1", "e2", "e3"] # Students (Etudiants)
P = ["p1", "p2"] # Projects
T = ["Low-tech", "Programmation", "Mecanique"] # Themes

places = {"p1": 2, "p2": 2} # Places max 
classe = {"e1": "ADI1", "e2": "ADI2", "e3": "ADI1"} # student-class

# Affinities
affinity = {("e1", "p1"): 3, ("e1", "p2"): 4,
     ("e2", "p1"): 0, ("e2", "p2"): 2,
     ("e3", "p1"): 2, ("e3", "p2"): 2}

# Themes matching
t_pref = {"e1": "Programmation", "e2": "Mecanique", "e3": "Low-tech"}
t_aimes = {"e1": ["Low-tech"], "e2": ["Low-tech", "Programmation"], "e3": ["Mecanique"]}
t_prim = {"p1": "Programmation", "p2": "Low-tech", "p3": "Mecanique"}
t_anx = {"p1": ["Mecanique"], "p2": ["Mecanique"], "p3": ["Low-tech", "Programmation"]}

# Difficulty levels
difficulty = {"p1": 2, "p2": 3, "p3": 4}

# Old notes
N = [("e1", "p1_old"), ("e1", "p2_old"), ("e3", "p2_old")] # N = Notes set
note = {("e1", "p1_old"): 15, ("e1", "p2_old"): 10, ("e3", "p2_old"): 12}
difficulty_old = {"p1_old": 2, "p2_old": 4}

# Forbidden pairs
B_minus = [("e1", "e2")]
"""
# Test dataset end

# JSON Mapping
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

# TO DO : Complete alongside app features evolution
N = []
note = {}
difficulty_old = {}
classe = {e: "ADI1" for e in E}
B_minus = []

# Subset functions

# In doc : m(i,j) => matching_score(i,j)
# In doc : prog(i,j) => progression(i,j)
def matching_score(i, j):
    score = 0
    if t_pref[i] == t_prim[j]:
        score += 10
    if t_pref[i] in t_anx[j]:
        score += 5
    if t_prim[j] in t_aimes[i]:
        score += 3
    for t in t_aimes[i]:
        if t in t_anx[j]:
            score += 1
    return score

def n_perf(i):
    notes = [(note[(i, p)], difficulty_old[p]) for (e, p) in N if e == i]
    if not notes:
        return 2.0
    total_weight = sum(w for (_, w) in notes)
    weighted_sum = sum(n * w for (n, w) in notes)
    return (weighted_sum / total_weight) * (4 / 20)

def epsilon(i):
    return 0.25 * n_perf(i) + 0.25

def progression(i, j):
    return 1 if n_perf(i) - difficulty[j] + epsilon(i) >= 0 else 0

def M(i, j):
    return 1 if affinity.get((i, j), 0) > 0 else 0

# =====================================================
# ================== Z & Constraints ==================
# =====================================================

prob = LpProblem("Affectation_E_P", LpMaximize)

# Decision var
x = {(i, j): LpVariable(name=f"x_{i}_{j}", cat=LpBinary) for i in E for j in P}

# Dynamic weights
alpha1, alpha2, alpha3 = 0.5, 1.0, 0.2

# Penalty
C = 100

# Z Fn
prob += lpSum(
    x[i, j] * (
        alpha1 * affinity.get((i, j), 0) +
        alpha2 * matching_score(i, j) +
        alpha3 * progression(i, j) -
        C * (1 - M(i, j))
    ) for (i, j) in x
)

# Constraint 1 : capacity
for j in P:
    prob += lpSum(x[i, j] for i in E if (i, j) in x) <= places[j]

# Constraint 2 : only one student in one project
for i in E:
    prob += lpSum(x[i, j] for j in P if (i, j) in x) == 1

# Constraint 3 : Forbidden pairs
for (i1, i2) in B_minus:
    for j in P:
        if (i1, j) in x and (i2, j) in x:
            prob += x[i1, j] + x[i2, j] <= 1

# Constraint 4 : ADI1/ADI2 balance
delta = 1
for j in P:
    adi1 = lpSum(x[i, j] for i in E if classe[i] == "ADI1" and (i, j) in x)
    adi2 = lpSum(x[i, j] for i in E if classe[i] == "ADI2" and (i, j) in x)
    prob += (adi1 - adi2 <= delta)
    prob += (adi2 - adi1 <= delta)

# Resolve
prob.solve()

# Results 
results = []
for (i, j) in x:
    if x[i, j].value() == 1:
        results.append({"studentId": i, "projectId": j})

print(json.dumps(results, ensure_ascii=False))