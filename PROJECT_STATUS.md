# Plan de Développement Vitrophy OS

## 🟢 Phase 1 : Initialisation & Socle Technique (✅ Terminé)

- [x] **Initialisation Framework** : Next.js 14, TypeScript, Tailwind, ESLint.
- [x] **Nettoyage** : Suppression boilerplate, fichiers par défaut.
- [x] **Architecture** : Structure des dossiers (`src/app`, `lib`, `components`, `types`).
- [x] **Dépendances** : Installation de Zod, TanStack Query, Supabase SSR, DnD Kit, Recharts.
- [x] **Design System (Base)** : Configuration Tailwind, Variables CSS (Zinc), Utils `cn()`.
- [x] **Composants UI (Base)** : Installation `shadcn-ui`, composant `Button`.
- [x] **Layouts** : Shell Admin (Sidebar) et Shell Workshop (Bottom Nav) créés.
- [x] **Configuration** : Clients Supabase (`client.ts`, `server.ts`), `QueryClientProvider`.

## 🟡 Phase 2 : Composants & Backend (À Faire)

- [x] **Compléter Shadcn UI** : Générer les composants manquants.
    - [x] `Card`
    - [x] `Badge`
    - [x] `Table`
    - [x] `Dialog`
    - [x] `Sheet`
    - [x] `Input`
    - [x] `Form`
    - [x] `Tabs`
    - [x] `Sonner` (Toasts)
- [x] **Base de Données Supabase** :
    - [x] Créer les tables SQL (`projects`, `items`, `profiles`, `timesheets`).
    - [x] Configurer les RLS (Row Level Security).
    - [x] Générer les types TypeScript (`database.types.ts`).
- [x] **Authentification** :
    - [x] Page de Login fonctionnelle.
    - [x] Middleware pour protection des routes et redirection par rôle.

## 🔴 Phase 3 : Fonctionnalités Métier (À Faire)

### Espace Admin
- [x] **Dashboard** : KPIs et Bento Grid.
- [x] **Projets** : Liste filtrable et Page détail projet.
- [x] **CRUD** : Création de projet et ajout d'items.
- [x] **Kanban** : Vue drag & drop des statuts.
- [x] **Deadlines** : Badges J-7 / J-3 et tri par urgence.
- [x] **Workflow BAT** : Historique versions + blocage production.
- [x] **Saisie multi-lignes** : Tableur express pour items.

### Espace Atelier
- [x] **Liste Tâches** : Vue mobile "Tunnel".
- [x] **Actions** : Cocher les étapes (Découpe, Gravure...).
- [x] **Time Tracking** : Bouton Start/Stop.

