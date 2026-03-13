# Guide : Mettre une formation en ligne sur Win Academy

Ce guide explique comment publier une formation complète sur la plateforme, étape par étape. Pas besoin d'être développeur — il suffit de suivre les étapes dans l'ordre.

---

## Vue d'ensemble du processus

Une formation sur Win Academy est structurée ainsi :

```
Catégorie
  └── Formation
        ├── Module 1
        │     ├── Contenu 1 (ex: vidéo d'introduction)
        │     ├── Contenu 2 (ex: PDF de cours)
        │     └── Contenu 3 (ex: résumé texte)
        ├── Module 2
        │     ├── Contenu 1
        │     └── Contenu 2
        └── Module 3
              └── ...
```

Il faut donc construire de haut en bas : d'abord la catégorie, puis la formation, puis les modules, puis les contenus.

---

## Étape 1 — Créer une catégorie (si elle n'existe pas déjà)

Une catégorie regroupe des formations du même domaine (ex: Mathématiques, Français, Sciences, etc.).

**Ce qu'il faut renseigner :**
- **Nom** : le nom de la catégorie (ex: "Mathématiques")
- **Description** : une description courte (ex: "Cours de mathématiques pour tous niveaux")
- **Âge minimum** : l'âge minimum recommandé pour accéder aux formations de cette catégorie
- **Âge maximum** : l'âge maximum recommandé
- **Image** : une image représentant la catégorie (optionnel)

> Si une catégorie adaptée existe déjà, passez directement à l'étape 2.

---

## Étape 2 — Créer la formation

La formation est le "cours principal". Elle appartient à une catégorie.

**Ce qu'il faut renseigner :**
- **Titre** : le nom de la formation (ex: "Algèbre pour débutants")
- **Description courte** : une phrase d'accroche affichée dans la liste (ex: "Maîtrise les équations du premier degré en 2 heures")
- **Description complète** : le descriptif détaillé affiché sur la page de la formation
- **Niveau** : `DEBUTANT`, `INTERMEDIAIRE` ou `AVANCE`
- **Durée** : durée estimée en minutes (ex: `120` pour 2 heures)
- **Prix** : en FCFA. Mettre `0` si la formation est gratuite (ex: `5000` pour une formation à 5 000 FCFA)
- **Image** : une image de couverture de la formation (optionnel)
- **Catégorie** : la catégorie à laquelle appartient cette formation

> À ce stade, la formation existe en base mais elle est vide. Les apprenants ne verront encore aucun contenu.

---

## Étape 3 — Créer les modules

Un module est un chapitre de la formation. Une formation peut avoir autant de modules que nécessaire.

**Ce qu'il faut renseigner pour chaque module :**
- **Titre** : le nom du chapitre (ex: "Chapitre 1 : Les équations du premier degré")
- **Description** : une brève description de ce que couvre ce chapitre (optionnel)
- **Ordre** : la position du module dans la formation. Le module 1 apparaît en premier, le module 2 en deuxième, etc.
- **Formation** : la formation à laquelle appartient ce module

**Combien de modules ?** Autant que nécessaire. Il n'y a pas de limite. En général, on découpe selon les grandes thématiques du cours. Pour une formation de 2 heures, 3 à 5 modules est une bonne fourchette.

> Les modules seront toujours affichés dans l'ordre croissant (1, 2, 3...). Si vous créez le module 3 avant le module 1, il apparaîtra quand même en troisième position.

---

## Étape 4 — Ajouter les contenus dans chaque module

Un contenu est un élément pédagogique concret : une vidéo, un PDF, un texte, ou une image. Chaque module peut contenir plusieurs contenus.

**Les 4 types de contenu disponibles :**

| Type | Usage | Ce qu'il faut fournir |
|------|-------|----------------------|
| `VIDEO` | Vidéo YouTube, Vimeo, etc. | L'URL de la vidéo |
| `PDF` | Document PDF hébergé en ligne | L'URL du fichier PDF |
| `IMAGE` | Image pédagogique | L'URL de l'image |
| `TEXT` | Texte rédigé directement | Le contenu du texte |

**Ce qu'il faut renseigner pour chaque contenu :**
- **Type** : `VIDEO`, `PDF`, `TEXT` ou `IMAGE`
- **Titre** : le nom du contenu (ex: "Vidéo d'introduction", "Fiche de révision")
- **URL** : l'adresse du fichier (pour VIDEO, PDF, IMAGE)
- **Texte** : le contenu rédigé (pour TEXT uniquement)
- **Ordre** : la position du contenu dans le module (1 = affiché en premier)
- **Module** : le module auquel appartient ce contenu

**Combien de contenus par module ?** Il n'y a pas de limite. Une bonne pratique est de varier les types :
- 1 vidéo d'introduction
- 1 ou 2 PDF de cours
- 1 résumé texte

> Les contenus sont affichés dans l'ordre croissant à l'intérieur du module.

---

## Étape 5 — Vérifier avant de partager

Avant de communiquer la formation aux apprenants, vérifiez :

- [ ] La formation a bien un titre, une description courte, un niveau et un prix
- [ ] Tous les modules sont dans le bon ordre
- [ ] Chaque module a au moins un contenu
- [ ] Les URLs des vidéos et PDFs fonctionnent bien (testez-les dans un navigateur)
- [ ] L'image de couverture s'affiche correctement

---

## Étape 6 (optionnel) — Ajouter une évaluation finale

Une fois la formation complète et les contenus en ligne, vous pouvez ajouter une évaluation finale (quiz) pour que les apprenants puissent valider leurs acquis et obtenir un certificat.

Cette étape est **optionnelle** — une formation sans évaluation est tout à fait valide. Si vous souhaitez en ajouter une, voici ce qu'il faudra préciser :

- **Score minimum pour réussir** : en pourcentage (ex: `70` = il faut avoir 70% de bonnes réponses)
- **Nombre maximum de tentatives** : combien de fois un apprenant peut repasser l'évaluation (ex: `3`)
- **Durée limite** : en minutes (ex: `30` pour 30 minutes. Optionnel)
- **Les questions** : chaque question a 4 réponses possibles, dont une seule est correcte

> Un apprenant qui réussit l'évaluation reçoit automatiquement un certificat numérique.

---

## Récapitulatif de l'ordre des actions

1. Créer la catégorie (si elle n'existe pas)
2. Créer la formation dans cette catégorie
3. Créer les modules un par un (dans l'ordre)
4. Pour chaque module, ajouter les contenus (vidéos, PDFs, textes)
5. Vérifier que tout est correct
6. (Optionnel) Créer l'évaluation finale avec ses questions

---

> **Bon à savoir :** une formation peut être modifiée à tout moment. Si des apprenants sont déjà inscrits, seuls le prix, l'image et la description courte peuvent être changés — le contenu pédagogique (titre, modules, chapitres) reste figé pour ne pas perturber leur progression.
