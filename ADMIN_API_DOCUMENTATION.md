# WIN ACADEMY — Documentation API Admin / Super Admin

> **URL de base (production) :** `https://win-academy-backend.onrender.com`
> **URL de base (local) :** `http://localhost:3000`

Toutes les routes protégées nécessitent le header :
```
Authorization: Bearer <accessToken>
```

---

## Utilisateurs

### GET `/users` — Liste des utilisateurs
**Accès :** Authentifié (token valide requis, pas de restriction de rôle) | **Status :** ✅

**Query params :**
| Param | Type | Défaut | Description |
|-------|------|--------|-------------|
| page | number | 1 | |
| limit | number | 10 | |

**Réponse 200 :**
```json
{
  "data": [
    {
      "id": "e057f4b7-ba5b-4440-8e8b-d51464c7ae",
      "firstName": "Nathan",
      "lastName": "Voglossou",
      "dateOfBirth": "2004-07-16T00:00:00.000Z",
      "sex": "M",
      "communeId": "5a2b8663-1dee-11f1-9f08-bc111e65a1f8",
      "email": "n969601@gmail.com",
      "role": "LEARNER",
      "status": "ACTIVE",
      "createdAt": "2026-03-12T10:00:00.000Z",
      "updatedAt": "2026-03-12T10:00:00.000Z",
      "commune": {
        "id": "5a2b8663-1dee-11f1-9f08-bc111e65a1f8",
        "name": "Cotonou",
        "departmentId": "...",
        "department": { "id": "...", "name": "Littoral", "code": "LIT" }
      }
    }
  ],
  "meta": { "total": 1, "page": 1, "limit": 10, "totalPages": 1 }
}
```

> Le champ `passwordHash` n'est jamais retourné.

**Erreurs :**
- `401` — Token absent ou invalide

---

## Départements

### GET `/departments` — Liste des départements
**Accès :** Public (aucun token requis) | **Status :** ✅

**Query params :** `page`, `limit`

**Réponse 200 :**
```json
{
  "data": [
    {
      "id": "db390482-1dec-11f1-9f08-bc111e65a1f8",
      "name": "Alibori",
      "code": "ALI",
      "createdAt": "2026-03-12T10:00:00.000Z",
      "updatedAt": "2026-03-12T10:00:00.000Z"
    }
  ],
  "meta": { "total": 12, "page": 1, "limit": 10, "totalPages": 2 }
}
```

> Les 12 départements du Bénin sont déjà en base. Aucune route de création/modification n'est nécessaire.

---

### GET `/departments/:id` — Un département par ID
**Accès :** Public | **Status :** ✅

**Réponse 200 :** objet département avec ses communes incluses

---

## Communes

### GET `/communes` — Liste des communes
**Accès :** Public (aucun token requis) | **Status :** ✅

**Query params :** `page`, `limit`

**Réponse 200 :**
```json
{
  "data": [
    {
      "id": "5a2b8663-1dee-11f1-9f08-bc111e65a1f8",
      "name": "Cotonou",
      "departmentId": "db390482-1dec-11f1-9f08-bc111e65a1f8",
      "createdAt": "2026-03-12T10:00:00.000Z",
      "updatedAt": "2026-03-12T10:00:00.000Z",
      "department": { "id": "...", "name": "Littoral", "code": "LIT" }
    }
  ],
  "meta": { "total": 77, "page": 1, "limit": 10, "totalPages": 8 }
}
```

> Les 77 communes du Bénin sont déjà en base. Aucune route de création/modification n'est nécessaire.

---

### GET `/communes/:id` — Une commune par ID
**Accès :** Public | **Status :** ✅

**Réponse 200 :** objet commune avec son département inclus

---

## Inscriptions

### GET `/enrollments` — Liste de toutes les inscriptions
**Accès :** Authentifié (token valide requis, pas de restriction de rôle) | **Status :** ✅

**Query params :** `page`, `limit`

**Réponse 200 :**
```json
{
  "data": [
    {
      "id": "uuid-enrollment",
      "userId": "uuid-user",
      "formationId": "uuid-formation",
      "progressPercentage": 50,
      "status": "IN_PROGRESS",
      "enrolledAt": "2026-03-12T10:00:00.000Z",
      "user": {
        "id": "uuid-user",
        "firstName": "Nathan",
        "lastName": "Voglossou",
        "email": "n969601@gmail.com",
        "role": "LEARNER",
        "status": "ACTIVE"
      },
      "formation": {
        "id": "uuid-formation",
        "title": "Algèbre",
        "level": "DEBUTANT",
        "duration": 120
      }
    }
  ],
  "meta": { "total": 1, "page": 1, "limit": 10, "totalPages": 1 }
}
```

> `status` peut valoir `IN_PROGRESS` ou `COMPLETED`. Le `passwordHash` de l'utilisateur n'est jamais retourné.

**Erreurs :**
- `401` — Token absent ou invalide

---

## Auth Admin

### POST `/auth/login` — Connexion Super Admin
**Accès :** Public | **Status :** ✅ 200 OK

**Body :**
```json
{
  "email": "wakeoeuvronsensemble@gmail.com",
  "password": "wurami@dmin16"
}
```

**Réponse 200 :**
```json
{
  "user": {
    "id": "cdc53bf0-1e01-11f1-9f08-bc111e65a1f8",
    "firstName": "Wurami",
    "lastName": "Admin",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "sex": "M",
    "communeId": "5a2b8d55-1dee-11f1-9f08-bc111e65a1f8",
    "email": "wakeoeuvronsensemble@gmail.com",
    "role": "SUPER_ADMIN",
    "status": "ACTIVE",
    "createdAt": "2026-03-12T10:54:12.000Z",
    "updatedAt": "2026-03-12T10:54:12.000Z"
  },
  "accessToken": "<jwt_token>",
  "refreshToken": "<jwt_refresh_token>",
  "tokenType": "Bearer",
  "expiresIn": "3600"
}
```

---

## Catégories

### POST `/categories` — Créer une catégorie
**Accès :** ADMIN / SUPER_ADMIN | **Status :** ✅ 201 Created

**Body :**
```json
{
  "name": "Mathématiques",
  "description": "Cours de mathématiques pour tous niveaux",
  "image": null,
  "ageMin": 6,
  "ageMax": 18
}
```

**Réponse 201 :**
```json
{
  "id": "09d7f4f5-8e62-4982-87e5-d75fbc89a1fb",
  "name": "Mathématiques",
  "description": "Cours de mathématiques pour tous niveaux",
  "image": null,
  "ageMin": 6,
  "ageMax": 18,
  "createdAt": "2026-03-12T11:06:25.941Z"
}
```

**Erreurs :**
- `400` — `ageMin` > `ageMax`
- `401` — Token absent ou invalide
- `403` — Rôle insuffisant

---

### GET `/categories` — Liste des catégories
**Accès :** Public | **Status :** ✅ 200 OK

**Query params :**
| Param | Type | Défaut | Description |
|-------|------|--------|-------------|
| page | number | 1 | |
| limit | number | 10 | |
| age | number | - | Filtre les catégories accessibles pour cet âge |

**Réponse 200 :**
```json
{
  "data": [
    {
      "id": "09d7f4f5-8e62-4982-87e5-d75fbc89a1fb",
      "name": "Mathématiques",
      "description": "Cours de mathématiques pour tous niveaux",
      "image": null,
      "ageMin": 6,
      "ageMax": 18,
      "createdAt": "2026-03-12T11:06:25.941Z",
      "formations": []
    }
  ],
  "meta": { "total": 1, "page": 1, "limit": 10, "totalPages": 1 }
}
```

---

### GET `/categories/:id` — Une catégorie par ID
**Accès :** Public | **Status :** ✅ 200 OK

**Réponse 200 :**
```json
{
  "id": "09d7f4f5-8e62-4982-87e5-d75fbc89a1fb",
  "name": "Mathématiques",
  "description": "Cours de mathématiques pour tous niveaux",
  "image": null,
  "ageMin": 6,
  "ageMax": 18,
  "createdAt": "2026-03-12T11:06:25.941Z",
  "formations": []
}
```

**Erreurs :**
- `404` — Catégorie introuvable

---

### PATCH `/categories/:id` — Modifier une catégorie
**Accès :** ADMIN / SUPER_ADMIN | **Status :** ✅ 200 OK

**Body (tous les champs optionnels) :**
```json
{
  "name": "Mathématiques avancées",
  "ageMax": 20
}
```

**Réponse 200 :** la catégorie mise à jour (même structure que GET)

**Erreurs :**
- `400` — `ageMin` > `ageMax`
- `404` — Catégorie introuvable

---

### DELETE `/categories/:id` — Supprimer une catégorie
**Accès :** SUPER_ADMIN uniquement | **Status :** ✅ 200 OK

**Réponse 200 :**
```json
{ "message": "Catégorie supprimée" }
```

**Erreurs :**
- `403` — Rôle insuffisant (ADMIN ne peut pas supprimer)
- `404` — Catégorie introuvable

---

## Formations

### POST `/formations` — Créer une formation
**Accès :** ADMIN / SUPER_ADMIN | **Status :** ✅ 201 Created

**Body :**
```json
{
  "title": "Algèbre de base",
  "shortDescription": "Introduction à l'algèbre pour débutants",
  "fullDescription": "Ce cours couvre les équations du premier et second degré",
  "level": "DEBUTANT",
  "duration": 120,
  "price": 5000,
  "image": null,
  "categoryId": "4e243ac7-03a4-4872-83e4-9ac38ae53183"
}
```

**Champs :**
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| title | string | ✅ | Titre de la formation |
| shortDescription | string | - | Description courte |
| fullDescription | string | - | Description complète |
| level | string | - | Ex: `DEBUTANT`, `INTERMEDIAIRE`, `AVANCE` |
| duration | number | - | Durée en minutes |
| price | number | - | Prix en FCFA. `0` = gratuit (défaut). Ex: `5000` = 5 000 FCFA |
| image | string | - | URL de l'image |
| categoryId | string | - | UUID de la catégorie |

**Réponse 201 :**
```json
{
  "id": "261f28da-ae7d-4cbe-aca6-fb1f131c900e",
  "title": "Algèbre de base",
  "shortDescription": "Introduction à l'algèbre pour débutants",
  "fullDescription": "Ce cours couvre les équations du premier et second degré",
  "level": "DEBUTANT",
  "duration": 120,
  "price": 5000,
  "image": null,
  "categoryId": "4e243ac7-03a4-4872-83e4-9ac38ae53183",
  "createdAt": "2026-03-12T11:14:39.202Z"
}
```

---

### GET `/formations` — Liste des formations
**Accès :** Public | **Status :** ✅ 200 OK

**Réponse 200 :**
```json
{
  "data": [
    {
      "id": "261f28da-ae7d-4cbe-aca6-fb1f131c900e",
      "title": "Algèbre de base",
      "shortDescription": "Introduction à l'algèbre pour débutants",
      "fullDescription": "Ce cours couvre les équations du premier et second degré",
      "level": "DEBUTANT",
      "duration": 120,
      "price": 5000,
      "image": null,
      "categoryId": "4e243ac7-03a4-4872-83e4-9ac38ae53183",
      "createdAt": "2026-03-12T11:14:39.202Z",
      "category": { "id": "...", "name": "Mathématiques A", "ageMin": 6, "ageMax": 18 },
      "modules": [],
      "_count": { "enrollments": 0 }
    }
  ],
  "meta": { "total": 1, "page": 1, "limit": 10, "totalPages": 1 }
}
```

> `price: 0` = formation gratuite. Afficher "Gratuit" côté front quand `price === 0`.

---

### GET `/formations/:id` — Une formation par ID
**Accès :** Public | **Status :** ✅ 200 OK

**Réponse 200 :**
```json
{
  "id": "261f28da-ae7d-4cbe-aca6-fb1f131c900e",
  "title": "Algèbre de base",
  "shortDescription": "Introduction à l'algèbre pour débutants",
  "fullDescription": "Ce cours couvre les équations du premier et second degré",
  "level": "DEBUTANT",
  "duration": 120,
  "price": 5000,
  "image": null,
  "categoryId": "4e243ac7-03a4-4872-83e4-9ac38ae53183",
  "createdAt": "2026-03-12T11:14:39.202Z",
  "category": { "id": "...", "name": "Mathématiques A", "ageMin": 6, "ageMax": 18 },
  "modules": [],
  "evaluation": null
}
```

> Quand des modules sont ajoutés, ils apparaissent ici avec leurs contenus.

**Erreurs :**
- `404` — Formation introuvable

---

### PATCH `/formations/:id` — Modifier une formation
**Accès :** ADMIN / SUPER_ADMIN | **Status :** ✅ 200 OK

**Body (tous les champs optionnels) :**
```json
{
  "title": "Algèbre pour débutants",
  "level": "INTERMEDIAIRE"
}
```

**Réponse 200 :** la formation mise à jour (même structure que GET)

**Erreurs :**
- `409` — Des apprenants sont inscrits, modification des champs structurels impossible (seuls `shortDescription`, `image` et `price` sont modifiables)
- `404` — Formation introuvable

---

### DELETE `/formations/:id` — Supprimer une formation
**Accès :** SUPER_ADMIN | **Status :** ✅ 200 OK

**Réponse 200 :**
```json
{ "message": "Formation supprimée avec succès" }
```

**Erreurs :**
- `409` — Impossible de supprimer, des apprenants sont inscrits
- `404` — Formation introuvable

---

## Modules

### POST `/modules` — Créer un module
**Accès :** ADMIN / SUPER_ADMIN | **Status :** ✅ 201 Created

**Body :**
```json
{
  "title": "Chapitre 1 : Les équations",
  "description": "Résolution d'équations du premier degré",
  "order": 1,
  "formationId": "13bb8785-4f5b-4dab-a6a5-dc03bdc95d74"
}
```

**Champs :**
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| title | string | ✅ | Titre du module |
| description | string | - | Description |
| order | number | ✅ | Position dans la formation (commence à 1) |
| formationId | string | ✅ | UUID de la formation parente |

**Réponse 201 :**
```json
{
  "id": "8b1bb89b-9446-45e9-bb3f-a989b018b344",
  "title": "Chapitre 1 : Les équations",
  "description": "Résolution d'équations du premier degré",
  "order": 1,
  "formationId": "13bb8785-4f5b-4dab-a6a5-dc03bdc95d74",
  "createdAt": "2026-03-12T11:37:16.460Z"
}
```

**Erreurs :**
- `409` — Un module avec le même `order` existe déjà dans cette formation

---

### GET `/formations/:id/modules` — Modules d'une formation
**Accès :** Public | **Status :** ✅ 200 OK

**Réponse 200 :**
```json
[
  {
    "id": "8b1bb89b-9446-45e9-bb3f-a989b018b344",
    "title": "Chapitre 1 : Les équations",
    "description": "Résolution d'équations du premier degré",
    "order": 1,
    "formationId": "13bb8785-4f5b-4dab-a6a5-dc03bdc95d74",
    "createdAt": "2026-03-12T11:37:16.460Z",
    "contents": []
  },
  {
    "id": "47717d2e-3cd1-43b6-8945-78791e097e29",
    "title": "Chapitre 2 : Les équations évoluées",
    "description": "Résolution d'équations du premier degré",
    "order": 2,
    "formationId": "13bb8785-4f5b-4dab-a6a5-dc03bdc95d74",
    "createdAt": "2026-03-12T11:38:46.876Z",
    "contents": []
  }
]
```

> Les modules sont triés par `order` croissant. Chaque module inclut ses contenus.

---

### GET `/modules/:id` — Un module par ID
**Accès :** Public | **Status :** ✅ 200 OK

**Réponse 200 :**
```json
{
  "id": "47717d2e-3cd1-43b6-8945-78791e097e29",
  "title": "Chapitre 2 : Les équations évoluées",
  "description": "Résolution d'équations du premier degré",
  "order": 2,
  "formationId": "13bb8785-4f5b-4dab-a6a5-dc03bdc95d74",
  "createdAt": "2026-03-12T11:38:46.870Z",
  "contents": [],
  "formation": {
    "id": "13bb8785-4f5b-4dab-a6a5-dc03bdc95d74",
    "title": "Algèbre",
    "shortDescription": "Algèbre pour débutants",
    "fullDescription": "Ce cours couvre les équations du premier et second degré",
    "level": "DEBUTANT",
    "duration": 120,
    "image": null,
    "categoryId": "4e243ac7-03a4-4872-83e4-9ac38ae53183",
    "createdAt": "2026-03-12T11:34:15.114Z"
  }
}
```

**Erreurs :**
- `404` — Module introuvable

---

### PATCH `/modules/:id` — Modifier un module
**Accès :** ADMIN / SUPER_ADMIN | **Status :** ✅ 200 OK

**Body (tous les champs optionnels) :**
```json
{
  "title": "Chapitre 2 modifié",
  "order": 2
}
```

**Réponse 200 :** le module mis à jour (même structure que GET)

---

### DELETE `/modules/:id` — Supprimer un module
**Accès :** ADMIN / SUPER_ADMIN | **Status :** ✅ 200 OK

**Réponse 200 :**
```json
{ "message": "Module deleted" }
```

**Erreurs :**
- `404` — Module introuvable

---

## Contenus

### POST `/contents` — Ajouter un contenu à un module
**Accès :** ADMIN / SUPER_ADMIN | **Status :** ✅ 201 Created

**Types disponibles :** `VIDEO`, `PDF`, `TEXT`, `IMAGE`

**Champs :**
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| type | string | ✅ | `VIDEO`, `PDF`, `TEXT` ou `IMAGE` |
| title | string | ✅ | Titre du contenu |
| url | string | - | URL (requis pour VIDEO, PDF, IMAGE) |
| body | string | - | Texte (requis pour TEXT) |
| order | number | ✅ | Position dans le module |
| moduleId | string | ✅ | UUID du module parent |

**Exemple VIDEO — Body :**
```json
{
  "type": "VIDEO",
  "title": "Introduction aux équations",
  "url": "https://youtube.com/watch?v=XXXXX",
  "order": 1,
  "moduleId": "4a47bc79-0dd8-458f-b35d-062ce076311a"
}
```

**Réponse 201 (VIDEO) :**
```json
{
  "id": "2a6fb83a-4744-4afe-9ec5-eb3c59eee46c",
  "type": "VIDEO",
  "title": "Introduction aux équations",
  "url": "https://youtube.com/watch?v=XXXXX",
  "body": null,
  "order": 1,
  "moduleId": "4a47bc79-0dd8-458f-b35d-062ce076311a",
  "createdAt": "2026-03-12T11:51:42.587Z"
}
```

**Réponse 201 (PDF) :**
```json
{
  "id": "f8ac3ac3-91e5-417f-8a7e-7d3a1a87a174",
  "type": "PDF",
  "title": "Fiche de révision équations",
  "url": "https://example.com/fichier.pdf",
  "body": null,
  "order": 2,
  "moduleId": "4a47bc79-0dd8-458f-b35d-062ce076311a",
  "createdAt": "2026-03-12T11:52:41.325Z"
}
```

**Réponse 201 (TEXT) :**
```json
{
  "id": "ea0c1ed2-10fb-413e-bdc3-25f92abab156",
  "type": "TEXT",
  "title": "Résumé du chapitre",
  "url": null,
  "body": "Une équation du premier degré est de la forme ax + b = 0...",
  "order": 3,
  "moduleId": "4a47bc79-0dd8-458f-b35d-062ce076311a",
  "createdAt": "2026-03-12T11:53:10.868Z"
}
```

---

### GET `/contents/:id` — Un contenu par ID
**Accès :** Authentifié (token requis, pas de restriction de rôle) | **Status :** ✅ 200 OK

**Réponse 200 :**
```json
{
  "id": "2a6fb83a-4744-4afe-9ec5-eb3c59eee46c",
  "type": "VIDEO",
  "title": "Introduction aux équations",
  "url": "https://youtube.com/watch?v=XXXXX",
  "body": null,
  "order": 1,
  "moduleId": "4a47bc79-0dd8-458f-b35d-062ce076311a",
  "createdAt": "2026-03-12T11:51:42.587Z",
  "module": {
    "id": "4a47bc79-0dd8-458f-b35d-062ce076311a",
    "title": "Chapitre 2 : Les équations évoluées",
    "description": "Résolution d'équations du premier degré",
    "order": 2,
    "formationId": "13bb8785-4f5b-4dab-a6a5-dc03bdc95d74",
    "createdAt": "2026-03-12T11:50:32.954Z"
  }
}
```

**Erreurs :**
- `401` — Token absent ou invalide
- `404` — Contenu introuvable

---

### PATCH `/contents/:id` — Modifier un contenu
**Accès :** ADMIN / SUPER_ADMIN | **Status :** ✅ 200 OK

**Body (tous les champs optionnels) :**
```json
{
  "title": "Introduction aux équations - version 2",
  "url": "https://youtube.com/watch?v=YYYYY"
}
```

**Réponse 200 :** le contenu mis à jour (même structure que GET, sans le champ `module`)

---

### DELETE `/contents/:id` — Supprimer un contenu
**Accès :** SUPER_ADMIN | **Status :** ✅ 200 OK

**Réponse 200 :**
```json
{ "message": "Content deleted" }
```

**Erreurs :**
- `404` — Contenu introuvable

---

## Évaluations

### GET `/evaluations` — Liste de toutes les évaluations
**Accès :** ADMIN / SUPER_ADMIN | **Status :** ✅

**Query params :** `page`, `limit`

**Réponse 200 :**
```json
{
  "data": [
    {
      "id": "3669f89a-bb4d-498e-b003-0dd293101306",
      "formationId": "13bb8785-4f5b-4dab-a6a5-dc03bdc95d74",
      "passingScore": 70,
      "maxAttempts": 3,
      "timeLimit": 30,
      "formation": {
        "id": "13bb8785-4f5b-4dab-a6a5-dc03bdc95d74",
        "title": "Algèbre de base",
        "level": "DEBUTANT"
      },
      "questions": [
        {
          "id": "449ad326-7d2c-44cc-aa6a-3b7f440458b0",
          "questionText": "Quelle est la solution de 2x = 4 ?",
          "answers": [
            { "id": "...", "answerText": "x = 2", "isCorrect": true },
            { "id": "...", "answerText": "x = 1", "isCorrect": false }
          ]
        }
      ]
    }
  ],
  "meta": { "total": 5, "page": 1, "limit": 10, "totalPages": 1 }
}
```

> Évite le problème N+1 : une seule requête pour toutes les évaluations avec questions et réponses.

**Erreurs :**
- `401` — Token absent ou invalide
- `403` — Rôle insuffisant

---

### POST `/evaluations` — Créer l'évaluation d'une formation
**Accès :** ADMIN / SUPER_ADMIN | **Status :** ✅ 201 Created

**Body :**
```json
{
  "formationId": "13bb8785-4f5b-4dab-a6a5-dc03bdc95d74",
  "passingScore": 70,
  "maxAttempts": 3,
  "timeLimit": 30
}
```

**Champs :**
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| formationId | string | ✅ | UUID de la formation |
| passingScore | number | ✅ | Score minimum pour réussir (en %) |
| maxAttempts | number | - | Nombre max de tentatives |
| timeLimit | number | - | Durée limite en minutes |

**Réponse 201 :**
```json
{
  "id": "3669f89a-bb4d-498e-b003-0dd293101306",
  "formationId": "13bb8785-4f5b-4dab-a6a5-dc03bdc95d74",
  "passingScore": 70,
  "maxAttempts": 3,
  "timeLimit": 30
}
```

**Erreurs :**
- `409` — Une évaluation existe déjà pour cette formation

---

### GET `/evaluations/:id` — Une évaluation par ID (avec questions et réponses)
**Accès :** Authentifié (token requis, pas de restriction de rôle) | **Status :** ✅ 200 OK

**Réponse 200 :**
```json
{
  "id": "3669f89a-bb4d-498e-b003-0dd293101306",
  "formationId": "13bb8785-4f5b-4dab-a6a5-dc03bdc95d74",
  "passingScore": 70,
  "maxAttempts": 3,
  "timeLimit": 30,
  "formation": {
    "id": "13bb8785-4f5b-4dab-a6a5-dc03bdc95d74",
    "title": "Algèbre",
    "shortDescription": "Algèbre pour débutants",
    "fullDescription": "Ce cours couvre les équations du premier et second degré",
    "level": "DEBUTANT",
    "duration": 120,
    "image": null,
    "categoryId": "4e243ac7-03a4-4872-83e4-9ac38ae53183",
    "createdAt": "2026-03-12T11:34:15.114Z"
  },
  "questions": []
}
```

> Une fois des questions ajoutées, elles apparaissent ici avec leurs réponses.

**Erreurs :**
- `401` — Token absent ou invalide
- `404` — Évaluation introuvable

---

## Questions & Réponses

### POST `/questions` — Créer une question avec ses réponses
**Accès :** ADMIN / SUPER_ADMIN | **Status :** ✅ 201 Created

> Au moins une réponse doit avoir `isCorrect: true`.

**Body :**
```json
{
  "evaluationId": "3669f89a-bb4d-498e-b003-0dd293101306",
  "questionText": "Quelle est la solution de 2x = 4 ?",
  "answers": [
    { "answerText": "x = 1", "isCorrect": false },
    { "answerText": "x = 2", "isCorrect": true },
    { "answerText": "x = 3", "isCorrect": false },
    { "answerText": "x = 4", "isCorrect": false }
  ]
}
```

**Réponse 201 :**
```json
{
  "id": "449ad326-7d2c-44cc-aa6a-3b7f440458b0",
  "evaluationId": "3669f89a-bb4d-498e-b003-0dd293101306",
  "questionText": "Quelle est la solution de 2x = 4 ?",
  "createdAt": "2026-03-12T12:09:19.098Z",
  "answers": [
    { "id": "0b833686-8808-4642-a038-a90abef3c648", "questionId": "449ad326-7d2c-44cc-aa6a-3b7f440458b0", "answerText": "x = 2", "isCorrect": true, "createdAt": "2026-03-12T12:09:19.098Z" },
    { "id": "27744fec-c49c-401f-a574-0b7bb2d30293", "questionId": "449ad326-7d2c-44cc-aa6a-3b7f440458b0", "answerText": "x = 1", "isCorrect": false, "createdAt": "2026-03-12T12:09:19.098Z" },
    { "id": "b5411abe-bb1e-469a-8108-3b7e461af4b7", "questionId": "449ad326-7d2c-44cc-aa6a-3b7f440458b0", "answerText": "x = 3", "isCorrect": false, "createdAt": "2026-03-12T12:09:19.098Z" },
    { "id": "e224da4f-b47a-43a8-98c5-9a29a388a8bf", "questionId": "449ad326-7d2c-44cc-aa6a-3b7f440458b0", "answerText": "x = 4", "isCorrect": false, "createdAt": "2026-03-12T12:09:19.098Z" }
  ],
  "evaluation": {
    "id": "3669f89a-bb4d-498e-b003-0dd293101306",
    "formationId": "13bb8785-4f5b-4dab-a6a5-dc03bdc95d74",
    "passingScore": 70,
    "maxAttempts": 3,
    "timeLimit": 30
  }
}
```

---

### PATCH `/questions/:id` — Modifier une question
**Accès :** ADMIN / SUPER_ADMIN | **Status :** ✅ 200 OK

**Body (tous les champs optionnels) :**
```json
{
  "questionText": "Quelle est la valeur de x si 2x = 4 ?"
}
```

**Réponse 200 :** la question mise à jour avec ses réponses et son évaluation (même structure que POST)

---

### DELETE `/questions/:id` — Supprimer une question
**Accès :** ADMIN / SUPER_ADMIN | **Status :** ✅ 200 OK

**Réponse 200 :**
```json
{ "message": "Question deleted successfully" }
```

> Les réponses associées sont supprimées automatiquement en cascade.

**Erreurs :**
- `404` — Question introuvable
