# 🤖 IA de la GL3A (Gemini) — Mise en route

L'app embarque deux fonctions IA (et bientôt plus — Prof IA, générateur de quiz) :

- **📷 Scan IA** : photo d'épreuve → OCR → Gemini la **corrige automatiquement**
  → épreuve corrigée + QCM ajoutés au quiz (partagée à tous après validation
  du délégué).
- **🎯 Pourquoi j'ai faux ?** : au quiz, après une mauvaise réponse, le
  **Prof IA** explique l'erreur de façon personnalisée.

```
App → Edge Function Supabase (gl3a-ia, quota 10/jour/appareil)
        → Google Gemini (clé GRATUITE, secrète côté serveur)
```

La partie navigateur est **déjà déployée** avec le site. Il reste **4 étapes
serveur**, à faire **une seule fois**.

---

## Étape 1 — Créer la clé Gemini (gratuit, 2 minutes)

1. Va sur **https://aistudio.google.com** et connecte-toi avec ton compte Google.
2. Menu **Get API key** → **Create API key** → copie la clé (`AIza...`).

> Palier gratuit : largement suffisant pour la promo. Aucune carte bancaire.

## Étape 2 — Exécuter le SQL

Dashboard Supabase → **SQL Editor** → **New query**, et exécute (Run) :
1. [`supabase-ia.sql`](./supabase-ia.sql) — colonne `quiz` + quota IA partagé.
2. [`supabase-cours.sql`](./supabase-cours.sql) — bibliothèque de cours du **Prof IA** (table `cours` + recherche FR).
3. [`supabase-cours-seed.sql`](./supabase-cours-seed.sql) — pré-remplit la bibliothèque avec les **notions des 18 matières** déjà dans l'app (264 fiches).

> Le Prof IA (chat) et le générateur de QCM s'appuient sur cette bibliothèque.
> Tu peux l'enrichir ensuite via l'espace délégué → **📚 Bibliothèque de cours**
> (colle un cours validé, conforme au programme).

## Étape 3 — Déployer l'Edge Function `gl3a-ia`

### Option A — via le CLI (recommandé)
```bash
npm install -g supabase
supabase login
supabase link --project-ref qqlirzwlvpcpyaacfjjp
supabase functions deploy gl3a-ia --no-verify-jwt
```
> `--no-verify-jwt` : le site appelle la fonction avec la clé **anon**
> (publique). La sécurité repose sur la clé Gemini, qui reste secrète,
> et sur le quota par appareil.

### Option B — via le dashboard
Dashboard Supabase → **Edge Functions** → **Deploy a new function** →
nom `gl3a-ia` → colle le contenu de
[`supabase/functions/gl3a-ia/index.ts`](./supabase/functions/gl3a-ia/index.ts)
→ déploie → dans les **détails de la fonction**, désactive **Verify JWT**.

## Étape 4 — Donner la clé Gemini à la fonction (secret)

```bash
supabase secrets set GEMINI_API_KEY=AIza...
```
ou : Dashboard → **Edge Functions** → **Secrets** → ajouter `GEMINI_API_KEY`.

Réglages optionnels :
```bash
supabase secrets set GEMINI_MODEL=gemini-2.5-flash   # modèle (défaut)
supabase secrets set IA_QUOTA_JOUR=10                # appels IA/jour/appareil
supabase secrets set IA_QUOTA_GLOBAL_JOUR=300        # plafond global/jour (promo)
```
> ℹ️ Défaut `gemini-2.5-flash` : sur les projets Google récents, le palier
> gratuit de `gemini-2.0-flash` est à 0 (erreur 429 `limit: 0`). Le 2.5-flash
> est gratuit. Pour changer de modèle sans redéployer, pose juste le secret
> `GEMINI_MODEL`.

---

## Vérifier que ça marche

1. Ouvrir l'app → une matière → **Épreuves** → **📷 Scanner une épreuve** →
   photo d'une épreuve.
2. Après l'OCR : **🤖 Corriger automatiquement (IA)** → aperçu → **✅ Ajouter**.
3. L'épreuve apparaît dans **Épreuves**, ses QCM dans le **Quiz**.
4. Au **Quiz** : se tromper exprès → **🤖 Pourquoi j'ai faux ?** → explication.

## En cas de problème

| Message | Cause / solution |
|---|---|
| « GEMINI_API_KEY non configurée » | Étape 4 oubliée |
| « Quota IA indisponible (supabase-ia.sql ?) » | Étape 2 oubliée |
| « Quota IA du jour atteint » | Normal : 10 appels/jour/appareil |
| « palier gratuit de Gemini saturé » | Limite globale Google atteinte — réessayer plus tard |
| Bouton 🤖 absent après le scan | Recharger l'app (mise à jour du Service Worker) |
