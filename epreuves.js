// Epreuves corrigees - examens IAI Cameroun 2026
const EPREUVES_DATA = {
  "poo": [
    {
      "titre": "Sujet 1 — Rattrapage CC (Juillet 2025) — Application TECH",
      "source": "IAI Cameroun, Niveau 3 GL/SE, durée 00h45",
      "questions": [
        {
          "numero": "1",
          "enonce": "Créer un formulaire d'inscription des utilisateurs (nom, prénom, sexe, âge, mot de passe, confirmer mot de passe).",
          "correction": "Fichier templates/inscription.html :\n\n<form action=\"{{ url_for('inscription') }}\" method=\"POST\">\n  <input type=\"text\" name=\"nom\" required>\n  <input type=\"text\" name=\"prenom\" required>\n  <select name=\"sexe\" required>\n    <option value=\"M\">Masculin</option>\n    <option value=\"F\">Féminin</option>\n  </select>\n  <input type=\"number\" name=\"age\" min=\"1\" max=\"120\" required>\n  <input type=\"email\" name=\"email\" required>\n  <input type=\"password\" name=\"password\" required>\n  <input type=\"password\" name=\"password2\" required>\n  <button type=\"submit\">S'inscrire</button>\n</form>\n\nPoints clés : méthode POST (jamais GET pour mot de passe), required côté client, type=password et type=email, password2 pour la confirmation (validation serveur)."
        },
        {
          "numero": "2",
          "enonce": "Créer un formulaire d'authentification (email + mot de passe).",
          "correction": "Fichier templates/login.html :\n\n<form action=\"{{ url_for('login') }}\" method=\"POST\">\n  <input type=\"email\" name=\"email\" required>\n  <input type=\"password\" name=\"password\" required>\n  <button type=\"submit\">Se connecter</button>\n</form>\n\nLe serveur comparera le hash stocké en base avec le mot de passe fourni (jamais en clair !)."
        },
        {
          "numero": "3",
          "enonce": "Créer les servlets (inscription, connexion, déconnexion) en manipulant l'API JDBC pour la base iaidatabase (table users : iduser auto-incrément, nom, password, email).",
          "correction": "Transposition Python/Flask avec bcrypt :\n\nfrom flask import Flask, render_template, request, redirect, url_for, session\nimport mysql.connector, bcrypt\n\napp = Flask(__name__)\napp.secret_key = 'iai_secret'\n\ndef get_conn():\n    return mysql.connector.connect(host='localhost', user='root', password='', database='iaidatabase')\n\n@app.route('/inscription', methods=['GET','POST'])\ndef inscription():\n    if request.method=='POST':\n        nom = request.form['nom']; email = request.form['email']\n        pwd = request.form['password']; pwd2 = request.form['password2']\n        if pwd != pwd2:\n            return render_template('inscription.html', error='Mots de passe différents')\n        hashed = bcrypt.hashpw(pwd.encode(), bcrypt.gensalt())\n        conn = get_conn(); cur = conn.cursor()\n        cur.execute('INSERT INTO users(nom,password,email) VALUES(%s,%s,%s)', (nom, hashed.decode(), email))\n        conn.commit(); cur.close(); conn.close()\n        return redirect(url_for('login'))\n    return render_template('inscription.html')\n\n@app.route('/login', methods=['GET','POST'])\ndef login():\n    if request.method=='POST':\n        conn = get_conn(); cur = conn.cursor(dictionary=True)\n        cur.execute('SELECT * FROM users WHERE email=%s', (request.form['email'],))\n        user = cur.fetchone()\n        if user and bcrypt.checkpw(request.form['password'].encode(), user['password'].encode()):\n            session['iduser'] = user['iduser']\n            return redirect(url_for('accueil'))\n        return render_template('login.html', error='Identifiants incorrects')\n    return render_template('login.html')\n\n@app.route('/logout')\ndef logout():\n    session.clear()\n    return redirect(url_for('login'))\n\nScript SQL :\nCREATE TABLE users(iduser INT AUTO_INCREMENT PRIMARY KEY, nom VARCHAR(100), password VARCHAR(255), email VARCHAR(150) UNIQUE);\n\nPoints à mettre en avant : bcrypt (jamais en clair), session.clear() pour logout, requêtes paramétrées %s (anti-injection SQL), email UNIQUE."
        }
      ]
    },
    {
      "titre": "Sujet 2 — Examen Juin 2025 — Django To-Do List",
      "source": "Durée 01h00, total /20",
      "questions": [
        {
          "numero": "1",
          "enonce": "Créer un environnement virtuel (iai).",
          "correction": "Linux/macOS :\npython3 -m venv iai\nsource iai/bin/activate\n\nWindows PowerShell :\npython -m venv iai\n.\\iai\\Scripts\\activate\n\nPuis : pip install django\n\nVérification : (iai) apparaît en début de prompt."
        },
        {
          "numero": "2",
          "enonce": "Créer un projet (todo).",
          "correction": "django-admin startproject todo\ncd todo\n\nArborescence générée : todo/manage.py + todo/todo/{__init__,settings,urls,asgi,wsgi}.py"
        },
        {
          "numero": "3",
          "enonce": "Créer l'application (tasks).",
          "correction": "python manage.py startapp tasks\n\nDans todo/settings.py, ajouter 'tasks' à INSTALLED_APPS :\nINSTALLED_APPS = [..., 'tasks',]"
        },
        {
          "numero": "4",
          "enonce": "Créer le modèle Task : title (CharField max 200), completed (BooleanField, défaut False), created_at (DateTimeField auto-rempli).",
          "correction": "Fichier tasks/models.py :\n\nfrom django.db import models\n\nclass Task(models.Model):\n    title = models.CharField(max_length=200)\n    completed = models.BooleanField(default=False)\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    class Meta:\n        ordering = ['-created_at']\n\n    def __str__(self):\n        return self.title\n\nExplications : auto_now_add=True remplit la date UNE fois à la création (vs auto_now qui met à jour à chaque sauvegarde)."
        },
        {
          "numero": "5",
          "enonce": "Créer les migrations et les appliquer.",
          "correction": "python manage.py makemigrations tasks\npython manage.py migrate\n\nmakemigrations génère tasks/migrations/0001_initial.py. migrate applique les opérations → la table tasks_task est créée."
        },
        {
          "numero": "6",
          "enonce": "Vue afficheTache pour afficher la liste des tâches dans un template HTML.",
          "correction": "Fichier tasks/views.py :\n\nfrom django.shortcuts import render, redirect, get_object_or_404\nfrom .models import Task\nfrom .forms import TaskForm\n\ndef afficheTache(request):\n    if request.method == 'POST':\n        form = TaskForm(request.POST)\n        if form.is_valid():\n            form.save()\n            return redirect('afficheTache')\n    else:\n        form = TaskForm()\n    taches = Task.objects.all()\n    return render(request, 'tasks/liste.html', {'taches': taches, 'form': form})\n\nFichier tasks/templates/tasks/liste.html :\n<h1>Ma liste de tâches</h1>\n<ul>\n{% for t in taches %}\n  <li>\n    <a href=\"{% url 'toggleTache' t.id %}\">\n      {% if t.completed %}<s>{{ t.title }}</s>{% else %}{{ t.title }}{% endif %}\n    </a>\n  </li>\n{% endfor %}\n</ul>"
        },
        {
          "numero": "7",
          "enonce": "Ajouter un formulaire dans le template pour créer de nouvelles tâches.",
          "correction": "Fichier tasks/forms.py :\n\nfrom django import forms\nfrom .models import Task\n\nclass TaskForm(forms.ModelForm):\n    class Meta:\n        model = Task\n        fields = ['title']\n\nDans liste.html, avant le <ul> :\n<form method=\"POST\">\n  {% csrf_token %}\n  {{ form.title }}\n  <button type=\"submit\">Ajouter</button>\n</form>\n\n{% csrf_token %} est OBLIGATOIRE pour les POST (protection CSRF)."
        },
        {
          "numero": "8",
          "enonce": "Vue pour marquer une tâche comme terminée ou non terminée.",
          "correction": "def toggleTache(request, task_id):\n    tache = get_object_or_404(Task, pk=task_id)\n    tache.completed = not tache.completed\n    tache.save()\n    return redirect('afficheTache')\n\nPrincipe : récupérer par id (404 si introuvable), inverser le booléen, sauvegarder, rediriger."
        },
        {
          "numero": "9",
          "enonce": "Configurer les URLs (todo/urls.py et tasks/urls.py).",
          "correction": "Fichier tasks/urls.py :\nfrom django.urls import path\nfrom . import views\n\nurlpatterns = [\n    path('', views.afficheTache, name='afficheTache'),\n    path('toggle/<int:task_id>/', views.toggleTache, name='toggleTache'),\n]\n\nFichier todo/urls.py :\nfrom django.contrib import admin\nfrom django.urls import path, include\n\nurlpatterns = [\n    path('admin/', admin.site.urls),\n    path('tasks/', include('tasks.urls')),\n]\n\nTest : python manage.py runserver → http://127.0.0.1:8000/tasks/"
        }
      ]
    },
    {
      "titre": "Sujet 3 — QCM Juin 2025 (10 questions, +1/-1)",
      "source": "Test de Compétence QCM, 10 pts",
      "questions": [
        {
          "numero": "1",
          "enonce": "Mécanisme Django pour gérer les migrations de manière cohérente ?",
          "correction": "Bonne réponse : b) Un graphe de dépendances entre migrations.\n\nDjango stocke chaque migration comme nœud d'un DAG (Directed Acyclic Graph). Chaque migration a dependencies = [...] listant celles à appliquer avant. C'est ce graphe Python qui structure tout (la table django_migrations ne fait que mémoriser ce qui est déjà appliqué)."
        },
        {
          "numero": "2",
          "enonce": "Champ Django stockant nativement du JSON depuis 3.1 ?",
          "correction": "Bonne réponse : b) models.JSONField.\n\nNatif depuis Django 3.1 sur PostgreSQL, MySQL 5.7+, MariaDB 10.2+, Oracle, SQLite. Sérialise/désérialise automatiquement. Permet même des requêtes par clé : MyModel.objects.filter(data__user__role='admin')."
        },
        {
          "numero": "3",
          "enonce": "Rôle du middleware CsrfViewMiddleware ?",
          "correction": "Bonne réponse : b) Protection CSRF.\n\nGénère un jeton unique par session (cookie + {% csrf_token %}). À chaque POST/PUT/DELETE, vérifie la correspondance. Sinon 403 Forbidden."
        },
        {
          "numero": "4",
          "enonce": "Django et async/await ?",
          "correction": "Bonne réponse : b) ASGI + vues async def.\n\nDepuis Django 3.0 (vues), 4.1 (ORM). Nécessite un serveur ASGI (Daphne, Uvicorn) et asgi.py. WSGI ne supporte pas await. Pas de conversion auto."
        },
        {
          "numero": "5",
          "enonce": "Optimiser les requêtes avec ForeignKey ?",
          "correction": "Bonne réponse : a) select_related pour ForeignKey et OneToOne.\n\nselect_related fait des JOIN SQL (une seule requête, *-vers-un). prefetch_related fait des requêtes séparées (M2M, reverse FK). Combinés, ils éliminent les N+1 sans recourir au SQL brut.\n\nEx : Article.objects.select_related('auteur').prefetch_related('tags').all()"
        },
        {
          "numero": "6",
          "enonce": "DRF — pagination personnalisée ?",
          "correction": "Bonne réponse : b) Classe héritant de BasePagination.\n\nclass MaPagination(PageNumberPagination):\n    page_size = 20\n    page_size_query_param = 'taille'\n    max_page_size = 100\n\nclass MaVueAPI(ListAPIView):\n    pagination_class = MaPagination\n\nModifier PAGE_SIZE seul ne permet pas de personnaliser le COMPORTEMENT."
        },
        {
          "numero": "7",
          "enonce": "Avantage de only() vs select_related() ?",
          "correction": "Bonne réponse : a) only() réduit les COLONNES, select_related() joint les TABLES.\n\nonly('a','b') ne charge que ces colonnes ; les autres deviennent lazy. defer() est l'opposé : charge tout SAUF. Les deux outils sont COMPLÉMENTAIRES."
        },
        {
          "numero": "8",
          "enonce": "Configurer plusieurs bases de données ?",
          "correction": "Bonne réponse : a) Plusieurs entrées DATABASES + routeurs.\n\nDATABASES = {'default': {...}, 'analytics': {...}}\nDATABASE_ROUTERS = ['monapp.routers.AnalyticsRouter']\n\nclass AnalyticsRouter:\n    def db_for_read(self, model, **hints):\n        if model._meta.app_label == 'analytics':\n            return 'analytics'\n        return None\n\nForçage ponctuel : MyModel.objects.using('analytics').all()"
        },
        {
          "numero": "9",
          "enonce": "Comportement par défaut quand DoesNotExist est levée ?",
          "correction": "Bonne réponse : a) HTTP 500 (piège du QCM !).\n\nDoesNotExist est une exception Python normale. Sans helper, le serveur renvoie 500. Pour un 404 propre : get_object_or_404() qui convertit DoesNotExist en Http404."
        },
        {
          "numero": "10",
          "enonce": "Implémenter un signal personnalisé ?",
          "correction": "Bonne réponse : a) @receiver avec post_save.\n\nfrom django.db.models.signals import post_save\nfrom django.dispatch import receiver\nfrom .models import Article\n\n@receiver(post_save, sender=Article)\ndef article_cree(sender, instance, created, **kwargs):\n    if created:\n        print(f'Nouvel article : {instance.title}')\n\nÀ charger dans apps.py via def ready(self): from . import signals. Surcharger save() couple le code au modèle."
        }
      ]
    },
    {
      "titre": "Sujet 4 — TP Juin 2025 — Bibliothèque IAI",
      "source": "Test de Compétence Pratique, 10 pts",
      "questions": [
        {
          "numero": "Énoncé",
          "enonce": "Application Django de gestion de la bibliothèque IAI. Modèle Book (titre CharField 200, auteur CharField 100, annee_publication IntegerField). ListView + vue fonction d'ajout + suppression. Templates book_list.html (table) et book_form.html (formulaire). URLs configurées.",
          "correction": "Voir les questions 1 à 8 ci-dessous (solution complète)."
        },
        {
          "numero": "1-3",
          "enonce": "Environnement virtuel + projet IAIBook + app Bibliotheque.",
          "correction": "python -m venv iai && source iai/bin/activate (Linux) ou .\\iai\\Scripts\\activate (Windows)\npip install django\ndjango-admin startproject IAIBook\ncd IAIBook\npython manage.py startapp Bibliotheque\n\nDans IAIBook/settings.py : INSTALLED_APPS = [..., 'Bibliotheque']"
        },
        {
          "numero": "4-5",
          "enonce": "Modèle Book + migrations.",
          "correction": "Fichier Bibliotheque/models.py :\n\nfrom django.db import models\nfrom django.urls import reverse\n\nclass Book(models.Model):\n    titre = models.CharField(max_length=200)\n    auteur = models.CharField(max_length=100)\n    annee_publication = models.IntegerField()\n\n    class Meta:\n        ordering = ['-annee_publication', 'titre']\n\n    def __str__(self):\n        return f\"{self.titre} — {self.auteur} ({self.annee_publication})\"\n\nMigrations :\npython manage.py makemigrations Bibliotheque\npython manage.py migrate"
        },
        {
          "numero": "6",
          "enonce": "Vues (ListView pour la liste, fonction pour l'ajout, fonction pour la suppression).",
          "correction": "Fichier Bibliotheque/forms.py :\nfrom django import forms\nfrom .models import Book\n\nclass BookForm(forms.ModelForm):\n    class Meta:\n        model = Book\n        fields = ['titre', 'auteur', 'annee_publication']\n\nFichier Bibliotheque/views.py :\nfrom django.shortcuts import render, redirect, get_object_or_404\nfrom django.views.generic import ListView\nfrom .models import Book\nfrom .forms import BookForm\n\nclass BookListView(ListView):\n    model = Book\n    template_name = 'Bibliotheque/book_list.html'\n    context_object_name = 'livres'\n    paginate_by = 10\n\ndef ajouter_livre(request):\n    if request.method == 'POST':\n        form = BookForm(request.POST)\n        if form.is_valid():\n            form.save()\n            return redirect('book_list')\n    else:\n        form = BookForm()\n    return render(request, 'Bibliotheque/book_form.html', {'form': form})\n\ndef supprimer_livre(request, pk):\n    livre = get_object_or_404(Book, pk=pk)\n    livre.delete()\n    return redirect('book_list')"
        },
        {
          "numero": "7-8",
          "enonce": "Templates + URLs.",
          "correction": "book_list.html :\n<h1>Livres de la bibliothèque IAI</h1>\n<a href=\"{% url 'ajouter_livre' %}\">+ Ajouter</a>\n<table border=\"1\">\n  <tr><th>#</th><th>Titre</th><th>Auteur</th><th>Année</th><th>Action</th></tr>\n  {% for l in livres %}\n  <tr>\n    <td>{{ forloop.counter }}</td><td>{{ l.titre }}</td><td>{{ l.auteur }}</td>\n    <td>{{ l.annee_publication }}</td>\n    <td><a href=\"{% url 'supprimer_livre' l.id %}\" onclick=\"return confirm('Supprimer ?')\">Supprimer</a></td>\n  </tr>\n  {% endfor %}\n</table>\n\nbook_form.html :\n<h1>Ajouter un livre</h1>\n<form method=\"POST\">{% csrf_token %}{{ form.as_p }}<button type=\"submit\">Enregistrer</button></form>\n\nBibliotheque/urls.py :\nfrom django.urls import path\nfrom . import views\n\nurlpatterns = [\n    path('', views.BookListView.as_view(), name='book_list'),\n    path('ajouter/', views.ajouter_livre, name='ajouter_livre'),\n    path('supprimer/<int:pk>/', views.supprimer_livre, name='supprimer_livre'),\n]\n\nIAIBook/urls.py :\nurlpatterns = [\n    path('admin/', admin.site.urls),\n    path('livres/', include('Bibliotheque.urls')),\n]\n\nLancement : python manage.py runserver → http://127.0.0.1:8000/livres/"
        }
      ]
    }
  ],
  "mobile": [
    {
      "titre": "Sujet 1 - Rattrapage Examen de Fin de Semestre - Session de Juin 2025 (QCM)",
      "source": "PROGRAMMATION MOBILE.pdf - Page 1 - Duree 00h30 - Niveau 3 Genie Logiciel/Software Eng. 2024-2025",
      "questions": [
        {
          "numero": "1",
          "enonce": "Quel widget permet de creer un espace vide entre deux composants ? A. Divider, B. Align, C. Padding, D. SizedBox",
          "correction": "Reponse correcte : D. SizedBox.\n\nExplication detaillee :\n- SizedBox est un widget qui occupe un espace de dimensions fixes (largeur et/ou hauteur). Il est ideal pour creer un ecart vide entre deux widgets.\n- Divider trace une ligne horizontale visible (separateur) - ce n'est pas un simple espace vide.\n- Align positionne son enfant selon une alignement donne, il ne cree pas d'espace entre deux widgets.\n- Padding ajoute un espace autour d'un widget enfant (interieur), mais necessite un enfant.\n\nExemple Dart/Flutter :\n```dart\nColumn(\n  children: [\n    Text('Premier element'),\n    SizedBox(height: 20), // espace vide de 20 pixels\n    Text('Second element'),\n  ],\n)\n```",
          "bareme": "+1pt"
        },
        {
          "numero": "2",
          "enonce": "Quelle propriete du widget Text permet de modifier la couleur du texte ? A. theme, B. fontColor, C. color, D. style",
          "correction": "Reponse correcte : D. style.\n\nLa couleur du texte est definie via la propriete style, qui prend un objet TextStyle contenant entre autres color.\n\nExemple :\n```dart\nText(\n  'Bonjour Flutter',\n  style: TextStyle(\n    color: Colors.red,\n    fontSize: 18,\n    fontWeight: FontWeight.bold,\n  ),\n)\n```\n\nAttention : fontColor n'existe pas dans la classe Text. color est une propriete de TextStyle, pas directement de Text.",
          "bareme": "+1pt"
        },
        {
          "numero": "3",
          "enonce": "Lequel de ces widgets permet de positionner un element selon un alignement precis ? A. Column, B. Padding, C. SizedBox, D. Align",
          "correction": "Reponse correcte : D. Align.\n\nLe widget Align permet de positionner son enfant selon un parametre alignment (Alignment.topLeft, Alignment.center, Alignment.bottomRight, etc.).\n\nExemple :\n```dart\nAlign(\n  alignment: Alignment.bottomRight,\n  child: Icon(Icons.star, size: 40),\n)\n```\n\nColumn ne fait qu'empiler verticalement, Padding ajoute des marges interieures, SizedBox impose des dimensions.",
          "bareme": "+1pt"
        },
        {
          "numero": "4",
          "enonce": "Quelle est la fonction de MediaQuery.of(context) ? A. Gerer la navigation, B. Obtenir les widgets parents, C. Acceder aux couleurs de l'app, D. Acceder a la taille et orientation de l'ecran",
          "correction": "Reponse correcte : D. Acceder a la taille et orientation de l'ecran.\n\nMediaQuery.of(context) retourne un MediaQueryData decrivant l'ecran : taille, orientation, densite, padding systeme (status bar, notch), etc.\n\nExemple :\n```dart\nfinal mq = MediaQuery.of(context);\nfinal width = mq.size.width;\nfinal height = mq.size.height;\nfinal isPortrait = mq.orientation == Orientation.portrait;\n\nContainer(\n  width: width * 0.8,\n  height: height * 0.3,\n);\n```\n\nMediaQuery est essentiel pour creer des interfaces responsives.",
          "bareme": "+1pt"
        },
        {
          "numero": "5",
          "enonce": "Quel widget est souvent utilise pour mettre un formulaire dans une vue scrollable ? A. Form, B. Row, C. Column, D. SingleChildScrollView",
          "correction": "Reponse correcte : D. SingleChildScrollView.\n\nSingleChildScrollView permet de rendre scrollable n'importe quel widget enfant (typiquement une Column contenant un formulaire) lorsque le contenu depasse l'ecran ou que le clavier reduit l'espace disponible.\n\nExemple :\n```dart\nSingleChildScrollView(\n  padding: EdgeInsets.all(16),\n  child: Form(\n    key: _formKey,\n    child: Column(\n      children: [\n        TextFormField(decoration: InputDecoration(labelText: 'Nom')),\n        TextFormField(decoration: InputDecoration(labelText: 'Email')),\n        TextFormField(decoration: InputDecoration(labelText: 'Telephone')),\n        TextFormField(decoration: InputDecoration(labelText: 'Adresse')),\n        ElevatedButton(onPressed: () {}, child: Text('Envoyer')),\n      ],\n    ),\n  ),\n)\n```\n\nForm est utile pour la validation mais n'est pas scrollable par defaut.",
          "bareme": "+1pt"
        },
        {
          "numero": "6",
          "enonce": "Quel mot-cle Dart est utilise pour declarer une valeur non modifiable ? A. let, B. static, C. const, D. final",
          "correction": "Reponses correctes : C. const ET D. final (les deux sont valides en Dart, selon la nuance).\n\n- final : la variable ne peut etre assignee qu'une seule fois mais sa valeur est calculee a l'execution.\n- const : la valeur est connue a la compilation (constante de compilation).\n\nExemple :\n```dart\nfinal DateTime maintenant = DateTime.now(); // OK : valeur a runtime\nconst int max = 100; // OK : constante de compilation\n// const DateTime x = DateTime.now(); // ERREUR : pas connu a la compilation\n```\n\nNote : let n'existe pas en Dart, et static designe un membre de classe (pas l'immutabilite). Si l'epreuve attend UNE seule reponse, choisir C. const car explicitement non modifiable a tout niveau ; mais final est aussi techniquement acceptable. Souvent le corrige officiel retient final pour les variables d'instance et const pour les constantes globales.",
          "bareme": "+1pt"
        },
        {
          "numero": "7",
          "enonce": "A quoi sert la methode dispose() dans un StatefulWidget ? A. Initialiser les donnees, B. Rafraichir l'UI, C. Redemarrer le widget, D. Liberer les ressources",
          "correction": "Reponse correcte : D. Liberer les ressources.\n\ndispose() est appelee une seule fois lorsque l'objet State est retire definitivement de l'arbre. C'est l'endroit ideal pour fermer les controllers, listeners, streams, animations, etc.\n\nExemple :\n```dart\nclass _MonState extends State<MaPage> {\n  final TextEditingController _ctrl = TextEditingController();\n  StreamSubscription? _sub;\n\n  @override\n  void initState() {\n    super.initState();\n    _sub = monStream.listen((data) => print(data));\n  }\n\n  @override\n  void dispose() {\n    _ctrl.dispose();\n    _sub?.cancel();\n    super.dispose(); // toujours appeler super.dispose() en dernier\n  }\n}\n```\n\nOublier dispose() provoque des fuites memoire.",
          "bareme": "+1pt"
        },
        {
          "numero": "8",
          "enonce": "Comment appeler une fonction lors du clic sur un TextButton ? A. onTap, B. action, C. click, D. onPressed",
          "correction": "Reponse correcte : D. onPressed.\n\nLes boutons Flutter (TextButton, ElevatedButton, OutlinedButton, IconButton) utilisent la propriete onPressed (de type VoidCallback?). Si onPressed est null, le bouton est desactive.\n\nExemple :\n```dart\nTextButton(\n  onPressed: () {\n    print('Bouton clique !');\n    Navigator.pushNamed(context, '/details');\n  },\n  child: Text('Cliquez-moi'),\n)\n```\n\nonTap est utilise par GestureDetector et InkWell, pas par les boutons.",
          "bareme": "+1pt"
        },
        {
          "numero": "9",
          "enonce": "Quel type de widget est Scaffold ? A. StatelessWidget, B. LayoutWidget, C. ContainerWidget, D. Structure de base de l'interface",
          "correction": "Reponse correcte : D. Structure de base de l'interface.\n\nScaffold est un StatelessWidget qui implemente la structure visuelle Material Design : il fournit des emplacements pour l'AppBar (en haut), le body (centre), le drawer (lateral), le bottomNavigationBar, le floatingActionButton et la snackBar.\n\nExemple :\n```dart\nScaffold(\n  appBar: AppBar(title: Text('Mon App')),\n  body: Center(child: Text('Hello')),\n  floatingActionButton: FloatingActionButton(\n    onPressed: () {},\n    child: Icon(Icons.add),\n  ),\n  bottomNavigationBar: BottomNavigationBar(items: const [\n    BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Accueil'),\n    BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profil'),\n  ]),\n)\n```",
          "bareme": "+1pt"
        },
        {
          "numero": "10",
          "enonce": "Lequel de ces widgets est souvent utilise pour creer une animation de transition ? A. AnimatedOpacity, B. ListTile, C. SafeArea, D. PageRouteBuilder",
          "correction": "Reponses correctes : A. AnimatedOpacity (animation implicite d'opacite) et D. PageRouteBuilder (transitions de pages personnalisees).\n\nSi une seule reponse est attendue, D. PageRouteBuilder est la plus liee aux 'transitions' au sens navigation entre ecrans.\n\nExemple AnimatedOpacity :\n```dart\nAnimatedOpacity(\n  opacity: _visible ? 1.0 : 0.0,\n  duration: Duration(milliseconds: 500),\n  child: Container(width: 100, height: 100, color: Colors.blue),\n)\n```\n\nExemple PageRouteBuilder :\n```dart\nNavigator.push(\n  context,\n  PageRouteBuilder(\n    transitionDuration: Duration(milliseconds: 600),\n    pageBuilder: (_, __, ___) => DetailPage(),\n    transitionsBuilder: (_, anim, __, child) =>\n        FadeTransition(opacity: anim, child: child),\n  ),\n);\n```",
          "bareme": "+1pt"
        },
        {
          "numero": "11",
          "enonce": "Quel widget est adapte a une grille d'images responsive ? A. ListView.builder, B. Column, C. Wrap, D. GridView.builder",
          "correction": "Reponse correcte : D. GridView.builder.\n\nGridView.builder cree une grille performante (lazy loading) avec un nombre defini de colonnes ou une largeur maximale par tuile, parfaite pour des galleries d'images responsives.\n\nExemple :\n```dart\nGridView.builder(\n  padding: EdgeInsets.all(8),\n  gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(\n    maxCrossAxisExtent: 150, // adaptatif selon largeur ecran\n    crossAxisSpacing: 8,\n    mainAxisSpacing: 8,\n    childAspectRatio: 1.0,\n  ),\n  itemCount: images.length,\n  itemBuilder: (context, index) => Image.network(\n    images[index],\n    fit: BoxFit.cover,\n  ),\n)\n```\n\nWrap est aussi possible pour une grille fluide, mais GridView.builder reste la solution standard responsive.",
          "bareme": "+1pt"
        },
        {
          "numero": "12",
          "enonce": "Quel widget permet de forcer une taille exacte ? A. Flexible, B. Container, C. Expanded, D. SizedBox",
          "correction": "Reponse correcte : D. SizedBox.\n\nSizedBox impose une largeur et/ou hauteur exactes a son enfant. Container peut aussi imposer des dimensions, mais SizedBox est explicitement dedie a cela.\n\nExemple :\n```dart\nSizedBox(\n  width: 200,\n  height: 50,\n  child: ElevatedButton(\n    onPressed: () {},\n    child: Text('Bouton fixe'),\n  ),\n)\n```\n\n- Flexible et Expanded distribuent l'espace disponible (proportionnel), ne forcent PAS une taille fixe.\n- Container avec width/height peut faire le travail, mais SizedBox est plus leger et explicite.",
          "bareme": "+1pt"
        },
        {
          "numero": "13",
          "enonce": "Quelle methode du cycle de vie est appelee en premier dans un StatefulWidget ? A. build(), B. dispose(), C. didChangeDependencies(), D. initState()",
          "correction": "Reponse correcte : D. initState().\n\nCycle de vie d'un StatefulWidget :\n1. createState() (sur le widget)\n2. initState() - appelee UNE seule fois a la creation\n3. didChangeDependencies() - apres initState et a chaque changement de dependance heritee\n4. build() - peut etre appelee plusieurs fois\n5. didUpdateWidget() - quand le widget parent reconstruit avec un nouveau widget\n6. setState() - declenche un rebuild\n7. deactivate() - retire de l'arbre\n8. dispose() - destruction\n\nExemple :\n```dart\n@override\nvoid initState() {\n  super.initState();\n  // Initialisation : controllers, abonnements stream, requete API initiale\n  _controller = ScrollController();\n  _loadDataFromApi();\n}\n```\n\nNe JAMAIS faire d'appel a context dans initState (utiliser didChangeDependencies a la place).",
          "bareme": "+1pt"
        },
        {
          "numero": "14",
          "enonce": "Quel mot-cle est utilise pour declarer un widget personnalise ? A. struct, B. widget, C. function, D. class",
          "correction": "Reponse correcte : D. class.\n\nUn widget personnalise en Flutter est une classe Dart qui herite de StatelessWidget ou StatefulWidget.\n\nExemple :\n```dart\nclass CarteProduit extends StatelessWidget {\n  final String nom;\n  final double prix;\n\n  const CarteProduit({Key? key, required this.nom, required this.prix})\n      : super(key: key);\n\n  @override\n  Widget build(BuildContext context) {\n    return Card(\n      child: ListTile(\n        title: Text(nom),\n        subtitle: Text('${prix.toStringAsFixed(2)} FCFA'),\n      ),\n    );\n  }\n}\n```\n\nDart ne possede ni struct ni le mot-cle widget. function est utilise pour des helpers, mais un widget doit etre une class.",
          "bareme": "+1pt"
        },
        {
          "numero": "15",
          "enonce": "Pour stocker localement une valeur simple (booleen, int), on utilise ? A. FlutterSecureStorage, B. GetStorage, C. path_provider, D. shared_preferences",
          "correction": "Reponse correcte : D. shared_preferences.\n\nshared_preferences est le package standard de l'equipe Flutter pour stocker des paires cle/valeur primitives (bool, int, double, String, List<String>) de maniere persistante (utilise NSUserDefaults sur iOS, SharedPreferences sur Android).\n\nExemple :\n```dart\nimport 'package:shared_preferences/shared_preferences.dart';\n\nFuture<void> sauvegarderTheme(bool sombre) async {\n  final prefs = await SharedPreferences.getInstance();\n  await prefs.setBool('themeSombre', sombre);\n}\n\nFuture<bool> lireTheme() async {\n  final prefs = await SharedPreferences.getInstance();\n  return prefs.getBool('themeSombre') ?? false;\n}\n```\n\n- FlutterSecureStorage : donnees sensibles chiffrees (tokens, mots de passe).\n- GetStorage : alternative tres rapide non-officielle.\n- path_provider : recupere les chemins systeme (cache, documents), pas un systeme de stockage en soi.",
          "bareme": "+1pt"
        },
        {
          "numero": "16",
          "enonce": "Quelle methode est utilisee pour declencher une mise a jour de l'UI ? A. reload(), B. refresh(), C. rebuild(), D. setState()",
          "correction": "Reponse correcte : D. setState().\n\nsetState((){...}) signale au framework que l'etat interne de ce State a change et qu'il doit appeler build() a nouveau.\n\nExemple :\n```dart\nclass _CompteurState extends State<Compteur> {\n  int _valeur = 0;\n\n  void _incrementer() {\n    setState(() {\n      _valeur++; // modifier l'etat DANS la closure\n    });\n  }\n\n  @override\n  Widget build(BuildContext context) {\n    return Column(\n      children: [\n        Text('Valeur : $_valeur'),\n        ElevatedButton(onPressed: _incrementer, child: Text('+1')),\n      ],\n    );\n  }\n}\n```\n\nNe pas appeler setState dans build() ni apres dispose().",
          "bareme": "+1pt"
        },
        {
          "numero": "17",
          "enonce": "Quelle est la fonction de pubspec.yaml ? A. Contient le code source, B. Gere la navigation, C. Gere les styles CSS, D. Declare les dependances et assets",
          "correction": "Reponse correcte : D. Declare les dependances et assets.\n\npubspec.yaml est le manifeste du projet Flutter/Dart. Il contient :\n- Le nom, la description, la version du projet.\n- Les contraintes Dart/Flutter SDK.\n- Les dependances (dependencies, dev_dependencies).\n- Les ressources : assets (images, JSON), fonts, etc.\n\nExemple :\n```yaml\nname: mon_app\ndescription: Application medicale offline\nversion: 1.0.0+1\n\nenvironment:\n  sdk: '>=3.0.0 <4.0.0'\n\ndependencies:\n  flutter:\n    sdk: flutter\n  http: ^1.1.0\n  shared_preferences: ^2.2.0\n  provider: ^6.1.0\n\ndev_dependencies:\n  flutter_test:\n    sdk: flutter\n\nflutter:\n  uses-material-design: true\n  assets:\n    - assets/images/\n    - assets/data/patients.json\n  fonts:\n    - family: Roboto\n      fonts:\n        - asset: fonts/Roboto-Regular.ttf\n```",
          "bareme": "+1pt"
        },
        {
          "numero": "18",
          "enonce": "Quel widget permet d'empiler des elements les uns sur les autres ? A. Column, B. Row, C. Wrap, D. Stack",
          "correction": "Reponse correcte : D. Stack.\n\nStack superpose ses enfants en couches (chevauchement). Column empile verticalement (cote-a-cote vertical), Row horizontalement.\n\nExemple typique : photo de profil avec badge en bas a droite :\n```dart\nStack(\n  alignment: Alignment.center,\n  children: [\n    CircleAvatar(radius: 60, backgroundImage: NetworkImage(url)),\n    Positioned(\n      bottom: 0,\n      right: 0,\n      child: CircleAvatar(\n        radius: 14,\n        backgroundColor: Colors.green,\n        child: Icon(Icons.check, size: 16, color: Colors.white),\n      ),\n    ),\n  ],\n)\n```",
          "bareme": "+1pt"
        },
        {
          "numero": "19",
          "enonce": "Dans Flutter, le hot reload permet de : A. Lancer l'application, B. Recompiler tout le projet, C. Changer les packages, D. Mettre a jour le code sans relancer l'app",
          "correction": "Reponse correcte : D. Mettre a jour le code sans relancer l'app.\n\nHot reload injecte le code Dart modifie dans la VM Dart en cours d'execution et reconstruit l'arbre de widgets, en preservant l'etat de l'application. Tres rapide (< 1 sec).\n\nDifference importante :\n- Hot reload (r) : preserve l'etat, ideal pour ajuster l'UI.\n- Hot restart (R) : detruit l'etat et redemarre main(), necessaire pour les changements dans main(), les initialisations globales ou les changements de classes natives.\n- Recompilation complete (flutter run) : necessaire pour changer pubspec.yaml, ajouter du code natif Android/iOS, etc.",
          "bareme": "+1pt"
        },
        {
          "numero": "20",
          "enonce": "Quel widget permet d'afficher une boite de dialogue contextuelle ? A. Scaffold, B. Container, C. AlertContainer, D. showDialog",
          "correction": "Reponse correcte : D. showDialog.\n\nshowDialog est une fonction (et non un widget) qui ouvre une boite de dialogue modale au-dessus du contenu courant. Le contenu est generalement un AlertDialog.\n\nExemple :\n```dart\nFuture<void> confirmerSuppression(BuildContext context) async {\n  final bool? confirme = await showDialog<bool>(\n    context: context,\n    barrierDismissible: false,\n    builder: (ctx) => AlertDialog(\n      title: Text('Confirmer'),\n      content: Text('Voulez-vous vraiment supprimer ce patient ?'),\n      actions: [\n        TextButton(\n          onPressed: () => Navigator.pop(ctx, false),\n          child: Text('Annuler'),\n        ),\n        ElevatedButton(\n          onPressed: () => Navigator.pop(ctx, true),\n          child: Text('Supprimer'),\n        ),\n      ],\n    ),\n  );\n  if (confirme == true) {\n    // proceder a la suppression\n  }\n}\n```\n\nAlertContainer n'existe pas dans le framework Flutter.",
          "bareme": "+1pt"
        }
      ]
    },
    {
      "titre": "Sujet 2 - Examen de Session Normale - Session de Juin 2025",
      "source": "PROGRAMMATION MOBILE.pdf - Page 2 - Duree 1h30 - Niveau 3 Genie Logiciel/Software Eng. 2024-2025",
      "questions": [
        {
          "numero": "Exercice 1 - Q1",
          "enonce": "Que permet principalement le BuildContext dans Flutter ? A. D'obtenir les dimensions de l'ecran. B. D'acceder directement au MaterialApp. C. De stocker l'etat du widget. D. D'acceder a l'arbre de widgets parents et aux InheritedWidgets.",
          "correction": "Reponse correcte : D. D'acceder a l'arbre de widgets parents et aux InheritedWidgets.\n\nLe BuildContext est une reference a la position d'un widget dans l'arbre. Il permet de :\n- Remonter l'arbre pour trouver un ancetre (Theme.of(context), MediaQuery.of(context)).\n- Acceder aux InheritedWidgets (Provider, Theme, Localizations).\n- Naviguer (Navigator.of(context)).\n- Afficher des dialogues, snackbars (ScaffoldMessenger.of(context)).\n\nIl ne stocke PAS l'etat (c'est le role du State).\nExemple :\n```dart\nWidget build(BuildContext context) {\n  final theme = Theme.of(context);\n  final taille = MediaQuery.of(context).size;\n  return Container(\n    color: theme.primaryColor,\n    width: taille.width * 0.5,\n  );\n}\n```",
          "bareme": "+1pt / -1pt"
        },
        {
          "numero": "Exercice 1 - Q2",
          "enonce": "Quelle est la bonne maniere de rendre un widget immuable avec etat partage ? A. Utiliser un StatefulWidget avec des variables globales. B. Utiliser un StatelessWidget et setState. C. Utiliser un Provider combine a ChangeNotifier. D. Utiliser un StatelessWidget avec un Provider externe.",
          "correction": "Reponse correcte : C. Utiliser un Provider combine a ChangeNotifier.\n\nUn widget immuable (StatelessWidget) ne peut pas gerer son propre etat. Pour partager un etat tout en gardant les widgets immuables, on utilise un gestionnaire d'etat externe : Provider + ChangeNotifier (ou Bloc, Riverpod).\n\nExemple :\n```dart\nclass CompteurModel extends ChangeNotifier {\n  int _valeur = 0;\n  int get valeur => _valeur;\n\n  void incrementer() {\n    _valeur++;\n    notifyListeners(); // notifie les widgets a l'ecoute\n  }\n}\n\n// main.dart\nvoid main() {\n  runApp(\n    ChangeNotifierProvider(\n      create: (_) => CompteurModel(),\n      child: MyApp(),\n    ),\n  );\n}\n\n// widget consommateur (Stateless)\nclass MonCompteur extends StatelessWidget {\n  @override\n  Widget build(BuildContext context) {\n    final model = context.watch<CompteurModel>();\n    return Column(\n      children: [\n        Text('${model.valeur}'),\n        ElevatedButton(\n          onPressed: () => context.read<CompteurModel>().incrementer(),\n          child: Text('+1'),\n        ),\n      ],\n    );\n  }\n}\n```\n\nB est faux (StatelessWidget n'a pas setState). A est mauvaise pratique. D est incomplet (sans ChangeNotifier, pas de mecanisme de notification).",
          "bareme": "+1pt / -1pt"
        },
        {
          "numero": "Exercice 1 - Q3",
          "enonce": "Lequel de ces widgets est le plus approprie pour afficher une liste infinie de donnees chargees dynamiquement ? A. ListView avec children. B. Column avec un for classique. C. GridView.count. D. ListView.builder.",
          "correction": "Reponse correcte : D. ListView.builder.\n\nListView.builder construit ses elements a la demande (lazy loading) : seuls les elements visibles sont instancies. C'est INDISPENSABLE pour des listes longues ou infinies (performances memoire).\n\nExemple avec pagination :\n```dart\nListView.builder(\n  itemCount: _articles.length + 1, // +1 pour le loader\n  itemBuilder: (context, index) {\n    if (index == _articles.length) {\n      _chargerPlus(); // declencher chargement page suivante\n      return Center(child: CircularProgressIndicator());\n    }\n    final article = _articles[index];\n    return ListTile(\n      leading: Image.network(article.image),\n      title: Text(article.titre),\n      subtitle: Text(article.resume),\n    );\n  },\n)\n```\n\nListView(children: [...]) construit TOUT en une fois (mauvais pour listes longues). Column n'est meme pas scrollable par defaut.",
          "bareme": "+1pt / -1pt"
        },
        {
          "numero": "Exercice 1 - Q4",
          "enonce": "Que fait exactement le mot-cle const dans la definition d'un widget ? A. Il empeche la modification des proprietes. B. Il rend le widget utilisable uniquement une fois. C. Il force l'evaluation paresseuse du widget. D. Il optimise les reconstructions en memorisant l'instance du widget.",
          "correction": "Reponse correcte : D. Il optimise les reconstructions en memorisant l'instance du widget.\n\nUn widget cree avec const est une instance constante a la compilation. Flutter peut detecter via l'operateur == que c'est exactement le meme widget qu'avant et SAUTER son rebuild (et celui de tout son sous-arbre).\n\nExemple :\n```dart\n// Avec const : tres optimise\nColumn(\n  children: const [\n    Text('Titre'),\n    SizedBox(height: 8),\n    Icon(Icons.star),\n  ],\n)\n\n// Sans const : l'instance est recreee a chaque build\nColumn(\n  children: [\n    Text('Titre'),\n    SizedBox(height: 8),\n    Icon(Icons.star),\n  ],\n)\n```\n\nUtiliser const systematiquement quand les valeurs sont connues a la compilation = gros gain de performance.",
          "bareme": "+1pt / -1pt"
        },
        {
          "numero": "Exercice 1 - Q5",
          "enonce": "Quel widget permet de capturer des evenements de gestuelle utilisateur de maniere fine ? A. Container, B. InkWell, C. GestureDetector, D. Listener.",
          "correction": "Reponse correcte : C. GestureDetector.\n\nGestureDetector reconnait des gestes complexes : onTap, onDoubleTap, onLongPress, onPanUpdate, onScaleStart/Update/End, onHorizontalDragUpdate, etc.\n\nExemple :\n```dart\nGestureDetector(\n  onTap: () => print('Tap'),\n  onDoubleTap: () => print('Double tap'),\n  onLongPress: () => print('Long press'),\n  onPanUpdate: (details) {\n    print('Glissement : dx=${details.delta.dx}');\n  },\n  child: Container(\n    width: 200, height: 200, color: Colors.amber,\n    child: Center(child: Text('Interagis avec moi')),\n  ),\n)\n```\n\n- InkWell ajoute un effet ripple Material mais avec moins de granularite.\n- Listener est encore plus bas niveau (pointer events bruts), mais ne reconnait pas les gestes composes.",
          "bareme": "+1pt / -1pt"
        },
        {
          "numero": "Exercice 1 - Q6",
          "enonce": "Dans le cadre de l'internationalisation, quel fichier contient les traductions localisees ? A. main.dart. B. pubspec.yaml. C. MaterialApp. D. .arb files (Application Resource Bundle).",
          "correction": "Reponse correcte : D. .arb files (Application Resource Bundle).\n\nLes fichiers .arb sont au format JSON et contiennent les traductions cle-valeur, generes/consommes par le package flutter_localizations + intl.\n\nExemple intl_fr.arb :\n```json\n{\n  \"@@locale\": \"fr\",\n  \"bonjour\": \"Bonjour {prenom}\",\n  \"@bonjour\": {\n    \"description\": \"Salutation\",\n    \"placeholders\": {\n      \"prenom\": {\"type\": \"String\"}\n    }\n  },\n  \"nbMessages\": \"{count, plural, =0{Aucun message} =1{1 message} other{{count} messages}}\"\n}\n```\n\nConfiguration pubspec.yaml :\n```yaml\nflutter:\n  generate: true\n\nflutter_intl:\n  enabled: true\n  arb_dir: lib/l10n\n```\n\nUsage :\n```dart\nText(AppLocalizations.of(context)!.bonjour('Marie'))\n```",
          "bareme": "+1pt / -1pt"
        },
        {
          "numero": "Exercice 1 - Q7",
          "enonce": "Quel package Flutter est recommande pour gerer les appels API REST avec serialisation JSON ? A. shared_preferences. B. flutter_bloc. C. flutter_localizations. D. dio.",
          "correction": "Reponse correcte : D. dio.\n\ndio est un client HTTP avance avec : interceptors (logs, auth automatique, refresh token), gestion fine des erreurs, FormData, telechargement avec progression, timeouts, cancellation, support natif JSON.\n\nExemple :\n```dart\nimport 'package:dio/dio.dart';\n\nclass ApiService {\n  final Dio _dio = Dio(BaseOptions(\n    baseUrl: 'https://api.example.com',\n    connectTimeout: Duration(seconds: 5),\n    receiveTimeout: Duration(seconds: 10),\n    headers: {'Content-Type': 'application/json'},\n  ));\n\n  ApiService() {\n    _dio.interceptors.add(InterceptorsWrapper(\n      onRequest: (options, handler) async {\n        final token = await _getToken();\n        if (token != null) options.headers['Authorization'] = 'Bearer $token';\n        handler.next(options);\n      },\n      onError: (e, handler) {\n        if (e.response?.statusCode == 401) _logout();\n        handler.next(e);\n      },\n    ));\n  }\n\n  Future<List<Patient>> getPatients() async {\n    final res = await _dio.get('/patients');\n    return (res.data as List).map((j) => Patient.fromJson(j)).toList();\n  }\n}\n```\n\nNote : le package http officiel marche aussi mais est plus basique. flutter_bloc est pour la gestion d'etat, pas REST.",
          "bareme": "+1pt / -1pt"
        },
        {
          "numero": "Exercice 1 - Q8",
          "enonce": "En utilisant le systeme de navigation 2.0, quel composant est fondamental pour gerer dynamiquement les routes ? A. Navigator.pushNamed. B. MaterialApp.routes. C. RouteObserver. D. RouterDelegate.",
          "correction": "Reponse correcte : D. RouterDelegate.\n\nDans Navigation 2.0 (Declarative Navigation), RouterDelegate est le composant central : il transforme l'etat de l'application en une pile de Pages declaratives. Il travaille avec RouteInformationParser (parsing URL) et BackButtonDispatcher.\n\nExemple simplifie :\n```dart\nclass MonRouterDelegate extends RouterDelegate<AppState>\n    with ChangeNotifier, PopNavigatorRouterDelegateMixin<AppState> {\n  @override\n  GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();\n\n  AppState _state = AppState.home;\n\n  void allerVersDetail(int id) {\n    _state = AppState.detail(id);\n    notifyListeners();\n  }\n\n  @override\n  Widget build(BuildContext context) {\n    return Navigator(\n      key: navigatorKey,\n      pages: [\n        MaterialPage(key: ValueKey('home'), child: HomeScreen()),\n        if (_state is AppStateDetail)\n          MaterialPage(\n            key: ValueKey('detail'),\n            child: DetailScreen(id: (_state as AppStateDetail).id),\n          ),\n      ],\n      onPopPage: (route, result) {\n        if (!route.didPop(result)) return false;\n        _state = AppState.home;\n        notifyListeners();\n        return true;\n      },\n    );\n  }\n\n  @override\n  Future<void> setNewRoutePath(AppState state) async {\n    _state = state;\n  }\n}\n```\n\nNote : la plupart des projets modernes utilisent go_router qui encapsule cette complexite.",
          "bareme": "+1pt / -1pt"
        },
        {
          "numero": "Exercice 1 - Q9",
          "enonce": "Quelle est la difference principale entre FutureBuilder et StreamBuilder ? A. FutureBuilder se rafraichit a chaque frame. B. StreamBuilder est moins performant. C. FutureBuilder ne fonctionne que dans StatefulWidget. D. StreamBuilder peut emettre plusieurs valeurs au fil du temps.",
          "correction": "Reponse correcte : D. StreamBuilder peut emettre plusieurs valeurs au fil du temps.\n\n- FutureBuilder : ecoute un Future (UNE seule valeur asynchrone, ex. requete HTTP).\n- StreamBuilder : ecoute un Stream (sequence de valeurs, ex. base de donnees temps reel Firestore, WebSocket, capteur).\n\nExemple FutureBuilder :\n```dart\nFutureBuilder<List<Patient>>(\n  future: api.getPatients(),\n  builder: (ctx, snapshot) {\n    if (snapshot.connectionState == ConnectionState.waiting) {\n      return CircularProgressIndicator();\n    }\n    if (snapshot.hasError) return Text('Erreur : ${snapshot.error}');\n    return ListView(\n      children: snapshot.data!.map((p) => Text(p.nom)).toList(),\n    );\n  },\n)\n```\n\nExemple StreamBuilder (capteur ou Firestore) :\n```dart\nStreamBuilder<QuerySnapshot>(\n  stream: FirebaseFirestore.instance.collection('messages')\n      .orderBy('date', descending: true).snapshots(),\n  builder: (ctx, snapshot) {\n    if (!snapshot.hasData) return CircularProgressIndicator();\n    return ListView(\n      children: snapshot.data!.docs.map((doc) {\n        return ListTile(title: Text(doc['texte']));\n      }).toList(),\n    );\n  },\n)\n```",
          "bareme": "+1pt / -1pt"
        },
        {
          "numero": "Exercice 1 - Q10",
          "enonce": "Quelle approche est recommandee pour gerer l'etat dans une application Flutter tres modulaire ? A. setState() dans chaque widget. B. InheritedWidget combine a des callbacks. C. ScopedModel. D. Riverpod ou Bloc.",
          "correction": "Reponse correcte : D. Riverpod ou Bloc.\n\nPour une grande application modulaire, on choisit une architecture qui :\n- Decoupe l'etat des widgets (testabilite).\n- Permet la composition (etats locaux ET globaux).\n- Offre du type-safety et de l'injection de dependances.\n\nRiverpod (succession evoluee de Provider) et Bloc/Cubit sont les deux standards modernes.\n\nExemple Riverpod :\n```dart\n// Definition du provider\nfinal patientsProvider = AsyncNotifierProvider<PatientsNotifier, List<Patient>>(\n  PatientsNotifier.new,\n);\n\nclass PatientsNotifier extends AsyncNotifier<List<Patient>> {\n  @override\n  Future<List<Patient>> build() async {\n    return ref.read(apiProvider).getPatients();\n  }\n\n  Future<void> ajouter(Patient p) async {\n    state = const AsyncLoading();\n    state = await AsyncValue.guard(() async {\n      await ref.read(apiProvider).createPatient(p);\n      return ref.read(apiProvider).getPatients();\n    });\n  }\n}\n\n// Consommateur\nclass PatientsScreen extends ConsumerWidget {\n  @override\n  Widget build(BuildContext context, WidgetRef ref) {\n    final asyncPatients = ref.watch(patientsProvider);\n    return asyncPatients.when(\n      loading: () => CircularProgressIndicator(),\n      error: (e, _) => Text('Erreur : $e'),\n      data: (list) => ListView(\n        children: list.map((p) => Text(p.nom)).toList(),\n      ),\n    );\n  }\n}\n```\n\nExemple Bloc :\n```dart\nclass CompteurCubit extends Cubit<int> {\n  CompteurCubit() : super(0);\n  void incrementer() => emit(state + 1);\n}\n\nBlocBuilder<CompteurCubit, int>(\n  builder: (ctx, valeur) => Text('$valeur'),\n)\n```\n\nA est non scalable, C (ScopedModel) est deprecie.",
          "bareme": "+1pt / -1pt"
        },
        {
          "numero": "Exercice 2",
          "enonce": "Programme a ecrire sur papier. Creez une interface d'accueil d'une application de presentation personnelle en Flutter. Cette interface simple doit etre dynamique, bien structuree et agreable visuellement. L'interface doit utiliser les widgets suivants : Scaffold (structure de base), AppBar contenant un titre centre (ex 'Mon Profil') et un logo/icone a gauche (via leading ou Icon), SafeArea (pour proteger le contenu des encoches/coins d'ecran), Image (affichee de maniere centree dans le body, image reseau ou locale), Container sous l'image contenant deux textes (un texte en gras pour le nom, un texte plus petit pour une courte bio ou statut), Divider (pour separer visuellement les sections, ce qui precede), Row avec Icons (pour representer des reseaux sociaux ou contacts), Padding ou SizedBox (pour gerer les espacements entre les elements).",
          "correction": "Solution complete :\n\n```dart\nimport 'package:flutter/material.dart';\n\nvoid main() => runApp(const MonProfilApp());\n\nclass MonProfilApp extends StatelessWidget {\n  const MonProfilApp({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return MaterialApp(\n      title: 'Mon Profil',\n      debugShowCheckedModeBanner: false,\n      theme: ThemeData(\n        primarySwatch: Colors.indigo,\n        useMaterial3: true,\n        scaffoldBackgroundColor: const Color(0xFFF5F7FB),\n      ),\n      home: const PageProfil(),\n    );\n  }\n}\n\nclass PageProfil extends StatelessWidget {\n  const PageProfil({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return Scaffold(\n      // 1. AppBar avec titre centre + logo a gauche\n      appBar: AppBar(\n        centerTitle: true,\n        leading: const Padding(\n          padding: EdgeInsets.all(8.0),\n          child: Icon(Icons.account_circle, size: 32),\n        ),\n        title: const Text(\n          'Mon Profil',\n          style: TextStyle(fontWeight: FontWeight.bold),\n        ),\n        backgroundColor: Colors.indigo,\n        foregroundColor: Colors.white,\n        elevation: 2,\n      ),\n\n      // 2. SafeArea pour proteger des encoches\n      body: SafeArea(\n        child: SingleChildScrollView(\n          padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),\n          child: Column(\n            crossAxisAlignment: CrossAxisAlignment.center,\n            children: [\n              // 3. Image centree (avatar circulaire)\n              Center(\n                child: ClipOval(\n                  child: Image.network(\n                    'https://i.pravatar.cc/200?img=12',\n                    width: 140,\n                    height: 140,\n                    fit: BoxFit.cover,\n                    errorBuilder: (_, __, ___) => const CircleAvatar(\n                      radius: 70,\n                      child: Icon(Icons.person, size: 70),\n                    ),\n                  ),\n                ),\n              ),\n              const SizedBox(height: 20),\n\n              // 4. Container sous l'image avec nom + bio\n              Container(\n                width: double.infinity,\n                padding: const EdgeInsets.all(16),\n                decoration: BoxDecoration(\n                  color: Colors.white,\n                  borderRadius: BorderRadius.circular(12),\n                  boxShadow: [\n                    BoxShadow(\n                      color: Colors.black.withOpacity(0.05),\n                      blurRadius: 8,\n                      offset: const Offset(0, 4),\n                    ),\n                  ],\n                ),\n                child: Column(\n                  children: const [\n                    Text(\n                      '[Your Name]',\n                      style: TextStyle(\n                        fontSize: 22,\n                        fontWeight: FontWeight.bold,\n                        color: Colors.indigo,\n                      ),\n                    ),\n                    SizedBox(height: 6),\n                    Text(\n                      'Etudiant en Genie Logiciel - Niveau 3 - Passionne par Flutter et le cloud.',\n                      textAlign: TextAlign.center,\n                      style: TextStyle(\n                        fontSize: 14,\n                        color: Colors.black54,\n                      ),\n                    ),\n                  ],\n                ),\n              ),\n              const SizedBox(height: 24),\n\n              // 5. Divider pour separer les sections\n              const Divider(thickness: 1, color: Colors.grey),\n              const SizedBox(height: 16),\n\n              // Titre de section\n              const Padding(\n                padding: EdgeInsets.only(bottom: 12),\n                child: Text(\n                  'Mes reseaux',\n                  style: TextStyle(\n                    fontSize: 18,\n                    fontWeight: FontWeight.w600,\n                  ),\n                ),\n              ),\n\n              // 6. Row avec icones reseaux sociaux\n              Row(\n                mainAxisAlignment: MainAxisAlignment.spaceEvenly,\n                children: [\n                  _IconeReseau(\n                    icon: Icons.facebook,\n                    color: Colors.blue.shade800,\n                    label: 'Facebook',\n                  ),\n                  _IconeReseau(\n                    icon: Icons.alternate_email,\n                    color: Colors.lightBlue,\n                    label: 'Twitter',\n                  ),\n                  _IconeReseau(\n                    icon: Icons.business_center,\n                    color: Colors.blue.shade900,\n                    label: 'LinkedIn',\n                  ),\n                  _IconeReseau(\n                    icon: Icons.email,\n                    color: Colors.red,\n                    label: 'Email',\n                  ),\n                ],\n              ),\n            ],\n          ),\n        ),\n      ),\n    );\n  }\n}\n\nclass _IconeReseau extends StatelessWidget {\n  final IconData icon;\n  final Color color;\n  final String label;\n\n  const _IconeReseau({\n    required this.icon,\n    required this.color,\n    required this.label,\n  });\n\n  @override\n  Widget build(BuildContext context) {\n    return Padding(\n      padding: const EdgeInsets.all(4.0),\n      child: Column(\n        children: [\n          CircleAvatar(\n            radius: 24,\n            backgroundColor: color.withOpacity(0.15),\n            child: Icon(icon, color: color, size: 26),\n          ),\n          const SizedBox(height: 6),\n          Text(label, style: const TextStyle(fontSize: 11)),\n        ],\n      ),\n    );\n  }\n}\n```\n\nPoints cles a justifier a l'oral :\n- Scaffold structure tout l'ecran.\n- SafeArea evite que le contenu passe sous le notch/status bar.\n- SingleChildScrollView permet a la page de defiler si l'ecran est petit.\n- ClipOval rend l'image circulaire.\n- Container avec BoxDecoration apporte un look 'card' moderne.\n- Divider separe visuellement.\n- Row + MainAxisAlignment.spaceEvenly distribue les 4 icones uniformement.\n- Code reutilisable grace au sous-widget _IconeReseau.\n- Les SizedBox et Padding assurent les espacements coherents.",
          "bareme": "10 pts"
        }
      ]
    },
    {
      "titre": "Sujet 3 (Probable) - Travaux Pratiques : Application TodoList avec persistance et navigation",
      "source": "Sujet plausible bati sur le cours - Niveau 3 GL",
      "questions": [
        {
          "numero": "1",
          "enonce": "Creez un modele Dart 'Tache' avec les champs id (String), titre (String), description (String?), termine (bool), dateCreation (DateTime). Implementez les methodes toJson() et fromJson() permettant sa serialisation pour stockage local.",
          "correction": "```dart\nclass Tache {\n  final String id;\n  String titre;\n  String? description;\n  bool termine;\n  final DateTime dateCreation;\n\n  Tache({\n    required this.id,\n    required this.titre,\n    this.description,\n    this.termine = false,\n    DateTime? dateCreation,\n  }) : dateCreation = dateCreation ?? DateTime.now();\n\n  // Conversion vers JSON (pour stockage)\n  Map<String, dynamic> toJson() => {\n        'id': id,\n        'titre': titre,\n        'description': description,\n        'termine': termine,\n        'dateCreation': dateCreation.toIso8601String(),\n      };\n\n  // Reconstruction depuis JSON\n  factory Tache.fromJson(Map<String, dynamic> json) => Tache(\n        id: json['id'] as String,\n        titre: json['titre'] as String,\n        description: json['description'] as String?,\n        termine: json['termine'] as bool? ?? false,\n        dateCreation: DateTime.parse(json['dateCreation'] as String),\n      );\n\n  // Copie immutable\n  Tache copyWith({\n    String? titre,\n    String? description,\n    bool? termine,\n  }) {\n    return Tache(\n      id: id,\n      titre: titre ?? this.titre,\n      description: description ?? this.description,\n      termine: termine ?? this.termine,\n      dateCreation: dateCreation,\n    );\n  }\n\n  @override\n  String toString() => 'Tache($id, $titre, termine=$termine)';\n}\n```\n\nExplications :\n- L'id est genere a la creation (souvent via Uuid().v4()).\n- DateTime est serialise en ISO 8601 (standard interoperable).\n- copyWith permet la mise a jour immutable (recommandee avec Riverpod/Bloc).",
          "bareme": "4 pts"
        },
        {
          "numero": "2",
          "enonce": "Implementez un service TacheService base sur SharedPreferences qui permet d'ajouter, supprimer, basculer le statut termine et lister toutes les taches stockees localement.",
          "correction": "```dart\nimport 'dart:convert';\nimport 'package:shared_preferences/shared_preferences.dart';\n\nclass TacheService {\n  static const String _cle = 'taches_v1';\n\n  // Lecture\n  Future<List<Tache>> listerToutes() async {\n    final prefs = await SharedPreferences.getInstance();\n    final raw = prefs.getString(_cle);\n    if (raw == null || raw.isEmpty) return [];\n    final List<dynamic> liste = jsonDecode(raw) as List<dynamic>;\n    return liste\n        .map((e) => Tache.fromJson(e as Map<String, dynamic>))\n        .toList();\n  }\n\n  // Persistance interne\n  Future<void> _persister(List<Tache> taches) async {\n    final prefs = await SharedPreferences.getInstance();\n    final raw = jsonEncode(taches.map((t) => t.toJson()).toList());\n    await prefs.setString(_cle, raw);\n  }\n\n  // Ajout\n  Future<void> ajouter(Tache t) async {\n    final taches = await listerToutes();\n    taches.add(t);\n    await _persister(taches);\n  }\n\n  // Suppression\n  Future<void> supprimer(String id) async {\n    final taches = await listerToutes();\n    taches.removeWhere((t) => t.id == id);\n    await _persister(taches);\n  }\n\n  // Bascule statut\n  Future<void> basculerTermine(String id) async {\n    final taches = await listerToutes();\n    final index = taches.indexWhere((t) => t.id == id);\n    if (index == -1) return;\n    taches[index] = taches[index].copyWith(termine: !taches[index].termine);\n    await _persister(taches);\n  }\n\n  // Mise a jour\n  Future<void> mettreAJour(Tache tache) async {\n    final taches = await listerToutes();\n    final index = taches.indexWhere((t) => t.id == tache.id);\n    if (index == -1) return;\n    taches[index] = tache;\n    await _persister(taches);\n  }\n\n  // Effacer tout\n  Future<void> effacerTout() async {\n    final prefs = await SharedPreferences.getInstance();\n    await prefs.remove(_cle);\n  }\n}\n```\n\nBonnes pratiques observees :\n- Versioning de la cle (_v1) pour gerer les migrations futures.\n- Une seule source de verite : on relit, on modifie, on persiste.\n- Methode privee _persister evite la duplication.\n- jsonEncode/jsonDecode pour la (de)serialisation.",
          "bareme": "6 pts"
        },
        {
          "numero": "3",
          "enonce": "Construisez l'ecran principal ListeTachesScreen affichant les taches sous forme de ListView avec : un FAB pour ajouter, une checkbox pour basculer le statut, un swipe-to-delete (Dismissible), un message centre 'Aucune tache' si la liste est vide.",
          "correction": "```dart\nimport 'package:flutter/material.dart';\nimport 'package:uuid/uuid.dart';\n\nclass ListeTachesScreen extends StatefulWidget {\n  const ListeTachesScreen({super.key});\n  @override\n  State<ListeTachesScreen> createState() => _ListeTachesScreenState();\n}\n\nclass _ListeTachesScreenState extends State<ListeTachesScreen> {\n  final TacheService _service = TacheService();\n  List<Tache> _taches = [];\n  bool _chargement = true;\n\n  @override\n  void initState() {\n    super.initState();\n    _charger();\n  }\n\n  Future<void> _charger() async {\n    setState(() => _chargement = true);\n    final taches = await _service.listerToutes();\n    setState(() {\n      _taches = taches;\n      _chargement = false;\n    });\n  }\n\n  Future<void> _ajouter() async {\n    final controller = TextEditingController();\n    final ok = await showDialog<bool>(\n      context: context,\n      builder: (ctx) => AlertDialog(\n        title: const Text('Nouvelle tache'),\n        content: TextField(\n          controller: controller,\n          autofocus: true,\n          decoration: const InputDecoration(labelText: 'Titre'),\n        ),\n        actions: [\n          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Annuler')),\n          ElevatedButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Ajouter')),\n        ],\n      ),\n    );\n    if (ok == true && controller.text.trim().isNotEmpty) {\n      await _service.ajouter(Tache(\n        id: const Uuid().v4(),\n        titre: controller.text.trim(),\n      ));\n      _charger();\n    }\n  }\n\n  @override\n  Widget build(BuildContext context) {\n    return Scaffold(\n      appBar: AppBar(title: const Text('Mes taches')),\n      floatingActionButton: FloatingActionButton(\n        onPressed: _ajouter,\n        child: const Icon(Icons.add),\n      ),\n      body: _chargement\n          ? const Center(child: CircularProgressIndicator())\n          : _taches.isEmpty\n              ? const Center(\n                  child: Column(\n                    mainAxisSize: MainAxisSize.min,\n                    children: [\n                      Icon(Icons.inbox, size: 80, color: Colors.grey),\n                      SizedBox(height: 12),\n                      Text('Aucune tache', style: TextStyle(fontSize: 18)),\n                    ],\n                  ),\n                )\n              : ListView.builder(\n                  itemCount: _taches.length,\n                  itemBuilder: (ctx, i) {\n                    final t = _taches[i];\n                    return Dismissible(\n                      key: ValueKey(t.id),\n                      direction: DismissDirection.endToStart,\n                      background: Container(\n                        color: Colors.red,\n                        alignment: Alignment.centerRight,\n                        padding: const EdgeInsets.symmetric(horizontal: 20),\n                        child: const Icon(Icons.delete, color: Colors.white),\n                      ),\n                      onDismissed: (_) async {\n                        await _service.supprimer(t.id);\n                        setState(() => _taches.removeAt(i));\n                        ScaffoldMessenger.of(context).showSnackBar(\n                          SnackBar(content: Text('${t.titre} supprimee')),\n                        );\n                      },\n                      child: CheckboxListTile(\n                        title: Text(\n                          t.titre,\n                          style: TextStyle(\n                            decoration: t.termine ? TextDecoration.lineThrough : null,\n                            color: t.termine ? Colors.grey : null,\n                          ),\n                        ),\n                        subtitle: t.description != null ? Text(t.description!) : null,\n                        value: t.termine,\n                        onChanged: (_) async {\n                          await _service.basculerTermine(t.id);\n                          _charger();\n                        },\n                      ),\n                    );\n                  },\n                ),\n    );\n  }\n}\n```\n\nPoints pedagogiques :\n- initState declenche le chargement initial.\n- Dismissible exige un Key unique : ValueKey(t.id).\n- CheckboxListTile combine elegamment checkbox + texte.\n- ScaffoldMessenger.showSnackBar pour le feedback utilisateur (Material 3).\n- Le rechargement complet apres modification est simple ; un Provider+ChangeNotifier serait plus optimise en production.",
          "bareme": "10 pts"
        }
      ]
    },
    {
      "titre": "Sujet 4 (Probable) - Examen theorique : Architecture, Firebase et concepts avances",
      "source": "Sujet plausible bati sur le cours - Niveau 3 GL",
      "questions": [
        {
          "numero": "1",
          "enonce": "Expliquez la difference fondamentale entre StatelessWidget et StatefulWidget. Quand utiliser l'un plutot que l'autre ? Donnez un exemple de chacun.",
          "correction": "StatelessWidget :\n- N'a pas d'etat mutable interne.\n- Ses proprietes (champs final) sont fixees a la construction.\n- Sa methode build() est pure : meme entree = meme sortie.\n- Plus performant et plus simple a tester.\n- A utiliser pour : composants d'affichage, textes statiques, mises en page sans interaction qui change l'apparence.\n\nStatefulWidget :\n- Possede un objet State separe, qui contient des variables mutables.\n- L'etat persiste entre les rebuilds du widget.\n- Cycle de vie complet : initState, didChangeDependencies, build, didUpdateWidget, dispose.\n- A utiliser pour : formulaires, animations, controllers (TextEditingController, ScrollController), donnees chargees apres construction.\n\nExemple Stateless :\n```dart\nclass Salutation extends StatelessWidget {\n  final String prenom;\n  const Salutation({super.key, required this.prenom});\n\n  @override\n  Widget build(BuildContext context) {\n    return Text('Bonjour, $prenom !');\n  }\n}\n```\n\nExemple Stateful :\n```dart\nclass Compteur extends StatefulWidget {\n  const Compteur({super.key});\n  @override\n  State<Compteur> createState() => _CompteurState();\n}\n\nclass _CompteurState extends State<Compteur> {\n  int _valeur = 0;\n\n  void _incrementer() => setState(() => _valeur++);\n\n  @override\n  Widget build(BuildContext context) {\n    return Column(\n      children: [\n        Text('$_valeur', style: const TextStyle(fontSize: 40)),\n        ElevatedButton(onPressed: _incrementer, child: const Text('+1')),\n      ],\n    );\n  }\n}\n```\n\nRegle pratique : commencer toujours en Stateless ; passer en Stateful uniquement si necessaire (ou utiliser un gestionnaire d'etat externe).",
          "bareme": "4 pts"
        },
        {
          "numero": "2",
          "enonce": "Decrivez les etapes pour integrer Firebase Authentication (email/password) dans une application Flutter. Donnez le code complet d'un service AuthService avec les methodes signUp, signIn, signOut, et un Stream d'etat de connexion.",
          "correction": "Etapes :\n1. Creer un projet Firebase sur console.firebase.google.com.\n2. Ajouter une app Android (package name) et iOS (bundle id), telecharger google-services.json (Android) et GoogleService-Info.plist (iOS).\n3. Installer FlutterFire CLI : `dart pub global activate flutterfire_cli`.\n4. Configurer : `flutterfire configure` (cela genere firebase_options.dart).\n5. Ajouter dans pubspec.yaml :\n```yaml\ndependencies:\n  firebase_core: ^2.24.0\n  firebase_auth: ^4.15.0\n```\n6. Initialiser dans main :\n```dart\nvoid main() async {\n  WidgetsFlutterBinding.ensureInitialized();\n  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);\n  runApp(MyApp());\n}\n```\n7. Activer 'Email/Password' dans Firebase Console > Authentication > Sign-in method.\n\nService complet :\n```dart\nimport 'package:firebase_auth/firebase_auth.dart';\n\nclass AuthService {\n  final FirebaseAuth _auth = FirebaseAuth.instance;\n\n  // Utilisateur courant (synchrone)\n  User? get utilisateurCourant => _auth.currentUser;\n\n  // Flux d'etat (utile pour StreamBuilder dans main)\n  Stream<User?> get etatAuth => _auth.authStateChanges();\n\n  // Inscription\n  Future<User?> sInscrire({\n    required String email,\n    required String motDePasse,\n    required String nom,\n  }) async {\n    try {\n      final cred = await _auth.createUserWithEmailAndPassword(\n        email: email.trim(),\n        password: motDePasse,\n      );\n      await cred.user?.updateDisplayName(nom);\n      await cred.user?.sendEmailVerification();\n      return cred.user;\n    } on FirebaseAuthException catch (e) {\n      throw _traduireErreur(e);\n    }\n  }\n\n  // Connexion\n  Future<User?> seConnecter({\n    required String email,\n    required String motDePasse,\n  }) async {\n    try {\n      final cred = await _auth.signInWithEmailAndPassword(\n        email: email.trim(),\n        password: motDePasse,\n      );\n      return cred.user;\n    } on FirebaseAuthException catch (e) {\n      throw _traduireErreur(e);\n    }\n  }\n\n  // Reinitialisation mot de passe\n  Future<void> reinitialiserMotDePasse(String email) async {\n    await _auth.sendPasswordResetEmail(email: email.trim());\n  }\n\n  // Deconnexion\n  Future<void> seDeconnecter() => _auth.signOut();\n\n  // Traduction des erreurs en francais\n  String _traduireErreur(FirebaseAuthException e) {\n    switch (e.code) {\n      case 'user-not-found':\n        return 'Aucun utilisateur avec cet email.';\n      case 'wrong-password':\n        return 'Mot de passe incorrect.';\n      case 'email-already-in-use':\n        return 'Cet email est deja utilise.';\n      case 'weak-password':\n        return 'Mot de passe trop faible (min 6 caracteres).';\n      case 'invalid-email':\n        return 'Format d email invalide.';\n      case 'network-request-failed':\n        return 'Erreur reseau, verifiez votre connexion.';\n      default:\n        return e.message ?? 'Erreur inconnue.';\n    }\n  }\n}\n```\n\nUsage dans main pour redirection automatique :\n```dart\nclass MyApp extends StatelessWidget {\n  @override\n  Widget build(BuildContext context) {\n    return MaterialApp(\n      home: StreamBuilder<User?>(\n        stream: AuthService().etatAuth,\n        builder: (ctx, snapshot) {\n          if (snapshot.connectionState == ConnectionState.waiting) {\n            return const Scaffold(body: Center(child: CircularProgressIndicator()));\n          }\n          return snapshot.data == null ? LoginScreen() : HomeScreen();\n        },\n      ),\n    );\n  }\n}\n```",
          "bareme": "6 pts"
        },
        {
          "numero": "3",
          "enonce": "Quelle est la difference entre async/await et l'utilisation de .then() pour les Futures en Dart ? Donnez un exemple concret de gestion d'erreurs avec try/catch.",
          "correction": "async/await :\n- Syntaxe declarative, code lineaire qui se lit comme du synchrone.\n- Permet d'utiliser try/catch standard pour les erreurs.\n- Plus facile a deboguer (pile d'appels reelle).\n- Permet d'enchainer plusieurs operations asynchrones sans imbrication.\n\n.then() :\n- Approche par callback (style Promise JavaScript).\n- Necessite .catchError() pour les erreurs.\n- Devient illisible avec plusieurs operations enchainees ('callback hell').\n- Utile pour des operations simples one-shot ou dans du code non-async.\n\nExemple avec then (verbeux) :\n```dart\nvoid chargerProfil() {\n  api.getUtilisateur().then((user) {\n    api.getMessages(user.id).then((msgs) {\n      print('${msgs.length} messages');\n    }).catchError((e) => print('Erreur messages : $e'));\n  }).catchError((e) => print('Erreur user : $e'));\n}\n```\n\nMeme code en async/await (clair et concis) :\n```dart\nFuture<void> chargerProfil() async {\n  try {\n    final user = await api.getUtilisateur();\n    final msgs = await api.getMessages(user.id);\n    print('${msgs.length} messages');\n  } on TimeoutException {\n    print('Delai depasse, reessayez.');\n  } on FormatException catch (e) {\n    print('Donnees mal formees : ${e.message}');\n  } catch (e, stack) {\n    print('Erreur inattendue : $e');\n    print(stack);\n  } finally {\n    print('Tentative de chargement terminee');\n  }\n}\n```\n\nA noter :\n- 'on Type catch' permet d'attraper un type d'erreur specifique.\n- 'catch (e, stack)' donne acces a la stack trace.\n- 'finally' s'execute toujours (utile pour fermer un loader).\n- Une fonction async retourne TOUJOURS un Future ; await ne fonctionne que dans une fonction async.\n- Future.wait permet de paralleliser plusieurs futures independants : `final [a, b] = await Future.wait([futA, futB]);`.",
          "bareme": "5 pts"
        }
      ]
    },
    {
      "titre": "Sujet 5 (Probable) - TP : Navigation, Formulaires et appel API REST",
      "source": "Sujet plausible bati sur le cours - Niveau 3 GL",
      "questions": [
        {
          "numero": "1",
          "enonce": "Implementez une navigation entre deux ecrans avec passage d'argument : un ecran liste produits et un ecran detail. Utilisez Navigator.push et Navigator.pop pour retourner une valeur (note donnee par l'utilisateur).",
          "correction": "```dart\nimport 'package:flutter/material.dart';\n\nclass Produit {\n  final int id;\n  final String nom;\n  final double prix;\n  Produit(this.id, this.nom, this.prix);\n}\n\nclass ListeProduitsScreen extends StatefulWidget {\n  const ListeProduitsScreen({super.key});\n  @override\n  State<ListeProduitsScreen> createState() => _ListeProduitsScreenState();\n}\n\nclass _ListeProduitsScreenState extends State<ListeProduitsScreen> {\n  final List<Produit> _produits = [\n    Produit(1, 'Ordinateur portable', 450000),\n    Produit(2, 'Smartphone', 180000),\n    Produit(3, 'Casque audio', 25000),\n  ];\n  final Map<int, double> _notes = {};\n\n  Future<void> _ouvrirDetail(Produit p) async {\n    final double? note = await Navigator.push<double>(\n      context,\n      MaterialPageRoute(\n        builder: (_) => DetailProduitScreen(produit: p),\n      ),\n    );\n    if (note != null) {\n      setState(() => _notes[p.id] = note);\n      ScaffoldMessenger.of(context).showSnackBar(\n        SnackBar(content: Text('Note de ${p.nom} : $note/5')),\n      );\n    }\n  }\n\n  @override\n  Widget build(BuildContext context) {\n    return Scaffold(\n      appBar: AppBar(title: const Text('Produits')),\n      body: ListView.builder(\n        itemCount: _produits.length,\n        itemBuilder: (_, i) {\n          final p = _produits[i];\n          return ListTile(\n            leading: const Icon(Icons.shopping_bag),\n            title: Text(p.nom),\n            subtitle: Text('${p.prix.toStringAsFixed(0)} FCFA'),\n            trailing: _notes[p.id] != null\n                ? Chip(label: Text('${_notes[p.id]}/5'))\n                : const Icon(Icons.chevron_right),\n            onTap: () => _ouvrirDetail(p),\n          );\n        },\n      ),\n    );\n  }\n}\n\nclass DetailProduitScreen extends StatefulWidget {\n  final Produit produit;\n  const DetailProduitScreen({super.key, required this.produit});\n  @override\n  State<DetailProduitScreen> createState() => _DetailProduitScreenState();\n}\n\nclass _DetailProduitScreenState extends State<DetailProduitScreen> {\n  double _note = 3;\n\n  @override\n  Widget build(BuildContext context) {\n    final p = widget.produit;\n    return Scaffold(\n      appBar: AppBar(title: Text(p.nom)),\n      body: Padding(\n        padding: const EdgeInsets.all(20),\n        child: Column(\n          crossAxisAlignment: CrossAxisAlignment.stretch,\n          children: [\n            Text(p.nom, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),\n            const SizedBox(height: 8),\n            Text('Prix : ${p.prix.toStringAsFixed(0)} FCFA',\n                style: const TextStyle(fontSize: 18, color: Colors.green)),\n            const SizedBox(height: 32),\n            const Text('Votre note :', style: TextStyle(fontSize: 16)),\n            Slider(\n              value: _note,\n              min: 0,\n              max: 5,\n              divisions: 10,\n              label: _note.toStringAsFixed(1),\n              onChanged: (v) => setState(() => _note = v),\n            ),\n            const SizedBox(height: 24),\n            ElevatedButton.icon(\n              icon: const Icon(Icons.check),\n              label: const Text('Valider et revenir'),\n              onPressed: () => Navigator.pop(context, _note),\n            ),\n            const SizedBox(height: 8),\n            OutlinedButton(\n              onPressed: () => Navigator.pop(context),\n              child: const Text('Annuler'),\n            ),\n          ],\n        ),\n      ),\n    );\n  }\n}\n```\n\nConcepts cles :\n- `Navigator.push<T>` est typee : T est le type de la valeur attendue au retour.\n- `Navigator.pop(context, valeur)` renvoie la valeur a l'ecran appelant.\n- L'ecran appelant utilise `await` pour recevoir cette valeur.\n- Toujours verifier `if (note != null)` car l'utilisateur peut faire 'retour' (bouton systeme) sans valider.",
          "bareme": "5 pts"
        },
        {
          "numero": "2",
          "enonce": "Creez un formulaire d'inscription avec validation : champs nom, email, mot de passe (min 6 caracteres avec au moins 1 chiffre), confirmation mot de passe. Affichez un message de succes en bas de l'ecran a la soumission.",
          "correction": "```dart\nimport 'package:flutter/material.dart';\n\nclass InscriptionScreen extends StatefulWidget {\n  const InscriptionScreen({super.key});\n  @override\n  State<InscriptionScreen> createState() => _InscriptionScreenState();\n}\n\nclass _InscriptionScreenState extends State<InscriptionScreen> {\n  final _formKey = GlobalKey<FormState>();\n  final _nomCtrl = TextEditingController();\n  final _emailCtrl = TextEditingController();\n  final _mdpCtrl = TextEditingController();\n  final _confirmCtrl = TextEditingController();\n  bool _obscure = true;\n  bool _envoiEnCours = false;\n\n  @override\n  void dispose() {\n    _nomCtrl.dispose();\n    _emailCtrl.dispose();\n    _mdpCtrl.dispose();\n    _confirmCtrl.dispose();\n    super.dispose();\n  }\n\n  // --- Validateurs ---\n  String? _validNom(String? v) {\n    if (v == null || v.trim().isEmpty) return 'Le nom est obligatoire';\n    if (v.trim().length < 2) return 'Au moins 2 caracteres';\n    return null;\n  }\n\n  String? _validEmail(String? v) {\n    if (v == null || v.trim().isEmpty) return 'Email obligatoire';\n    final regex = RegExp(r'^[\\w.+-]+@[\\w-]+\\.[\\w.-]+\\$');\n    if (!regex.hasMatch(v.trim())) return 'Format invalide';\n    return null;\n  }\n\n  String? _validMdp(String? v) {\n    if (v == null || v.isEmpty) return 'Mot de passe obligatoire';\n    if (v.length < 6) return 'Au moins 6 caracteres';\n    if (!RegExp(r'\\d').hasMatch(v)) return 'Doit contenir au moins 1 chiffre';\n    return null;\n  }\n\n  String? _validConfirm(String? v) {\n    if (v != _mdpCtrl.text) return 'Les mots de passe ne correspondent pas';\n    return null;\n  }\n\n  Future<void> _soumettre() async {\n    if (!_formKey.currentState!.validate()) return;\n    setState(() => _envoiEnCours = true);\n    // Simulation d'envoi reseau\n    await Future.delayed(const Duration(seconds: 2));\n    setState(() => _envoiEnCours = false);\n\n    if (!mounted) return;\n    ScaffoldMessenger.of(context).showSnackBar(\n      SnackBar(\n        content: Text('Bienvenue ${_nomCtrl.text} ! Inscription reussie.'),\n        backgroundColor: Colors.green,\n        behavior: SnackBarBehavior.floating,\n      ),\n    );\n    _formKey.currentState!.reset();\n  }\n\n  @override\n  Widget build(BuildContext context) {\n    return Scaffold(\n      appBar: AppBar(title: const Text('Inscription')),\n      body: SingleChildScrollView(\n        padding: const EdgeInsets.all(20),\n        child: Form(\n          key: _formKey,\n          autovalidateMode: AutovalidateMode.onUserInteraction,\n          child: Column(\n            children: [\n              TextFormField(\n                controller: _nomCtrl,\n                decoration: const InputDecoration(\n                  labelText: 'Nom complet',\n                  prefixIcon: Icon(Icons.person),\n                  border: OutlineInputBorder(),\n                ),\n                validator: _validNom,\n                textInputAction: TextInputAction.next,\n              ),\n              const SizedBox(height: 16),\n              TextFormField(\n                controller: _emailCtrl,\n                decoration: const InputDecoration(\n                  labelText: 'Email',\n                  prefixIcon: Icon(Icons.email),\n                  border: OutlineInputBorder(),\n                ),\n                keyboardType: TextInputType.emailAddress,\n                validator: _validEmail,\n                textInputAction: TextInputAction.next,\n              ),\n              const SizedBox(height: 16),\n              TextFormField(\n                controller: _mdpCtrl,\n                decoration: InputDecoration(\n                  labelText: 'Mot de passe',\n                  prefixIcon: const Icon(Icons.lock),\n                  border: const OutlineInputBorder(),\n                  suffixIcon: IconButton(\n                    icon: Icon(_obscure ? Icons.visibility : Icons.visibility_off),\n                    onPressed: () => setState(() => _obscure = !_obscure),\n                  ),\n                ),\n                obscureText: _obscure,\n                validator: _validMdp,\n              ),\n              const SizedBox(height: 16),\n              TextFormField(\n                controller: _confirmCtrl,\n                decoration: const InputDecoration(\n                  labelText: 'Confirmer le mot de passe',\n                  prefixIcon: Icon(Icons.lock_outline),\n                  border: OutlineInputBorder(),\n                ),\n                obscureText: _obscure,\n                validator: _validConfirm,\n              ),\n              const SizedBox(height: 28),\n              SizedBox(\n                width: double.infinity,\n                height: 48,\n                child: ElevatedButton(\n                  onPressed: _envoiEnCours ? null : _soumettre,\n                  child: _envoiEnCours\n                      ? const SizedBox(\n                          width: 22, height: 22,\n                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),\n                        )\n                      : const Text('S inscrire', style: TextStyle(fontSize: 16)),\n                ),\n              ),\n            ],\n          ),\n        ),\n      ),\n    );\n  }\n}\n```\n\nElements pedagogiques :\n- `GlobalKey<FormState>` permet d'appeler validate() et reset().\n- autovalidateMode.onUserInteraction valide au fur et a mesure de la saisie.\n- TextInputAction.next ameliore le passage clavier entre champs.\n- Verification `if (!mounted)` apres await pour eviter d'utiliser context apres dispose.\n- Le bouton est desactive pendant l'envoi (onPressed: null).\n- SnackBarBehavior.floating donne un visuel moderne.",
          "bareme": "7 pts"
        },
        {
          "numero": "3",
          "enonce": "Ecrivez un service ApiClient qui consomme l'API publique https://jsonplaceholder.typicode.com/users en utilisant le package http. Le service doit retourner une liste d'objets Utilisateur typee, gerer les erreurs (timeout, code != 200, JSON malforme) et etre integre dans un FutureBuilder dans un widget UsersScreen.",
          "correction": "```dart\n// pubspec.yaml\n// dependencies:\n//   http: ^1.1.0\n\nimport 'dart:convert';\nimport 'dart:io';\nimport 'package:flutter/material.dart';\nimport 'package:http/http.dart' as http;\n\n// ====================\n// Modele\n// ====================\nclass Utilisateur {\n  final int id;\n  final String nom;\n  final String email;\n  final String telephone;\n  final String ville;\n\n  Utilisateur({\n    required this.id,\n    required this.nom,\n    required this.email,\n    required this.telephone,\n    required this.ville,\n  });\n\n  factory Utilisateur.fromJson(Map<String, dynamic> j) => Utilisateur(\n        id: j['id'] as int,\n        nom: j['name'] as String,\n        email: j['email'] as String,\n        telephone: j['phone'] as String,\n        ville: (j['address'] as Map)['city'] as String,\n      );\n}\n\n// ====================\n// Exceptions metier\n// ====================\nclass ApiException implements Exception {\n  final String message;\n  final int? code;\n  ApiException(this.message, [this.code]);\n  @override\n  String toString() => 'ApiException($code) : $message';\n}\n\n// ====================\n// Service\n// ====================\nclass ApiClient {\n  static const String _baseUrl = 'https://jsonplaceholder.typicode.com';\n  final Duration timeout;\n\n  ApiClient({this.timeout = const Duration(seconds: 10)});\n\n  Future<List<Utilisateur>> getUtilisateurs() async {\n    final url = Uri.parse('\\$_baseUrl/users');\n    try {\n      final response = await http\n          .get(url, headers: {'Accept': 'application/json'})\n          .timeout(timeout);\n\n      if (response.statusCode != 200) {\n        throw ApiException(\n          'Echec de la requete (${response.statusCode})',\n          response.statusCode,\n        );\n      }\n\n      final List<dynamic> json = jsonDecode(response.body) as List<dynamic>;\n      return json\n          .map((e) => Utilisateur.fromJson(e as Map<String, dynamic>))\n          .toList();\n    } on SocketException {\n      throw ApiException('Pas de connexion internet');\n    } on HttpException {\n      throw ApiException('Probleme HTTP');\n    } on FormatException {\n      throw ApiException('Reponse JSON malformee');\n    } catch (e) {\n      throw ApiException('Erreur inattendue : \\$e');\n    }\n  }\n}\n\n// ====================\n// Widget\n// ====================\nclass UsersScreen extends StatefulWidget {\n  const UsersScreen({super.key});\n  @override\n  State<UsersScreen> createState() => _UsersScreenState();\n}\n\nclass _UsersScreenState extends State<UsersScreen> {\n  final ApiClient _api = ApiClient();\n  late Future<List<Utilisateur>> _future;\n\n  @override\n  void initState() {\n    super.initState();\n    _future = _api.getUtilisateurs();\n  }\n\n  Future<void> _rafraichir() async {\n    setState(() {\n      _future = _api.getUtilisateurs();\n    });\n    await _future;\n  }\n\n  @override\n  Widget build(BuildContext context) {\n    return Scaffold(\n      appBar: AppBar(\n        title: const Text('Utilisateurs'),\n        actions: [\n          IconButton(icon: const Icon(Icons.refresh), onPressed: _rafraichir),\n        ],\n      ),\n      body: RefreshIndicator(\n        onRefresh: _rafraichir,\n        child: FutureBuilder<List<Utilisateur>>(\n          future: _future,\n          builder: (ctx, snapshot) {\n            if (snapshot.connectionState == ConnectionState.waiting) {\n              return const Center(child: CircularProgressIndicator());\n            }\n            if (snapshot.hasError) {\n              return Center(\n                child: Padding(\n                  padding: const EdgeInsets.all(24),\n                  child: Column(\n                    mainAxisSize: MainAxisSize.min,\n                    children: [\n                      const Icon(Icons.error_outline, size: 64, color: Colors.red),\n                      const SizedBox(height: 12),\n                      Text('\\${snapshot.error}', textAlign: TextAlign.center),\n                      const SizedBox(height: 12),\n                      ElevatedButton(\n                        onPressed: _rafraichir,\n                        child: const Text('Reessayer'),\n                      ),\n                    ],\n                  ),\n                ),\n              );\n            }\n            final users = snapshot.data ?? [];\n            if (users.isEmpty) {\n              return const Center(child: Text('Aucun utilisateur'));\n            }\n            return ListView.separated(\n              itemCount: users.length,\n              separatorBuilder: (_, __) => const Divider(height: 1),\n              itemBuilder: (_, i) {\n                final u = users[i];\n                return ListTile(\n                  leading: CircleAvatar(child: Text(u.nom[0])),\n                  title: Text(u.nom),\n                  subtitle: Text('\\${u.email}\\n\\${u.ville}'),\n                  isThreeLine: true,\n                  trailing: IconButton(\n                    icon: const Icon(Icons.phone),\n                    onPressed: () => print('Appeler \\${u.telephone}'),\n                  ),\n                );\n              },\n            );\n          },\n        ),\n      ),\n    );\n  }\n}\n```\n\nBonnes pratiques mises en oeuvre :\n- Couches separees : Modele, Exceptions, Service, Widget.\n- Timeout configurable (par defaut 10s).\n- Catch typee (SocketException, FormatException) avec messages francais clairs.\n- RefreshIndicator pour pull-to-refresh.\n- Ecran d'erreur avec bouton 'Reessayer'.\n- ListView.separated pour les separateurs propres.\n- Stocker le Future dans une variable d'instance (pas dans build) pour eviter le re-fetch a chaque rebuild.",
          "bareme": "8 pts"
        }
      ]
    }
  ],
  "data": [
    {
      "titre": "Contrôle continu — Sources médias (60 individus, 4 thèmes × 3 médias)",
      "source": "Analyse de Données.pdf, durée 01h",
      "questions": [
        {
          "numero": "Énoncé",
          "enonce": "Tableau de contingence 4×3 : sources d'information (Journal/Radio/TV) sur 4 thèmes (PI, PR, FD, RS). Effectif total N=200.\n        Journal Radio  TV\n  PI      10    20    30\n  PR      10    30    20\n  FD      20    10    30\n  RS      20    30    10",
          "correction": "À traiter comme une ACP des 3 variables (Journal, Radio, TV) observées sur 4 individus (PI, PR, FD, RS)."
        },
        {
          "numero": "A",
          "enonce": "Calculer la moyenne et l'écart-type des variables. (2 pts)",
          "correction": "X1 (Journal) : moy = (10+10+20+20)/4 = 15. Variance = ((10-15)²×2 + (20-15)²×2)/4 = 100/4 = 25. σ1 = √25 = 5.\n\nX2 (Radio) : moy = (20+30+10+30)/4 = 22,5. Var = ((20-22,5)² + (30-22,5)² + (10-22,5)² + (30-22,5)²)/4 = (6,25+56,25+156,25+56,25)/4 = 68,75. σ2 ≈ 8,29.\n\nX3 (TV) : moy = (30+20+30+10)/4 = 22,5. Var = 68,75. σ3 ≈ 8,29."
        },
        {
          "numero": "B",
          "enonce": "Déterminer la Matrice Centrée Réduite (MCR). (2 pts)",
          "correction": "z_ij = (x_ij - μ_j) / σ_j\n\nMCR =\n[ -1,00   -0,30    0,90 ]\n[ -1,00    0,90   -0,30 ]\n[  1,00   -1,51    0,90 ]\n[  1,00    0,90   -1,51 ]"
        },
        {
          "numero": "C",
          "enonce": "Matrice des variances-covariances. (2 pts)",
          "correction": "Σ =\n[  25       -12,5    -12,5  ]\n[ -12,5      68,75   -56,25 ]\n[ -12,5     -56,25    68,75 ]\n\nCov(X1,X2) = ((-5)(-2,5)+(-5)(7,5)+(5)(-12,5)+(5)(7,5))/4 = -50/4 = -12,5\nCov(X2,X3) = (-225)/4 = -56,25"
        },
        {
          "numero": "D",
          "enonce": "Matrice des corrélations. (2 pts)",
          "correction": "ρ(Xj,Xk) = Cov(Xj,Xk) / (σj × σk)\n\nR =\n[  1,00   -0,30   -0,30 ]\n[ -0,30    1,00   -0,82 ]\n[ -0,30   -0,82    1,00 ]\n\nInterprétation : forte corrélation négative Radio/TV (-0,82) — un thème vu via radio l'est peu via TV."
        },
        {
          "numero": "E-F",
          "enonce": "Polynôme caractéristique + valeurs propres. (4 pts)",
          "correction": "P(λ) = det(R - λI) = λ³ - 3λ² + 2,1476λ - 0,1476 = 0\n\nContraintes : λ1 + λ2 + λ3 = tr(R) = 3 ; λ1·λ2·λ3 = det(R) = 0,1476.\n\nValeurs propres :\n  λ1 ≈ 1,90 (axe Radio vs TV)\n  λ2 ≈ 1,00 (axe Journal)\n  λ3 ≈ 0,10 (résidu)"
        },
        {
          "numero": "G",
          "enonce": "Inertie des axes factoriels. (2 pts)",
          "correction": "%inertie(k) = λk / Σλi\n\n%Axe1 = 1,90/3 ≈ 63,3 %\n%Axe2 = 1,00/3 ≈ 33,3 %\n%Axe3 = 0,10/3 ≈ 3,3 %\n\nCumul 2 axes = 96,6 % → projection 2D excellente."
        },
        {
          "numero": "H",
          "enonce": "Vecteurs propres orthogonaux. (2 pts)",
          "correction": "Résoudre (R - λI)·U = 0 avec ||U|| = 1.\n\nU1 ≈ (0,12 ; -0,70 ; 0,70) — oppose Radio (-) et TV (+)\nU2 ≈ (0,99 ; 0,07 ; 0,07) — porté par Journal\nU3 ≈ (0,05 ; 0,71 ; 0,70) — perpendiculaire\n\nVérification : U1·U2 ≈ 0, U1·U3 ≈ 0, U2·U3 ≈ 0."
        },
        {
          "numero": "I",
          "enonce": "Corrélation variables/composantes principales. (2 pts)",
          "correction": "corr(Xj, Ck) = √(λk) · Ukj\n\nAxe 1 (√1,90 ≈ 1,38) :\n  corr(Journal, C1) ≈ 0,17 ; corr(Radio, C1) ≈ -0,97 ; corr(TV, C1) ≈ 0,97\n\nAxe 2 (√1 = 1) :\n  corr(Journal, C2) ≈ 0,99 ; les autres ≈ 0\n\nInterprétation : axe 1 = média audio vs vidéo ; axe 2 = presse écrite."
        },
        {
          "numero": "J",
          "enonce": "Contribution CONTR des individus. (2 pts)",
          "correction": "CTR(i,k) = (zik)² / (n · λk) en %\n\nProjections sur axe 1 (Fk = MCR · Uk) :\n  PI ≈ 0,72 → CTR ≈ 6,8 %\n  PR ≈ -0,96 → CTR ≈ 12,1 %\n  FD ≈ 1,81 → CTR ≈ 43,1 %\n  RS ≈ -1,57 → CTR ≈ 32,4 %\n\nFD (43%) et RS (32%) construisent l'axe 1 — thèmes qui discriminent le plus Radio vs TV."
        }
      ]
    },
    {
      "titre": "Rattrapage — ACP des cidres (10 cidres × 9 caractéristiques)",
      "source": "Analyse de Données.pdf, durée 1h",
      "questions": [
        {
          "numero": "I.a",
          "enonce": "Justifier l'utilisation d'une ACP normée.",
          "correction": "4 raisons :\n1. Données quantitatives continues (notes 0-5) → ACP adaptée (AFC = modalités qualitatives).\n2. Tableau multidimensionnel (10 variables) → impossible de visualiser dans R^10.\n3. Pas de variable à expliquer → démarche descriptive.\n4. On cherche à résumer + identifier corrélations entre caractéristiques sensorielles + regrouper cidres similaires.\n\nACP normée nécessaire car les variables ont des amplitudes/variances différentes."
        },
        {
          "numero": "I.b",
          "enonce": "Packages R à installer ?",
          "correction": "install.packages(c('ade4','FactoMineR','factoextra','rgl','corrplot'))\n\n- ade4 : dudi.pca, s.corcircle, inertia.dudi\n- FactoMineR : PCA, summary\n- factoextra : fviz_pca, ggplot2\n- rgl : plot3d, ellipse3d (3D interactive)\n- corrplot : visualisation matrice de corrélation\n\nChargement : library(ade4); library(FactoMineR); library(factoextra); library(rgl)"
        },
        {
          "numero": "I.c",
          "enonce": "Script R pour la matrice de corrélation + 3 groupes corrélés.",
          "correction": "cidre <- read.table('cidre.csv', header=TRUE, sep=';', dec=',')\ncidreR <- as.data.frame(scale(cidre))\nattach(cidreR)\nR <- cor(cidre)\nround(R, 2)\ncorrplot(R, method='circle', type='upper')\n\nLes 3 groupes corrélés (r > 0,5) :\n- Groupe 1 — fruité : {parfum, fruité, sucré} (un cidre fruité est sucré et parfumé)\n- Groupe 2 — alcoolique : {acide, alcool, suffocante}\n- Groupe 3 — amertume : {amer, astringence, piquante}\n\nVérif : cor(cbind(parf, fruit, sucr))"
        },
        {
          "numero": "I.d",
          "enonce": "Que représentent les ellipses en 3D ?",
          "correction": "Les ellipsoïdes 3D (ellipse3d(cor(cbind(...)))) représentent :\n1. Région de confiance pour la corrélation (95% des individus si distribution multinormale)\n2. Forme indique la structure :\n  - Cigare allongé = forte corrélation entre les 3 variables\n  - Sphère = indépendance\n  - Orientation = direction des axes principaux\n3. Volume = dispersion conjointe"
        },
        {
          "numero": "I.e",
          "enonce": "Différences entre les 2 ellipses (acid,alco,suffo) vs (parf,alco,sucr).",
          "correction": "Nuage 1 (acid,alco,suffo) : ellipsoïde très allongé (cigare) selon la diagonale → fortes corrélations positives, redondance d'information.\n\nNuage 2 (parf,alco,sucr) : ellipsoïde plus aplati (galette) car parf et sucr sont corrélés mais pas à alcool → variables plus indépendantes.\n\nConclusion : forme = cohérence/redondance. Cigare = redondance forte ; sphère = indépendance."
        },
        {
          "numero": "II.a-b",
          "enonce": "Pourcentage de variance expliqué par les 2 premiers facteurs ? Signification ?",
          "correction": "Sortie R :\n> round(acp$eig, 2)\n[1] 5.15 2.50 1.10 0.83 0.19 ...\n> round(cumsum(acp$eig*10), 2)\n[1] 51.54 76.56 87.53 ...\n\n%Axe1 = 5,15/10×100 = 51,54 %\n%Axe2 = 2,50/10×100 = 25,02 %\nCumul = 76,56 %\n\nSignification : les 2 premières composantes capturent 76,56 % de l'information totale du tableau 9 variables. La projection 2D donne une image fiable du nuage en 9D. >70 % → lecture du plan factoriel légitime."
        },
        {
          "numero": "II.c-d",
          "enonce": "Critère de bonne représentation d'une variable + variables mal représentées.",
          "correction": "Bonne représentation = flèche proche du cercle unité (rayon 1). Critère numérique : qlt = cos²(Xj,F1) + cos²(Xj,F2) ≈ 1.\n\nSeuil : qlt > 70 % → bien représentée ; qlt < 50 % → mal représentée.\n\nMal représentées : acide (qlt ≈ 13 %) — interprétation non fiable sur F1-F2 ; astr à la limite (≈ 70 %). Les autres (odeu, sucr, amer, suffo, piqu, alco, parf, fruit) sont bien représentées."
        },
        {
          "numero": "II.e",
          "enonce": "Variables corrélées à alcool ? Variables contribuant à F1 et F2 ?",
          "correction": "Avec alcool :\n- Le plus corrélée positivement : suffocante (angle ≈ 0°, cos ≈ 1)\n- Le plus corrélée négativement : fruité (angle ≈ 180°, cos ≈ -1)\n- Le moins corrélée : amer (angle ≈ 90°, cos ≈ 0)\n\nVariables qui contribuent à F1 (CTR > 100/10 = 10 %) :\nsucre (18,4), alcool (17,3), fruit (16,2), parfum (16,0), astringence (13,5)\n\nVariables qui contribuent à F2 :\nodeur (38,7), suffocante (25,0), piquante (20,6) — totalisent 84 % de l'inertie F2"
        },
        {
          "numero": "II.f-g",
          "enonce": "Signification des axes F1 et F2 ?",
          "correction": "F1 (51,54 % d'inertie) :\nCôté négatif : alcool, suffocante, astringence, amer.\nCôté positif : sucre, parfum, fruité.\n→ F1 = axe DOUCEUR FRUITÉE vs FORCE ALCOOLIQUE-AMÈRE — l'axe principal du goût du cidre.\n\nF2 (25,02 % d'inertie) :\nCôté négatif : odeur intense.\nCôté positif : suffocante, piquante.\n→ F2 = axe OLFACTIF vs GUSTATIF/TACTILE — distingue cidres aromatiques (nez) de cidres piquants (bouche), indépendamment de la force alcoolique.\n\nLa carte F1-F2 (76,56 % d'inertie totale) classe un cidre sur 2 dimensions : doux↔fort × aromatique↔piquant."
        }
      ]
    },
    {
      "titre": "Application — ACP normée sur IDE et facteurs économiques",
      "source": "Cours, chapitre I",
      "questions": [
        {
          "numero": "Énoncé",
          "enonce": "4 pays × 3 variables : IDE, taux de croissance économique (%), taux d'inflation (%).\n     IDE  Croissance  Inflation\nA   300      2          6\nB   450      2          4\nC   950      8          2\nD   700      7          5",
          "correction": "Réaliser une ACP normée complète."
        },
        {
          "numero": "1",
          "enonce": "Moyenne et écart-type.",
          "correction": "X1 (IDE) : μ = 600, σ ≈ 247,5\nX2 (Croissance) : μ = 4,75, σ ≈ 2,77\nX3 (Inflation) : μ = 4,25, σ ≈ 1,48"
        },
        {
          "numero": "2-4",
          "enonce": "MCR, covariance, corrélation.",
          "correction": "MCR (centrage-réduction) :\nA : (-1,21 ; -0,99 ; +1,18)\nB : (-0,80 ; -0,99 ; -0,16)\nC : (+1,41 ; +1,17 ; -1,50)\nD : (+0,40 ; +0,81 ; +0,50)\n\nMatrice de corrélations :\nR =\n[  1,00    0,99   -0,80 ]\n[  0,99    1,00   -0,60 ]\n[ -0,80   -0,60    1,00 ]\n\nInterprétation : ρ(IDE, Croissance) = +0,99 (très forte corrélation positive) ; ρ(IDE, Inflation) = -0,80 (corrélation négative : plus l'inflation est élevée, moins l'IDE est attractif)."
        },
        {
          "numero": "5-7",
          "enonce": "Polynôme caractéristique, valeurs propres, inertie.",
          "correction": "P(λ) = -λ³ + 3λ² - 1,02λ + 0,01 ≈ 0\n\nValeurs propres :\n  λ1 ≈ 2,34 → 78 % d'inertie\n  λ2 ≈ 0,66 → 22 % d'inertie\n  λ3 ≈ 0   → 0 %\n\nLes 2 premiers axes cumulent 100 % → projection 2D parfaite."
        },
        {
          "numero": "9-10",
          "enonce": "Projection des individus + contributions.",
          "correction": "Projections F1/F2 :\nA : (-0,46 ; -1,22) — faible IDE, forte inflation\nB : (-1,09 ; -1,46)\nC : (+0,48 ; +1,40) — fort IDE, faible inflation\nD : (+0,99 ; +1,20)\n\nF1 = axe ATTRACTIVITÉ ÉCONOMIQUE → sépare A,B (peu attractifs) de C,D (attractifs).\n\nContributions des variables :\nIDE : 44 % ; Croissance : 32 % ; Inflation : 39 % — toutes significatives (>33 %)."
        }
      ]
    },
    {
      "titre": "Application — AFC sur noms de marque (12 marques × 11 attributs)",
      "source": "Cours, chapitre II",
      "questions": [
        {
          "numero": "Énoncé",
          "enonce": "12 noms de marque (Orly, Alezan, Corsaire, Directoire, Ducat, ...) × 11 attributs (Vieille, Riche, Élégant, Comique, Racé, Mièvre, Distingué, Vulgaire, Masculin, Féminin, Naturel). Effectif total N = 1145.\n\nTravail : 1. fréquences, 2. profils-lignes, 3. profils-colonnes, 4. distances entre profils.",
          "correction": "AFC sur tableau de contingence — voir les sous-questions."
        },
        {
          "numero": "1",
          "enonce": "Tableau des fréquences.",
          "correction": "f_ij = n_ij / N (N = 1145).\n\nExemples :\n  f(Orly, Vieille) = 1/1145 = 0,09 %\n  f(Orly, Riche) = 20/1145 = 1,75 %\n\nMarges :\n  Ligne Vieille = 9,69 % ; Riche = 9,61 % ; Élégant = 9,87 %\n  Colonne Orly = 6,81 % ; Alezan = 9,78 % ; Hôtesse = 10,04 %\n\nTotal = 100 %"
        },
        {
          "numero": "2-3",
          "enonce": "Profils-lignes et profils-colonnes.",
          "correction": "Profil-ligne : f_j|i = n_ij / n_i.\nProfil-colonne : f_i|j = n_ij / n_.j\n\nExemple ligne Vieille (effectif 111) :\n  Orly : 1/111 = 0,90 %\n  Riche/Orly : 20/110 = 18,18 %\n\nExemple colonne Orly (effectif 78) :\n  Vieille/Orly : 1/78 = 1,28 %\n  Riche/Orly : 20/78 = 25,64 %\n\nChaque ligne (resp. colonne) somme à 100 %. Le profil moyen = marge complémentaire."
        },
        {
          "numero": "4",
          "enonce": "Distance du χ² entre profils.",
          "correction": "d²(i, i') = Σ_j (1/f_.j) × (f_j|i - f_j|i')²\n\nExemple (Vieille vs Riche pour Orly) :\nd² = (0,009 - 0,182)² / 0,068 = 0,438\n\nDistances totales par ligne (cours) :\nVieille 1,627 ; Riche 0,608 ; Élégant 1,344 ; Comique 1,432 ; Racé 0,938 ; Distingué 2,376 (la plus distincte) ; Vulgaire 0,644 ; Masculin 1,524 ; Féminin 1,658\n\nInterprétation : profils proches → regroupés par l'AFC ; éloignés → opposés sur axes factoriels.\n\nScript R :\nlibrary(FactoMineR)\nres.ca <- CA(tableau_contingence, graph=TRUE)\nfviz_ca_biplot(res.ca)"
        }
      ]
    },
    {
      "titre": "Application — CAH sur segmentation marché (8 individus × 4 variables)",
      "source": "Cours, chapitre III",
      "questions": [
        {
          "numero": "Énoncé",
          "enonce": "Segmenter le marché de 8 individus selon 4 variables (V01,V02,V03,V04).\nI1: 200 2 39 418  | I5: 420 3 47 117\nI2: 250 2 29 153  | I6: 500 2 46 106\nI3: 100 1 40 309  | I7: 820 3 52 198\nI4: 104 1 46 210  | I8: 640 1 42 126\n\nTravail : 1. MCR, 2. matrice de proximité euclidienne, 3. dendrogramme + interprétation des classes.",
          "correction": "CAH par saut minimum — voir sous-questions."
        },
        {
          "numero": "1",
          "enonce": "Données centrées-réduites.",
          "correction": "Moyennes : V01=379,25 ; V02=1,88 ; V03=42,63 ; V04=204,63\nÉcarts-types : V01=262,15 ; V02=0,83 ; V03=6,93 ; V04=108,72\n\nMCR (z_ij = (x_ij - μj) / σj) :\nI1 (-0,68 ; 0,15 ; -0,52 ; 1,96)\nI2 (-0,49 ; 0,15 ; -1,97 ; -0,47)\nI3 (-1,07 ; -1,05 ; -0,38 ; 0,96)\nI4 (-1,05 ; -1,05 ; 0,49 ; 0,05)\nI5 (0,16 ; 1,35 ; 0,63 ; -0,81)\nI6 (0,46 ; 0,15 ; 0,49 ; -0,91)\nI7 (1,68 ; 1,35 ; 1,35 ; -0,06)\nI8 (0,99 ; -1,05 ; -0,09 ; -0,72)"
        },
        {
          "numero": "2",
          "enonce": "Matrice de proximité (distance euclidienne).",
          "correction": "d(Ia, Ib) = √(Σ (zaj - zbj)²)\n\n      I1   I2   I3   I4   I5   I6   I7   I8\nI1     0\nI2   2,84   0\nI3   1,61 2,52   0\nI4   2,50 2,84 1,26   0\nI5   3,34 2,95 3,37 2,82   0\nI6   3,25 2,67 2,83 2,15 1,25   0\nI7   3,83 4,17 4,16 3,74 1,85 2,10   0\nI8   3,41 2,69 2,68 2,26 2,64 1,45 2,96   0\n\nMin = d(I5,I6) = 1,25 — les plus similaires.\nMax = d(I2,I7) = 4,17 — les plus éloignés."
        },
        {
          "numero": "3",
          "enonce": "Dendrogramme + interprétation des classes (saut minimum).",
          "correction": "Algorithme : à chaque étape, agréger les 2 clusters les plus proches au sens du saut minimum : d(A∪B, C) = min(d(A,C), d(B,C)).\n\nÉtapes :\n1. d(I5,I6) = 1,25 → {I5, I6}\n2. d({I5,I6}, I8) min → {I5, I6, I8}\n3. d(..., I7) → {I5, I6, I7, I8}\n4. d(I3,I4) = 1,26 → {I3, I4}\n5. {I3,I4,I1} puis {I3,I4,I1,I2}\n6. Fusion finale\n\nCoupure à hauteur ≈ 1,5 → 2 classes :\n- Classe 1 : {I1, I2, I3, I4} — faible V01 (peu d'investissement)\n- Classe 2 : {I5, I6, I7, I8} — fort V01\n\nLe marché se segmente en 'petits clients' et 'gros clients'.\n\nScript R :\nd <- dist(scale(donnees), method='euclidean')\nhc <- hclust(d, method='single')\nplot(hc, hang=-1, main='Dendrogramme — saut min')\nrect.hclust(hc, k=2, border='red')\nclasses <- cutree(hc, k=2)"
        }
      ]
    }
  ],
  "web": [
    {
      "titre": "RATTRAPAGE CU CONTROLE CONTINU - Session de Juillet 2025 - Epreuve d'Outil de programmation Web - Laravel (Niveau 3, Durée 00h30, Filières : Génie Logiciel, Software Eng.)",
      "source": "Pweb LARAVEL.pdf - Page 1",
      "questions": [
        {
          "numero": "1",
          "enonce": "Quelle syntaxe définit correctement une route GET vers la méthode index du ProductController ?\na) Route::get('/products', ProductController::class, 'index');\nb) Route::get('/products', [ProductController::class, 'index']);\nc) Route::get('/products', 'ProductController@index');\nd) Route::get('/products')->to(ProductController::class, 'index');",
          "correction": "Réponse correcte : b) Route::get('/products', [ProductController::class, 'index']);\n\nExplication :\nDepuis Laravel 8, la syntaxe officielle pour lier une route à une méthode de contrôleur utilise un tableau [Classe::class, 'methode'].\n\n- a) FAUX : passe trois arguments séparés, ce qui n'est pas la signature attendue de Route::get().\n- b) CORRECT : syntaxe Tuple Callable PHP (Laravel 8+).\n- c) DÉPRÉCIÉ : la syntaxe 'Controller@method' (string) fonctionnait jusqu'à Laravel 7 mais a été retirée du RouteServiceProvider par défaut depuis Laravel 8.\n- d) FAUX : la méthode ->to() n'existe pas sur la façade Route pour cet usage.\n\nExemple complet dans routes/web.php :\n<?php\nuse App\\Http\\Controllers\\ProductController;\nuse Illuminate\\Support\\Facades\\Route;\n\nRoute::get('/products', [ProductController::class, 'index'])->name('products.index');",
          "bareme": "+1 / -1"
        },
        {
          "numero": "2",
          "enonce": "Route::resource('articles', ArticleController::class) génère combien de routes ?\na) 5 routes  b) 7 routes  c) 6 routes  d) 8 routes",
          "correction": "Réponse correcte : b) 7 routes\n\nExplication :\nRoute::resource() crée automatiquement les 7 routes RESTful suivantes :\n\n| Verbe HTTP | URI                     | Action  | Nom de route       |\n|------------|-------------------------|---------|--------------------|\n| GET        | /articles               | index   | articles.index     |\n| GET        | /articles/create        | create  | articles.create    |\n| POST       | /articles               | store   | articles.store     |\n| GET        | /articles/{article}     | show    | articles.show      |\n| GET        | /articles/{article}/edit| edit    | articles.edit      |\n| PUT/PATCH  | /articles/{article}     | update  | articles.update    |\n| DELETE     | /articles/{article}     | destroy | articles.destroy   |\n\nPour vérifier : php artisan route:list --name=articles\n\nNote : pour une API (sans create/edit) on utilise Route::apiResource() qui ne génère que 5 routes.",
          "bareme": "+1 / -1"
        },
        {
          "numero": "3",
          "enonce": "Parmi ces méthodes, lesquelles sont générées par Route::resource() ?\na) index()  b) show()  c) list()  d) store()  e) save()",
          "correction": "Réponses correctes : a) index() et b) show() et d) store()\n\nExplication :\nLes 7 méthodes générées par un Resource Controller sont :\nindex(), create(), store(), show(), edit(), update(), destroy().\n\n- a) index() : CORRECT - liste des ressources\n- b) show() : CORRECT - affiche une ressource\n- c) list() : INCORRECT - n'existe pas\n- d) store() : CORRECT - enregistre une nouvelle ressource\n- e) save() : INCORRECT - n'existe pas (save() existe sur les modèles Eloquent, pas dans le ResourceController)\n\nCommande pour générer un contrôleur resource :\nphp artisan make:controller ArticleController --resource --model=Article",
          "bareme": "+1 / -1"
        },
        {
          "numero": "4",
          "enonce": "Comment appliquer une contrainte pour accepter uniquement des IDs numériques ?\na) ->where('id', 'numeric')\nb) ->where('id', '[0-9]+')\nc) ->constraint('id', 'number')\nd) ->validate('id', 'integer')",
          "correction": "Réponse correcte : b) ->where('id', '[0-9]+')\n\nExplication :\nLa méthode ->where() sur les routes attend une expression régulière (regex), pas un mot-clé.\n\n- a) FAUX : 'numeric' n'est pas une regex valide pour where() sur les routes (c'est une règle de validation).\n- b) CORRECT : la regex '[0-9]+' n'accepte que les chiffres de 0 à 9, un ou plusieurs.\n- c) FAUX : la méthode ->constraint() n'existe pas sur les routes.\n- d) FAUX : ->validate() est utilisée dans les contrôleurs ou Form Requests, pas sur les routes.\n\nExemple complet :\nRoute::get('/users/{id}', [UserController::class, 'show'])\n    ->where('id', '[0-9]+');\n\nDepuis Laravel 7, on peut aussi utiliser le helper whereNumber() :\nRoute::get('/users/{id}', [UserController::class, 'show'])->whereNumber('id');",
          "bareme": "+1 / -1"
        },
        {
          "numero": "5",
          "enonce": "Quelle syntaxe nomme correctement une route ?\na) ->name('products.index')\nb) ->as('products.index')\nc) ->called('products.index')\nd) ->route('products.index')",
          "correction": "Réponses correctes : a) ->name('products.index') et b) ->as('products.index')\n\nExplication :\n- a) CORRECT : ->name() est la méthode standard et la plus utilisée.\n- b) CORRECT : ->as() est utilisée principalement dans les groupes de routes pour ajouter un préfixe de nom.\n- c) FAUX : ->called() n'existe pas.\n- d) FAUX : ->route() n'existe pas sur les routes (route() est un helper global pour générer une URL).\n\nExemples :\nRoute::get('/products', [ProductController::class, 'index'])->name('products.index');\n\nDans un groupe :\nRoute::name('admin.')->prefix('admin')->group(function () {\n    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');\n    // Nom final : admin.dashboard\n});",
          "bareme": "+1 / -1"
        },
        {
          "numero": "6",
          "enonce": "Comment grouper des routes avec le préfixe /api/v1 ?\na) Route::prefix('/api/v1')->group(function() { ... });\nb) Route::group(['prefix' => '/api/v1'], function() { ... });\nc) Route::api('/api/v1')->group(function() { ... });\nd) Les réponses a et b sont correctes",
          "correction": "Réponse correcte : d) Les réponses a et b sont correctes\n\nExplication :\nLaravel accepte les deux syntaxes pour grouper des routes :\n\n- a) Syntaxe fluide moderne (Laravel 5.5+) :\nRoute::prefix('api/v1')->group(function () {\n    Route::get('/users', [UserController::class, 'index']);\n});\n\n- b) Syntaxe tableau (legacy mais toujours supportée) :\nRoute::group(['prefix' => 'api/v1'], function () {\n    Route::get('/users', [UserController::class, 'index']);\n});\n\n- c) FAUX : Route::api() n'existe pas. Cependant, le fichier routes/api.php applique déjà automatiquement le préfixe /api.\n\nLa syntaxe fluide (a) est aujourd'hui recommandée car plus lisible.",
          "bareme": "+1 / -1"
        },
        {
          "numero": "7",
          "enonce": "Pour appliquer le middleware auth à une route :\na) ->middleware('auth')\nb) ->auth()\nc) ->protected()\nd) ->secure('auth')",
          "correction": "Réponse correcte : a) ->middleware('auth')\n\nExplication :\nLa méthode ->middleware() est la seule façon standard d'attacher un middleware à une route.\n\n- a) CORRECT : Route::get(...)->middleware('auth');\n- b), c), d) : FAUX - ces méthodes n'existent pas.\n\nExemples complets :\n// Un seul middleware\nRoute::get('/profile', [ProfileController::class, 'show'])->middleware('auth');\n\n// Plusieurs middlewares\nRoute::get('/admin', [AdminController::class, 'index'])\n    ->middleware(['auth', 'admin', 'verified']);\n\n// Sur un groupe\nRoute::middleware(['auth'])->group(function () {\n    Route::get('/dashboard', [DashboardController::class, 'index']);\n});\n\nLes middlewares globaux sont enregistrés dans app/Http/Kernel.php (avant Laravel 11) ou bootstrap/app.php (Laravel 11+).",
          "bareme": "+1 / -1"
        },
        {
          "numero": "8",
          "enonce": "Comment exclure les méthodes create et edit d'une route resource ?\na) ->except(['create', 'edit'])\nb) ->without(['create', 'edit'])\nc) ->exclude(['create', 'edit'])\nd) ->hide(['create', 'edit'])",
          "correction": "Réponse correcte : a) ->except(['create', 'edit'])\n\nExplication :\nDeux méthodes existent pour filtrer les routes d'un Resource Controller :\n\n- ->except() : exclut les méthodes listées\n- ->only() : ne garde QUE les méthodes listées\n\nExemples :\n// Génère toutes les routes SAUF create et edit\nRoute::resource('articles', ArticleController::class)\n    ->except(['create', 'edit']);\n\n// Génère UNIQUEMENT index et show\nRoute::resource('articles', ArticleController::class)\n    ->only(['index', 'show']);\n\n// Pour une API REST (équivalent à except(['create', 'edit']))\nRoute::apiResource('articles', ArticleController::class);\n\nLes autres méthodes b), c), d) n'existent pas.",
          "bareme": "+1 / -1"
        },
        {
          "numero": "9",
          "enonce": "Quelle route correspond à l'URL /products/123 avec Route::resource('products', ProductController::class) ?\na) ProductController@index\nb) ProductController@show\nc) ProductController@detail\nd) ProductController@view",
          "correction": "Réponse correcte : b) ProductController@show\n\nExplication :\nL'URL GET /products/{id} (par exemple /products/123) correspond à la méthode show() qui affiche une ressource spécifique.\n\nMapping complet pour Route::resource :\n- GET /products              → index\n- GET /products/create       → create\n- POST /products             → store\n- GET /products/123          → show (avec id=123)\n- GET /products/123/edit     → edit\n- PUT/PATCH /products/123    → update\n- DELETE /products/123       → destroy\n\nCode du contrôleur :\npublic function show(Product $product)\n{\n    // Route Model Binding : Laravel récupère automatiquement\n    // le produit dont l'id correspond à {product} dans l'URL\n    return view('products.show', compact('product'));\n}",
          "bareme": "+1 / -1"
        },
        {
          "numero": "10",
          "enonce": "La contrainte ->where('year', '[0-9]{4}') accepte :\na) 2023  b) 23  c) year2023  d) 20234",
          "correction": "Réponse correcte : a) 2023\n\nExplication :\nLa regex '[0-9]{4}' exige EXACTEMENT 4 chiffres (Laravel applique la regex à toute la valeur grâce à des ancres implicites).\n\n- a) '2023' : ACCEPTÉ (exactement 4 chiffres)\n- b) '23' : REFUSÉ (seulement 2 chiffres)\n- c) 'year2023' : REFUSÉ (contient des lettres)\n- d) '20234' : REFUSÉ (5 chiffres, pas 4)\n\nExemple :\nRoute::get('/archives/{year}', [ArchiveController::class, 'show'])\n    ->where('year', '[0-9]{4}');\n\n// Helper Laravel 7+ équivalent :\nRoute::get('/archives/{year}', [ArchiveController::class, 'show'])\n    ->whereNumber('year');\n// (mais accepterait aussi 23 ou 20234)\n\nPour une plage stricte d'années : ->where('year', '(19|20)[0-9]{2}')",
          "bareme": "+1 / -1"
        },
        {
          "numero": "11",
          "enonce": "Comment créer une route qui capture tous les segments d'URL ?\na) Route::get('/{all}', ...)->where('all', '.*');\nb) Route::any('/{path?}', ...)->where('path', '.*');\nc) Route::fallback(function() { ... });\nd) Toutes les réponses sont correctes",
          "correction": "Réponse correcte : d) Toutes les réponses sont correctes\n\nExplication :\nLaravel offre plusieurs façons de capturer toutes les URLs :\n\n- a) Catch-all avec GET et regex .* :\nRoute::get('/{all}', [CatchAllController::class, 'handle'])\n    ->where('all', '.*');\n\n- b) Route::any() accepte tous les verbes HTTP (GET, POST, PUT, etc.) :\nRoute::any('/{path?}', [CatchAllController::class, 'handle'])\n    ->where('path', '.*');\n\n- c) Route::fallback() est exécutée si aucune autre route ne correspond. C'est la méthode RECOMMANDÉE pour les 404 personnalisés :\nRoute::fallback(function () {\n    return response()->view('errors.404', [], 404);\n});\n\nIMPORTANT : Route::fallback() doit être déclarée à la fin du fichier de routes.",
          "bareme": "+1 / -1"
        },
        {
          "numero": "12",
          "enonce": "Dans un groupe de routes, comment appliquer un middleware seulement à certaines routes ?\na) Impossible, le middleware s'applique à tout le groupe\nb) Utiliser ->middleware() sur chaque route individuellement\nc) Créer des sous-groupes avec middleware\nd) Les réponses b et c sont correctes",
          "correction": "Réponse correcte : d) Les réponses b et c sont correctes\n\nExplication :\n- a) FAUX : il est tout à fait possible d'appliquer un middleware sélectivement.\n- b) CORRECT : on peut ajouter ->middleware() sur une route précise dans un groupe.\n- c) CORRECT : on peut créer un sous-groupe avec son propre middleware.\n\nExemple combinant les deux approches :\nRoute::prefix('api')->group(function () {\n    // Route publique\n    Route::get('/products', [ProductController::class, 'index']);\n\n    // (b) Middleware sur une seule route\n    Route::post('/contact', [ContactController::class, 'store'])\n        ->middleware('throttle:5,1');\n\n    // (c) Sous-groupe avec son middleware\n    Route::middleware('auth:sanctum')->group(function () {\n        Route::post('/products', [ProductController::class, 'store']);\n        Route::delete('/products/{product}', [ProductController::class, 'destroy']);\n    });\n});",
          "bareme": "+1 / -1"
        },
        {
          "numero": "13",
          "enonce": "Quelle méthode HTTP correspond à ProductController@update dans une route resource ?\na) POST  b) PUT  c) PATCH  d) Les réponses b et c sont correctes",
          "correction": "Réponse correcte : d) Les réponses b et c sont correctes\n\nExplication :\nLa méthode update() d'un Resource Controller répond aux verbes PUT et PATCH :\n\n- PUT /products/{id} → ProductController@update (remplacement complet)\n- PATCH /products/{id} → ProductController@update (mise à jour partielle)\n\nPOST est utilisé pour store() (création), pas update().\n\nDans un formulaire HTML (qui ne supporte que GET et POST), on utilise @method() pour simuler PUT/PATCH :\n\n<form action=\"{{ route('products.update', $product) }}\" method=\"POST\">\n    @csrf\n    @method('PUT')\n    <input type=\"text\" name=\"name\" value=\"{{ old('name', $product->name) }}\">\n    <button type=\"submit\">Mettre à jour</button>\n</form>\n\nCôté contrôleur :\npublic function update(Request $request, Product $product)\n{\n    $validated = $request->validate([\n        'name' => 'required|string|max:255',\n        'price' => 'required|numeric|min:0',\n    ]);\n    $product->update($validated);\n    return redirect()->route('products.show', $product)\n        ->with('success', 'Produit mis à jour !');\n}",
          "bareme": "+1 / -1"
        },
        {
          "numero": "14",
          "enonce": "La route Route::post('/products', [ProductController::class, 'store'])->name('products.store') :\na) Accepte les données POST du contrôleur\nb) Exécute la méthode store du contrôleur\nc) Peut être appelée avec route('products.store')\nd) Toutes les réponses sont correctes",
          "correction": "Réponse correcte : d) Toutes les réponses sont correctes\n\nExplication :\nCette ligne définit une route avec trois caractéristiques :\n\n- a) CORRECT : Route::post() n'accepte que les requêtes HTTP POST (utilisées pour soumettre un formulaire de création).\n- b) CORRECT : [ProductController::class, 'store'] indique à Laravel d'exécuter la méthode store() du contrôleur.\n- c) CORRECT : ->name('products.store') permet d'utiliser le helper route('products.store') pour générer l'URL.\n\nUtilisation pratique en Blade :\n<form action=\"{{ route('products.store') }}\" method=\"POST\">\n    @csrf\n    <input type=\"text\" name=\"name\">\n    <input type=\"number\" name=\"price\">\n    <button type=\"submit\">Créer</button>\n</form>\n\nContrôleur :\npublic function store(Request $request)\n{\n    $validated = $request->validate([\n        'name' => 'required|string|max:255',\n        'price' => 'required|numeric|min:0',\n    ]);\n    Product::create($validated);\n    return redirect()->route('products.index');\n}",
          "bareme": "+1 / -1"
        },
        {
          "numero": "15",
          "enonce": "Comment définir une contrainte sur plusieurs paramètres ?\na) ->where(['id' => '[0-9]+', 'slug' => '[a-z-]+'])\nb) ->where('id', '[0-9]+')->where('slug', '[a-z-]+')\nc) ->constraints(['id' => 'numeric', 'slug' => 'alpha'])\nd) Les réponses a et b sont correctes",
          "correction": "Réponse correcte : d) Les réponses a et b sont correctes\n\nExplication :\nLaravel accepte deux syntaxes pour appliquer des contraintes sur plusieurs paramètres :\n\n- a) Avec un tableau associatif (plus compact) :\nRoute::get('/blog/{id}/{slug}', [BlogController::class, 'show'])\n    ->where(['id' => '[0-9]+', 'slug' => '[a-z-]+']);\n\n- b) En chaînant plusieurs appels ->where() (plus lisible) :\nRoute::get('/blog/{id}/{slug}', [BlogController::class, 'show'])\n    ->where('id', '[0-9]+')\n    ->where('slug', '[a-z-]+');\n\n- c) FAUX : la méthode ->constraints() n'existe pas (cela existait dans Symfony mais pas Laravel).\n\nOn peut aussi utiliser des helpers globaux dans RouteServiceProvider pour appliquer une contrainte à toutes les routes :\nRoute::pattern('id', '[0-9]+');",
          "bareme": "+1 / -1"
        },
        {
          "numero": "16",
          "enonce": "Route::get('/users/{user}/posts/{post}', ...) a combien de paramètres ?\na) 1 paramètre  b) 2 paramètres  c) 3 paramètres  d) 4 paramètres",
          "correction": "Réponse correcte : b) 2 paramètres\n\nExplication :\nLa route contient 2 segments dynamiques entre accolades :\n- {user} : 1er paramètre\n- {post} : 2ème paramètre\n\nDans le contrôleur, ces deux paramètres sont passés à la méthode dans l'ordre :\n\npublic function show(User $user, Post $post)\n{\n    // Route Model Binding : Laravel récupère automatiquement\n    // les instances User et Post depuis la base de données\n    // grâce aux clés primaires dans l'URL\n    return view('posts.show', compact('user', 'post'));\n}\n\nExemple d'URL : /users/42/posts/100\n→ Laravel cherche User::find(42) et Post::find(100)\n\nPour des routes imbriquées RESTful, on utilise souvent Route::resource imbriqué :\nRoute::resource('users.posts', UserPostController::class);",
          "bareme": "+1 / -1"
        },
        {
          "numero": "17",
          "enonce": "Pour rediriger automatiquement /products/ vers /products :\na) Route::redirect('/products/', '/products');\nb) Route::permanentRedirect('/products/', '/products');\nc) Route::get('/products/', fn() => redirect('/products'));\nd) Toutes les réponses fonctionnent",
          "correction": "Réponse correcte : d) Toutes les réponses fonctionnent\n\nExplication :\nLaravel propose plusieurs méthodes pour gérer les redirections :\n\n- a) Route::redirect() : redirection 302 (temporaire) par défaut\nRoute::redirect('/products/', '/products');\n// On peut aussi spécifier un code :\nRoute::redirect('/products/', '/products', 301);\n\n- b) Route::permanentRedirect() : redirection 301 (permanente, importante pour le SEO)\nRoute::permanentRedirect('/products/', '/products');\n\n- c) Approche manuelle avec une closure :\nRoute::get('/products/', fn () => redirect('/products'));\n// Equivalent à :\nRoute::get('/products/', function () {\n    return redirect('/products');\n});\n\nLes trois sont fonctionnelles. Les méthodes (a) et (b) sont plus expressives et lisibles.",
          "bareme": "+1 / -1"
        },
        {
          "numero": "18",
          "enonce": "Dans routes/api.php, les routes ont automatiquement :\na) Le préfixe /api\nb) Le middleware 'api'\nc) Le format JSON par défaut\nd) Toutes les réponses sont correctes",
          "correction": "Réponse correcte : d) Toutes les réponses sont correctes\n\nExplication :\nLe fichier routes/api.php est traité spécialement par Laravel (configuré dans app/Providers/RouteServiceProvider.php avant Laravel 11, ou bootstrap/app.php depuis Laravel 11) :\n\n- a) Préfixe /api appliqué automatiquement :\nRoute::get('/users', ...) dans api.php devient accessible via /api/users\n\n- b) Middleware 'api' appliqué : le groupe 'api' inclut généralement :\n  - throttle:api (limitation de requêtes : ex. 60/min)\n  - SubstituteBindings (Route Model Binding)\n  - EnsureFrontendRequestsAreStateful (pour Sanctum si applicable)\n\n- c) Format JSON : les contrôleurs API retournent typiquement du JSON, et les Exceptions sont automatiquement converties en réponses JSON si le header 'Accept: application/json' est présent.\n\nDans Laravel 11, on active l'API avec :\nphp artisan install:api\n// Cela crée le fichier routes/api.php et configure Sanctum",
          "bareme": "+1 / -1"
        },
        {
          "numero": "19",
          "enonce": "Comment voir toutes les routes définies dans l'application ?\na) php artisan route:list\nb) php artisan routes\nc) php artisan show:routes\nd) php artisan list:routes",
          "correction": "Réponse correcte : a) php artisan route:list\n\nExplication :\nLa commande Artisan officielle pour lister toutes les routes est :\nphp artisan route:list\n\nLes autres options n'existent pas dans Laravel moderne (b) 'php artisan routes' existait avant Laravel 5.1 mais a été remplacée).\n\nOptions utiles :\n# Lister toutes les routes\nphp artisan route:list\n\n# Filtrer par méthode HTTP\nphp artisan route:list --method=POST\n\n# Filtrer par nom\nphp artisan route:list --name=products\n\n# Filtrer par chemin\nphp artisan route:list --path=api\n\n# Afficher uniquement les routes vendor (depuis Laravel 8)\nphp artisan route:list --except-vendor\n\n# Format JSON\nphp artisan route:list --json\n\n# Format compact (Laravel 9+)\nphp artisan route:list -v",
          "bareme": "+1 / -1"
        },
        {
          "numero": "20",
          "enonce": "La route Route::resource('products', ProductController::class)->only(['index', 'show']) génère :\na) 2 routes  b) 7 routes  c) 5 routes  d) 3 routes",
          "correction": "Réponse correcte : a) 2 routes\n\nExplication :\nLa méthode ->only() restreint le Resource Controller AUX SEULES méthodes listées.\n\n->only(['index', 'show']) génère exactement 2 routes :\n- GET /products       → ProductController@index (nom : products.index)\n- GET /products/{id}  → ProductController@show  (nom : products.show)\n\nCas typique : exposer une lecture publique d'un catalogue, sans création/modification.\n\nCode complet d'un contrôleur correspondant :\n<?php\nnamespace App\\Http\\Controllers;\n\nuse App\\Models\\Product;\n\nclass ProductController extends Controller\n{\n    public function index()\n    {\n        $products = Product::paginate(15);\n        return view('products.index', compact('products'));\n    }\n\n    public function show(Product $product)\n    {\n        return view('products.show', compact('product'));\n    }\n}\n\nÀ l'inverse, ->except(['index', 'show']) génèrerait les 5 autres routes (create, store, edit, update, destroy).",
          "bareme": "+1 / -1"
        }
      ]
    },
    {
      "titre": "RATTRAPAGE EXAMEN DE FIN DE SEMESTRE - Session de Juin 2025 - Epreuve d'Outil de Programmation Web (Niveau 3, Durée 00h30, Filières : Génie Logiciel, Software Eng.)",
      "source": "Pweb LARAVEL.pdf - Page 2",
      "questions": [
        {
          "numero": "1",
          "enonce": "Dans une relation morphMany, quelle colonne est généralement utilisée pour stocker le nom du modèle parent ?\nA. parent_name  B. model_type  C. model_name  D. relation_type",
          "correction": "Réponse correcte : B. model_type\n\nExplication :\nDans une relation polymorphique (morphMany, morphTo, morphOne, morphedByMany), Laravel utilise par convention deux colonnes sur la table enfant :\n- {nom}_id : ID du modèle parent\n- {nom}_type : nom de la classe du modèle parent (ex: 'App\\\\Models\\\\Post')\n\nLe schéma de convention est {nom}_type (pas model_type littéralement, mais c'est le terme générique).\n\nExemple : un modèle Comment polymorphique (pouvant appartenir à un Post OU un Video) :\n\nMigration :\nSchema::create('comments', function (Blueprint $table) {\n    $table->id();\n    $table->text('body');\n    $table->morphs('commentable'); // crée commentable_id ET commentable_type\n    $table->timestamps();\n});\n\nModèle Comment :\nclass Comment extends Model\n{\n    public function commentable()\n    {\n        return $this->morphTo();\n    }\n}\n\nModèle Post :\nclass Post extends Model\n{\n    public function comments()\n    {\n        return $this->morphMany(Comment::class, 'commentable');\n    }\n}\n\nLa colonne commentable_type contient par exemple 'App\\\\Models\\\\Post' ou 'App\\\\Models\\\\Video'.\n\nDans le contexte de la question, B. model_type est la meilleure réponse (suffixe _type).",
          "bareme": "+1 / -1"
        },
        {
          "numero": "2",
          "enonce": "Quelle méthode Artisan permet de générer automatiquement les événements et les écouteurs liés ?\nA. php artisan make:events\nB. php artisan event:generate\nC. php artisan make:event--listener\nD. php artisan event:make",
          "correction": "Réponse correcte : B. php artisan event:generate\n\nExplication :\nLa commande php artisan event:generate scanne le fichier app/Providers/EventServiceProvider.php (propriété $listen) et crée automatiquement les classes d'événements et d'écouteurs manquantes.\n\nProcédure typique :\n\n1) Déclarer les événements et listeners dans EventServiceProvider :\nprotected $listen = [\n    OrderShipped::class => [\n        SendShipmentNotification::class,\n        UpdateInventory::class,\n    ],\n];\n\n2) Générer les classes :\nphp artisan event:generate\n// Crée app/Events/OrderShipped.php\n// Crée app/Listeners/SendShipmentNotification.php\n// Crée app/Listeners/UpdateInventory.php\n\nAutres commandes liées :\n- php artisan make:event NomEvenement → crée UN événement\n- php artisan make:listener NomListener → crée UN listener\n\nNote : depuis Laravel 11, la découverte automatique d'événements (Event Discovery) rend event:generate moins nécessaire.",
          "bareme": "+1 / -1"
        },
        {
          "numero": "3",
          "enonce": "Quelle interface doit implémenter une classe pour être considérée comme un job que Laravel peut traiter en file d'attente ?\nA. JobInterface  B. ShouldQueue  C. Dispatchable  D. QueueableContract",
          "correction": "Réponse correcte : B. ShouldQueue\n\nExplication :\nUn job mis en file d'attente doit implémenter l'interface Illuminate\\Contracts\\Queue\\ShouldQueue. C'est cette interface qui indique à Laravel de placer le job dans la queue plutôt que de l'exécuter synchroniquement.\n\nNote : Dispatchable, Queueable, InteractsWithQueue, SerializesModels sont des TRAITS (pas des interfaces) ajoutés automatiquement par défaut.\n\nExemple complet :\n<?php\nnamespace App\\Jobs;\n\nuse Illuminate\\Bus\\Queueable;\nuse Illuminate\\Contracts\\Queue\\ShouldQueue;\nuse Illuminate\\Foundation\\Bus\\Dispatchable;\nuse Illuminate\\Queue\\InteractsWithQueue;\nuse Illuminate\\Queue\\SerializesModels;\nuse App\\Models\\User;\nuse Illuminate\\Support\\Facades\\Mail;\nuse App\\Mail\\WelcomeMail;\n\nclass SendWelcomeEmail implements ShouldQueue\n{\n    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;\n\n    public function __construct(public User $user) {}\n\n    public function handle(): void\n    {\n        Mail::to($this->user->email)->send(new WelcomeMail($this->user));\n    }\n}\n\nUtilisation :\nSendWelcomeEmail::dispatch($user);\n// Ou avec délai :\nSendWelcomeEmail::dispatch($user)->delay(now()->addMinutes(10));\n\nCommande :\nphp artisan make:job SendWelcomeEmail\nphp artisan queue:work",
          "bareme": "+1 / -1"
        },
        {
          "numero": "4",
          "enonce": "Dans Laravel, que signifie l'instruction Gate::define() ?\nA. Définir une route protégée\nB. Créer une autorisation personnalisée\nC. Définir un middleware personnalisé\nD. Créer une règle de validation",
          "correction": "Réponse correcte : B. Créer une autorisation personnalisée\n\nExplication :\nGate::define() est utilisée pour définir une 'capacité' (ability) d'autorisation. C'est le système de gestion des permissions de Laravel.\n\nExemple complet dans AuthServiceProvider :\n<?php\nnamespace App\\Providers;\n\nuse Illuminate\\Foundation\\Support\\Providers\\AuthServiceProvider as ServiceProvider;\nuse Illuminate\\Support\\Facades\\Gate;\nuse App\\Models\\Post;\nuse App\\Models\\User;\n\nclass AuthServiceProvider extends ServiceProvider\n{\n    public function boot(): void\n    {\n        Gate::define('update-post', function (User $user, Post $post) {\n            return $user->id === $post->user_id;\n        });\n\n        Gate::define('admin-access', function (User $user) {\n            return $user->role === 'admin';\n        });\n    }\n}\n\nUtilisation :\n// Dans un contrôleur\nif (Gate::allows('update-post', $post)) {\n    // OK\n}\nGate::authorize('update-post', $post); // throws 403 si refusé\n\n// Sur une route\nRoute::put('/posts/{post}', [PostController::class, 'update'])\n    ->middleware('can:update-post,post');\n\n// Dans Blade\n@can('update-post', $post)\n    <a href=\"...\">Editer</a>\n@endcan",
          "bareme": "+1 / -1"
        },
        {
          "numero": "5",
          "enonce": "Dans un test Laravel, quelle méthode permet de simuler une authentification d'un utilisateur ?\nA. Auth::simulate()  B. actingAs()  C. auth()->fake()  D. simulateAuth()",
          "correction": "Réponse correcte : B. actingAs()\n\nExplication :\nLa méthode actingAs($user) du trait MakesHttpRequests permet d'exécuter des tests en tant qu'utilisateur authentifié, sans avoir besoin de passer par un vrai processus de login.\n\nExemple complet d'un test de feature :\n<?php\nnamespace Tests\\Feature;\n\nuse Tests\\TestCase;\nuse App\\Models\\User;\nuse App\\Models\\Post;\nuse Illuminate\\Foundation\\Testing\\RefreshDatabase;\n\nclass PostTest extends TestCase\n{\n    use RefreshDatabase;\n\n    public function test_authenticated_user_can_create_post(): void\n    {\n        $user = User::factory()->create();\n\n        $response = $this->actingAs($user)\n            ->post('/posts', [\n                'title' => 'Mon premier post',\n                'body' => 'Contenu du post...',\n            ]);\n\n        $response->assertRedirect('/posts');\n        $this->assertDatabaseHas('posts', [\n            'title' => 'Mon premier post',\n            'user_id' => $user->id,\n        ]);\n    }\n\n    public function test_guest_cannot_access_dashboard(): void\n    {\n        $response = $this->get('/dashboard');\n        $response->assertRedirect('/login');\n    }\n}\n\nPour les API avec Sanctum :\n$this->actingAs($user, 'sanctum');\n\nOu avec Sanctum::actingAs() :\nSanctum::actingAs($user, ['*']);",
          "bareme": "+1 / -1"
        },
        {
          "numero": "6",
          "enonce": "Quelle méthode Blade est utilisée pour empêcher l'échappement automatique de HTML ?\nA. {{ }}  B. {!! !!}  C. {{{ }}}  D. @html()",
          "correction": "Réponse correcte : B. {!! !!}\n\nExplication :\nDans Blade, les délimiteurs ont des comportements différents :\n\n- {{ $variable }} : échappe automatiquement le HTML (équivalent à htmlspecialchars). C'est la méthode SÛRE et celle qu'on doit utiliser par défaut.\n\n- {!! $variable !!} : N'ÉCHAPPE PAS le HTML, rend la variable telle quelle. À utiliser UNIQUEMENT pour du contenu de confiance (HTML déjà sanitizé).\n\n- {{{ }}} : ancienne syntaxe Laravel 4 (dépréciée).\n- @html() : n'existe pas.\n\nExemples :\n// $name = '<script>alert(\"XSS\")</script>'\n{{ $name }}\n// Affiche : &lt;script&gt;alert(\"XSS\")&lt;/script&gt; (texte)\n\n{!! $name !!}\n// Affiche : <script>alert(\"XSS\")</script> (DANGER : XSS si non sanitizé)\n\nCas légitime d'utilisation de {!! !!} :\n@php\n    $articleHtml = Str::markdown($article->body); // sortie HTML sûre\n@endphp\n{!! $articleHtml !!}\n\nRÈGLE D'OR : ne JAMAIS utiliser {!! !!} avec des données utilisateur non sanitizées.",
          "bareme": "+1 / -1"
        },
        {
          "numero": "7",
          "enonce": "Lorsqu'on définit un FormRequest, où doit-on déclarer les règles de validation ?\nA. Dans le constructeur\nB. Dans la méthode rules()\nC. Dans la propriété $rules\nD. Dans la méthode validate()",
          "correction": "Réponse correcte : B. Dans la méthode rules()\n\nExplication :\nUn FormRequest est une classe dédiée à la validation, qui encapsule les règles dans la méthode publique rules() retournant un tableau associatif.\n\nGénération :\nphp artisan make:request StoreProductRequest\n\nExemple complet :\n<?php\nnamespace App\\Http\\Requests;\n\nuse Illuminate\\Foundation\\Http\\FormRequest;\n\nclass StoreProductRequest extends FormRequest\n{\n    public function authorize(): bool\n    {\n        // Retourne true si l'utilisateur est autorisé à faire cette requête\n        return auth()->check();\n    }\n\n    public function rules(): array\n    {\n        return [\n            'name' => ['required', 'string', 'max:255'],\n            'price' => ['required', 'numeric', 'min:0'],\n            'stock' => ['required', 'integer', 'min:0'],\n            'category_id' => ['required', 'exists:categories,id'],\n            'image' => ['nullable', 'image', 'mimes:jpg,png,webp', 'max:2048'],\n        ];\n    }\n\n    public function messages(): array\n    {\n        return [\n            'name.required' => 'Le nom du produit est obligatoire.',\n            'price.numeric' => 'Le prix doit être un nombre.',\n        ];\n    }\n\n    public function attributes(): array\n    {\n        return ['category_id' => 'catégorie'];\n    }\n}\n\nUtilisation dans le contrôleur :\npublic function store(StoreProductRequest $request)\n{\n    // La validation est déjà faite automatiquement\n    // Si erreur : redirection avec les erreurs\n    $product = Product::create($request->validated());\n    return redirect()->route('products.index');\n}",
          "bareme": "+1 / -1"
        },
        {
          "numero": "8",
          "enonce": "Quel design pattern est principalement utilisé dans les Facades de Laravel ?\nA. Strategy  B. Facade  C. Proxy  D. Singleton",
          "correction": "Réponses correctes : B. Facade (et secondairement D. Singleton)\n\nExplication :\nLes 'Facades' de Laravel implémentent le pattern Facade (du Gang of Four) : elles fournissent une interface statique simple à des services complexes du conteneur d'injection de dépendances.\n\nEn arrière-plan, elles utilisent aussi le pattern Singleton car le service résolu depuis le conteneur est généralement instancié une seule fois (binding singleton).\n\nFonctionnement interne d'une Facade :\n<?php\nnamespace Illuminate\\Support\\Facades;\n\nabstract class Facade\n{\n    public static function __callStatic($method, $args)\n    {\n        $instance = static::resolveFacadeInstance(static::getFacadeAccessor());\n        return $instance->$method(...$args);\n    }\n}\n\n// Exemple : Cache::get('key')\n// → __callStatic('get', ['key'])\n// → résout le service 'cache' depuis le container\n// → appelle get('key') sur l'instance\n\nExemple de Facade personnalisée :\n// 1. Créer le service\nclass PaymentService\n{\n    public function charge($amount) { /* ... */ }\n}\n\n// 2. Binder dans AppServiceProvider\n$this->app->singleton('payment', PaymentService::class);\n\n// 3. Créer la Facade\nclass Payment extends Facade\n{\n    protected static function getFacadeAccessor() { return 'payment'; }\n}\n\n// 4. Utilisation\nPayment::charge(100);\n\nLa réponse principale attendue est B. Facade (le nom du pattern correspond directement).",
          "bareme": "+1 / -1"
        },
        {
          "numero": "9",
          "enonce": "Dans un projet Laravel, quel fichier permet d'enregistrer manuellement une liaison dans le conteneur d'injection de dépendances ?\nA. bootstrap/app.php\nB. app/Providers/AppServiceProvider.php\nC. config/app.php\nD. routes/web.php",
          "correction": "Réponse correcte : B. app/Providers/AppServiceProvider.php\n\nExplication :\nLe fichier AppServiceProvider.php est le Service Provider principal de l'application. Sa méthode register() est l'endroit standard pour enregistrer des liaisons (bindings) dans le conteneur IoC.\n\nExemple :\n<?php\nnamespace App\\Providers;\n\nuse Illuminate\\Support\\ServiceProvider;\nuse App\\Services\\PaymentService;\nuse App\\Services\\Contracts\\PaymentInterface;\nuse App\\Services\\StripePayment;\n\nclass AppServiceProvider extends ServiceProvider\n{\n    public function register(): void\n    {\n        // Binding simple (nouvelle instance à chaque résolution)\n        $this->app->bind(PaymentInterface::class, StripePayment::class);\n\n        // Singleton (une seule instance partagée)\n        $this->app->singleton('payment', function ($app) {\n            return new PaymentService(config('services.stripe.key'));\n        });\n\n        // Instance déjà créée\n        $this->app->instance('config.api', $apiConfig);\n\n        // Binding contextuel (différent selon le contrôleur)\n        $this->app->when(VideoController::class)\n            ->needs(Filesystem::class)\n            ->give(function () {\n                return Storage::disk('s3');\n            });\n    }\n\n    public function boot(): void\n    {\n        // Code exécuté après que tous les providers soient enregistrés\n    }\n}\n\nNote : config/app.php contient la liste des Service Providers à charger, et bootstrap/app.php est le point d'entrée du bootstrap (Laravel 11+ y centralise davantage de configuration).",
          "bareme": "+1 / -1"
        },
        {
          "numero": "10",
          "enonce": "Quelle méthode Eloquent est utilisée pour empêcher une propriété d'être mass-assignable ?\nA. $protect = []  B. $guarded = []  C. $fillable = []  D. $hidden = []",
          "correction": "Réponse correcte : B. $guarded = []\n\nExplication :\nDans Eloquent, deux propriétés contrôlent le mass assignment (assignation en masse depuis un tableau, ex: Model::create($request->all())) :\n\n- $fillable : LISTE BLANCHE - tableau des colonnes AUTORISÉES en mass assignment.\n- $guarded : LISTE NOIRE - tableau des colonnes INTERDITES en mass assignment.\n\nIl faut utiliser L'UN OU L'AUTRE, pas les deux.\n\nExemple avec $guarded :\nclass User extends Model\n{\n    // Empêche la mass-assignation de role et is_admin\n    protected $guarded = ['role', 'is_admin'];\n}\n\nExemple avec $fillable (recommandé, plus sûr) :\nclass User extends Model\n{\n    // Seuls ces champs peuvent être mass-assignés\n    protected $fillable = ['name', 'email', 'password'];\n}\n\nNote sur $hidden : cette propriété sert à cacher des attributs lors de la sérialisation JSON (ex: cacher password), pas à protéger du mass assignment.\n\nprotected $hidden = ['password', 'remember_token'];\n// $user->toArray() ne contiendra pas password\n\nIMPORTANT : depuis Laravel 8, $guarded = [] (tableau vide) signifie 'aucune protection' ! Il faut être explicite. Pour bloquer le mass assignment global non protégé :\nModel::preventLazyLoading();\nModel::shouldBeStrict();\n\nLa réponse à la question est B. $guarded = [] est la propriété conçue pour cet usage (bien que la valeur [] désactive en fait la protection).",
          "bareme": "+1 / -1"
        },
        {
          "numero": "11",
          "enonce": "Quelle méthode d'un observer Laravel est appelée juste après la création d'un modèle ?\nA. creating()  B. created()  C. onCreate()  D. createdAfter()",
          "correction": "Réponse correcte : B. created()\n\nExplication :\nLes Observers Eloquent ont des méthodes spécifiques pour chaque événement du cycle de vie d'un modèle :\n\n- retrieved() : après chargement depuis la BDD\n- creating()  : AVANT l'insertion en BDD\n- created()   : APRÈS l'insertion en BDD ← réponse à la question\n- updating()  : AVANT la mise à jour\n- updated()   : APRÈS la mise à jour\n- saving()    : AVANT create OU update\n- saved()     : APRÈS create OU update\n- deleting()  : AVANT la suppression\n- deleted()   : APRÈS la suppression\n- restoring() / restored() : pour les SoftDeletes\n\nExemple complet :\nphp artisan make:observer UserObserver --model=User\n\n<?php\nnamespace App\\Observers;\n\nuse App\\Models\\User;\nuse App\\Notifications\\WelcomeNotification;\n\nclass UserObserver\n{\n    public function creating(User $user): void\n    {\n        // Avant insertion : on peut modifier l'utilisateur\n        $user->uuid = (string) Str::uuid();\n    }\n\n    public function created(User $user): void\n    {\n        // Après insertion : l'ID est connu\n        $user->notify(new WelcomeNotification());\n        Log::info(\"Nouvel utilisateur créé : {$user->id}\");\n    }\n\n    public function updated(User $user): void\n    {\n        if ($user->wasChanged('email')) {\n            // Action si l'email a changé\n        }\n    }\n}\n\nEnregistrement dans AppServiceProvider (méthode boot) :\nUser::observe(UserObserver::class);\n\n// Depuis Laravel 11, on peut utiliser l'attribut #[ObservedBy] :\n#[ObservedBy([UserObserver::class])]\nclass User extends Model { /* ... */ }",
          "bareme": "+1 / -1"
        },
        {
          "numero": "12",
          "enonce": "En cas d'erreur dans une migration, quelle commande permet d'annuler la dernière migration exécutée ?\nA. php artisan migrate:undo\nB. php artisan migrate:rollback\nC. php artisan rollback:migration\nD. php artisan migrate:down",
          "correction": "Réponse correcte : B. php artisan migrate:rollback\n\nExplication :\nLa commande officielle pour annuler les dernières migrations est :\nphp artisan migrate:rollback\n\nElle exécute la méthode down() des migrations du dernier 'batch' (lot).\n\nOptions utiles :\n# Annuler le dernier batch\nphp artisan migrate:rollback\n\n# Annuler les N derniers steps\nphp artisan migrate:rollback --step=3\n\n# Annuler TOUTES les migrations\nphp artisan migrate:reset\n\n# Reset + migrate (réinitialise tout)\nphp artisan migrate:refresh\n\n# Drop toutes les tables + migrate\nphp artisan migrate:fresh\n\n# Refresh + exécution des seeders\nphp artisan migrate:refresh --seed\n\n# Fresh + seeders (le plus utilisé en dev)\nphp artisan migrate:fresh --seed\n\nLes autres réponses sont incorrectes :\n- a) migrate:undo : n'existe pas (c'est une commande Doctrine/JPA dans le monde Java).\n- c) rollback:migration : ordre inverse, n'existe pas.\n- d) migrate:down : n'existe pas en CLI ; down() est seulement la méthode appelée par rollback dans les fichiers de migration.\n\nExemple de migration :\n<?php\nuse Illuminate\\Database\\Migrations\\Migration;\nuse Illuminate\\Database\\Schema\\Blueprint;\nuse Illuminate\\Support\\Facades\\Schema;\n\nreturn new class extends Migration {\n    public function up(): void {\n        Schema::create('products', function (Blueprint $table) {\n            $table->id();\n            $table->string('name');\n            $table->decimal('price', 10, 2);\n            $table->timestamps();\n        });\n    }\n\n    public function down(): void {\n        Schema::dropIfExists('products');\n    }\n};",
          "bareme": "+1 / -1"
        },
        {
          "numero": "13",
          "enonce": "Le fichier composer.json d'un projet Laravel peut contenir une clé autoload > psr-4. À quoi sert-elle ?\nA. Charger les vues Blade\nB. Charger les classes selon leur namespace\nC. Générer les factories\nD. Charger les routes automatiquement",
          "correction": "Réponse correcte : B. Charger les classes selon leur namespace\n\nExplication :\nPSR-4 est un standard PHP (PHP Standards Recommendations) qui définit la convention d'autoloading basée sur les namespaces. Composer génère un autoloader qui mappe automatiquement un namespace à un dossier.\n\nExtrait typique d'un composer.json Laravel :\n{\n    \"autoload\": {\n        \"psr-4\": {\n            \"App\\\\\": \"app/\",\n            \"Database\\\\Factories\\\\\": \"database/factories/\",\n            \"Database\\\\Seeders\\\\\": \"database/seeders/\"\n        }\n    },\n    \"autoload-dev\": {\n        \"psr-4\": {\n            \"Tests\\\\\": \"tests/\"\n        }\n    }\n}\n\nSignification :\n- App\\Http\\Controllers\\UserController → app/Http/Controllers/UserController.php\n- App\\Models\\Post → app/Models/Post.php\n- Tests\\Feature\\HomeTest → tests/Feature/HomeTest.php\n\nAprès avoir ajouté une nouvelle entrée PSR-4, il faut régénérer le fichier autoload :\ncomposer dump-autoload\n# ou en optimisé pour la production :\ncomposer dump-autoload -o\n\nAvantages :\n- Plus besoin de require/include manuel\n- Performance : chargement à la demande\n- Standardisation entre frameworks PHP\n\nLes autres réponses (vues, factories, routes) sont gérées par d'autres mécanismes Laravel.",
          "bareme": "+1 / -1"
        },
        {
          "numero": "14",
          "enonce": "Que permet la méthode boot() d'un ServiceProvider dans Laravel ?\nA. Instancier les contrôleurs\nB. Déclencher des événements ou liaisons après l'enregistrement des services\nC. Lancer une migration\nD. Enregistrer un alias",
          "correction": "Réponse correcte : B. Déclencher des événements ou liaisons après l'enregistrement des services\n\nExplication :\nUn ServiceProvider Laravel possède deux méthodes principales :\n\n1) register() : appelée EN PREMIER, sert UNIQUEMENT à enregistrer des bindings dans le conteneur IoC. Ne PAS y accéder à d'autres services car ils peuvent ne pas être encore enregistrés.\n\n2) boot() : appelée APRÈS que TOUS les providers ont été enregistrés. C'est ici qu'on configure les services, déclare des observers, événements, view composers, validators, routes, macros, etc.\n\nExemple complet :\n<?php\nnamespace App\\Providers;\n\nuse Illuminate\\Support\\ServiceProvider;\nuse Illuminate\\Support\\Facades\\View;\nuse Illuminate\\Support\\Facades\\Validator;\nuse Illuminate\\Pagination\\Paginator;\nuse Illuminate\\Database\\Eloquent\\Model;\nuse App\\Models\\User;\nuse App\\Observers\\UserObserver;\n\nclass AppServiceProvider extends ServiceProvider\n{\n    public function register(): void\n    {\n        // Bindings seulement\n        $this->app->singleton('payment', PaymentService::class);\n    }\n\n    public function boot(): void\n    {\n        // Observers\n        User::observe(UserObserver::class);\n\n        // View composers\n        View::composer('layouts.app', function ($view) {\n            $view->with('cartCount', auth()->user()?->cartItems()->count());\n        });\n\n        // Règle de validation personnalisée\n        Validator::extend('cni_cameroonien', function ($attr, $value) {\n            return preg_match('/^[0-9]{9}$/', $value);\n        });\n\n        // Macro de Collection\n        \\Illuminate\\Support\\Collection::macro('toUpper', function () {\n            return $this->map(fn($v) => strtoupper($v));\n        });\n\n        // Configuration Bootstrap pour la pagination\n        Paginator::useBootstrapFive();\n\n        // Mode strict\n        Model::shouldBeStrict(!app()->isProduction());\n    }\n}",
          "bareme": "+1 / -1"
        },
        {
          "numero": "15",
          "enonce": "Dans Laravel, quel est le rôle du fichier Handler.php dans app/Exceptions ?\nA. Configurer les middlewares\nB. Gérer les erreurs et les exceptions personnalisées\nC. Lancer les jobs\nD. Traiter les routes",
          "correction": "Réponse correcte : B. Gérer les erreurs et les exceptions personnalisées\n\nExplication :\nLe fichier app/Exceptions/Handler.php (Laravel 10 et antérieur) centralise la gestion des exceptions de l'application : conversion en réponses HTTP, logging, exceptions à ne pas logger, rendu personnalisé.\n\nExemple typique :\n<?php\nnamespace App\\Exceptions;\n\nuse Illuminate\\Foundation\\Exceptions\\Handler as ExceptionHandler;\nuse Throwable;\nuse App\\Exceptions\\PaymentException;\nuse Illuminate\\Auth\\AuthenticationException;\nuse Illuminate\\Validation\\ValidationException;\nuse Illuminate\\Database\\Eloquent\\ModelNotFoundException;\n\nclass Handler extends ExceptionHandler\n{\n    // Exceptions à NE PAS logger\n    protected $dontReport = [\n        ValidationException::class,\n    ];\n\n    // Champs à ne jamais flasher dans la session (sécurité)\n    protected $dontFlash = [\n        'current_password', 'password', 'password_confirmation',\n    ];\n\n    public function register(): void\n    {\n        // Logging personnalisé pour certaines exceptions\n        $this->reportable(function (PaymentException $e) {\n            logger()->channel('payments')->error($e->getMessage());\n        });\n\n        // Rendu personnalisé\n        $this->renderable(function (PaymentException $e, $request) {\n            if ($request->expectsJson()) {\n                return response()->json([\n                    'error' => 'Echec du paiement',\n                    'message' => $e->getMessage(),\n                ], 402);\n            }\n            return response()->view('errors.payment', [], 402);\n        });\n\n        // 404 personnalisé pour les API\n        $this->renderable(function (ModelNotFoundException $e, $request) {\n            if ($request->is('api/*')) {\n                return response()->json(['error' => 'Ressource introuvable'], 404);\n            }\n        });\n    }\n}\n\nNote : depuis Laravel 11, ce fichier n'existe plus par défaut. La configuration des exceptions se fait dans bootstrap/app.php via withExceptions().",
          "bareme": "+1 / -1"
        },
        {
          "numero": "16",
          "enonce": "Quelle méthode est utilisée pour définir des macros personnalisées sur des classes de Laravel ?\nA. macroable()  B. macro()  C. defineMacro()  D. addMacro()",
          "correction": "Réponse correcte : B. macro()\n\nExplication :\nLes classes utilisant le trait Macroable (Collection, Str, Arr, Request, Response, etc.) permettent d'ajouter des méthodes personnalisées via ::macro().\n\nDéfinition dans AppServiceProvider::boot() :\n<?php\nuse Illuminate\\Support\\Collection;\nuse Illuminate\\Support\\Str;\nuse Illuminate\\Http\\Request;\n\npublic function boot(): void\n{\n    // Macro sur Collection : toUpper()\n    Collection::macro('toUpper', function () {\n        return $this->map(fn ($value) => strtoupper($value));\n    });\n\n    // Macro sur Str : titleSnake()\n    Str::macro('titleSnake', function (string $value) {\n        return Str::snake(Str::title($value));\n    });\n\n    // Macro sur Request\n    Request::macro('isAjax', function () {\n        return $this->ajax() || $this->wantsJson();\n    });\n}\n\nUtilisation :\ncollect(['a', 'b'])->toUpper();           // ['A', 'B']\nStr::titleSnake('hello world');           // 'hello_world'\n$request->isAjax();\n\nNotes :\n- a) macroable() : c'est le nom du trait, pas une méthode publique.\n- c) defineMacro() : n'existe pas.\n- d) addMacro() : n'existe pas.\n\nLes Mixins (groupes de macros) sont aussi possibles :\nCollection::mixin(new CollectionMixin);",
          "bareme": "+1 / -1"
        },
        {
          "numero": "17",
          "enonce": "Que retourne par défaut un ResourceController créé avec --resource ?\nA. Une vue Blade\nB. Un contrôleur avec les méthodes CRUD pré-générées\nC. Un modèle lié\nD. Un fichier de migration",
          "correction": "Réponse correcte : B. Un contrôleur avec les méthodes CRUD pré-générées\n\nExplication :\nLa commande php artisan make:controller NomController --resource génère un contrôleur préformaté avec les 7 méthodes CRUD vides.\n\nCommande :\nphp artisan make:controller ProductController --resource --model=Product\n\nFichier généré (app/Http/Controllers/ProductController.php) :\n<?php\nnamespace App\\Http\\Controllers;\n\nuse App\\Models\\Product;\nuse Illuminate\\Http\\Request;\n\nclass ProductController extends Controller\n{\n    public function index()\n    {\n        $products = Product::paginate(15);\n        return view('products.index', compact('products'));\n    }\n\n    public function create()\n    {\n        return view('products.create');\n    }\n\n    public function store(Request $request)\n    {\n        $validated = $request->validate([\n            'name' => 'required|string|max:255',\n            'price' => 'required|numeric|min:0',\n        ]);\n        Product::create($validated);\n        return redirect()->route('products.index');\n    }\n\n    public function show(Product $product)\n    {\n        return view('products.show', compact('product'));\n    }\n\n    public function edit(Product $product)\n    {\n        return view('products.edit', compact('product'));\n    }\n\n    public function update(Request $request, Product $product)\n    {\n        $validated = $request->validate([\n            'name' => 'required|string|max:255',\n            'price' => 'required|numeric|min:0',\n        ]);\n        $product->update($validated);\n        return redirect()->route('products.show', $product);\n    }\n\n    public function destroy(Product $product)\n    {\n        $product->delete();\n        return redirect()->route('products.index');\n    }\n}\n\nOptions utiles :\n--api : génère seulement index, store, show, update, destroy (sans create/edit)\n--invokable : crée un contrôleur avec une seule méthode __invoke()\n--requests : crée aussi les FormRequests StoreXxxRequest et UpdateXxxRequest",
          "bareme": "+1 / -1"
        },
        {
          "numero": "18",
          "enonce": "À quoi sert la méthode middleware() dans une définition de route ?\nA. Ajouter des paramètres\nB. Appliquer une couche de traitement avant l'exécution de la route\nC. Créer un filtre de validation\nD. Associer la route à un modèle",
          "correction": "Réponse correcte : B. Appliquer une couche de traitement avant l'exécution de la route\n\nExplication :\nUn middleware est une couche intermédiaire qui s'exécute AVANT (et/ou APRÈS) l'action du contrôleur. Il peut authentifier, autoriser, modifier la requête/réponse, logger, etc.\n\nExemple : un middleware d'authentification empêche l'accès aux invités.\n\nDéfinition de middlewares :\n# Créer un middleware\nphp artisan make:middleware EnsureUserIsActive\n\nClasse middleware :\n<?php\nnamespace App\\Http\\Middleware;\n\nuse Closure;\nuse Illuminate\\Http\\Request;\n\nclass EnsureUserIsActive\n{\n    public function handle(Request $request, Closure $next)\n    {\n        if (! $request->user() || ! $request->user()->is_active) {\n            return redirect()->route('login')\n                ->with('error', 'Votre compte est désactivé.');\n        }\n        return $next($request);\n    }\n}\n\nEnregistrement (Laravel 10 - app/Http/Kernel.php) :\nprotected $middlewareAliases = [\n    'active' => \\App\\Http\\Middleware\\EnsureUserIsActive::class,\n];\n\n// Laravel 11 - bootstrap/app.php :\n->withMiddleware(function (Middleware $middleware) {\n    $middleware->alias([\n        'active' => \\App\\Http\\Middleware\\EnsureUserIsActive::class,\n    ]);\n})\n\nApplication sur une route :\nRoute::get('/dashboard', [DashboardController::class, 'index'])\n    ->middleware(['auth', 'active', 'verified']);\n\nMiddleware avec paramètre :\nRoute::get('/admin', [AdminController::class, 'index'])\n    ->middleware('role:admin'); // role est défini avec $role en paramètre\n\npublic function handle($request, Closure $next, $role)\n{\n    if ($request->user()->role !== $role) abort(403);\n    return $next($request);\n}",
          "bareme": "+1 / -1"
        },
        {
          "numero": "19",
          "enonce": "Dans le système de notifications Laravel, que signifie la méthode toDatabase() ?\nA. Envoyer la notification par e-mail\nB. Enregistrer la notification dans la base de données\nC. Envoyer à plusieurs utilisateurs\nD. Envoyer dans le fichier log",
          "correction": "Réponse correcte : B. Enregistrer la notification dans la base de données\n\nExplication :\nLes notifications Laravel peuvent être envoyées via plusieurs canaux : mail, database, broadcast, sms (Vonage/Nexmo), slack, etc. La méthode toDatabase() définit le contenu stocké dans la table 'notifications' lorsque le canal 'database' est utilisé.\n\nProcédure complète :\n\n1) Créer la table notifications :\nphp artisan notifications:table\nphp artisan migrate\n\n2) Préparer le modèle User :\nuse Illuminate\\Notifications\\Notifiable;\n\nclass User extends Authenticatable\n{\n    use Notifiable; // donne accès à $user->notify() et $user->notifications\n}\n\n3) Créer une notification :\nphp artisan make:notification InvoicePaid\n\n4) Implémenter la notification :\n<?php\nnamespace App\\Notifications;\n\nuse Illuminate\\Bus\\Queueable;\nuse Illuminate\\Notifications\\Notification;\nuse Illuminate\\Notifications\\Messages\\MailMessage;\nuse App\\Models\\Invoice;\n\nclass InvoicePaid extends Notification\n{\n    use Queueable;\n\n    public function __construct(public Invoice $invoice) {}\n\n    public function via($notifiable): array\n    {\n        return ['mail', 'database'];\n    }\n\n    public function toMail($notifiable): MailMessage\n    {\n        return (new MailMessage)\n            ->subject('Facture payée')\n            ->greeting('Bonjour ' . $notifiable->name)\n            ->line('Votre facture #' . $this->invoice->id . ' a bien été payée.')\n            ->action('Voir la facture', route('invoices.show', $this->invoice))\n            ->success();\n    }\n\n    public function toDatabase($notifiable): array\n    {\n        return [\n            'invoice_id' => $this->invoice->id,\n            'amount' => $this->invoice->total,\n            'message' => 'Facture #' . $this->invoice->id . ' payée',\n        ];\n    }\n}\n\n5) Envoyer la notification :\n$user->notify(new InvoicePaid($invoice));\n// Ou pour plusieurs :\nNotification::send($users, new InvoicePaid($invoice));\n\n6) Récupérer les notifications côté utilisateur :\n$user->notifications;          // toutes\n$user->unreadNotifications;    // non lues\n$notification->markAsRead();   // marquer lue",
          "bareme": "+1 / -1"
        },
        {
          "numero": "20",
          "enonce": "Dans Laravel, que fait la commande php artisan tinker ?\nA. Lance un serveur local\nB. Lance une interface REPL pour interagir avec les classes Laravel\nC. Compile les vues Blade\nD. Crée une nouvelle base de données",
          "correction": "Réponse correcte : B. Lance une interface REPL pour interagir avec les classes Laravel\n\nExplication :\nphp artisan tinker ouvre un REPL (Read-Eval-Print Loop) basé sur PsySH. C'est un outil INDISPENSABLE pour tester rapidement du code, interroger les modèles Eloquent, déboguer, etc.\n\nLancement :\nphp artisan tinker\n\nExemples de commandes utiles :\n# Compter les utilisateurs\n>>> User::count()\n=> 42\n\n# Récupérer un utilisateur\n>>> $user = User::find(1)\n=> App\\Models\\User { ... }\n\n# Créer un utilisateur de test\n>>> User::factory()->create([\n...     'email' => 'test@example.com'\n... ])\n\n# Tester une relation\n>>> User::with('posts')->first()->posts\n\n# Hasher un mot de passe\n>>> bcrypt('password')\n=> '$2y$10$...'\n\n# Tester un envoi de mail (en mode log)\n>>> Mail::raw('Bonjour', fn($m) => $m->to('a@b.cm')->subject('Test'))\n\n# Tester une notification\n>>> User::first()->notify(new \\App\\Notifications\\TestNotification)\n\n# Tester une Job\n>>> dispatch(new \\App\\Jobs\\ProcessOrder($order))\n\n# Quitter\n>>> exit\n\nAutres commandes Artisan utiles à connaître :\n- php artisan serve : lance le serveur de dev (réponse A trompeuse mais c'est 'serve', pas 'tinker')\n- php artisan view:cache : compile et cache les vues Blade (réponse C)\n- php artisan migrate : exécute les migrations (proche de la réponse D)\n\nDonc seule la réponse B correspond à tinker.",
          "bareme": "+1 / -1"
        }
      ]
    }
  ],
  "ia": [
    {
      "titre": "RATTRAPAGE CC — Intelligence Artificielle (Année 2025-2026)",
      "source": "IAI Cameroun, Génie Logiciel niveau 3, durée 1h, /20 pts",
      "questions": [
        {
          "numero": "Ex1.1",
          "enonce": "Quelle est la différence fondamentale entre l'approche de la programmation classique et celle du Machine Learning ?",
          "correction": "En programmation classique, l'humain écrit EXPLICITEMENT les règles que la machine exécute : (entrée + règles → sortie). On code chaque cas particulier.\n\nEn Machine Learning, la machine APPREND les règles à partir d'exemples : (entrées + sorties attendues → règles induites). On fournit des données étiquetées et l'algorithme déduit lui-même les patterns. C'est l'inversion du paradigme : on ne programme plus les règles, on programme l'apprentissage de ces règles.",
          "bareme": "1 pt"
        },
        {
          "numero": "Ex1.2",
          "enonce": "Définissez brièvement la notion d'« Agent intelligent » dans un environnement informatique.",
          "correction": "Un agent intelligent est une entité autonome qui :\n• PERÇOIT son environnement via des capteurs (sensors)\n• RAISONNE ou APPREND pour prendre une décision\n• AGIT sur cet environnement via des effecteurs (actuators) pour atteindre des objectifs définis\n\nIl est caractérisé par PEAS (Performance, Environment, Actuators, Sensors). Exemples : chatbot, robot autonome, système de recommandation Netflix, thermostat intelligent, voiture autonome.",
          "bareme": "1 pt"
        },
        {
          "numero": "Ex1.3",
          "enonce": "Expliquez le concept d'« espace d'états » dans un problème de recherche.",
          "correction": "L'espace d'états est l'ensemble de TOUTES les configurations possibles (états) que peut prendre un problème, reliées entre elles par des transitions (actions/opérateurs). Un problème de recherche est défini par :\n• un ÉTAT INITIAL (point de départ)\n• un ensemble d'ACTIONS applicables à chaque état\n• une FONCTION DE TRANSITION (état + action → nouvel état)\n• un TEST DE BUT (est-on dans un état objectif ?)\n• une FONCTION DE COÛT\n\nExemple : pour un Rubik's cube, chaque arrangement des facettes est un état ; les rotations sont les actions ; l'espace d'états contient ~43 × 10^18 configurations.",
          "bareme": "1 pt"
        },
        {
          "numero": "Ex1.4",
          "enonce": "Quelle est la principale différence entre les algorithmes de recherche non informée (BFS/DFS) et les algorithmes de recherche informée (A*) ?",
          "correction": "La recherche NON INFORMÉE (aveugle : BFS, DFS, coût uniforme) explore l'espace d'états sans aucune information sur la distance restante au but. Elle parcourt systématiquement selon une stratégie fixe (largeur ou profondeur).\n\nLa recherche INFORMÉE utilise une HEURISTIQUE h(n) qui estime le coût restant entre un nœud n et le but. Cela guide l'exploration vers les zones prometteuses. A* combine le coût réel g(n) parcouru et l'estimation h(n) : f(n) = g(n) + h(n). Si h est admissible (ne surestime jamais), A* est OPTIMAL et COMPLET, tout en explorant beaucoup moins de nœuds que BFS.",
          "bareme": "1 pt"
        },
        {
          "numero": "Ex1.5",
          "enonce": "Dans le contexte de l'apprentissage supervisé, à quoi sert la phase d'évaluation à l'aide d'un jeu de données de test (test set) ?",
          "correction": "Le test set sert à évaluer la capacité de GÉNÉRALISATION du modèle sur des données qu'il n'a JAMAIS vues durant l'entraînement. Il permet de :\n• Mesurer la performance réelle (accuracy, précision, rappel, F1, AUC, MSE...)\n• Détecter le SURAPPRENTISSAGE (overfitting) : si le modèle est excellent sur le train mais mauvais sur le test, il a appris par cœur au lieu de généraliser\n• Comparer objectivement plusieurs modèles\n• Estimer l'erreur attendue en production\n\nLe test set doit rester totalement isolé pendant l'entraînement (pas de fuite de données). Découpage classique : 70% train / 15% validation / 15% test.",
          "bareme": "1 pt"
        },
        {
          "numero": "Ex1.6",
          "enonce": "Citez deux algorithmes couramment utilisés pour résoudre des problèmes de classification en Machine Learning.",
          "correction": "Algorithmes de classification courants :\n• Régression logistique (Logistic Regression) — classification binaire/multi-classes via sigmoïde/softmax\n• Arbres de décision (Decision Trees) et leurs ensembles : Random Forest, Gradient Boosting (XGBoost, LightGBM)\n• SVM (Support Vector Machines) — séparation par hyperplan maximisant la marge\n• k-NN (k-Nearest Neighbors) — vote majoritaire des k plus proches voisins\n• Naïve Bayes — basé sur le théorème de Bayes avec hypothèse d'indépendance\n• Réseaux de neurones (Perceptron multicouche, CNN pour images)",
          "bareme": "1 pt"
        },
        {
          "numero": "Ex1.7",
          "enonce": "Qu'est-ce que le partitionnement de données (clustering) et s'agit-il d'un apprentissage supervisé ou non supervisé ?",
          "correction": "Le clustering (partitionnement) est une technique d'apprentissage NON SUPERVISÉ. Il regroupe automatiquement les données en clusters/groupes homogènes selon leur similarité (distance), SANS étiquettes prédéfinies.\n\nLe modèle découvre seul la structure cachée des données. Algorithmes principaux :\n• k-means : k clusters fixés à l'avance, optimise les centroïdes\n• DBSCAN : basé sur la densité, détecte automatiquement le nombre de clusters\n• CAH (Classification Ascendante Hiérarchique) : agglomération progressive → dendrogramme\n• Mean-shift, Gaussian Mixture Models (GMM)\n\nApplications : segmentation client, détection d'anomalies, compression d'images.",
          "bareme": "1 pt"
        },
        {
          "numero": "Ex1.8",
          "enonce": "Quelle est la fonction principale d'un « Perceptron » au sein d'un réseau de neurones ?",
          "correction": "Le Perceptron est l'UNITÉ DE BASE d'un réseau de neurones (inventé par Rosenblatt, 1958). Sa fonction principale est de :\n\n1. Calculer une combinaison linéaire pondérée des entrées + biais :\n   z = Σ(wᵢ × xᵢ) + b\n\n2. Appliquer une fonction d'activation (Heaviside, sigmoïde, ReLU, tanh) :\n   ŷ = f(z)\n\nIl sépare l'espace d'entrée en 2 classes via un HYPERPLAN. Un seul Perceptron ne peut résoudre que les problèmes linéairement séparables (limite du XOR). En empilant plusieurs perceptrons en couches (MLP — Multi-Layer Perceptron), on obtient un réseau de neurones capable d'approximer des fonctions complexes (théorème d'approximation universelle).",
          "bareme": "1 pt"
        },
        {
          "numero": "Ex2.1",
          "enonce": "Représentation architecturale : Schématisez la structure du Perceptron en faisant apparaître les entrées, poids, biais, sommateur, fonction d'activation et sortie.",
          "correction": "Schéma textuel du Perceptron :\n\n           w₁ = 0.5\n  x₁ ───────────────►┐\n                     │     ┌─────────┐     ┌──────────────┐\n                     ├────►│ Σ (z)   ├────►│ f (Heaviside)├────► ŷ\n                     │     │ Somme   │     │ seuil à 0    │\n  x₂ ───────────────►┘     └─────────┘     └──────────────┘\n           w₂ = -0.8           ▲\n                                │\n                              b = 0.2\n                              (biais)\n\nÉléments :\n• 2 ENTRÉES : x₁ et x₂\n• 2 POIDS : w₁ = 0.5 et w₂ = -0.8 (sur les connexions)\n• BIAIS : b = 0.2 (constante ajoutée à la somme)\n• SOMMATEUR Σ : calcule z = w₁·x₁ + w₂·x₂ + b\n• FONCTION D'ACTIVATION f : Heaviside (seuil) — f(z) = 1 si z ≥ 0, sinon 0\n• SORTIE : ŷ ∈ {0, 1}",
          "bareme": "3 pts"
        },
        {
          "numero": "Ex2.2a",
          "enonce": "Propagation avant — Calculer la combinaison linéaire z pour X = [x₁ = 2, x₂ = 1.5].",
          "correction": "Formule : z = w₁·x₁ + w₂·x₂ + b\n\nApplication numérique :\nz = 0.5 × 2 + (-0.8) × 1.5 + 0.2\nz = 1.0 + (-1.2) + 0.2\nz = 1.0 - 1.2 + 0.2\n\n┌──────────┐\n│  z = 0   │\n└──────────┘",
          "bareme": "2 pts"
        },
        {
          "numero": "Ex2.2b",
          "enonce": "Propagation avant — Déterminer la sortie prédite ŷ (valeur 0 ou 1).",
          "correction": "On applique la fonction d'activation Heaviside : f(z) = 1 si z ≥ 0, sinon 0.\n\nCalcul : z = 0, donc z ≥ 0 → la condition est SATISFAITE.\n\n┌──────────┐\n│  ŷ = 1   │\n└──────────┘\n\nLe Perceptron prédit la classe 1 pour ce vecteur d'entrée.",
          "bareme": "2 pts"
        },
        {
          "numero": "Ex2.3a",
          "enonce": "Mise à jour des paramètres — Sortie attendue y = 0. Calculer l'erreur globale e = y - ŷ.",
          "correction": "Formule de l'erreur : e = y - ŷ\n\nApplication :\ne = 0 - 1\n\n┌───────────┐\n│  e = -1   │\n└───────────┘\n\nInterprétation : le modèle a prédit 1 alors qu'il fallait 0. L'erreur négative indique qu'il faut DIMINUER la sortie → on va RÉDUIRE les poids (vu que les entrées sont positives).",
          "bareme": "1,5 pt"
        },
        {
          "numero": "Ex2.3b",
          "enonce": "Avec η = 0.1, calculer les nouveaux poids w₁, w₂ et le biais b après ajustement. (Règles : Δwᵢ = η · e · xᵢ et Δb = η · e)",
          "correction": "Calcul des ajustements (η = 0.1, e = -1) :\n\n• Δw₁ = η · e · x₁ = 0.1 × (-1) × 2   = -0.2\n• Δw₂ = η · e · x₂ = 0.1 × (-1) × 1.5 = -0.15\n• Δb  = η · e       = 0.1 × (-1)       = -0.1\n\nNouveaux paramètres (Wnew = Wold + ΔW) :\n\n┌─────────────────────────────────────┐\n│  w₁_new = 0.5 + (-0.2)   =  0.3     │\n│  w₂_new = -0.8 + (-0.15) = -0.95    │\n│  b_new  = 0.2 + (-0.1)   =  0.1     │\n└─────────────────────────────────────┘\n\nVÉRIFICATION (propagation avant avec les nouveaux paramètres) :\nz_new = 0.3 × 2 + (-0.95) × 1.5 + 0.1\n      = 0.6 - 1.425 + 0.1\n      = -0.725\n\nz_new < 0 → ŷ_new = 0 ✓ (correspond à la sortie attendue y = 0).\n\nLe modèle a CONVERGÉ en une seule itération sur cet exemple. C'est le principe de la règle d'apprentissage du Perceptron (Rosenblatt 1958).",
          "bareme": "3,5 pts"
        }
      ]
    },
    {
      "titre": "Examen Juin 2024 — Introduction à l'IA",
      "source": "IAI Cameroun, Niveau 3 GL, durée 2h, 20 pts",
      "questions": [
        {
          "numero": "1",
          "enonce": "Lesquelles sont des données ? A) Texte enregistré ; B) Photo de dessert ; C) Idée orale ; D) Poésie écrite ; E) Email.",
          "correction": "Réponses : A, B, D, E. Une donnée doit être enregistrée numériquement. L'idée orale (C) non.",
          "bareme": "1 pt"
        },
        {
          "numero": "2",
          "enonce": "Qu'est-ce que le Big Data ?",
          "correction": "C — Ensemble des données massives enregistrées (5V : Volume, Vélocité, Variété, Véracité, Valeur).",
          "bareme": "1 pt"
        },
        {
          "numero": "3",
          "enonce": "Que permet la Data Science ?",
          "correction": "A et C — Analyser des données massives + Prédire actions/comportements.",
          "bareme": "1 pt"
        },
        {
          "numero": "4",
          "enonce": "Le ML est sous-discipline de :",
          "correction": "A et B — Data Science et IA. ML ⊂ IA ⊂ Data Science.",
          "bareme": "1 pt"
        },
        {
          "numero": "5",
          "enonce": "Le ML permet des programmes :",
          "correction": "A — Capables d'apprendre par eux-mêmes. C'est la définition.",
          "bareme": "1 pt"
        },
        {
          "numero": "6",
          "enonce": "Deep Learning est sous-discipline :",
          "correction": "C — Machine Learning. DL = branche du ML (réseaux profonds).",
          "bareme": "1 pt"
        },
        {
          "numero": "7",
          "enonce": "Caractéristiques d'un programme d'IA ?",
          "correction": "B — Raisonne vite sur sujet spécifique. Pas d'émotions, peut être détourné, ne remplace pas l'humain partout.",
          "bareme": "1 pt"
        },
        {
          "numero": "8",
          "enonce": "Les acteurs du numérique utilisent les données pour :",
          "correction": "A, B, C — Cibler pubs, adapter services, entraîner algos. D (armée française) fantaisiste.",
          "bareme": "1 pt"
        },
        {
          "numero": "9",
          "enonce": "Quel résultat comporte un biais algorithmique ?",
          "correction": "A — Femmes jugées moins capables pour postes à responsabilité. Reproduit une inégalité historique.",
          "bareme": "1 pt"
        },
        {
          "numero": "10",
          "enonce": "Qu'est-ce qu'un deepfake ?",
          "correction": "B — Trucage hyperréaliste d'image/vidéo (généré par GAN).",
          "bareme": "1 pt"
        },
        {
          "numero": "11",
          "enonce": "Comment l'IA modifie-t-elle le travail ?",
          "correction": "A et B — Effectue tâches automatisables + remplace métiers routiniers. D (division par 2) non prouvé.",
          "bareme": "1 pt"
        },
        {
          "numero": "12",
          "enonce": "En quoi consiste le nettoyage des données ?",
          "correction": "A et D — Rendre exploitable + retirer aberrantes. Inclut aussi missing values, doublons, normalisation.",
          "bareme": "1 pt"
        },
        {
          "numero": "13",
          "enonce": "Que montrer au modèle durant entraînement ?",
          "correction": "A — Partie des données extraites de l'exploration (typiquement 70-80%).",
          "bareme": "1 pt"
        },
        {
          "numero": "14",
          "enonce": "Programme organisant images d'animaux selon critères NON définis : quel apprentissage ?",
          "correction": "B — Non supervisé (clustering : k-means, DBSCAN, hiérarchique).",
          "bareme": "1 pt"
        },
        {
          "numero": "15",
          "enonce": "Programme annonçant chat/chien/lapin/souris : quel apprentissage ?",
          "correction": "A — Supervisé. Classes définies à l'avance + labels.",
          "bareme": "1 pt"
        },
        {
          "numero": "16",
          "enonce": "Que permet la convolution ?",
          "correction": "B — Filtrer l'image en kernels (petits filtres qui parcourent et extraient features locales).",
          "bareme": "1 pt"
        },
        {
          "numero": "17",
          "enonce": "Modélisation des données ?",
          "correction": "A — Représenter par règles mathématiques. Traduit le problème métier en formalisme.",
          "bareme": "1 pt"
        },
        {
          "numero": "Exercice",
          "enonce": "Optimiser la consommation énergétique d'une usine via l'IA. Détailler les étapes.",
          "correction": "1) Cadrage (KPIs, contraintes). 2) Collecte (capteurs IoT, météo, prix kWh). 3) Exploration (visualisations temporelles, corrélations). 4) Nettoyage (missing, aberrantes, normalisation). 5) Feature engineering (heure, jour, saison). 6) Modélisation (LSTM/GRU/Prophet/XGBoost pour prévision H+1, H+24). 7) Split 70/15/15 + hyperparams. 8) Évaluation (RMSE, MAE, MAPE vs baseline). 9) Optimisation (PL ou RL pour ordonnancer machines). 10) Déploiement (API REST, dashboard, alertes). 11) Monitoring (drift, réentraînement, ROI).",
          "bareme": "3 pts"
        }
      ]
    },
    {
      "titre": "Rattrapage Juin 2025 — Introduction à l'IA",
      "source": "IAI Cameroun, Niveau 3 GL/SE, durée 1h",
      "questions": [
        {
          "numero": "1",
          "enonce": "1er chatbot au monde ?",
          "correction": "C — ELIZA (Weizenbaum, MIT, 1966).",
          "bareme": "1 pt"
        },
        {
          "numero": "2",
          "enonce": "Père de l'IA ?",
          "correction": "A — Marvin Minsky (avec McCarthy, Newell, Simon, Shannon — Dartmouth 1956).",
          "bareme": "1 pt"
        },
        {
          "numero": "3",
          "enonce": "Affirmation VRAIE ?",
          "correction": "D — Aucune. AGI reste théorique, pas datée par consensus, modèles actuels nécessitent entraînement.",
          "bareme": "1 pt"
        },
        {
          "numero": "4",
          "enonce": "Classifications de l'IA + exemples.",
          "correction": "4 classifications : Machines réactives (Deep Blue, AlphaGo) ; Mémoire limitée (voitures, chatbots, recommandations) ; Théorie de l'esprit (Sophia, Kismet) ; Conscience de soi (hypothétique). Par capacité : faible/AGI/ASI.",
          "bareme": "2 pts"
        },
        {
          "numero": "5",
          "enonce": "Affirmation FAUSSE sur apprentissage ?",
          "correction": "Toutes vraies. Navigation = non supervisé/RL ; supervisé nécessite labels ; classification d'images = supervisé.",
          "bareme": "1 pt"
        },
        {
          "numero": "6",
          "enonce": "Affirmation FAUSSE sur régression logistique ?",
          "correction": "D — Aucune. Sigmoïde = logistique, sortie ∈ [0,1].",
          "bareme": "1 pt"
        },
        {
          "numero": "7",
          "enonce": "Paquet Python qui détonne ?",
          "correction": "A — playwright (test web). Autres = data/IA.",
          "bareme": "1 pt"
        },
        {
          "numero": "8",
          "enonce": "Affirmation FAUSSE sur CNN ?",
          "correction": "C — Les CNN SONT profonds (AlexNet, ResNet).",
          "bareme": "1 pt"
        },
        {
          "numero": "9",
          "enonce": "Technique anti-overfitting ?",
          "correction": "C — Dropout. Désactive aléatoirement neurones (20-50%) → représentations robustes.",
          "bareme": "1 pt"
        },
        {
          "numero": "10",
          "enonce": "Code réseau 3 entrées / 1 cachée 4 neurones / 2 sorties.",
          "correction": "import tensorflow as tf\nfrom tensorflow.keras.models import Sequential\nfrom tensorflow.keras.layers import Dense, Input\nmodel = Sequential([\n    Input(shape=(3,)),\n    Dense(4, activation='relu'),\n    Dense(2, activation='softmax')\n])\nmodel.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])",
          "bareme": "2,5 pts"
        },
        {
          "numero": "11",
          "enonce": "Affirmation FAUSSE sur BFS/DFS ?",
          "correction": "A — DFS pile uniquement pour la FRONTIÈRE (non visités), set pour les visités.",
          "bareme": "1 pt"
        },
        {
          "numero": "12",
          "enonce": "BFS vs DFS avec exemple concret (hors école/objet) ?",
          "correction": "LinkedIn : trouver une personne X via vos relations. BFS visite contacts directs (degré 1), puis 2, puis 3 → '6 degrés de séparation', plus court chemin de mise en relation. DFS suit une chaîne profonde (contact → contact de contact → ...) jusqu'à X ou cul-de-sac. À une bifurcation (un contact connaît 5 personnes) : BFS examine les 5 en parallèle, DFS s'engage dans une seule à fond avant d'essayer les autres.",
          "bareme": "5 pts"
        },
        {
          "numero": "13",
          "enonce": "Recherche informée + comment améliorerait-elle l'exemple ?",
          "correction": "Recherche informée utilise h(n) — estimation de la distance au but. A* : f(n)=g(n)+h(n). Pour LinkedIn : h(n) = similarité de profil (industries, écoles, géographie). On explore prioritairement les contacts ressemblant à X → atteint X en explorant beaucoup moins de profils qu'avec BFS, tout en gardant optimalité si h admissible. LinkedIn fait ça : 'introductions' pondérées par relations communes.",
          "bareme": "2 pts"
        }
      ]
    }
  ],
  "english": [
    {
      "titre": "End of Semester Exam — February Session 2022 — Expert English",
      "source": "IAI Cameroun, Classes GL3 A/B/C, durée 2h",
      "questions": [
        {
          "numero": "Sujet",
          "enonce": "Considering the job offer below, write a one-page APPLICATION LETTER (where a cover letter is not required for that position) and attach documents necessary for a job application file. Address your letter to the Human Resource Manager.\n\n────────────────────────────────────────\nYOUR ADDRESS (imposed)\nEtoga Germain\nSoftware engineer\n690995452\nP.O Box: 089\nBatouri – Cameroon\n\n────────────────────────────────────────\nPOSITION TITLE: Information Technology (IT) Officer\nLocation of Work: Bertoua, Eastern Region\nType of contract: Permanent\n\nJOB PURPOSE\nThe IT Officer maintains the computer networks of all types of organizations, providing technical support and ensuring the whole company runs smoothly. The IT Officer monitors and maintains the company computer systems, installs and configures hardware and software, and solves technical problems.\n\nDUTIES AND RESPONSIBILITIES\n• Technical expertise: troubleshoot applications/services on physical & virtual servers, networks, storage, security ; install/configure hardware/software/printers ; deploy VMware/vSphere ; configure switches/routers/firewalls/VPN ; disaster recovery plans ; maintenance upgrades ; diagnose problems ; electrical safety ; software licenses ; stocks ; user guidance ; troubleshooting & repair ; logs ; place orders.\n• Communication: maintain reports/documentation, professional interactions with supervisors and colleagues.\n• Creativity: generate solutions, build prioritized problem-solving plans.\n\nQUALIFICATIONS, SKILLS & EXPERIENCE\n• Bachelor's degree in Computer Science, Electrical/Computer Engineering or equivalent experience\n• 3 years tech experience (2 years hands-on)\n• Proficient in Windows Server, Linux, VMware, security best practices, LAN/WAN (TCP/IP, DNS, DHCP, SMTP, SNMP)\n• Strong communication, self-motivated, flexible, results-oriented\n• Excellent English (oral & written)",
          "correction": "MODEL ANSWER — Full One-Page Application Letter\n────────────────────────────────────────────────────────\n\nEtoga Germain\nSoftware Engineer\nTel: (+237) 690 99 54 52\nP.O. Box: 089\nBatouri — Cameroon\n\n                                                                  Batouri, 28 May 2026\n\nThe Human Resource Manager\n[Company Name]\nBertoua, Eastern Region\nCameroon\n\nDear Sir / Madam,\n\nSUBJECT: APPLICATION FOR THE POSITION OF INFORMATION TECHNOLOGY (IT) OFFICER\n\nFollowing the job advertisement published by your organisation for the position of IT Officer based in Bertoua, I am pleased to submit my application for your kind consideration. As a Software Engineer with hands-on experience in system administration, network configuration and technical support, I am confident that my profile matches the requirements of this permanent position.\n\nDuring my three years of professional experience, of which more than two have been spent in hands-on technical roles, I have developed proficient skills in the architecture, design and troubleshooting of Windows Server and Linux-based operating systems. I have also gained an adequate understanding of VMware virtualisation (vSphere, vCenter), and I am comfortable with the configuration and maintenance of LAN/WAN components such as switches, routers, firewalls and VPN concentrators, as well as core protocols (TCP/IP, DNS, DHCP, SMTP, SNMP). My background includes the deployment and periodic testing of disaster recovery plans, the management of hardware and software inventories and the daily resolution of user-side incidents.\n\nBeyond technical expertise, I pride myself on being a self-motivated, result-oriented and flexible team player, able to prioritise tasks, meet deadlines and remain effective in a high-pressure on-call environment. I communicate fluently in English and French, both orally and in writing, and I am willing to occasionally work outside normal business hours to keep your information systems secure and available. Joining your organisation would allow me to put my technical and interpersonal skills at the service of your company's growth in the Eastern Region.\n\nI have attached all the documents required for the present application. I remain available for any interview or technical test at your earliest convenience and can be reached on (+237) 690 99 54 52 or by email at etoga.germain@example.com.\n\nThank you very much for the time devoted to reviewing my application. I look forward to the opportunity of discussing my motivation and qualifications with you in person.\n\nYours faithfully,\n\n(Signature)\nETOGA GERMAIN\n\nEnclosures (documents attached to the job application file):\n  1. Curriculum Vitae (Résumé) — 2 pages\n  2. Certified photocopy of Bachelor's degree in Computer Science\n  3. Certified photocopies of professional certificates (Windows Server, Linux, VMware, CCNA)\n  4. Work certificates / employer attestations (3 years of experience)\n  5. Two recent letters of recommendation\n  6. Copy of the National Identity Card\n  7. Recent passport-size photograph (taken less than 3 months ago)\n  8. Criminal record extract (less than 3 months old)\n  9. Birth certificate (certified copy)\n 10. Medical certificate of physical fitness\n\n────────────────────────────────────────────────────────\nMARKING SCHEME (suggested over 20 marks)\n────────────────────────────────────────────────────────\n• Letter layout & format (sender address top, date, receiver address, subject line, salutation, closing) ........ 3 marks\n• Subject line in CAPITALS and clearly identifies the post ............................................... 1 mark\n• Opening paragraph: reference to the advertised position + clear statement of intent ............... 2 marks\n• Body paragraphs: qualifications, technical skills explicitly mapped to the job offer (Windows, Linux, VMware, LAN/WAN, security) ....................................................................... 4 marks\n• Soft skills: communication, flexibility, teamwork, availability (mapped to job) ........................ 2 marks\n• Closing paragraph: availability for interview + contact details ............................................. 1 mark\n• Final salutation (Yours faithfully — recipient unknown) + name in CAPITALS ....................... 1 mark\n• List of enclosures (job application file): at least 6 relevant documents .................................... 3 marks\n• Grammar, spelling, punctuation, professional vocabulary ................................................... 2 marks\n• Tone (formal, polite, persuasive) + general impression of fluency .......................................... 1 mark\n\n────────────────────────────────────────────────────────\nTIPS (FR) — Pourquoi cette structure ?\n────────────────────────────────────────────────────────\n• Lorsque le sujet précise « where a cover letter is NOT required », la lettre d'application doit jouer le rôle À LA FOIS du courrier d'accompagnement ET de l'introduction au dossier. Tu dois donc être plus DÉVELOPPÉ que pour une simple cover letter.\n• « Yours faithfully » : on l'utilise lorsque le destinataire est inconnu (Dear Sir/Madam). Si on connaissait son nom (Dear Mr Smith), on aurait écrit « Yours sincerely ».\n• Liste des pièces jointes (Enclosures) OBLIGATOIRE : le sujet le demande explicitement (« attach documents necessary for a job application file »). N'oublie aucun document classique du dossier camerounais : CNI, casier judiciaire, certificat médical, extrait d'acte de naissance.\n• Mappage point par point avec l'offre : pour chaque exigence (Windows Server, Linux, VMware, LAN/WAN, sécurité, communication, flexibilité), tu DOIS faire écho dans ta lettre. C'est ce qui te démarquera d'un texte générique.\n• Ton formel mais confiant : évite les formules trop humbles (« I would be honoured ») au profit de phrases d'engagement (« I am confident that... », « Joining your organisation would allow me to... »).\n• Une page exactement : pas plus, pas moins. Vise 4 paragraphes courts (≈ 350-400 mots) + l'en-tête + la liste des pièces jointes.",
          "bareme": "/ 20 marks (1 question unique sur 2h)"
        }
      ]
    },
    {
      "titre": "EXPERT ENGLISH RESIT EXAM — June 2025",
      "source": "IAI Cameroun, duration 1h, total 20 marks",
      "questions": [
        {
          "numero": "A1",
          "enonce": "Which is NOT an element of the communication process? A. Sender  B. Receiver  C. Telephone  D. Message",
          "correction": "Answer: C. Telephone. Téléphone est un canal/outil, pas un élément constitutif du processus. Éléments : Sender, Message, Channel, Receiver, Feedback, Context, Noise.",
          "bareme": "1 mark"
        },
        {
          "numero": "A2",
          "enonce": "Verbal communication includes: A. Facial expressions  B. Gestures  C. Spoken words  D. Eye contact",
          "correction": "Answer: C. Spoken words. Verbal = utilisation de mots (oraux ou écrits). A, B, D = non-verbal.",
          "bareme": "1 mark"
        },
        {
          "numero": "A3",
          "enonce": "An example of formal communication: A. Telling jokes  B. Writing a business email  C. Chatting at a party  D. Talking to a friend",
          "correction": "Answer: B. Writing a business email. Registre formel codifié. A, C, D = informel.",
          "bareme": "1 mark"
        },
        {
          "numero": "B1",
          "enonce": "Define communication and name two elements of the communication process.",
          "correction": "Définition (1 pt) : Communication is the process by which information is exchanged between a sender and a receiver via a channel to achieve mutual understanding. Deux éléments (2 pts) : (1) SENDER — encodes and transmits ; (2) RECEIVER — decodes and interprets. Acceptés : Message, Channel, Feedback, Context.",
          "bareme": "3 marks"
        },
        {
          "numero": "B2",
          "enonce": "Explain the difference between verbal and non-verbal communication with one example of each.",
          "correction": "Différence (2 pts) : Verbal uses WORDS (spoken/written) ; non-verbal transmits via body language, gestures, expressions, tone — without words. Exemple verbal (0,5) : presenting a project in a sprint review. Exemple non-verbal (0,5) : nodding to show approval.",
          "bareme": "3 marks"
        },
        {
          "numero": "B3",
          "enonce": "Mention 3 key features of business communication.",
          "correction": "(1) CLARITY — message clair et précis sans ambiguïté. (2) CONCISENESS — court, direct, pas de mots inutiles. (3) FORMALITY — ton poli, vocabulaire formel, pas de slang. Autres : accuracy, purpose-driven, courteous.",
          "bareme": "3 marks"
        },
        {
          "numero": "C1",
          "enonce": "Imagine you are a team leader. Write a short formal email (6-8 sentences) to inform your team about an urgent meeting. Include: Subject, Greeting, Purpose, Time & Date, Closing.",
          "correction": "Modèle (8 pts répartis Subject 1,5 / Greeting 1 / Purpose 2 / Time&Date 1,5 / Closing 1 / Language 1) :\n\nSubject: URGENT — Production Incident Review Meeting on Thursday 28 May 2026\n\nDear Team,\n\nI hope you are all doing well. I am writing to inform you that an urgent meeting has been scheduled to discuss the critical incident detected on our payment microservice last night. The meeting will be held on Thursday, 28 May 2026, from 10:10 AM to 12:10 PM in Conference Room A (Google Meet link sent separately). Please come prepared with logs, root-cause hypotheses and proposed workarounds. Your attendance is mandatory; should you have a conflict, kindly notify me before EOD today.\n\nThank you for your cooperation and prompt response.\n\nKind regards,\n[Your Name]\nTeam Leader — Backend Squad",
          "bareme": "8 marks"
        }
      ]
    },
    {
      "titre": "Practice Exam — Technical English for SE",
      "source": "Épreuve d'entraînement",
      "questions": [
        {
          "numero": "1",
          "enonce": "Vocabulary Matching: (a) Deploy (b) Repository (c) Deprecated (d) Endpoint (e) Latency / 1. Delay between request and response. 2. URL exposed by an API. 3. Marked obsolete. 4. Release to production. 5. Storage location for source code.",
          "correction": "(a) Deploy → 4 ; (b) Repository → 5 ; (c) Deprecated → 3 ; (d) Endpoint → 2 ; (e) Latency → 1.",
          "bareme": "5 marks"
        },
        {
          "numero": "2",
          "enonce": "Gap-fill: 'I created a feature ____ from main, made several ____ messages, asked the senior dev to ____ my pull request after he helped me ____ a null pointer using the NestJS ____.' (framework / merge / debug / branch / commit)",
          "correction": "Ordre : (1) BRANCH, (2) COMMIT, (3) MERGE, (4) DEBUG, (5) FRAMEWORK.",
          "bareme": "5 marks"
        },
        {
          "numero": "3",
          "enonce": "Error correction (1 erreur par phrase): (a) I have fix the bug yesterday. (b) The team are responsible of the deployment. (c) We will deployed the application on Friday. (d) She is more better than him at debugging. (e) The endpoint return a JSON response.",
          "correction": "(a) FIXED (past simple avec yesterday). (b) responsible FOR (pas OF). (c) will DEPLOY (base form après will). (d) BETTER (better est déjà comparatif). (e) returnS (3e personne singulier).",
          "bareme": "5 marks"
        },
        {
          "numero": "4",
          "enonce": "Reading: 'Sprints last two weeks. Retrospectives identify what went well and what could be improved. Daily standups (15 min) share progress, blockers, plans. CI/CD pipelines automate testing/release, reducing human error and accelerating time-to-market.' (1) Length of a sprint? (2) Purpose of retrospective? (3) Two benefits of CI/CD?",
          "correction": "(1) TWO WEEKS. (2) Identifier what went well and what could be improved — boucle d'amélioration continue. (3) Benefits : (a) reduce risk of human error by automating ; (b) accelerate time-to-market. Autres : repeatability, faster feedback, quality assurance.",
          "bareme": "6 marks"
        },
        {
          "numero": "5",
          "enonce": "Email Writing: As junior dev, write 5-7 sentences email to tech lead: (a) report patient list feature done, (b) request code review, (c) mention Friday off. Include Subject, Greeting, Body, Closing.",
          "correction": "Subject: Code Review Request — Patient List Feature (#234)\n\nDear Mr. Tech Lead,\n\nI hope this email finds you well. I am writing to inform you that I have successfully completed the patient list feature on the medical-records module, including pagination and search. The pull request (#234) has been pushed to the dev branch and all unit tests pass on CI. Could you kindly perform a code review at your earliest convenience? Please also note I will be on leave Friday 29 May, so it would be helpful to merge before EOD Thursday.\n\nKind regards,\n[Your Name] — Junior Developer",
          "bareme": "8 marks"
        },
        {
          "numero": "6",
          "enonce": "Use each idiom in a business sentence: (a) get the ball rolling (b) low-hanging fruit (c) touch base (d) deep dive (e) circle back.",
          "correction": "(a) 'Let's GET THE BALL ROLLING on the new auth module before sprint end.' (b) 'For the first release, focus on the LOW-HANGING FRUIT — fix the obvious login bugs.' (c) 'Let's TOUCH BASE Monday morning to align on the API contract.' (d) 'We need a DEEP DIVE into the legacy code before refactoring.' (e) 'I don't have the metrics now but will CIRCLE BACK by Wednesday.'",
          "bareme": "5 marks"
        }
      ]
    },
    {
      "titre": "Practice Exam — Communication (Chapter I)",
      "source": "Basé sur Chapter I Communication.pdf (Mrs Onguene Vanessa, 2025-2026)",
      "questions": [
        {
          "numero": "A1",
          "enonce": "SECTION A — MULTIPLE CHOICE QUESTIONS\n\nQ1. According to the course, communication is best defined as:\nA) The act of speaking loudly to convince other people\nB) The process of sharing ideas, thoughts and feelings through verbal and non-verbal means\nC) The transmission of written messages only through official channels\nD) A one-way process from a manager to an employee",
          "correction": "Answer: B\n\nExplication (EN): The course explicitly defines communication as \"the process of sharing our ideas, thoughts, feelings with other people through verbal and non-verbal communication\" and \"the interchange of thoughts or opinions through shared symbols\".\n\nExplication (FR): Le cours définit la communication comme le processus de partage des idées, pensées et sentiments par des moyens verbaux ET non-verbaux. Les options A (volume), C (écrit seul) et D (sens unique) sont incorrectes : la communication est bidirectionnelle et multi-canal.",
          "bareme": "1 mark"
        },
        {
          "numero": "A2",
          "enonce": "Q2. Which of the following is NOT a step in the communication process described in the course?\nA) The sender encodes the idea in a message\nB) The message travels through a channel\nC) The receiver pays the sender for the message\nD) Feedback travels back to the sender",
          "correction": "Answer: C\n\nExplication (EN): The 6-step communication process is: (1) Sender has an idea, (2) Sender encodes idea in a message, (3) Message travels through channel, (4) Receiver decodes the message, (5) Feedback travels to sender, (6) Possible additional feedback to receiver. Payment is not part of the model.\n\nExplication (FR): Le modèle en 6 étapes du cours est: 1-l'émetteur a une idée, 2-il encode le message, 3-le message voyage via un canal, 4-le récepteur décode, 5-feedback vers l'émetteur, 6-feedback additionnel possible. Le paiement n'a aucune place dans ce schéma.",
          "bareme": "1 mark"
        },
        {
          "numero": "A3",
          "enonce": "Q3. Eye contact, posture and facial expressions are examples of:\nA) Verbal communication\nB) Written communication\nC) Non-verbal communication\nD) Computer-mediated communication",
          "correction": "Answer: C\n\nExplication (EN): The course lists facial expressions, gestures, posture, eye contact, body movements and touch as types of non-verbal communication, which is \"the transfer of information from one person to another without the use of words or spoken language\".\n\nExplication (FR): Le cours classe les expressions faciales, gestes, posture, contact visuel et toucher comme communication NON-VERBALE puisqu'aucun mot n'est utilisé. La verbale, au contraire, repose sur des mots écrits ou parlés.",
          "bareme": "1 mark"
        },
        {
          "numero": "B1",
          "enonce": "SECTION B — STRUCTURAL QUESTIONS\n\nQ4. Define internal communication and list THREE channels organizations use to share information internally.",
          "correction": "Model answer (EN): Internal communication is the function responsible for effective communications among participants within an organization. In simple terms, it keeps everyone in the organization informed.\n\nThree channels (any 3 of the following):\n- Verbal channels (face-to-face meetings, briefings)\n- Paper channels (printed memos, notices)\n- Electronic channels via the company intranet, email, social media, messaging apps, video calls, or telephones\n\nMarking scheme:\n- 1 mark for the definition (organization-internal exchange).\n- 1 mark for mentioning \"keep everyone informed\".\n- 1 mark for 3 valid channels.\n\nExplication (FR): La communication interne se déroule à l'intérieur de l'entreprise. Les canaux principaux cités dans le cours sont l'intranet (24/7), l'email, les réseaux sociaux internes, la messagerie, les appels vidéo, le téléphone, et les rencontres en face-à-face.",
          "bareme": "3 marks"
        },
        {
          "numero": "B2",
          "enonce": "Q5. What is the difference between verbal and non-verbal communication? Give one concrete example of each.",
          "correction": "Model answer (EN):\nVerbal communication uses spoken OR written words to convey a message (e.g., delivering an oral presentation, writing an email).\nNon-verbal communication transfers information WITHOUT words, using facial expressions, gestures, posture, eye contact or touch (e.g., nodding to show agreement, smiling at a colleague).\n\nMarking scheme:\n- 1 mark: clear definition of verbal (words, spoken/written).\n- 1 mark: clear definition of non-verbal (no words, body signals).\n- 1 mark: one valid example for each type.\n\nExplication (FR): La clé : verbale = MOTS (à l'oral ou à l'écrit) ; non-verbale = TOUT SAUF LES MOTS (gestes, regards, posture). Une lettre est verbale-écrite ; une poignée de main est non-verbale.",
          "bareme": "3 marks"
        },
        {
          "numero": "B3",
          "enonce": "Q6. State THREE reasons why external communication is important for a company.",
          "correction": "Model answer (EN) — any THREE of:\n1. Maintaining good relationships with existing customers (retention, brand loyalty).\n2. Sharing news and developments about the business with partners, shareholders and clients.\n3. Building brand identity through chosen words and images.\n4. Improving brand awareness via advertising, websites and social media.\n5. Communicating with suppliers to build lasting business relationships.\n\nMarking scheme: 1 mark per valid reason correctly explained (3 x 1 = 3 marks).\n\nExplication (FR): La communication externe relie l'entreprise à son environnement (clients, fournisseurs, médias, investisseurs). Elle sert à fidéliser, informer, construire la marque, accroître la notoriété et nourrir les relations partenaires.",
          "bareme": "3 marks"
        },
        {
          "numero": "C1",
          "enonce": "SECTION C — APPLICATION QUESTION\n\nQ7. You are the Communication Officer of MTN Cameroon. Your company has just launched a new mobile data plan called \"MTN PULSE 4G+\". Write a press release (200–250 words) to inform the public about this new product. Respect the typical structure of an external communication message (headline, opening, body with key features and benefits, closing with contact details).",
          "correction": "MODEL ANSWER (~230 words):\n\nFOR IMMEDIATE RELEASE\nDouala, 28 May 2026\n\nMTN CAMEROON LAUNCHES \"PULSE 4G+\": A NEW HIGH-SPEED DATA PLAN FOR YOUNG PROFESSIONALS\n\nMTN Cameroon is proud to announce the official launch of its latest mobile data plan, MTN PULSE 4G+, designed to meet the growing connectivity needs of students, freelancers and young professionals across the country.\n\nStarting from 1st June 2026, customers will benefit from 30 GB of data, unlimited night browsing from 11 p.m. to 6 a.m., and free access to selected educational platforms, all for only 5,000 FCFA per month. The new plan is fully compatible with our 4G+ network, which now covers more than 85% of the national territory.\n\n\"With MTN PULSE 4G+, we are reinforcing our commitment to digital inclusion and supporting the productivity of the Cameroonian youth,\" said the Chief Marketing Officer. The plan can be activated by dialling *128# or directly from the MyMTN mobile application.\n\nFor more information, please visit www.mtn.cm or contact our Customer Care service at 8000 (toll-free).\n\nAbout MTN Cameroon: MTN is a leading telecommunications operator providing voice, data and digital financial services to over 11 million subscribers in Cameroon.\n\nPress contact:\nCommunication Department\nEmail: press@mtn.cm\nTel: +237 233 50 00 00\n\n---\nMARKING CRITERIA (8 marks):\n- Layout / press-release structure (headline, dateline, body, contact) : 2 marks\n- Content relevance (product features, benefits, target audience) : 2 marks\n- Register / formal professional tone : 1 mark\n- Grammar and spelling : 1 mark\n- Vocabulary / business terms (launch, customer, network, subscriber...) : 1 mark\n- Clear call-to-action and contact details : 1 mark\n\nExplication (FR): Un communiqué de presse doit comporter un titre accrocheur, une date, un paragraphe d'accroche, le corps (caractéristiques + bénéfices client), une citation d'un responsable, un encadré \"About...\", et les coordonnées de contact. Le registre est formel et factuel.",
          "bareme": "8 marks"
        }
      ]
    },
    {
      "titre": "Practice Exam — Business Communication (Chapter II)",
      "source": "Basé sur Chapter II business communication.pdf (Mrs Onguene Vanessa, 2025-2026)",
      "questions": [
        {
          "numero": "A1",
          "enonce": "SECTION A — MULTIPLE CHOICE QUESTIONS\n\nQ1. Communication flowing from top-level executives to bottom-level employees in the form of instructions and directives is called:\nA) Upward communication\nB) Downward communication\nC) Horizontal communication\nD) Crosswise communication",
          "correction": "Answer: B\n\nExplication (EN): The course defines downward communication as \"the information flow from the top-level executives to the bottom-level employees. It takes the form of instructions, directives, and goals.\"\n\nExplication (FR): Communication descendante = du haut vers le bas (directives du patron vers les employés). L'inverse, la communication ascendante (upward), correspond au feedback des employés vers la direction.",
          "bareme": "1 mark"
        },
        {
          "numero": "A2",
          "enonce": "Q2. Which of the following is NOT a type of informal communication?\nA) Single Strand\nB) Gossip Chain\nC) Vertical Chain\nD) Cluster Chain",
          "correction": "Answer: C\n\nExplication (EN): The four types of INFORMAL communication listed in the course are: Single Strand, Gossip Chain, Probability Chain and Cluster Chain. \"Vertical\" belongs to FORMAL communication.\n\nExplication (FR): Le cours liste 4 types informels : Single Strand, Gossip Chain, Probability Chain, Cluster Chain. La communication \"verticale\" est au contraire une catégorie FORMELLE (descendante ou ascendante).",
          "bareme": "1 mark"
        },
        {
          "numero": "A3",
          "enonce": "Q3. A short written internal message used to inform a group of staff about a specific problem, decision or event is called a:\nA) Press release\nB) Proposal\nC) Memo\nD) Cover letter",
          "correction": "Answer: C\n\nExplication (EN): A memo is described in the course as a document \"used to inform a group of people about a specific problem, solution or events\". A press release goes to the media, a proposal sells a service to clients, and a cover letter accompanies a job application.\n\nExplication (FR): Le memo (memorandum) est une note interne. Le communiqué de presse va vers les médias, la proposition commerciale vers les clients, la lettre de motivation vers un recruteur.",
          "bareme": "1 mark"
        },
        {
          "numero": "B1",
          "enonce": "SECTION B — STRUCTURAL QUESTIONS\n\nQ4. Differentiate formal communication from informal communication. Provide one example of each.",
          "correction": "Model answer (EN):\nFormal communication is the exchange of OFFICIAL information between two or more people within the same organization, following predefined rules and using official channels (e.g., a meeting between department heads, a memo from the CEO).\nInformal communication is CASUAL communication between coworkers, unofficial in nature, based on social relationships outside the normal hierarchy (e.g., a chat at the coffee machine, a gossip during lunch break).\n\nMarking scheme:\n- 1 mark : formal definition (official, rules, channels).\n- 1 mark : informal definition (casual, social, outside hierarchy).\n- 1 mark : one valid example for each.\n\nExplication (FR): La clé est l'OFFICIEL vs le CASUAL. Une réunion convoquée par memo = formel. Un débrief au coin café = informel. Les deux coexistent en entreprise.",
          "bareme": "3 marks"
        },
        {
          "numero": "B2",
          "enonce": "Q5. State THREE advantages of formal communication in business.",
          "correction": "Model answer (EN) — any THREE of:\n1. Clarity and accuracy: reduces misinterpretation by following standardized rules.\n2. Professionalism: maintains the organization's professional image with clients.\n3. Hierarchy and structure: defines proper channels of information flow, prevents confusion.\n4. Legal documents / written record: ensures legal compliance and traceability.\n5. Decision-making: provides accurate data via the right channels.\n6. Supports organizational culture: conveys mission, values and goals.\n7. Crisis management: enables quick official dissemination of information.\n\nMarking scheme: 1 mark per advantage clearly explained (3 x 1 = 3 marks).\n\nExplication (FR): Avantages clés du formel : clarté, professionnalisme, traçabilité écrite (juridique), structure hiérarchique et qualité de la prise de décision.",
          "bareme": "3 marks"
        },
        {
          "numero": "B3",
          "enonce": "Q6. What is Computer-Mediated Communication (CMC)? Give TWO examples of CMC tools commonly used in business today.",
          "correction": "Model answer (EN):\nComputer-Mediated Communication (CMC) is any form of communication between two or more individuals who interact and/or influence each other through SEPARATE COMPUTERS via the internet or a network connection using software. CMC does NOT cover how computers talk to one another, but how PEOPLE talk via computers.\n\nTwo examples (any 2 of):\n- Email / chat\n- Skype, Zoom, Google Meet (video conferencing)\n- Internet telephony (VoIP)\n- Instant messaging apps (WhatsApp, Microsoft Teams, Slack)\n- Avatar-mediated communication or robot-mediated communication\n\nMarking scheme:\n- 1 mark: correct definition.\n- 1 mark: emphasis on \"people communicating via computers\" (not machine-to-machine).\n- 1 mark: 2 valid examples.\n\nExplication (FR): La CMC, c'est l'humain qui parle à l'humain À TRAVERS la machine (email, visio, chat). Le dialogue machine-machine (API, protocoles réseau) n'est PAS de la CMC.",
          "bareme": "3 marks"
        },
        {
          "numero": "C1",
          "enonce": "SECTION C — APPLICATION QUESTION\n\nQ7. You are the Head of the IT Department at IAI-Cameroun. The general administration has decided that, starting next month, all staff must use the new internal messaging platform \"IAI-Connect\" instead of WhatsApp for work-related discussions. Write a MEMORANDUM (200–250 words) to all staff to announce this change. Respect the standard memo format.",
          "correction": "MODEL ANSWER (full sample):\n\nMEMORANDUM\n\nDATE: 28 May 2026\nTO: All IAI-Cameroun Staff\nFROM: Mr [Your Name], Head of IT Department\nSUBJECT: Migration from WhatsApp to the new internal platform \"IAI-Connect\" effective 1st July 2026\n\nDear Colleagues,\n\nFollowing recent decisions of the General Administration, please be informed that, as from 1st July 2026, all professional discussions, file exchanges and group conversations must take place exclusively on our new internal messaging platform, IAI-CONNECT.\n\nThis change has been motivated by three main reasons. First, IAI-Connect guarantees a much higher level of data security and confidentiality than commercial applications. Second, all conversations will be archived automatically, which will support legal compliance and traceability. Finally, the platform provides integrated tools for project management, video conferencing and document sharing.\n\nIn order to make the transition smooth, the IT Department will organize training sessions in each department from 10 to 20 June 2026. Personal login credentials will be sent to your professional email address before 5 June. Please install the application on your office computer AND on your mobile phone.\n\nThe use of WhatsApp for professional matters will no longer be authorized after 30 June 2026.\n\nShould you encounter any difficulty, please feel free to contact the IT support team at support@iai-cameroun.org or extension 1234.\n\nThank you for your full cooperation.\n\nMr [Your Name]\nHead of IT Department\n\n---\nMARKING CRITERIA (8 marks):\n- Standard memo header (DATE, TO, FROM, SUBJECT) : 2 marks\n- Clear subject line : 0.5 mark\n- Body structure (announcement / reasons / instructions / deadline) : 2 marks\n- Professional and polite tone : 1 mark\n- Grammar / spelling : 1 mark\n- Business vocabulary (compliance, deadline, training session...) : 1 mark\n- Closing salutation + signature : 0.5 mark\n\nExplication (FR): Un memo se reconnaît à son en-tête (Date, To, From, Subject), un corps structuré en paragraphes (annonce / justification / instructions / deadline / contact), un ton formel mais courtois. Éviter le \"hey guys\" : c'est un canal OFFICIEL.",
          "bareme": "8 marks"
        }
      ]
    },
    {
      "titre": "Practice Exam — Job Search (Chapter III)",
      "source": "Basé sur Chapter III Initiation to job Search.pdf (Mrs Onguene Vanessa, 2025-2026)",
      "questions": [
        {
          "numero": "A1",
          "enonce": "SECTION A — MULTIPLE CHOICE QUESTIONS\n\nQ1. According to Wikipedia (as quoted in the course), the IMMEDIATE goal of job seeking is usually to:\nA) Sign an employment contract on the same day\nB) Obtain a job interview with an employer that may lead to being hired\nC) Receive a salary advance\nD) Send the largest possible number of CVs in one week",
          "correction": "Answer: B\n\nExplication (EN): The course states: \"The immediate goal of job seeking is usually to obtain a job interview with an employer which may lead to getting hired.\" Hiring itself is a later outcome.\n\nExplication (FR): L'objectif IMMÉDIAT n'est pas d'être embauché, mais d'OBTENIR L'ENTRETIEN. Embauche = conséquence éventuelle. Distinction très fréquente en épreuve.",
          "bareme": "1 mark"
        },
        {
          "numero": "A2",
          "enonce": "Q2. Which type of resume puts EMPHASIS ON SKILLS rather than on chronological work experience, and is therefore ideal for candidates with employment gaps or career changes?\nA) Reverse-chronological resume\nB) Functional resume\nC) Combination resume\nD) Cover letter",
          "correction": "Answer: B\n\nExplication (EN): The course states: \"A functional resume places emphasis on your skills rather than your work experience. This resume is ideal for those who are changing careers or those who have gaps in employment.\"\n\nExplication (FR): Le CV FONCTIONNEL met l'accent sur les COMPÉTENCES (parfait pour reconversion ou trou dans le parcours). Le chronologique-inverse liste les emplois récents en premier. Le combiné est un hybride. La cover letter n'est PAS un CV.",
          "bareme": "1 mark"
        },
        {
          "numero": "A3",
          "enonce": "Q3. Which of the following is the CORRECT order of the standard job-search process described in the course?\nA) Apply → Search jobs → Write resume → Attend interview → Follow up → Accept offer\nB) Search jobs → Write resume → Apply → Practice/Prepare → Attend interview → Follow up → Accept job offer\nC) Write resume → Accept job offer → Search jobs → Apply → Attend interview\nD) Attend interview → Search jobs → Write resume → Apply → Follow up",
          "correction": "Answer: B\n\nExplication (EN): The course lists 7 steps in this order: (1) Search jobs, (2) Write resume, (3) Apply, (4) Practice and prepare, (5) Attend the interview, (6) Follow up, (7) Accept job offer.\n\nExplication (FR): Mémorise les 7 étapes dans l'ordre : Recherche, Rédaction CV, Postuler, Préparation, Entretien, Relance (Follow-up), Acceptation. Question piège classique sur l'ordre.",
          "bareme": "1 mark"
        },
        {
          "numero": "B1",
          "enonce": "SECTION B — STRUCTURAL QUESTIONS\n\nQ4. Define a Resume (CV) and list the SIX KEY SECTIONS it must contain according to the course.",
          "correction": "Model answer (EN):\nA resume (or CV) is a formal document that displays an individual's professional background and relevant skills. It generally consists of work history, education, a professional summary and a list of skills.\n\nThe SIX key sections (per the course):\n1. Contact information\n2. Professional summary\n3. Education\n4. Work experience\n5. Skills\n6. Languages spoken\n\nMarking scheme:\n- 1 mark : clear definition.\n- 2 marks : the 6 key sections (deduct 0.5 per missing section beyond the second omission).\n\nExplication (FR): Le CV est UN DOCUMENT FORMEL de marketing personnel. Les 6 sections obligatoires : Contacts, Résumé pro, Formation, Expérience, Compétences, Langues. Les sections optionnelles (certifications, prix, bénévolat...) viennent en plus.",
          "bareme": "3 marks"
        },
        {
          "numero": "B2",
          "enonce": "Q5. What is a cover letter? Explain its THREE main purposes as described in the course.",
          "correction": "Model answer (EN):\nA cover letter is a ONE-PAGE document that you submit AS PART of your job application (alongside your CV/Resume). It requires good written communication skills and is generally written in 6 structured steps.\n\nIts three main purposes:\n1. To introduce yourself and briefly summarize your professional background.\n2. To demonstrate your written communication skills.\n3. To show that you can be a STRONG FIT for the position you are applying for.\n\nMarking scheme:\n- 1 mark : definition.\n- 2 marks : the three purposes (1 mark for two purposes, 2 marks for all three).\n\nExplication (FR): La lettre de motivation accompagne le CV. Elle se présente, met en avant la qualité de l'expression écrite, et démontre que tu es LE BON CANDIDAT pour CE poste-là. C'est un exercice de séduction professionnelle, pas une copie du CV.",
          "bareme": "3 marks"
        },
        {
          "numero": "B3",
          "enonce": "Q6. List THREE different methods a job seeker can use to find a job, and briefly explain how ONE of them works.",
          "correction": "Model answer (EN) — any THREE of:\n- Business and personal networks\n- Social media platforms (LinkedIn, Facebook...)\n- Employment websites (Minajobs, Emploi.cm, Indeed...)\n- Classified fields in newspapers\n- Private and public recruitment agencies\n- Company websites (career page)\n- Professional guidance such as outplacement\n- Visiting organizations directly\n- Job alerts (email subscription)\n\nExample of explanation (Employment websites):\nThe candidate creates a profile, uploads their CV, sets keyword filters (job title, location, contract type) and receives automated suggestions. AI algorithms now match candidate profiles to vacancies, reducing time spent browsing.\n\nMarking scheme:\n- 1.5 mark : three correctly named methods.\n- 1.5 mark : detailed and clear explanation of one method.\n\nExplication (FR): Tu peux citer le bouche-à-oreille, LinkedIn, les sites d'emploi (Minajobs, Indeed), les annonces du journal, les agences de recrutement (Adecco, Manpower), les pages \"Carrières\" des entreprises, ou les alertes mail.",
          "bareme": "3 marks"
        },
        {
          "numero": "C1",
          "enonce": "SECTION C — APPLICATION QUESTION\n\nQ7. You are [Your Name], a final-year student in Software Engineering at IAI-Cameroun (Yaoundé). You have just seen on LinkedIn an offer for a JUNIOR FULL-STACK DEVELOPER position at Orange Cameroun. Write a COVER LETTER (Application Letter, 250–300 words) following the structure taught in the course (header, greetings, three body paragraphs, final salutation, signature).",
          "correction": "MODEL ANSWER (full sample):\n\n[Your Name]\nFinal-year Student — Software Engineering (GL3A)\nIAI-Cameroun, Yaoundé\nPhone: +237 6XX XX XX XX\nEmail: your.email@example.com\n\n28 May 2026\n\nThe Head of Human Resources\nOrange Cameroun S.A.\nDouala, Cameroon\n\nDear Sir / Madam,\n\nAPPLICATION FOR THE POSITION OF JUNIOR FULL-STACK DEVELOPER\n\nI am writing to apply for the position of Junior Full-Stack Developer, which I discovered on your official LinkedIn page on 25 May 2026. As a final-year student in Software Engineering at IAI-Cameroun, I am genuinely interested in joining Orange Cameroun, a company whose digital transformation projects and commitment to youth innovation strongly inspire me.\n\nDuring my three years of training, I have acquired solid skills in front-end development (React, Next.js, Flutter) and back-end development (NestJS, Node.js, PostgreSQL, Prisma). For my final-year project, I designed and developed a full-stack medical-record management system composed of a NestJS API, a Next.js web admin and a Flutter mobile application with offline synchronization. This project allowed me to master REST APIs, JWT authentication, role-based access control (RBAC) and CI/CD with Git. I am also fluent in both English and French, and I work well both independently and in agile teams.\n\nPlease find enclosed my Curriculum Vitae, my academic transcripts and two letters of recommendation from my supervisors. I am available for an interview at your earliest convenience and could start an internship or junior contract from 1st July 2026.\n\nThank you very much for your time and consideration. I look forward to discussing how my skills and motivation could contribute to Orange Cameroun's success.\n\nYours faithfully,\n\n(Handwritten signature)\n[YOUR NAME]\n\n---\nMARKING CRITERIA (8 marks):\n- Header (sender + receiver addresses + date) per course template : 1.5 marks\n- Greetings + subject line (\"APPLICATION FOR THE POSITION OF…\") : 1 mark\n- Paragraph 1 — Source of information + interest : 1 mark\n- Paragraph 2 — Education / experience / skills : 1.5 marks\n- Paragraph 3 — Enclosed documents + availability : 1 mark\n- Closing salutation (Yours faithfully / sincerely) + name in capitals : 1 mark\n- Grammar, spelling, professional tone : 1 mark\n\nExplication (FR): Structure stricte : adresse expéditeur + date en haut à droite ; adresse destinataire en haut à gauche ; salutation ; objet en majuscules souligné ; 3 paragraphes (origine de l'offre + intérêt ; profil/compétences ; pièces jointes + disponibilité) ; salutation finale ; nom en MAJUSCULES. Astuce : \"Yours faithfully\" quand on ne connaît pas le nom ; \"Yours sincerely\" quand on l'écrit (Dear Mr Smith…).",
          "bareme": "8 marks"
        }
      ]
    }
  ],
  "secubd": [
    {
      "titre": "Épreuve de Sécurité des Bases de Données - Session 1",
      "source": "Inspirée des exercices d'application du cours BELINGA Estelle, Master Sécurité des SI, IAI Cameroun 2023-2024",
      "questions": [
        {
          "numero": "1",
          "enonce": "Définissez la sécurité des bases de données et énumérez les quatre éléments qu'elle doit gérer et protéger.",
          "correction": "La sécurité des BD est un ensemble de moyens, contrôles et mesures conçus pour protéger les bases de données contre les menaces accidentelles et intentionnelles afin de préserver la confidentialité, l'intégrité et la disponibilité (CIA) des données. Les quatre éléments protégés sont : (1) les données de la BD, (2) le SGBD lui-même, (3) toutes les applications associées, (4) le serveur de BD qu'il soit physique ou virtuel.",
          "bareme": "2 points"
        },
        {
          "numero": "2",
          "enonce": "Citez et expliquez les trois piliers de la sécurité des bases de données. Pour chacun, donnez une menace et un exemple concret.",
          "correction": "(1) Confidentialité : seules les personnes/programmes autorisés accèdent aux données. Menace : accès non autorisé. Exemple : un stagiaire consulte les salaires des cadres. (2) Intégrité : les données ne sont ni modifiées ni falsifiées par des parties non autorisées (s'appuie sur les contraintes d'intégrité). Menace : abus de privilège légitime. Exemple : une secrétaire à qui on a donné le droit de modifier les notes change la moyenne d'un étudiant. (3) Disponibilité : accessibilité 24/7. Menace : déni de service ou crash disque. Exemple : un DDoS rend le portail de gestion académique inaccessible pendant la période des résultats.",
          "bareme": "3 points"
        },
        {
          "numero": "3",
          "enonce": "Donnez deux types d'attaques non frauduleuses et trois types d'attaques frauduleuses. Pour chaque attaque frauduleuse, indiquez si elle vise la confidentialité, l'intégrité ou la disponibilité.",
          "correction": "Attaques non frauduleuses : (a) catastrophes naturelles (inondation, incendie du datacenter), (b) erreurs humaines (mauvaise manipulation, suppression accidentelle d'une table). Attaques frauduleuses : (1) Abus de privilège excessif (vise confidentialité et intégrité) : un user a plus de droits qu'il n'en faut et les utilise mal. (2) Injection SQL (vise confidentialité, intégrité, voire disponibilité) : altère, vole ou détruit des données via du code SQL injecté. (3) Attaque par déni de service – DoS (vise disponibilité) : sature le serveur de requêtes pour bloquer les utilisateurs légitimes.",
          "bareme": "3 points"
        },
        {
          "numero": "4",
          "enonce": "Expliquez le principe de l'injection SQL et illustrez un contournement d'authentification avec la payload \"admin' OR '1'='1' --\". Précisez la requête finale exécutée et pourquoi elle réussit.",
          "correction": "Principe : l'attaquant injecte du code SQL dans un champ utilisateur, modifiant ainsi la requête envoyée par l'application à la BD, pour exécuter des instructions non prévues. Cas d'usage : sur un formulaire de login, l'application construit SELECT * FROM users WHERE username='$user' AND password='$pwd'. L'attaquant saisit username = admin' OR '1'='1' -- et un mot de passe quelconque. La requête finale devient : SELECT * FROM users WHERE username='admin' OR '1'='1' --' AND password='xxx'. La condition '1'='1' est toujours vraie (donc OR donne true), le -- commente le reste de la requête (notamment la vérification du mot de passe). Résultat : la requête renvoie l'utilisateur admin et le système connecte l'attaquant sans connaître le mot de passe.",
          "bareme": "3 points"
        },
        {
          "numero": "5",
          "enonce": "Citez trois mesures techniques de prévention contre l'injection SQL et expliquez brièvement chacune.",
          "correction": "(1) Requêtes paramétrées (prepared statements) : on prépare la requête avec des marqueurs (?, :param) et on lie les valeurs séparément ; le moteur SQL ne réinterprète pas les valeurs comme du code. (2) Validation et échappement des entrées : type strict, longueur maximale, whitelist de caractères, expressions régulières ; toute entrée non conforme est rejetée. (3) Principe du moindre privilège pour le compte applicatif : le compte utilisé par l'application n'a que les privilèges SELECT/INSERT/UPDATE strictement nécessaires sur les tables concernées, pas DROP, ni GRANT, ni d'accès aux tables système. Compléments : ORM, WAF, monitoring des erreurs SQL et désactivation de l'affichage des erreurs détaillées en production.",
          "bareme": "3 points"
        },
        {
          "numero": "6",
          "enonce": "Soient les utilisateurs S1, S2, S3 et les objets : une imprimante imp et un fichier toto.txt, avec les autorisations : S1 est propriétaire de toto.txt ; imp est en accès libre ; S2 peut lire toto.txt ; S3 peut imprimer tous les fichiers sur lesquels il a un droit de lecture ; S3 n'a aucun droit sur toto.txt. Modélisez la matrice de contrôle d'accès selon le modèle de Lampson.",
          "correction": "S = {S1, S2, S3}, O = {toto.txt, imp}, opérations = {own, r, w, x, p (print)}.\nM(S1, toto.txt) = own (read, write, execute, plus droit de transmission)\nM(S2, toto.txt) = r\nM(S3, toto.txt) = – (aucun droit)\nM(S1, imp) = x (accès libre)\nM(S2, imp) = x\nM(S3, imp) = x\nMatrice :\n           | toto.txt | imp\n    S1     |  own     |  x\n    S2     |   r      |  x\n    S3     |   –      |  x\nNB : S3 ne peut imprimer toto.txt car il n'a pas de droit de lecture dessus (règle métier 'imp ne peut imprimer un fichier que si la requête vient d'un sujet ayant droit de lecture').",
          "bareme": "3 points"
        },
        {
          "numero": "7",
          "enonce": "Énoncez les deux propriétés du modèle de Bell-LaPadula et précisez pour chacune le pilier de sécurité protégé.",
          "correction": "Bell-LaPadula (1973) protège la CONFIDENTIALITÉ. (1) SS-propriété (Simple Security) ou no-read-up : un sujet ne peut lire un objet QUE si son niveau de sécurité (habilitation) est >= classification de l'objet. Empêche un sujet de niveau bas (ex : Confidentiel) de lire un document Top Secret. (2) Propriété étoile (*) ou no-write-down : un sujet ne peut écrire dans un objet QUE si son niveau de sécurité <= classification de l'objet. Empêche un sujet Top Secret d'écrire (et donc de divulguer) des informations dans un objet Confidentiel accessible aux niveaux inférieurs.",
          "bareme": "2 points"
        },
        {
          "numero": "8",
          "enonce": "On considère : S = {Bob (Top Secret), Sonia (Non Classé)}, O = {fichiers personnels (Top Secret), fichiers du courriel (Secret), fichiers du log (Confidentiel), fichiers des coordonnées (Non Classé)}. En appliquant Bell-LaPadula, indiquez pour chaque sujet et chaque fichier les opérations autorisées (lecture/écriture).",
          "correction": "Bob (Top Secret) : peut LIRE fichiers personnels (égal), courriel (sup), log (sup), coordonnées (sup) car no-read-up respecté (TS >= tous). Pour l'écriture (no-write-down) : Bob ne peut écrire que là où la classification >= son habilitation TS, donc UNIQUEMENT fichiers personnels.\nSonia (Non Classé) : pour la lecture, son habilitation NC doit être >= classification : seulement fichiers des coordonnées (NC=NC). Pour l'écriture, son habilitation NC doit être <= classification : TOUS les fichiers (personnels, courriel, log, coordonnées).\nMatrice Lampson résultante :\n            | personnels | courriel | log | coordonnées\n   Bob      |    r,w     |    r     |  r  |     r\n   Sonia    |     w      |    w     |  w  |    r,w",
          "bareme": "4 points"
        },
        {
          "numero": "9",
          "enonce": "Comparez DAC, MAC et RBAC en remplissant un tableau avec les colonnes : principe, qui décide, contexte d'usage, avantage principal, inconvénient principal.",
          "correction": "DAC : Principe = le propriétaire de l'objet attribue/retire les droits. Décideur = propriétaire. Usage = systèmes Unix, SGBD classiques. Avantage = flexibilité, simplicité. Inconvénient = vulnérable aux chevaux de Troie, explosion des ACL, ne respecte pas toujours la politique d'entreprise.\nMAC : Principe = classifications/habilitations imposées par l'admin, règles strictes (Bell-LaPadula, Biba). Décideur = admin système. Usage = défense, gouvernement, données très sensibles. Avantage = sécurité forte et cohérente. Inconvénient = rigide, complexe, coûteux.\nRBAC : Principe = permissions liées à des rôles reflétant la structure de l'entreprise ; users affectés aux rôles. Décideur = admin via les rôles. Usage = entreprises classiques avec turnover. Avantage = scalable, facile à administrer. Inconvénient = explosion potentielle des rôles, moins fin que ABAC.",
          "bareme": "3 points"
        },
        {
          "numero": "10",
          "enonce": "Une vue est-elle un mécanisme de sécurité ? Justifiez votre réponse et donnez un exemple SQL de création de vue restreignant l'accès aux champs sexe, code matière et note d'un secrétaire.",
          "correction": "Oui, une vue est un mécanisme de sécurité car elle permet (a) le masquage de colonnes sensibles (on ne sélectionne que certains champs), (b) le filtrage horizontal (clauses WHERE), (c) la délégation de privilèges sur la vue sans accorder de droits sur la table source. Exemple :\nCREATE VIEW v_secdaac AS\n  SELECT etudiant.sexe, note.code, note.note\n  FROM etudiant\n  INNER JOIN note ON etudiant.matricule = note.matricule ;\nGRANT SELECT ON v_secdaac TO 'secdaac'@'localhost' ;\nLe secrétaire ne voit ni le matricule, ni le nom, ni le quartier des étudiants : seules trois colonnes lui sont exposées, conformément au principe du moindre privilège.",
          "bareme": "2 points"
        },
        {
          "numero": "11",
          "enonce": "Énoncez les six règles fondamentales d'une bonne politique de gestion des privilèges sur un SGBD.",
          "correction": "Règle 1 : Attribution du moindre privilège (minimum strictement nécessaire). Règle 2 : Contrôle de la population (synchroniser les comptes avec les arrivées/départs/promotions). Règle 3 : Supervision de la délégation des tâches d'administration (audit a posteriori). Règle 4 : Contrôle physique des connexions (restriction aux hôtes/IP spécifiques connus, notamment pour comptes applicatifs). Règle 5 : Limitation des ressources utilisées (quotas CPU, sessions, requêtes/seconde par utilisateur). Règle 6 : Journaliser les comportements suspects (audit logs des requêtes non conformes, alertes sur élévations de privilèges, accès hors heures).",
          "bareme": "3 points"
        },
        {
          "numero": "12",
          "enonce": "Citez et expliquez brièvement les huit étapes de la sécurité des bases de données.",
          "correction": "(1) Découverte : inventaire des BD et des données sensibles. (2) Évaluation des vulnérabilités et de la configuration : scans avec outils type Scuba, audits de configuration vs benchmarks CIS. (3) Renforcement (hardening) : application des patchs, désactivation des comptes par défaut, durcissement des paramètres. (4) Audit des modifications : suivre tous les changements de schéma et de configuration. (5) Surveillance de l'activité (DAM – Database Activity Monitoring) : monitoring temps réel des requêtes pour détecter anomalies. (6) Audit : conformité, revue périodique des accès et privilèges. (7) Authentification, contrôle d'accès et gestion des droits : MFA, RBAC, moindre privilège. (8) Chiffrement : TDE pour les données au repos, TLS pour les données en transit, gestion sécurisée des clés (KMS/HSM).",
          "bareme": "4 points"
        }
      ]
    },
    {
      "titre": "Épreuve de Sécurité des Bases de Données - Session 2 (Travaux Pratiques)",
      "source": "Inspirée du TP IAI Cameroun : gestion sécurisée de la base de données académique gestetudiant",
      "questions": [
        {
          "numero": "1",
          "enonce": "Vous créez la base gestetudiant avec les tables etudiants(matricule, nom, prenom, sexe, datnaiss, quartier), matieres(idmat, libelle, coefficient) et notes(matricule, idmat, note). Écrivez les commandes SQL pour créer ces trois tables avec leurs clés primaires et étrangères, et les contraintes d'intégrité appropriées (note entre 0 et 20).",
          "correction": "CREATE DATABASE gestetudiant ;\nUSE gestetudiant ;\n\nCREATE TABLE etudiants (\n  matricule VARCHAR(20) PRIMARY KEY,\n  nom VARCHAR(50) NOT NULL,\n  prenom VARCHAR(50) NOT NULL,\n  sexe ENUM('M','F') NOT NULL,\n  datnaiss DATE NOT NULL,\n  quartier VARCHAR(100)\n) ;\n\nCREATE TABLE matieres (\n  idmat VARCHAR(10) PRIMARY KEY,\n  libelle VARCHAR(100) NOT NULL,\n  coefficient INT NOT NULL CHECK (coefficient > 0)\n) ;\n\nCREATE TABLE notes (\n  matricule VARCHAR(20),\n  idmat VARCHAR(10),\n  note DECIMAL(4,2) CHECK (note >= 0 AND note <= 20),\n  PRIMARY KEY (matricule, idmat),\n  FOREIGN KEY (matricule) REFERENCES etudiants(matricule) ON DELETE CASCADE,\n  FOREIGN KEY (idmat) REFERENCES matieres(idmat) ON DELETE CASCADE\n) ;",
          "bareme": "3 points"
        },
        {
          "numero": "2",
          "enonce": "Créez quatre utilisateurs : daac, daacadj, rf_sw (responsable filière software), secdaac, tous depuis localhost avec un mot de passe respectant les bonnes pratiques. Justifiez la robustesse du mot de passe choisi.",
          "correction": "CREATE USER 'daac'@'localhost' IDENTIFIED BY 'D@ac#2026!SecurePass' ;\nCREATE USER 'daacadj'@'localhost' IDENTIFIED BY 'D@acAdj#2026!Strong' ;\nCREATE USER 'rf_sw'@'localhost' IDENTIFIED BY 'RfSw#2026!Robuste9' ;\nCREATE USER 'secdaac'@'localhost' IDENTIFIED BY 'S3cDaac#2026!Solide' ;\nJustification : 19+ caractères, mélange de majuscules, minuscules, chiffres, caractères spéciaux ; pas de mot du dictionnaire ; entropie suffisante pour résister au brute force (> 100 bits) ; en production, ces mots de passe seraient générés aléatoirement et stockés dans un coffre-fort (Vault, CyberArk), avec expiration à 90 jours et rotation automatique.",
          "bareme": "2 points"
        },
        {
          "numero": "3",
          "enonce": "Créez les rôles role_daac, role_daacadj, role_rf, role_sec puis attribuez à chacun les privilèges suivants : DAAC tous privilèges sur gestetudiant.* ; DAACAdj tous privilèges sur etudiants et SELECT sur notes/matieres ; RF SELECT/INSERT/UPDATE sur notes et SELECT sur etudiants/matieres ; SEC SELECT/INSERT/UPDATE sur etudiants uniquement.",
          "correction": "CREATE ROLE 'role_daac', 'role_daacadj', 'role_rf', 'role_sec' ;\n\n-- DAAC : tous privilèges\nGRANT ALL PRIVILEGES ON gestetudiant.* TO 'role_daac' ;\n\n-- DAACAdj\nGRANT ALL PRIVILEGES ON gestetudiant.etudiants TO 'role_daacadj' ;\nGRANT SELECT ON gestetudiant.notes TO 'role_daacadj' ;\nGRANT SELECT ON gestetudiant.matieres TO 'role_daacadj' ;\n\n-- Responsable de filière\nGRANT SELECT, INSERT, UPDATE ON gestetudiant.notes TO 'role_rf' ;\nGRANT SELECT ON gestetudiant.etudiants TO 'role_rf' ;\nGRANT SELECT ON gestetudiant.matieres TO 'role_rf' ;\n\n-- Secrétaire\nGRANT SELECT, INSERT, UPDATE ON gestetudiant.etudiants TO 'role_sec' ;\n\nFLUSH PRIVILEGES ;",
          "bareme": "3 points"
        },
        {
          "numero": "4",
          "enonce": "Affectez les rôles aux utilisateurs précédemment créés et activez par défaut le rôle pour chaque utilisateur.",
          "correction": "GRANT 'role_daac' TO 'daac'@'localhost' ;\nGRANT 'role_daacadj' TO 'daacadj'@'localhost' ;\nGRANT 'role_rf' TO 'rf_sw'@'localhost' ;\nGRANT 'role_sec' TO 'secdaac'@'localhost' ;\n\nSET DEFAULT ROLE ALL TO\n  'daac'@'localhost',\n  'daacadj'@'localhost',\n  'rf_sw'@'localhost',\n  'secdaac'@'localhost' ;\n\nFLUSH PRIVILEGES ;\n-- Vérification\nSHOW GRANTS FOR 'rf_sw'@'localhost' USING 'role_rf' ;",
          "bareme": "2 points"
        },
        {
          "numero": "5",
          "enonce": "Créez une vue v_daacadj montrant uniquement nom, prénom, sexe, idmat, note pour le directeur adjoint, et accordez SELECT/UPDATE sur cette vue à l'utilisateur daacadj.",
          "correction": "CREATE VIEW v_daacadj AS\n  SELECT e.nom, e.prenom, e.sexe, n.idmat, n.note\n  FROM etudiants e\n  INNER JOIN notes n ON e.matricule = n.matricule ;\n\nGRANT SELECT, UPDATE ON gestetudiant.v_daacadj TO 'daacadj'@'localhost' ;\n\nFLUSH PRIVILEGES ;\nNB : la vue masque le matricule, la date de naissance et le quartier (champs jugés non nécessaires pour cette fonction). Le SELECT par daacadj ne dévoilera que les colonnes exposées.",
          "bareme": "2 points"
        },
        {
          "numero": "6",
          "enonce": "Un attaquant tente l'injection \"' OR 1=1 -- \" dans le champ nom de l'application web qui exécute : SELECT * FROM etudiants WHERE nom='$nom'. (a) Écrivez la requête finale exécutée. (b) Pourquoi est-elle dangereuse ? (c) Réécrivez le code (pseudo-code PHP avec PDO) en utilisant une requête paramétrée pour bloquer l'attaque.",
          "correction": "(a) Requête finale : SELECT * FROM etudiants WHERE nom='' OR 1=1 -- '. La condition OR 1=1 est toujours vraie, le -- commente le reste. La requête retourne donc TOUS les étudiants.\n(b) Danger : fuite massive de données personnelles (RGPD), exposition de tous les matricules, dates de naissance, quartiers, sexes ; possible énumération suivie d'autres attaques (ex : UNION SELECT pour extraire d'autres tables, ou ; DROP TABLE pour détruire la base).\n(c) Code sécurisé en PHP avec PDO :\n$pdo = new PDO('mysql:host=localhost ;dbname=gestetudiant ;charset=utf8mb4', 'rf_sw', $passwd, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]) ;\n$stmt = $pdo->prepare('SELECT * FROM etudiants WHERE nom = :nom') ;\n$stmt->execute(['nom' => $_POST['nom']]) ;\n$rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ;\nGrâce au prepared statement, la valeur passée pour :nom est traitée strictement comme une donnée, jamais comme du code SQL. L'injection est neutralisée.",
          "bareme": "4 points"
        },
        {
          "numero": "7",
          "enonce": "Décrivez une stratégie de sauvegarde 3-2-1 pour la base gestetudiant en production, avec une RPO (Recovery Point Objective) de 1 heure et une RTO (Recovery Time Objective) de 4 heures.",
          "correction": "Stratégie 3-2-1 : 3 copies des données, sur 2 supports différents, dont 1 hors site.\n(1) Sauvegarde full hebdomadaire chaque dimanche à 02h00 (mysqldump --single-transaction --routines --triggers gestetudiant > full.sql, chiffrée AES-256). Conservée 1 mois.\n(2) Sauvegardes incrémentales toutes les heures via les binary logs MySQL (log-bin activé). Garantit RPO = 1h.\n(3) Sauvegarde différentielle quotidienne à 22h00 pour accélérer la restauration.\nSupports : (a) NAS local sur le réseau du datacenter principal ; (b) stockage S3/Azure Blob chiffré côté serveur (KMS) hors site. Plus une copie froide sur bande LTO trimestrielle conservée 5 ans.\nRestauration : restaurer le dernier full, puis le dernier différentiel, puis rejouer les binlogs jusqu'au point souhaité. RTO de 4h tenable avec ces volumes et un runbook documenté.\nTests : restauration trimestrielle sur environnement de staging pour valider l'intégrité ; surveillance des sauvegardes via Nagios/Prometheus avec alertes sur échec.",
          "bareme": "3 points"
        },
        {
          "numero": "8",
          "enonce": "Activez l'audit général MySQL pour journaliser toutes les requêtes des utilisateurs daac et rf_sw. Donnez les commandes et le plan de rotation/conservation des logs.",
          "correction": "-- Plugin audit (MariaDB Audit Plugin ou MySQL Enterprise Audit)\nINSTALL PLUGIN server_audit SONAME 'server_audit.so' ;\nSET GLOBAL server_audit_logging = ON ;\nSET GLOBAL server_audit_events = 'CONNECT,QUERY,TABLE' ;\nSET GLOBAL server_audit_incl_users = 'daac,rf_sw' ;\nSET GLOBAL server_audit_file_path = '/var/log/mysql/audit.log' ;\nSET GLOBAL server_audit_file_rotate_size = 100000000 ; -- 100 Mo\nSET GLOBAL server_audit_file_rotations = 30 ; -- 30 fichiers conservés\nPlan : rotation par taille (100 Mo) ; centralisation des logs vers un SIEM (ELK, Splunk, Wazuh) ; conservation 1 an pour conformité ; alertes sur patterns suspects (DROP TABLE, GRANT, échecs de login répétés, requêtes hors heures 22h-06h). Les logs sont en lecture seule pour le DBA opérationnel et en écriture exclusive pour mysql afin d'éviter qu'un attaquant ne les efface.",
          "bareme": "3 points"
        },
        {
          "numero": "9",
          "enonce": "Activez le chiffrement au transport (TLS) entre le client et MySQL et forcez l'utilisateur rf_sw à utiliser SSL.",
          "correction": "-- Côté serveur : générer/installer les certificats (CA, server cert, server key)\n-- dans my.cnf ajouter :\n[mysqld]\nssl-ca=/etc/mysql/ssl/ca.pem\nssl-cert=/etc/mysql/ssl/server-cert.pem\nssl-key=/etc/mysql/ssl/server-key.pem\nrequire_secure_transport = ON\n-- Forcer SSL pour l'utilisateur :\nALTER USER 'rf_sw'@'localhost' REQUIRE SSL ;\n-- Vérifier l'usage de SSL :\nSHOW STATUS LIKE 'Ssl_cipher' ;\n-- Côté client :\nmysql -u rf_sw -p --ssl-ca=/etc/mysql/ssl/ca.pem --ssl-cert=/etc/mysql/ssl/client-cert.pem --ssl-key=/etc/mysql/ssl/client-key.pem -h db.iaicameroun.com\nAinsi, toutes les communications (credentials, requêtes, résultats) sont chiffrées en transit avec TLS 1.2+ ; l'écoute passive du réseau (sniffing) devient inutile.",
          "bareme": "2 points"
        },
        {
          "numero": "10",
          "enonce": "Le directeur quitte l'IAI. Quelles actions de sécurité immédiates devez-vous mener sur les comptes BD ?",
          "correction": "Actions immédiates (idéalement avant son départ effectif) : (1) Désactiver le compte : ALTER USER 'daac'@'localhost' ACCOUNT LOCK ; (2) Révoquer tous les rôles : REVOKE 'role_daac' FROM 'daac'@'localhost' ; (3) Tracer dans les audit logs toutes les dernières actions du compte (recherche d'exports massifs, GRANT suspects, modifications de mots de passe). (4) Identifier les éventuels comptes de service partagés et changer leurs mots de passe. (5) Identifier les clés SSH/API associées à cet utilisateur et les révoquer. (6) Récupérer matériel et tokens MFA. (7) Après période de transition (1-3 mois), supprimer définitivement le compte : DROP USER 'daac'@'localhost' ; (8) Nommer formellement un successeur et lui attribuer le rôle role_daac. (9) Mettre à jour la documentation et la matrice RACI. Cette démarche applique la Règle 2 de la politique de gestion des privilèges (contrôle de la population).",
          "bareme": "3 points"
        },
        {
          "numero": "11",
          "enonce": "Donnez la différence entre chiffrement symétrique (AES), chiffrement asymétrique (RSA) et hashage (bcrypt). Quel mécanisme utiliseriez-vous pour : (a) stocker les mots de passe utilisateurs, (b) chiffrer les fichiers de données au repos, (c) échanger une clé entre client et serveur ?",
          "correction": "Différences :\n- AES (symétrique) : même clé pour chiffrer et déchiffrer ; rapide, adapté au chiffrement de gros volumes ; problème = distribution sécurisée de la clé. AES-256 est le standard.\n- RSA (asymétrique) : paire clé publique (chiffre) / clé privée (déchiffre) ; lent, adapté à l'échange de clés et à la signature. Tailles recommandées : 2048 ou 4096 bits.\n- bcrypt (hashage à sens unique) : transforme un mot de passe en empreinte irréversible, avec sel aléatoire et facteur de coût adaptatif ; non destiné à être déchiffré.\nChoix :\n(a) Stockage de mots de passe : bcrypt (ou Argon2id avec memoryCost adapté). JAMAIS de chiffrement réversible.\n(b) Chiffrement des fichiers de données au repos : AES-256 via TDE (Transparent Data Encryption) ou chiffrement au niveau du système de fichiers (LUKS) ; la clé maître est protégée par un HSM/KMS.\n(c) Échange de clé entre client et serveur : RSA ou ECDH (Elliptic Curve Diffie-Hellman), encapsulés dans TLS lors du handshake. TLS génère une clé de session symétrique (AES) pour la suite des échanges. C'est le modèle hybride symétrique + asymétrique.",
          "bareme": "3 points"
        },
        {
          "numero": "12",
          "enonce": "Quelle est l'obligation principale du RGPD applicable à une BD d'étudiants ? Citez trois mesures techniques que vous mettriez en place pour vous y conformer.",
          "correction": "Le RGPD (Règlement UE 2016/679) impose la protection des données personnelles selon les principes de licéité, minimisation, exactitude, limitation de conservation, intégrité et confidentialité ; il consacre les droits des personnes concernées : accès, rectification, effacement (droit à l'oubli), portabilité, opposition. Il impose aussi notification de violation à l'autorité (CNIL/équivalent) sous 72h et une analyse d'impact (DPIA) pour les traitements à risque.\nTrois mesures techniques :\n(1) Chiffrement : TDE pour la BD au repos + TLS en transit ; ainsi, en cas de vol des disques, les données restent illisibles.\n(2) Pseudonymisation ou masquage dynamique : remplacer le matricule par un identifiant aléatoire dans les environnements de dev/staging ; masquer les dates de naissance pour les utilisateurs n'en ayant pas besoin.\n(3) Journalisation des accès aux données personnelles (audit trail) avec conservation 1 à 3 ans et alertes sur accès massif, plus mécanisme automatisé de purge à la fin de la période légale (ex : 5 ans après la fin de la scolarité). Complément : politique de mots de passe forte, MFA pour les administrateurs, RBAC strict, formation du personnel à la protection des données, désignation d'un DPO.",
          "bareme": "3 points"
        }
      ]
    }
  ],
  "bigdata": [
    {
      "titre": "Épreuve type Big Data & NoSQL - Examen blanc 1",
      "source": "Inspirée du cours Mr. MESSIO (IAI Cameroun) - sujet fabriqué pour révision SN2",
      "questions": [
        {
          "numero": "1",
          "enonce": "Définissez le Big Data et présentez ses 5 caractéristiques principales (5V) avec un exemple pour chacune.",
          "correction": "Le Big Data désigne des ensembles de données dont le volume, la diversité et la vitesse de génération dépassent les capacités des outils traditionnels de gestion de bases de données. Les 5V : Volume (Facebook génère plusieurs pétaoctets/jour), Variété (mix de texte, vidéo, JSON, capteurs IoT), Vélocité (flux Twitter ou trading temps réel), Véracité (qualité et fiabilité, ex. nettoyage de capteurs défaillants), Valeur (insights stratégiques permettant des décisions, ex. recommandations Netflix).",
          "bareme": "4 points"
        },
        {
          "numero": "2",
          "enonce": "Citez et décrivez brièvement les quatre familles principales de bases de données NoSQL, en donnant un exemple de SGBD pour chacune.",
          "correction": "(1) Clé-Valeur : paires clé→valeur, accès O(1) par clé, optimisé pour cache et session — Redis, Amazon DynamoDB. (2) Documents : documents JSON/BSON regroupés en collections, schéma flexible — MongoDB, CouchDB. (3) Colonnes : tables à colonnes dynamiques regroupées en familles, optimisé pour écritures massives et analytique — Apache Cassandra, HBase. (4) Graphes : nœuds + relations + propriétés, idéal pour modéliser des liens — Neo4j, Amazon Neptune.",
          "bareme": "4 points"
        },
        {
          "numero": "3",
          "enonce": "Énoncez le théorème CAP, expliquez chaque propriété et classez MongoDB et Cassandra selon ce théorème.",
          "correction": "Théorème CAP (Brewer, 2000) : dans un système distribué, il est impossible de garantir simultanément les trois propriétés Consistency (tous les nœuds voient la même donnée à un instant t), Availability (toute requête reçoit une réponse) et Partition tolerance (le système continue à fonctionner malgré une partition réseau). En pratique, P est obligatoire, le choix se fait entre CP et AP. MongoDB est CP (cohérence forte via le primaire du replica set, indisponibilité possible pendant l'élection d'un nouveau primaire). Cassandra est AP (toujours disponible en écriture/lecture, cohérence ajustable et à terme par défaut).",
          "bareme": "4 points"
        },
        {
          "numero": "4",
          "enonce": "Expliquez la différence entre HDFS et MapReduce dans l'écosystème Hadoop.",
          "correction": "HDFS (Hadoop Distributed File System) est la couche de stockage : il découpe les fichiers en blocs (128 Mo par défaut) répliqués sur les DataNodes pilotés par un NameNode. MapReduce est le paradigme de traitement distribué en deux phases : Map transforme les données en paires clé-valeur en parallèle sur les nœuds, Reduce agrège les résultats par clé. HDFS répond au problème du stockage massif, MapReduce au problème du calcul distribué. Depuis Hadoop 2, l'ordonnancement des jobs est géré par YARN.",
          "bareme": "3 points"
        },
        {
          "numero": "5",
          "enonce": "Soit la collection MongoDB 'etudiants' contenant des documents de la forme : {_id, nom, age, filiere, notes: [{matiere, valeur}]}. Écrivez les requêtes pour : (a) trouver les étudiants en 'GL3A' de plus de 20 ans ; (b) ajouter une note de 15 en 'Big Data' à l'étudiant Alice ; (c) calculer la moyenne d'âge par filière.",
          "correction": "(a) db.etudiants.find({filiere: 'GL3A', age: {$gt: 20}}); (b) db.etudiants.updateOne({nom: 'Alice'}, {$push: {notes: {matiere: 'Big Data', valeur: 15}}}); (c) db.etudiants.aggregate([{$group: {_id: '$filiere', moyenneAge: {$avg: '$age'}}}]). Note : on pourrait ajouter {$sort: {moyenneAge: -1}} pour trier les filières.",
          "bareme": "5 points"
        },
        {
          "numero": "6",
          "enonce": "Décrivez l'architecture Lambda et ses trois couches en précisant pour chacune une technologie typique.",
          "correction": "L'architecture Lambda (Nathan Marz) gère les données massives en combinant traitement batch et temps réel via trois couches. (1) Batch layer : stocke le master dataset immuable et calcule des vues agrégées périodiquement — technologies : HDFS pour le stockage, Hadoop MapReduce ou Spark pour le calcul. (2) Speed layer : traite les données récentes en temps réel pendant que le batch s'exécute — technologies : Spark Streaming, Apache Flink, Storm, avec stockage dans Cassandra ou Redis. (3) Serving layer : expose aux clients la fusion des vues batch et temps réel — technologies : Cassandra, MongoDB, ElasticSearch. Les clients fusionnent les vues pour disposer de données complètes et fraîches.",
          "bareme": "4 points"
        },
        {
          "numero": "7",
          "enonce": "Différenciez sharding et réplication. Une base de données peut-elle utiliser les deux mécanismes simultanément ? Justifiez.",
          "correction": "Le sharding (partitionnement horizontal) divise un dataset en fragments répartis sur plusieurs nœuds selon une clé de partition. Objectif : scalabilité horizontale (capacité de stockage et débit d'écriture). La réplication copie les mêmes données sur plusieurs nœuds (master-slave ou multi-master). Objectif : haute disponibilité, tolérance aux pannes, scalabilité en lecture. Oui, les deux sont complémentaires : MongoDB combine replica sets (HA) et sharding (scale en écriture) ; chaque shard est lui-même un replica set. Cassandra combine partitionnement (anneau de hachage cohérent) et facteur de réplication (RF=3 typique) pour avoir à la fois scalabilité et tolérance aux pannes.",
          "bareme": "3 points"
        },
        {
          "numero": "8",
          "enonce": "Écrivez une requête Cypher (Neo4j) qui : (a) crée deux personnes Alice et Bob et une relation d'amitié entre elles ; (b) trouve tous les amis des amis d'Alice qui ne sont pas déjà ses amis directs.",
          "correction": "(a) CREATE (a:Personne {nom: 'Alice'})-[:AMI]->(b:Personne {nom: 'Bob'}); (b) MATCH (alice:Personne {nom: 'Alice'})-[:AMI]->(ami)-[:AMI]->(amiDami) WHERE amiDami <> alice AND NOT (alice)-[:AMI]->(amiDami) RETURN DISTINCT amiDami.nom AS suggestion. Ce type de requête est typique des moteurs de recommandation d'amis dans les réseaux sociaux. Neo4j est très performant car la traversée se fait en index-free adjacency (suivi direct des pointeurs).",
          "bareme": "4 points"
        },
        {
          "numero": "9",
          "enonce": "Expliquez les concepts de partition key et clustering key dans Cassandra à l'aide d'un exemple de table.",
          "correction": "Dans Cassandra, la clé primaire combine une partition key et une (ou plusieurs) clustering key. La partition key détermine, via un hachage (Murmur3), le nœud de stockage dans l'anneau : tous les enregistrements partageant la même partition key sont sur le même nœud. La clustering key trie les lignes au sein d'une partition. Exemple : CREATE TABLE messages (utilisateur_id UUID, date TIMESTAMP, message TEXT, PRIMARY KEY ((utilisateur_id), date)) WITH CLUSTERING ORDER BY (date DESC). Ici utilisateur_id est la partition key (tous les messages d'un utilisateur sur le même nœud), date est la clustering key (tri chronologique décroissant). Permet de récupérer rapidement les derniers messages d'un utilisateur en une requête à un seul nœud.",
          "bareme": "4 points"
        },
        {
          "numero": "10",
          "enonce": "Distinguez les approches ETL et ELT dans un pipeline de données. Laquelle est privilégiée dans un contexte Big Data et pourquoi ?",
          "correction": "ETL (Extract-Transform-Load) extrait les données des sources, les transforme sur un serveur intermédiaire (nettoyage, jointures, agrégations), puis charge le résultat dans la cible (data warehouse). Adapté aux SGBDR traditionnels qui ne peuvent ingérer que des données structurées. ELT (Extract-Load-Transform) charge directement les données brutes dans une cible scalable (data lake HDFS, S3, ou data warehouse cloud comme BigQuery/Snowflake) puis effectue les transformations à la demande grâce à la puissance de calcul de la cible. En Big Data, ELT est privilégié car : (1) les volumes sont trop importants pour être transformés en intermédiaire, (2) les cibles modernes ont une puissance de calcul massive et scalable, (3) on conserve les données brutes permettant de retraiter différemment plus tard (data lake comme source de vérité), (4) les schémas évolutifs sont supportés (schema-on-read).",
          "bareme": "3 points"
        },
        {
          "numero": "11",
          "enonce": "Citez 4 types de données Redis et donnez pour chacun un exemple d'usage concret.",
          "correction": "(1) Strings : valeur simple jusqu'à 512 Mo — ex. cache d'un objet JSON sérialisé (SET user:42 '{...}'). (2) Lists : listes chaînées — ex. file d'attente de jobs (LPUSH/BRPOP). (3) Sets : ensembles non ordonnés — ex. ensemble de tags d'un article (SADD article:1:tags 'bigdata'). (4) Sorted Sets (ZSet) : ensembles ordonnés par score — ex. classement temps réel de joueurs (ZADD leaderboard 1500 'Alice'). (5) Hashes : objets clé→valeur — ex. profil utilisateur (HSET user:42 nom 'Alice' age 25). Mentionner aussi Streams pour les flux d'événements et HyperLogLog pour les comptages approximatifs.",
          "bareme": "4 points"
        },
        {
          "numero": "12",
          "enonce": "Quelles sont les principales différences entre une base SQL relationnelle et une base NoSQL ? Donnez 4 critères.",
          "correction": "(1) Schéma : SQL impose un schéma rigide défini avant insertion (DDL), NoSQL est schema-less ou schema-flexible (les documents/colonnes peuvent varier). (2) Scalabilité : SQL scale verticalement (machine plus puissante), NoSQL scale horizontalement (ajout de nœuds). (3) Modèle de données : SQL utilise des tables relationnelles avec jointures, NoSQL utilise des modèles variés (clé-valeur, documents, colonnes, graphes) sans jointure native. (4) Transactions : SQL garantit ACID, NoSQL adopte BASE (cohérence à terme). (5) Langage : SQL est standardisé, NoSQL utilise des API spécifiques (CQL, MQL, Cypher). (6) Usage : SQL pour les données structurées avec relations complexes (ERP, banque), NoSQL pour les données semi/non structurées massives (web, IoT, social).",
          "bareme": "3 points"
        }
      ]
    },
    {
      "titre": "Épreuve type Big Data & NoSQL - Examen blanc 2 (cas pratique)",
      "source": "Sujet fabriqué pour entraînement IAI Cameroun SN2 - inspiré du programme du cours Mr. MESSIO",
      "questions": [
        {
          "numero": "1",
          "enonce": "Une plateforme de e-commerce stocke 2 To de logs de navigation par jour. Le service marketing souhaite analyser les parcours utilisateurs en temps réel et générer des recommandations produits. Justifiez le choix d'une architecture Lambda et proposez les technologies pour chaque couche.",
          "correction": "Justification : volume massif (2 To/jour) impossible à gérer avec un SGBDR, besoin simultané d'analyses fiables historiques (batch) et de recommandations temps réel (speed). Architecture proposée : (1) Ingestion via Apache Kafka qui sert de bus d'événements distribué. (2) Batch layer : stockage du master dataset sur HDFS ou S3, calcul des modèles de recommandation et agrégations longues via Apache Spark (jobs nocturnes). (3) Speed layer : Spark Streaming ou Flink consomme Kafka, met à jour les vues temps réel dans Redis (cache de recommandations) ou Cassandra (historique de navigation). (4) Serving layer : MongoDB ou ElasticSearch pour exposer les recommandations à l'API web. (5) Visualisation via Tableau ou Power BI pour le marketing. Avantages : tolérance aux erreurs (recomputation), scalabilité, latence faible.",
          "bareme": "5 points"
        },
        {
          "numero": "2",
          "enonce": "Vous concevez la base d'un réseau social. Quel SGBD NoSQL choisiriez-vous pour : (a) le profil utilisateur, (b) les sessions de connexion, (c) le fil d'actualité, (d) les recommandations d'amis ? Justifiez chaque choix.",
          "correction": "(a) Profil utilisateur : MongoDB (base documents) car schéma flexible permettant des champs optionnels (bio, photo, intérêts variables), requêtes par champs (recherche par email, ville), index secondaires. (b) Sessions : Redis (clé-valeur in-memory) car accès ultra-rapide par token de session, TTL natif pour expiration automatique (ex. SETEX session:abc123 3600 user_id), pas besoin de persistance forte. (c) Fil d'actualité : Cassandra (colonnes) car écritures massives (chaque post génère N entrées pour les abonnés), partition key par utilisateur et clustering key par date décroissante permettant de récupérer les derniers posts d'un utilisateur en une seule requête à un nœud. (d) Recommandations d'amis : Neo4j (graphe) car requête naturelle de type 'amis des amis' via Cypher en pattern matching, performance constante grâce à l'index-free adjacency.",
          "bareme": "5 points"
        },
        {
          "numero": "3",
          "enonce": "Un développeur souhaite migrer une application MySQL surchargée (4000 écritures/seconde) vers MongoDB. Quels mécanismes MongoDB doit-il configurer pour assurer la scalabilité et la haute disponibilité ? Décrivez en détail.",
          "correction": "Le développeur doit configurer simultanément un sharded cluster avec replica sets. (1) Replica Set : pour la haute disponibilité, chaque shard est un replica set composé d'un primaire (reçoit les écritures) et d'au moins 2 secondaires (réplication asynchrone). En cas de panne du primaire, une élection automatique désigne un nouveau primaire en quelques secondes (failover). On peut aussi configurer un arbiter pour départager les votes. (2) Sharding : pour la scalabilité en écriture, on partitionne la collection sur plusieurs shards via une shard key. Choix critique : shard key hachée (ex. _id haché) pour une distribution uniforme, ou shard key rangée (ex. date) pour les requêtes par plage. Le routeur mongos dirige les requêtes vers le bon shard via les config servers qui stockent les métadonnées. (3) Index appropriés pour éviter les COLLSCAN. (4) Write concern (w:'majority') pour garantir la cohérence des écritures critiques. (5) Read preference (primary/secondary/nearest) pour répartir la charge en lecture. Capacité finale : on peut scale horizontalement en ajoutant des shards à la demande.",
          "bareme": "5 points"
        },
        {
          "numero": "4",
          "enonce": "Soit le pipeline d'agrégation MongoDB suivant : db.ventes.aggregate([{$match: {pays: 'Cameroun'}}, {$group: {_id: '$produit', total: {$sum: '$montant'}}}, {$sort: {total: -1}}, {$limit: 5}]). Expliquez chaque étape et donnez l'équivalent SQL.",
          "correction": "Étapes : (1) $match : filtre les documents pour ne garder que les ventes au Cameroun (équivalent WHERE en SQL). (2) $group : regroupe par produit et calcule la somme des montants pour chaque groupe (équivalent GROUP BY + SUM). (3) $sort : trie le résultat par total décroissant (équivalent ORDER BY total DESC). (4) $limit : retourne uniquement les 5 premiers (équivalent LIMIT 5). Équivalent SQL : SELECT produit, SUM(montant) AS total FROM ventes WHERE pays='Cameroun' GROUP BY produit ORDER BY total DESC LIMIT 5. Cette requête identifie les 5 produits les plus vendus en valeur au Cameroun. Optimisation : créer un index composé db.ventes.createIndex({pays:1, produit:1}) pour accélérer le $match et le $group.",
          "bareme": "4 points"
        },
        {
          "numero": "5",
          "enonce": "Expliquez la différence entre une cohérence forte et une cohérence à terme (eventual consistency). Donnez un exemple concret où l'une est préférable à l'autre.",
          "correction": "Cohérence forte (strong consistency) : après une écriture réussie, toutes les lectures ultérieures retournent la valeur écrite, sur n'importe quel nœud. Implémentée via synchronisation (verrous distribués, consensus type Paxos/Raft, two-phase commit). Coût : latence accrue et baisse de disponibilité en cas de partition réseau (théorème CAP). Cohérence à terme (eventual consistency) : après une écriture, les nœuds convergent vers la même valeur, mais des lectures intermédiaires peuvent retourner des valeurs obsolètes. Latence basse et haute disponibilité. Exemples : (a) Cohérence forte préférable : transaction bancaire (transfert de 1000€), réservation de billets d'avion, gestion de stock médical où une vente de la dernière unité ne doit pas être contredite. (b) Cohérence à terme préférable : compteur de vues sur YouTube (un léger décalage est acceptable), commentaires sur un blog (un délai de quelques secondes avant que tous voient le commentaire est tolérable), panier d'achat dans un site e-commerce à très grande échelle.",
          "bareme": "3 points"
        },
        {
          "numero": "6",
          "enonce": "Citez 3 défis principaux du Big Data en entreprise et proposez une solution pour chacun.",
          "correction": "(1) Stockage massif et coût : les volumes de Po nécessitent un stockage scalable et économique. Solution : utiliser un Data Lake basé sur HDFS ou un stockage objet cloud (Amazon S3, Google Cloud Storage) qui scale horizontalement à très bas coût (~0.02$/Go/mois). (2) Sécurité et confidentialité : risques de fuite de données personnelles, conformité RGPD/CCPA. Solution : chiffrement au repos (TDE, KMS) et en transit (TLS), contrôles d'accès fins (RBAC, Kerberos sur Hadoop), anonymisation/pseudonymisation des données personnelles, audit logging. (3) Intégration de données hétérogènes : sources multiples avec formats variés. Solution : pipelines ETL/ELT avec outils comme Apache NiFi, Airflow ou Talend, schémas évolutifs (schema-on-read), data catalog (Apache Atlas) pour gouvernance. (4 bonus) Compétences rares : pénurie de data engineers/scientists. Solution : formation continue, outils low-code (Dataiku, Knime), AutoML.",
          "bareme": "3 points"
        },
        {
          "numero": "7",
          "enonce": "Vous avez la table Cassandra suivante : CREATE TABLE capteurs_iot (capteur_id UUID, timestamp TIMESTAMP, temperature FLOAT, humidite FLOAT, PRIMARY KEY ((capteur_id), timestamp)). (a) Pourquoi ce design est-il adapté à des séries temporelles IoT ? (b) Écrivez la requête CQL pour récupérer les 100 dernières mesures du capteur 'abc-123'.",
          "correction": "(a) Ce design est adapté car : (1) la partition key capteur_id distribue les données sur l'anneau Cassandra avec une bonne répartition (chaque capteur est sur un nœud déterministe), (2) la clustering key timestamp permet un tri natif chronologique au sein de chaque partition, donc l'accès aux dernières mesures est ultra-rapide (lecture séquentielle SSTable), (3) Cassandra excelle dans les écritures massives requises par l'IoT (millions de points/seconde), (4) le facteur de réplication assure la tolérance aux pannes. Idéalement on ajouterait WITH CLUSTERING ORDER BY (timestamp DESC) pour stocker physiquement les données dans l'ordre décroissant. (b) SELECT * FROM capteurs_iot WHERE capteur_id = abc-123-uuid ORDER BY timestamp DESC LIMIT 100. Note : si on n'a pas spécifié CLUSTERING ORDER, ORDER BY timestamp DESC est autorisé seulement car la partition key est filtrée par égalité.",
          "bareme": "4 points"
        },
        {
          "numero": "8",
          "enonce": "Comparez Hadoop MapReduce et Apache Spark sur 4 critères. Dans quel cas chacun est-il préférable ?",
          "correction": "(1) Modèle d'exécution : MapReduce lit/écrit le disque entre chaque job (Map → disque → Reduce), Spark conserve les RDD en mémoire entre transformations. (2) Performance : Spark est 10 à 100x plus rapide pour des pipelines itératifs (machine learning, graphes) grâce au in-memory. MapReduce reste compétitif pour des jobs simples one-shot très volumineux. (3) API : MapReduce a une API bas niveau verbeuse en Java, Spark offre des API riches en Scala/Java/Python/R avec abstractions de haut niveau (DataFrames, Datasets, SQL). (4) Écosystème : MapReduce est centré batch, Spark unifie batch, streaming (Spark Streaming/Structured Streaming), ML (MLlib), graphes (GraphX), SQL. (5) Tolérance aux pannes : MapReduce recalcule depuis disque, Spark via lineage des RDD. Cas d'usage : MapReduce préférable pour des ETL volumineux nocturnes sur cluster Hadoop existant avec ressources limitées (RAM). Spark préférable pour ML/Deep Learning, requêtes interactives, streaming temps réel, pipelines complexes nécessitant plusieurs passes sur les données.",
          "bareme": "4 points"
        }
      ]
    }
  ],
  "sig": [
    {
      "titre": "Exercice 01 (tutore) - Selections SQL sur la table commune",
      "source": "Chapitre 2 - Rappel Langage SQL et Extensions spatiales (Mme KO Nathalie, IAI Cameroun), section VII",
      "questions": [
        {
          "numero": "1",
          "enonce": "Selectionner les communes du departement de la Sarthe de plus de 1500 habitants en affichant un tableau avec les noms de communes et leur population. (On utilise la table commune, les champs nom des communes et population dans le SELECT, et deux conditions 'departement de la Sarthe' ET 'population de plus de 1500 habitants' dans le WHERE.)",
          "correction": "On selectionne deux colonnes (nom et population) et on combine deux conditions avec AND dans la clause WHERE. En supposant que le nom du departement est porte par la colonne nom_dept et le nom de commune par nom_comm :\n\nSELECT nom_comm, population\nFROM commune\nWHERE nom_dept = 'Sarthe' AND population > 1500;\n\nSi les colonnes de la table sont nommees en majuscules (comme dans la table fournie : NOM_DEPT, NOM_COMM, POPULATION), il faut proteger les noms par des guillemets doubles sous PostgreSQL et utiliser la valeur litterale exacte :\n\nSELECT \"NOM_COMM\", \"POPULATION\"\nFROM commune\nWHERE \"NOM_DEPT\" = 'SARTHE' AND \"POPULATION\" > 1500;\n\nPoints cles : AND lie deux conditions completes (chacune avec son operateur de comparaison) ; la valeur litterale 'SARTHE' est sensible a la casse (guillemets simples).",
          "bareme": "5 points : 2 pts pour le SELECT des deux bonnes colonnes, 1,5 pt pour la condition sur le departement, 1,5 pt pour la condition population > 1500 reliee par AND."
        },
        {
          "numero": "2",
          "enonce": "Selectionner les communes de la table COMMUNE dont le statut n'est PAS chef-lieu de canton et afficher la colonne NOM_COMM en lui donnant comme alias NOM, ainsi que les colonnes STATUT, POPULATION et SUPERFICIE. (Indice : traduire le 'n'est pas' par l'utilisation de NOT.)",
          "correction": "On traduit la negation par NOT (ou de maniere equivalente par l'operateur <>) et on attribue un alias avec AS :\n\nSELECT \"NOM_COMM\" AS \"NOM\", \"STATUT\", \"POPULATION\", \"SUPERFICIE\"\nFROM commune\nWHERE NOT (\"STATUT\" = 'Chef-lieu de canton');\n\nForme equivalente avec l'operateur different :\n\nSELECT \"NOM_COMM\" AS \"NOM\", \"STATUT\", \"POPULATION\", \"SUPERFICIE\"\nFROM commune\nWHERE \"STATUT\" <> 'Chef-lieu de canton';\n\nPoints cles : NOT inverse la condition ; l'alias se definit avec AS (l'alias en majuscules necessite des guillemets doubles pour preserver la casse) ; la valeur 'Chef-lieu de canton' doit etre ecrite exactement (sensibilite a la casse).",
          "bareme": "4 points : 1 pt pour la negation correcte (NOT ou <>), 1,5 pt pour l'alias NOM bien defini avec AS, 1,5 pt pour l'affichage des trois autres colonnes."
        },
        {
          "numero": "3",
          "enonce": "Calculer pour chaque departement : la population totale, la densite moyenne de population des communes = moyenne(population commune / superficie commune) arrondie a deux decimales, la population de la commune la plus peuplee et celle de la moins peuplee, la superficie moyenne des communes. (Resultat attendu par departement, ex : SARTHE -> population_dept 28200 ; densite_moy 0.57 ; pop_max 15400 ; pop_min 400 ; surface_moy 2255.19.)",
          "correction": "On agrege par departement avec GROUP BY et on utilise les fonctions d'agregation sum, avg, max, min. Attention : population et superficie etant des ENTIERS, il faut convertir (cast) la population en decimal AVANT la division, sinon la division entiere renvoie un resultat tronque.\n\nSELECT \"NOM_DEPT\",\n       sum(\"POPULATION\") AS population_dept,\n       round(avg(cast(\"POPULATION\" AS numeric) / \"SUPERFICIE\"), 2) AS densite_moy_communes,\n       max(\"POPULATION\") AS pop_max_commune,\n       min(\"POPULATION\") AS pop_min_commune,\n       round(avg(cast(\"SUPERFICIE\" AS numeric)), 2) AS surface_moy_commune\nFROM commune\nGROUP BY \"NOM_DEPT\";\n\nNotation compacte PostGIS avec :: pour le cast :\n\nSELECT \"NOM_DEPT\",\n       sum(\"POPULATION\") AS population_dept,\n       round(avg(\"POPULATION\"::numeric / \"SUPERFICIE\"), 2) AS densite_moy_communes,\n       max(\"POPULATION\") AS pop_max_commune,\n       min(\"POPULATION\") AS pop_min_commune,\n       round(avg(\"SUPERFICIE\"::numeric), 2) AS surface_moy_commune\nFROM commune\nGROUP BY \"NOM_DEPT\";\n\nPoints cles : GROUP BY sur NOM_DEPT ; usage des cinq fonctions d'agregation ; transtypage en numeric AVANT la division pour eviter la division entiere ; round(..., 2) pour deux decimales.",
          "bareme": "6 points : 1 pt pour le GROUP BY sur NOM_DEPT, 1 pt par indicateur correct (sum, densite moyenne, max, min, superficie moyenne = 5 pts), avec penalite si le cast avant division est oublie (la densite serait alors 0)."
        },
        {
          "numero": "4",
          "enonce": "Quels sont les surfaces (en km2) et perimetres (en km), arrondis a deux chiffres apres la virgule, des communes du departement de la Sarthe ? On considere que la geometrie s'appelle geometry et que le SRID est le 2154 (RGF93/Lambert93), d'unite le metre. (Indice : trouver la fonction geometrique qui renvoie une aire et celle qui renvoie un perimetre ; ces fonctions ne prennent pas de parametre d'unite, il faut donc faire la conversion soi-meme par une division.)",
          "correction": "On utilise les fonctions spatiales PostGIS ST_Area (surface, en m2 car le SRID 2154 est en metres) et ST_Perimeter (perimetre, en m). Pour convertir en km2 on divise la surface par 1 000 000 (1 km2 = 1 000 000 m2) et pour convertir en km on divise le perimetre par 1 000. On arrondit a deux decimales avec round, en s'assurant du type numeric.\n\nSELECT \"NOM_COMM\",\n       round((ST_Area(geometry) / 1000000)::numeric, 2) AS surface_km2,\n       round((ST_Perimeter(geometry) / 1000)::numeric, 2) AS perimetre_km\nFROM commune\nWHERE \"NOM_DEPT\" = 'SARTHE';\n\nPoints cles : ST_Area renvoie une aire en unite du SRID (ici le m2), ST_Perimeter un perimetre en m ; conversion m2 -> km2 par division par 1 000 000 et m -> km par division par 1 000 ; round(..., 2) pour deux decimales (le format numeric est obligatoire pour round sous PostGIS) ; filtre WHERE sur le departement de la Sarthe. On veillera a prefixer par ST_ pour la conformite au standard SQL/MM.",
          "bareme": "5 points : 1,5 pt pour ST_Area et la conversion en km2, 1,5 pt pour ST_Perimeter et la conversion en km, 1 pt pour l'arrondi a deux decimales, 1 pt pour le filtre WHERE sur la Sarthe."
        }
      ]
    }
  ],
  "entreprenariat": [
    {
      "titre": "Examen de Rattrapage - QCM (Niveau 3, duree 1h)",
      "source": "EPREUVES DE Creation d'entreprise.pdf - Examen de Rattrapage, Cours: Creation d'entreprise (page 1) - Centre d'Excellence Technologique Paul Biya / IAI Cameroun",
      "questions": [
        {
          "numero": "1",
          "enonce": "Que signifie SWOT ? A) Forces, faiblesses, opportunites et menaces ; B) ... ; C) ... ; D) ...",
          "correction": "Reponse A. SWOT = Strengths, Weaknesses, Opportunities, Threats = Forces, Faiblesses, Opportunites et Menaces. C'est l'outil de diagnostic strategique croisant l'analyse interne (forces/faiblesses) et externe (opportunites/menaces).",
          "bareme": "1 pt"
        },
        {
          "numero": "2",
          "enonce": "Sur quoi porte un exemple de force dans une analyse SWOT ?",
          "correction": "Reponse B. Une force est un element interne positif de l'entreprise. L'analyse SWOT oppose les facteurs internes (forces/faiblesses) aux facteurs externes (opportunites/menaces).",
          "bareme": "1 pt"
        },
        {
          "numero": "3",
          "enonce": "Quel est l'objectif/element principal de l'environnement interne d'une entreprise ?",
          "correction": "Reponse B : la structure organisationnelle. L'environnement interne regroupe l'organisation, les ressources et procedures propres a la firme, par opposition au marche externe.",
          "bareme": "1 pt"
        },
        {
          "numero": "4",
          "enonce": "Quel est un exemple de facteur externe affectant l'environnement de l'entreprise ?",
          "correction": "Reponse C : la demande du marche et la concurrence. Ce sont des elements du micro-environnement externe que l'entreprise subit (clients, concurrents, fournisseurs).",
          "bareme": "1 pt"
        },
        {
          "numero": "5",
          "enonce": "Quelle est une caracteristique cle d'une structure organisationnelle hierarchique ?",
          "correction": "Reponse C : plusieurs niveaux de gestion et une chaine de commandement claire. La hierarchie repose sur des lignes d'autorite verticales bien definies.",
          "bareme": "1 pt"
        },
        {
          "numero": "6",
          "enonce": "Dans une structure hierarchique, qui rapporte generalement au gestionnaire de departement ?",
          "correction": "Reponse B : les chefs d'equipe ou superviseurs, qui encadrent eux-memes les employes de premiere ligne.",
          "bareme": "1 pt"
        },
        {
          "numero": "7",
          "enonce": "Qui est credite du developpement de la theorie de la gestion scientifique ?",
          "correction": "Reponse A : Frederick Winslow Taylor, pere de l'organisation scientifique du travail (taylorisme).",
          "bareme": "1 pt"
        },
        {
          "numero": "8",
          "enonce": "Quel est le principe cle de la theorie de la gestion scientifique ?",
          "correction": "Reponse B : la standardisation des processus de travail et des taches, afin d'optimiser le rendement (decomposition et chronometrage des operations).",
          "bareme": "1 pt"
        },
        {
          "numero": "9",
          "enonce": "Quelle structure organisationnelle combine les structures fonctionnelles et basees sur le projet ?",
          "correction": "Reponse D : la structure matricielle, qui croise une logique metier (fonctionnelle) et une logique projet, avec une double ligne de rattachement.",
          "bareme": "1 pt"
        },
        {
          "numero": "10",
          "enonce": "Quel type d'innovation implique l'introduction du commerce electronique et de l'education en ligne ?",
          "correction": "Reponse C : l'innovation de modele commercial (business model), car le e-commerce et l'e-learning transforment la facon de creer et de capter de la valeur.",
          "bareme": "1 pt"
        },
        {
          "numero": "11",
          "enonce": "Quel est un moteur cle de l'innovation ?",
          "correction": "Reponse C : la collaboration et l'experimentation. L'aversion au risque, la bureaucratie et l'attachement strict aux methodes traditionnelles freinent l'innovation.",
          "bareme": "1 pt"
        },
        {
          "numero": "12",
          "enonce": "Quel est l'objectif principal d'une entreprise ?",
          "correction": "Reponse B : generer des profits et creer de la valeur. Le but de l'entreprise est de produire des biens/services vendus avec profit pour assurer sa survie et son developpement.",
          "bareme": "1 pt"
        },
        {
          "numero": "13",
          "enonce": "Quelle est une caracteristique d'une entreprise prospere ?",
          "correction": "Reponse C : un leadership fort et une planification strategique. La dependance excessive a un seul client (option D) est au contraire un facteur de risque.",
          "bareme": "1 pt"
        },
        {
          "numero": "14",
          "enonce": "Quelle est l'etape cle dans le processus de creation d'une entreprise ?",
          "correction": "Reponse D : toutes les reponses ci-dessus (etude de marche/analyses, business plan complet, campagne marketing). Le processus enchaine ces etapes complementaires.",
          "bareme": "1 pt"
        },
        {
          "numero": "15",
          "enonce": "Qu'est-ce qui est essentiel pour obtenir un financement pour une nouvelle entreprise ?",
          "correction": "Reponse A : un plan d'affaires (business plan) bien redige, document de reference qui convainc banquiers et investisseurs.",
          "bareme": "1 pt"
        },
        {
          "numero": "16",
          "enonce": "Qui est credite du developpement de la theorie de la gestion administrative ?",
          "correction": "Reponse B : Henri Fayol, fondateur de la theorie administrative et des fonctions du management.",
          "bareme": "1 pt"
        },
        {
          "numero": "17",
          "enonce": "Selon la theorie de la gestion administrative, quelle est l'une des fonctions cles de la gestion ?",
          "correction": "Reponse D : toutes les reponses (controler, diriger, organiser). Fayol cite prevoir/planifier, organiser, commander, coordonner et controler.",
          "bareme": "1 pt"
        },
        {
          "numero": "18",
          "enonce": "Quelle est la source courante d'idees commerciales ?",
          "correction": "Reponse D : toutes les reponses (etudes de marche, experience personnelle et competences, analyse de la concurrence).",
          "bareme": "1 pt"
        },
        {
          "numero": "19",
          "enonce": "Qu'est-ce qu'une source potentielle d'opportunites commerciales ?",
          "correction": "Reponse D : toutes les reponses (technologies emergentes et tendances, changement de reglementation gouvernementale, changement du comportement des consommateurs).",
          "bareme": "1 pt"
        },
        {
          "numero": "20",
          "enonce": "Quelle est une consideration cle lors de l'evaluation de la faisabilite d'une idee commerciale ?",
          "correction": "Reponse D : toutes les reponses (taille et potentiel de croissance du marche, paysage concurrentiel et part de marche, projections financieres et retour sur investissement).",
          "bareme": "1 pt"
        }
      ]
    },
    {
      "titre": "Epreuve d'Entrepreneuriat et Creation d'Entreprise (Niveau 3 GL/SR, 2024/2025, duree 2h, aucun document autorise)",
      "source": "EPREUVES DE Creation d'entreprise.pdf (page 2) - Centre d'Excellence Technologique Paul Biya, 2024/2025",
      "questions": [
        {
          "numero": "1",
          "enonce": "Apres avoir donne une definition simple de l'entreprise, citer sur le plan prive celles qu'on retrouve le plus dans notre environnement economique. Laquelle de ces formes juridiques choisiriez-vous si vous arrivez de creer votre propre entreprise et pourquoi ? (5 points)",
          "correction": "DEFINITION : l'entreprise est une entite economique et juridiquement autonome qui combine travail et capital pour produire des biens ou services vendus sur un marche afin de satisfaire des besoins et faire du profit. FORMES PRIVEES les plus repandues dans l'environnement camerounais : l'entreprise individuelle (EI), l'EURL/SASU (unipersonnelle), la SARL (2-9 associes), la SA/SPA (grande entreprise), la SNC (societe familiale) et le GIC. CHOIX ARGUMENTE : pour une premiere creation, la SARL est generalement recommandee car elle limite la responsabilite aux apports, autorise plusieurs associes, exige un capital accessible et confere un meilleur 'standing' qu'une EI ; l'EI/EURL convient si l'on veut rester seul maitre a bord avec des formalites allegees. (Toute reponse coherente et justifiee est acceptee.)",
          "bareme": "5 points"
        },
        {
          "numero": "2",
          "enonce": "La creation d'entreprise est un important levier de developpement de notre pays. Expliquer cette assertion avec un (01) exemple precis. (2 points)",
          "correction": "La creation d'entreprise est le 1er moteur de creation d'emploi et de richesse : elle renouvelle le systeme economique (destruction creatrice de Schumpeter), genere de l'innovation et contribue au PIB. Au Cameroun, ~99% des ~94 000 entreprises sont des PME ; selon le ministre de tutelle la creation d'entreprise contribuerait a creer environ 64% des emplois et 34% du produit brut (2020). EXEMPLE : une start-up de e-commerce ou une PME agroalimentaire qui cree des emplois directs et induits, forme du personnel et dynamise une filiere locale.",
          "bareme": "2 points"
        },
        {
          "numero": "3",
          "enonce": "Citer quatre structures de promotion de la creation d'entreprises au Cameroun et donner le role de chacune d'elles. (4 points)",
          "correction": "Quatre structures (1 point chacune avec role) : (1) le CFCE - Centre de Formalites de Creation d'Entreprise : guichet unique d'immatriculation et de delivrance des documents de creation ; (2) l'APME - Agence de Promotion des PME : appui, accompagnement et encadrement des PME ; (3) le BMN - Bureau de Mise a Niveau : amelioration de la competitivite des entreprises ; (4) la Bourse de sous-traitance et de partenariat / Agro-PME Fondation : mise en relation, conseil et financement des promoteurs. (Les Centres de Gestion Agrees et les structures bancaires/business angels sont egalement acceptes.)",
          "bareme": "4 points"
        },
        {
          "numero": "4",
          "enonce": "Pour des projets sociaux, le cycle de projet contient differentes phases dont l'identification est l'une des principales. Pourquoi ? Quelle difference faites-vous entre un projet economique et un projet social ? (2 points)",
          "correction": "L'IDENTIFICATION est cruciale car c'est la phase de decouverte et de validation de l'idee : elle conditionne la pertinence, la faisabilite et le succes du projet ; une mauvaise identification du besoin/de l'opportunite compromet toutes les phases suivantes. DIFFERENCE : un projet economique vise principalement la rentabilite financiere et le profit ; un projet social vise prioritairement l'impact social (amelioration des conditions de vie, emploi, cohesion) meme si une viabilite financiere reste necessaire.",
          "bareme": "2 points"
        },
        {
          "numero": "5",
          "enonce": "En quoi consiste le metier d'entrepreneur ? Comment un entrepreneur cree-t-il son entreprise ? (2 points)",
          "correction": "Le METIER d'entrepreneur consiste a creer, developper et gerer une entreprise : il est responsable de toutes les activites, assume le risque, decide d'investir, mobilise des ressources humaines, technologiques et financieres et exerce un leadership pour diriger son equipe. CREATION : il suit les cinq etapes - evaluation de l'opportunite, conception/formulation du projet (etudes de marche, juridique, financiere), montage juridique et financement, prise de decision, puis lancement de l'activite.",
          "bareme": "2 points"
        },
        {
          "numero": "6",
          "enonce": "Quelles sont les differentes etapes de validation d'une idee de creation d'entreprise ? citer sans definir. (5 points)",
          "correction": "Etapes de validation de l'idee : (1) definir precisement l'idee initiale (que vendre ? a qui ? quelle valeur ?) ; (2) rechercher des informations et recueillir l'avis d'experts ; (3) tester l'idee aupres de personnes exterieures ; (4) analyser les contraintes du projet ; (5) verifier l'adequation createur/projet ; (6) transformer l'idee en opportunite realiste resistant a l'usure du temps et a la competition ; aboutissant a la conception du business plan.",
          "bareme": "5 points"
        }
      ]
    },
    {
      "titre": "Rattrapage Creation d'Entreprise (Niveau 3)",
      "source": "EPREUVES DE Creation d'entreprise.pdf (page 3) - Rattrapage, Centre d'Excellence Technologique Paul Biya",
      "questions": [
        {
          "numero": "Ex.1",
          "enonce": "Quelle difference faites-vous entre une entreprise et une societe ? (1.5 pts) Presentez l'effectif de personnel comme un critere de classification des entreprises. (2 pts) Quelle difference faites-vous entre la creation ex-nihilo et l'essaimage ? (2 pts) Quelle difference faites-vous entre un document projet et un business plan ? (1 pt)",
          "correction": "ENTREPRISE vs SOCIETE : l'entreprise est une notion economique (unite de production combinant travail et capital) ; la societe est sa forme juridique, personne morale creee par contrat entre associes (SARL, SA...). Toute societe est une entreprise mais une entreprise peut exister sans etre une societe (entreprise individuelle). EFFECTIF comme critere : TPE 0-9 salaries, PE 10-49, ME 50-199, GE 200 et plus ; critere de moins en moins utilise car l'automatisation reduit les effectifs et chaque pays a sa propre definition. EX-NIHILO vs ESSAIMAGE : ex-nihilo = creer a partir de rien, seul, risque maximal ; essaimage = creer en etant salarie avec l'appui (materiel, financier, commercial) de son entreprise, risque reduit. DOCUMENT PROJET vs BUSINESS PLAN : le document projet decrit l'idee et les grandes lignes ; le business plan est un dossier complet a vocation argumentaire (volets redactionnel et financier) destine a convaincre banquiers et investisseurs.",
          "bareme": "6.5 points"
        },
        {
          "numero": "Ex.2",
          "enonce": "Selon vous, quels peuvent etre les facteurs contextuels ou personnels favorisant la creation d'entreprise ? Commentez les qualites qu'il faut avoir, selon Schumpeter, pour etre un bon entrepreneur. (1 pt)",
          "correction": "FACTEURS PERSONNELS : personnalite, motivation, competences, experience, tenacite, sens des responsabilites, resistance au stress, capacite de travail, d'ecoute, d'adaptation et a se vendre. FACTEURS CONTEXTUELS : etat des marches, environnement socio-economique, croissance demographique (demande), concentration de petites entreprises, taux d'urbanisation eleve, dispositifs d'aide (modele de BIRD : interaction variables personnelles / cadre contextuel). QUALITES SELON SCHUMPETER : capacite d'innovation, leadership, gout d'aller a l'encontre du statu quo, prise de risque, et la 'joie de creer/gagner' qui prime sur la seule recherche du profit.",
          "bareme": "1 point"
        },
        {
          "numero": "Ex.3",
          "enonce": "Definir : 1. l'entrepreneur (1pt) ; 2. le profit entrepreneurial (1pt) ; 3. l'entreprise (1pt) ; 4. au cameroun, l'idee originale d'avoir un cabinet de marketing (1pt) ; 5. la creation d'entreprise (1pt) ; 6. l'entrepreneur peut etre defini comme une personne qui exploite les ressources humaines et materielles pour creer, developper et implanter en relation avec un type d'activites qui permettent de generer l'emploi (1pt) ; 7. l'entrepreneuriat. (sur 7 pts)",
          "correction": "1. ENTREPRENEUR : personne qui cree, developpe et implante une entreprise dont elle assume les risques, en mobilisant moyens financiers, humains et materiels pour realiser un profit (Larousse). 2. PROFIT ENTREPRENEURIAL (J.-B. Say) : remuneration distincte du profit du capital, recompensant la fonction de coordination et la prise de risque de l'entrepreneur. 3. ENTREPRISE : entite economique et juridiquement autonome combinant travail et capital pour produire des biens/services pour le marche. 4. CABINET DE MARKETING : entreprise de services (secteur tertiaire) offrant conseil et accompagnement marketing aux entreprises ; idee originale exploitant une opportunite de marche peu couverte. 5. CREATION D'ENTREPRISE : action de creer, de tirer du neant ; processus en cinq etapes aboutissant au lancement d'une activite economique nouvelle. 6. (definition de l'entrepreneur comme exploitant de ressources pour generer de l'emploi - a valider). 7. ENTREPRENEURIAT : action de creer de la richesse et/ou de l'emploi par la creation ou la reprise d'une entreprise.",
          "bareme": "7 points"
        }
      ]
    },
    {
      "titre": "Controle Continu de Creation d'Entreprise (Annee 2022-2023, Classe SR3B, duree 2h)",
      "source": "EPREUVES DE Creation d'entreprise.pdf (pages 4 et 9, identiques) - Controle Continu 2022-2023",
      "questions": [
        {
          "numero": "Ex.1",
          "enonce": "Definir les termes suivants : Entreprise, entrepreneuriat, environnement, management. (4 pts)",
          "correction": "ENTREPRISE : entite economique et juridiquement autonome combinant travail et capital pour produire des biens/services vendus sur un marche. ENTREPRENEURIAT : action de creer de la richesse et/ou de l'emploi par la creation ou reprise d'une entreprise (generer de la valeur par l'exploitation de nouveaux produits/processus/marches - OCDE). ENVIRONNEMENT : ensemble des facteurs externes (macro, micro, meso) ayant une influence directe ou indirecte sur l'entreprise. MANAGEMENT : ensemble de techniques pour gerer, organiser, diriger, controler et planifier les activites de l'entreprise (Fayol : prevoir, organiser, commander, coordonner, controler).",
          "bareme": "4 points (1 pt par terme)"
        },
        {
          "numero": "1",
          "enonce": "Citer un inconvenient du modele de Shapero. (1 pt)",
          "correction": "Le modele de l'evenement entrepreneurial de Shapero met l'accent sur le declenchement par un evenement (deplacement) et sur les perceptions de desirabilite et de faisabilite ; son principal inconvenient est qu'il privilegie les facteurs de declenchement/situationnels et neglige le processus de mise en oeuvre et la dimension dynamique/temporelle de la creation, restant assez statique et difficilement operationnalisable.",
          "bareme": "1 point"
        },
        {
          "numero": "2",
          "enonce": "Quelles sont les etapes du processus de creation d'une entreprise au Cameroun ? (2 pts)",
          "correction": "Cinq etapes : (1) evaluation de l'opportunite ; (2) conception et formulation du projet (etude de marche, juridique, financiere) ; (3) montage juridique et scenarios de financement et de rentabilite ; (4) prise de decision ; (5) lancement de l'activite. Au Cameroun, le montage juridique et les formalites se concretisent au CFCE.",
          "bareme": "2 points"
        },
        {
          "numero": "3",
          "enonce": "Citer les 6 formes de creation d'entreprise. (2 pts)",
          "correction": "Les formes de creation : (1) creation ex-nihilo ; (2) creation par essaimage (a chaud/curatif et a froid/dynamique) ; (3) creation par franchise ; (4) reprise d'entreprise en bonne sante ; (5) reprise d'entreprise en difficulte ; (6) l'intrapreneuriat (creation/renouvellement au sein d'une organisation existante).",
          "bareme": "2 points"
        },
        {
          "numero": "4",
          "enonce": "Donner un exemple de titre, des beneficiaires, d'objectif global, d'objectifs specifiques et d'activites d'un projet de creation d'entreprise. (3 pts)",
          "correction": "Exemple (projet 'Tech4All') : TITRE : plateforme e-commerce de materiel informatique. BENEFICIAIRES : particuliers, entreprises et institutions. OBJECTIF GLOBAL : devenir la plateforme de reference en e-commerce informatique de la sous-region d'ici 2030. OBJECTIFS SPECIFIQUES : developper une plateforme web/mobile securisee ; etablir un reseau de fournisseurs ; mettre en place une logistique rapide (<72h) ; mener des campagnes digitales ; recruter et former le personnel. ACTIVITES : developpement du site/app, signature de partenariats, ouverture d'un entrepot, campagnes de communication, recrutement.",
          "bareme": "3 points"
        },
        {
          "numero": "5",
          "enonce": "Comment calcule-t-on le resultat net d'une entreprise et quels sont les types de resultat net ? (1 pt)",
          "correction": "RESULTAT NET = total des produits - total des charges (ou Chiffre d'affaires - charges, apres impots). Types : resultat d'exploitation, resultat financier et resultat exceptionnel, dont la somme apres impot sur les societes donne le resultat net (benefice si positif, perte si negatif).",
          "bareme": "1 point"
        },
        {
          "numero": "6",
          "enonce": "Classer les entreprises en fonction de l'effectif du personnel. (1 pt)",
          "correction": "TPE : 0 a 9 salaries ; Petites entreprises : 10 a 49 salaries ; Moyennes entreprises : 50 a 199 salaries ; Grandes entreprises : 200 salaries et plus.",
          "bareme": "1 point"
        },
        {
          "numero": "7",
          "enonce": "En utilisant le critere secteur, classer les entreprises. (1 pt)",
          "correction": "Secteur primaire (production de matieres premieres : agriculture, peche, mines) ; secteur secondaire (transformation/industrie : textile, chimie, batiment) ; secteur tertiaire (services : assurance, transport, professions liberales) ; secteur quaternaire (traitement et diffusion de l'information, informatique).",
          "bareme": "1 point"
        },
        {
          "numero": "8",
          "enonce": "Quelle est la relation qui existe entre un business plan et une etude de marche ? (1 pt)",
          "correction": "L'etude de marche est une composante du business plan : elle analyse la demande, l'offre, la concurrence et l'environnement, et fournit les donnees qui alimentent la partie redactionnelle (positionnement) et la partie financiere (previsions de chiffre d'affaires) du business plan. Le business plan integre et formalise les conclusions de l'etude de marche.",
          "bareme": "1 point"
        },
        {
          "numero": "9",
          "enonce": "Quelles sont les differentes sources d'idees de creation d'entreprise ? (1 pt)",
          "correction": "Sources d'idees : l'experience personnelle et les competences, les etudes/analyses de marche, l'analyse de la concurrence, l'observation des problemes/besoins non satisfaits, les technologies emergentes, les evolutions reglementaires et les changements de comportement des consommateurs.",
          "bareme": "1 point"
        },
        {
          "numero": "10",
          "enonce": "Expliquer l'importance du business plan pour une entreprise. (1 pt)",
          "correction": "Le business plan formalise le projet, sert de document de reference et de pilotage, et a une vocation argumentaire : il permet d'obtenir un financement bancaire, d'attirer des investisseurs et de negocier avec les fournisseurs. Sa qualite conditionne le succes de la demande de financement.",
          "bareme": "1 point"
        },
        {
          "numero": "11",
          "enonce": "Citer et expliquer les qualites d'un bon manager. (1 pt)",
          "correction": "Un bon manager sait prevoir/planifier, organiser, commander/diriger, coordonner et controler (Fayol). Qualites : leadership, capacite de decision, sens de la communication, ecoute active, capacite a motiver et a deleguer, rigueur et vision strategique.",
          "bareme": "1 point"
        },
        {
          "numero": "12",
          "enonce": "Citer les strategies utilisees en marketing. (1 pt)",
          "correction": "Strategies marketing : strategie de domination par les couts, strategie de differenciation et strategie de concentration/niche (Porter) ; on peut citer aussi les strategies du mix marketing (produit, prix, place/distribution, promotion - les 4P) et les strategies de segmentation, ciblage et positionnement.",
          "bareme": "1 point"
        }
      ]
    },
    {
      "titre": "Examen de Fin de Semestre - Creation d'Entreprise (duree 2h)",
      "source": "EPREUVES DE Creation d'entreprise.pdf (page 5) - Examen de fin de semestre",
      "questions": [
        {
          "numero": "Ex.1",
          "enonce": "Definir les termes suivants : Entreprise, entrepreneur, entrepreneuriat, environnement, organisation, management. (6 pts)",
          "correction": "ENTREPRISE : entite economique et juridiquement autonome combinant travail et capital pour produire des biens/services pour le marche. ENTREPRENEUR : personne qui cree, developpe et implante une entreprise dont elle assume les risques. ENTREPRENEURIAT : action de creer de la richesse et/ou de l'emploi par la creation ou reprise d'une entreprise. ENVIRONNEMENT : ensemble des facteurs externes (macro/micro/meso) influencant l'entreprise. ORGANISATION : ensemble des activites visant la repartition et la coordination des taches et responsabilites de chaque individu en vue de la production. MANAGEMENT : ensemble de techniques pour gerer, organiser, diriger, controler et planifier (Fayol).",
          "bareme": "6 points (1 pt par terme)"
        },
        {
          "numero": "1",
          "enonce": "Citer deux modeles de creation d'entreprise et donner la difference qui existe entre les deux modeles. (2 pts)",
          "correction": "Deux modeles : la creation EX-NIHILO (a partir de rien, seul, risque maximal, fort besoin de dimensionnement financier) et la creation par ESSAIMAGE (avec l'appui de l'entreprise-mere alors qu'on est salarie, risque reduit). DIFFERENCE : presence ou non d'un accompagnement/structure d'appui et niveau de risque, l'ex-nihilo etant entierement autonome et la plus risquee, l'essaimage etant accompagnee.",
          "bareme": "2 points"
        },
        {
          "numero": "2",
          "enonce": "Quelles sont les etapes du processus de creation d'une entreprise ? (2 pts)",
          "correction": "(1) Evaluation de l'opportunite ; (2) conception et formulation du projet ; (3) montage juridique et scenarios de financement/rentabilite ; (4) prise de decision ; (5) lancement de l'activite.",
          "bareme": "2 points"
        },
        {
          "numero": "3",
          "enonce": "Presenter l'effectif du personnel comme un critere de classification des entreprises. (2 pts)",
          "correction": "L'effectif (nombre de salaries) classe les entreprises en TPE (0-9), PE (10-49), ME (50-199) et GE (200+). Critere simple mais de moins en moins utilise car l'automatisation reduit les effectifs et chaque pays adopte sa propre definition de la PME.",
          "bareme": "2 points"
        },
        {
          "numero": "4",
          "enonce": "Quelle est la relation qui existe entre un business plan et une etude de marche ? (1 pt)",
          "correction": "L'etude de marche est un intrant du business plan : elle fournit l'analyse de la demande et de la concurrence qui nourrit le positionnement strategique et les previsions financieres du business plan.",
          "bareme": "1 point"
        },
        {
          "numero": "5",
          "enonce": "Qu'est-ce qu'une opportunite d'affaire ? (1 pt)",
          "correction": "Une opportunite d'affaire est une occasion d'affaire : c'est l'ancrage (la rencontre) entre une idee et un marche, qui resiste a l'usure du temps et a la competition.",
          "bareme": "1 point"
        },
        {
          "numero": "6",
          "enonce": "Citer les principales motivations a la creation d'entreprise. (2 pts)",
          "correction": "Motivations : independance (etre son propre patron), recherche de profit/richesse, creation d'emploi, accomplissement personnel, exploitation d'une opportunite/innovation, alternative au chomage, mise en valeur d'une competence ou d'une passion (cas de l'innerpreneur).",
          "bareme": "2 points"
        },
        {
          "numero": "7",
          "enonce": "Citer et commenter les qualites qu'il faut avoir pour etre un bon entrepreneur. (sur 5 pts)",
          "correction": "Les 10 qualites du cours : tenacite, sens des responsabilites, resistance aux chocs/stress, capacite de travail, sante, aptitude a communiquer son enthousiasme, bon sens, capacite d'ecoute, capacite d'adaptation et capacite a se vendre. Commentaire : ces qualites assurent l'adequation homme/projet et permettent de mener l'idee jusqu'au bout malgre les difficultes, de mobiliser les ressources et de convaincre partenaires et clients.",
          "bareme": "5 points"
        }
      ]
    },
    {
      "titre": "Epreuve de Creation d'Entreprise - Cas pratique Dieudonne MBALLA (SR3 et GL3, duree 2h)",
      "source": "EPREUVES DE Creation d'entreprise.pdf (pages 6-7) - Cas pratique",
      "questions": [
        {
          "numero": "Ex.1",
          "enonce": "Definir les termes suivants : Organisation, Creation, Entreprise, Entreprenariat, Entrepreneur, opportunite, chiffre d'affaire. (7 pts)",
          "correction": "ORGANISATION : ensemble d'activites de repartition et coordination des taches et responsabilites en vue de la production. CREATION : action de creer, de tirer du neant. ENTREPRISE : entite economique et juridiquement autonome produisant des biens/services pour le marche. ENTREPRENEURIAT : action de creer richesse et/ou emploi par creation ou reprise d'entreprise. ENTREPRENEUR : personne qui cree, developpe et implante une entreprise dont elle assume les risques. OPPORTUNITE : occasion d'affaire, ancrage entre l'idee et le marche. CHIFFRE D'AFFAIRE : valeur annuelle des ventes (CA = prix de vente x quantite vendue).",
          "bareme": "7 points"
        },
        {
          "numero": "Cas-1",
          "enonce": "Cas pratique : Dieudonne MBALLA a cree CRU et CRU, groupe qui rassemble des societes specialisees dans le marketing. Issu d'une famille relativement entreprenante, il quitte son emploi salarie (chef de produit junior, chef de groupe) chez BIYONG confiserie apres avoir longtemps occupe ces fonctions, malgre des passages a ES Douala, l'ecole de la CPA (centre de perfectionnement aux affaires), un cabinet d'etudes a Yaounde et chez For MONTY confiserie. TAF 1 : En utilisant le modele SHAPERO, faire ressortir trois elements qui ont influence la decision d'entreprendre de Dieudonne MBALLA. (3 pts)",
          "correction": "Le modele de SHAPERO (evenement entrepreneurial) repose sur trois ressorts : la PERCEPTION DE DESIRABILITE (attrait personnel/social pour l'acte d'entreprendre), la PERCEPTION DE FAISABILITE (sentiment d'etre capable, grace aux competences/ressources) et un DEPLACEMENT/EVENEMENT DECLENCHEUR. Pour MBALLA : (1) le deplacement = son depart/insatisfaction chez BIYONG et For MONTY (evenement negatif declencheur) ; (2) la desirabilite = son origine familiale entreprenante et son envie d'independance ; (3) la faisabilite = sa solide experience professionnelle (chef de produit, chef de groupe), sa formation (CPA, cabinet d'etudes) qui le rendent capable de creer son propre cabinet de marketing.",
          "bareme": "3 points"
        },
        {
          "numero": "Cas-2",
          "enonce": "TAF 2 : Degager l'importance de l'itineraire professionnel de Dieudonne MBALLA. (3 pts)",
          "correction": "L'itineraire professionnel de MBALLA (postes successifs de chef de produit junior puis chef de groupe, passages par l'enseignement/CPA et plusieurs cabinets) lui a apporte : une EXPERIENCE METIER approfondie du marketing, un RESEAU professionnel et relationnel, des COMPETENCES manageriales et techniques, et la maturation progressive de l'IDEE/OPPORTUNITE de creer son propre cabinet. Cet itineraire illustre que l'accumulation d'experiences et de competences (capital humain) reduit l'incertitude et augmente les chances de reussite de la creation ex-nihilo.",
          "bareme": "3 points"
        },
        {
          "numero": "Cas-3",
          "enonce": "TAF 3 : Quel est le principal facteur de differenciation des six formes de creation d'entreprise ? Donner la difference entre la forme de creation par essaimage et la creation par franchise. (3 pts)",
          "correction": "PRINCIPAL FACTEUR DE DIFFERENCIATION : le degre d'innovation et le rapport a l'existant (creer du nouveau vs reprendre/imiter), qui determine le niveau de risque assume. ESSAIMAGE vs FRANCHISE : dans l'essaimage, le salarie cree avec l'appui (gratuit, materiel, financier, commercial) de son entreprise-mere ; dans la franchise, le franchise applique une formule existante avec l'accompagnement du franchiseur mais cet accompagnement est PAYANT, et la franchise convient a celui qui n'a pas d'idee propre ni de capacite a innover.",
          "bareme": "3 points"
        },
        {
          "numero": "Cas-4",
          "enonce": "TAF 4 : En quoi l'intrapreneur n'est-il pas un entrepreneur au sens classique ou on l'entend ? (1 pt)",
          "correction": "L'intrapreneur cree ou innove AU SEIN d'une organisation existante : il reste un SALARIE soumis a des obligations contractuelles et morales envers son employeur, n'engage pas (ou peu) son propre capital et ne supporte pas personnellement la totalite du risque financier. L'entrepreneur classique, lui, cree sa propre structure, est independant et assume integralement les risques financiers et patrimoniaux.",
          "bareme": "1 point"
        }
      ]
    },
    {
      "titre": "Epreuve de Creation d'Entreprise (SR3 et GL3, duree 1h)",
      "source": "EPREUVES DE Creation d'entreprise.pdf (page 10) - Centre d'Excellence Technologique Paul Biya",
      "questions": [
        {
          "numero": "Q.I",
          "enonce": "Definir : Entreprise, Chiffre d'affaires, Intrapreneuriat, Opportunite, Creation, environnement. (6 pts)",
          "correction": "ENTREPRISE : entite economique et juridiquement autonome combinant travail et capital pour produire des biens/services pour le marche. CHIFFRE D'AFFAIRES : valeur annuelle des ventes (CA = prix de vente x quantite vendue). INTRAPRENEURIAT : processus par lequel un individu, en association avec une organisation existante, cree une nouvelle activite ou genere le renouvellement/l'innovation au sein de cette organisation (Sharma et Chrisman, 1999). OPPORTUNITE : occasion d'affaire, ancrage entre l'idee et le marche. CREATION : action de creer, de tirer du neant. ENVIRONNEMENT : ensemble des facteurs externes (macro/micro/meso) influencant l'entreprise.",
          "bareme": "6 points"
        },
        {
          "numero": "Q.II-1",
          "enonce": "Quelle difference faites-vous entre une entreprise et une societe ? (1.5 pts)",
          "correction": "L'entreprise est une notion economique (unite de production) ; la societe est une forme juridique, personne morale nee d'un contrat entre associes (SARL, SA...). Toute societe est une entreprise, mais une entreprise peut exister sans etre une societe (cas de l'entreprise individuelle).",
          "bareme": "1.5 point"
        },
        {
          "numero": "Q.II-2",
          "enonce": "Quelle difference faites-vous entre la creation ex-nihilo et l'essaimage ? (1.5 pts)",
          "correction": "Ex-nihilo : creation a partir de rien, sans appui, par un entrepreneur autonome, risque maximal. Essaimage : creation par un salarie avec l'appui (materiel, financier, commercial) de son entreprise-mere, risque reduit.",
          "bareme": "1.5 point"
        },
        {
          "numero": "Q.II-3",
          "enonce": "Quelle difference faites-vous entre le macro environnement et le micro environnement ? (1 pt)",
          "correction": "Le MACRO-environnement regroupe les facteurs generaux subis par l'entreprise (politique, juridique, economique, socioculturel, technologique) sur lesquels elle a peu de controle. Le MICRO-environnement (environnement specifique) est compose des acteurs en relation directe (clients, fournisseurs, concurrents, distributeurs, partenaires) sur lesquels l'entreprise peut agir par sa strategie.",
          "bareme": "1 point"
        },
        {
          "numero": "Q.III-1",
          "enonce": "Selon vous, quels peuvent etre les facteurs contextuels ou personnels favorisant la creation d'entreprise ? (2 pts)",
          "correction": "Facteurs PERSONNELS : personnalite, motivation, competences, experience, tenacite, gout du risque, sante. Facteurs CONTEXTUELS : etat des marches, environnement socio-economique, croissance demographique, urbanisation, concentration de petites entreprises, dispositifs d'aide (modele de BIRD).",
          "bareme": "2 points"
        },
        {
          "numero": "Q.III-2",
          "enonce": "Commentez les qualites qu'il faut avoir, selon Schumpeter, pour etre un bon entrepreneur. (2 pts)",
          "correction": "Selon Schumpeter, le bon entrepreneur est avant tout un INNOVATEUR : capacite a creer de nouvelles combinaisons, leadership, aptitude a aller a l'encontre du statu quo economique, prise de risque, et une motivation ou la joie de creer et de gagner l'emporte sur la simple recherche du profit.",
          "bareme": "2 points"
        },
        {
          "numero": "Q.III-3",
          "enonce": "A quoi sert une etude de marche ? (1 pt)",
          "correction": "L'etude de marche sert a analyser la demande (clients, besoins), l'offre (concurrence), et l'environnement specifique afin de valider l'opportunite, dimensionner le projet, definir l'offre et le positionnement, et alimenter les previsions du business plan.",
          "bareme": "1 point"
        },
        {
          "numero": "Q.V-1",
          "enonce": "Qu'est-ce qu'une opportunite d'affaire ? (1 pt)",
          "correction": "Une occasion d'affaire : l'ancrage (rencontre) entre une idee et un marche, qui se distingue de la simple idee par son potentiel reel d'exploitation rentable.",
          "bareme": "1 point"
        },
        {
          "numero": "Q.V-2",
          "enonce": "Qu'est-ce qu'un projet ? (1 pt)",
          "correction": "Un projet est un ensemble coordonne d'activites, ayant un debut et une fin, visant a atteindre un objectif precis avec des ressources limitees, sous la contrainte du triangle d'or cout-delai-performance.",
          "bareme": "1 point"
        },
        {
          "numero": "Q.V-3",
          "enonce": "Presentez l'effectif du personnel comme critere de classification d'entreprise. (3 pts)",
          "correction": "L'effectif classe les entreprises en TPE (0-9 salaries), PE (10-49), ME (50-199) et GE (200 et plus). Critere simple mais de moins en moins utilise (automatisation reduisant les effectifs ; definitions de la PME variables selon les pays).",
          "bareme": "3 points"
        }
      ]
    },
    {
      "titre": "Epreuve de Creation d'Entreprise - Definitions et schemas",
      "source": "EPREUVES DE Creation d'entreprise.pdf (page 8) - Centre d'Excellence Technologique Paul Biya",
      "questions": [
        {
          "numero": "1",
          "enonce": "Definir les termes ou concepts suivants : entrepreneuriat, chiffre d'affaires, creation d'entreprise. (3 pts)",
          "correction": "ENTREPRENEURIAT : action de creer de la richesse et/ou de l'emploi par la creation ou la reprise d'une entreprise (generer de la valeur par l'exploitation de nouveaux produits/processus/marches - OCDE). CHIFFRE D'AFFAIRES : valeur annuelle des ventes (CA = prix de vente x quantite vendue), critere de taille le moins precis. CREATION D'ENTREPRISE : action de creer, de tirer du neant ; processus structure en cinq etapes aboutissant au lancement d'une activite economique.",
          "bareme": "3 points"
        },
        {
          "numero": "2",
          "enonce": "Qu'est-ce que l'externalisation ? Donnez deux (02) avantages ainsi que deux (02) inconvenients. (3 pts)",
          "correction": "EXTERNALISATION (outsourcing) : confier a un prestataire externe une activite ou fonction auparavant realisee en interne. AVANTAGES : recentrage sur le coeur de metier ; reduction et flexibilisation des couts ; acces a une expertise specialisee. INCONVENIENTS : dependance vis-a-vis du prestataire ; perte de maitrise/savoir-faire ; risques sur la qualite, la confidentialite et les delais.",
          "bareme": "3 points"
        },
        {
          "numero": "3",
          "enonce": "Quelle difference faites-vous entre la creation ex-nihilo et essaimage ? Donnez deux (02) inconvenients. (3 pts)",
          "correction": "EX-NIHILO : creation a partir de rien, autonome, risque maximal. ESSAIMAGE : creation par un salarie avec l'appui de son entreprise-mere, risque reduit. DEUX INCONVENIENTS de l'ex-nihilo : besoin de temps long pour implanter le produit/convaincre le marche ; risques eleves a evaluer et fort besoin de financement a dimensionner ; (pour l'essaimage : motivations parfois negatives en essaimage a chaud, projets peu mûris et dependance a l'entreprise-mere).",
          "bareme": "3 points"
        },
        {
          "numero": "4",
          "enonce": "Quelles sont les limites du modele de Shapero ? (2 pts)",
          "correction": "Limites du modele de Shapero : il est centre sur le declenchement (evenement/deplacement) et les perceptions de desirabilite et de faisabilite, mais il neglige le processus dynamique de mise en oeuvre, ne tient pas suffisamment compte du contexte economique global et reste difficilement operationnalisable/mesurable ; il est assez statique.",
          "bareme": "2 points"
        },
        {
          "numero": "5",
          "enonce": "Citer les trois (03) strategies d'accès a la creation. Quelle est la strategie qui donne a la petite entreprise les plus grandes chances de reussir son demarrage ? Justifier votre reponse. (5 pts)",
          "correction": "TROIS STRATEGIES D'ACCES A LA CREATION : la creation ex-nihilo, la creation par essaimage et la creation par franchise (la reprise pouvant aussi etre citee). STRATEGIE OFFRANT LES PLUS GRANDES CHANCES POUR UNE PETITE ENTREPRISE : la creation par ESSAIMAGE (ou la franchise), car elle beneficie d'un accompagnement (materiel, financier, commercial, manageriale) qui REDUIT LE NIVEAU DE RISQUE et accelere le demarrage ; l'essaimage dynamique facilite la creation grace a un projet fiable et un appui de l'entreprise-mere, donnant des resultats superieurs a la creation ex-nihilo.",
          "bareme": "5 points"
        },
        {
          "numero": "6",
          "enonce": "Faire le schema illustrant la production dans une entreprise. (4 pts)",
          "correction": "Schema attendu : COMBINAISON DES FACTEURS DE PRODUCTION -> PRODUCTION. Entrees : FACTEUR TRAVAIL (main d'oeuvre) + FACTEUR CAPITAL (batiments, machines, materiel ; capital fixe et circulant) + matieres premieres/biens intermediaires ; PROCESSUS de combinaison efficiente (recherche du meilleur resultat au moindre cout) ; SORTIES : biens (materiels) et services (immateriels) vendus sur le marche, generant valeur ajoutee repartie entre salaries, Etat, banque et entreprise.",
          "bareme": "4 points"
        }
      ]
    },
    {
      "titre": "Controle Continu d'Entrepreneuriat et Creation d'Entreprise (Annee 2024/2025, Classe SR3B, duree 1h)",
      "source": "EPREUVES DE Creation d'entreprise.pdf (page 15) - Controle Continu 2024/2025",
      "questions": [
        {
          "numero": "1",
          "enonce": "Definir les termes suivants : Entrepreneuriat, chiffre d'affaires, management, entreprise. (4 pts)",
          "correction": "ENTREPRENEURIAT : action de creer de la richesse et/ou de l'emploi par la creation ou reprise d'une entreprise. CHIFFRE D'AFFAIRES : valeur annuelle des ventes (CA = prix x quantite vendue). MANAGEMENT : ensemble de techniques pour gerer, organiser, diriger, controler et planifier les activites (Fayol : prevoir, organiser, commander, coordonner, controler). ENTREPRISE : entite economique et juridiquement autonome combinant travail et capital pour produire des biens/services pour le marche.",
          "bareme": "4 points"
        },
        {
          "numero": "2",
          "enonce": "Citer les criteres de differenciation des entreprises. (4 pts)",
          "correction": "Trois criteres de classification : la TAILLE (effectif, chiffre d'affaires, capital investi), le SECTEUR D'ACTIVITE (primaire, secondaire, tertiaire, quaternaire) et la FORME JURIDIQUE (selon la propriete du capital et la nature juridique : EI, SARL, SA, SNC, GIC...).",
          "bareme": "4 points"
        },
        {
          "numero": "3",
          "enonce": "Quelles sont les etapes de la creation d'entreprise ? (3 pts)",
          "correction": "(1) Evaluation de l'opportunite ; (2) conception et formulation du projet ; (3) montage juridique et scenarios de financement et de rentabilite ; (4) prise de decision ; (5) lancement de l'activite.",
          "bareme": "3 points"
        },
        {
          "numero": "4",
          "enonce": "Expliquer brievement la difference qui existe entre la fonction comptable et financiere et la fonction administrative d'une entreprise. (3 pts)",
          "correction": "La FONCTION COMPTABLE ET FINANCIERE enregistre les operations, etablit les etats financiers (bilan, compte de resultat), gere la tresorerie, recherche les financements et assure la rentabilite/l'equilibre financier. La FONCTION ADMINISTRATIVE assure la coordination generale, la gestion des ressources humaines, l'organisation, la circulation de l'information et l'application des procedures (au sens de Fayol : prevoir, organiser, commander, coordonner, controler).",
          "bareme": "3 points"
        },
        {
          "numero": "5",
          "enonce": "Quelles sont les variantes du marketing ? (2 pts)",
          "correction": "Variantes du marketing : marketing strategique vs marketing operationnel ; marketing B2B vs B2C ; marketing digital ; marketing direct ; marketing relationnel ; marketing social. (Le marketing-mix s'articule autour des 4P : produit, prix, place/distribution, promotion.)",
          "bareme": "2 points"
        },
        {
          "numero": "6",
          "enonce": "'La creation d'entreprise est un important levier de developpement de tout pays', expliquer cette assertion en vous appuyant sur 2 exemples precis. (3 pts)",
          "correction": "La creation d'entreprise est le 1er moteur de creation d'emploi et de richesse, source d'innovation (destruction creatrice) et de developpement structurel. EXEMPLE 1 : au Cameroun, les PME (99% du tissu economique) creent la majorite des emplois et contribuent fortement au PIB. EXEMPLE 2 : des entreprises innovantes (Apple, Microsoft, Amazon, Google) ont, par l'innovation, cree des filieres entieres, des millions d'emplois et transforme l'economie mondiale.",
          "bareme": "3 points"
        },
        {
          "numero": "7",
          "enonce": "Citer et expliquer brievement 4 fonctions d'un manager. (3 pts)",
          "correction": "Selon Fayol : (1) PREVOIR/PLANIFIER : anticiper et fixer les objectifs et moyens ; (2) ORGANISER : structurer les ressources et repartir les taches ; (3) COMMANDER/DIRIGER : mobiliser et animer les equipes ; (4) COORDONNER : harmoniser les actions ; (5) CONTROLER : verifier la conformite aux objectifs et corriger les ecarts (4 fonctions au choix a expliquer).",
          "bareme": "3 points"
        }
      ]
    }
  ],
  "siad": [
    {
      "titre": "Epreuve de SIAD (Rattrapage) 2025 - 1 heure",
      "source": "SIAD.pdf - EPREUVE DE SIAD (RATTRAPAGE) 2025, IAI Cameroun",
      "questions": [
        {
          "numero": "P1-Q1",
          "enonce": "PARTIE 1 (QCM, choisir la/les bonne(s) reponse(s)). Le modele de rationalite economique suppose que : A) Les decideurs ont des informations parfaites et completes ; B) Les decisions sont prises sur la base de l'instinct ; C) Les emotions jouent un role crucial dans la prise de decision ; D) Les contraintes de ressources sont ignorees.",
          "correction": "Reponse : A. Le modele de rationalite economique repose sur l'hypothese d'un decideur disposant d'une information parfaite et complete et maximisant rationnellement son utilite. (On peut aussi retenir D comme corollaire frequent dans certains enonces, mais A est la reponse de reference.)",
          "bareme": "0,5 pt (bonne) / -0,5 pt (fausse) / 0 pt (sans reponse)"
        },
        {
          "numero": "P1-Q2",
          "enonce": "Quelle est la definition de la loi de Pareto ? A) Une loi statistique qui indique que 80 % des effets proviennent de 20 % des causes ; B) Une regle de decision qui conseille de maintenir 20 % des causes en reserve sur les 80 % ; C) Une loi economique qui stipule que 80 % des revenus sont generes par 20 % de la population ; D) Une theorie mathematique sur la repartition des nombres premiers.",
          "correction": "Reponse : A. La loi de Pareto (80/20) enonce qu'environ 80 % des effets proviennent de 20 % des causes.",
          "bareme": "0,5 pt / -0,5 pt / 0 pt"
        },
        {
          "numero": "P1-Q3",
          "enonce": "Quels sont les quatre quadrants de la matrice d'Eisenhower ? A) Important-Urgent, Important-Non Urgent, Non Important-Urgent, Non Important-Non Urgent ; B) Important-Non Important, Urgent-Non Urgent, Important-Urgent, Non Important-Non Urgent ; C) Critique-Non Critique, Immediat-Non Immediat, Important-Non Important, Urgent-Non Urgent ; D) Important-Critique, Non Important-Non Critique, Urgent-Non Urgent, Important-Non Urgent.",
          "correction": "Reponse : A. La matrice croise Importance et Urgence : Important-Urgent, Important-Non Urgent, Non Important-Urgent, Non Important-Non Urgent.",
          "bareme": "0,5 pt / -0,5 pt / 0 pt"
        },
        {
          "numero": "P1-Q4",
          "enonce": "Quelle technique peut etre combinee avec la loi de Pareto pour une analyse plus approfondie des causes principales des problemes ? A) Analyse SWOT ; B) Analyse de regression ; C) Diagramme d'Ishikawa (ou diagramme de causes et effets) ; D) Analyse PESTEL.",
          "correction": "Reponse : C. Le diagramme d'Ishikawa detaille les familles de causes ; combine a Pareto (qui priorise), il approfondit l'analyse des causes racines.",
          "bareme": "0,5 pt / -0,5 pt / 0 pt"
        },
        {
          "numero": "P1-Q5",
          "enonce": "Comment la matrice d'Eisenhower aide-t-elle a ameliorer la gestion du temps ? A) En augmentant le nombre de taches a accomplir ; B) En se concentrant sur les taches non urgentes ; C) En reduisant la procrastination en hierarchisant les taches importantes et urgentes ; D) En divisant les taches en segments de 5 minutes.",
          "correction": "Reponse : C. En hierarchisant les taches selon importance et urgence, la matrice reduit la procrastination et oriente l'effort vers l'essentiel.",
          "bareme": "0,5 pt / -0,5 pt / 0 pt"
        },
        {
          "numero": "P1-Q6",
          "enonce": "Dans une matrice de decision, comment les alternatives sont-elles generalement evaluees ? A) Par un vote des employes ; B) En attribuant des poids et des scores a chaque critere pour chaque alternative ; C) En utilisant un algorithme de tri rapide ; D) En suivant l'opinion du decideur principal sans structure formelle.",
          "correction": "Reponse : B. On pondere chaque critere et on note chaque alternative ; le score pondere total departage les options.",
          "bareme": "0,5 pt / -0,5 pt / 0 pt"
        },
        {
          "numero": "P1-Q7",
          "enonce": "Quelle methode est couramment utilisee pour ponderer les criteres dans une matrice de decision ? A) Analyse de regression ; B) Methode de la hierarchie analytique (AHP) ; C) Analyse de variance ; D) Diagramme de Gantt.",
          "correction": "Reponse : B. L'AHP (Analytic Hierarchy Process) de Saaty pondere les criteres par comparaisons par paires (echelle 1-9).",
          "bareme": "0,5 pt / -0,5 pt / 0 pt"
        },
        {
          "numero": "P1-Q8",
          "enonce": "Quelle technique peut etre utilisee pour normaliser les scores dans une matrice de decision ? A) Multiplication des scores par un facteur constant ; B) Conversion des scores en valeurs comprises entre 0 et 1 ; C) Utilisation de l'algorithme de tri rapide ; D) Chiffrement des donnees.",
          "correction": "Reponse : B. La normalisation ramene les scores a une echelle commune (par ex. entre 0 et 1) pour rendre comparables des criteres heterogenes.",
          "bareme": "0,5 pt / -0,5 pt / 0 pt"
        },
        {
          "numero": "P1-Q9",
          "enonce": "Laquelle des affirmations suivantes est une application correcte de la loi de Pareto dans le domaine des affaires ? A) 80 % des produits d'une entreprise representent 20 % des ventes ; B) 80 % des ventes proviennent de 20 % des clients ; C) 20 % des employes sont responsables de 80 % des problemes ; D) 80 % des couts sont dus a 20 % des fournisseurs.",
          "correction": "Reponse : B (exemple commercial canonique). Remarque : B, C et D illustrent toutes correctement le principe 80/20 ; si l'enonce admet plusieurs reponses, on peut cocher B, C et D. A est incorrecte car elle inverse le ratio (80 % des produits pour seulement 20 % des ventes ne correspond pas a la concentration 80/20 attendue).",
          "bareme": "0,5 pt / -0,5 pt / 0 pt"
        },
        {
          "numero": "P1-Q10",
          "enonce": "Quel est un potentiel inconvenient de l'application stricte de la loi de Pareto ? A) Cela peut entrainer une surcharge de travail pour les employes ; B) Cela peut conduire a une negligence des problemes moins frequents mais critiques ; C) Cela peut augmenter les couts de production ; D) Cela peut reduire la qualite des produits.",
          "correction": "Reponse : B. En ne ciblant que les 20 % de causes dominantes, on risque d'ignorer des problemes rares mais a fort impact (ex. risques critiques).",
          "bareme": "0,5 pt / -0,5 pt / 0 pt"
        },
        {
          "numero": "P2-1",
          "enonce": "PARTIE 2. Presenter le schema de la matrice d'Eisenhower. (6 pts)",
          "correction": "La matrice d'Eisenhower est un tableau 2x2 croisant l'axe IMPORTANCE (Important / Non important) et l'axe URGENCE (Urgent / Non urgent), soit quatre quadrants :\n\n                URGENT              NON URGENT\nIMPORTANT     | FAIRE             | PLANIFIER       |\nNON IMPORTANT | DELEGUER          | ELIMINER        |\n\n- Important & Urgent -> FAIRE (traiter soi-meme et tout de suite).\n- Important & Non urgent -> PLANIFIER (programmer ces taches a forte valeur).\n- Non important & Urgent -> DELEGUER (confier a un tiers).\n- Non important & Non urgent -> ELIMINER (abandonner).\n\nLe schema doit faire apparaitre clairement les deux axes, les quatre cases et l'action associee a chaque case.",
          "bareme": "6 pts (axes corrects, 4 quadrants nommes, actions associees)"
        },
        {
          "numero": "P2-2",
          "enonce": "PARTIE 2. Donner un exemple pour chaque cadran (de la matrice d'Eisenhower). (4 pts)",
          "correction": "Un exemple coherent par cadran (1 pt chacun) :\n- Important/Urgent (Faire) : gerer une panne serveur en production ; rendre un rapport du le jour meme.\n- Important/Non urgent (Planifier) : preparer un examen dans trois semaines ; mettre en place une politique de sauvegarde ; se former.\n- Non important/Urgent (Deleguer) : repondre a des appels ou e-mails qui pressent mais qu'un collegue peut traiter.\n- Non important/Non urgent (Eliminer) : navigation sans but sur les reseaux sociaux ; reunion sans enjeu ; tri d'e-mails publicitaires.",
          "bareme": "4 pts (1 pt par exemple pertinent et bien classe)"
        }
      ]
    }
  ],
  "oracle": [
    {
      "titre": "CC SGBD ORACLE - GL3 A et C (Duree 2H)",
      "source": "IAI Cameroun (Institut Africain d'Informatique) - Centre d'Excellence Technologique Paul Biya, Yaounde - 17 janvier 2025",
      "questions": [
        {
          "numero": "Partie 1 - QCM Q1",
          "enonce": "Qu'est-ce qui nous permet d'effectuer diverses taches de nettoyage au niveau d'une instance de BD ? A. CKPT  B. Les fichiers journaux  D. PMON  F. Aucune reponses justes (Bonne reponse +1, mauvaise -1, pas de reponse 0).",
          "correction": "Reponse : D. PMON. Le processus PMON (Process Monitor) effectue le nettoyage au niveau de l'instance : il detecte les processus utilisateur defaillants, effectue le rollback des transactions non validees et libere les verrous et ressources. SMON ferait egalement du nettoyage (coalescence, recuperation), mais parmi les options proposees, PMON est la reponse de nettoyage des processus. CKPT ne fait que declencher les checkpoints ; les fichiers journaux ne sont pas un processus.",
          "bareme": "1 pt (+1 bonne, -1 mauvaise, 0 sans reponse)"
        },
        {
          "numero": "Partie 1 - QCM Q2",
          "enonce": "Quels sont les outils utilises pour administrer un SGBD Oracle ? A. Oracle Enterprise Manager  B. SQL Developer et une version d'Oracle  C. SQL*Plus Worksheet et Oracle 10G  D. SQL*Plus et Oracle 11G  F. Pas de reponses.",
          "correction": "Reponses correctes : A, B, C et D. Oracle s'administre via Oracle Enterprise Manager (OEM, console graphique), SQL Developer (IDE graphique) et SQL*Plus / SQL*Plus Worksheet (interfaces ligne de commande), generalement associes a une version du moteur Oracle (10G, 11G...). Toutes ces options designent des outils d'administration Oracle valides.",
          "bareme": "1 pt (+1 / -1 / 0)"
        },
        {
          "numero": "Partie 1 - QCM Q3",
          "enonce": "Quand la SGA est-elle creee dans l'environnement de la base de donnees ? A. A la creation de la base  B. Quand la base est montee  C. Quand le processus utilisateur est demarre  D. Quand le processus serveur est demarre  E. Quand l'instance est demarree  F. B et C.",
          "correction": "Reponse : E. Quand l'instance est demarree. La SGA (System Global Area) est allouee en memoire des le demarrage de l'instance, c'est-a-dire en phase STARTUP NOMOUNT, avant le montage (MOUNT) et l'ouverture (OPEN) de la base. Elle existe donc independamment du fait que la base soit montee ou ouverte.",
          "bareme": "1 pt (+1 / -1 / 0)"
        },
        {
          "numero": "Partie 1 - QCM Q4",
          "enonce": "Quel est le role de la memoire PGA ? A. Propre a chaque processus utilisateur  B. Est l'argument INITIAL de la commande CREATE TABLESPACE  C. Est l'argument MINEXTENTS de la commande CREATE TABLESPACE  D. Est la somme des arguments INITIAL et NEXT de CREATE TABLESPACE  E. Pas de reponses.",
          "correction": "Reponse : A. Propre a chaque processus utilisateur/serveur. La PGA (Program Global Area) est une zone memoire privee et non partagee, allouee a chaque processus serveur, contenant la zone de tri, les informations de session et l'etat des curseurs. Les options B, C et D confondent avec les parametres de stockage disque (allocation des extents) de CREATE TABLESPACE, qui n'ont aucun rapport avec la memoire PGA.",
          "bareme": "1 pt (+1 / -1 / 0)"
        },
        {
          "numero": "Partie II - Q1",
          "enonce": "Donner la difference entre ROLLUP et CUBE (3 pts).",
          "correction": "GROUP BY ROLLUP(a, b) produit une agregation HIERARCHIQUE en cascade de droite a gauche : les regroupements detailles, les sous-totaux par premier niveau, puis le total general (n+1 niveaux). GROUP BY CUBE(a, b) produit TOUTES les combinaisons possibles de sous-totaux (2^n niveaux) : detail, sous-totaux par chaque dimension prise isolement, et total general. Autrement dit, ROLLUP convient aux donnees hierarchiques (annee>mois>jour) et CUBE aux analyses croisees multidimensionnelles. ROLLUP est un sous-ensemble de CUBE.",
          "bareme": "3 pts"
        },
        {
          "numero": "Partie II - Q2",
          "enonce": "A quoi sert la clause CONNECT BY PRIOR dans une requete (2 pts).",
          "correction": "La clause CONNECT BY PRIOR (utilisee avec START WITH) sert a effectuer une REQUETE HIERARCHIQUE (arborescente) dans Oracle : elle permet de parcourir des donnees organisees en relation parent-enfant (ex. organigramme employe/manager, nomenclature de produits). PRIOR designe la ligne parente et definit le sens du parcours de l'arbre. Exemple : SELECT nom FROM employes START WITH manager_id IS NULL CONNECT BY PRIOR id = manager_id; affiche la hierarchie a partir de la racine.",
          "bareme": "2 pts"
        },
        {
          "numero": "Partie II - Q3",
          "enonce": "Representer l'architecture d'un serveur Oracle ainsi que les 2 TYPES (8 pts).",
          "correction": "Architecture = INSTANCE + BASE DE DONNEES. L'instance (memoire) comprend : la SGA (Database Buffer Cache, Shared Pool, Redo Log Buffer), la PGA (privee par processus) et les processus d'arriere-plan (DBWR ecrit les blocs vers les datafiles, LGWR ecrit le redo buffer vers les redo logs, SMON recuperation d'instance, PMON nettoyage des processus, CKPT checkpoints). La base de donnees (disque) comprend trois types de fichiers : datafiles (donnees), control files (metadonnees de structure), redo log files (journalisation). Les 2 TYPES de configuration serveur sont : (1) le serveur DEDIE (Dedicated Server : un processus serveur par processus utilisateur) et (2) le serveur PARTAGE (Shared/Multi-Threaded Server : un pool de processus serveur partages servant plusieurs clients via un dispatcher).",
          "bareme": "8 pts"
        },
        {
          "numero": "Partie II - Q4",
          "enonce": "Definir : SGBD ORACLE, Operateur d'ensemble, Integrite des donnees, operateur INTERSECT (2 pts).",
          "correction": "SGBD ORACLE : Systeme de Gestion de Base de Donnees relationnel edite par Oracle Corporation, permettant de definir, stocker, manipuler, securiser et administrer de grands volumes de donnees avec garantie des proprietes ACID. Operateur d'ensemble : operateur SQL combinant les resultats de deux SELECT compatibles selon la theorie des ensembles (UNION, UNION ALL, INTERSECT, MINUS). Integrite des donnees : ensemble de contraintes garantissant l'exactitude et la coherence des donnees (integrite de domaine, d'entite/cle primaire, referentielle/cle etrangere). INTERSECT : operateur retournant uniquement les lignes communes (intersection) aux deux ensembles de resultats, sans doublons.",
          "bareme": "2 pts"
        },
        {
          "numero": "Exercice 1 - Q1",
          "enonce": "Definir : SGBD ORACLE, Operateur d'ensemble, Integrite des donnees, Operateur CUBE (2 pts).",
          "correction": "SGBD ORACLE : SGBD relationnel d'Oracle Corporation (cf. definition ci-dessus). Operateur d'ensemble : operateur combinant deux SELECT compatibles (UNION, UNION ALL, INTERSECT, MINUS). Integrite des donnees : regles assurant exactitude et coherence (domaine, entite, referentielle). Operateur CUBE : extension de GROUP BY generant tous les sous-totaux de toutes les combinaisons possibles des colonnes specifiees (2^n niveaux d'agregation), produisant un tableau croise multidimensionnel complet. Exemple : GROUP BY CUBE(region, produit) donne le detail, le sous-total par region, le sous-total par produit et le total general.",
          "bareme": "2 pts"
        },
        {
          "numero": "Exercice 1 - Q2",
          "enonce": "Donner les principales fonctions et composants d'un systeme d'information (2 pts).",
          "correction": "Les principales FONCTIONS d'un systeme d'information (SI) sont : la COLLECTE (acquisition/saisie des donnees), le STOCKAGE (conservation et organisation, ex. dans une base de donnees), le TRAITEMENT (transformation des donnees en informations utiles) et la DIFFUSION (restitution/communication des informations aux acteurs). Les principaux COMPOSANTS sont : le materiel (hardware), les logiciels (software), les donnees (bases de donnees), les procedures/methodes, les reseaux de telecommunication et les ressources humaines (utilisateurs/acteurs).",
          "bareme": "2 pts"
        },
        {
          "numero": "Exercice 1 - Q3",
          "enonce": "Donner la difference entre le GROUP BY et le GROUP BY ROLLUP (2 pts).",
          "correction": "GROUP BY regroupe les lignes par valeurs communes des colonnes specifiees et applique les fonctions d'agregation, en ne produisant QUE les lignes detaillees de chaque groupe (aucun sous-total ni total general). GROUP BY ROLLUP produit en PLUS de ces regroupements detailles des sous-totaux hierarchiques (agregation en cascade de droite a gauche) ainsi qu'une ligne de total general. Ainsi ROLLUP(a, b) genere n+1 niveaux d'agregation la ou un simple GROUP BY n'en genere qu'un.",
          "bareme": "2 pts (+ Presentation 1 pt sur l'ensemble de l'epreuve)"
        }
      ]
    },
    {
      "titre": "Examen / Controle Continu SGBD Oracle - Licence 3 (QCM 20 pts)",
      "source": "IAI Cameroun (Institut Africain d'Informatique / African Institute of Computer Sciences), Yaounde - Annee academique 2021/2022, Session juillet 2025, Classe Licence 3",
      "questions": [
        {
          "numero": "QCM Q1",
          "enonce": "L'instance Oracle est composee de : a) SGA + Processus d'arriere-plan  b) SGA + PGA + Processus d'arriere-plan  c) Base de donnees + SGA  d) Fichiers de donnees uniquement. (Bonne reponse +2, mauvaise -2, pas de reponse -2).",
          "correction": "Reponse : b) SGA + PGA + Processus d'arriere-plan. Une instance Oracle est constituee des structures memoire (la SGA partagee et les PGA privees) et des processus d'arriere-plan (DBWR, LGWR, SMON, PMON, CKPT...). La base de donnees (fichiers sur disque) est une entite distincte de l'instance.",
          "bareme": "2 pts (+2 / -2 / -2)"
        },
        {
          "numero": "QCM Q2",
          "enonce": "La SGA (System Global Area) contient : a) Database Buffer Cache, Shared Pool, Redo Log Buffer  b) Uniquement le Database Buffer Cache  c) Les fichiers de controle  d) Les processus utilisateur.",
          "correction": "Reponse : a) Database Buffer Cache, Shared Pool, Redo Log Buffer. Ce sont les trois composants fondamentaux de la SGA (auxquels peuvent s'ajouter Large Pool et Java Pool). Les fichiers de controle sont sur disque et les processus utilisateur ne font pas partie de la SGA.",
          "bareme": "2 pts (+2 / -2 / -2)"
        },
        {
          "numero": "QCM Q3",
          "enonce": "Le processus DBWR (Database Writer) a pour role : a) Ecrire les modifications dans les fichiers redo log  b) Ecrire les blocs modifies du buffer cache vers les fichiers de donnees  c) Gerer les connexions utilisateur  d) Archiver les fichiers redo log.",
          "correction": "Reponse : b) Ecrire les blocs modifies du buffer cache vers les fichiers de donnees. DBWR transfere les dirty buffers du Database Buffer Cache vers les datafiles. L'ecriture dans les redo logs est faite par LGWR (a), et l'archivage des redo logs par ARCn (d).",
          "bareme": "2 pts (+2 / -2 / -2)"
        },
        {
          "numero": "QCM Q4",
          "enonce": "Les fichiers de controle Oracle contiennent : a) Les donnees des tables  b) Les metadonnees sur la structure de la base  c) Les requetes SQL en cours  d) Les index uniquement.",
          "correction": "Reponse : b) Les metadonnees sur la structure de la base. Les control files stockent le nom de la base, l'emplacement des datafiles et redo logs, le numero de sequence (SCN), les informations de checkpoint et les metadonnees RMAN. Les donnees et index reels sont dans les datafiles.",
          "bareme": "2 pts (+2 / -2 / -2)"
        },
        {
          "numero": "QCM Q5",
          "enonce": "Le tablespace SYSTEM : a) Peut etre supprime sans probleme  b) Contient le dictionnaire de donnees d'Oracle  c) Ne contient que des donnees utilisateur  d) Est optionnel dans une base Oracle.",
          "correction": "Reponse : b) Contient le dictionnaire de donnees d'Oracle. Le tablespace SYSTEM est obligatoire, cree automatiquement, et heberge le data dictionary (metadonnees du systeme). Il ne peut etre supprime (a et d faux) et ne contient pas que des donnees utilisateur (c faux).",
          "bareme": "2 pts (+2 / -2 / -2)"
        },
        {
          "numero": "QCM Q6",
          "enonce": "Une jointure INNER JOIN retourne : a) Toutes les lignes de la table de gauche  b) Toutes les lignes de la table de droite  c) Uniquement les lignes ayant une correspondance dans les deux tables  d) Toutes les lignes des deux tables.",
          "correction": "Reponse : c) Uniquement les lignes ayant une correspondance dans les deux tables. L'INNER JOIN ne conserve que les paires de lignes satisfaisant la condition de jointure ; les lignes sans correspondance sont exclues.",
          "bareme": "2 pts (+2 / -2 / -2)"
        },
        {
          "numero": "QCM Q7",
          "enonce": "La syntaxe Oracle traditionnelle pour une jointure interne est : a) SELECT * FROM A INNER JOIN B ON A.id = B.id  b) SELECT * FROM A, B WHERE A.id = B.id  c) SELECT * FROM A LEFT JOIN B ON A.id = B.id  d) SELECT * FROM A UNION B.",
          "correction": "Reponse : b) SELECT * FROM A, B WHERE A.id = B.id. La syntaxe traditionnelle (implicite) d'Oracle exprime la jointure interne en listant les tables dans le FROM et la condition de liaison dans le WHERE. L'option a) est la syntaxe ANSI/SQL standard (egalement valide), mais b) est la forme traditionnelle Oracle demandee.",
          "bareme": "2 pts (+2 / -2 / -2)"
        },
        {
          "numero": "QCM Q8",
          "enonce": "Un LEFT OUTER JOIN : a) Retourne toutes les lignes de la table de droite  b) Retourne toutes les lignes de la table de gauche, sans correspondance NULL  c) Est identique a un INNER JOIN  d) Ne peut pas utiliser NULL.",
          "correction": "Reponse : b) Retourne toutes les lignes de la table de gauche, avec des valeurs NULL pour les colonnes de droite lorsqu'il n'y a pas de correspondance. C'est le principe de la jointure externe gauche : preservation de toutes les lignes du cote gauche.",
          "bareme": "2 pts (+2 / -2 / -2)"
        },
        {
          "numero": "QCM Q9",
          "enonce": "Pour eviter le produit cartesien, il faut : a) Utiliser DISTINCT  b) Specifier une condition de jointure (WHERE ou ON)  c) Utiliser ORDER BY  d) Limiter avec ROWNUM.",
          "correction": "Reponse : b) Specifier une condition de jointure (WHERE ou ON). Sans condition reliant les tables, Oracle combine chaque ligne d'une table avec toutes les lignes de l'autre (produit cartesien). DISTINCT, ORDER BY et ROWNUM ne suppriment pas ce produit, ils ne font que filtrer/trier le resultat.",
          "bareme": "2 pts (+2 / -2 / -2)"
        },
        {
          "numero": "QCM Q10",
          "enonce": "La jointure suivante est-elle correcte ? SELECT e.nom, d.nom_dept FROM employes e, departements d WHERE e.dept_id = d.id ;  a) Vrai - syntaxe Oracle classique  b) Faux - manque INNER JOIN  c) Faux - alias incorrects  d) Faux - WHERE mal place.",
          "correction": "Reponse : a) Vrai - syntaxe Oracle classique. La requete utilise la syntaxe de jointure traditionnelle Oracle : les tables sont aliasees (e, d) dans le FROM et la condition de jointure (e.dept_id = d.id) figure dans le WHERE. Elle est parfaitement valide et retourne les employes avec le nom de leur departement.",
          "bareme": "2 pts (+2 / -2 / -2)"
        }
      ]
    }
  ],
  "techcom": [
    {
      "titre": "Examen de fin de rattrapage - Techniques de Communication (Session de Juin 2024)",
      "source": "CETIC Paul Biya / IAI Cameroun - Niveau 3 - Genie Logiciel, Syst. et Reseaux - Annee 2024-2025 - Duree : 1h",
      "questions": [
        {
          "numero": "Ex.1",
          "enonce": "Communication institutionnelle (10 points) : a) Definition. b) Donnez ses cibles et ses objectifs. c) Quelles sont les techniques ; choisir quelques exemples dans l'environnement camerounais.",
          "correction": "a) DEFINITION : la communication institutionnelle (ou corporate) est l'ensemble des actions de communication par lesquelles une organisation construit et valorise son image, son identite et sa notoriete globales, independamment de la promotion d'un produit precis. b) CIBLES : publics internes (salaries) et externes (clients, partenaires, fournisseurs, medias, pouvoirs publics, grand public, milieux financiers). OBJECTIFS : faire connaitre l'entreprise (notoriete), faire aimer (image et reputation favorables), creer la confiance et l'adhesion, affirmer ses valeurs et sa responsabilite sociale. c) TECHNIQUES : relations presse et relations publiques, mecenat et sponsoring, evenementiel, publicite institutionnelle, site web et reseaux sociaux institutionnels, rapport annuel, communication de crise. Exemples camerounais : une banque (ex. Afriland, BICEC) qui sponsorise une manifestation culturelle ou sportive ; une entreprise comme la SABC ou MTN/Orange Cameroun qui communique sur ses actions de responsabilite sociale (sante, education) pour renforcer son image.",
          "bareme": "10 points (definition 2, cibles 2, objectifs 2, techniques 2, exemples camerounais 2)"
        },
        {
          "numero": "Ex.2",
          "enonce": "Communication marketing - marque (10 points) : a) Definition de la communication de marque. b) La contrefacon : de quoi s'agit-il ? Donnez un exemple. c) Comment lutter contre la contrefacon ?",
          "correction": "a) DEFINITION : la communication de marque est l'ensemble des actions visant a faire connaitre, valoriser et differencier une marque, a construire son identite et a creer un lien affectif et durable avec les consommateurs (image de marque, positionnement, notoriete). b) CONTREFACON : reproduction, imitation ou usage frauduleux d'une marque, d'un logo ou d'un produit protege, sans autorisation du titulaire des droits de propriete intellectuelle. Exemple : la vente de telephones, vetements ou medicaments portant illegalement le logo d'une marque connue sur les marches (ex. faux produits griffes ou faux medicaments vendus dans certains marches). c) LUTTE : depot et protection juridique de la marque (INPI/OAPI), poursuites judiciaires, controles et saisies douanieres, traçabilite et marquage securise des produits, sensibilisation des consommateurs et cooperation entre entreprises et autorites.",
          "bareme": "10 points (definition 3, definition+exemple contrefacon 4, lutte 3)"
        }
      ]
    },
    {
      "titre": "Examen de fin de semestre - Techniques de Communication (Session de Fevrier 2025)",
      "source": "CETIC Paul Biya / IAI Cameroun - Niveau 3 - Genie Logiciel, Syst. et Reseaux - Annee 2024-2025 - Duree : 2h",
      "questions": [
        {
          "numero": "Partie I - Ex.1 Q1",
          "enonce": "Evaluation des savoirs (3 pts). Choisissez la bonne reponse : Quel est l'objectif principal de la communication verbale ? a) transmettre des informations, influencer les autres, etablir des relations, resoudre des problemes ; b) ... ; c) ... ; d) ...",
          "correction": "Reponse : a) transmettre des informations, influencer les autres, etablir des relations et resoudre des problemes. La communication verbale a pour fonction premiere d'echanger de l'information et de creer/maintenir des relations.",
          "bareme": "3 pts (1 pt par bonne reponse du QCM)"
        },
        {
          "numero": "Partie I - Ex.1 Q2",
          "enonce": "Quel est le role de l'ecoute active dans la communication verbale ? a) comprendre le message ; b) repondre au message ; c) controler la conversation ; d) ignorer le message.",
          "correction": "Reponse : a) comprendre le message. L'ecoute active vise prioritairement la comprehension reelle du message de l'interlocuteur avant toute reponse.",
          "bareme": "3 pts QCM"
        },
        {
          "numero": "Partie I - Ex.1 Q3",
          "enonce": "Quel est l'avantage de la communication verbale par rapport a la communication non verbale ? a) elle est plus rapide ; b) elle est plus precise ; c) elle est plus personnelle ; d) elle est plus formelle.",
          "correction": "Reponse : b) elle est plus precise. Le langage verbal permet une formulation explicite et donc une plus grande precision du message que le seul non-verbal.",
          "bareme": "3 pts QCM"
        },
        {
          "numero": "Partie I - Ex.2",
          "enonce": "Definitions des termes (3 pts) : Influenceur, Leader d'opinion, Community manager, Wiki, Blog, Podcast.",
          "correction": "INFLUENCEUR : personne disposant d'une audience sur les reseaux sociaux et capable d'orienter les opinions et comportements de sa communaute. LEADER D'OPINION : personnalite credible et reconnue dont les avis influencent ceux de son groupe de reference. COMMUNITY MANAGER : professionnel charge d'animer, moderer et federer la communaute en ligne d'une marque ou organisation. WIKI : site web collaboratif dont le contenu peut etre cree et modifie par les utilisateurs (ex. encyclopedie collaborative). BLOG : site publiant regulierement des articles dates, outil de contenu et d'expression. PODCAST : contenu audio (ou video) diffuse et ecoutable a la demande / telechargeable.",
          "bareme": "3 pts (0,5 pt par definition exacte)"
        },
        {
          "numero": "Partie I - Ex.3",
          "enonce": "Citez par ordre d'importance les techniques de communication hors medias ; donnez des exemples (4 pts).",
          "correction": "Techniques de communication HORS MEDIAS (communication directe, sans achat d'espace publicitaire) : 1) Marketing direct (e-mailing, mailing postal, SMS, telephone) ; 2) Promotion des ventes (reductions, echantillons, jeux-concours) ; 3) Relations publiques et relations presse ; 4) Evenementiel (salons, foires, inaugurations) ; 5) Sponsoring et mecenat ; 6) PLV (publicite sur le lieu de vente) et merchandising ; 7) Communication digitale ciblee (reseaux sociaux, site). Exemples : envoi d'un e-mailing promotionnel a un fichier clients, distribution d'echantillons gratuits en supermarche, participation a une foire (PROMOTE a Yaounde), parrainage d'un evenement sportif.",
          "bareme": "4 pts (techniques ordonnees 2, exemples 2)"
        },
        {
          "numero": "Partie II",
          "enonce": "Evaluation des competences (10 pts). Un plan de communication englobe toutes les actions necessaires pour guider la strategie de communication d'une entreprise. Comment definir votre plan de communication ? 1. Analysez le contexte global de votre entreprise ; 2. Fixez les objectifs de votre strategie de communication ; 3. Determinez vos cibles ; 4. Determinez vos messages ; 5. Definissez vos outils ; 6. Elaborez votre plan de communication. (Cas : vous etes responsable de la communication d'une entreprise qui vient de lancer un nouveau produit ; creez un plan de communication pour le promouvoir aupres de clients potentiels.)",
          "correction": "Plan de communication pour le lancement d'un nouveau produit : 1) CONTEXTE : diagnostic interne et externe (SWOT : forces, faiblesses, opportunites, menaces, concurrence, marche). 2) OBJECTIFS : cognitif (faire connaitre le produit, notoriete), affectif (creer une image favorable), conatif (declencher l'essai et l'achat) - objectifs mesurables et dates. 3) CIBLES : clients potentiels segmentes (profil, besoins), prescripteurs et distributeurs. 4) MESSAGES : message cle clair traduisant le positionnement et la promesse, decline selon chaque cible. 5) OUTILS : mix de supports - publicite (radio, affichage, reseaux sociaux), e-mailing, evenement de lancement, relations presse, PLV - selon budget et cible. 6) ELABORATION : calendrier, budget, repartition des actions, puis mise en oeuvre et evaluation par indicateurs (notoriete, engagement, ventes) avec ajustements. Le plan doit etre coherent (objectifs-cibles-messages-outils) et evaluable.",
          "bareme": "10 points (une note par etape correctement traitee et appliquee au cas)"
        }
      ]
    },
    {
      "titre": "Examen de fin de rattrapage CC - Techniques de Communication (Session de Juin 2025)",
      "source": "CETIC Paul Biya / IAI Cameroun - Niveau 3 - Genie Logiciel, Syst. et Reseaux - Annee 2024-2025 - Duree : 1h",
      "questions": [
        {
          "numero": "Ex.1",
          "enonce": "Communication interne (10 points) : Donnez la difference entre la lettre administrative a caractere personnel et la lettre administrative entre services.",
          "correction": "La LETTRE ADMINISTRATIVE A CARACTERE PERSONNEL s'adresse nominativement a une personne physique (un usager, un agent) ; elle comporte une formule d'appel personnalisee (Madame, Monsieur), un ton respectueux et une formule de politesse complete ; elle est utilisee pour les relations administration-administre. La LETTRE ADMINISTRATIVE ENTRE SERVICES (forme administrative) est echangee entre services ou agents d'une meme administration ou entre administrations ; elle est impersonnelle, sans formule d'appel ni formule de politesse, plus concise et directe, identifiee par un timbre, un numero d'enregistrement, l'objet et les references. En resume : la premiere est personnalisee et courtoise (relation avec un individu), la seconde est impersonnelle et fonctionnelle (relation entre services).",
          "bareme": "10 points (caracterisation de chaque type 4+4, comparaison/synthese 2)"
        },
        {
          "numero": "Ex.2",
          "enonce": "Communication externe (10 points) : La communication electronique - parmi les techniques du Web 2.0 que vous connaissez, choisissez-en deux et montrez leur importance dans la communication marketing de l'entreprise.",
          "correction": "La communication electronique exploite les outils du Web 2.0 pour communiquer de facon interactive et a faible cout. Deux techniques au choix : 1) LES RESEAUX SOCIAUX (Facebook, Instagram, LinkedIn, X) : permettent un contact direct et interactif avec les clients, l'animation de communaute, le ciblage publicitaire precis, la diffusion virale des messages et la collecte de feedback ; importance marketing : visibilite, notoriete, engagement et fidelisation a faible cout. 2) L'E-MAILING / NEWSLETTER : envoi cible et personnalise d'offres et d'informations a une base de contacts ; importance marketing : relation directe, fidelisation, relance commerciale et mesure precise des resultats (taux d'ouverture, de clic). (Autres possibles : site web, blog, podcast, video, SEO/SEA.) Conclusion : ces outils augmentent la portee, l'interactivite et le retour sur investissement de la communication marketing, tout en exigeant la gestion de l'e-reputation.",
          "bareme": "10 points (choix et description des 2 outils 4, importance marketing demontree 4, exemples/qualite 2)"
        }
      ]
    },
    {
      "titre": "Examen de fin de semestre - Techniques de Communication (Session de Juin 2019)",
      "source": "CETIC Paul Biya / IAI Cameroun - Classe SR3 - Duree : 2h",
      "questions": [
        {
          "numero": "Ex.1",
          "enonce": "(10 pts) Pour se developper et etre competitive, l'entreprise ne peut se passer de communication. Il s'agit non seulement d'une communication interne qui permet d'etablir un climat social favorable aux bons resultats, mais aussi d'une communication interne vis-a-vis du marche (externe). a) Quels sont les outils incontournables dans le domaine des TIC pour assurer une communication institutionnelle efficace ? Donnez les avantages de chaque outil. b) Quelle strategie digitale pour mettre en place une communication de marque et une communication produit ? Citez les differents moyens utilises et leur impact dans la promotion et la differenciation face a la concurrence.",
          "correction": "a) OUTILS TIC pour la communication institutionnelle : SITE WEB INSTITUTIONNEL (vitrine credible, disponible 24/7, controle du message), RESEAUX SOCIAUX (interaction, notoriete, proximite, viralite), E-MAILING/NEWSLETTER (information ciblee et fidelisation a faible cout), BLOG D'ENTREPRISE (expertise, referencement, image), INTRANET (cohesion interne), VIDEO/WEBINAIRE (pedagogie et engagement). Avantages communs : rapidite, large portee, faible cout, mesurabilite, interactivite et feedback. b) STRATEGIE DIGITALE : definir un positionnement et une identite de marque coherents, produire du contenu (content marketing : articles, videos, posts), utiliser le SEO/SEA pour la visibilite, animer les reseaux sociaux et le community management, recourir aux influenceurs, a l'e-mailing et au retargeting pour la communication produit. MOYENS : reseaux sociaux, site, blog, publicite en ligne, influenceurs, marketing direct. IMPACT : accroissement de la notoriete, differenciation par l'image et le contenu, fidelisation, interaction client et avantage concurrentiel face a la concurrence.",
          "bareme": "10 pts (outils TIC + avantages 5, strategie digitale, moyens et impact 5)"
        },
        {
          "numero": "Ex.2",
          "enonce": "(10 pts) Quels sont les freins a l'introduction des TIC dans la circulation des informations dans les entreprises ? A partir d'exemples concrets, donnez sur differents plans les difficultes rencontrees pour ameliorer la communication au sein des entreprises.",
          "correction": "FREINS A L'INTRODUCTION DES TIC : 1) Plan FINANCIER : cout d'acquisition du materiel, des logiciels, de la connexion et de la maintenance (ex. PME ne pouvant financer un ERP ou une bonne connexion Internet). 2) Plan TECHNIQUE / INFRASTRUCTUREL : faible couverture reseau, coupures d'electricite, debit insuffisant (ex. zones rurales mal connectees au Cameroun). 3) Plan HUMAIN / COMPETENCES : manque de formation, illettrisme numerique, resistance au changement du personnel (ex. employes refusant d'abandonner le papier). 4) Plan ORGANISATIONNEL / CULTUREL : absence de strategie numerique, cloisonnement des services, habitudes ancrees. 5) Plan SECURITAIRE / JURIDIQUE : risques de cyberattaques, perte de donnees, manque de cadre juridique. DIFFICULTES POUR AMELIORER LA COMMUNICATION : surcharge informationnelle, mauvaise appropriation des outils, deshumanisation des echanges. SOLUTIONS : formation, accompagnement au changement, investissement progressif et politique de securite.",
          "bareme": "10 pts (freins par plan 6, exemples concrets et difficultes 4)"
        }
      ]
    },
    {
      "titre": "Controle continu - Technique de communication (GL3B)",
      "source": "CETIC Paul Biya / IAI Cameroun - Niveau 3 - Genie Logiciel (GL3B) - Documents autorises (2H)",
      "questions": [
        {
          "numero": "1",
          "enonce": "Quels sont les avantages de la communication au sein d'une entreprise (2 pts) ?",
          "correction": "AVANTAGES : meilleure circulation de l'information et coordination, cohesion et motivation des equipes, climat social favorable, prise de decision plus rapide et eclairee, reduction des conflits et des malentendus, meilleure image interne et externe, gain de productivite et de competitivite.",
          "bareme": "2 pts"
        },
        {
          "numero": "2",
          "enonce": "Dans le cadre de la communication interne d'une administration publique, quels sont les fondements qui caracterisent le style administratif (2 pts) ?",
          "correction": "FONDEMENTS DU STYLE ADMINISTRATIF : la dignite/courtoisie, la neutralite et l'objectivite, la precision et la clarte, la concision, la prudence (responsabilite), la hierarchie (respect du circuit hierarchique et des formules protocolaires), l'impersonnalite et le respect des conventions de presentation.",
          "bareme": "2 pts"
        },
        {
          "numero": "3",
          "enonce": "Qu'est-ce que la redaction administrative (2 pts) ?",
          "correction": "La REDACTION ADMINISTRATIVE est l'art de rediger les ecrits officiels d'une administration en respectant des regles precises de fond et de forme (clarte, objectivite, courtoisie, concision, respect de la hierarchie et des conventions de presentation). Ses ecrits types sont la lettre administrative, la note de service, le compte rendu, le proces-verbal et le rapport.",
          "bareme": "2 pts"
        },
        {
          "numero": "4",
          "enonce": "Presentez les elements d'une correspondance administrative (2 pts).",
          "correction": "ELEMENTS : le timbre (en-tete de l'administration expeditrice), le lieu et la date, les references (numero d'enregistrement), l'objet, eventuellement les pieces jointes, le nom/qualite du destinataire et de l'expediteur, la formule d'appel (pour la lettre a caractere personnel), le corps du message structure (introduction, developpement, conclusion), la formule de politesse et la signature (nom, fonction).",
          "bareme": "2 pts"
        },
        {
          "numero": "5",
          "enonce": "Presentez quelques outils et techniques efficaces pour la communication externe (2 pts).",
          "correction": "OUTILS/TECHNIQUES DE COMMUNICATION EXTERNE : publicite medias (radio, TV, affichage, presse), site web et reseaux sociaux, relations presse et relations publiques, e-mailing, evenementiel, sponsoring/mecenat, marketing direct, PLV. Ils servent a informer, vendre et construire l'image aupres des publics externes.",
          "bareme": "2 pts"
        },
        {
          "numero": "6",
          "enonce": "Quelle est la pertinence des objectifs cognitifs, emotionnels (affectifs), conatifs et de fidelisation pour l'entreprise (2 pts) ?",
          "correction": "PERTINENCE : l'objectif COGNITIF fait connaitre l'entreprise/le produit (notoriete) ; l'objectif AFFECTIF (emotionnel) fait aimer et cree une image favorable ; l'objectif CONATIF fait agir (essai, achat, comportement) ; l'objectif de FIDELISATION cherche a conserver et reacheter le client (relation durable). Ensemble, ils couvrent tout le parcours du client - de la connaissance a la fidelite - et structurent la strategie de communication.",
          "bareme": "2 pts"
        },
        {
          "numero": "7",
          "enonce": "Presentez deux types de communication externes. Comment se manifestent ces types de communication aupres de la cible (2 pts) ?",
          "correction": "DEUX TYPES : 1) Communication COMMERCIALE/MARKETING : promeut un produit ou service et vise l'achat ; se manifeste par la publicite, la promotion, le marketing direct aupres des clients et prospects. 2) Communication INSTITUTIONNELLE (corporate) : valorise l'image et l'identite de l'entreprise ; se manifeste par les relations presse, le sponsoring, la communication de marque aupres du grand public, des partenaires et des medias.",
          "bareme": "2 pts"
        },
        {
          "numero": "8",
          "enonce": "Vous etes responsable de la communication dans une entreprise de la place. Quelles sont les strategies d'approche de la clientele que vous pourriez mettre en place pour maximiser la visibilite des ventes et de la notoriete d'un produit (2 pts) ?",
          "correction": "STRATEGIES D'APPROCHE : segmentation et ciblage de la clientele ; positionnement clair du produit ; mix de communication (publicite + digital + promotion) ; presence sur les reseaux sociaux et community management ; marketing direct (e-mailing, SMS) ; partenariats et influenceurs ; promotions et evenements de lancement ; suivi de la satisfaction et fidelisation. Objectif : maximiser la visibilite, stimuler les ventes et accroitre la notoriete.",
          "bareme": "2 pts"
        },
        {
          "numero": "9",
          "enonce": "Quels sont les avantages de la communication electronique pour la communication interne et externe de l'entreprise (2 pts) ?",
          "correction": "AVANTAGES : rapidite et instantaneite de la diffusion, large portee et accessibilite, faible cout, interactivite et feedback immediat, ciblage precis, archivage et tracabilite, renforcement de la visibilite/notoriete (externe) et de la cohesion/coordination (interne).",
          "bareme": "2 pts"
        },
        {
          "numero": "10",
          "enonce": "Presentez deux outils numeriques phares dans la strategie de communication electronique (2 pts).",
          "correction": "DEUX OUTILS PHARES : 1) LES RESEAUX SOCIAUX : plateformes d'interaction, d'animation de communaute et de diffusion virale (visibilite, engagement, notoriete). 2) LE SITE WEB / E-MAILING : le site web sert de vitrine institutionnelle et commerciale disponible 24/7, l'e-mailing assure une communication ciblee et la fidelisation. (Autres : blog, application mobile, podcast.)",
          "bareme": "2 pts"
        }
      ]
    }
  ],
  "sqlserver": [
    {
      "titre": "Rattrapage Contrôle Continu - Administration des bases de données sous SQL Server",
      "source": "IAI-Cameroun, Centre d'Excellence Technologique Paul Biya - Rattrapage Contrôle Continu d'Administration des bases de données sous SQL Server",
      "questions": [
        {
          "numero": "I-1",
          "enonce": "Définir : Base de données, système de gestion de bases de données, Tabular Data Stream, Transact-SQL.",
          "correction": "Base de données : ensemble structuré et persistant de données reliées entre elles, organisées (souvent en tables relationnelles) pour être interrogées et mises à jour de façon cohérente. SGBD : logiciel assurant la création, le stockage, la sécurité, la cohérence, l'interrogation et la maintenance d'une base de données, et l'accès concurrent des utilisateurs (ex. SQL Server). Tabular Data Stream (TDS) : protocole applicatif propriétaire (Microsoft/Sybase) qui transporte requêtes et résultats tabulaires entre un client et le serveur SQL Server. Transact-SQL (T-SQL) : extension procédurale propriétaire du langage SQL par Microsoft, ajoutant variables, structures de contrôle, procédures stockées, triggers et gestion des transactions.",
          "bareme": "1 pt"
        },
        {
          "numero": "I-2",
          "enonce": "Donner trois différences entre un serveur OLTP et un serveur OLAP.",
          "correction": "1) Nature de la charge : OLTP traite de nombreuses petites transactions courantes (INSERT/UPDATE/DELETE) ; OLAP exécute peu de requêtes complexes d'agrégation/lecture. 2) Modélisation des données : OLTP utilise un schéma fortement normalisé ; OLAP un schéma dénormalisé en étoile ou flocon. 3) Objectif et données : OLTP gère des données opérationnelles courantes en priorisant l'intégrité et le temps de réponse ; OLAP gère de gros volumes historiques pour l'aide à la décision en priorisant la rapidité d'agrégation. (Autres différences acceptées : nombre d'utilisateurs, fraîcheur des données, type d'utilisateur.)",
          "bareme": "1.5 pts"
        },
        {
          "numero": "I-3",
          "enonce": "Citer les différents composants de Microsoft SQL Server.",
          "correction": "Database Engine (moteur de base de données relationnel) ; SSIS (Integration Services - ETL) ; SSAS (Analysis Services - OLAP/data mining) ; SSRS (Reporting Services - rapports) ; ainsi que les outils SSMS (Management Studio), SQL Server Profiler, sqlcmd, Database Engine Tuning Advisor et SQL Server Agent.",
          "bareme": "1.25 pts"
        },
        {
          "numero": "I-4",
          "enonce": "Donner la différence entre DROP et DELETE.",
          "correction": "DELETE est une instruction DML qui supprime des lignes d'une table (avec une clause WHERE optionnelle), tout en conservant la structure de la table ; l'opération est journalisée et peut déclencher des triggers et un ROLLBACK. DROP est une instruction DDL qui supprime entièrement l'objet (la table elle-même : structure ET données), qui disparaît du schéma.",
          "bareme": "0.75 pt"
        },
        {
          "numero": "I-5",
          "enonce": "Citer quatre tâches d'un administrateur de BD SQL Server.",
          "correction": "1) Installer, configurer et mettre à jour les instances. 2) Gérer la sécurité : logins, users, rôles et permissions. 3) Planifier et exécuter les sauvegardes et restaurations (plan de récupération). 4) Surveiller et optimiser les performances (index, statistiques, tuning, surveillance des ressources). (Autres réponses valables : gestion de l'espace disque et des fichiers, automatisation via SQL Server Agent, maintenance et intégrité des données.)",
          "bareme": "1 pt"
        },
        {
          "numero": "II-1",
          "enonce": "QCM - Trouver l'intrus : a. SSMS  b. SQL Server Profiler  c. SQL SERVER  d. SQL CMD",
          "correction": "Réponse : c. SQL SERVER. SSMS, SQL Server Profiler et SQL CMD (sqlcmd) sont des OUTILS de la suite ; SQL SERVER désigne le SGBD lui-même, c'est donc l'intrus.",
          "bareme": "1 pt"
        },
        {
          "numero": "II-2",
          "enonce": "QCM - L'ETL (Extraction Transformation Loading) est utilisé par : a. SSIS  b. SSMS  c. SSAS",
          "correction": "Réponse : a. SSIS. SQL Server Integration Services est le composant ETL de SQL Server.",
          "bareme": "1 pt"
        },
        {
          "numero": "II-3",
          "enonce": "QCM - En quelle année est sortie la première version de SQL Server ? a. 1979  b. 1969  c. 1989  d. 1959",
          "correction": "Réponse : c. 1989 (SQL Server 1.0, sous OS/2, fruit du partenariat Microsoft-Sybase-Ashton-Tate).",
          "bareme": "1 pt"
        },
        {
          "numero": "II-4",
          "enonce": "QCM - L'assistant de paramétrage du moteur de BD permet : a. Une optimisation du fonctionnement du moteur de BD  b. Réaliser toutes les opérations au niveau du moteur de bases de données  c. D'exécuter des requêtes au niveau du moteur de BD",
          "correction": "Réponse : a. Le Database Engine Tuning Advisor analyse une charge de travail et recommande index, vues indexées et statistiques : il optimise les performances du moteur.",
          "bareme": "1 pt"
        },
        {
          "numero": "II-5",
          "enonce": "QCM - Quelle est l'extension d'un fichier secondaire de données ? a. .ldf  b. .mdf  c. .pdf  d. .ndf",
          "correction": "Réponse : d. .ndf (fichier de données secondaire). .mdf = primaire, .ldf = journal des transactions.",
          "bareme": "1 pt"
        },
        {
          "numero": "III",
          "enonce": "CAS PRATIQUE (9.5 pts). Soit le schéma relationnel suivant : CLIENT (Numcli, nom, prenom, email), VOYAGE (codeVoyage, destination, durée, prix), RESERVATION (Numcli, codeVoyage, DateRes).",
          "correction": "Schéma relationnel de référence pour les questions III-1 à III-7. Clés primaires : CLIENT.Numcli, VOYAGE.codeVoyage, RESERVATION(Numcli, codeVoyage). Clés étrangères : RESERVATION.Numcli -> CLIENT, RESERVATION.codeVoyage -> VOYAGE.",
          "bareme": "Énoncé du cas"
        },
        {
          "numero": "III-1",
          "enonce": "Créer la base de données gestion_reservation avec un fichier primaire 'gestion_prim', un fichier secondaire 'gestion_sec' et un fichier journal 'gestion_log'. Chemin d'accès : 'C:\\Program Files\\Microsoft SQL SERVER\\MSSQL13.MSSQLSERVER\\MSSQL'. NB : taille des fichiers de 10 Go pouvant s'accroître de 5 Go après saturation.",
          "correction": "CREATE DATABASE gestion_reservation\nON PRIMARY\n( NAME = N'gestion_prim',\n  FILENAME = N'C:\\Program Files\\Microsoft SQL SERVER\\MSSQL13.MSSQLSERVER\\MSSQL\\gestion_prim.mdf',\n  SIZE = 10GB, FILEGROWTH = 5GB ),\n( NAME = N'gestion_sec',\n  FILENAME = N'C:\\Program Files\\Microsoft SQL SERVER\\MSSQL13.MSSQLSERVER\\MSSQL\\gestion_sec.ndf',\n  SIZE = 10GB, FILEGROWTH = 5GB )\nLOG ON\n( NAME = N'gestion_log',\n  FILENAME = N'C:\\Program Files\\Microsoft SQL SERVER\\MSSQL13.MSSQLSERVER\\MSSQL\\gestion_log.ldf',\n  SIZE = 10GB, FILEGROWTH = 5GB );\nGO\nSIZE fixe la taille initiale (10 Go) et FILEGROWTH l'incrément de croissance (5 Go) à chaque saturation.",
          "bareme": "1.5 pts"
        },
        {
          "numero": "III-2",
          "enonce": "Créer toutes les tables.",
          "correction": "USE gestion_reservation;\nGO\nCREATE TABLE CLIENT (\n  Numcli INT PRIMARY KEY,\n  nom VARCHAR(50) NOT NULL,\n  prenom VARCHAR(50),\n  email VARCHAR(100) );\n\nCREATE TABLE VOYAGE (\n  codeVoyage INT PRIMARY KEY,\n  destination VARCHAR(100) NOT NULL,\n  duree INT,\n  prix DECIMAL(12,2) );\n\nCREATE TABLE RESERVATION (\n  Numcli INT,\n  codeVoyage INT,\n  DateRes DATE,\n  CONSTRAINT PK_RESERVATION PRIMARY KEY (Numcli, codeVoyage),\n  CONSTRAINT FK_RES_CLIENT FOREIGN KEY (Numcli) REFERENCES CLIENT(Numcli),\n  CONSTRAINT FK_RES_VOYAGE FOREIGN KEY (codeVoyage) REFERENCES VOYAGE(codeVoyage) );",
          "bareme": "2 pts"
        },
        {
          "numero": "III-3",
          "enonce": "Renommez la colonne durée en DureeVoyage.",
          "correction": "EXEC sp_rename 'VOYAGE.duree', 'DureeVoyage', 'COLUMN';\nGO\nLa procédure système sp_rename renomme une colonne ; le troisième argument 'COLUMN' précise qu'il s'agit d'une colonne.",
          "bareme": "0.5 pt"
        },
        {
          "numero": "III-4",
          "enonce": "Afficher la destination et la liste des clients ayant réservé pour un voyage de plus de 10 jours et coûtant moins de 100 000 FCFA.",
          "correction": "SELECT V.destination, C.nom, C.prenom\nFROM CLIENT C\nJOIN RESERVATION R ON C.Numcli = R.Numcli\nJOIN VOYAGE V ON R.codeVoyage = V.codeVoyage\nWHERE V.DureeVoyage > 10 AND V.prix < 100000;\nLa jointure relie les trois tables ; le WHERE filtre les voyages de plus de 10 jours et de prix inférieur à 100 000.",
          "bareme": "2 pts"
        },
        {
          "numero": "III-5",
          "enonce": "Afficher les noms des clients ayant réservé sur tous les voyages proposés.",
          "correction": "-- Division relationnelle : aucun voyage ne doit manquer aux réservations du client\nSELECT C.nom\nFROM CLIENT C\nWHERE NOT EXISTS (\n  SELECT 1 FROM VOYAGE V\n  WHERE NOT EXISTS (\n    SELECT 1 FROM RESERVATION R\n    WHERE R.Numcli = C.Numcli AND R.codeVoyage = V.codeVoyage ) );\n-- Variante par comptage :\nSELECT C.nom\nFROM CLIENT C\nJOIN RESERVATION R ON C.Numcli = R.Numcli\nGROUP BY C.Numcli, C.nom\nHAVING COUNT(DISTINCT R.codeVoyage) = (SELECT COUNT(*) FROM VOYAGE);",
          "bareme": "1.5 pts"
        },
        {
          "numero": "III-6",
          "enonce": "La liste des clients qui n'ont fait aucune réservation.",
          "correction": "SELECT C.nom, C.prenom\nFROM CLIENT C\nWHERE NOT EXISTS (\n  SELECT 1 FROM RESERVATION R WHERE R.Numcli = C.Numcli );\n-- Variante avec LEFT JOIN :\nSELECT C.nom, C.prenom\nFROM CLIENT C\nLEFT JOIN RESERVATION R ON C.Numcli = R.Numcli\nWHERE R.Numcli IS NULL;",
          "bareme": "1 pt"
        },
        {
          "numero": "III-7",
          "enonce": "Afficher les noms des clients commençant par A et dont la 2e lettre n'est pas 'L'.",
          "correction": "SELECT nom\nFROM CLIENT\nWHERE nom LIKE 'A%' AND nom NOT LIKE 'AL%';\n-- 'A%' impose une 1re lettre A ; NOT LIKE 'AL%' exclut ceux dont la 2e lettre est L.\n-- Variante : WHERE nom LIKE 'A[^L]%';",
          "bareme": "1 pt"
        }
      ]
    },
    {
      "titre": "Examen de fin de Semestre 2 (Session de juin 2024) - Administration des bases de données sur SQL Server",
      "source": "IAI-Cameroun, Centre d'Excellence Technologique Paul Biya - Examen de fin de Semestre 2, juin 2024. Examinateurs : Mme Belinga epse Bonono, M. Messio, M. Yesibi",
      "questions": [
        {
          "numero": "P1-1",
          "enonce": "Définir : SSAS, SSRS, TDS, MDX.",
          "correction": "SSAS (SQL Server Analysis Services) : composant OLAP/data mining qui construit et interroge des cubes multidimensionnels et modèles tabulaires pour l'analyse décisionnelle. SSRS (SQL Server Reporting Services) : composant de création, publication et diffusion de rapports/états à partir des données. TDS (Tabular Data Stream) : protocole applicatif transportant requêtes et résultats tabulaires entre client et serveur SQL Server. MDX (MultiDimensional eXpressions) : langage d'interrogation des cubes multidimensionnels de SSAS.",
          "bareme": "2 pts"
        },
        {
          "numero": "P1-2",
          "enonce": "Pourquoi SQL SERVER est considéré comme un SGBD multi-base et multi-schéma ?",
          "correction": "Multi-base : une seule instance SQL Server peut héberger et gérer simultanément plusieurs bases de données indépendantes (chacune avec ses fichiers, ses users et son journal). Multi-schéma : à l'intérieur d'une base, les objets (tables, vues, procédures) sont organisés en plusieurs schémas (dbo, ventes, rh, ...), namespaces logiques qui isolent et sécurisent les objets et servent d'unité de gestion des permissions. SQL Server combine donc les deux niveaux d'organisation.",
          "bareme": "0.75 pt"
        },
        {
          "numero": "P1-3",
          "enonce": "Donner deux différences entre une restauration complète et différentielle.",
          "correction": "1) Contenu : la restauration complète part d'une sauvegarde FULL contenant toute la base ; la différentielle restaure une sauvegarde ne contenant que les pages modifiées depuis la dernière full. 2) Dépendance : la restauration complète est autonome ; la restauration différentielle EXIGE d'abord la restauration de sa sauvegarde complète de base (WITH NORECOVERY), elle ne peut s'appliquer seule. (Différence supplémentaire : la différentielle est plus rapide et plus petite, mais ne remonte pas plus loin que sa full de référence.)",
          "bareme": "1 pt"
        },
        {
          "numero": "P1-4",
          "enonce": "Après avoir défini ce qu'est une trace, peut-on considérer une trace comme un fichier log si oui dans quelle mesure ?",
          "correction": "Une trace est un enregistrement chronologique des événements survenant sur le serveur (requêtes exécutées, connexions, verrous, deadlocks, erreurs), capturé par SQL Server Profiler ou les Extended Events. Oui, on peut la considérer comme un fichier log dans la mesure où, lorsqu'elle est persistée (fichier .trc ou table), elle constitue un journal d'activité et d'audit horodaté permettant le diagnostic, la surveillance des performances et la traçabilité des actions. Elle diffère toutefois du journal des transactions (.ldf) : la trace sert à l'audit/diagnostic et n'intervient pas dans la récupération (recovery) ni le rollback des transactions, alors que le journal des transactions est indispensable à la cohérence et à la restauration de la base.",
          "bareme": "1 pt"
        },
        {
          "numero": "P1-5",
          "enonce": "Donner deux différences entre le MDX et le DAX.",
          "correction": "1) Modèle ciblé : MDX interroge les cubes MULTIDIMENSIONNELS (OLAP) de SSAS ; DAX cible les modèles TABULAIRES (SSAS Tabular, Power Pivot, Power BI). 2) Paradigme/syntaxe : MDX raisonne en termes de dimensions, membres, tuples et jeux (sets) sur plusieurs axes ; DAX est un langage de formules orienté tables/colonnes et mesures, proche d'Excel, manipulant des contextes de ligne et de filtre. (Différence supplémentaire : DAX est plus récent et plus simple à apprendre pour des utilisateurs Excel.)",
          "bareme": "1 pt"
        },
        {
          "numero": "P1-6",
          "enonce": "Citer les composants de SQL SERVER.",
          "correction": "Database Engine (moteur relationnel) ; SSIS (Integration Services - ETL) ; SSAS (Analysis Services - OLAP) ; SSRS (Reporting Services - rapports) ; SQL Server Agent (planification/jobs) ; et les outils SSMS, SQL Server Profiler, sqlcmd, Database Engine Tuning Advisor.",
          "bareme": "1.25 pts"
        },
        {
          "numero": "P1-7",
          "enonce": "Citer deux différences entre BULK INSERT et le BCP.",
          "correction": "1) Nature/emplacement : BULK INSERT est une instruction T-SQL exécutée À L'INTÉRIEUR du serveur (depuis SSMS/une requête) ; bcp est un utilitaire EXTERNE en ligne de commande (programme indépendant). 2) Sens du transfert : BULK INSERT ne fait que de l'IMPORT (fichier -> table) ; bcp est BIDIRECTIONNEL (import ET export entre fichier et table). (Différence supplémentaire : bcp est facilement scriptable hors de l'environnement SQL et utilisable en automatisation/batch.)",
          "bareme": "1 pt"
        },
        {
          "numero": "P2",
          "enonce": "CAS PRATIQUE (12 pts). Mme BELINGA veut organiser son mariage et vous êtes en charge d'administrer sa base de données. Elle vous donne les accès à sa sauvegarde ainsi qu'au schéma où sont stockés tous les objets. Structure : Invités(Id_invité, nom, sexe, #id_type_billet, #id_table) ; TypeBillet(id_type_billet, nom_type) ; Table(Id_table, nom_table, places) ; Menu(id_menu, #id_invité, #id_plat, #id_boisson) ; Plat(id_plat, nom_plat) ; Boisson(id_boisson, type_boisson) ; Commande(#id_invité, #id_menu, #id_plat, #id_boisson).",
          "correction": "Schéma relationnel de référence pour les questions P2-1 à P2-7. Les attributs soulignés sont les clés primaires, les attributs préfixés de # sont des clés étrangères.",
          "bareme": "Énoncé du cas"
        },
        {
          "numero": "P2-1",
          "enonce": "Restaurer la base de données à l'aide du fichier Mariage.bak.",
          "correction": "RESTORE DATABASE Mariage\nFROM DISK = N'C:\\Backups\\Mariage.bak'\nWITH RECOVERY,\n  MOVE 'Mariage'     TO N'C:\\...\\MSSQL\\DATA\\Mariage.mdf',\n  MOVE 'Mariage_log' TO N'C:\\...\\MSSQL\\DATA\\Mariage_log.ldf';\nGO\nWITH RECOVERY finalise la restauration et rend la base accessible ; les clauses MOVE relocalisent les fichiers logiques si nécessaire (sinon facultatives). On peut lister le contenu du backup avec RESTORE FILELISTONLY FROM DISK = N'...Mariage.bak'.",
          "bareme": "1 pt"
        },
        {
          "numero": "P2-2",
          "enonce": "La belle-famille veut rajouter ses invités à la liste des invités ; complétez grâce aux informations contenues dans le fichier invités.txt.",
          "correction": "-- Import en masse depuis le fichier plat invités.txt\nBULK INSERT Invités\nFROM 'C:\\Data\\invités.txt'\nWITH (\n  FIELDTERMINATOR = ';',   -- séparateur de champs\n  ROWTERMINATOR  = '\\n',   -- fin de ligne\n  FIRSTROW = 2,            -- ignorer la ligne d'en-tête\n  CODEPAGE = '65001' );    -- UTF-8\n-- Alternative en ligne de commande : \n-- bcp Mariage.dbo.Invités in C:\\Data\\invités.txt -c -t \";\" -S serveur -T",
          "bareme": "1 pt"
        },
        {
          "numero": "P2-3",
          "enonce": "Créer une procédure stockée qui récupère une table spécifique et affiche les invités présents sur celle-ci.",
          "correction": "CREATE PROCEDURE InvitesParTable @id_table INT\nAS\nBEGIN\n  SET NOCOUNT ON;\n  SELECT I.Id_invité, I.nom, I.sexe\n  FROM Invités I\n  WHERE I.id_table = @id_table;\nEND;\nGO\n-- Exécution :\nEXEC InvitesParTable @id_table = 3;\nLe paramètre @id_table reçoit la table ciblée et la procédure retourne les invités qui y sont affectés.",
          "bareme": "1 pt"
        },
        {
          "numero": "P2-4",
          "enonce": "Créer une procédure stockée qui récupère les tables où sont assis monsieur MESSIO et monsieur YESIBI et afficher le type de billet de chacun, puis exécuter cette procédure.",
          "correction": "CREATE PROCEDURE TablesMessioYesibi\nAS\nBEGIN\n  SET NOCOUNT ON;\n  SELECT I.nom, T.nom_table, T.Id_table, TB.nom_type AS type_billet\n  FROM Invités I\n  JOIN [Table] T      ON I.id_table = T.Id_table\n  JOIN TypeBillet TB  ON I.id_type_billet = TB.id_type_billet\n  WHERE I.nom IN ('MESSIO', 'YESIBI');\nEND;\nGO\n-- Exécution :\nEXEC TablesMessioYesibi;\nLa jointure Invités-Table donne la table de chaque invité et la jointure Invités-TypeBillet donne le type de billet ; le filtre WHERE ... IN ne retient que MESSIO et YESIBI.",
          "bareme": "3 pts"
        },
        {
          "numero": "P2-5",
          "enonce": "Créer une procédure stockée qui, en se basant sur les informations des tables Menu, Plat, Boisson, Invités et TypeBillet, calcule le nombre total de plats et de boissons commandés pour un invité spécifique, en prenant en compte le type de billet de l'invité et le nombre de places à sa table.",
          "correction": "CREATE PROCEDURE TotalCommandeInvite @id_invité INT\nAS\nBEGIN\n  SET NOCOUNT ON;\n  SELECT\n    I.Id_invité,\n    I.nom,\n    TB.nom_type             AS type_billet,\n    T.places                AS places_table,\n    COUNT(DISTINCT M.id_plat)    AS nb_plats,\n    COUNT(DISTINCT M.id_boisson) AS nb_boissons\n  FROM Invités I\n  JOIN TypeBillet TB ON I.id_type_billet = TB.id_type_billet\n  JOIN [Table] T     ON I.id_table = T.Id_table\n  LEFT JOIN Menu M   ON M.id_invité = I.Id_invité\n  LEFT JOIN Plat P   ON M.id_plat = P.id_plat\n  LEFT JOIN Boisson B ON M.id_boisson = B.id_boisson\n  WHERE I.Id_invité = @id_invité\n  GROUP BY I.Id_invité, I.nom, TB.nom_type, T.places;\nEND;\nGO\n-- Exécution : EXEC TotalCommandeInvite @id_invité = 10;\nLa procédure agrège les plats et boissons du Menu de l'invité, en restituant aussi son type de billet (TypeBillet) et le nombre de places de sa table (Table). Les LEFT JOIN évitent d'exclure un invité sans commande ; COUNT(DISTINCT ...) compte les plats/boissons distincts.",
          "bareme": "3 pts"
        },
        {
          "numero": "P2-6",
          "enonce": "Comment s'assurer que lorsque des commandes sont passées, le nombre total de places disponibles à une table spécifique est mis à jour automatiquement, en tenant compte du nombre de personnes ajoutées à la commande ?",
          "correction": "On crée un DÉCLENCHEUR (trigger) DML sur la table qui matérialise l'affectation des personnes (Invités ou Commande) : il met automatiquement à jour la colonne 'places' de la Table concernée à chaque INSERT/DELETE.\nCREATE TRIGGER trg_MajPlaces ON Invités\nAFTER INSERT, DELETE\nAS\nBEGIN\n  SET NOCOUNT ON;\n  -- Décrémenter les places pour les invités ajoutés\n  UPDATE T SET T.places = T.places - x.nb\n  FROM [Table] T\n  JOIN ( SELECT id_table, COUNT(*) nb FROM inserted GROUP BY id_table ) x\n    ON x.id_table = T.Id_table;\n  -- Ré-incrémenter les places pour les invités retirés\n  UPDATE T SET T.places = T.places + y.nb\n  FROM [Table] T\n  JOIN ( SELECT id_table, COUNT(*) nb FROM deleted GROUP BY id_table ) y\n    ON y.id_table = T.Id_table;\nEND;\nGO\nLe trigger exploite les tables logiques inserted/deleted pour ajuster le solde de places sans intervention manuelle. Une contrainte CHECK (places >= 0) sur Table empêche tout dépassement de capacité.",
          "bareme": "2 pts"
        },
        {
          "numero": "P2-7",
          "enonce": "Sauvegarder la nouvelle base de données.",
          "correction": "BACKUP DATABASE Mariage\nTO DISK = N'C:\\Backups\\Mariage_new.bak'\nWITH FORMAT, INIT,\n  NAME = N'Sauvegarde complete Mariage',\n  STATS = 10;\nGO\nBACKUP DATABASE effectue une sauvegarde complète ; FORMAT/INIT réinitialisent le média et STATS affiche la progression. Une stratégie complète combinerait ensuite des sauvegardes différentielles et de log.",
          "bareme": "1 pt"
        }
      ]
    }
  ],
  "droittravail": [
    {
      "titre": "Contrôle Continu — Droit du Travail et Sécurité Sociale (GL3D, 2h, mars 2004)",
      "source": "IAI Cameroun / Centre PAUL BIYA — CC Droit du Travail et Sécurité Sociale, GL3D, durée 2h",
      "questions": [
        {
          "numero": "I",
          "enonce": "Première partie : définition des termes (5 pts). Définissez : 1- employeur ; 2- salarié ; 3- mise à pied ; 4- pension de survivant ; 5- invalidité.",
          "correction": "1- Employeur : personne physique ou morale qui emploie un ou plusieurs travailleurs, leur fournit du travail, paie le salaire et exerce sur eux le pouvoir de direction, de contrôle et de sanction.\n2- Salarié (travailleur) : personne physique qui s'engage à fournir une prestation de travail au profit et sous la subordination d'un employeur, contre rémunération.\n3- Mise à pied : sanction disciplinaire (ou mesure conservatoire) suspendant temporairement le contrat et privant le travailleur de salaire pour la durée concernée, sans rompre le lien contractuel.\n4- Pension de survivant : prestation de sécurité sociale versée par la CNPS aux ayants droit (conjoint survivant, orphelins) d'un assuré décédé qui remplissait les conditions de cotisation.\n5- Invalidité : état d'un assuré qui, par suite de maladie ou d'accident non professionnel, subit une réduction durable de sa capacité de travail ou de gain, ouvrant droit à une pension d'invalidité servie par la CNPS.",
          "bareme": "5 pts (1 pt par définition exacte)"
        },
        {
          "numero": "II",
          "enonce": "Deuxième partie : questions théoriques (10 pts). 1- Les prestations servies par la CNPS (5 pts). 2- La gestion des salariés en cas de modifications relatives au changement d'employeur (5 pts).",
          "correction": "1- Prestations servies par la CNPS : la CNPS gère trois branches. a) Branche des prestations familiales : allocations familiales, allocations prénatales et de maternité, indemnité journalière de maternité. b) Branche des risques professionnels : prise en charge des accidents du travail et maladies professionnelles (soins, indemnités journalières, rente d'incapacité, rente de survivants). c) Branche des pensions (vieillesse, invalidité, décès) : pension de vieillesse, pension d'invalidité, allocation de vieillesse et pension de survivant. Ces prestations supposent l'immatriculation de l'assuré et le versement régulier des cotisations.\n2- Changement d'employeur : en cas de modification dans la situation juridique de l'employeur (succession, vente, fusion, transformation de fonds, mise en société), tous les contrats de travail en cours subsistent de plein droit entre le nouvel employeur et les travailleurs : il y a transfert automatique des contrats. Le nouvel employeur reprend les obligations (ancienneté, salaires, congés) ; les travailleurs conservent leurs droits acquis. Ce mécanisme assure la continuité de l'emploi et protège les salariés contre la perte d'emploi du seul fait du changement d'employeur.",
          "bareme": "10 pts (5 + 5)"
        },
        {
          "numero": "III",
          "enonce": "Troisième partie : cas pratique (5 pts). Rémunération de M. Ekengue pour mars 2004 : salaire de base 200 000 FCFA ; heures supplémentaires 45 000 FCFA ; prime de transport 15 000 FCFA ; indemnité de nourriture 18 000 FCFA ; prime d'ancienneté 20 000 FCFA. 1- Déterminez son salaire brut. 2- Quels prélèvements sociaux et fiscaux pour obtenir le salaire net ?",
          "correction": "1- Salaire brut total (toutes rubriques) = 200 000 + 45 000 + 15 000 + 18 000 + 20 000 = 298 000 FCFA. Le brut cotisable de référence exclut en principe les remboursements de frais : il correspond essentiellement au salaire de base + heures supplémentaires + prime d'ancienneté (= 265 000 FCFA), la prime de transport et l'indemnité de nourriture étant exonérées dans la limite des plafonds.\n2- Prélèvements : a) Sociaux : cotisation CNPS branche pension vieillesse-invalidité-décès, part salariale (sur le salaire cotisable plafonné), la part patronale et les branches risques pro et prestations familiales étant à la charge de l'employeur. b) Fiscaux : IRPP catégorie traitements et salaires, centimes additionnels communaux, redevance audiovisuelle (RAV), Crédit Foncier (CFC) part salariale, cotisation FNE. Salaire net = brut − (CNPS salariale + IRPP + CFC + RAV + FNE + taxe communale). L'énoncé ne fournit pas les taux : citer la nature de chaque prélèvement et la logique brut → cotisations → base imposable → impôts → net.",
          "bareme": "5 pts (brut 2 pts ; prélèvements 3 pts)"
        }
      ]
    },
    {
      "titre": "Examen — Droit du Travail (SR3A/B/D, 2h, 2018-2019)",
      "source": "IAI Cameroun / Centre PAUL BIYA — Contrôle continu de droit du travail, 2018-2019",
      "questions": [
        {
          "numero": "1",
          "enonce": "Définition des termes (5 pts) : 1- droit du travail ; 2- secteur d'activité ; 3- CDD ; 4- principe de la résiliation unilatérale ; 5- accident de travail.",
          "correction": "1- Droit du travail : ensemble des règles régissant les relations individuelles et collectives entre employeurs et travailleurs salariés liés par un lien de subordination.\n2- Secteur d'activité : domaine économique d'exercice (primaire, secondaire, tertiaire) ou branche professionnelle, rattachant l'entreprise à la convention collective applicable.\n3- CDD : contrat conclu pour une durée précise ou un ouvrage déterminé, prenant fin de plein droit au terme, avec encadrement strict du renouvellement.\n4- Résiliation unilatérale : possibilité pour chaque partie de rompre seule le contrat (démission/licenciement), sous réserve du motif légitime, du préavis et des indemnités, l'abus étant sanctionné.\n5- Accident de travail : accident survenu par le fait ou à l'occasion du travail, ouvrant droit à réparation au titre des risques professionnels (CNPS).",
          "bareme": "5 pts (1 pt par terme)"
        },
        {
          "numero": "2",
          "enonce": "QCM Vrai/Faux (8 pts). 1- La loi camerounaise prévoit 15 catégories socioprofessionnelles. 2- Le contrat de travail comme contrat d'adhésion signifie que les deux parties ont des obligations réciproques. 3- L'objet et la cause doivent être illicites pour la validité du contrat. 4- Un employé sous CDD doit être immatriculé à la CNPS. 5- Les cotisations patronales sont supportées par les employés. 6- L'obligation matérielle du travailleur = ne pas concurrencer son employeur. 7- Le contrat de la femme salariée peut être rompu durant son congé de maternité. 8- L'allocataire perçoit l'allocation vieillesse s'il a cotisé 15 ans.",
          "correction": "1- VRAI (la classification comporte ~12 à 15 catégories selon les conventions).\n2- FAUX : les obligations réciproques relèvent du caractère synallagmatique, pas du contrat d'adhésion (adhésion = conditions prédéfinies non négociées).\n3- FAUX : objet et cause doivent être LICITES.\n4- VRAI : tout travailleur, même sous CDD, doit être immatriculé à la CNPS.\n5- FAUX : la cotisation patronale est supportée par l'employeur.\n6- VRAI : obligation de loyauté/non-concurrence durant le contrat.\n7- FAUX : le contrat est suspendu ; pas de licenciement pour cause de grossesse/maternité.\n8- VRAI : 15 ans de cotisation pour l'allocation/pension de vieillesse.",
          "bareme": "8 pts (1 pt par proposition)"
        },
        {
          "numero": "3",
          "enonce": "Questions de cours (7 pts) : 1- Liberté de choix de la forme du contrat : définition et exceptions (2 pts). 2- Engagement à l'essai : définition et caractéristiques (2 pts). 3- Mise à pied : définition et caractéristiques (1,5 pt). 4- Processus de mise sur pied d'un règlement intérieur (1,5 pt).",
          "correction": "1- Le contrat se forme par le seul consentement (consensualisme) et peut être verbal ou écrit. Exceptions imposant l'écrit : CDD de plus d'un mois, contrat d'apprentissage, contrat de travailleur étranger, contrat nécessitant l'installation hors résidence, et tout contrat dont la loi/convention exige un écrit visé.\n2- Engagement à l'essai : stipulation permettant d'apprécier l'autre partie avant l'engagement définitif. Écrit obligatoire, durée limitée selon la catégorie (renouvelable une fois), rupture libre sans préavis ni indemnité mais sans abus, rémunération de l'emploi essayé.\n3- Mise à pied : sanction disciplinaire suspendant le contrat et privant de salaire pour la période, sans rompre le contrat ; durée limitée, motivée, notifiée par écrit, respect des droits de la défense ; peut être conservatoire.\n4- Règlement intérieur : l'employeur élabore un projet (discipline, hygiène, sécurité, paie) ; avis des délégués du personnel ; communication à l'inspecteur du travail qui le vise et peut exiger le retrait des clauses illégales ; affichage/dépôt puis entrée en vigueur et opposabilité.",
          "bareme": "7 pts (2 + 2 + 1,5 + 1,5)"
        }
      ]
    },
    {
      "titre": "Rattrapage CC — Droit du Travail (GL Niveau III, 4h, 2022)",
      "source": "IAI Cameroun / Centre PAUL BIYA — Rattrapage CC, Génie Logiciel Niveau III, durée 4h, 2022",
      "questions": [
        {
          "numero": "1",
          "enonce": "Définitions (10 pts) : 1- Contrat de travail ; 2- Résiliation unilatérale ; 3- Catégorie socio-professionnelle ; 4- Travailleur ; 5- Règlement intérieur.",
          "correction": "1- Contrat de travail : convention par laquelle un travailleur s'engage à fournir une prestation sous la subordination d'un employeur moyennant rémunération.\n2- Résiliation unilatérale : rupture décidée par une seule partie — démission (travailleur) ou licenciement (employeur) — sous réserve du motif légitime, du préavis et des indemnités.\n3- Catégorie socio-professionnelle : classement hiérarchique des emplois (manœuvres, employés, agents de maîtrise, cadres) défini par les conventions collectives, déterminant le salaire minimum de catégorie.\n4- Travailleur : personne physique qui met son activité professionnelle, contre rémunération, sous l'autorité d'un employeur, quels que soient son sexe et sa nationalité.\n5- Règlement intérieur : document de l'employeur fixant discipline, hygiène et sécurité, soumis à l'avis des délégués et au visa de l'inspecteur du travail.",
          "bareme": "10 pts (2 pts par définition)"
        },
        {
          "numero": "2",
          "enonce": "QCM (10 pts). 1- Principale loi du travail au Cameroun ? 2- Trois éléments du contrat de travail ? 3- Durée max d'un CDD camerounais renouvelé une fois ? 4- Droits en cas de faute lourde ? 5- La démission est à l'initiative de qui ?",
          "correction": "1- c) La loi n°92/007 du 14 août 1992 portant Code du Travail.\n2- b) Prestation de travail + rémunération + lien de subordination juridique.\n3- b) 2 ans.\n4- b) Uniquement certificat de travail + solde de tout compte.\n5- b) Du travailleur.",
          "bareme": "10 pts (2 pts par bonne réponse)"
        }
      ]
    },
    {
      "titre": "Épreuve de Droit du Travail — Définitions et cas pratiques (GL & SR III, 2h, 2024-2025)",
      "source": "IAI Cameroun / Centre PAUL BIYA — Épreuve de Droit du Travail, GL et SR III, Semestre I, 2024-2025",
      "questions": [
        {
          "numero": "1",
          "enonce": "Définitions (5 pts) : 1- Contrat de travail ; 2- Travailleur ; 3- Engagement à l'essai ; 4- Accident de travail ; 5- Licenciement.",
          "correction": "1- Contrat de travail : convention par laquelle un travailleur fournit une prestation sous la subordination d'un employeur contre rémunération.\n2- Travailleur : personne physique mettant son activité, contre rémunération, sous l'autorité d'un employeur.\n3- Engagement à l'essai : période écrite permettant d'apprécier l'autre partie avant l'engagement définitif, rompable sans préavis ni indemnité dans la limite légale.\n4- Accident de travail : accident survenu par le fait ou à l'occasion du travail, pris en charge au titre des risques professionnels (CNPS).\n5- Licenciement : rupture à l'initiative de l'employeur, reposant sur un motif légitime et respectant, sauf faute lourde, préavis et indemnités.",
          "bareme": "5 pts (1 pt par terme)"
        },
        {
          "numero": "2",
          "enonce": "Cas pratique (Cas 1) : Calcul de la part patronale reversée pour l'employé Enzo (salaire brut 780 860 FCFA) — rubriques pension vieillesse-invalidité-décès (PVID) et FNE.",
          "correction": "a) Branche PVID : la cotisation totale se partage entre part salariale et part patronale, calculées sur le salaire brut dans la limite du plafond mensuel CNPS. Part patronale PVID = taux patronal PVID × base cotisable plafonnée. b) FNE : contribution entièrement patronale = taux FNE × salaire brut. Méthode : identifier la base cotisable (brut plafonné), appliquer le taux patronal PVID puis le taux FNE, sommer. Part patronale totale = part patronale PVID + cotisation FNE, à la charge exclusive de l'employeur (non prélevée sur le salaire d'Enzo). L'énoncé ne donnant pas les taux, poser les formules et préciser le rôle du plafond CNPS.",
          "bareme": "5 pts (base/plafond 2 ; formules PVID+FNE 2 ; conclusion charge patronale 1)"
        },
        {
          "numero": "3",
          "enonce": "Cas 2 : Treena, en difficulté financière, décide de démissionner en ne se présentant plus à son poste. Est-elle en droit de le faire ? Justifiez.",
          "correction": "Treena ne peut pas valablement démissionner par simple abandon de poste : l'abandon n'est pas une démission régulière. La démission doit être : 1) claire et non équivoque ; 2) notifiée à l'employeur (en principe par écrit) ; 3) assortie du respect du préavis (selon catégorie et ancienneté). En cessant unilatéralement de venir sans notification ni préavis, elle commet un abandon de poste fautif : l'employeur peut la mettre en demeure de reprendre, puis engager un licenciement pour faute et réclamer l'indemnité compensatrice du préavis non exécuté. Conclusion : elle a le droit de démissionner, mais pas dans ces conditions ; la rupture régulière suppose une démission expresse et le respect du préavis (sauf dispense).",
          "bareme": "5 pts (qualification abandon 2 ; conditions/préavis 2 ; conséquences 1)"
        },
        {
          "numero": "4",
          "enonce": "Cas 3 : SHEMA SOLUTION, face à des difficultés conjoncturelles, décide de compresser une partie de son personnel. Analysez au regard du droit du travail.",
          "correction": "La compression pour difficultés conjoncturelles = licenciement pour motif économique, licite seulement si la procédure protectrice est respectée : 1) réalité du motif économique ; 2) information et consultation des délégués du personnel (mesures, ordre des licenciements, alternatives : réduction d'heures, mutations, départs volontaires) ; 3) critères objectifs (ancienneté, aptitudes, charges de famille) ; 4) notification à l'inspecteur du travail qui contrôle ; 5) droits des licenciés : indemnité de préavis, indemnité de licenciement (selon ancienneté), solde de tout compte, et priorité de réembauchage en cas d'amélioration. Conclusion : SHEMA SOLUTION peut comprimer mais en suivant la procédure ; à défaut, le licenciement est abusif et ouvre droit à des dommages-intérêts.",
          "bareme": "5 pts (qualification 1 ; procédure 3 ; droits/réembauchage 1)"
        }
      ]
    }
  ]
};
