# RevisionApp (Révisions GL3A)

PWA de révision d'examens pour GL3A (IAI Cameroun) : résumés, QCM auto-évalués, sujets ouverts, épreuves corrigées (extraites par OCR), et planning des examens en temps réel. Espace collaboratif — les étudiants proposent des épreuves, un admin modère via Supabase.

## Stack

- **Frontend** : JavaScript vanilla + HTML5 + CSS3, **zéro dépendance build / zéro npm**. SPA pure.
- **PWA** : Service Worker (`sw.js`, offline-first) + `manifest.json`.
- **Backend** : Supabase (PostgreSQL + RLS) pour épreuves partagées, analytics, modération.
- **Libs via CDN** : Supabase JS SDK, Tesseract (OCR PDF).
- **Déploiement** : Docker (Caddy alpine), Railway (principal), Vercel.

## Structure

```
index.html              structure unique de la SPA
app.js                  navigation, quiz, scoring (cœur applicatif)
styles.css / theme-*.css design mobile-first
sw.js                   Service Worker (cache offline)
manifest.json           métadonnées PWA

data.js / data-jeudi.js / data-ue.js   résumés + QCM
epreuves.js             139 questions d'anciens sujets
ocr.js                  scan/OCR de PDF (Tesseract)
programme.js            planning officiel + statut des examens

cloud-config.js         URL + clé anon Supabase (publiques, RLS côté serveur)
cloud.js                client Supabase (épreuves partagées, modération)
supabase-*.sql          schémas BD

Dockerfile / Caddyfile  image de déploiement
vercel.json / railway.json  config déploiement
```

Point d'entrée : `index.html` → `app.js` → charge dynamiquement `data*.js`, `epreuves.js`, `cloud.js`.

## Commandes

| Action | Commande |
|---|---|
| Dev local | `python -m http.server 8088` puis ouvrir http://localhost:8088 |
| Build Docker | `docker build -t revisions-gl3a .` |
| Lancer Docker | `docker run -p 8080:80 revisions-gl3a` |
| Déploiement | Railway / Vercel : automatique au `git push` (voir `railway.json`, `vercel.json`) |

Pas de framework de test : QA manuelle.

## À savoir

- **Clés Supabase en clair** dans `cloud-config.js` : ce sont les clés **anon publiques**, c'est attendu — la sécurité repose sur les RLS PostgreSQL côté serveur, pas sur le secret de la clé.
- **Offline** : Service Worker — shell en cache-first, `data*.js` en network-first, appels Supabase jamais cachés. Penser à **bumper la version du SW** quand on change les assets, sinon les clients gardent l'ancien cache.
- **État local** (localStorage) : `gl3a_best_scores`, `gl3a_theme`, `gl3a_route`, `gl3a_user_epreuves`, `gl3a_ue_open`, `gl3a_cloud_approved`.
- **Dates examens codées en dur** dans `programme.js` (rattrapages 10–13 juin 2026) — à mettre à jour à chaque session.
- **Modération** : utilisateur propose (pending) → admin valide dans Supabase (approved) → visible par tous.
