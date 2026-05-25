# 📚 Révisions GL3A — IAI Cameroun

Application web de révision pour les examens de **Génie Logiciel niveau 3** à l'IAI Cameroun (session du 26 mai au 1er juin 2026).

## 📖 Contenu

| Matière | Notions | QCM | Sujets ouverts | Épreuves corrigées |
|---|---:|---:|---:|---:|
| **POO Avancée** (Django/Flask) | 12 | 28 | 5 | 27 questions |
| **Programmation Mobile** (Flutter) | 12 | 30 | 5 | 40 questions |
| **Analyse des Données** (ACP/AFC/CAH) | 13 | 30 | 5 | 32 questions |
| **Outils Web** (Laravel/PHP) | 15 | 30 | 5 | 40 questions |

**Total : 52 notions · 118 QCM · 20 sujets ouverts · 139 questions corrigées**

## ✨ Fonctionnalités

- **Mode Résumé** : notions clés du cours
- **Mode Quiz QCM** : auto-évaluation avec score, explications, révision des erreurs
- **Mode Sujets ouverts** : questions type examen avec réponses modèles
- **Mode Épreuves corrigées** : anciens sujets extraits des PDFs, corrigés en détail
- **Mode sombre / clair**
- **PWA** : installable, fonctionne offline une fois ouverte
- **Meilleur score sauvegardé** par matière

## 🚀 Utilisation

### En ligne
👉 **https://revisions-gl3a.up.railway.app** (URL définitive après déploiement)

### En local
```bash
python -m http.server 8088
# Puis ouvrir http://localhost:8088
```

### Sur ton téléphone
Sur Chrome / Edge :
1. Ouvre l'URL ci-dessus
2. Menu → « Ajouter à l'écran d'accueil »
3. L'app s'ouvre comme une vraie app, fonctionne hors-ligne

## 🛠 Stack technique

- HTML5 / CSS3 / JavaScript vanilla (zéro dépendance front)
- Service Worker pour le cache offline
- Manifest PWA
- Serveur Caddy en production (via Dockerfile)

## 📂 Structure

```
RevisionApp/
├── index.html        # Structure de l'app
├── styles.css        # Design mobile-first
├── app.js            # Logique (navigation, quiz, scoring)
├── data.js           # Résumés + QCM + sujets ouverts
├── epreuves.js       # 139 questions d'épreuves corrigées
├── sw.js             # Service Worker offline
├── manifest.json     # PWA manifest
├── Dockerfile        # Build production (Caddy)
├── Caddyfile         # Config serveur web
└── railway.json      # Config déploiement Railway
```

## 🙏 Contenu pédagogique

Extrait des cours et sujets d'examens IAI Cameroun (filière Génie Logiciel niveau 3, année académique 2024-2025) — usage pédagogique uniquement, pour la révision entre camarades.

---

Bonne chance pour les examens ! 💪
