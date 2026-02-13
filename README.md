# Win Academy Backend


## Table des Matières

1. [Présentation du Projet](#-présentation-du-projet)
2. [Problématique](#-problématique)
3. [Vision & Objectifs](#-vision--objectifs)
4. [Architecture Technique](#-architecture-technique)
5. [Modélisation du Domaine](#-modélisation-du-domaine)
6. [Structure du Projet](#-structure-du-projet)
7. [Sécurité](#-sécurité)
8. [Performance](#-performance)
9. [Environnements](#-environnements)
10. [Installation & Démarrage](#-installation--démarrage)
11. [API Documentation](#-api-documentation)
12. [Livrables](#-livrables)
13. [Contribution](#-contribution)
14. [License](#-license)

---

##  Présentation du Projet

**Win Academy** est une plateforme EdTech béninoise de formation en ligne dédiée à la maîtrise du digital, pensée spécifiquement pour les réalités locales, notamment les zones à faible débit internet.

Ce n'est pas simplement un site de cours. C'est une infrastructure éducative numérique adaptée au contexte africain.

### Public Cible

- Élèves du secondaire
- Étudiants
- Jeunes en reconversion
- Habitants des zones rurales ou périurbaines
- Jeunes souhaitant acquérir des compétences digitales professionnelles

### Proposition de Valeur

1. Des formations digitales structurées en catégories
2. Des modules organisés avec progression claire
3. Une évaluation obligatoire en fin de parcours
4. Une attestation numérique avec identifiant unique et QR code
5. Une expérience optimisée pour connexion faible

---

## ❓ Problématique

Au Bénin, particulièrement dans les zones reculées :

- L'accès à des formations digitales structurées est limité
- La connexion internet est souvent instable ou lente
- Les jeunes manquent de repères et de parcours pédagogiques clairs
- Les certifications locales crédibles sont rares

**Résultat** : un écart croissant entre les opportunités numériques et les compétences disponibles.

---

##  Vision & Objectifs

### Vision

Permettre à tout jeune béninois, même avec une connexion modeste et un smartphone basique, d'accéder à des formations digitales structurées, validées et certifiantes.

Win Academy ambitionne de devenir une référence nationale en matière d'éducation numérique accessible.

### Objectifs Principaux

Créer une plateforme de formation en ligne :

- ✅ Accessible
- ✅ Optimisée pour faible bande passante
- ✅ Mobile-first
- ✅ Pédagogiquement structurée
- ✅ Évolutive et scalable
- ✅ Capable de supporter 20 000+ apprenants et des milliers de connexions simultanées

---

##  Architecture Technique

| Composant | Technologie |
|-----------|-------------|
| Framework | NestJS 10.x |
| Langage | TypeScript 5.x |
| ORM | Prisma 5.x |
| Base de Données | MySQL 8.x |
| Documentation API | Swagger/NestJS |
| Authentification | JWT (Access + Refresh Token) |
| Validation | class-validator + ValidationPipe |
| Sécurité | Helmet + Rate Limiting |

### Objectifs Techniques

- Exposer une API REST sécurisée
- Servir deux applications :
  - App Utilisateur (étudiants)
  - App Admin
- Gérer toute la logique métier
- Gérer authentification + autorisation
- Gérer génération de certificats
- Garantir intégrité des données
- Être scalable et maintenable

---

##  Modélisation du Domaine

### Entités Principales

```
Department
└── Commune
    └── User
        ├── Enrollment
        ├── Attempt
        └── Certificate

Category
└── Formation
    ├── Module
    │  └── Content
    ├── Evaluation
    │  └── Question
    │     └── Answer
    └── Enrollment
```

### Détail des Entités

#### 1. USER
Représente toute personne ayant accès au système (apprenant ou administrateur).

| Attribut | Type | Description |
|----------|------|-------------|
| id | UUID | Identifiant unique |
| firstName | String | Prénom |
| lastName | String | Nom |
| dateOfBirth | DateTime | Date de naissance |
| sex | ENUM (M/F) | Sexe |
| communeId | FK → Commune | Commune de résidence |
| email | String | Adresse email |
| passwordHash | String | Mot de passe hashé |
| role | ENUM | LEARNER / ADMIN / SUPER_ADMIN |
| status | ENUM | ACTIVE / SUSPENDED / DELETED |
| createdAt | DateTime | Date de création |
| updatedAt | DateTime | Date de mise à jour |

**Relations :**
- 1 User → N Enrollments
- 1 User → N Attempts
- 1 User → N Certificates

**Règles Métier :**
- Email obligatoire pour utilisateurs ≥ 18 ans
- Password stocké hashé
- communeId obligatoire
- Un user peut s'inscrire à plusieurs formations
- Seul rôle LEARNER peut avoir des enrollments

#### 2. DEPARTMENT
Représente une division administrative nationale.

| Attribut | Type | Description |
|----------|------|-------------|
| id | UUID | Identifiant unique |
| name | String (unique) | Nom du département |
| code | String (unique) | Code du département |
| createdAt | DateTime | Date de création |
| updatedAt | DateTime | Date de mise à jour |

**Relations :**
- 1 Department → N Communes

**Règles Métier :**
- Nom unique
- Impossible de supprimer un département contenant des communes

#### 3. COMMUNE
Sous-division administrative appartenant à un seul département.

| Attribut | Type | Description |
|----------|------|-------------|
| id | UUID | Identifiant unique |
| name | String | Nom de la commune |
| departmentId | FK → Department | Département parent |
| createdAt | DateTime | Date de création |
| updatedAt | DateTime | Date de mise à jour |

**Relations :**
- N Communes → 1 Department
- 1 Commune → N Users

**Règles Métier :**
- departmentId obligatoire
- Combinaison (name + departmentId) unique
- Impossible de supprimer une commune si des users y sont rattachés

#### 4. CATEGORY
Permet de classer les formations et contrôler l'accès par âge.

| Attribut | Type | Description |
|----------|------|-------------|
| id | UUID | Identifiant unique |
| name | String | Nom de la catégorie |
| description | String | Description détaillée |
| image | String | URL de l'image |
| ageMin | Int | Âge minimum |
| ageMax | Int | Âge maximum |
| createdAt | DateTime | Date de création |

**Relations :**
- 1 Category → N Formations

**Règles Métier :**
- ageMin ≤ ageMax
- L'âge du learner doit être compris entre ageMin et ageMax pour s'inscrire à une formation de cette catégorie

#### 5. FORMATION
Représente un parcours pédagogique complet.

| Attribut | Type | Description |
|----------|------|-------------|
| id | UUID | Identifiant unique |
| title | String | Titre de la formation |
| shortDescription | String | Description courte |
| fullDescription | String | Description complète |
| level | String | Niveau de difficulté |
| duration | Int | Durée en heures |
| image | String | URL de l'image |
| categoryId | FK → Category | Catégorie parente |
| createdAt | DateTime | Date de création |

**Relations :**
- N Formations → 1 Category
- 1 Formation → N Modules
- 1 Formation → 1 Evaluation
- 1 Formation → N Enrollments
- 1 Formation → N Certificates

**Règles Métier :**
- Une formation appartient obligatoirement à une catégorie
- Une formation possède une seule évaluation finale
- Modification restreinte si des utilisateurs sont déjà inscrits

#### 6. MODULE
Subdivision pédagogique d'une formation.

| Attribut | Type | Description |
|----------|------|-------------|
| id | UUID | Identifiant unique |
| title | String | Titre du module |
| description | String | Description |
| order | Int | Ordre dans la formation |
| formationId | FK → Formation | Formation parente |

**Relations :**
- N Modules → 1 Formation
- 1 Module → N Contents

**Règles Métier :**
- order unique à l'intérieur d'une formation
- Suppression interdite si progression existante

#### 7. CONTENT
Élément pédagogique concret.

| Attribut | Type | Description |
|----------|------|-------------|
| id | UUID | Identifiant unique |
| type | ENUM | VIDEO / PDF / TEXT / IMAGE |
| title | String | Titre du contenu |
| url | String | URL du contenu |
| order | Int | Ordre dans le module |
| moduleId | FK → Module | Module parent |

**Relations :**
- N Contents → 1 Module

**Règles Métier :**
- order unique dans un module
- url obligatoire sauf pour TEXT si contenu stocké en base

#### 8. ENROLLMENT
Lien entre un User et une Formation.

| Attribut | Type | Description |
|----------|------|-------------|
| id | UUID | Identifiant unique |
| userId | FK → User | Apprenant |
| formationId | FK → Formation | Formation |
| progressPercentage | Int | Pourcentage de progression (0-100) |
| status | ENUM | IN_PROGRESS / COMPLETED |
| enrolledAt | DateTime | Date d'inscription |

**Type :** Many-to-Many User ↔ Formation

**Règles Métier :**
- Un user ne peut être inscrit qu'une seule fois à une formation
- progressPercentage entre 0 et 100
- status = COMPLETED si progression = 100%

#### 9. EVALUATION
Examen final d'une formation.

| Attribut | Type | Description |
|----------|------|-------------|
| id | UUID | Identifiant unique |
| formationId | FK → Formation | Formation parente |
| passingScore | Int | Score minimal pour réussite |
| maxAttempts | Int | Nombre max de tentatives |
| timeLimit | Int | Temps limite (en minutes) |

**Relations :**
- 1 Evaluation → N Questions
- 1 Evaluation → N Attempts

**Règles Métier :**
- passingScore ≤ score maximal possible
- maxAttempts ≥ 1
- Une formation possède exactement une évaluation

#### 10. QUESTION
Question appartenant à une évaluation.

| Attribut | Type | Description |
|----------|------|-------------|
| id | UUID | Identifiant unique |
| evaluationId | FK → Evaluation | Évaluation parente |
| questionText | String | Texte de la question |

**Relations :**
- 1 Question → N Answers

**Règles Métier :**
- Au moins une réponse correcte par question

#### 11. ANSWER
Réponse possible à une question.

| Attribut | Type | Description |
|----------|------|-------------|
| id | UUID | Identifiant unique |
| questionId | FK → Question | Question parente |
| answerText | String | Texte de la réponse |
| isCorrect | Boolean | Est-ce la bonne réponse ? |

**Règles Métier :**
- Au moins une réponse avec isCorrect = true par question

#### 12. ATTEMPT
Tentative d'un utilisateur à une évaluation.

| Attribut | Type | Description |
|----------|------|-------------|
| id | UUID | Identifiant unique |
| userId | FK → User | Apprenant |
| evaluationId | FK → Evaluation | Évaluation |
| score | Int | Score obtenu |
| passed | Boolean | A réussi ? |
| attemptNumber | Int | Numéro de la tentative |
| createdAt | DateTime | Date de la tentative |

**Règles Métier :**
- attemptNumber incrémenté automatiquement
- Nombre de tentatives ≤ maxAttempts
- passed = true si score ≥ passingScore

#### 13. CERTIFICATE
Certificat délivré après réussite.

| Attribut | Type | Description |
|----------|------|-------------|
| id | UUID | Identifiant unique |
| userId | FK → User | Apprenant |
| formationId | FK → Formation | Formation |
| uniqueCode | String | Code unique du certificat |
| issuedAt | DateTime | Date de délivrance |
| qrCodeUrl | String | URL du QR code |

**Relations :**
- 1 User → N Certificates
- 1 Formation → N Certificates

**Règles Métier :**
- Généré uniquement si dernière tentative validée
- uniqueCode unique globalement
- Un seul certificat par user par formation

### Mode Preview (Option Stratégique)

Possibilité pour un visiteur non connecté de :
- Suivre un module marqué comme preview
- Progression stockée en localStorage
- Invitation à créer un compte

**Important :** Ce n'est pas un Enrollment réel. Aucune donnée persistante en base.

---

## Structure du Projet

```
win-academy-backend/
├── src/
│   ├── main.ts                    # Point d'entrée de l'application
│   ├── app.module.ts              # Module racine
│   │
│   ├── prisma/                    # Configuration Prisma
│   │   ├── schema.prisma          # Schema de la base de données
│   │   └── migrations/            # Migrations
│   │
│   ├── auth/                      # Module d'authentification
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── guards/
│   │   └── strategies/
│   │
│   ├── users/                     # Module utilisateurs
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.entity.ts
│   │   └── dto/
│   │
│   ├── formations/                # Module formations
│   │   ├── formations.module.ts
│   │   ├── formations.controller.ts
│   │   ├── formations.service.ts
│   │   ├── formations.entity.ts
│   │   └── dto/
│   │
│   ├── categories/                # Module catégories
│   │   ├── categories.module.ts
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts
│   │   ├── categories.entity.ts
│   │   └── dto/
│   │
│   ├── modules/                   # Module modules
│   │   ├── modules.module.ts
│   │   ├── modules.controller.ts
│   │   ├── modules.service.ts
│   │   ├── modules.entity.ts
│   │   └── dto/
│   │
│   ├── contents/                  # Module contenus
│   │   ├── contents.module.ts
│   │   ├── contents.controller.ts
│   │   ├── contents.service.ts
│   │   ├── contents.entity.ts
│   │   └── dto/
│   │
│   ├── enrollments/               # Module inscriptions
│   │   ├── enrollments.module.ts
│   │   ├── enrollments.controller.ts
│   │   ├── enrollments.service.ts
│   │   ├── enrollments.entity.ts
│   │   └── dto/
│   │
│   ├── evaluations/               # Module évaluations
│   │   ├── evaluations.module.ts
│   │   ├── evaluations.controller.ts
│   │   ├── evaluations.service.ts
│   │   ├── evaluations.entity.ts
│   │   └── dto/
│   │
│   ├── attempts/                  # Module tentatives
│   │   ├── attempts.module.ts
│   │   ├── attempts.controller.ts
│   │   ├── attempts.service.ts
│   │   ├── attempts.entity.ts
│   │   └── dto/
│   │
│   ├── certificates/              # Module certificats
│   │   ├── certificates.module.ts
│   │   ├── certificates.controller.ts
│   │   ├── certificates.service.ts
│   │   ├── certificates.entity.ts
│   │   └── dto/
│   │
│   ├── departments/               # Module départements
│   │   ├── departments.module.ts
│   │   ├── departments.controller.ts
│   │   ├── departments.service.ts
│   │   ├── departments.entity.ts
│   │   └── dto/
│   │
│   ├── communes/                  # Module communes
│   │   ├── communes.module.ts
│   │   ├── communes.controller.ts
│   │   ├── communes.service.ts
│   │   ├── communes.entity.ts
│   │   └── dto/
│   │
│   └── common/                    # Code partagé
│       ├── decorators/
│       ├── filters/
│       ├── guards/
│       ├── interceptors/
│       ├── pipes/
│       └── utils/
│
├── test/                          # Tests
├── config/
├── .env                           # Variables d'environnement
├── .env.example
├── package.json
├── tsconfig.json
├── nest-cli.json
├── prisma.schema
└── README.md
```

---

##  Sécurité

### Mesures de Sécurité Implémentées

| Mesure | Description |
|--------|-------------|
| **Global Validation Pipe** | Validation automatique des données entrantes |
| **DTO + class-validator** | Schémas de validation stricts pour chaque endpoint |
| **Global Exception Filter** | Gestion centralisée et cohérente des erreurs |
| **Rate Limiting** | Protection contre les abus et attaques brute-force |
| **CORS Configuré** | Contrôle strict des origines autorisées |
| **Helmet** | Headers HTTP sécurisés par défaut |
| **Sanitisation des Données** | Nettoyage des entrées utilisateur |
| **JWT avec Rotation** | Access Token + Refresh Token avec rotation |

### Règles Métier Critiques

- ✅ Email unique obligatoire
- ✅ Impossible de supprimer une formation si des users y sont inscrits
- ✅ Impossible de générer un certificat sans validation préalable
- ✅ Seuls les admins peuvent publier une formation
- ✅ Progression calculée automatiquement
- ✅ **Score calculé côté serveur uniquement** (anti-triche)

---

## ⚡ Performance

### Optimisations

- **Pagination obligatoire** sur toutes les listes
- **Index DB** sur :
  - `email` (recherche rapide utilisateurs)
  - `formationId` (requêtes formations)
  - `userId` (requêtes utilisateurs)
- **Transactions Prisma** pour opérations critiques (atomicité)
- **Cache** (à implémenter si nécessaire)
- **Compression gzip** des réponses

---

##  Environnements

| Environnement | Description |
|---------------|-------------|
| **Dev** | Développement local |
| **Staging** | Tests avant production |
| **Production** | Environment de production |

### Variables d'Environnement

```env
# Base de données
DATABASE_URL=mysql://user:password@localhost:3306/win_academy

# Authentification
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRATION=3600
JWT_REFRESH_EXPIRATION=86400

# Serveur
PORT=3000
NODE_ENV=development

# Autres
FRONTEND_URL=http://localhost:3001
```

---

##  Installation & Démarrage

### Prérequis

- Node.js 18+
- MySQL 8.x
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone https://github.com/VOGLOSSOU/win-academy-backend.git
cd win-academy-backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos配置

# Initialiser la base de données
npx prisma migrate dev

# (Optionnel) Seed des données initiales
npx prisma db seed

# Démarrer le serveur en mode développement
npm run start:dev
```

### Commandes Utiles

```bash
# Build pour production
npm run build

# Démarrer en production
npm run start:prod

# Linter
npm run lint

# Formatter
npm run format

# Tests
npm run test
npm run test:e2e
npm run test:cov
```

---

##  API Documentation

La documentation API est générée automatiquement avec **Swagger**.

### Accès à Swagger UI

```
http://localhost:3000/api
```

### Structure de la Documentation

- Routes groupées par module
- Authentification protégée
- Exemples de requêtes et réponses
- Codes d'erreur documentés

---

##  Livrables

### Livrables Attendus

1. ✅ API complète fonctionnelle
2. ✅ Documentation Swagger prête
3. ✅ Fichier Prisma schema propre
4. ✅ Scripts migration
5. ✅ Seed initial admin
6. ✅ Gestion erreurs propre
7. ✅ Structure modulaire respectée
8. ✅ Tests basiques sur auth + evaluation

### Résultat Final

Une API :

- **Stable** - Tests approfondis
- **Sécurisée** - Toutes les mesures de sécurité
- **Modulaire** - Architecture NestJS
- **Scalable** - Prête pour 20 000+ utilisateurs
- **Prête à connecter** :
  - Frontend User
  - Frontend Admin

---

##  Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

---

##  License

Nathan VOGLOSSOU.

---
