# WIN ACADEMY — Documentation API Flux Apprenant

> **URL de base (production) :** `https://win-academy-backend.onrender.com`
> **URL de base (local) :** `http://localhost:3000`

Les routes protégées nécessitent le header :
```
Authorization: Bearer <accessToken>
```

---

## Parcours utilisateur — dans quel ordre appeler les routes

Voici l'ordre logique des appels API selon les écrans de l'application :

```
1. [Page catalogue]      GET /categories          → liste les catégories avec leurs formations
2. [Page catalogue]      GET /formations          → liste toutes les formations (avec modules et inscrits)
3. [Page formation]      GET /formations/:id      → détail d'une formation (plan du cours, éval)
4. [Bouton "S'inscrire"] POST /auth/login         → récupérer le token (si pas connecté)
5. [Bouton "S'inscrire"] POST /enrollments        → s'inscrire à la formation
6. [Espace apprenant]    GET /enrollments/mine    → mes formations en cours
7. [Lecteur de cours]    GET /contents/:id        → lire un contenu (1 appel par leçon)
8. [Fin de formation]    GET /evaluations/:id     → charger le quiz
9. [Fin de formation]    POST /attempts           → soumettre les réponses
10. [Page résultat]      GET /attempts/:id        → afficher le score
11. [Page certificats]   GET /certificates/mine   → voir mes certificats obtenus
12. [Page vérification]  GET /certificates/verify/:code → vérifier un certificat (public)
```

---

## Règles d'accès

| Route | Authentification | Condition supplémentaire |
|-------|-----------------|--------------------------|
| `GET /categories` | ❌ public | — |
| `GET /formations` | ❌ public | — |
| `GET /formations/:id` | ❌ public | — |
| `GET /formations/:id/modules` | ❌ public | — |
| `GET /modules/:id` | ❌ public | — |
| `POST /auth/login` | ❌ public | — |
| `GET /auth/me` | ✅ token valide | — |
| `GET /auth/dashboard` | ✅ token valide | — |
| `POST /enrollments` | ✅ token valide | — |
| `GET /enrollments/mine` | ✅ token valide | — |
| `GET /enrollments/:id` | ✅ token valide | — |
| `PATCH /enrollments/:id/progress` | ✅ token valide | — |
| `GET /contents/:id` | ✅ token valide | Être inscrit à la formation |
| `GET /evaluations/:id` | ✅ token valide | — |
| `POST /attempts` | ✅ token valide | — |
| `GET /attempts/:id` | ✅ token valide | — |
| `GET /certificates/mine` | ✅ token valide | — |
| `GET /certificates/verify/:code` | ❌ public | — |
| `GET /certificates/:id` | ✅ token valide | — |

---

## 1. Authentification

> **À faire en premier.** Le token retourné par `/auth/login` est à inclure dans **tous** les appels protégés. Le stocker en mémoire (state global / localStorage).

### POST `/auth/login` — Connexion
**Accès :** public

**Body :**
```json
{ "email": "n969601@gmail.com", "password": "N@than16" }
```

**Réponse 200 :**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "e057f4b7-ba5b-4440-8e8b-d5146144c7ae",
    "firstName": "Nathan",
    "lastName": "Voglossou",
    "email": "n969601@gmail.com",
    "role": "LEARNER"
  }
}
```

> Stocker `accessToken` immédiatement. Il expire — si une route retourne `401`, refaire un login pour obtenir un nouveau token.

**Erreurs :**
- `401` — Email ou mot de passe incorrect

---

### GET `/auth/me` — Profil de l'utilisateur connecté
**Accès :** token valide

> Appeler cette route au chargement de l'app pour vérifier si le token stocké est encore valide, et récupérer les infos de l'utilisateur connecté (nom, rôle...).

**Réponse 200 :** mêmes champs que le `user` du login.

**Erreurs :**
- `401` — Token expiré ou invalide → rediriger vers la page de login

---

## 2. Catégories

> Utiliser pour construire la **page d'accueil** ou un menu de filtrage. Chaque catégorie inclut déjà ses formations — pas besoin d'un appel supplémentaire pour l'affichage catalogue par catégorie.

### GET `/categories` — Liste des catégories
**Accès :** public | **Status :** ✅ 200 OK

**Query params :** `page` (défaut: 1), `limit` (défaut: 10)

**Réponse 200 :**
```json
{
  "data": [
    {
      "id": "0b519345-8b02-4a1c-b826-f7b888cf4727",
      "name": "Anglais",
      "description": "Apprenez à vous exprimez librement en Anglais",
      "image": null,
      "ageMin": 12,
      "ageMax": 40,
      "createdAt": "2026-03-12T17:22:33.074Z",
      "formations": [
        {
          "id": "b9b74424-d3c7-4cbb-85b0-ba52f12267de",
          "title": "English Fundamentals That Open Doors",
          "shortDescription": "un cours d'anglais professionnel",
          "level": "DEBUTANT",
          "duration": 30,
          "price": 0,
          "image": null,
          "categoryId": "0b519345-8b02-4a1c-b826-f7b888cf4727",
          "createdAt": "2026-03-12T18:12:52.226Z"
        }
      ]
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

> `price: 0` = formation gratuite → afficher le badge "Gratuit". `level` peut valoir `DEBUTANT`, `INTERMEDIAIRE`, `AVANCE`.

---

### GET `/categories/:id` — Une catégorie par ID
**Accès :** public | **Status :** ✅ 200 OK

**Réponse 200 :**
```json
{
  "id": "0db2b6eb-a655-48a9-b9fd-8fc26e9cee66",
  "name": "Education communautaire",
  "description": "",
  "image": null,
  "ageMin": 6,
  "ageMax": 18,
  "createdAt": "2026-03-12T17:35:11.074Z",
  "formations": []
}
```

**Erreurs :**
- `404` — Catégorie introuvable

---

## 3. Formations

> `GET /formations` est idéal pour la **page catalogue**. `GET /formations/:id` est idéal pour la **page de détail d'une formation** (syllabus complet, bouton "S'inscrire").
>
> **Important :** les contenus (body, url) sont masqués sur ces routes publiques — l'apprenant voit le plan du cours, pas le contenu. Pour lire le contenu réel, il doit s'inscrire puis appeler `GET /contents/:id`.

### GET `/formations` — Liste des formations
**Accès :** public | **Status :** ✅ 200 OK

**Query params :** `page` (défaut: 1), `limit` (défaut: 10)

**Réponse 200 :** liste paginée de formations, chacune incluant sa catégorie, ses modules (triés par ordre), et le nombre d'inscrits.

```json
{
  "data": [
    {
      "id": "b9b74424-d3c7-4cbb-85b0-ba52f12267de",
      "title": "English Fundamentals That Open Doors",
      "shortDescription": "un cours d'anglais professionnel",
      "fullDescription": "...",
      "level": "DEBUTANT",
      "duration": 30,
      "price": 0,
      "image": null,
      "categoryId": "0b519345-8b02-4a1c-b826-f7b888cf4727",
      "createdAt": "2026-03-12T18:12:52.246Z",
      "category": { "id": "...", "name": "Anglais", "ageMin": 12, "ageMax": 40 },
      "modules": [
        { "id": "...", "title": "MODULE 1 — L'alphabet et les sons de l'anglais", "order": 1 }
      ],
      "_count": { "enrollments": 0 }
    }
  ],
  "meta": { "total": 2, "page": 1, "limit": 20, "totalPages": 1 }
}
```

> `_count.enrollments` = nombre total d'apprenants inscrits → utile pour afficher "X apprenants".

---

### GET `/formations/:id` — Une formation par ID
**Accès :** public | **Status :** ✅ 200 OK

> Appeler cette route quand l'apprenant clique sur une formation. Elle retourne le **syllabus complet** (tous les modules et leurs leçons) et les paramètres du quiz (`evaluation`). Récupérer l'`evaluation.id` ici — il sera utile plus tard pour charger le quiz.

**Réponse 200 :** détail complet de la formation — catégorie, tous les modules triés par ordre avec la liste de leurs contenus (titres uniquement, sans `body` ni `url`), et l'évaluation finale.

```json
{
  "id": "b9b74424-d3c7-4cbb-85b0-ba52f12267de",
  "title": "English Fundamentals That Open Doors",
  "level": "DEBUTANT",
  "duration": 30,
  "price": 0,
  "category": { "id": "...", "name": "Anglais" },
  "modules": [
    {
      "id": "e7224993-...",
      "title": "MODULE 1 — L'alphabet et les sons de l'anglais",
      "order": 1,
      "contents": [
        { "id": "7b50e542-...", "type": "TEXT", "title": "Les 26 lettres de l'alphabet anglais", "order": 1, "moduleId": "...", "createdAt": "..." },
        { "id": "4d087475-...", "type": "TEXT", "title": "Les voyelles et leur importance", "order": 2, "moduleId": "...", "createdAt": "..." }
      ]
    }
  ],
  "evaluation": {
    "id": "22ed8eaf-0302-41bf-8d56-1f4615538d90",
    "passingScore": 70,
    "maxAttempts": 3,
    "timeLimit": 20
  }
}
```

> **À retenir :** stocker `formation.evaluation.id` si vous voulez afficher le bouton "Passer le quiz" sans refaire d'appel. Les `contents[].id` sont les IDs à passer à `GET /contents/:id` une fois l'apprenant inscrit.

**Erreurs :**
- `404` — Formation introuvable

---

### GET `/formations/:id/modules` — Modules d'une formation
**Accès :** public | **Status :** ✅ 200 OK

> Moins utilisé que `GET /formations/:id` qui inclut déjà les modules. Utile si vous avez besoin du champ `description` de chaque module (absent dans la route formations).

**Réponse 200 :** tableau de modules triés par ordre croissant, contenus sans `body` ni `url`.

```json
[
  {
    "id": "e7224993-f329-46d0-be50-031fa55f1947",
    "title": "MODULE 1 — L'alphabet et les sons de l'anglais",
    "description": "Apprendre à lire, prononcer et reconnaître les lettres de l'alphabet anglais",
    "order": 1,
    "formationId": "b9b74424-d3c7-4cbb-85b0-ba52f12267de",
    "createdAt": "2026-03-12T19:34:27.156Z",
    "contents": [
      { "id": "...", "type": "TEXT", "title": "Les 26 lettres de l'alphabet anglais", "order": 1, "moduleId": "...", "createdAt": "..." }
    ]
  }
]
```

**Erreurs :**
- `404` — Formation introuvable

---

## 4. Modules

### GET `/modules/:id` — Un module par ID
**Accès :** public | **Status :** ✅ 200 OK

> Utile si vous affichez une page dédiée à un module, avec son titre, sa description, la liste de ses leçons et la formation parente (pour le fil d'Ariane).

**Réponse 200 :** détail du module avec ses contenus et la formation parente.

```json
{
  "id": "05be0ac3-4565-4af3-8989-2a76a092fbdb",
  "title": "MODULE 6 — Construire des phrases et progresser",
  "description": "Consolider les acquis, apprendre les temps de base...",
  "order": 6,
  "formationId": "b9b74424-d3c7-4cbb-85b0-ba52f12267de",
  "createdAt": "2026-03-12T19:57:01.110Z",
  "contents": [
    { "id": "...", "type": "TEXT", "title": "Le présent simple", "order": 1, "moduleId": "...", "createdAt": "..." }
  ],
  "formation": {
    "id": "b9b74424-d3c7-4cbb-85b0-ba52f12267de",
    "title": "English Fundamentals That Open Doors",
    "level": "DEBUTANT",
    "price": 0
  }
}
```

**Erreurs :**
- `404` — Module introuvable

---

## 5. Inscriptions

> **L'inscription est le point de bascule.** Une fois inscrit, l'apprenant peut lire les contenus. Sans inscription → `403` sur `GET /contents/:id`.
>
> **Workflow :**
> 1. L'utilisateur clique "S'inscrire" sur une formation
> 2. Si pas connecté → rediriger vers login → revenir sur la formation
> 3. `POST /enrollments` avec le `formationId`
> 4. Stocker l'`enrollment.id` retourné → il servira pour `PATCH /enrollments/:id/progress`

### POST `/enrollments` — S'inscrire à une formation
**Accès :** token valide | **Status :** ✅ 201 Created

**Body :**
```json
{ "formationId": "b9b74424-d3c7-4cbb-85b0-ba52f12267de" }
```

**Réponse 201 :**
```json
{
  "id": "00fb2446-123b-41ab-9315-e30e42525237",
  "userId": "e057f4b7-...",
  "formationId": "b9b74424-...",
  "progressPercentage": 0,
  "status": "IN_PROGRESS",
  "enrolledAt": "2026-03-13T09:35:29.580Z",
  "user": { "id": "...", "firstName": "Nathan", "lastName": "Voglossou", "email": "...", "role": "LEARNER" },
  "formation": { "id": "...", "title": "English Fundamentals That Open Doors", "level": "DEBUTANT", "price": 0 }
}
```

> **Important :** retourner `409` si déjà inscrit — ne pas afficher une erreur à l'utilisateur dans ce cas, juste le rediriger vers la formation.

**Erreurs :**
- `400` — Âge de l'apprenant hors de la tranche autorisée par la catégorie (`ageMin`–`ageMax`)
- `404` — Formation introuvable
- `409` — Déjà inscrit à cette formation → traiter comme un succès côté UI, rediriger

---

### GET `/enrollments/mine` — Mes inscriptions
**Accès :** token valide | **Status :** ✅ 200 OK

> Appeler sur la **page "Mes formations"** ou le **tableau de bord apprenant**. Retourne toutes les formations en cours avec leur progression.

**Réponse 200 :** tableau des inscriptions de l'utilisateur connecté, chacune incluant la formation avec sa catégorie et ses modules (titres).

```json
[
  {
    "id": "00fb2446-123b-41ab-9315-e30e42525237",
    "userId": "e057f4b7-...",
    "formationId": "b9b74424-...",
    "progressPercentage": 0,
    "status": "IN_PROGRESS",
    "enrolledAt": "2026-03-13T09:35:29.580Z",
    "formation": {
      "id": "...",
      "title": "English Fundamentals That Open Doors",
      "level": "DEBUTANT",
      "price": 0,
      "category": { "id": "...", "name": "Anglais" },
      "modules": [
        { "id": "...", "title": "MODULE 1 — L'alphabet et les sons de l'anglais", "order": 1 }
      ]
    }
  }
]
```

> `status` peut valoir `IN_PROGRESS` ou `COMPLETED`. Afficher une barre de progression avec `progressPercentage`.

---

### GET `/enrollments/:id` — Une inscription par ID
**Accès :** token valide | **Status :** ✅ 200 OK

> Utile pour rafraîchir les données d'une inscription précise (progression, statut). Moins utilisé que `GET /enrollments/mine`.

**Réponse 200 :** détail de l'inscription avec l'utilisateur et la formation avec ses modules et contenus (sans body ni url).

```json
{
  "id": "00fb2446-123b-41ab-9315-e30e42525237",
  "userId": "e057f4b7-ba5b-4440-8e8b-d5146144c7ae",
  "formationId": "b9b74424-d3c7-4cbb-85b0-ba52f12267de",
  "progressPercentage": 50,
  "status": "IN_PROGRESS",
  "enrolledAt": "2026-03-13T09:35:29.580Z",
  "user": {
    "id": "e057f4b7-...",
    "firstName": "Nathan",
    "lastName": "Voglossou",
    "email": "n969601@gmail.com",
    "role": "LEARNER",
    "status": "ACTIVE",
    "createdAt": "2026-03-12T08:55:09.265Z"
  },
  "formation": {
    "id": "b9b74424-...",
    "title": "English Fundamentals That Open Doors",
    "modules": [
      {
        "id": "e7224993-...",
        "title": "MODULE 1 — L'alphabet et les sons de l'anglais",
        "order": 1,
        "contents": [
          { "id": "7b50e542-...", "type": "TEXT", "title": "Les 26 lettres de l'alphabet anglais", "order": 1, "moduleId": "...", "createdAt": "..." }
        ]
      }
    ]
  }
}
```

**Erreurs :**
- `404` — Inscription introuvable

---

### PATCH `/enrollments/:id/progress` — Mettre à jour la progression
**Accès :** token valide | **Status :** ✅ 200 OK

> Appeler cette route **après que l'apprenant termine chaque leçon** pour mettre à jour sa progression. Calculer le pourcentage côté front : `(leçons terminées / total leçons) * 100`.

**Body :**
```json
{ "progressPercentage": 50 }
```

**Réponse 200 :**
```json
{
  "id": "00fb2446-123b-41ab-9315-e30e42525237",
  "userId": "e057f4b7-...",
  "formationId": "b9b74424-...",
  "progressPercentage": 50,
  "status": "IN_PROGRESS",
  "enrolledAt": "2026-03-13T09:35:29.580Z"
}
```

> `status` passe automatiquement à `COMPLETED` si `progressPercentage` atteint 100. Ne pas envoyer de valeur > 100 (retourne `400`).

**Erreurs :**
- `400` — progressPercentage hors de la plage 0–100
- `404` — Inscription introuvable

---

## 6. Contenus

> **L'apprenant doit être inscrit** pour accéder aux contenus. Si vous recevez `403`, vérifier l'inscription avant de rediriger.
>
> **Workflow dans le lecteur de cours :**
> 1. Récupérer la liste des `contents[].id` depuis `GET /formations/:id` (ou `GET /enrollments/mine`)
> 2. Quand l'apprenant ouvre une leçon → `GET /contents/:id`
> 3. Quand il la termine → `PATCH /enrollments/:id/progress` avec le nouveau pourcentage

### GET `/contents/:id` — Lire un contenu
**Accès :** token valide + inscrit à la formation | **Status :** ✅ 200 OK

**Réponse 200 :** contenu complet avec `body` et `url`, et le module parent.

```json
{
  "id": "7b50e542-6082-49c9-bb33-74c058b94506",
  "type": "TEXT",
  "title": "Les 26 lettres de l'alphabet anglais",
  "url": "",
  "body": "L'alphabet anglais contient 26 lettres...",
  "order": 1,
  "moduleId": "e7224993-f329-46d0-be50-031fa55f1947",
  "createdAt": "2026-03-12T19:36:02.376Z",
  "module": {
    "id": "e7224993-...",
    "title": "MODULE 1 — L'alphabet et les sons de l'anglais",
    "order": 1,
    "formationId": "b9b74424-d3c7-4cbb-85b0-ba52f12267de"
  }
}
```

> `type` peut valoir `TEXT`, `VIDEO`, ou `PDF`. Si `type = TEXT` → afficher `body`. Si `type = VIDEO` ou `PDF` → utiliser `url`. Le champ `url` peut être vide si le contenu n'a pas encore de fichier.

**Erreurs :**
- `401` — Token manquant ou invalide
- `403` — Non inscrit à la formation parente → afficher un message "Inscrivez-vous pour accéder à ce contenu"
- `404` — Contenu introuvable

---

## 7. Évaluations

> Appeler cette route pour **charger le quiz** à la fin d'une formation. L'`evaluationId` est disponible dans `GET /formations/:id` (champ `evaluation.id`).
>
> **Ne pas afficher le bouton "Passer le quiz" si `maxAttempts` est déjà atteint** — vérifier en comptant les tentatives existantes.
>
> **Attention :** `isCorrect` est volontairement absent des réponses — l'apprenant ne voit pas les bonnes réponses avant de soumettre.

### GET `/evaluations/:id` — Voir une évaluation avec ses questions
**Accès :** token valide | **Status :** ✅ 200 OK

**Réponse 200 :** évaluation avec ses paramètres, la formation parente, et toutes les questions avec leurs choix de réponses.

```json
{
  "id": "22ed8eaf-0302-41bf-8d56-1f4615538d90",
  "formationId": "b9b74424-d3c7-4cbb-85b0-ba52f12267de",
  "passingScore": 70,
  "maxAttempts": 3,
  "timeLimit": 20,
  "formation": { "id": "b9b74424-...", "title": "English Fundamentals That Open Doors", "level": "DEBUTANT", "price": 0 },
  "questions": [
    {
      "id": "e0320210-464d-404c-9c29-2cba8429816e",
      "questionText": "Comment se prononce la lettre \"H\" en anglais ?",
      "answers": [
        { "id": "5059b948-...", "answerText": "A. Elle est muette, comme en français" },
        { "id": "ca0596e6-...", "answerText": "B. Elle produit un souffle d'air" },
        { "id": "1d5fc67a-...", "answerText": "C. Elle se prononce \"ach\"" },
        { "id": "a8443164-...", "answerText": "D. Elle se prononce \"ka\"" }
      ]
    }
  ]
}
```

> `passingScore: 70` = 70% minimum pour valider. `maxAttempts: 3` = 3 essais max. `timeLimit: 20` = 20 minutes (gérer le chrono côté front). Stocker le `question.id` et les `answer.id` — ce sont les valeurs à envoyer dans `POST /attempts`.

**Erreurs :**
- `401` — Token manquant ou invalide
- `404` — Évaluation introuvable

---

## 8. Tentatives

> **Workflow de soumission du quiz :**
> 1. L'apprenant répond à toutes les questions → stocker les paires `{ questionId, answerId }` dans le state
> 2. Il clique "Soumettre" → `POST /attempts`
> 3. Lire `score` et `passed` dans la réponse pour afficher le résultat
> 4. Si `passed: true` → afficher "Félicitations !" et proposer "Voir mon certificat" → `GET /certificates/mine`
> 5. Si `passed: false` et `attemptNumber < maxAttempts` → proposer "Réessayer"
> 6. Si `attemptNumber >= maxAttempts` → bloquer le bouton "Réessayer", afficher le nombre de tentatives épuisées

### POST `/attempts` — Soumettre une tentative d'évaluation
**Accès :** token valide | **Status :** ✅ 201 Created

**Body :** envoyer l'`evaluationId` et un tableau de réponses (une par question).

```json
{
  "evaluationId": "22ed8eaf-0302-41bf-8d56-1f4615538d90",
  "answers": [
    { "questionId": "e0320210-...", "answerId": "ca0596e6-..." },
    { "questionId": "0c4bb6ea-...", "answerId": "98834690-..." }
  ]
}
```

> Ne pas envoyer de score dans le body — il est calculé entièrement côté serveur et ne peut pas être manipulé.

**Réponse 201 :**
```json
{
  "id": "bb391795-9a96-4014-9283-78a6ec93fcee",
  "userId": "e057f4b7-...",
  "evaluationId": "22ed8eaf-...",
  "score": 100,
  "passed": true,
  "attemptNumber": 1,
  "createdAt": "2026-03-13T09:54:08.070Z",
  "evaluation": {
    "id": "22ed8eaf-...",
    "formationId": "b9b74424-...",
    "passingScore": 70,
    "maxAttempts": 3,
    "timeLimit": 20
  },
  "user": { "id": "...", "firstName": "Nathan", "lastName": "Voglossou", "email": "...", "role": "LEARNER" }
}
```

> Si `passed: true`, le certificat est **généré automatiquement** — appeler `GET /certificates/mine` juste après pour récupérer son code.

**Erreurs :**
- `401` — Token manquant ou invalide
- `403` — Nombre maximum de tentatives atteint (`maxAttempts`) → désactiver le bouton "Soumettre"
- `404` — Évaluation introuvable

---

### GET `/attempts/:id` — Résultat d'une tentative
**Accès :** token valide | **Status :** ✅ 200 OK

> Appeler si vous avez besoin de recharger un résultat de tentative depuis son ID (ex : page historique des tentatives). En général, les données de `POST /attempts` suffisent directement.

**Réponse 200 :**
```json
{
  "id": "bb391795-9a96-4014-9283-78a6ec93fcee",
  "userId": "e057f4b7-...",
  "evaluationId": "22ed8eaf-...",
  "score": 100,
  "passed": true,
  "attemptNumber": 1,
  "createdAt": "2026-03-13T09:54:08.070Z",
  "user": { "id": "...", "firstName": "Nathan", "lastName": "Voglossou", "email": "...", "role": "LEARNER" },
  "evaluation": { "id": "22ed8eaf-...", "formationId": "b9b74424-...", "passingScore": 70, "maxAttempts": 3, "timeLimit": 20 }
}
```

**Erreurs :**
- `401` — Token manquant ou invalide
- `404` — Tentative introuvable

---

## 9. Certificats

> **Le certificat est généré automatiquement** quand `POST /attempts` retourne `passed: true`. Pas besoin de l'appeler manuellement.
>
> **Workflow :**
> 1. Après un quiz réussi → `GET /certificates/mine` → récupérer `uniqueCode` et `id`
> 2. Afficher le certificat avec un bouton "Partager" → l'URL de vérification publique est `GET /certificates/verify/:uniqueCode`
> 3. Cette URL peut être mise dans un QR code ou partagée à un employeur pour vérifier l'authenticité

### GET `/certificates/mine` — Mes certificats
**Accès :** token valide | **Status :** ✅ 200 OK

> **Appeler en premier** pour récupérer l'`id` et le `uniqueCode` du certificat. Ensuite utiliser ces valeurs pour les deux routes suivantes.

**Réponse 200 :** tableau de certificats de l'utilisateur connecté.

```json
[
  {
    "id": "292326bf-ea6e-4d8a-81c2-eb497ef245ba",
    "userId": "e057f4b7-...",
    "formationId": "b9b74424-...",
    "uniqueCode": "WA-1773395650519-23JDWUFH0",
    "issuedAt": "2026-03-13T09:54:10.522Z",
    "qrCodeUrl": null,
    "user": { "id": "...", "firstName": "Nathan", "lastName": "Voglossou", "email": "...", "role": "LEARNER" },
    "formation": { "id": "b9b74424-...", "title": "English Fundamentals That Open Doors", "level": "DEBUTANT", "price": 0 }
  }
]
```

> Retourne un tableau vide `[]` si l'apprenant n'a encore validé aucune formation.

---

### GET `/certificates/verify/:uniqueCode` — Vérifier un certificat
**Accès :** public (sans token) | **Status :** ✅ 200 OK

> Route **publique** — accessible sans compte. Utilisée pour afficher une page de vérification (ex : un employeur scanne le QR code et vérifie l'authenticité du certificat).

**Réponse 200 :**
```json
{
  "id": "292326bf-ea6e-4d8a-81c2-eb497ef245ba",
  "uniqueCode": "WA-1773395650519-23JDWUFH0",
  "issuedAt": "2026-03-13T09:54:10.522Z",
  "qrCodeUrl": null,
  "user": { "id": "...", "firstName": "Nathan", "lastName": "Voglossou", "email": "...", "role": "LEARNER" },
  "formation": { "id": "b9b74424-...", "title": "English Fundamentals That Open Doors", "level": "DEBUTANT", "price": 0 }
}
```

**Erreurs :**
- `404` — Code inconnu → afficher "Ce certificat n'existe pas ou est invalide"

---

### GET `/certificates/:id` — Voir un certificat par ID
**Accès :** token valide | **Status :** ✅ 200 OK

> Utiliser si vous avez l'UUID du certificat et préférez y accéder directement (ex : depuis une page profil). Retourne les mêmes données que `verify`.

**Erreurs :**
- `401` — Token manquant ou invalide
- `404` — Certificat introuvable
