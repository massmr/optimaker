# SynkronX

**Optimaker** est une application open-source conçue pour résoudre un problème concret que rencontrent de nombreux enseignants : répartir équitablement les étudiants dans des projets, tout en respectant leurs préférences, leurs affinités, et certaines contraintes pédagogiques.

Ce projet est né d’un besoin réel dans le cadre d’un semestre d’ingénierie à JUNIA ISEN. En tant qu'étudiant développeur, j’ai voulu transformer une contrainte de groupe en opportunité de création : proposer à mon encadrant une solution fonctionnelle, intuitive, et réutilisable — tout en respectant les exigences de mon module mathématique (résolution via PulP) et les réalités de terrain (interfaces accessibles pour tous les rôles).

Le code est clair, documenté, et conçu pour être déployé rapidement. Tout le monde peut s’inscrire, déposer un projet, ou noter ses préférences. Une fois les paramètres validés, le solveur se charge de proposer une affectation optimale.

---

## Pourquoi ce projet ?

- Pour rendre l’affectation plus juste et plus transparente.
- Pour éviter les répartitions manuelles longues et sources de frustration.
- Pour donner aux étudiants un vrai sentiment de prise en compte de leurs envies.
- Pour servir de démonstrateur dans un portfolio professionnel (open-source first).

---

## À qui s’adresse Optimaker ?

- Aux enseignants souhaitant automatiser des répartitions tout en gardant le contrôle.
- Aux étudiants curieux de comprendre comment leurs préférences sont valorisées.
- Aux établissements ou clubs souhaitant une plateforme de gestion de projets pédagogiques.

---

## Utilisateurs

Optimaker repose sur trois profils distincts :

### SuperUser (professeur principal)

- Définit les paramètres globaux (ex. `delta_tolerance`)
- Lance le solveur PulP
- Consulte les statistiques globales (satisfaction, équilibre)
- Exporte les résultats
- Verrouille l’édition après la répartition

### Apporteur de projet

- Propose des projets (titre, thématiques, difficulté, places)
- Modifie ou supprime ses projets tant que la résolution n’a pas été lancée
- Accède à la liste de ses projets

### Étudiant

- Renseigne sa classe (ADI_1 ou ADI_2)
- Choisit sa thématique préférée et ses thématiques aimées
- Donne une affinité à chaque projet (0 à 4)
- Consulte son projet attribué après la résolution

---

## Stack & architecture

Le projet est composé de 3 briques principales :

- **Frontend Angular** : pour une interface utilisateur fluide, réactive, et propre.
- **Backend Node.js (Express) MongoDB** : gestion des routes API, de la base MongoDB et de la logique de sécurité.
- **Solveur Python (PulP)** : résout le problème d’affectation selon un modèle d’optimisation linéaire.
