# 🤖 Scan + correction IA des épreuves — Mise en route

Cette fonctionnalité permet à un étudiant de **scanner une épreuve** (photo),
de la faire **corriger automatiquement par l'IA (Claude)**, puis de l'ajouter
à la section **Épreuves** — les QCM extraits viennent **compléter le quiz** de
la matière.

```
Photo → OCR (navigateur) → Edge Function → Claude Sonnet 4.6
      → épreuve corrigée + QCM → visible chez l'auteur tout de suite
      → envoyée en "pending" → partagée à tous après validation du délégué
```

La partie navigateur (scan, aperçu, ajout, quiz) est **déjà déployée** avec le
site. Il reste **3 étapes serveur** à faire **une seule fois**.

---

## Pré-requis
- Le CLI Supabase : `npm install -g supabase` (ou via le dashboard, voir plus bas)
- Une **clé API Anthropic** avec un peu de crédit : https://console.anthropic.com
  (coût indicatif : ~0,01–0,02 $ par épreuve corrigée).

## Étape 1 — Ajouter la colonne `quiz`
Dans le dashboard Supabase → **SQL Editor**, exécuter le contenu de
[`supabase-epreuves-quiz.sql`](./supabase-epreuves-quiz.sql) :

```sql
ALTER TABLE epreuves
  ADD COLUMN IF NOT EXISTS quiz jsonb NOT NULL DEFAULT '[]'::jsonb;
```

## Étape 2 — Déployer l'Edge Function
Le code est dans [`supabase/functions/correct-exam/`](./supabase/functions/correct-exam/index.ts).

```bash
supabase login
supabase link --project-ref qqlirzwlvpcpyaacfjjp
supabase functions deploy correct-exam --no-verify-jwt
```

> `--no-verify-jwt` : le site appelle la fonction avec la clé **anon** (publique).
> La sécurité repose sur le fait que la clé Anthropic, elle, reste secrète.

## Étape 3 — Donner la clé Anthropic à la fonction (secret)
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
# (optionnel) changer de modèle :
supabase secrets set ANTHROPIC_MODEL=claude-sonnet-4-6
```

La clé n'est **jamais** dans le site : elle vit uniquement côté serveur Supabase.

---

## Vérifier que ça marche
1. Ouvrir l'app → une matière → **📷 Scanner une épreuve** → prendre/charger une photo.
2. Après l'OCR, cliquer **🤖 Corriger automatiquement (IA)**.
3. Un aperçu s'affiche (titre, nb de questions, nb de QCM) → **✅ Ajouter aux épreuves + quiz**.
4. L'épreuve apparaît immédiatement dans **Épreuves** ; ses QCM dans le **Quiz**.
5. Côté délégué : la file de modération (écran admin) permet d'**approuver** pour
   partager à tout le monde.

Si le bouton 🤖 n'apparaît pas, c'est que `SUPABASE_URL` / `SUPABASE_ANON_KEY`
ne sont pas configurés (`cloud-config.js`) — l'app retombe alors sur l'ajout
manuel, sans IA.

## Dépannage
| Symptôme | Cause probable |
|----------|----------------|
| `ANTHROPIC_API_KEY non configurée` | Étape 3 non faite |
| `Erreur API Claude` (502) | clé invalide / crédit épuisé |
| Le QCM n'apparaît pas dans le quiz | épreuve encore en *pending* (valider en admin) ou épreuve sans QCM |
| Bouton IA absent | Supabase non configuré dans `cloud-config.js` |
