# Aqualab Technologie — Plateforme Web Full-Stack

> Application web complète pour **Aqualab Technologie**, entreprise marocaine basée à Casablanca (depuis 2006), spécialisée dans l'importation et la distribution de matériels industriels, scientifiques et de laboratoire.

---

## 📋 Table des matières

- [Aperçu du projet](#aperçu-du-projet)
- [Architecture](#architecture)
- [Technologies utilisées](#technologies-utilisées)
- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Structure du projet](#structure-du-projet)
- [API Reference](#api-reference)
- [Panel d'administration](#panel-dadministration)

---

## Aperçu du projet

La plateforme Aqualab est une application **full-stack** composée de deux sous-projets indépendants :

| Sous-projet | Technologie | Rôle |
|---|---|---|
| `projet-stage-complet-backend` | Laravel 12 + MySQL | API REST + logique métier |
| `projet-stage-complet-frontend` | Next.js 16 + React 19 | Site public + Panel admin |

Le site public présente les produits, services et actualités de la société, et intègre un **chatbot IA** alimenté par Google Gemini. Le panel d'administration permet de gérer l'ensemble du contenu via une interface sécurisée.

---

## Architecture

```
Aqualab_stage_pfa/
├── projet-stage-complet-backend/   # API Laravel (port 8000)
└── projet-stage-complet-frontend/  # App Next.js  (port 3000)
```

```
┌─────────────────────┐       REST/JSON        ┌──────────────────────┐
│   Next.js Frontend  │ ◄────────────────────► │   Laravel Backend    │
│   (port 3000)       │                         │   (port 8000)        │
│                     │   Laravel Sanctum       │                      │
│  • Site public      │   (auth par cookie)     │  • API REST          │
│  • Panel admin      │                         │  • Queue (jobs)      │
└─────────────────────┘                         │  • Brevo SMTP        │
                                                └──────────┬───────────┘
                                                           │
                                                    ┌──────▼──────┐
                                                    │   MySQL DB  │
                                                    └─────────────┘
```

---

## Technologies utilisées

### Backend
| Outil | Version | Usage |
|---|---|---|
| PHP | ^8.2 | Langage serveur |
| Laravel | ^12.0 | Framework principal |
| Laravel Sanctum | ^4.3 | Authentification SPA (cookie) |
| MySQL | — | Base de données |
| Brevo (SMTP) | — | Envoi d'e-mails |
| Google Gemini API | `gemini-3.5-flash-lite` | Chatbot IA, scoring candidatures, descriptions produits |
| OpenAI API | `gpt-4o-mini` | Suggestions de slugs SEO (optionnel) |
| Laravel Queue | database | Traitement asynchrone des e-mails |

### Frontend
| Outil | Version | Usage |
|---|---|---|
| Next.js | 16.2.10 | Framework React SSR/SSG |
| React | 19.2.4 | UI library |
| Tailwind CSS | ^4 | Styles utilitaires |
| Framer Motion | ^12 | Animations |
| Lucide React | ^1.23 | Icônes |
| react-hot-toast | ^2.6 | Notifications |
| react-markdown | ^10.1 | Rendu Markdown (blog) |
| react-countup | ^6.5 | Compteurs animés |

---

## Fonctionnalités

### 🌐 Site public
- **Page d'accueil** — Présentation de la société, chiffres clés, partenaires
- **Produits** — Catalogue hiérarchisé par catégories principales, catégories et sous-catégories
- **Services** — Présentation des services proposés
- **Actualités (Blog)** — Articles filtrables par catégorie, avec rendu Markdown
- **À propos** — Histoire et informations de la société
- **Contact** — Formulaire de contact avec notification e-mail asynchrone
- **Recrutement** — Dépôt de candidature avec analyse IA du CV et scoring de priorité
- **Newsletter** — Abonnement / désinscription avec envoi automatique des nouveaux articles
- **Chatbot IA** — Assistant conversationnel alimenté par Google Gemini (contexte Aqualab)
- **SEO avancé** — Sitemap dynamique, robots.txt, métadonnées Open Graph, Schema.org JSON-LD
- **Mode sombre / clair** — Thème persisté dans le localStorage

### 🔒 Panel d'administration (`/admin`)
Accès sécurisé par authentification Sanctum.

| Section | Fonctionnalités |
|---|---|
| **Dashboard** | Statistiques générales |
| **Catégories** | CRUD, génération IA de descriptions, suppression en masse |
| **Catégories principales** | CRUD |
| **Catégories produits** | CRUD |
| **Produits** | CRUD complet |
| **Actualités** | CRUD, génération IA de contenu, suggestion de slug SEO, envoi newsletter |
| **Partenaires** | CRUD avec upload d'image |
| **Candidatures** | Consultation, scoring IA de priorité, gestion des statuts |
| **Messages de contact** | Consultation, marquage lu/non-lu, suppression |
| **Newsletter** | Gestion des abonnés (activation, désactivation, suppression) |

---

## Prérequis

Assurez-vous d'avoir installé :

- **PHP** >= 8.2 avec les extensions : `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `fileinfo`
- **Composer** >= 2.x
- **Node.js** >= 18.x et **npm** >= 9.x
- **MySQL** >= 8.0
- Un compte **Brevo** pour l'envoi d'e-mails (SMTP)
- Une clé API **Google Gemini** (gratuit sur [aistudio.google.com](https://aistudio.google.com/apikey))

---

## Structure du projet

### Backend

```
projet-stage-complet-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/        # Contrôleurs REST publics
│   │   │   ├── Admin/              # Contrôleurs réservés aux admins
│   │   │   └── ...
│   │   ├── Requests/               # Form Requests (validation)
│   │   └── Resources/              # API Resources (transformation JSON)
│   ├── Jobs/                       # Jobs asynchrones (e-mails)
│   │   ├── SendArticleNewsletterJob.php
│   │   ├── SendApplicationNotificationJob.php
│   │   └── SendContactNotificationJob.php
│   ├── Mail/                       # Mails Laravel (Mailable)
│   ├── Models/                     # Modèles Eloquent
│   │   ├── Article.php
│   │   ├── Category.php
│   │   ├── Application.php
│   │   ├── Partner.php
│   │   ├── NewsletterSubscriber.php
│   │   └── ...
│   └── Services/                   # Logique métier / IA
│       ├── GeminiService.php       # Client Google Gemini
│       ├── ChatService.php         # Chatbot IA
│       ├── ArticleContentService.php
│       ├── ApplicationPriorityService.php
│       ├── ProductDescriptionService.php
│       ├── SlugSuggestionService.php
│       └── NewsletterService.php
├── database/migrations/            # Migrations SQL
├── routes/api.php                  # Définition de toutes les routes API
└── .env.example
```

### Frontend

```
projet-stage-complet-frontend/
├── src/
│   ├── app/
│   │   ├── (site)/                 # Routes du site public
│   │   │   ├── page.js             # Page d'accueil
│   │   │   ├── produits/
│   │   │   ├── services/
│   │   │   ├── actualites/
│   │   │   ├── a-propos/
│   │   │   ├── contact/
│   │   │   ├── recrutement/
│   │   │   └── newsletter/
│   │   ├── admin/                  # Panel d'administration
│   │   │   ├── login/
│   │   │   └── (panel)/
│   │   │       ├── dashboard/
│   │   │       ├── categories/
│   │   │       ├── products/
│   │   │       ├── news/
│   │   │       ├── applications/
│   │   │       ├── contact/
│   │   │       ├── newsletter/
│   │   │       └── partners/
│   │   ├── sitemap.js              # Sitemap dynamique
│   │   └── robots.js               # robots.txt dynamique
│   ├── components/                 # Composants React réutilisables
│   ├── services/                   # Appels API (fetch vers le backend)
│   ├── admin/                      # Composants et services du panel admin
│   ├── context/                    # Contextes React (auth, thème, …)
│   ├── lib/                        # Utilitaires (metadata, helpers)
│   ├── data/                       # Données statiques et schémas SEO
│   └── styles/                     # CSS global
└── next.config.mjs
```

---

## API Reference

### Routes publiques

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories` | Liste des catégories de produits |
| `GET` | `/api/categories/{slug}` | Détail d'une catégorie |
| `GET` | `/api/articles` | Liste des articles de blog |
| `GET` | `/api/articles/{slug}` | Détail d'un article |
| `GET` | `/api/blog-categories` | Catégories du blog |
| `GET` | `/api/main-categories` | Catégories principales |
| `GET` | `/api/product-categories` | Sous-catégories produits |
| `GET` | `/api/partners` | Liste des partenaires |
| `POST` | `/api/contact` | Envoi d'un message de contact |
| `POST` | `/api/newsletter/subscribe` | Abonnement à la newsletter |
| `POST` | `/api/newsletter/unsubscribe` | Désabonnement |
| `POST` | `/api/chat` | Interaction avec le chatbot IA |
| `POST` | `/api/applications` | Dépôt d'une candidature |
| `POST` | `/api/auth/login` | Connexion administrateur |

> Les routes POST de contact, newsletter et chat sont limitées à **20 requêtes/minute** (throttle).

### Routes protégées (auth:sanctum)

Toutes les routes admin nécessitent une session Sanctum active.

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/dashboard` | Statistiques du tableau de bord |
| `POST` | `/api/categories/generate-description` | Génération IA de description |
| `POST` | `/api/articles/generate-content` | Génération IA de contenu d'article |
| `POST` | `/api/articles/suggest-slug` | Suggestion IA de slug SEO |
| `POST` | `/api/applications/{id}/priority-score` | Scoring IA d'une candidature |
| `GET` | `/api/admin/newsletter/subscribers` | Liste des abonnés newsletter |
| … | … | CRUD complet pour toutes les ressources |


## Licence

Projet réalisé dans le cadre d'un **stage de fin d'année (PFA)**.  
© 2026 Aqualab Technologie — Casablanca, Maroc.
