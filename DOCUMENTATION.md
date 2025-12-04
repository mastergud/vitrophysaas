VITROPHY OS – BIBLE FONCTIONNELLE & TECHNIQUE

Version : 1.0 (Master)
Date : 03/12/2025
Auteur : Jérôme & IA (GPT-5.1 Thinking)
Statut : En conception avancée / début implémentation

0. TABLE DES MATIÈRES

Résumé exécutif

Objectifs & proposition de valeur

Vision globale & philosophie produit

Personas, rôles & permissions

Cas d’utilisation & scénarios utilisateur

Logique métier & workflows

Architecture technique
7.1 Frontend
7.2 Backend / API
7.3 Base de données
7.4 Services externes & automatisations
7.5 Sécurité & RLS

Structure des pages / écrans / routes
8.1 Espace Admin (Bureau)
8.2 Espace Atelier (Étudiants / Expert)
8.3 Authentification & gestion utilisateurs

Wireframes conceptuels (description textuelle)

Ergonomie & UX

UI, style graphique & ambiance

Design system (couleurs, typographies, composants)

Mécaniques interactives

Spécifications techniques détaillées

Contraintes juridiques & légales

SEO, performance & accessibilité

Plan d’évolution & roadmap

Risques & points critiques

Glossaire

1. RÉSUMÉ EXÉCUTIF

Vitrophy OS est un système interne (ERP / OS métier) conçu pour la branche Vitrophy de Vitralux Bradtke :
trophées, médailles, porte-clés, gravure/découpe laser, projets sur-mesure.

Le système doit :

Centraliser toutes les demandes clients (projets Vitrophy)

Suivre le cycle complet : demande → devis → BAT → production → livraison → facturation

Connecter le bureau et l’atelier sans perte d’information

Masquer les informations sensibles (prix, marges) aux personnes non autorisées

Offrir une UI/UX haut de gamme, fluide, inspirée des SaaS modernes / Apple

Servir de base scalable pour des extensions futures (stock, intégration Notion/Slack, automatisation d’emails, etc.)

2. OBJECTIFS & PROPOSITION DE VALEUR
2.1 Objectifs de la plateforme

Suivi clair de tous les projets Vitrophy

Une ligne de vie unique par projet (Tournoi de foot, Gala, etc.)

Chaque projet peut contenir plusieurs items (trophées, médailles, coupes, plaques, porte-clés)

Réduction des erreurs de production

Spécifications techniques claires

Différenciation explicite Verre / Plexi / Médaille / Coupe fournisseur

Alertes pour tâches sensibles (collage UV, verre fragile)

Blocage de certaines actions tant que des conditions ne sont pas remplies (ex. coupe non reçue)

Sécurité des données financières

Les étudiants ne voient jamais les prix, coûts ni marges

Séparation physique des données dans la base (schéma operations_private)

Simplification de la gestion au quotidien

Vue globale pour Jérôme / Marvin (pipeline, urgences)

Vision tunnel pour l’atelier (ce qu’il y a à faire maintenant)

Suivi du temps pour les étudiants (pointage)

Scalabilité

La base de données doit accepter de nouveaux types de produits sans refonte

L’architecture doit supporter de futurs modules (stock, facturation, connecteurs externes)

2.2 Proposition de valeur

Pour le Bureau (Admin/Commercial) :
Une tour de contrôle pour piloter Vitrophy : projets, délais, rentabilité, incidents, flux atelier.

Pour l’Atelier :
Une vision tunnel ultra simple : “Qu’est-ce que je dois produire maintenant ?”, sans distractions.

Pour l’Entreprise :
Un socle technique propre, sécurisé, évolutif, qui remplace les fichiers Excel, post-it et mails dispersés.

3. VISION GLOBALE & PHILOSOPHIE
3.1 Mantra

“Du premier mail client jusqu’au dernier ruban posé sur la médaille — tout est piloté dans Vitrophy OS.”

3.2 Points clés de la vision

Manufacture Hybride : un projet = un ensemble d’items hétérogènes
(trophées verre, plexi, médailles, coupes fournisseur, porte-clés, plaques…)

Langage de l’objet : le système comprend ce que signifie “médaille 50 mm avec ruban tricolore” vs “trophée verre collage UV”.

UI premium :
pas de “tableau moche” type Excel → dashboards élégants, cartes, kanban, bento grids.

Sécurité structurelle, pas juste visuelle :
les prix ne sont pas “cachés en CSS” mais inaccessibles en BDD pour les étudiants.

Digitalisation progressive :

Phase 0 : on peut partir d’un Google Sheet / Notion bien structuré.

Phase 1 : Vitrophy OS (Next.js + Supabase).

Phase 2+ : Automatisations avancées (Slack, mails, code-barres, Dymo, stock, etc.)

4. PERSONAS, RÔLES & PERMISSIONS
4.1 Personas
👑 ADMIN (Jérôme / Marvin)

Objectif : vendre, organiser, sécuriser la qualité, suivre les marges.

Besoins :

Vue globale de tous les projets, par statut et par deadline

Accès aux prix, marges, coûts

Faciliter la communication avec les clients (BAT, délais)

Suivre l’activité de l’atelier

Contexte : Desktop principalement.

⭐ EXPERT (Laura)

Objectif : gérer les tâches complexes (verre, collage UV, pièces fragiles).

Besoins :

Voir les projets et items marqués comme “EXPERT”

Marquer ces tâches comme terminées

Remonter des incidents ou des contraintes spécifiques

Contexte : Desktop / tablette.

🎓 ÉTUDIANTS (atelier)

Objectif : produire, assembler, découper, graver, emballer.

Besoins :

Liste claire des tâches du jour

Savoir quoi faire exactement pour chaque item (dimensions, texte, matériau)

Signaler les incidents simplement

Pointer leurs heures

Contexte : Tablette / mobile, utilisation rapide.

🧾 ADMINISTRATIF / COMPTA (ex : Sandrine) – FUTUR MODULE

Objectif : facturation, suivi paiements.

Besoins :

Voir les projets “à facturer” / “payés”

Statut des paiements

Contexte : Desktop.

4.2 Rôles techniques

admin

Accès à tout (projets, items, finances, logs, temps, configuration)

expert

Accès production + projets/items + incidents

Pas d’accès au schéma operations_private

student

Accès uniquement aux données nécessaires à la production

Aucune visibilité sur prix, coûts, marges, contacts clients, statut financier

5. CAS D’UTILISATION & SCÉNARIOS UTILISATEUR
5.1 Cas d’utilisation principaux

Création d’un nouveau projet Vitrophy

Admin crée un projet “Tournoi FC Kaerjeng – 2025”

Ajoute le client + deadline

Ajoute les items (ex : 3 trophées verre, 40 médailles, 1 coupe)

Définit pour chaque item les specs (diamètre, texte gravé, matériau, etc.)

Suivi du statut projet

Le projet passe de draft → prepress (BAT) → production → delivered → archived

Gestion des BAT

Admin upload un BAT PDF lié au projet / item

Statut BAT : en attente / validé / à corriger

Une fois validé, le projet bascule en “OK pour production”

Production atelier (students)

Étudiant ouvre la vue Atelier
→ voit la liste des projets en production (ou scanne un QR code de fiche tâche)

Pour chaque item, il coche : découpe / gravure / assemblage / emballage

Signale incidents si besoin (casse, machine HS…)

Tâches Expert

Les items complexity = 'EXPERT' apparaissent dans une liste dédiée

Seul Expert/ Admin peuvent les marquer comme terminés

Livraison / retrait

Admin marque “Client prévenu” puis “Enlevé / livré”

Le projet passe production → delivered

Suivi financier (futur)

Admin voit le prix total, coûts, marge, statut payé

Compta voit les projets à facturer, etc.

Time tracking

Étudiants : bouton Start / Stop pour leur journée/mission

Possibilité de corriger une entrée (flag is_edited)

6. LOGIQUE MÉTIER & WORKFLOWS
6.1 Workflow projet (macro)

LEAD / DEMANDE

Admin reçoit une demande (mail, téléphone)

Crée un projet avec état initial draft ou prepress selon logique interne

DEVIS & BAT

Projet paramétré (items créés avec specs)

Devis généré (futur module PDF)

Envoi BAT → statut prepress / BAT_PENDING

Client valide → BAT_VALIDATED

PRODUCTION

Admin assigne un tray_number (bac physique atelier)

Statut projet → production

Items internes (MAKE) entrent dans le flux atelier

Items externes (BUY) attendent confirmation received = true

FIN DE PRODUCTION

Tous les items sont “terminés” (production_done)

Projet marqué “Prêt / emballé”

Client prévenu

LIVRAISON / ARCHIVAGE

Client vient chercher ou livraison effectuée

Statut → delivered

Plus tard → archived

6.2 MAKE vs BUY (logique hybride)

MAKE :
Traitement en interne (découpe, gravure, assemblage, etc.)

BUY :

Commande auprès d’un fournisseur (ex : coupe, médailles préfabriquées)

Champs specs incluent supplier_ref, ordered, received, etc.

Règle métier : tant que received ≠ true, impossible de passer l’item en assemblage terminé

6.3 Complexité (NORMAL vs EXPERT)

complexity = 'NORMAL' : tâches réalisables par étudiants

complexity = 'EXPERT' : nécessite validation / intervention de Laura ou d’un admin

L’UI bloque student pour marquer l’item comme terminé

Seul Expert/Admin peut cocher la dernière étape

6.4 Incidents

Types : casse, problème matériel, rupture stock, erreur de gravure, etc.

Effets :

Log d’incident attaché au projet/item

Notification (future automatisation Slack / email)

Possibilité de recalculer temps, replanifier, produire en double, etc. (future logique)

7. ARCHITECTURE TECHNIQUE
7.1 Frontend

Framework : Next.js 14 (App Router)

Langage : TypeScript (strict)

UI : TailwindCSS + Shadcn/UI (thème New York, palette Zinc)

State / Data Fetching : TanStack Query (v5)

Formulaires : React Hook Form + Zod

Interaction avancée :

@dnd-kit : Kanban (drag & drop projet)

sonner : toasts de feedback

@react-pdf/renderer : génération de fiches PDF (job sheets)

Recharts : graphiques (KPIs, stats)

Organisation des dossiers (cible) :

/src
 ├─ app/
 │   ├─ login/
 │   ├─ admin/
 │   │   ├─ dashboard/
 │   │   ├─ projects/
 │   │   └─ settings/
 │   └─ workshop/
 │       ├─ tasks/
 │       └─ time/
 ├─ components/
 │   ├─ ui/           # Shadcn
 │   └─ features/     # ProjectCard, TrayBadge, SpecsRenderer, etc.
 ├─ lib/
 ├─ types/
 └─ utils/
     └─ supabase/

7.2 Backend / API

Backend “léger” : Next.js (route handlers) + Supabase comme BaaS

Deux modes d’accès aux données :

Client-side : via Supabase client + TanStack Query

Server-side : via service key côté server (pour certaines opérations admin)

Endpoints types (Next.js route handlers, conceptuellement) :

/api/projects : CRUD projets

/api/project-items : CRUD items

/api/incidents : log incidents

/api/timesheets : pointage

/api/export/job-sheet : génération PDF de fiche projet

7.3 Base de données

Supabase (PostgreSQL), avec séparation :

public : données opérationnelles

operations_private : données financières & sensibles

Tables principales (public)

profiles

clients

projects

project_items

timesheets

(plus tard) incidents, attachments, bat_files, etc.

Tables privées (operations_private)

project_financials

Le champ clé dans project_items :
specs JSONB, qui stocke les détails techniques spécifiques à chaque type d’objet.

Exemples :

Trophée verre :

{ "type": "glass_trophy", "thickness": "10mm", "technique": "uv_gluing", "layers": 3 }


Médaille :

{ "type": "medal", "diameter": "50mm", "lanyard_color": "tricolor", "sticker_ref": "S-LOGO-CLUB" }


Coupe fournisseur :

{ "type": "cup", "supplier_ref": "CAT-2025-X", "sticker_size": "25mm", "plate_text": "Vainqueur U15" }

7.4 Services externes & automatisations (présent & futur)

Présent :

Supabase Auth & Storage

Futur proche :

Slack : notifications (incident, projet terminé, retard)

Email (via Supabase ou autre) : envoi automatique d’emails clients (BAT, prêt, relance)

Futur plus lointain :

Connexion Dymo / imprimante étiquettes (via serveur local)

Code-barres / QR codes pour lier bacs physiques et projets

Intégration partielle avec Notion ou Google Sheets (export/reporting)

7.5 Sécurité & RLS

Rôles gérés via profiles.role (admin / expert / student)

RLS activé sur public & operations_private

Politiques :

operations_private uniquement accessible aux admins

Les étudiants :

peuvent lire certains champs de projects et project_items (statut = production, etc.)

ne voient jamais les infos client détaillées ni project_financials

handle_new_user : trigger créant automatiquement un profiles avec rôle student

8. STRUCTURE DES PAGES / ÉCRANS / ROUTES
8.1 Espace Admin (Bureau)

/admin/dashboard

KPIs (nombre de projets en cours, en retard, terminés, etc.)

Kanban par statut (draft / prepress / production / delivered / archived)

Bloc “Rush / Urgences” (deadlines proches ou dépassées)

Activité récente (logs d’évènements)

/admin/projects

Liste des projets (table filtrable + tri)

Filtres : statut, deadline, client, type d’items, etc.

/admin/projects/[id]

Détails projet :

Infos client

Référence, titre, deadline, bac

Liste des items (avec specs résumées)

Historique statut

(futur) Onglet finances (si admin)

/admin/projects/new

Formulaire création projet

Ajout direct d’items

/admin/settings

Gestion de certains paramètres (types d’items prédéfinis, couleurs rubans par défaut, etc.)

8.2 Espace Atelier (Workshop)

/workshop

Page d’accueil mobile

Liste des projets en production, triés par bac / urgence

/workshop/tasks/[projectId]

Vue détaillée des items à produire pour ce projet :

Étapes : découpe / gravure / assemblage / emballage

Boutons “Terminé” pour chaque étape

Bouton “Incident”

/workshop/time

Interface de pointage :

Bouton Start / Stop

Liste des entrées récentes (modifiables avec flag is_edited)

8.3 Authentification

/login

Connexion via Supabase Auth (email + password)

Redirection selon rôle :

admin / expert → /admin/dashboard

student → /workshop

9. WIREFRAMES CONCEPTUELS (TEXTUEL)
9.1 Dashboard Admin

Header : “Vitrophy OS – Dashboard”

Section 1 (Bento KPIs) :

Carte “Projets en cours”

Carte “Projets en retard”

Carte “Production du jour”

Section 2 (Kanban) :

Colonnes : Draft | Prépress | Production | Delivered | Archivé

Cartes projets : réf + titre + deadline + petit badge (verre / plexi / mixte)

Section 3 (Activité) :

Liste chronologique : “Théo a terminé la découpe du projet VIT-25-012”

9.2 Vue Projet Admin

Block Info (haut) :

VIT-25-034 – Tournoi FC Progrès

Client, deadline, bac, statut

Tabs :

Items | BAT | Logs | Finances (admin only)

Tab Items :

Liste type table :
Type | Description courte | Qte | Complexité | Statut | Actions

Boutons :

“Générer fiche Job PDF”

“Passer en Production / Delivered”

9.3 Vue Atelier – Liste

Top : “Tâches du jour”

Cartes :

Bac : “Bac A”

Projet : nommé

Badges : type (verre, médailles, coupes), urgence

Bouton “Voir / Produire”

9.4 Vue Atelier – Détail Projet

Liste de blocs pour chaque item :

Titre item

Specs résumé (diamètre, matériau, texte)

Étapes avec cases à cocher (ou boutons)

Bouton “Incident”

10. ERGONOMIE & UX

Mobile-first pour l’atelier

Desktop-first pour admin

Navigation claire :

Admin : sidebar gauche

Atelier : bottom navigation

Toujours limiter les choix visibles :

Étudiants ne voient que les actions de production

Boutons grands, espacés, facilement cliquables en atelier

Feedback immédiat (toasts, changement d’état visuel)

11. UI / STYLE GRAPHIQUE / AMBIANCE

Ambiance : SaaS premium / Apple-like

Palette principale : Zinc (gris neutres) via Shadcn

Accents :

Rouge = erreur / incident / retard

Orange = en production

Vert = terminé / livré

Bleu = info / lead

Typographie : Inter

Icônes :

Kanban, tâches, temps, incidents → utiliser un set cohérent (ex: Lucide icons via Shadcn)

12. DESIGN SYSTEM

Couleurs :

Background : bg-zinc-950 (sidebar), bg-zinc-900 (layout foncé), bg-zinc-50 (contenu clair)

Texte : text-zinc-50, text-zinc-900

Accent : red-500, amber-500, green-500, blue-500

Typographie :

Titre : text-2xl font-semibold

Sous-titre : text-lg font-medium

Texte : text-sm / text-base

Composants clés :

Button, Card, Badge, Tabs, Table, Dialog, Sheet, Toast, Alert

Composant métier : ProjectCard, ItemSpecs, TrayNumberBadge, StatusBadge, IncidentButton

13. MÉCANIQUES INTERACTIVES

Kanban drag & drop :

Déplacer un projet entre colonnes met à jour son statut

Confirmation visible (toast)

Checklist production :

Cocher une étape → envoie update BDD, feedback instantané

Time tracking :

Bouton Start / Stop → crée / clôture une ligne timesheets

Job Sheet PDF + QR Code (futur) :

Scan sur tablette → ouvre directement /workshop/tasks/[projectId]

14. SPÉCIFICATIONS TECHNIQUES DÉTAILLÉES

TypeScript strict, aucun any

Zod pour chaque payload formulaires

RLS activées et testées

Utilisation de Supabase client configuré dans /utils/supabase/client.ts

TanStack Query :

clés structurées : ['projects'], ['project', id], ['project-items', projectId]

invalidations après mutations

15. CONTRAINTES JURIDIQUES & LÉGALES

Données personnelles :

Données essentiellement internes (staff, clients B2B)

Respect de base du RGPD : minimisation, droit d’accès/suppression, sécurité d’accès

Données RH (timesheets) :

Doivent être exactes et traçables (flag is_edited)

Traçabilité production :

Incidents et logs gardés en historique (utile en cas de litiges)

16. SEO / PERFORMANCE / ACCESSIBILITÉ

SEO : faible enjeu (app interne, non publique)

Performance :

Chargement initial optimisé (server components)

Pagination / lazy loading pour listes longues

Cache côté client via TanStack Query

Accessibilité :

Contrastes corrects

Touch targets suffisamment larges

Labels explicites sur les boutons (“Terminer Découpe”, pas juste “OK”)

17. PLAN D’ÉVOLUTION & ROADMAP
Phase 0 – MVP fonctionnel

Auth Supabase

Rôles & profils

CRUD projets + items

Vue admin : liste + détail

Vue atelier : liste + détail + checklists

Time tracking basique

Phase 1 – Confort & contrôle

Kanban Dashboard

Incidents

Job Sheet PDF (sans QR au début)

Statistiques basiques

Phase 2 – Finances & automatisations

operations_private.project_financials

Vue finances admin

Export comptabilité

Notifications Slack

Emails automatiques clients

Phase 3 – Stock & bacs avancés

Module Stock (rubans, médailles, plaques, etc.)

Scan code-barres / QR

Intégration Dymo / étiquettes

18. RISQUES & POINTS CRITIQUES

Mauvaise configuration RLS → fuite de données sensibles vers des roles étudiants

Complexité de specs JSONB → nécessité d’un bon typage côté TS+Zod

Adoption atelier → l’UI doit être vraiment simple, sinon retour aux post-it

Couverture des cas limites (projets très complexes, milliers d’items)

19. GLOSSAIRE

BAC / Tray Number : bac physique dans l’atelier où sont stockés les éléments d’un projet

BAT : Bon à tirer (validation visuelle par le client)

MAKE : item produit en interne

BUY : item acheté auprès d’un fournisseur externe

Complexity (NORMAL / EXPERT) : niveau de compétence requis pour terminer l’item

Vitrophy OS : nom interne de l’application ERP Vitrophy

Specs JSONB : champ flexible contenant les paramètres techniques d’un item