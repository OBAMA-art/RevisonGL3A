// Matieres - rattachees a leur UE
const MATIERES_JEUDI = [
  {
    "id": "ia",
    "titre": "Intro. à l'IA",
    "sousTitre": "Intelligence Artificielle",
    "couleur": "#a855f7",
    "icone": "🧠",
    "resume": [
      {
        "titre": "Définition de l'IA",
        "contenu": "L'IA conçoit des programmes capables d'apprendre, de raisonner et de résoudre des problèmes complexes, par opposition aux programmes classiques qui suivent des instructions prédéfinies. IA faible (spécialisée : Siri, AlphaGo), IA forte/AGI (égale l'humain, théorique), super-IA/ASI. ELIZA (1966, Weizenbaum) = 1er chatbot. John McCarthy (conférence Dartmouth 1956) = père de l'IA."
      },
      {
        "titre": "Données, Big Data et Data Science",
        "contenu": "Une donnée est toute information enregistrée numériquement (texte, photo, email, poésie écrite, vidéo, capteur). Une idée orale non enregistrée n'est PAS une donnée. Big Data = données massives caractérisées par les 5V (Volume, Vélocité, Variété, Véracité, Valeur). Data Science : analyser ces données + prédire actions/comportements futurs."
      },
      {
        "titre": "Hiérarchie IA/ML/Deep Learning",
        "contenu": "IA = domaine le plus large. Machine Learning = sous-discipline de l'IA (apprend des données sans être explicitement programmé). Deep Learning = sous-discipline du ML (réseaux profonds multi-couches). Inclusion : DL ⊂ ML ⊂ IA ⊂ Data Science."
      },
      {
        "titre": "Types d'apprentissage",
        "contenu": "1) Supervisé : données étiquetées (caractéristiques + cibles fournies). Ex : classification d'images, détection de spam. 2) Non supervisé : structures découvertes seules dans des données non étiquetées (clustering, k-means). 3) Par renforcement (essai/erreur) : agent + environnement + récompenses. Ex : AlphaGo, jeux vidéo, robotique."
      },
      {
        "titre": "Pipeline d'un projet IA",
        "contenu": "(1) Définition du problème ; (2) Collecte des données ; (3) Exploration (visualisation, stats descriptives) ; (4) Nettoyage : valeurs manquantes/aberrantes, doublons, normalisation ; (5) Modélisation : règles mathématiques + choix d'algo ; (6) Entraînement (sur partie des données extraites de l'exploration) ; (7) Évaluation ; (8) Déploiement et suivi."
      },
      {
        "titre": "Régression logistique",
        "contenu": "Algorithme de classification (malgré son nom) qui utilise la fonction sigmoïde / logistique σ(x)=1/(1+e⁻ˣ) pour produire une sortie entre 0 et 1 interprétée comme probabilité. Surtout pour problèmes binaires. Sklearn fournit LogisticRegression. Autres activations : ReLU, tanh, softmax."
      },
      {
        "titre": "Réseaux de neurones et Deep Learning",
        "contenu": "Inspirés du cerveau : couches (entrée/cachées/sortie) reliées par poids. Chaque neurone = somme pondérée + biais + activation. Entraînement par rétropropagation du gradient. Anti-surapprentissage : L1/L2, data augmentation, Dropout (désactivation aléatoire). Frameworks : TensorFlow, Keras, PyTorch."
      },
      {
        "titre": "CNN (Convolutional Neural Networks)",
        "contenu": "Réseau profond spécialisé en vision. Convolution = filtrer l'image en petits carrés (kernels) qui détectent motifs locaux (bords, textures). Couches : convolution + pooling (réduction) + dense (classification). Créés via TensorFlow/PyTorch. Applications : reconnaissance d'images, détection d'objets, vision médicale."
      },
      {
        "titre": "Recherche : BFS et DFS",
        "contenu": "BFS (Breadth-First, en largeur) : FILE FIFO, niveau par niveau, trouve le plus court chemin (graphe non pondéré). DFS (Depth-First, en profondeur) : PILE LIFO, explore loin avant de revenir, économe en mémoire mais non optimal. Tous deux : trace des visités (set) pour éviter boucles. Bifurcation : BFS visite tous les voisins, DFS s'enfonce dans une branche."
      },
      {
        "titre": "Recherche informée (A*)",
        "contenu": "Utilise une heuristique h(n) pour estimer la distance restante. A* combine coût réel g(n) et heuristique : f(n)=g(n)+h(n). Si h admissible (ne surestime jamais), A* optimal. Vs recherche aveugle (BFS/DFS) qui explore sans guide. Ex : trouver un étudiant → BFS visite bâtiment par bâtiment, A* utilise distance euclidienne au dernier emplacement connu."
      },
      {
        "titre": "Biais algorithmique et éthique",
        "contenu": "Distorsion systématique défavorisant un groupe, due aux données/labels/conception. Ex : femmes sous-représentées historiquement aux postes à responsabilité = modèle RH biaisé. Solutions : équilibrage du dataset, métriques d'équité, explicabilité (XAI/SHAP/LIME), RGPD, IA Act, diversité des équipes, monitoring."
      },
      {
        "titre": "Applications et impact sociétal",
        "contenu": "Vision (reconnaissance d'image), NLP (chatbots, traduction), systèmes de recommandation, voitures autonomes, médecine (diagnostic), finance (fraude), industrie (maintenance prédictive). Deepfakes = trucages hyperréalistes (GAN). Marché du travail : automatise tâches précises/routinières, ne remplace pas encore l'humain partout, n'éprouve pas d'émotions."
      }
    ],
    "qcm": [
      {
        "q": "Parmi les suivantes, lesquelles sont des données ?",
        "options": [
          "A) Un texte enregistré",
          "B) Une photo de dessert",
          "C) Une idée orale non enregistrée",
          "D) Un email envoyé"
        ],
        "reponse": "A",
        "explication": "Une donnée doit être ENREGISTRÉE numériquement. A, B et D le sont ; C non."
      },
      {
        "q": "Qu'est-ce que le Big Data ?",
        "options": [
          "A) Algorithmes d'IA",
          "B) Sous-disciplines de Data Science",
          "C) Données massives enregistrées",
          "D) Toutes les réponses"
        ],
        "reponse": "C",
        "explication": "Big Data = données massives caractérisées par les 5V."
      },
      {
        "q": "Que permet la Data Science ?",
        "options": [
          "A) Analyser des données massives",
          "B) Anticiper le volume futur",
          "C) Prédire actions/comportements",
          "D) Contrôler les données"
        ],
        "reponse": "C",
        "explication": "But principal : prédire à partir de l'analyse."
      },
      {
        "q": "Le Machine Learning est sous-discipline...",
        "options": [
          "A) Data Science",
          "B) Intelligence Artificielle",
          "C) Deep Learning",
          "D) Robotique"
        ],
        "reponse": "B",
        "explication": "ML est sous-discipline de l'IA. DL est sous-discipline du ML."
      },
      {
        "q": "Le ML permet des programmes...",
        "options": [
          "A) Capables d'apprendre",
          "B) Sûrs et fiables",
          "C) Qui résolvent les problèmes complexes",
          "D) Lents et fiables"
        ],
        "reponse": "A",
        "explication": "La caractéristique fondamentale est l'apprentissage automatique."
      },
      {
        "q": "Le Deep Learning est sous-discipline...",
        "options": [
          "A) Data Science",
          "B) Robotique",
          "C) Machine Learning",
          "D) Big Data"
        ],
        "reponse": "C",
        "explication": "DL = branche du ML basée sur les réseaux profonds."
      },
      {
        "q": "Caractéristiques d'un programme d'IA ?",
        "options": [
          "A) Pas malveillant",
          "B) Raisonne vite sur sujet spécifique",
          "C) Exprime des émotions",
          "D) Remplace l'humain partout"
        ],
        "reponse": "B",
        "explication": "IA faible : spécialisée et rapide. Pas d'émotions, ne remplace pas tout."
      },
      {
        "q": "Les acteurs du numérique utilisent les données pour :",
        "options": [
          "A) Cibler les pubs",
          "B) Adapter les services",
          "C) Entraîner algos tiers",
          "D) Toutes ces réponses"
        ],
        "reponse": "D",
        "explication": "Les trois sont vrais (A, B, C)."
      },
      {
        "q": "Quel résultat comporte un biais algorithmique ?",
        "options": [
          "A) Femmes jugées moins capables pour postes à responsabilité",
          "B) Chercheurs médicaux reçoivent annonces hôpitaux",
          "C) Seniors voient pubs club 3e âge",
          "D) Aucune"
        ],
        "reponse": "A",
        "explication": "A reproduit une inégalité historique. B et C sont du ciblage légitime."
      },
      {
        "q": "Qu'est-ce qu'un deepfake ?",
        "options": [
          "A) Diffusion massive",
          "B) Trucage hyperréaliste d'image/vidéo",
          "C) Technique anti-biais",
          "D) Programme de réponses auto"
        ],
        "reponse": "B",
        "explication": "Généré par IA (GAN), substitue visage/voix."
      },
      {
        "q": "Comment l'IA modifie le marché du travail ?",
        "options": [
          "A) Effectue tâches à notre place",
          "B) Remplace métiers routiniers",
          "C) Divise par 2 le temps de travail",
          "D) A et B"
        ],
        "reponse": "D",
        "explication": "Automatise + remplace métiers routiniers. La division par 2 n'est pas prouvée."
      },
      {
        "q": "En quoi consiste le nettoyage des données ?",
        "options": [
          "A) Rendre les données exploitables",
          "B) Supprimer données personnelles",
          "C) Sélectionner données selon hypothèse",
          "D) Retirer aberrantes"
        ],
        "reponse": "A",
        "explication": "Inclut traitement des valeurs manquantes, aberrantes (D fait partie de A), doublons, normalisation."
      },
      {
        "q": "Que montrer au modèle durant l'entraînement ?",
        "options": [
          "A) Partie des données de l'exploration",
          "B) Erreurs des modèles précédents",
          "C) Nouvelles données du Data Mining",
          "D) Aucune"
        ],
        "reponse": "A",
        "explication": "Train set = 70-80% des données issues de l'exploration."
      },
      {
        "q": "Programme classant des images selon critères non définis : quel apprentissage ?",
        "options": [
          "A) Supervisé",
          "B) Non supervisé",
          "C) Essai/erreur",
          "D) Transfer learning"
        ],
        "reponse": "B",
        "explication": "Critères non définis + pas d'étiquettes = clustering (non supervisé)."
      },
      {
        "q": "Programme classant chat/chien/lapin/souris : quel apprentissage ?",
        "options": [
          "A) Supervisé",
          "B) Non supervisé",
          "C) Essai/erreur",
          "D) Deep learning seulement"
        ],
        "reponse": "A",
        "explication": "Classes définies à l'avance + labels = classification supervisée multi-classes."
      },
      {
        "q": "Que permet la convolution ?",
        "options": [
          "A) Reproduire un réseau",
          "B) Filtrer l'image en kernels",
          "C) Réduire les couches",
          "D) Supprimer overfitting"
        ],
        "reponse": "B",
        "explication": "Convolution = petit filtre qui parcourt l'image pour extraire caractéristiques locales."
      },
      {
        "q": "En quoi consiste la modélisation ?",
        "options": [
          "A) Représenter par règles mathématiques",
          "B) Rendre exploitable",
          "C) Visualiser",
          "D) Supprimer données perso"
        ],
        "reponse": "A",
        "explication": "Traduire le problème métier en formalisme mathématique."
      },
      {
        "q": "1er chatbot au monde ?",
        "options": [
          "A) Jarvis",
          "B) ChatGPT",
          "C) ELIZA",
          "D) Bombe"
        ],
        "reponse": "C",
        "explication": "ELIZA (Weizenbaum, MIT, 1966), simulait un psychothérapeute par pattern matching."
      },
      {
        "q": "Affirmation vraie ?",
        "options": [
          "A) AGI dans 5-10 ans (consensus)",
          "B) Nous utilisons l'AGI",
          "C) Apprentissage sans entraînement",
          "D) Aucune"
        ],
        "reponse": "D",
        "explication": "AGI reste théorique, modèles actuels nécessitent entraînement."
      },
      {
        "q": "Affirmation FAUSSE sur régression logistique ?",
        "options": [
          "A) Sigmoïde",
          "B) Logistique",
          "C) Sortie ∈ [0,1]",
          "D) Aucune (tout vrai)"
        ],
        "reponse": "D",
        "explication": "Sigmoïde = fonction logistique (synonymes). Sortie ∈ [0,1]."
      },
      {
        "q": "Paquet Python qui détonne ?",
        "options": [
          "A) playwright",
          "B) sklearn",
          "C) matplotlib",
          "D) nltk"
        ],
        "reponse": "A",
        "explication": "playwright = automation web (tests). Les autres = data/IA."
      },
      {
        "q": "Affirmation FAUSSE sur CNN ?",
        "options": [
          "A) Couches extraient features",
          "B) Créable avec TensorFlow",
          "C) Pas profonds",
          "D) Aucune"
        ],
        "reponse": "C",
        "explication": "Les CNN SONT des réseaux profonds (AlexNet, ResNet >100 couches)."
      },
      {
        "q": "Technique anti-overfitting ?",
        "options": [
          "A) lock in",
          "B) pull",
          "C) dropout",
          "D) push"
        ],
        "reponse": "C",
        "explication": "Dropout désactive aléatoirement des neurones → représentations plus robustes."
      },
      {
        "q": "Affirmation FAUSSE sur BFS/DFS ?",
        "options": [
          "A) DFS utilise pile pour visités ET non visités",
          "B) BFS utilise file",
          "C) Trace des visités pour éviter boucles",
          "D) Sets pour visités"
        ],
        "reponse": "A",
        "explication": "DFS utilise pile pour la FRONTIÈRE (non visités), set pour les VISITÉS."
      },
      {
        "q": "Père fondateur de l'IA ?",
        "options": [
          "A) Marvin Minsky",
          "B) Joe Weizenbaum",
          "C) Sam Altman",
          "D) Geoffrey Hinton"
        ],
        "reponse": "A",
        "explication": "Minsky avec McCarthy, Newell, Simon, Shannon — conférence Dartmouth 1956. Hinton = père du DL moderne."
      },
      {
        "q": "Qu'est-ce qu'une heuristique en recherche informée ?",
        "options": [
          "A) Estime distance restante",
          "B) Structure de données",
          "C) Méthode de nettoyage",
          "D) Algo de tri"
        ],
        "reponse": "A",
        "explication": "h(n) estime le coût restant. Idéalement admissible (ne surestime jamais)."
      },
      {
        "q": "Fonction d'évaluation de A* ?",
        "options": [
          "A) f=h",
          "B) f=g",
          "C) f=g+h",
          "D) f=g×h"
        ],
        "reponse": "C",
        "explication": "A* combine coût réel g(n) et estimation h(n). Optimal si h admissible."
      },
      {
        "q": "Framework Python pour réseaux de neurones ?",
        "options": [
          "A) Django",
          "B) TensorFlow/PyTorch/Keras",
          "C) Flask",
          "D) Pandas"
        ],
        "reponse": "B",
        "explication": "TF (Google), PyTorch (Meta), Keras (haut niveau). Django/Flask = web ; Pandas = tabular."
      },
      {
        "q": "IA faible vs IA forte (AGI) ?",
        "options": [
          "A) IA faible utilise + de données",
          "B) IA faible spécialisée, AGI = intelligence générale humaine",
          "C) IA forte = règles uniquement",
          "D) Aucune différence"
        ],
        "reponse": "B",
        "explication": "IA faible (narrow) excelle sur 1 domaine. AGI (théorique) égale l'humain partout."
      },
      {
        "q": "Le téléphone est-il un élément du processus de communication ?",
        "options": [
          "A) Oui, c'est l'émetteur",
          "B) Non, c'est un canal/outil",
          "C) Oui, c'est le récepteur",
          "D) Oui, c'est le message"
        ],
        "reponse": "B",
        "explication": "Le téléphone est un canal, pas un élément constitutif. Éléments : Sender, Message, Channel, Receiver, Feedback, Context, Noise."
      }
    ],
    "questionsOuvertes": [
      {
        "q": "Classifications de l'IA par fonctionnalité avec exemples.",
        "reponseAttendue": "4 classifications : (1) Machines réactives (sans mémoire, ex: Deep Blue, AlphaGo) ; (2) Mémoire limitée (historique récent : voitures autonomes, chatbots, recommandations) ; (3) Théorie de l'esprit (comprendre émotions/intentions : recherche, Sophia, Kismet) ; (4) Conscience de soi (hypothétique). Par capacité : IA faible/narrow (Siri), AGI (théorique), ASI (super-IA)."
      },
      {
        "q": "Différence BFS vs DFS sur un exemple concret + apport de A* ?",
        "reponseAttendue": "Labyrinthe à étages. BFS (file FIFO) : explore couloirs accessibles à 1 pas, puis 2 pas, etc. — trouve la sortie la plus proche en mouvements mais explore beaucoup de couloirs inutiles. DFS (pile LIFO) : plonge dans un couloir jusqu'au cul-de-sac puis revient — peu de mémoire mais pas optimal. A* utilise heuristique (distance euclidienne à la sortie) : f(n)=g(n)+h(n) → privilégie les couloirs qui rapprochent géométriquement → beaucoup moins de cases explorées tout en gardant l'optimalité si h admissible."
      },
      {
        "q": "Code Python : réseau neuronal 3 entrées, 1 couche cachée 4 neurones, 2 sorties (binaire).",
        "reponseAttendue": "import tensorflow as tf\nfrom tensorflow.keras.models import Sequential\nfrom tensorflow.keras.layers import Dense, Input\n\nmodel = Sequential([\n    Input(shape=(3,)),\n    Dense(4, activation='relu'),\n    Dense(2, activation='softmax')\n])\nmodel.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])\nmodel.summary()\n# model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.2)"
      },
      {
        "q": "Chef de projet IA pour optimiser consommation énergétique d'usine. Détaillez les étapes.",
        "reponseAttendue": "1) Cadrage (KPIs, contraintes) ; 2) Collecte (capteurs IoT, météo, prix kWh, plannings) ; 3) Exploration (séries temporelles, corrélations) ; 4) Nettoyage (valeurs manquantes, aberrantes, synchronisation) ; 5) Feature engineering (heure, jour, saison) ; 6) Modélisation (LSTM, Prophet, XGBoost pour prévision H+24) ; 7) Split 70/15/15 + hyperparams ; 8) Évaluation (RMSE, MAE, MAPE vs baseline) ; 9) Optimisation (PL, RL pour ordonnancer machines) ; 10) Déploiement (API REST, dashboard, alertes) ; 11) Monitoring (drift, réentraînement, ROI)."
      },
      {
        "q": "Biais algorithmique : définition, exemples, solutions.",
        "reponseAttendue": "Distorsion systématique défavorisant un groupe, due aux données/labels/conception. Exemples : RH (CV féminins pénalisés - Amazon 2018), Justice (COMPAS sur-classe Afro-Américains), Vision (moins performante sur peaux foncées), Crédit (refus quartiers défavorisés). Solutions : (a) Audit dataset (représentativité, équilibrage) ; (b) Métriques d'équité (parité démographique) ; (c) Algos de débiaisage (adversarial debiasing) ; (d) Explicabilité (SHAP, LIME) ; (e) Gouvernance (charte, AI Act, RGPD) ; (f) Diversité des équipes ; (g) Feedback humain."
      }
    ],
    "ue": "ia_ue"
  },
  {
    "id": "english",
    "titre": "English Expert",
    "sousTitre": "Anglais technique IT",
    "couleur": "#0ea5e9",
    "icone": "🇬🇧",
    "resume": [
      {
        "titre": "Communication Process",
        "contenu": "Sender → Message → Channel → Receiver → Feedback (+ Context, Noise). Le téléphone n'est PAS un élément du processus, juste un canal. Exemple : un dev envoie un Slack (channel) à son lead (receiver) qui répond OK (feedback)."
      },
      {
        "titre": "Verbal vs Non-Verbal",
        "contenu": "Verbal = WORDS, parlés ou écrits (talking, emails, reports). Non-verbal = SANS mots : facial expressions, gestures, eye contact, body language, posture, tone. Attention : 'spoken words' = verbal ; 'gestures', 'eye contact' = non-verbal."
      },
      {
        "titre": "Business Communication",
        "contenu": "Formelle, claire, concise, orientée objectif. Key features : Clarity, Conciseness, Formality, Accuracy, Professionalism, Purpose-driven. Formel = business email. Informel = chatting at party, jokes, talking to friend."
      },
      {
        "titre": "Structure d'un Formal Email",
        "contenu": "5 parties obligatoires : (1) SUBJECT précis ; (2) GREETING ('Dear Team,', 'Dear Mr. Smith,') ; (3) PURPOSE/BODY ('I am writing to inform you...') ; (4) TIME & DATE précis ; (5) CLOSING ('Best regards,', 'Kind regards,', 'Sincerely,' + nom + fonction)."
      },
      {
        "titre": "IT Core Vocabulary",
        "contenu": "Debug = corriger bugs ; Deploy = mise en prod ; Backend/Frontend = serveur/client ; Framework = cadre ; Repository = dépôt Git ; Branch/Merge/Commit ; Pull Request (PR) ; Deprecated = obsolète ; Scalability = montée en charge ; Latency = temps de réponse ; Payload = données transmises ; Endpoint = URL API ; Build/Release/Rollback ; Pipeline CI/CD ; Stack = pile tech."
      },
      {
        "titre": "Reading Technical Docs",
        "contenu": "Verbes impératifs : install, configure, run, build, deploy, return, throw. Structures : 'This method returns...', 'The function takes...', 'Make sure to...', 'Refer to...', 'Note that...'. Abréviations : i.e., e.g., N.B., RFC. Sections : Overview, Prerequisites, Installation, Usage, API Reference, Troubleshooting."
      },
      {
        "titre": "Professional Idioms",
        "contenu": "Get the ball rolling = démarrer. Low-hanging fruit = tâches faciles à gain rapide. Deep dive = analyse approfondie. Touch base = faire un point. Circle back = revenir plus tard. On the same page = être d'accord. Move the needle = impact significatif. Think outside the box = sortir des sentiers battus. ASAP / EOD / FYI."
      },
      {
        "titre": "Tense Usage",
        "contenu": "Present simple : habitudes/fonctionnement ('The API returns JSON'). Present continuous : action en cours ('I am debugging'). Present perfect : action passée + impact présent ('I have deployed'). Past simple : terminée ('Yesterday I merged'). Will/going to : futur. Modals : should/must/could/would. Erreur fréquente : 'I have did' ❌ → 'I have done' ✓."
      },
      {
        "titre": "Active vs Passive Voice",
        "contenu": "Active : The dev fixed the bug. Passive : The bug was fixed (by the dev). Formation : be + past participle. Très courant en docs/release notes : 'The server has been restarted', 'The endpoint is called every 5s', 'The data is encrypted before transmission'."
      },
      {
        "titre": "Confusing Words (faux-amis)",
        "contenu": "Library (bib. de code) ≠ librairie (bookstore). Eventually = finalement ≠ éventuellement (possibly). Actually = en fait ≠ actuellement (currently). To assist = aider ≠ assister à (to attend). Sensible = sensé ≠ sensible (sensitive). Deception = tromperie ≠ déception (disappointment). Support = soutenir ≠ supporter (to tolerate)."
      },
      {
        "titre": "Meeting Vocabulary",
        "contenu": "Standup/daily, sprint planning, sprint review/demo, retrospective (retro), kickoff, set up a meeting, reschedule, attend, agenda, minutes, action items, blocker, stakeholder, deadline, milestone, deliverable, follow up."
      },
      {
        "titre": "Bug Reporting",
        "contenu": "Steps to reproduce, expected behavior, actual behavior, severity (critical/major/minor), priority, stack trace, workaround, hotfix, patch, root cause, side effect, edge case. Phrases : 'I am encountering an issue with...', 'The application crashes when...', 'The endpoint returns 500 instead of 200'."
      }
    ],
    "qcm": [
      {
        "q": "Which is NOT an element of the communication process?",
        "options": [
          "A) Sender",
          "B) Receiver",
          "C) Telephone",
          "D) Message"
        ],
        "reponse": "C",
        "explication": "Téléphone = canal, pas élément. Éléments : Sender, Message, Channel, Receiver, Feedback, Context, Noise."
      },
      {
        "q": "Verbal communication includes:",
        "options": [
          "A) Facial expressions",
          "B) Gestures",
          "C) Spoken words",
          "D) Eye contact"
        ],
        "reponse": "C",
        "explication": "Verbal = mots (parlés ou écrits). Autres = non-verbal."
      },
      {
        "q": "An example of formal communication is:",
        "options": [
          "A) Telling jokes",
          "B) Writing a business email",
          "C) Chatting at a party",
          "D) Talking to a friend"
        ],
        "reponse": "B",
        "explication": "Email pro = registre formel codifié."
      },
      {
        "q": "Which sentence is correct?",
        "options": [
          "A) I have deploy the version yesterday",
          "B) I deployed the version yesterday",
          "C) I am deployed the version yesterday",
          "D) I deploy the version yesterday"
        ],
        "reponse": "B",
        "explication": "Avec 'yesterday' → past simple (deployed). 'Have deployed' OK sans yesterday."
      },
      {
        "q": "In Git, what does 'merge' mean?",
        "options": [
          "A) Delete a branch",
          "B) Clone a repo",
          "C) Combine changes from one branch into another",
          "D) Revert a commit"
        ],
        "reponse": "C",
        "explication": "Merge = fusionner (souvent feature → main)."
      },
      {
        "q": "What is an 'endpoint' in a REST API?",
        "options": [
          "A) End of a function",
          "B) Specific URL that accepts requests",
          "C) Type of database",
          "D) Final user"
        ],
        "reponse": "B",
        "explication": "Endpoint = URL exposée par une API (ex: /api/users)."
      },
      {
        "q": "'The library is _____ ; please use the new SDK instead.'",
        "options": [
          "A) deployed",
          "B) merged",
          "C) deprecated",
          "D) scaled"
        ],
        "reponse": "C",
        "explication": "Deprecated = obsolète."
      },
      {
        "q": "Best opening for a formal business email?",
        "options": [
          "A) Hey buddy!",
          "B) Dear Mr. Johnson,",
          "C) Yo team",
          "D) What's up?"
        ],
        "reponse": "B",
        "explication": "'Dear + titre + nom' = standard formel."
      },
      {
        "q": "Appropriate formal closing?",
        "options": [
          "A) Cheers mate",
          "B) Bye!",
          "C) Kind regards,",
          "D) Peace out"
        ],
        "reponse": "C",
        "explication": "Kind regards / Best regards / Sincerely."
      },
      {
        "q": "'To touch base' means:",
        "options": [
          "A) Touch the ground",
          "B) Briefly make contact / catch up",
          "C) Start a project",
          "D) Finish a task"
        ],
        "reponse": "B",
        "explication": "Touch base = faire un point rapide."
      },
      {
        "q": "'Low-hanging fruit' refers to:",
        "options": [
          "A) Bad fruit",
          "B) Easy tasks that bring quick wins",
          "C) Risky decisions",
          "D) Senior developers"
        ],
        "reponse": "B",
        "explication": "Tâches faciles à gain rapide."
      },
      {
        "q": "Correct passive form: 'The team deployed the application.'",
        "options": [
          "A) is deploy by the team",
          "B) was deployed by the team",
          "C) has deploy by the team",
          "D) deploying by the team"
        ],
        "reponse": "B",
        "explication": "was/were + past participle (deployed)."
      },
      {
        "q": "What does 'scalability' mean?",
        "options": [
          "A) Screen size",
          "B) Ability to handle increased load",
          "C) Number of devs",
          "D) Software price"
        ],
        "reponse": "B",
        "explication": "Capacité à monter en charge."
      },
      {
        "q": "Feature of business communication?",
        "options": [
          "A) Slang and jokes",
          "B) Clarity and conciseness",
          "C) Long stories",
          "D) Aggressive tone"
        ],
        "reponse": "B",
        "explication": "Clarté + concision = caractéristiques fondamentales."
      },
      {
        "q": "'Please refer _____ the documentation.'",
        "options": [
          "A) at",
          "B) on",
          "C) to",
          "D) in"
        ],
        "reponse": "C",
        "explication": "Refer TO. Préposition figée."
      },
      {
        "q": "'The meeting has been _____ to Friday.'",
        "options": [
          "A) rescheduled",
          "B) recycled",
          "C) reset",
          "D) reduced"
        ],
        "reponse": "A",
        "explication": "Reschedule = reporter."
      },
      {
        "q": "What is a 'commit' in Git?",
        "options": [
          "A) Promise to a teammate",
          "B) Recorded snapshot of changes",
          "C) Type of branch",
          "D) Error message"
        ],
        "reponse": "B",
        "explication": "Commit = instantané enregistré + message."
      },
      {
        "q": "Correct sentence?",
        "options": [
          "A) Yesterday I have fix the bug",
          "B) Yesterday I fixed the bug",
          "C) Yesterday I am fixing the bug",
          "D) Yesterday I fix the bug"
        ],
        "reponse": "B",
        "explication": "Past simple avec yesterday."
      },
      {
        "q": "'Could you send the report _____ Friday?'",
        "options": [
          "A) at",
          "B) in",
          "C) by",
          "D) on"
        ],
        "reponse": "C",
        "explication": "By Friday = avant vendredi (deadline)."
      },
      {
        "q": "What does 'latency' mean?",
        "options": [
          "A) Storage size",
          "B) Delay between request and response",
          "C) Number of users",
          "D) Code quality"
        ],
        "reponse": "B",
        "explication": "Latence = temps requête-réponse."
      },
      {
        "q": "Synonym of 'urgent' in business email:",
        "options": [
          "A) Slow",
          "B) Optional",
          "C) Pressing / time-sensitive",
          "D) Boring"
        ],
        "reponse": "C",
        "explication": "Pressing / time-sensitive = urgent."
      },
      {
        "q": "'Let's _____ on this issue next week.' (revenir)",
        "options": [
          "A) circle back",
          "B) cut off",
          "C) break down",
          "D) shut up"
        ],
        "reponse": "A",
        "explication": "Circle back = revenir sur sujet."
      },
      {
        "q": "A 'stakeholder' is:",
        "options": [
          "A) Junior dev",
          "B) Anyone with interest in the project",
          "C) Type of server",
          "D) Bug tracker"
        ],
        "reponse": "B",
        "explication": "Partie prenante : client, sponsor, utilisateur, équipe."
      },
      {
        "q": "Reported speech: He said, 'I will deploy tomorrow.'",
        "options": [
          "A) he will deploy tomorrow",
          "B) he would deploy the next day",
          "C) he deploys tomorrow",
          "D) he deploy tomorrow"
        ],
        "reponse": "B",
        "explication": "will → would, tomorrow → the next day."
      },
      {
        "q": "'I am responsible _____ the backend module.'",
        "options": [
          "A) of",
          "B) for",
          "C) on",
          "D) with"
        ],
        "reponse": "B",
        "explication": "Responsible FOR. Pas OF (calque français)."
      },
      {
        "q": "'EOD' means:",
        "options": [
          "A) Error of Database",
          "B) End Of Day",
          "C) Encryption Of Data",
          "D) Edit On Demand"
        ],
        "reponse": "B",
        "explication": "End Of Day. 'Send by EOD.'"
      },
      {
        "q": "Identify the error: 'The team have did a great job.'",
        "options": [
          "A) team",
          "B) have did",
          "C) great",
          "D) last sprint"
        ],
        "reponse": "B",
        "explication": "'Have did' faux. Correct : 'has done' ou 'did'."
      },
      {
        "q": "'A deep dive into the codebase' means:",
        "options": [
          "A) Swimming in code",
          "B) Thorough detailed analysis",
          "C) Quick glance",
          "D) Deleting the code"
        ],
        "reponse": "B",
        "explication": "Analyse approfondie."
      },
      {
        "q": "Correct passive sentence?",
        "options": [
          "A) The bug is fix by the dev",
          "B) The bug was fixed by the dev",
          "C) The bug fixed by the dev",
          "D) The bug fix the dev"
        ],
        "reponse": "B",
        "explication": "was/were + past participle."
      },
      {
        "q": "3 key features of business communication?",
        "options": [
          "A) Slang, humor, gossip",
          "B) Clarity, conciseness, formality",
          "C) Length, complexity, ambiguity",
          "D) Anger, rush, mistakes"
        ],
        "reponse": "B",
        "explication": "Section B Q3 du PDF — caractéristiques clés."
      },
      {
        "q": "Communication is defined as the process of sharing ideas, thoughts and feelings through:",
        "options": [
          "A) Only spoken words",
          "B) Only written words",
          "C) Verbal and non-verbal means",
          "D) Computer software exclusively"
        ],
        "reponse": "C",
        "explication": "Le cours combine explicitement le verbal (mots) ET le non-verbal (gestes, expressions)."
      },
      {
        "q": "In the communication process, the receiver's job is to:",
        "options": [
          "A) Encode the message",
          "B) Decode the message",
          "C) Choose the channel",
          "D) Pay the sender"
        ],
        "reponse": "B",
        "explication": "L'émetteur ENCODE l'idée, le récepteur la DÉCODE. Étapes 2 et 4 du modèle en 6 étapes."
      },
      {
        "q": "Which of the following is NOT a form of non-verbal communication?",
        "options": [
          "A) Facial expression",
          "B) Posture",
          "C) Email",
          "D) Gesture"
        ],
        "reponse": "C",
        "explication": "Un email = communication ÉCRITE donc VERBALE. Les autres options sont du non-verbal pur."
      },
      {
        "q": "Wikipedia (cited in the course) defines internal communication as:",
        "options": [
          "A) Communication with customers and suppliers",
          "B) The function responsible for effective communications among participants within an organization",
          "C) Communication between two companies",
          "D) Marketing messages to the general public"
        ],
        "reponse": "B",
        "explication": "Définition exacte du cours : interne = à l'INTÉRIEUR de l'organisation."
      },
      {
        "q": "The main advantage of using an INTRANET for internal communication is that it is:",
        "options": [
          "A) Free for everyone",
          "B) Available 24/7 from any internet-connected device",
          "C) Compatible with WhatsApp only",
          "D) Used for external marketing"
        ],
        "reponse": "B",
        "explication": "L'intranet est disponible 24/7 partout où il y a Internet, selon le cours."
      },
      {
        "q": "Which of the following is a typical channel of EXTERNAL communication?",
        "options": [
          "A) Company intranet",
          "B) Internal staff meeting",
          "C) Customer survey",
          "D) Internal memo"
        ],
        "reponse": "C",
        "explication": "Sondage client = parle aux clients = EXTERNE. Intranet, réunion interne, memo = INTERNE."
      },
      {
        "q": "Formal communication is characterized by:",
        "options": [
          "A) Casual chats during coffee breaks",
          "B) Predefined rules and official channels",
          "C) Rumors spread between colleagues",
          "D) Personal WhatsApp messages"
        ],
        "reponse": "B",
        "explication": "Formel = OFFICIEL, règles, canaux prédéfinis. Les autres options décrivent l'informel."
      },
      {
        "q": "Upward communication mostly takes the form of:",
        "options": [
          "A) Instructions and orders",
          "B) Feedback, suggestions and daily updates from employees",
          "C) Press releases to media",
          "D) Customer complaints"
        ],
        "reponse": "B",
        "explication": "Ascendant = des employés VERS la direction (feedback, suggestions). Descendant = inverse (instructions)."
      },
      {
        "q": "Crosswise communication refers to:",
        "options": [
          "A) Communication only between bosses",
          "B) Communication between individuals or departments across different functional areas",
          "C) Communication with customers only",
          "D) Gossip among friends"
        ],
        "reponse": "B",
        "explication": "Diagonale = entre départements/services différents, transverse, sans suivre la ligne hiérarchique stricte."
      },
      {
        "q": "Which of the following is one of the FOUR types of informal communication?",
        "options": [
          "A) Vertical Strand",
          "B) Horizontal Chain",
          "C) Gossip Chain",
          "D) Downward Loop"
        ],
        "reponse": "C",
        "explication": "Les 4 types sont: Single Strand, Gossip Chain, Probability Chain, Cluster Chain."
      },
      {
        "q": "A document used to inform a group of staff about a specific problem, solution or event is a:",
        "options": [
          "A) Press release",
          "B) Proposal",
          "C) Memo (Memorandum)",
          "D) Resume"
        ],
        "reponse": "C",
        "explication": "Memo = note de service interne. Clé dans le cours."
      },
      {
        "q": "A press release is:",
        "options": [
          "A) A document sent only to employees",
          "B) An official statement issued by an organization to the media and beyond",
          "C) A confidential financial report",
          "D) An informal chat between coworkers"
        ],
        "reponse": "B",
        "explication": "Communiqué de presse = vers les MÉDIAS, donc externe et officiel."
      },
      {
        "q": "Computer-Mediated Communication (CMC) refers to:",
        "options": [
          "A) How two computers communicate via protocols",
          "B) How people communicate via computers through the internet or networks",
          "C) Only video games online",
          "D) Hardware repair manuals"
        ],
        "reponse": "B",
        "explication": "Piège classique : CMC = humain-humain VIA la machine, PAS machine-machine."
      },
      {
        "q": "Which of these tools is an example of CMC in business?",
        "options": [
          "A) A hand-written letter",
          "B) A face-to-face meeting",
          "C) A Zoom or Skype video conference",
          "D) A printed newspaper"
        ],
        "reponse": "C",
        "explication": "Zoom/Skype/Teams = communication médiée par ordinateur (visio, chat, partage)."
      },
      {
        "q": "Which one is generally considered an OPTIONAL section in a resume?",
        "options": [
          "A) Contact information",
          "B) Education",
          "C) Volunteer work",
          "D) Work experience"
        ],
        "reponse": "C",
        "explication": "Le bénévolat (Volunteer work) est OPTIONNEL. Contacts, formation et expérience sont obligatoires."
      },
      {
        "q": "A reverse-chronological resume:",
        "options": [
          "A) Lists the oldest job first",
          "B) Lists the most recent job first, then goes back in time",
          "C) Focuses only on skills",
          "D) Has no work experience section"
        ],
        "reponse": "B",
        "explication": "Anti-chronologique = du plus RÉCENT au plus ANCIEN. Format préféré des recruteurs."
      },
      {
        "q": "Which appropriate closing salutation should you use in a cover letter when you DO NOT know the name of the recipient?",
        "options": [
          "A) Yours sincerely",
          "B) Cheers",
          "C) Yours faithfully",
          "D) See you soon"
        ],
        "reponse": "C",
        "explication": "Règle britannique : 'Dear Sir/Madam' → 'Yours faithfully' ; 'Dear Mr Smith' → 'Yours sincerely'."
      },
      {
        "q": "In the cover letter structure taught in the course, Step 3 (opening paragraph) should:",
        "options": [
          "A) Negotiate your salary",
          "B) Mention the job title and explain your interest in the company",
          "C) List all your hobbies",
          "D) Attack competitors"
        ],
        "reponse": "B",
        "explication": "Étape 3 = annoncer le poste visé + montrer que tu as fait tes recherches sur l'entreprise."
      },
      {
        "q": "During a job interview, the question 'How do you deal with pressure or stressful situations?' mainly evaluates:",
        "options": [
          "A) Your salary expectations",
          "B) Your behavioral skills and resilience",
          "C) Your educational diplomas",
          "D) Your typing speed"
        ],
        "reponse": "B",
        "explication": "Question comportementale typique : on teste la gestion du stress, la résilience, la méthode (technique STAR conseillée)."
      },
      {
        "q": "If you took a gap year, the BEST interview strategy is to:",
        "options": [
          "A) Deny it and lie",
          "B) Refuse to answer",
          "C) Explain honestly what you did and what you learned during that period",
          "D) Blame your previous employer"
        ],
        "reponse": "C",
        "explication": "Question piège du cours : assume avec honnêteté, transforme le trou en apprentissage (voyage, formation, projet perso, santé)."
      }
    ],
    "questionsOuvertes": [
      {
        "q": "Define communication and name two elements of the communication process.",
        "reponseAttendue": "Communication is the process of exchanging information, ideas or feelings between a sender and a receiver through a chosen channel. Two key elements: (1) SENDER — encodes and transmits the message ; (2) RECEIVER — decodes and interprets it. Other elements: Message, Channel, Feedback, Context."
      },
      {
        "q": "Explain the difference between verbal and non-verbal communication, with examples.",
        "reponseAttendue": "Verbal = using WORDS (spoken or written). Example: a developer explaining a bug at the daily standup. Non-verbal = WITHOUT words: facial expressions, gestures, eye contact, body language, tone. Example: a project manager nodding to show agreement. Both work together: words give content, non-verbal gives emotion and context."
      },
      {
        "q": "Mention 3 key features of business communication.",
        "reponseAttendue": "(1) CLARITY: precise, easy to understand, no ambiguity. (2) CONCISENESS: short, to the point, no unnecessary words. (3) FORMALITY/PROFESSIONALISM: polite tone, formal vocabulary, no slang. Other features: accuracy, purpose-driven, well-structured."
      },
      {
        "q": "Write a short formal email (6-8 sentences) about an urgent meeting (Subject, Greeting, Purpose, Time/Date, Closing).",
        "reponseAttendue": "Subject: URGENT — Sprint Emergency Meeting on Thursday 28 May 2026\n\nDear Team,\n\nI hope this email finds you well. I am writing to inform you about an urgent meeting scheduled to discuss the production incident on our auth service. The meeting will be held on Thursday, 28 May 2026, from 2:00 PM to 3:30 PM in Meeting Room B (or via Google Meet). Please come prepared with your latest sprint updates and any blockers. Your attendance is mandatory; if you cannot attend, kindly notify me before EOD today.\n\nKind regards,\n[Your Name]\nTeam Leader — Backend Squad"
      },
      {
        "q": "Define and use in a sentence: deploy, repository, deprecated, scalability, endpoint.",
        "reponseAttendue": "(1) DEPLOY = release to production. 'We will deploy the new API to production on Friday.' (2) REPOSITORY = storage of source code (Git). 'Please clone the repository and create a feature branch.' (3) DEPRECATED = obsolete. 'The old endpoint is deprecated; migrate to /api/v2.' (4) SCALABILITY = ability to handle growing load. 'Our microservices architecture provides excellent scalability.' (5) ENDPOINT = specific API URL. 'The GET /patients endpoint returns a JSON list.'"
      }
    ],
    "ue": "langues"
  },
  {
    "id": "secubd",
    "titre": "Sécurité des BD",
    "sousTitre": "Sécurité des bases de données",
    "couleur": "#f59e0b",
    "icone": "🔒",
    "resume": [
      {
        "titre": "Définition et périmètre de la sécurité des BD",
        "contenu": "La sécurité des bases de données est un ensemble de moyens, de contrôles et de mesures conçus pour protéger les BD contre les menaces accidentelles et intentionnelles afin de préserver la confidentialité, l'intégrité et la disponibilité (triade CIA) des données. Elle couvre quatre éléments : les données de la BD, le SGBD, toutes les applications associées et le serveur (physique ou virtuel). Sa portée s'étend de la sécurité physique du matériel à la sécurité logicielle des applications, en passant par les contrôles d'accès et d'administration. Les conséquences d'une violation incluent la compromission de la propriété intellectuelle, l'interruption des opérations, des coûts de remédiation (enquête, forensique, juridique), et l'atteinte à la réputation."
      },
      {
        "titre": "Les trois piliers CIA (Confidentialité, Intégrité, Disponibilité)",
        "contenu": "L'intégrité garantit que les données ne sont ni modifiées ni falsifiées par des parties non autorisées, à travers les contraintes d'intégrité (menaces : données valides mais inexactes, données invalides, abus de privilèges légitimes). La disponibilité assure l'accessibilité des données 24h/24 - 7j/7 (menaces : crash de disque, panne matérielle/logicielle, attaques DoS). La confidentialité garantit que seules les personnes ou programmes autorisés accèdent aux données (menaces : accès non autorisé, copies illicites de données sensibles, vente illégale)."
      },
      {
        "titre": "Processeur de sécurité et politique d'accès",
        "contenu": "Le processeur de sécurité (contrôleur d'accès) intercepte chaque requête, la confronte aux règles d'accès dérivées de la politique de sécurité, et l'autorise, la refuse ou la modifie. Il s'agit du cœur de l'application des autorisations dans un SGBD. Les règles d'accès traduisent en langage technique la politique de sécurité formalisée par l'organisation."
      },
      {
        "titre": "Typologie des attaques sur une BD",
        "contenu": "On distingue les attaques non frauduleuses (catastrophes naturelles, pannes matérielles/logicielles, erreurs humaines, coupures de courant, mots de passe faibles) et les attaques frauduleuses (internes ou externes) : abus de privilège excessif, abus de privilège légitime, élévation de privilèges (horizontale ou verticale), injection SQL, déni de service (DoS/DDoS). Les pirates sont classés en pirates externes, pirates utilisateurs (reconnus du SGBD) et pirates administrateurs."
      },
      {
        "titre": "Injection SQL : principe et contournement d'authentification",
        "contenu": "L'injection SQL consiste à contrefaire une instruction SQL en injectant du code hors des limites de l'entrée utilisateur attendue, pour altérer, voler ou détruire des données. Exemple de contournement d'authentification avec l'opérateur OR : SELECT * FROM users WHERE username='admin' OR '1'='1' AND password='demo'. Les payloads classiques sont ', --, #, ;, ). En MySQL, AND est évalué avant OR. Les injections sur BD relationnelles (MySQL, Oracle, MS SQL) s'opposent aux injections NoSQL sur MongoDB/CouchDB. Prévention : requêtes paramétrées (prepared statements), validation/échappement des entrées, ORM, principe du moindre privilège pour le compte applicatif."
      },
      {
        "titre": "Vues sécurisées et masquage de données",
        "contenu": "Une vue est une table virtuelle qui contient le résultat d'une requête (sans stocker les données) et permet de masquer certains champs aux utilisateurs et de personnaliser l'affichage selon le profil. Exemple : CREATE VIEW v_secdaac AS SELECT etudiant.sexe, note.code, note.note FROM etudiant INNER JOIN note ON etudiant.matricule = note.matricule ; puis GRANT SELECT ON v_secdaac TO 'secdaac'@'localhost'. La vue est un outil de masquage et de filtrage horizontal/vertical des données."
      },
      {
        "titre": "Authentification et mots de passe robustes",
        "contenu": "L'authentification confirme l'identité d'un utilisateur tentant de se connecter à la BD. Bonnes pratiques : mots de passe forts (longueur, complexité, expiration), hashage par bcrypt ou Argon2 (avec sel et facteur de coût), MFA, suppression des comptes par défaut, rotation régulière des secrets, coffre-fort numérique pour les comptes à privilèges, supervision des activités d'admin pour détecter Pass-the-Hash, brute force et password spraying."
      },
      {
        "titre": "Contrôle d'accès : sujets, objets, opérations, règles",
        "contenu": "Un système de contrôle d'accès comprend : les sujets (entités actives : utilisateurs, processus), les objets (entités passives : tables, fichiers, vues), les opérations (lecture, écriture, ajout, suppression, exécution) et un ensemble de règles d'accès reflétant la politique de sécurité. Le SGBD autorise, modifie ou interdit les requêtes selon ces règles."
      },
      {
        "titre": "Modèle DAC (Discretionary Access Control)",
        "contenu": "Le DAC repose sur 4 principes : (1) le créateur d'un objet en est le propriétaire, (2) le propriétaire peut transmettre/retirer des autorisations à sa discrétion, (3) il peut déléguer le droit de transmission, (4) tout ce qui n'est pas autorisé est interdit. Implémenté via les matrices de contrôle d'accès de Lampson (1971) – triplet (S, O, M) – et HRU (Harrison, Ruzzo, Ullman 1976) – quadruplet (S, O, R, M) avec 6 opérations primitives (enter a, delete a, create/delete subject, create/delete object). Avantages : simple, flexible, intégré aux SGBD. Inconvénients : risque d'explosion des ACL, ne reflète pas les flux réels, vulnérable aux chevaux de Troie."
      },
      {
        "titre": "Modèle MAC (Mandatory Access Control)",
        "contenu": "Le MAC est destiné aux SI où la préservation du secret est critique (défense, gouvernement). Les objets reçoivent une classification (Top Secret >= Secret >= Confidentiel >= Non Classifié) et les sujets une habilitation. Modèle Bell-LaPadula (BLP, 1973, confidentialité) : SS-propriété 'no read up' (un sujet ne lit un objet que si son habilitation est >= classification de l'objet) et propriété étoile 'no write down' (écriture seulement si habilitation <= classification de l'objet). Modèle Biba (1977, intégrité) : 'no read down' et 'no write up' – le miroir inverse pour empêcher la corruption de données de haute intégrité par du contenu de plus bas niveau. Avantages : cohérence, conformité, faible risque. Inconvénients : rigidité, complexité, coût, flexibilité limitée."
      },
      {
        "titre": "Modèle RBAC (Role Based Access Control)",
        "contenu": "Les permissions sont affectées à des rôles reflétant la structure organisationnelle, puis les utilisateurs sont rattachés aux rôles. Un sujet a une permission P ssi il est attribué à un rôle détenant P. Commandes SQL : CREATE ROLE nom_role ; GRANT privileges TO role ; GRANT role TO user ; SET ROLE nom_role ; (activation) ; GRANT role1 TO role2 (hiérarchie). RBAC est idéal pour les entreprises à forte rotation de personnel : on modifie l'affectation user-role sans toucher aux permissions des rôles."
      },
      {
        "titre": "GRANT / REVOKE, privilèges objets vs systèmes",
        "contenu": "Un privilège est un droit accordé à un utilisateur ou processus. Les privilèges objets concernent des opérations précises sur des tables/vues (SELECT, INSERT, UPDATE, DELETE, REFERENCES). Les privilèges systèmes concernent la structure (CREATE ANY TABLE, ALTER USER, GRANT OPTION). Syntaxe : GRANT SELECT, INSERT ON schema.table TO user ; REVOKE INSERT ON schema.table FROM user ; L'option WITH GRANT OPTION permet la délégation."
      },
      {
        "titre": "Principe du moindre privilège et politique de gestion",
        "contenu": "Le moindre privilège accorde à un utilisateur uniquement l'accès minimum requis pour sa fonction. Mise en œuvre : (1) auditer tous les comptes à privilèges, (2) éliminer les privilèges admin local inutiles, (3) provisionner les identifiants dans un coffre-fort, (4) renouveler les mots de passe admin après chaque usage, (5) superviser en continu les activités à privilèges. 6 règles de politique : moindre privilège, contrôle de la population, supervision de la délégation, contrôle physique des connexions (restriction aux hôtes connus), limitation des ressources, journalisation des comportements suspects."
      },
      {
        "titre": "Chiffrement (TDE, AES, RSA) et hashage",
        "contenu": "Le chiffrement transparent des données (TDE – Transparent Data Encryption) chiffre les fichiers de données et les journaux au repos sans modifier l'application. Chiffrement symétrique AES (clé partagée, rapide, AES-128/256) pour les volumes. Chiffrement asymétrique RSA (paire clé publique/privée) pour l'échange de clés et la signature. TLS pour le transport client-serveur. Le hashage (SHA-256, bcrypt, Argon2, scrypt) est une fonction à sens unique utilisée pour stocker les mots de passe avec un sel cryptographique pour bloquer les rainbow tables."
      },
      {
        "titre": "Audit, journaux et traçabilité (audit trail)",
        "contenu": "L'audit analyse l'existant pour diagnostiquer et améliorer la BD. On distingue : audit de structure (formes normales, contraintes), audit de qualité (contraintes, doublons), audit de configuration/performances (RAM, CPU, SGA), audit des requêtes (procédures, transactions, tracing), audit d'infrastructure réseau. L'admin doit auditer notamment l'utilisation hors heures ouvrables, la manipulation du schéma, les erreurs, les modifications de procédures stockées. Les audit logs constituent une preuve forensique en cas d'incident."
      },
      {
        "titre": "Sauvegarde, restauration, réplication",
        "contenu": "Sauvegarde complète (full) : copie totale, longue mais simple à restaurer. Sauvegarde incrémentielle : seules les modifications depuis la dernière sauvegarde (rapide, restauration en chaîne). Sauvegarde différentielle : modifications depuis la dernière full (compromis). Stratégie 3-2-1 : 3 copies, 2 supports, 1 hors site. Réplication master-slave/master-master assure haute disponibilité et reprise après incident. Tester régulièrement la restauration. La destruction de données sans sauvegarde est synonyme de dépôt de bilan."
      },
      {
        "titre": "Les 8 étapes de la sécurité des BD (méthodologie)",
        "contenu": "1) Découverte (inventaire des BD et données sensibles), 2) Évaluation des vulnérabilités et de la configuration (CIS Benchmarks), 3) Renforcement (hardening : désactivation des comptes par défaut, patching), 4) Audit des modifications de schéma et de configuration, 5) Surveillance de l'activité (DAM – Database Activity Monitoring), 6) Audit applicatif et conformité, 7) Authentification, contrôle d'accès et gestion des droits (RBAC, MFA), 8) Chiffrement (au repos via TDE, en transit via TLS)."
      },
      {
        "titre": "Conformité, RGPD et protection des données personnelles",
        "contenu": "Le RGPD (Règlement Général sur la Protection des Données) impose le principe de privacy by design and by default, le consentement explicite, le droit à l'effacement, la notification de violation sous 72h, l'analyse d'impact (PIA/DPIA) pour les traitements à risque. Mesures techniques associées : minimisation des données, pseudonymisation, anonymisation, masquage dynamique (dynamic data masking), chiffrement, journalisation des accès aux données personnelles, suppression contrôlée."
      }
    ],
    "qcm": [
      {
        "q": "Que signifie la triade CIA en sécurité des bases de données ?",
        "options": [
          "A) Contrôle, Identification, Authentification",
          "B) Confidentialité, Intégrité, Disponibilité",
          "C) Cryptage, Intrusion, Audit",
          "D) Confidentialité, Intrusion, Accès"
        ],
        "reponse": "B",
        "explication": "La triade CIA (Confidentiality, Integrity, Availability) regroupe les trois piliers fondamentaux de la sécurité : confidentialité des données, intégrité (non-altération) et disponibilité (accès 24/7)."
      },
      {
        "q": "Quelle propriété est violée lorsqu'un utilisateur lit des données qui ne lui sont pas autorisées ?",
        "options": [
          "A) Intégrité",
          "B) Disponibilité",
          "C) Confidentialité",
          "D) Non-répudiation"
        ],
        "reponse": "C",
        "explication": "La confidentialité garantit que seules les personnes ou programmes autorisés accèdent aux données. Une lecture non autorisée viole directement ce pilier."
      },
      {
        "q": "Dans le modèle Bell-LaPadula, quelle est la règle 'no read up' (SS-propriété) ?",
        "options": [
          "A) Un sujet ne peut écrire à un niveau inférieur à son habilitation",
          "B) Un sujet ne peut lire un objet dont la classification est supérieure à son habilitation",
          "C) Un sujet ne peut lire un objet de niveau inférieur",
          "D) Un sujet ne peut écrire au même niveau"
        ],
        "reponse": "B",
        "explication": "Bell-LaPadula privilégie la confidentialité : un sujet de niveau confidentiel ne peut pas lire un objet top secret. Il ne lit pas vers le haut (no read up)."
      },
      {
        "q": "Dans le modèle Biba, la propriété étoile s'appelle :",
        "options": [
          "A) No read up",
          "B) No write down",
          "C) No read down",
          "D) No write up"
        ],
        "reponse": "D",
        "explication": "Biba protège l'intégrité : un sujet de bas niveau ne peut pas écrire dans un objet de haut niveau (no write up), pour empêcher qu'une donnée intègre soit polluée par une source moins fiable."
      },
      {
        "q": "Quelle injection SQL permet de contourner une authentification username/password ?",
        "options": [
          "A) ' AND 1=1 --",
          "B) ' OR '1'='1' --",
          "C) ' ORDER BY 1 --",
          "D) ' UNION SELECT NULL --"
        ],
        "reponse": "B",
        "explication": "Le payload ' OR '1'='1' -- rend la condition WHERE toujours vraie et le -- commente le reste (notamment le contrôle du mot de passe), permettant ainsi l'authentification sans credentials valides."
      },
      {
        "q": "Quelle est la principale contre-mesure contre l'injection SQL ?",
        "options": [
          "A) Le chiffrement TDE",
          "B) Les requêtes paramétrées (prepared statements)",
          "C) La sauvegarde différentielle",
          "D) L'audit des connexions"
        ],
        "reponse": "B",
        "explication": "Les requêtes paramétrées séparent strictement le code SQL des données utilisateur, empêchant l'interpréteur SQL de considérer une entrée comme du code exécutable."
      },
      {
        "q": "Quelle commande SQL retire un privilège à un utilisateur ?",
        "options": [
          "A) DROP",
          "B) DENY",
          "C) REVOKE",
          "D) DELETE"
        ],
        "reponse": "C",
        "explication": "REVOKE est la commande standard du DCL (Data Control Language) pour retirer des privilèges précédemment accordés via GRANT."
      },
      {
        "q": "Qu'est-ce que le RBAC ?",
        "options": [
          "A) Un modèle de contrôle d'accès basé sur les rôles",
          "B) Un protocole de chiffrement",
          "C) Une méthode de sauvegarde",
          "D) Un type de SGBD"
        ],
        "reponse": "A",
        "explication": "RBAC (Role-Based Access Control) attribue les permissions à des rôles reflétant la structure organisationnelle, et les utilisateurs sont ensuite affectés aux rôles."
      },
      {
        "q": "Quel algorithme est recommandé pour hasher les mots de passe ?",
        "options": [
          "A) MD5",
          "B) SHA-1",
          "C) bcrypt ou Argon2",
          "D) Base64"
        ],
        "reponse": "C",
        "explication": "MD5 et SHA-1 sont obsolètes (collisions). Base64 est un encodage. bcrypt et Argon2 sont des fonctions de hashage adaptatives avec sel et facteur de coût configurable, résistantes au brute force."
      },
      {
        "q": "Qu'est-ce que le TDE (Transparent Data Encryption) ?",
        "options": [
          "A) Le chiffrement réseau TLS",
          "B) Le chiffrement transparent des fichiers de données au repos",
          "C) Une technique d'audit",
          "D) Un type de RBAC"
        ],
        "reponse": "B",
        "explication": "Le TDE chiffre automatiquement les fichiers de données et les journaux au repos. L'application n'a pas à être modifiée : le déchiffrement se fait à la volée pour les utilisateurs autorisés."
      },
      {
        "q": "Quelle différence entre DAC et MAC ?",
        "options": [
          "A) DAC est plus sécurisé que MAC",
          "B) MAC est centralisé/imposé, DAC est laissé à la discrétion du propriétaire",
          "C) DAC est utilisé en militaire, MAC dans les entreprises",
          "D) Aucune différence"
        ],
        "reponse": "B",
        "explication": "En DAC, le propriétaire de l'objet décide qui peut y accéder. En MAC, c'est l'administrateur via une politique imposée (habilitations/classifications) qui décide, indépendamment du propriétaire."
      },
      {
        "q": "Qu'est-ce qu'une attaque par déni de service (DoS) sur une BD ?",
        "options": [
          "A) Voler les mots de passe",
          "B) Inonder le serveur de requêtes pour qu'il ne réponde plus aux utilisateurs légitimes",
          "C) Chiffrer la BD",
          "D) Modifier le schéma"
        ],
        "reponse": "B",
        "explication": "Un DoS/DDoS sature le serveur de requêtes ou ouvre des connexions massives pour épuiser les ressources, rendant la BD indisponible. Cela viole le pilier disponibilité."
      },
      {
        "q": "Une vue sécurisée sert à :",
        "options": [
          "A) Stocker physiquement des données chiffrées",
          "B) Masquer certains champs et lignes aux utilisateurs",
          "C) Sauvegarder la BD",
          "D) Authentifier l'utilisateur"
        ],
        "reponse": "B",
        "explication": "Une vue est une table virtuelle (résultat d'une requête) qui filtre les colonnes/lignes visibles selon le profil utilisateur, fournissant un masquage logique des données sensibles."
      },
      {
        "q": "Le principe du moindre privilège stipule que :",
        "options": [
          "A) Chaque user reçoit tous les privilèges par sécurité",
          "B) On accorde uniquement les permissions strictement nécessaires à la tâche",
          "C) Les admins n'ont aucun privilège",
          "D) On retire tous les privilèges puis on les redonne mensuellement"
        ],
        "reponse": "B",
        "explication": "Le moindre privilège limite la surface d'attaque : si un compte est compromis, l'attaquant n'hérite que des droits minimaux, réduisant l'impact."
      },
      {
        "q": "Qu'est-ce qu'une élévation de privilèges verticale ?",
        "options": [
          "A) Obtenir l'accès à un autre compte de même niveau",
          "B) Obtenir l'accès à un compte de niveau supérieur (admin)",
          "C) Changer de mot de passe",
          "D) Se déconnecter"
        ],
        "reponse": "B",
        "explication": "L'élévation verticale vise un compte de privilèges supérieurs (typiquement admin/root), alors que l'élévation horizontale cible un compte de même niveau pour étendre l'accès latéralement."
      },
      {
        "q": "Une sauvegarde incrémentielle contient :",
        "options": [
          "A) Toutes les données de la BD",
          "B) Les modifications depuis la dernière sauvegarde (full ou incrémentielle)",
          "C) Les modifications depuis la dernière full uniquement",
          "D) Uniquement les schémas"
        ],
        "reponse": "B",
        "explication": "L'incrémentielle ne contient que les changements depuis la dernière sauvegarde quelle qu'elle soit. La différentielle contient les changements depuis la dernière full. La full contient tout."
      },
      {
        "q": "Quel élément réglementaire européen impose la protection des données personnelles ?",
        "options": [
          "A) HIPAA",
          "B) PCI-DSS",
          "C) RGPD",
          "D) SOX"
        ],
        "reponse": "C",
        "explication": "Le RGPD (Règlement Général sur la Protection des Données) est le texte européen de référence. HIPAA concerne la santé US, PCI-DSS le paiement, SOX la finance US."
      },
      {
        "q": "Dans le modèle de Lampson, la matrice de contrôle d'accès est un triplet :",
        "options": [
          "A) (Sujets, Objets, Règles)",
          "B) (Sujets, Objets, Matrice)",
          "C) (Sujets, Rôles, Matrice)",
          "D) (Objets, Permissions, Matrice)"
        ],
        "reponse": "B",
        "explication": "Le modèle de Lampson (1971) définit le triplet (S, O, M) où S est l'ensemble des sujets, O l'ensemble des objets, et M la matrice contenant les droits M(s,o)."
      },
      {
        "q": "Quel attribut différencie HRU de Lampson ?",
        "options": [
          "A) HRU ajoute la matrice M",
          "B) HRU ajoute l'ensemble R des modes d'accès et des commandes pour modifier la matrice",
          "C) HRU supprime les sujets",
          "D) HRU ne gère pas les objets"
        ],
        "reponse": "B",
        "explication": "HRU (Harrison-Ruzzo-Ullman, 1976) est un quadruplet (S, O, R, M) avec R = {read, write, append, execute, own} et 6 opérations primitives pour créer/supprimer sujets, objets et droits."
      },
      {
        "q": "L'attaque Pass-the-Hash exploite :",
        "options": [
          "A) Un buffer overflow",
          "B) Un hash de mot de passe volé utilisé directement sans le craquer",
          "C) Un certificat expiré",
          "D) Une faille DNS"
        ],
        "reponse": "B",
        "explication": "Pass-the-Hash réutilise le hash NTLM/Kerberos volé en mémoire pour s'authentifier sans connaître le mot de passe en clair. La rotation rapide des mots de passe admin atténue ce risque."
      },
      {
        "q": "Quelle fonction sert à journaliser les actions des utilisateurs sur la BD ?",
        "options": [
          "A) Audit trail / audit log",
          "B) GRANT",
          "C) VIEW",
          "D) JOIN"
        ],
        "reponse": "A",
        "explication": "L'audit trail (journal d'audit) enregistre les actions SELECT/INSERT/UPDATE/DELETE/DDL pour traçabilité, conformité et investigation forensique."
      },
      {
        "q": "Le chiffrement asymétrique repose sur :",
        "options": [
          "A) Une seule clé partagée",
          "B) Une paire clé publique / clé privée",
          "C) Aucun chiffrement",
          "D) Le hashage SHA-256"
        ],
        "reponse": "B",
        "explication": "L'asymétrique (RSA, ECC) utilise une clé publique pour chiffrer et une clé privée pour déchiffrer. Il sert souvent à échanger la clé symétrique utilisée pour le chiffrement de masse (hybride)."
      },
      {
        "q": "Quel SGBD est concerné par l'injection SQL ?",
        "options": [
          "A) MongoDB",
          "B) CouchDB",
          "C) MySQL, Oracle, MS SQL Server",
          "D) Redis"
        ],
        "reponse": "C",
        "explication": "L'injection SQL au sens strict cible les SGBD relationnels. Les bases NoSQL (MongoDB, CouchDB) souffrent d'injections NoSQL avec une syntaxe différente (opérateurs $ne, $gt, JavaScript)."
      },
      {
        "q": "Que fait la commande GRANT ALL PRIVILEGES ON db.* TO 'user'@'localhost' ?",
        "options": [
          "A) Crée l'utilisateur",
          "B) Accorde tous les privilèges sur toutes les tables de db à l'utilisateur depuis localhost",
          "C) Supprime tous les privilèges",
          "D) Active SSL"
        ],
        "reponse": "B",
        "explication": "Cette instruction DCL accorde tous les privilèges objets sur toutes les tables de la base 'db' à l'utilisateur 'user' connecté depuis l'hôte localhost. À éviter en production (viole le moindre privilège)."
      },
      {
        "q": "Le masquage de données (data masking) consiste à :",
        "options": [
          "A) Chiffrer toute la BD",
          "B) Remplacer ou cacher dynamiquement des valeurs sensibles à l'affichage selon le profil",
          "C) Supprimer la BD",
          "D) Sauvegarder les logs"
        ],
        "reponse": "B",
        "explication": "Le data masking (statique ou dynamique) substitue les valeurs sensibles par des valeurs factices ou les obfusque (XXXX-XXXX-1234) pour les utilisateurs n'ayant pas besoin de voir la donnée originale."
      },
      {
        "q": "Le password spraying est :",
        "options": [
          "A) Tester de nombreux mots de passe sur un seul compte",
          "B) Tester un mot de passe courant sur de nombreux comptes",
          "C) Voler un hash",
          "D) Désactiver MFA"
        ],
        "reponse": "B",
        "explication": "Le password spraying inverse le brute force : il essaie un mot de passe répandu (ex : Password123) sur des milliers de comptes pour échapper aux verrouillages de compte qui détectent les répétitions sur un seul compte."
      },
      {
        "q": "Quelle attaque s'appuie sur la copie illégitime de données par un employé légitime ?",
        "options": [
          "A) DoS",
          "B) Abus de privilège légitime",
          "C) Injection SQL",
          "D) Force brute"
        ],
        "reponse": "B",
        "explication": "L'abus de privilège légitime se produit quand un utilisateur dûment autorisé détourne ses droits valides pour des finalités non autorisées (copie de fichiers clients pour les revendre, etc.)."
      },
      {
        "q": "Quelle est la première étape d'une démarche de sécurité de BD selon le cours ?",
        "options": [
          "A) Chiffrement",
          "B) Audit",
          "C) Découverte (inventaire)",
          "D) Sauvegarde"
        ],
        "reponse": "C",
        "explication": "Les 8 étapes débutent par la découverte : on ne peut sécuriser que ce que l'on connaît. Il faut d'abord inventorier les BD, leurs versions, les données sensibles, les flux."
      },
      {
        "q": "Dans MySQL, comment activer un rôle pour la session courante ?",
        "options": [
          "A) USE role",
          "B) SET ROLE nom_role",
          "C) GRANT role",
          "D) ENABLE role"
        ],
        "reponse": "B",
        "explication": "SET ROLE nom_role active le rôle pour la session, donnant accès aux privilèges associés. Sans activation, le rôle existe mais ses privilèges ne s'appliquent pas."
      },
      {
        "q": "Pour empêcher l'injection SQL, on doit privilégier :",
        "options": [
          "A) La concaténation de chaînes",
          "B) Les requêtes paramétrées et la validation des entrées",
          "C) Le chiffrement TDE",
          "D) Le hashage MD5"
        ],
        "reponse": "B",
        "explication": "Les prepared statements (avec PDO en PHP, PreparedStatement en Java, paramètres @ en .NET) sont la défense principale. Compléter avec validation des types, ORM, principe du moindre privilège et WAF."
      }
    ],
    "questionsOuvertes": [
      {
        "q": "Présentez les trois piliers de la sécurité des bases de données (CIA) en détaillant pour chacun une menace concrète et au moins une contre-mesure technique applicable dans un SGBD relationnel.",
        "reponseAttendue": "La triade CIA : (1) Confidentialité – garantir l'accès aux seules personnes autorisées ; menace : vol de données via injection SQL ou accès non autorisé d'un employé ; contre-mesures : chiffrement TDE au repos, TLS en transit, RBAC, vues sécurisées, masquage dynamique. (2) Intégrité – empêcher modifications/falsifications non autorisées ; menace : utilisateur insérant une note négative ou abus de privilège légitime ; contre-mesures : contraintes d'intégrité (CHECK, FK, UNIQUE, NOT NULL), triggers de validation, audit trail, contrôle des transactions ACID, hash de contrôle. (3) Disponibilité – accès 24/7 ; menace : attaque DoS, crash disque, ransomware ; contre-mesures : sauvegardes 3-2-1 (full/incrémentielles), réplication maître-esclave, clusters haute disponibilité, plan de reprise (DRP), limitation de débit côté SGBD, pare-feu applicatif."
      },
      {
        "q": "Expliquez en détail l'injection SQL : principe, exemple de contournement d'authentification, et trois techniques de prévention robustes.",
        "reponseAttendue": "Principe : l'attaquant injecte du code SQL via un champ utilisateur non filtré, modifiant la requête envoyée au SGBD pour la détourner. Exemple : sur SELECT * FROM users WHERE username='X' AND password='Y' ; l'attaquant saisit username = admin' OR '1'='1' -- et un mot de passe quelconque. La requête devient SELECT * FROM users WHERE username='admin' OR '1'='1' -- ' AND password='X'. La condition '1'='1' est vraie et le -- commente le reste, donnant l'accès admin. Prévention : (1) Requêtes paramétrées / prepared statements (PDO, PreparedStatement) qui séparent strictement code et données ; (2) ORM (Hibernate, Doctrine, Sequelize) qui paramètrent automatiquement ; (3) Validation stricte des entrées (whitelist, type, longueur, expressions régulières) + échappement contextuel ; (4) Principe du moindre privilège : le compte applicatif n'a que SELECT/INSERT sur les tables nécessaires, pas DROP ou GRANT ; (5) WAF pour détecter les patterns d'injection ; (6) Logs et alertes sur erreurs SQL."
      },
      {
        "q": "Comparez les modèles DAC, MAC et RBAC : principe, exemple d'usage, avantages, inconvénients.",
        "reponseAttendue": "DAC (Discretionary Access Control) : le propriétaire d'un objet décide qui y accède. Modèle de Lampson/HRU avec matrice de droits. Usage : systèmes Unix, SGBD classiques (GRANT/REVOKE). Avantages : simple, flexible, intégré. Inconvénients : explosion des ACL, vulnérable aux chevaux de Troie, le propriétaire peut violer la politique d'entreprise. MAC (Mandatory Access Control) : l'admin impose des classifications (Top Secret > Secret > Confidentiel > NC) aux objets et habilitations aux sujets ; règles strictes (Bell-LaPadula no-read-up/no-write-down pour la confidentialité, Biba no-read-down/no-write-up pour l'intégrité). Usage : défense, gouvernement. Avantages : sécurité forte, conformité, cohérence. Inconvénients : rigide, complexe, coûteux. RBAC (Role-Based Access Control) : permissions liées à des rôles reflétant la structure organisationnelle, utilisateurs affectés aux rôles. Usage : entreprises classiques avec forte rotation. Avantages : scalable, facile à administrer, séparation des tâches. Inconvénients : explosion des rôles dans grandes organisations, moins fin que ABAC pour les règles contextuelles."
      },
      {
        "q": "Décrivez une politique d'authentification et de gestion des comptes robuste pour une BD critique : mots de passe, MFA, comptes par défaut, comptes à privilèges, audit.",
        "reponseAttendue": "Une politique robuste comprend : (1) Mots de passe forts : minimum 12-14 caractères, complexité (majuscules, minuscules, chiffres, symboles), pas de mots du dictionnaire, expiration tous les 90 jours, interdiction de réutilisation des 10 derniers. (2) Stockage par hashage bcrypt ou Argon2 avec sel cryptographique aléatoire et facteur de coût élevé (cost >= 12 pour bcrypt). (3) MFA (Multi-Factor Authentication) obligatoire pour les comptes admin et tous les accès distants : TOTP, FIDO2, certificats. (4) Suppression de tous les comptes par défaut (sa, system, root) ou changement immédiat de leur mot de passe et désactivation si non utilisés. (5) Comptes à privilèges (DBA) dans un coffre-fort numérique (CyberArk, HashiCorp Vault) avec rotation automatique après chaque usage ; renouvellement après chaque session admin pour bloquer Pass-the-Hash. (6) Principe du moindre privilège : chaque compte applicatif a uniquement les privilèges objets nécessaires. (7) Comptes de service nominatifs (un par application), pas de comptes partagés. (8) Audit logs centralisés (SIEM) avec alertes sur tentatives de connexion échouées, password spraying, connexions hors heures ouvrables, élévations de privilèges, modifications DDL. (9) Verrouillage temporaire après 5 tentatives échouées pour bloquer le brute force. (10) Restrictions IP pour le compte applicatif (uniquement depuis le serveur applicatif)."
      },
      {
        "q": "Conception d'un système RBAC pour la direction des affaires académiques de l'IAI Cameroun : identifiez les rôles, leurs permissions, et écrivez les commandes SQL correspondantes pour la création des utilisateurs, des rôles et l'attribution des privilèges sur les tables etudiants, notes, matieres.",
        "reponseAttendue": "Rôles identifiés : (1) DAAC – Directrice des Affaires Académiques : tous droits sur etudiants, notes, matieres. (2) DAACAdj – Directeur Adjoint : tous droits sur etudiants, SELECT sur notes et matieres. (3) RF – Responsable de filière : SELECT, INSERT, UPDATE sur notes, SELECT sur etudiants et matieres. (4) SEC – Secrétaire : SELECT, INSERT, UPDATE sur etudiants uniquement. Commandes SQL :\n-- Création utilisateurs\nCREATE USER 'anga'@'localhost' IDENTIFIED BY 'MotDePasseFort!2026' ;\nCREATE USER 'salabessies'@'localhost' IDENTIFIED BY 'MotDePasseFort!2026' ;\nCREATE USER 'agbor'@'localhost' IDENTIFIED BY 'MotDePasseFort!2026' ;\nCREATE USER 'belinga'@'localhost' IDENTIFIED BY 'MotDePasseFort!2026' ;\nCREATE USER 'angouda'@'localhost' IDENTIFIED BY 'MotDePasseFort!2026' ;\nCREATE USER 'tsama'@'localhost' IDENTIFIED BY 'MotDePasseFort!2026' ;\n-- Création des rôles\nCREATE ROLE 'role_daac', 'role_daac_adj', 'role_rf', 'role_sec' ;\n-- Attribution privilèges aux rôles\nGRANT ALL PRIVILEGES ON gestetudiant.* TO 'role_daac' ;\nGRANT ALL PRIVILEGES ON gestetudiant.etudiants TO 'role_daac_adj' ;\nGRANT SELECT ON gestetudiant.notes TO 'role_daac_adj' ;\nGRANT SELECT ON gestetudiant.matieres TO 'role_daac_adj' ;\nGRANT SELECT, INSERT, UPDATE ON gestetudiant.notes TO 'role_rf' ;\nGRANT SELECT ON gestetudiant.etudiants TO 'role_rf' ;\nGRANT SELECT ON gestetudiant.matieres TO 'role_rf' ;\nGRANT SELECT, INSERT, UPDATE ON gestetudiant.etudiants TO 'role_sec' ;\n-- Affectation des rôles aux utilisateurs\nGRANT 'role_daac' TO 'anga'@'localhost' ;\nGRANT 'role_daac_adj' TO 'salabessies'@'localhost' ;\nGRANT 'role_rf' TO 'agbor'@'localhost', 'belinga'@'localhost' ;\nGRANT 'role_sec' TO 'angouda'@'localhost', 'tsama'@'localhost' ;\n-- Activation par défaut\nSET DEFAULT ROLE ALL TO 'anga'@'localhost', 'salabessies'@'localhost', 'agbor'@'localhost', 'belinga'@'localhost', 'angouda'@'localhost', 'tsama'@'localhost' ;\nFLUSH PRIVILEGES ;\nAvantages de cette modélisation RBAC : maintenance simplifiée (changement de personnel = affectation/désaffectation de rôle), respect du moindre privilège, audit facilité, séparation des tâches."
      }
    ],
    "ue": "admin_bd"
  },
  {
    "id": "bigdata",
    "titre": "Big Data NoSQL",
    "sousTitre": "Big Data & bases NoSQL",
    "couleur": "#84cc16",
    "icone": "🗃️",
    "resume": [
      {
        "titre": "Définition du Big Data et les 5V",
        "contenu": "Le Big Data (mégadonnées) désigne des ensembles de données dont le volume, la vitesse de génération et la diversité dépassent les capacités des SGBDR traditionnels. Il se caractérise par les 5V : Volume (quantités massives, To-Po), Variété (structurées, semi-structurées JSON/XML, non structurées texte/image/vidéo), Vélocité (vitesse de production et de traitement, souvent en temps réel), Véracité (qualité, fiabilité et cohérence des données) et Valeur (capacité à extraire des insights stratégiques et à transformer les données en décisions)."
      },
      {
        "titre": "Sources et types de données",
        "contenu": "Les données proviennent de sources hétérogènes : réseaux sociaux, IoT (capteurs connectés), transactions, logs applicatifs, médias, GPS. On distingue : (1) données structurées stockées en SGBDR avec schéma rigide ; (2) données semi-structurées (JSON, XML, YAML) avec schéma flexible ; (3) données non structurées (texte libre, images, vidéos, audio) stockées dans des systèmes de fichiers distribués ; (4) données en temps réel (streaming) nécessitant un traitement instantané."
      },
      {
        "titre": "Écosystème Hadoop (HDFS, MapReduce, YARN)",
        "contenu": "Hadoop est un framework open-source de stockage et de traitement distribué. HDFS (Hadoop Distributed File System) découpe les fichiers en blocs (par défaut 128 Mo) répliqués (par défaut x3) sur les DataNodes pilotés par un NameNode. MapReduce est un paradigme de calcul distribué en deux phases : Map (transformation clé-valeur en parallèle) puis Reduce (agrégation par clé). YARN (Yet Another Resource Negotiator) est le gestionnaire de ressources qui orchestre l'allocation CPU/RAM des jobs sur le cluster via le ResourceManager et les NodeManagers."
      },
      {
        "titre": "Apache Spark et ses abstractions",
        "contenu": "Spark est un moteur de traitement distribué plus rapide que MapReduce car il effectue les calculs in-memory. Abstractions clés : RDD (Resilient Distributed Dataset, collection distribuée immuable tolérante aux pannes via lineage), DataFrame (structure tabulaire avec schéma, optimisée par Catalyst), Dataset (typé). Modules : Spark SQL (requêtes), Spark Streaming/Structured Streaming (micro-batchs temps réel), MLlib (machine learning), GraphX (graphes). Modèle d'exécution lazy via transformations (map, filter, join) et actions (count, collect, save)."
      },
      {
        "titre": "Architecture Lambda (batch, speed, serving)",
        "contenu": "L'architecture Lambda combine trois couches pour gérer données massives et temps réel : (1) Batch layer : stocke le master dataset immuable (source de vérité) sur HDFS et calcule des vues agrégées via Hadoop/Spark ; (2) Speed layer : traite les données récentes en streaming (Spark Streaming, Flink, Storm) avec données dénormalisées dans une base NoSQL ; (3) Serving layer : expose les vues batch + temps réel aux clients via une base NoSQL (Cassandra, MongoDB, ElasticSearch). Les clients fusionnent les deux vues pour disposer de données fraîches et corrigées. L'architecture Kappa simplifie en n'utilisant qu'une couche streaming."
      },
      {
        "titre": "Théorème CAP et BASE vs ACID",
        "contenu": "Théorème CAP (Brewer) : un système distribué ne peut garantir simultanément que 2 des 3 propriétés : Consistency (cohérence forte, tous les nœuds voient la même donnée à un instant t), Availability (disponibilité, toute requête reçoit une réponse) et Partition tolerance (tolérance aux partitions réseau). En pratique, P est obligatoire donc on choisit entre CP (MongoDB, HBase) et AP (Cassandra, DynamoDB, CouchDB). Les SGBDR appliquent ACID (Atomicité, Cohérence, Isolation, Durabilité) ; les NoSQL appliquent BASE (Basically Available, Soft state, Eventual consistency) : disponibilité prioritaire, état mou, cohérence à terme."
      },
      {
        "titre": "Les 4 familles de bases NoSQL",
        "contenu": "(1) Clé-Valeur : paires clé→valeur, lecture O(1) par clé, idéal pour cache/session — Redis, Amazon DynamoDB, Riak. (2) Documents : documents auto-descriptifs JSON/BSON regroupés en collections, requêtes riches sur les champs — MongoDB, CouchDB, Couchbase. (3) Colonnes (wide-column) : tables à colonnes dynamiques regroupées en familles, optimisé pour analytique et écriture massive — Apache Cassandra, HBase, ScyllaDB. (4) Graphes : nœuds + relations + propriétés, idéal pour réseaux sociaux et recommandations — Neo4j, Amazon Neptune, ArangoDB."
      },
      {
        "titre": "MongoDB : collections, BSON, opérateurs",
        "contenu": "MongoDB est une base orientée documents stockés en BSON (Binary JSON) dans des collections (analogues aux tables). Chaque document a un _id unique. Opérateurs de requête : $eq (=), $ne (≠), $gt/$gte/$lt/$lte, $in/$nin (appartenance), $and/$or/$not, $exists, $regex. Opérateurs de mise à jour : $set (modifier un champ), $unset (supprimer), $inc (incrémenter), $push/$pull (manipuler tableaux), $addToSet (ajouter sans doublon). Le pipeline d'agrégation enchaîne des étapes : $match (filtrage), $group (regroupement), $project (projection), $sort, $limit, $lookup (jointure)."
      },
      {
        "titre": "MongoDB : indexation, sharding, replica sets",
        "contenu": "Indexes (B-Tree par défaut) accélèrent les requêtes : index simple, composé, multikey (tableaux), texte, géospatial, TTL. Replica Set : groupe de mongod avec 1 primaire (lectures/écritures) et N secondaires (réplication asynchrone + failover automatique via élection). Sharding : partitionnement horizontal des données entre shards selon une shard key (hashée ou rangée), orchestré par mongos et un cluster de config servers. Sharding scale les écritures, replica sets assurent haute disponibilité et tolérance aux pannes."
      },
      {
        "titre": "Redis : types de données et TTL",
        "contenu": "Redis est une base clé-valeur en mémoire (in-memory) ultra-rapide, utilisée comme cache, broker de messages ou compteurs. Types : Strings (valeur simple, max 512 Mo), Lists (listes chaînées, LPUSH/RPUSH/LRANGE), Sets (ensembles non ordonnés, SADD/SINTER), Sorted Sets / ZSets (ensembles ordonnés par score, ZADD/ZRANGE, idéal classements), Hashes (objets champ→valeur, HSET/HGET), Streams, Bitmaps, HyperLogLog. TTL (Time To Live) : EXPIRE clé secondes pour expiration automatique. Persistance via RDB (snapshots) ou AOF (append-only file)."
      },
      {
        "titre": "Cassandra : CQL et clés de partition",
        "contenu": "Apache Cassandra est une base colonnes distribuée AP, architecture peer-to-peer sans nœud maître (anneau de hachage cohérent). CQL (Cassandra Query Language) ressemble à SQL mais sans jointures. Clé primaire = partition key (détermine le nœud de stockage, distribution) + clustering key (tri à l'intérieur d'une partition). Exemple : PRIMARY KEY ((user_id), timestamp DESC). Niveaux de cohérence ajustables (ONE, QUORUM, ALL). Écritures via Memtable + Commit Log puis flush en SSTables. Idéal pour séries temporelles et IoT."
      },
      {
        "titre": "Neo4j et Cypher",
        "contenu": "Neo4j est la base de données graphe la plus utilisée, modèle Property Graph : nœuds (entités avec labels), relations (orientées, typées, avec propriétés). Cypher est le langage de requête déclaratif : MATCH (pattern matching), CREATE (création), MERGE (création si absent, sinon match), DELETE, SET, RETURN. Exemple : MATCH (p:Personne)-[:AMI]->(a) WHERE p.nom='Alice' RETURN a.nom. Idéal pour recommandation, détection de fraude, analyse de réseaux sociaux, gestion d'identité, knowledge graph."
      },
      {
        "titre": "Sharding vs réplication",
        "contenu": "Sharding (partitionnement horizontal) : découper un dataset en fragments (shards) répartis sur plusieurs nœuds selon une clé de partition. Objectif : scalabilité horizontale (plus de capacité de stockage et débit d'écriture). Réplication : copier les mêmes données sur plusieurs nœuds (master-slave ou multi-master). Objectif : haute disponibilité, tolérance aux pannes, scalabilité en lecture. Les deux sont complémentaires : MongoDB combine replica sets (HA) et sharding (scale). Cassandra combine partitionnement (anneau) et facteur de réplication (RF=3 typique)."
      },
      {
        "titre": "ETL vs ELT et Data Lake",
        "contenu": "ETL (Extract-Transform-Load) : extraction depuis sources, transformation/nettoyage sur un serveur intermédiaire, puis chargement dans une cible (data warehouse). Adapté aux SGBDR traditionnels. ELT (Extract-Load-Transform) : chargement brut dans une cible scalable (data lake HDFS, S3, BigQuery, Snowflake) puis transformation à la demande grâce à la puissance de la cible. Adapté au Big Data. Data Lake : référentiel centralisé stockant des données brutes hétérogènes (vs Data Warehouse structuré). Le Data Lakehouse combine les deux paradigmes (Delta Lake, Iceberg)."
      }
    ],
    "qcm": [
      {
        "q": "Quels sont les 5V du Big Data ?",
        "options": [
          "A) Volume, Variabilité, Vitesse, Validité, Visibilité",
          "B) Volume, Variété, Vélocité, Véracité, Valeur",
          "C) Volume, Vitesse, Visualisation, Valeur, Vendeur",
          "D) Volume, Validation, Variété, Vélocité, Véracité"
        ],
        "reponse": "B",
        "explication": "Les 5V canoniques sont Volume (taille), Variété (formats), Vélocité (vitesse), Véracité (qualité) et Valeur (utilité stratégique)."
      },
      {
        "q": "Que signifie HDFS dans l'écosystème Hadoop ?",
        "options": [
          "A) High Density File System",
          "B) Hadoop Data File Service",
          "C) Hadoop Distributed File System",
          "D) Hierarchical Data Format Storage"
        ],
        "reponse": "C",
        "explication": "HDFS est le système de fichiers distribué de Hadoop, organisé autour d'un NameNode et de DataNodes, avec blocs répliqués pour la tolérance aux pannes."
      },
      {
        "q": "Le paradigme MapReduce se compose de combien de phases principales ?",
        "options": [
          "A) Une phase unique de calcul parallèle",
          "B) Deux phases : Map (transformation) puis Reduce (agrégation)",
          "C) Trois phases : Read, Map, Write",
          "D) Quatre phases : Extract, Map, Reduce, Load"
        ],
        "reponse": "B",
        "explication": "MapReduce comporte la phase Map qui transforme les données en paires clé-valeur, puis la phase Reduce qui agrège les valeurs par clé. Une phase Shuffle implicite redistribue entre les deux."
      },
      {
        "q": "Quelle abstraction de Spark représente une collection distribuée immuable tolérante aux pannes via lineage ?",
        "options": [
          "A) DataFrame",
          "B) Dataset",
          "C) RDD (Resilient Distributed Dataset)",
          "D) GraphFrame"
        ],
        "reponse": "C",
        "explication": "Le RDD est l'abstraction historique de Spark : une collection distribuée immuable dont la résilience est assurée par le lineage (graphe des transformations) permettant de recalculer les partitions perdues."
      },
      {
        "q": "Selon le théorème CAP, quelles sont les trois propriétés impossibles à garantir simultanément ?",
        "options": [
          "A) Concurrence, Atomicité, Persistance",
          "B) Consistency, Availability, Partition tolerance",
          "C) Cohérence, Accessibilité, Performance",
          "D) Cache, API, Protection"
        ],
        "reponse": "B",
        "explication": "Le théorème de Brewer énonce qu'un système distribué ne peut garantir simultanément que 2 des 3 propriétés C (cohérence), A (disponibilité) et P (tolérance aux partitions)."
      },
      {
        "q": "Quel modèle de cohérence est associé aux bases NoSQL ?",
        "options": [
          "A) ACID (Atomicité, Cohérence, Isolation, Durabilité)",
          "B) BASE (Basically Available, Soft state, Eventual consistency)",
          "C) CRUD (Create, Read, Update, Delete)",
          "D) REST (Representational State Transfer)"
        ],
        "reponse": "B",
        "explication": "Les bases NoSQL privilégient le modèle BASE qui sacrifie la cohérence forte au profit de la disponibilité et propose une cohérence à terme (eventual consistency)."
      },
      {
        "q": "Parmi ces bases, laquelle est une base de données documents ?",
        "options": [
          "A) Redis",
          "B) Cassandra",
          "C) MongoDB",
          "D) Neo4j"
        ],
        "reponse": "C",
        "explication": "MongoDB stocke des documents BSON regroupés en collections. Redis est clé-valeur, Cassandra est orientée colonnes, Neo4j est orientée graphes."
      },
      {
        "q": "Dans MongoDB, quel opérateur permet de modifier la valeur d'un champ existant ?",
        "options": [
          "A) $update",
          "B) $modify",
          "C) $set",
          "D) $change"
        ],
        "reponse": "C",
        "explication": "L'opérateur $set assigne une nouvelle valeur à un champ : db.coll.updateOne({_id:1}, {$set: {nom: 'Alice'}}). $unset supprime, $inc incrémente, $push ajoute à un tableau."
      },
      {
        "q": "Quel opérateur MongoDB teste l'appartenance d'une valeur à un ensemble ?",
        "options": [
          "A) $eq",
          "B) $in",
          "C) $exists",
          "D) $gt"
        ],
        "reponse": "B",
        "explication": "$in vérifie qu'un champ contient une des valeurs d'un tableau : {statut: {$in: ['actif', 'pending']}}. $eq est l'égalité simple, $exists teste la présence d'un champ."
      },
      {
        "q": "Quelle étape du pipeline d'agrégation MongoDB regroupe les documents par une clé ?",
        "options": [
          "A) $match",
          "B) $project",
          "C) $group",
          "D) $sort"
        ],
        "reponse": "C",
        "explication": "$group regroupe les documents par une expression _id et calcule des agrégations ($sum, $avg, $max, $min, $push). $match filtre, $project sélectionne les champs, $sort trie."
      },
      {
        "q": "Dans MongoDB, qu'est-ce qu'un replica set ?",
        "options": [
          "A) Un index secondaire sur une collection",
          "B) Un groupe de mongod répliquant les mêmes données avec failover automatique",
          "C) Un mécanisme de partitionnement horizontal des données",
          "D) Une copie de sauvegarde manuelle"
        ],
        "reponse": "B",
        "explication": "Un replica set est un ensemble de nœuds MongoDB : 1 primaire qui reçoit les écritures, des secondaires qui répliquent et un système d'élection automatique en cas de panne du primaire."
      },
      {
        "q": "Le sharding dans MongoDB sert principalement à :",
        "options": [
          "A) Garantir la cohérence forte des données",
          "B) Chiffrer les communications réseau",
          "C) Partitionner horizontalement les données sur plusieurs shards pour la scalabilité",
          "D) Sauvegarder automatiquement la base"
        ],
        "reponse": "C",
        "explication": "Le sharding distribue les documents d'une collection entre plusieurs shards selon une shard key (hachée ou rangée), permettant la scalabilité horizontale en écriture et stockage."
      },
      {
        "q": "Dans Redis, quel type de données est ordonné par un score ?",
        "options": [
          "A) List",
          "B) Set",
          "C) Hash",
          "D) Sorted Set (ZSet)"
        ],
        "reponse": "D",
        "explication": "Les Sorted Sets (ZADD/ZRANGE) associent à chaque membre un score numérique permettant un tri automatique. Idéal pour classements, leaderboards, files de priorité."
      },
      {
        "q": "Quelle commande Redis permet de définir une expiration sur une clé ?",
        "options": [
          "A) TTL clé",
          "B) EXPIRE clé secondes",
          "C) DEL clé",
          "D) SETEX clé"
        ],
        "reponse": "B",
        "explication": "EXPIRE clé secondes définit le TTL d'une clé existante. TTL retourne le temps restant, SETEX combine SET + EXPIRE en une commande atomique, DEL supprime immédiatement."
      },
      {
        "q": "Dans Cassandra, quel élément de la clé primaire détermine le nœud de stockage ?",
        "options": [
          "A) La clustering key",
          "B) La partition key",
          "C) L'index secondaire",
          "D) Le bloom filter"
        ],
        "reponse": "B",
        "explication": "La partition key est hachée par Cassandra (algorithme Murmur3) pour déterminer la position dans l'anneau et donc le nœud propriétaire. La clustering key trie les lignes au sein d'une partition."
      },
      {
        "q": "Quel langage de requête est utilisé par Neo4j ?",
        "options": [
          "A) SQL",
          "B) GraphQL",
          "C) Cypher",
          "D) SPARQL"
        ],
        "reponse": "C",
        "explication": "Cypher est le langage déclaratif de Neo4j basé sur du pattern matching ASCII-art : MATCH (a)-[:CONNAIT]->(b) RETURN a, b. SPARQL est pour RDF/triple stores."
      },
      {
        "q": "Quelle clause Cypher crée un nœud uniquement s'il n'existe pas, sinon le récupère ?",
        "options": [
          "A) CREATE",
          "B) MATCH",
          "C) MERGE",
          "D) INSERT"
        ],
        "reponse": "C",
        "explication": "MERGE combine MATCH et CREATE : si le pattern existe, il est récupéré ; sinon il est créé. Évite les doublons. CREATE crée toujours, MATCH ne fait que rechercher."
      },
      {
        "q": "Quelle est la différence essentielle entre ETL et ELT ?",
        "options": [
          "A) ETL est plus rapide que ELT dans tous les cas",
          "B) ETL transforme avant le chargement, ELT charge brut puis transforme dans la cible",
          "C) ELT n'est utilisable qu'avec des bases SQL",
          "D) ETL ne supporte pas le Big Data"
        ],
        "reponse": "B",
        "explication": "Dans ETL, les transformations ont lieu sur un serveur intermédiaire avant chargement. Dans ELT, les données brutes sont chargées dans une cible scalable (data lake, warehouse cloud) puis transformées à la demande, exploitant la puissance de calcul de la cible."
      },
      {
        "q": "Quelle architecture combine une couche batch et une couche temps réel ?",
        "options": [
          "A) Architecture micro-services",
          "B) Architecture Lambda",
          "C) Architecture monolithique",
          "D) Architecture SOA"
        ],
        "reponse": "B",
        "explication": "L'architecture Lambda de Nathan Marz combine une batch layer (master dataset + analyses lourdes), une speed layer (temps réel sur données récentes) et une serving layer qui expose la fusion des deux vues."
      },
      {
        "q": "Quel composant de YARN alloue les ressources aux jobs sur le cluster ?",
        "options": [
          "A) NameNode",
          "B) DataNode",
          "C) ResourceManager",
          "D) JobTracker"
        ],
        "reponse": "C",
        "explication": "Dans YARN, le ResourceManager centralise l'allocation des ressources et les NodeManagers gèrent les conteneurs sur chaque nœud. Les NameNode/DataNode appartiennent à HDFS. JobTracker était le composant Hadoop 1 remplacé par YARN."
      },
      {
        "q": "Pourquoi Spark est-il généralement plus rapide que MapReduce ?",
        "options": [
          "A) Spark utilise plus de disques durs",
          "B) Spark effectue les calculs en mémoire (in-memory) et minimise les I/O disque",
          "C) Spark utilise uniquement du C++",
          "D) Spark ne fait pas de tolérance aux pannes"
        ],
        "reponse": "B",
        "explication": "Spark conserve les RDD intermédiaires en mémoire RAM entre transformations, contrairement à MapReduce qui écrit/lit le disque entre chaque job. Gain typique x10 à x100 pour des pipelines itératifs."
      },
      {
        "q": "Cassandra est-elle plutôt une base CP ou AP selon le théorème CAP ?",
        "options": [
          "A) CP (Cohérence + Tolérance aux partitions)",
          "B) AP (Disponibilité + Tolérance aux partitions)",
          "C) CA (Cohérence + Disponibilité)",
          "D) Aucune des trois"
        ],
        "reponse": "B",
        "explication": "Cassandra privilégie la disponibilité et la tolérance aux partitions (AP) : tous les nœuds acceptent les écritures, la cohérence est ajustable et atteinte à terme (eventual consistency)."
      },
      {
        "q": "Dans MongoDB, quel format binaire est utilisé pour stocker les documents ?",
        "options": [
          "A) XML",
          "B) BSON (Binary JSON)",
          "C) Protocol Buffers",
          "D) Avro"
        ],
        "reponse": "B",
        "explication": "MongoDB stocke les documents en BSON, extension binaire de JSON supportant des types supplémentaires (Date, ObjectId, Decimal128, données binaires) et optimisée pour la lecture/écriture."
      },
      {
        "q": "Quel énoncé décrit le mieux la réplication ?",
        "options": [
          "A) Diviser les données en fragments distribués sur plusieurs nœuds",
          "B) Copier les mêmes données sur plusieurs nœuds pour la haute disponibilité",
          "C) Chiffrer les données au repos",
          "D) Compresser les données avant écriture"
        ],
        "reponse": "B",
        "explication": "La réplication copie les mêmes données sur plusieurs nœuds (master-slave ou multi-master) pour assurer haute disponibilité, tolérance aux pannes et scalabilité en lecture. Le partitionnement (sharding) divise les données."
      },
      {
        "q": "Quel système est un Data Lake typique pour le stockage brut ?",
        "options": [
          "A) MySQL",
          "B) PostgreSQL",
          "C) HDFS ou Amazon S3",
          "D) SQLite"
        ],
        "reponse": "C",
        "explication": "HDFS (sur cluster Hadoop) ou Amazon S3 (cloud) sont les supports typiques d'un Data Lake : stockage massif, peu coûteux, scalable horizontalement, acceptant tous les formats de données brutes."
      },
      {
        "q": "Le master dataset d'une architecture Lambda doit être :",
        "options": [
          "A) Modifié en permanence par les utilisateurs",
          "B) Stocké en SGBDR relationnel",
          "C) Immuable et considéré comme source de vérité",
          "D) Effacé après chaque analyse"
        ],
        "reponse": "C",
        "explication": "Le master dataset est immuable et perpétuel : on n'efface jamais les données brutes, on ne fait qu'ajouter. C'est la source de vérité permettant de tout recalculer en cas d'erreur dans les agrégations."
      },
      {
        "q": "Quel niveau de cohérence Cassandra exige une réponse de la majorité des réplicas ?",
        "options": [
          "A) ONE",
          "B) QUORUM",
          "C) ANY",
          "D) ALL"
        ],
        "reponse": "B",
        "explication": "QUORUM exige (RF/2)+1 réplicas. ONE attend un seul réplica (rapide, moins cohérent), ALL attend tous les réplicas (cohérent, lent), ANY accepte n'importe quel nœud y compris hinted handoff."
      },
      {
        "q": "Parmi ces cas d'usage, lequel est typiquement adressé par une base graphe Neo4j ?",
        "options": [
          "A) Cache de session utilisateur",
          "B) Stockage de logs IoT en série temporelle",
          "C) Détection de fraude et recommandations sur réseau social",
          "D) Sauvegarde froide de documents PDF"
        ],
        "reponse": "C",
        "explication": "Les bases graphe excellent dans les domaines où les relations sont aussi importantes que les entités : recommandation, détection de fraude, réseaux sociaux, knowledge graph. Le cache convient à Redis, les séries temporelles à Cassandra."
      },
      {
        "q": "Quel composant Spark permet le traitement de flux de données en micro-batchs ?",
        "options": [
          "A) Spark SQL",
          "B) Spark Streaming / Structured Streaming",
          "C) MLlib",
          "D) GraphX"
        ],
        "reponse": "B",
        "explication": "Spark Streaming traite des flux par micro-batchs (DStreams), Structured Streaming est l'évolution moderne basée sur DataFrames avec garanties exactly-once. MLlib est pour le ML, GraphX pour les graphes."
      },
      {
        "q": "Une base clé-valeur comme DynamoDB est principalement choisie pour :",
        "options": [
          "A) Effectuer des jointures complexes multi-tables",
          "B) Modéliser des relations entre entités",
          "C) Accéder très rapidement à une valeur par sa clé avec une scalabilité massive",
          "D) Effectuer des requêtes analytiques OLAP"
        ],
        "reponse": "C",
        "explication": "Les bases clé-valeur sont optimisées pour des accès O(1) par clé primaire, avec une scalabilité horizontale quasi illimitée. Elles ne supportent généralement pas les jointures ni les requêtes secondaires complexes."
      }
    ],
    "questionsOuvertes": [
      {
        "q": "Présentez de manière détaillée les 5V caractérisant le Big Data en illustrant chacun par un exemple concret tiré d'un secteur d'activité de votre choix.",
        "reponseAttendue": "Réponse attendue : définition et illustration des 5V. Volume : ex. réseau social comme Facebook qui génère 4 Po/jour de logs et photos. Variété : ex. dans la santé, mélange de données structurées (résultats d'analyses), semi-structurées (DICOM, HL7) et non structurées (compte-rendus médicaux, imagerie). Vélocité : ex. trading haute fréquence où des millions de transactions/seconde doivent être analysées en temps réel pour détecter la fraude. Véracité : ex. capteurs IoT industriels où certains capteurs défaillants envoient des valeurs aberrantes qu'il faut filtrer. Valeur : ex. Netflix qui utilise l'analyse des données de visionnage pour recommander des contenus et générer des milliards de dollars de revenu. Conclure sur l'importance de la maîtrise simultanée de ces 5 dimensions pour réussir un projet Big Data."
      },
      {
        "q": "Expliquez le théorème CAP, ses implications pratiques sur le choix d'une base NoSQL, et classez MongoDB, Cassandra, Redis et HBase selon ce critère.",
        "reponseAttendue": "Réponse attendue : énoncer le théorème de Brewer (un système distribué ne peut garantir simultanément Consistency, Availability et Partition tolerance), justifier que P est obligatoire en environnement distribué réel donc le choix se fait entre CP et AP. Implications : un système CP refusera les requêtes en cas de partition pour préserver la cohérence (perte de disponibilité), un système AP continuera à servir mais peut retourner des données obsolètes. Classification : MongoDB = CP (cohérence forte par défaut avec le primaire du replica set), HBase = CP (cohérence forte via Zookeeper), Cassandra = AP (cohérence ajustable, par défaut eventual), Redis Cluster = AP (peut perdre des écritures lors de failover). Mentionner que ces classifications sont parfois nuancées (MongoDB peut être configuré avec readPreference, Cassandra peut atteindre une cohérence forte avec QUORUM)."
      },
      {
        "q": "Décrivez l'architecture Lambda : ses trois couches, leurs rôles respectifs, les technologies typiques de chaque couche, ainsi que ses avantages et ses limites.",
        "reponseAttendue": "Réponse attendue : présenter les trois couches. (1) Batch layer : stocke le master dataset immuable (HDFS, S3) et exécute des analyses lourdes périodiques avec Hadoop MapReduce ou Spark. Garantit l'exactitude car tout est recalculable depuis les données brutes. (2) Speed layer : traite les données récentes en temps réel (Spark Streaming, Flink, Storm, Kafka Streams) et expose une vue temps réel dans une base NoSQL rapide (Cassandra, MongoDB, Redis). Données dénormalisées et agrégées, expiration automatique après inclusion dans le batch suivant. (3) Serving layer : expose aux clients la fusion des vues batch et temps réel via une base NoSQL indexée (Cassandra, MongoDB, ElasticSearch). Avantages : tolérance aux erreurs (recomputation possible), faible latence pour les données fraîches, scalabilité horizontale. Limites : duplication du code métier (batch + streaming), complexité opérationnelle, problème d'expiration des données agrégées dans la speed layer. L'architecture Kappa simplifie en n'utilisant qu'une couche streaming avec rejeu depuis Kafka."
      },
      {
        "q": "Comparez ACID et BASE en montrant pourquoi les bases NoSQL distribuées privilégient généralement BASE. Donnez un cas où ACID reste préférable.",
        "reponseAttendue": "Réponse attendue : détailler ACID (Atomicité, Cohérence, Isolation, Durabilité) garanti par les SGBDR (PostgreSQL, Oracle, MySQL InnoDB) via transactions et verrous. Détailler BASE (Basically Available, Soft state, Eventual consistency) : la base reste disponible même partielle, l'état peut évoluer sans input externe (réplication asynchrone), la cohérence n'est garantie qu'à terme. Justifier le choix BASE pour NoSQL distribué : le théorème CAP impose des compromis, les transactions ACID distribuées (two-phase commit) sont coûteuses et limitent la scalabilité, beaucoup d'applications web tolèrent une cohérence à terme (compteurs, likes, commentaires). Cas où ACID reste préférable : transactions bancaires (transferts d'argent où la cohérence forte est légale et critique), gestion de stock e-commerce critique, systèmes médicaux et juridiques où l'intégrité est primordiale. Mentionner que des bases modernes (MongoDB depuis 4.0, Spanner, CockroachDB, FaunaDB) proposent des transactions ACID distribuées."
      },
      {
        "q": "Concevez un schéma MongoDB pour une plateforme de blog (utilisateurs, articles, commentaires) en justifiant vos choix de modélisation (référencement vs imbrication), puis écrivez les requêtes pour : (a) lister les 10 derniers articles, (b) compter les commentaires par article, (c) ajouter un commentaire.",
        "reponseAttendue": "Réponse attendue : présenter deux collections principales. Collection users : {_id, nom, email, dateInscription, role}. Collection articles : {_id, titre, contenu, auteurId (référence vers users), datePublication, tags: [string], commentaires: [{auteurId, texte, date}] }. Justifier l'imbrication des commentaires dans articles car : (1) accès quasi systématique en même temps que l'article, (2) volume modéré (<100/article typiquement), (3) limite BSON 16Mo respectée. Pour des blogs très populaires avec milliers de commentaires, externaliser dans une collection séparée. Requêtes : (a) db.articles.find().sort({datePublication:-1}).limit(10); (b) db.articles.aggregate([{$project: {titre:1, nbComm: {$size: '$commentaires'}}}]) ou db.articles.aggregate([{$unwind:'$commentaires'},{$group:{_id:'$_id', total:{$sum:1}}}]); (c) db.articles.updateOne({_id: ObjectId('...')}, {$push: {commentaires: {auteurId: ObjectId('...'), texte: 'Super article', date: new Date()}}}). Mentionner la création d'index : db.articles.createIndex({datePublication:-1}) et db.articles.createIndex({auteurId:1})."
      }
    ],
    "ue": "app_bd"
  }
];
