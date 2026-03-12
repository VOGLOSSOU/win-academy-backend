# WIN ACADEMY — Documentation API

**Base URL (production):** `https://win-academy-backend.onrender.com`
**Base URL (local):** `http://localhost:3000`
**Swagger UI:** `https://win-academy-backend.onrender.com/api/docs`

> Les routes sont documentées au fur et à mesure des tests validés.

---

## Authentification

Toutes les routes protégées nécessitent un header :
```
Authorization: Bearer <accessToken>
```

---

## Routes testées et validées

---

### POST `/auth/register` — Inscription
**Accès :** Public | **Status :** ✅ 201 Created

**Body :**
```json
{
  "firstName": "Nathan",
  "lastName": "Voglossou",
  "dateOfBirth": "2004-07-16",
  "sex": "M",
  "communeId": "5a2b8663-1dee-11f1-9f08-bc111e65a1f8",
  "email": "n969601@gmail.com",
  "password": "N@than16"
}
```

| Champ | Type | Requis | Notes |
|-------|------|--------|-------|
| firstName | string | oui | max 50 |
| lastName | string | oui | max 50 |
| dateOfBirth | string ISO | oui | ex: `1995-06-20` |
| sex | enum | oui | `M` ou `F` |
| communeId | string UUID | oui | ID d'une commune du Bénin |
| email | string | oui | format email valide |
| password | string | oui | min 8 caractères |

**Réponse 201 :**
```json
{
  "user": {
    "id": "e057f4b7-ba5b-4440-8e8b-d5146144c7ae",
    "firstName": "Nathan",
    "lastName": "Voglossou",
    "dateOfBirth": "2004-07-16T00:00:00.000Z",
    "sex": "M",
    "communeId": "5a2b8663-1dee-11f1-9f08-bc111e65a1f8",
    "email": "n969601@gmail.com",
    "role": "LEARNER",
    "status": "ACTIVE",
    "createdAt": "2026-03-12T08:55:09.265Z",
    "updatedAt": "2026-03-12T08:55:09.265Z"
  },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": "3600"
}
```

> **Note :** Le `communeId` doit être un UUID valide d'une commune existante en base. Appeler `GET /communes` pour obtenir la liste.

---

### POST `/auth/login` — Connexion
**Accès :** Public | **Status :** ✅ 200 OK

**Body :**
```json
{
  "email": "n969601@gmail.com",
  "password": "N@than16"
}
```

| Champ | Type | Requis |
|-------|------|--------|
| email | string | oui |
| password | string | oui |

**Réponse 200 :**
```json
{
  "user": {
    "id": "e057f4b7-ba5b-4440-8e8b-d5146144c7ae",
    "firstName": "Nathan",
    "lastName": "Voglossou",
    "dateOfBirth": "2004-07-16T00:00:00.000Z",
    "sex": "M",
    "communeId": "5a2b8663-1dee-11f1-9f08-bc111e65a1f8",
    "email": "n969601@gmail.com",
    "role": "LEARNER",
    "status": "ACTIVE",
    "createdAt": "2026-03-12T08:55:09.265Z",
    "updatedAt": "2026-03-12T08:55:09.265Z"
  },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": "3600"
}
```

**Erreurs :**
- `401` — Email ou mot de passe incorrect
- `401` — Compte suspendu ou supprimé

---

### GET `/auth/me` — Profil de l'utilisateur connecté
**Accès :** Authentifié | **Status :** ✅ 200 OK

**Header :** `Authorization: Bearer <accessToken>`

**Réponse 200 :**
```json
{
  "id": "e057f4b7-ba5b-4440-8e8b-d5146144c7ae",
  "firstName": "Nathan",
  "lastName": "Voglossou",
  "dateOfBirth": "2004-07-16T00:00:00.000Z",
  "sex": "M",
  "communeId": "5a2b8663-1dee-11f1-9f08-bc111e65a1f8",
  "email": "n969601@gmail.com",
  "role": "LEARNER",
  "status": "ACTIVE",
  "createdAt": "2026-03-12T08:55:09.265Z",
  "updatedAt": "2026-03-12T08:55:09.265Z"
}
```

**Erreurs :**
- `401` — Token absent, invalide ou expiré

---

### POST `/auth/refresh` — Rafraîchir le token
**Accès :** Authentifié (avec le refreshToken) | **Status :** ✅ 200 OK

**Header :** `Authorization: Bearer <refreshToken>`

**Réponse 200 :**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": "3600"
}
```

**Erreurs :**
- `401` — Token absent, invalide ou expiré

---

## Départements & Communes

> Ces routes retournent les données de référence géographique du Bénin. Le frontend en a besoin pour afficher les listes de sélection lors de l'inscription.

---

### GET `/departments` — Liste des 12 départements (avec leurs communes)
**Accès :** Public | **Status :** ✅ 200 OK

**Query params :**
| Param | Type | Défaut |
|-------|------|--------|
| page | number | 1 |
| limit | number | 10 |

**Réponse 200 :**
```json
{
  "data": [
    {
      "id": "db390482-1dec-11f1-9f08-bc111e65a1f8",
      "name": "Alibori",
      "code": "AL",
      "createdAt": "2026-03-12T08:24:15.000Z",
      "updatedAt": "2026-03-12T08:24:15.000Z",
      "communes": [
        {
          "id": "5a2b7e7b-1dee-11f1-9f08-bc111e65a1f8",
          "name": "Banikoara",
          "departmentId": "db390482-1dec-11f1-9f08-bc111e65a1f8",
          "createdAt": "2026-03-12T08:34:57.000Z",
          "updatedAt": "2026-03-12T08:34:57.000Z"
        }
      ]
    }
  ],
  "meta": {
    "total": 12,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

> **Note :** Chaque département contient ses communes imbriquées. Pour l'inscription, utiliser l'`id` d'une commune comme `communeId`.

---

### GET `/departments/:id` — Un département par ID
**Accès :** Public | **Status :** ✅ 200 OK

**Réponse 200 :**
```json
{
  "id": "db390482-1dec-11f1-9f08-bc111e65a1f8",
  "name": "Alibori",
  "code": "AL",
  "createdAt": "2026-03-12T08:24:15.000Z",
  "updatedAt": "2026-03-12T08:24:15.000Z",
  "communes": [
    {
      "id": "5a2b7e7b-1dee-11f1-9f08-bc111e65a1f8",
      "name": "Banikoara",
      "departmentId": "db390482-1dec-11f1-9f08-bc111e65a1f8",
      "createdAt": "2026-03-12T08:34:57.000Z",
      "updatedAt": "2026-03-12T08:34:57.000Z"
    }
  ]
}
```

**Erreurs :**
- `404` — Département introuvable

---

### GET `/communes` — Liste des 77 communes
**Accès :** Public | **Status :** ✅ 200 OK

**Query params :**
| Param | Type | Défaut |
|-------|------|--------|
| page | number | 1 |
| limit | number | 10 |

**Réponse 200 :**
```json
{
  "data": [
    {
      "id": "5a2b7e7b-1dee-11f1-9f08-bc111e65a1f8",
      "name": "Banikoara",
      "departmentId": "db390482-1dec-11f1-9f08-bc111e65a1f8",
      "createdAt": "2026-03-12T08:34:57.000Z",
      "updatedAt": "2026-03-12T08:34:57.000Z",
      "department": {
        "id": "db390482-1dec-11f1-9f08-bc111e65a1f8",
        "name": "Alibori",
        "code": "AL",
        "createdAt": "2026-03-12T08:24:15.000Z",
        "updatedAt": "2026-03-12T08:24:15.000Z"
      }
    }
  ],
  "meta": {
    "total": 77,
    "page": 1,
    "limit": 20,
    "totalPages": 4
  }
}
```

> **Note :** Chaque commune inclut son département. `totalPages: 4` car il y a 77 communes avec `limit=20`.

---

### GET `/communes/:id` — Une commune par ID
**Accès :** Public | **Status :** ✅ 200 OK

**Réponse 200 :**
```json
{
  "id": "5a2b7e7b-1dee-11f1-9f08-bc111e65a1f8",
  "name": "Banikoara",
  "departmentId": "db390482-1dec-11f1-9f08-bc111e65a1f8",
  "createdAt": "2026-03-12T08:34:57.000Z",
  "updatedAt": "2026-03-12T08:34:57.000Z",
  "department": {
    "id": "db390482-1dec-11f1-9f08-bc111e65a1f8",
    "name": "Alibori",
    "code": "AL",
    "createdAt": "2026-03-12T08:24:15.000Z",
    "updatedAt": "2026-03-12T08:24:15.000Z"
  }
}
```

**Erreurs :**
- `404` — Commune introuvable
