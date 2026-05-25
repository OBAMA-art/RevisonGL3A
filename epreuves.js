// Épreuves corrigées — auto-générées depuis les PDFs IAI Cameroun
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
          "correction": "Solution complete :\n\n```dart\nimport 'package:flutter/material.dart';\n\nvoid main() => runApp(const MonProfilApp());\n\nclass MonProfilApp extends StatelessWidget {\n  const MonProfilApp({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return MaterialApp(\n      title: 'Mon Profil',\n      debugShowCheckedModeBanner: false,\n      theme: ThemeData(\n        primarySwatch: Colors.indigo,\n        useMaterial3: true,\n        scaffoldBackgroundColor: const Color(0xFFF5F7FB),\n      ),\n      home: const PageProfil(),\n    );\n  }\n}\n\nclass PageProfil extends StatelessWidget {\n  const PageProfil({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return Scaffold(\n      // 1. AppBar avec titre centre + logo a gauche\n      appBar: AppBar(\n        centerTitle: true,\n        leading: const Padding(\n          padding: EdgeInsets.all(8.0),\n          child: Icon(Icons.account_circle, size: 32),\n        ),\n        title: const Text(\n          'Mon Profil',\n          style: TextStyle(fontWeight: FontWeight.bold),\n        ),\n        backgroundColor: Colors.indigo,\n        foregroundColor: Colors.white,\n        elevation: 2,\n      ),\n\n      // 2. SafeArea pour proteger des encoches\n      body: SafeArea(\n        child: SingleChildScrollView(\n          padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),\n          child: Column(\n            crossAxisAlignment: CrossAxisAlignment.center,\n            children: [\n              // 3. Image centree (avatar circulaire)\n              Center(\n                child: ClipOval(\n                  child: Image.network(\n                    'https://i.pravatar.cc/200?img=12',\n                    width: 140,\n                    height: 140,\n                    fit: BoxFit.cover,\n                    errorBuilder: (_, __, ___) => const CircleAvatar(\n                      radius: 70,\n                      child: Icon(Icons.person, size: 70),\n                    ),\n                  ),\n                ),\n              ),\n              const SizedBox(height: 20),\n\n              // 4. Container sous l'image avec nom + bio\n              Container(\n                width: double.infinity,\n                padding: const EdgeInsets.all(16),\n                decoration: BoxDecoration(\n                  color: Colors.white,\n                  borderRadius: BorderRadius.circular(12),\n                  boxShadow: [\n                    BoxShadow(\n                      color: Colors.black.withOpacity(0.05),\n                      blurRadius: 8,\n                      offset: const Offset(0, 4),\n                    ),\n                  ],\n                ),\n                child: Column(\n                  children: const [\n                    Text(\n                      'OBAMA Guy Oswald',\n                      style: TextStyle(\n                        fontSize: 22,\n                        fontWeight: FontWeight.bold,\n                        color: Colors.indigo,\n                      ),\n                    ),\n                    SizedBox(height: 6),\n                    Text(\n                      'Etudiant en Genie Logiciel - Niveau 3 - Passionne par Flutter et le cloud.',\n                      textAlign: TextAlign.center,\n                      style: TextStyle(\n                        fontSize: 14,\n                        color: Colors.black54,\n                      ),\n                    ),\n                  ],\n                ),\n              ),\n              const SizedBox(height: 24),\n\n              // 5. Divider pour separer les sections\n              const Divider(thickness: 1, color: Colors.grey),\n              const SizedBox(height: 16),\n\n              // Titre de section\n              const Padding(\n                padding: EdgeInsets.only(bottom: 12),\n                child: Text(\n                  'Mes reseaux',\n                  style: TextStyle(\n                    fontSize: 18,\n                    fontWeight: FontWeight.w600,\n                  ),\n                ),\n              ),\n\n              // 6. Row avec icones reseaux sociaux\n              Row(\n                mainAxisAlignment: MainAxisAlignment.spaceEvenly,\n                children: [\n                  _IconeReseau(\n                    icon: Icons.facebook,\n                    color: Colors.blue.shade800,\n                    label: 'Facebook',\n                  ),\n                  _IconeReseau(\n                    icon: Icons.alternate_email,\n                    color: Colors.lightBlue,\n                    label: 'Twitter',\n                  ),\n                  _IconeReseau(\n                    icon: Icons.business_center,\n                    color: Colors.blue.shade900,\n                    label: 'LinkedIn',\n                  ),\n                  _IconeReseau(\n                    icon: Icons.email,\n                    color: Colors.red,\n                    label: 'Email',\n                  ),\n                ],\n              ),\n            ],\n          ),\n        ),\n      ),\n    );\n  }\n}\n\nclass _IconeReseau extends StatelessWidget {\n  final IconData icon;\n  final Color color;\n  final String label;\n\n  const _IconeReseau({\n    required this.icon,\n    required this.color,\n    required this.label,\n  });\n\n  @override\n  Widget build(BuildContext context) {\n    return Padding(\n      padding: const EdgeInsets.all(4.0),\n      child: Column(\n        children: [\n          CircleAvatar(\n            radius: 24,\n            backgroundColor: color.withOpacity(0.15),\n            child: Icon(icon, color: color, size: 26),\n          ),\n          const SizedBox(height: 6),\n          Text(label, style: const TextStyle(fontSize: 11)),\n        ],\n      ),\n    );\n  }\n}\n```\n\nPoints cles a justifier a l'oral :\n- Scaffold structure tout l'ecran.\n- SafeArea evite que le contenu passe sous le notch/status bar.\n- SingleChildScrollView permet a la page de defiler si l'ecran est petit.\n- ClipOval rend l'image circulaire.\n- Container avec BoxDecoration apporte un look 'card' moderne.\n- Divider separe visuellement.\n- Row + MainAxisAlignment.spaceEvenly distribue les 4 icones uniformement.\n- Code reutilisable grace au sous-widget _IconeReseau.\n- Les SizedBox et Padding assurent les espacements coherents.",
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
  ]
};
