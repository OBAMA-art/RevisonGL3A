// Unités d'enseignement (UE) + matières des rattrapages SN1/SN2.
// Contenu de SIG, Python, J2E, Entreprenariat, Infographie généré depuis les cours.
const UNITES = [
  {
    "id": "app_bd",
    "label": "Application des bases de données",
    "semestre": "S5",
    "icone": "🗃️"
  },
  {
    "id": "prog1",
    "label": "Programmation avancée 1",
    "semestre": "S5",
    "icone": "💻"
  },
  {
    "id": "admin_bd",
    "label": "Administration des BD & Sécurité",
    "semestre": "S5",
    "icone": "🛡️"
  },
  {
    "id": "ia_ue",
    "label": "Éléments d'intelligence artificielle",
    "semestre": "S5",
    "icone": "🧠"
  },
  {
    "id": "langues",
    "label": "Langues & Communication",
    "semestre": "S5",
    "icone": "🗣️"
  },
  {
    "id": "droit",
    "label": "Droit & Entreprenariat",
    "semestre": "S6",
    "icone": "⚖️"
  },
  {
    "id": "prog2",
    "label": "Programmation avancée & Multimédia 2",
    "semestre": "S6",
    "icone": "🚀"
  }
];

const MATIERES_EXTRA = [
  {
    "id": "sig",
    "titre": "Système d'Info Géographique",
    "sousTitre": "SIG",
    "icone": "🗺️",
    "couleur": "#14b8a6",
    "ue": "app_bd",
    "placeholder": false,
    "resume": [
      {
        "titre": "Definition d'un SIG",
        "contenu": "Un SIG (Systeme d'Information Geographique) est un systeme informatique permettant l'acquisition, le stockage, le traitement et l'affichage d'informations sous forme de donnees spatiales et geographiques. C'est un outil d'aide a la decision qui revele les relations spatiales complexes."
      },
      {
        "titre": "Les 5A des fonctionnalites SIG",
        "contenu": "Les fonctionnalites d'un SIG se resument en 5A : l'Abstraction, l'Acquisition, l'Archivage, l'Analyse et l'Affichage. Ces cinq fonctions couvrent tout le cycle de vie de la donnee geographique, de sa modelisation a sa restitution cartographique."
      },
      {
        "titre": "Les 5 composants d'un SIG",
        "contenu": "Un SIG ne se reduit pas au logiciel : il comprend le Materiel (ordinateurs, GPS, serveurs), le Logiciel (QGIS, ArcGIS, GRASS), les Donnees (cœur du systeme : spatiales = ou ? et attributaires = quoi ?), les Personnes (techniciens, decideurs) et les Methodes (procedures et protocoles)."
      },
      {
        "titre": "Modele vecteur",
        "contenu": "Le modele vecteur represente le monde par des objets geometriques discrets : le Point (dimension nulle, ex : un arbre), la Ligne (unidimensionnel, ex : une route) et le Polygone (bidimensionnel, ex : une parcelle). Chaque entite possede une geometrie (forme) et des attributs (caracteristiques en table)."
      },
      {
        "titre": "Modele raster",
        "contenu": "Le modele raster represente le monde par une grille reguliere de cellules (pixels), chaque cellule portant une valeur representant un phenomene (altitude, temperature, occupation du sol). Il est ideal pour les donnees continues : MNT, images satellites, photographies aeriennes."
      },
      {
        "titre": "Systeme de coordonnees geographiques vs projection",
        "contenu": "Le systeme de coordonnees geographiques repere un point par latitude et longitude (degres) sur un ellipsoide modelisant la Terre. La projection cartographique est la methode mathematique transformant la surface courbe en surface plane ; toute projection deforme au moins une propriete (surfaces, formes, distances ou angles)."
      },
      {
        "titre": "SRID et systemes de reference",
        "contenu": "Le SRID (Spatial Reference IDentifier) est l'identifiant numerique du systeme de projection d'un objet : par exemple `2154` pour le RGF93/Lambert93 (unite metre) ou EPSG:4326 pour le WGS 84 (utilise pour le Cameroun). Melanger des projections differentes provoque des superpositions incorrectes des couches."
      },
      {
        "titre": "Couches (Layers)",
        "contenu": "Un projet SIG est constitue de multiples couches superposees, comparables a des calques transparents, chacune contenant un type d'information homogene (routes, rivieres, parcelles). Toutes les couches d'un projet doivent partager le meme systeme de coordonnees pour se superposer correctement."
      },
      {
        "titre": "Analyse spatiale vecteur",
        "contenu": "Les operations vectorielles transforment les donnees en information : la selection par localisation (entites a l'interieur d'une zone), le Buffer ou tampon (zone d'influence autour d'une entite, ex : 100 m d'une riviere) et les operateurs Intersection, Union, Fusion combinant plusieurs couches."
      },
      {
        "titre": "Analyse spatiale raster",
        "contenu": "Les operations raster comprennent l'algebre des cartes (combinaison mathematique de couches, ex : addition de couches de pluviometrie) et l'analyse de pente et d'orientation calculee a partir d'un Modele Numerique de Terrain (MNT)."
      },
      {
        "titre": "Composants d'une carte finale",
        "contenu": "Une carte, produit final le plus courant d'un SIG, doit etre claire, lisible et communiquer un message. Elle comprend des elements essentiels : le titre, la legende, l'echelle, la fleche nord, la source des donnees et l'auteur."
      },
      {
        "titre": "SQL et ses sous-ensembles",
        "contenu": "SQL (Structured Query Language) manipule les donnees au sein d'un SGBDR. Il comprend trois sous-ensembles : le LDD (Langage de Definition de Donnees), le LCD (Langage de Controle de Donnees, gestion des droits) et le LMD (Langage de Manipulation de Donnees : recherche, insertion, mise a jour, suppression)."
      },
      {
        "titre": "Requete de selection SQL",
        "contenu": "La syntaxe de base est `SELECT (attributs) FROM (tables) WHERE (conditions)` : SELECT indique les colonnes a afficher, FROM les tables sources, WHERE les conditions (optionnelle). Sous PostgreSQL, les noms non proteges sont convertis en minuscules ; les majuscules exigent des guillemets doubles `\"COMMUNE\"`."
      },
      {
        "titre": "Operateurs SQL et clause GROUP BY",
        "contenu": "Les operateurs de comparaison (`=`, `<>`, `BETWEEN`, `IN`, `LIKE` avec jokers `%` et `_`) et logiques (`AND`, `OR`, `NOT`) definissent la clause WHERE. `GROUP BY` regroupe les enregistrements pour les fonctions d'agregation (`count`, `sum`, `min`, `max`, `avg`), et `HAVING` filtre sur ces colonnes agregees."
      },
      {
        "titre": "Extensions spatiales PostGIS et fonctions ST_",
        "contenu": "PostGIS ajoute a PostgreSQL des types geometriques (point, ligne, polygone) stockes en WKB/WKT et des fonctions prefixees `ST_` (standard SQL/MM) : `ST_Area()`, `ST_Perimeter()`, `ST_Buffer()`, `ST_Centroid()`, `ST_X()`/`ST_Y()`, `ST_IsValid()`, `ST_SRID()`. Les tables internes `geometry_columns` et `spatial_ref_sys` sont maintenues automatiquement."
      },
      {
        "titre": "QGIS : interface et SCR",
        "contenu": "QGIS (version LTS 3.40) est un logiciel libre de cartographie dont l'interface comprend la barre de menu, la barre d'outils, la fenetre Legende (a gauche), la fenetre carte principale et la barre d'etat. A l'ouverture d'une couche, on choisit son SCR (Systeme de Coordonnees de Reference) ; le WGS 84 est utilise pour le Cameroun."
      },
      {
        "titre": "Gestion des couches et cartographie thematique sous QGIS",
        "contenu": "Dans la Legende, l'ordre d'empilement se gere par glisser-deposer en placant en haut les couches ponctuelles, puis lineaires, surfaciques et enfin images. L'onglet Style permet la cartographie thematique : Symbole unique, valeur individuelle (categorise) ou Gradue selon un attribut."
      }
    ],
    "qcm": [
      {
        "q": "Que signifie l'acronyme SIG ?",
        "options": [
          "A) Systeme Informatique Geometrique",
          "B) Systeme d'Information Geographique",
          "C) Service Integre de Geolocalisation",
          "D) Standard International de Geomatique"
        ],
        "reponse": "B",
        "explication": "SIG signifie Systeme d'Information Geographique, un systeme informatique d'acquisition, stockage, traitement et affichage de donnees spatiales."
      },
      {
        "q": "Les fonctionnalites d'un SIG se resument par les 5A. Lesquels ?",
        "options": [
          "A) Acquisition, Affichage, Analyse, Archivage, Abstraction",
          "B) Acquisition, Affichage, Achat, Archivage, Analyse",
          "C) Abstraction, Algorithme, Analyse, Archivage, Affichage",
          "D) Acquisition, Abstraction, Adressage, Analyse, Affichage"
        ],
        "reponse": "A",
        "explication": "Les 5A sont : Abstraction, Acquisition, Archivage, Analyse et Affichage, selon le cours."
      },
      {
        "q": "Combien de composants majeurs constituent un SIG ?",
        "options": [
          "A) 3",
          "B) 4",
          "C) 5",
          "D) 6"
        ],
        "reponse": "C",
        "explication": "Un SIG comprend 5 composants : Materiel, Logiciel, Donnees, Personnes et Methodes."
      },
      {
        "q": "Dans le modele vecteur, un objet de dimension nulle est :",
        "options": [
          "A) Une ligne",
          "B) Un polygone",
          "C) Un point",
          "D) une cellule"
        ],
        "reponse": "C",
        "explication": "Le point est un objet de dimension nulle (ex : un lampadaire, un arbre). La ligne est unidimensionnelle et le polygone bidimensionnel."
      },
      {
        "q": "Quel modele de representation est ideal pour les donnees continues comme un MNT ou une image satellite ?",
        "options": [
          "A) Le modele vecteur",
          "B) Le modele raster",
          "C) Le modele relationnel",
          "D) Le modele objet"
        ],
        "reponse": "B",
        "explication": "Le modele raster (grille de pixels) est ideal pour les donnees continues : MNT, images satellites, photographies aeriennes."
      },
      {
        "q": "Dans le modele vecteur, qu'est-ce qui caracterise une entite outre sa geometrie ?",
        "options": [
          "A) Ses pixels",
          "B) Ses attributs",
          "C) Sa resolution",
          "D) Sa bande spectrale"
        ],
        "reponse": "B",
        "explication": "Chaque entite vecteur possede une geometrie (sa forme) et des attributs (ses caracteristiques en table : nom, longueur, type)."
      },
      {
        "q": "Un systeme de coordonnees geographiques repere un point a l'aide de :",
        "options": [
          "A) X et Y en metres",
          "B) La latitude et la longitude en degres",
          "C) Lignes et colonnes de pixels",
          "D) Le SRID uniquement"
        ],
        "reponse": "B",
        "explication": "Le systeme de coordonnees geographiques utilise la latitude et la longitude (degres) pour reperer un point sur un ellipsoide."
      },
      {
        "q": "Que peut-on affirmer de toute projection cartographique ?",
        "options": [
          "A) Elle conserve toutes les proprietes",
          "B) Elle deforme au moins une propriete (surfaces, formes, distances ou angles)",
          "C) Elle ne deforme que les couleurs",
          "D) Elle ne s'applique qu'au raster"
        ],
        "reponse": "B",
        "explication": "Toute projection deforme au moins une propriete parmi les surfaces, les formes, les distances ou les angles, car on passe d'une surface courbe a une surface plane."
      },
      {
        "q": "Quel SRID correspond au RGF93/Lambert93 ?",
        "options": [
          "A) 4326",
          "B) 2154",
          "C) 3857",
          "D) 100000"
        ],
        "reponse": "B",
        "explication": "Le SRID 2154 designe le RGF93/Lambert93, dont l'unite est le metre. EPSG:4326 correspond au WGS 84."
      },
      {
        "q": "Une couche (layer) dans un SIG est comparable a :",
        "options": [
          "A) Un pixel isole",
          "B) Un calque transparent superpose aux autres",
          "C) Une fonction d'agregation",
          "D) Un attribut de table"
        ],
        "reponse": "B",
        "explication": "Une couche est comme une feuille de calque transparente ; un projet SIG superpose plusieurs couches contenant chacune un type d'information."
      },
      {
        "q": "Quelle operation cree une zone d'influence autour d'une entite, par exemple 100 m autour d'une riviere ?",
        "options": [
          "A) L'intersection",
          "B) Le buffer (tampon)",
          "C) La fusion",
          "D) L'algebre des cartes"
        ],
        "reponse": "B",
        "explication": "Le Buffer (tampon) cree une zone d'influence autour d'une entite, comme une bande de 100 m autour d'une riviere."
      },
      {
        "q": "L'algebre des cartes est une operation d'analyse de type :",
        "options": [
          "A) Vecteur",
          "B) Raster",
          "C) Attributaire",
          "D) Topologique"
        ],
        "reponse": "B",
        "explication": "L'algebre des cartes combine mathematiquement des couches raster (ex : additionner des couches de pluviometrie)."
      },
      {
        "q": "Parmi ces elements, lequel n'est PAS un element essentiel d'une carte ?",
        "options": [
          "A) La legende",
          "B) L'echelle",
          "C) Le code source SQL",
          "D) La fleche nord"
        ],
        "reponse": "C",
        "explication": "Une carte comprend titre, legende, echelle, fleche nord, source des donnees et auteur ; le code source SQL n'en fait pas partie."
      },
      {
        "q": "Que signifie l'acronyme SGBDR ?",
        "options": [
          "A) Systeme de Gestion de Base de Donnees Raster",
          "B) Systeme de Gestion de Base de Donnees Relationnel",
          "C) Service de Gestion des Bases de Donnees Reparties",
          "D) Standard de Gestion de Bases de Donnees Reseau"
        ],
        "reponse": "B",
        "explication": "Un SGBDR est un Systeme de Gestion de Base de Donnees Relationnel, ou la base est composee de tables et chaque ligne est un enregistrement."
      },
      {
        "q": "Quel sous-ensemble du SQL gere la recherche, l'insertion, la mise a jour et la suppression de donnees ?",
        "options": [
          "A) Le LDD",
          "B) Le LCD",
          "C) Le LMD",
          "D) Le LCG"
        ],
        "reponse": "C",
        "explication": "Le LMD (Langage de Manipulation de Donnees) gere la recherche, l'insertion, la mise a jour et la suppression. Le LDD definit les objets, le LCD gere les droits."
      },
      {
        "q": "Quelle est la syntaxe correcte d'une requete de selection avec condition ?",
        "options": [
          "A) FROM commune SELECT * WHERE population > 1000",
          "B) SELECT * FROM commune WHERE population > 1000",
          "C) WHERE population > 1000 SELECT * FROM commune",
          "D) SELECT commune FROM * WHERE population > 1000"
        ],
        "reponse": "B",
        "explication": "La syntaxe est SELECT (attributs) FROM (tables) WHERE (conditions). Ici SELECT * FROM commune WHERE population > 1000."
      },
      {
        "q": "Dans PostgreSQL, comment doit-on ecrire le nom d'une table reellement nommee en majuscules COMMUNE ?",
        "options": [
          "A) commune",
          "B) COMMUNE sans guillemets",
          "C) \"COMMUNE\" avec guillemets doubles",
          "D) 'COMMUNE' avec guillemets simples"
        ],
        "reponse": "C",
        "explication": "Les majuscules doivent etre protegees par des guillemets doubles : \"COMMUNE\". Sans guillemets, les noms sont convertis en minuscules."
      },
      {
        "q": "Dans l'operateur LIKE, que signifie le joker '%' ?",
        "options": [
          "A) Un seul caractere quelconque",
          "B) Zero a plusieurs caracteres quelconques",
          "C) Un chiffre uniquement",
          "D) Un espace obligatoire"
        ],
        "reponse": "B",
        "explication": "Le joker '%' designe 0 a plusieurs caracteres quelconques ; le joker '_' designe un seul caractere."
      },
      {
        "q": "Quel operateur permet d'ignorer la casse lors d'une comparaison de chaine sous PostgreSQL ?",
        "options": [
          "A) LIKE",
          "B) ILIKE",
          "C) IS NULL",
          "D) BETWEEN"
        ],
        "reponse": "B",
        "explication": "ILIKE permet de passer outre la casse : nom_comm ILIKE '%SAINT%' selectionne tous les noms contenant 'saint' quelle que soit la casse."
      },
      {
        "q": "Comment teste-t-on si un champ n'a pas de valeur (vide) en SQL ?",
        "options": [
          "A) WHERE champ = 0",
          "B) WHERE champ = ''",
          "C) WHERE champ IS NULL",
          "D) WHERE champ = NULL"
        ],
        "reponse": "C",
        "explication": "On utilise l'operateur IS NULL. Attention : NULL n'est equivalent ni au nombre 0 ni a un espace, et on n'ecrit pas = NULL."
      },
      {
        "q": "Quelle clause permet de regrouper les enregistrements pour calculer une statistique par groupe ?",
        "options": [
          "A) ORDER BY",
          "B) GROUP BY",
          "C) LIMIT",
          "D) WHERE"
        ],
        "reponse": "B",
        "explication": "GROUP BY regroupe les enregistrements selon un critere et fonctionne avec les fonctions d'agregation (sum, count, avg...)."
      },
      {
        "q": "Pour filtrer sur le resultat d'une fonction d'agregation, quelle clause faut-il utiliser ?",
        "options": [
          "A) WHERE",
          "B) HAVING",
          "C) ORDER BY",
          "D) DISTINCT"
        ],
        "reponse": "B",
        "explication": "HAVING filtre sur une colonne agregee, car WHERE est execute avant l'agregation. Ex : GROUP BY nom_dept HAVING sum(population) > 20000."
      },
      {
        "q": "Sous PostGIS, quel est le resultat de la division de deux entiers comme population/superficie ?",
        "options": [
          "A) Un nombre decimal exact",
          "B) Un entier (resultat tronque)",
          "C) Une erreur de syntaxe",
          "D) Une valeur NULL"
        ],
        "reponse": "B",
        "explication": "La division de deux entiers donne un entier ; il faut transtyper (cast) le numerateur ou le denominateur en numeric/real pour obtenir un decimal."
      },
      {
        "q": "Quelle notation compacte propose PostgreSQL pour le transtypage (cast) ?",
        "options": [
          "A) expr->type",
          "B) expr::type",
          "C) expr@type",
          "D) cast[type]expr"
        ],
        "reponse": "B",
        "explication": "PostgreSQL propose la notation compacte expr::type, equivalente a cast(expr as type). Ex : x_commune::real."
      },
      {
        "q": "Quelle fonction PostGIS retourne la surface d'un objet geometrique ?",
        "options": [
          "A) ST_Length()",
          "B) ST_Perimeter()",
          "C) ST_Area()",
          "D) ST_Buffer()"
        ],
        "reponse": "C",
        "explication": "ST_Area() retourne la surface d'un objet. ST_Perimeter() donne le perimetre, ST_Length() la longueur, ST_Buffer() un objet tampon."
      },
      {
        "q": "Pourquoi recommande-t-on de prefixer les fonctions spatiales par ST_ ?",
        "options": [
          "A) Pour accelerer les requetes",
          "B) Pour etre conforme au standard SQL/MM",
          "C) Pour reduire la taille des donnees",
          "D) Pour activer le cache"
        ],
        "reponse": "B",
        "explication": "Le prefixe ST_ (Spatial Temporal) assure la conformite au standard SQL/MM ; les anciennes fonctions sans prefixe deviendront obsoletes."
      },
      {
        "q": "Quelle fonction PostGIS retourne le centroide d'un polygone ?",
        "options": [
          "A) ST_X()",
          "B) ST_Centroid()",
          "C) ST_SRID()",
          "D) ST_IsValid()"
        ],
        "reponse": "B",
        "explication": "ST_Centroid() retourne le centroide d'un polygone. On peut combiner ST_X(ST_Centroid(geometry)) pour obtenir sa coordonnee X."
      },
      {
        "q": "Dans QGIS, quel SCR est conseille pour les donnees du Cameroun ?",
        "options": [
          "A) RGF93/Lambert93 (2154)",
          "B) WGS 84 (EPSG:4326)",
          "C) Web Mercator (3857)",
          "D) Voirol 1879"
        ],
        "reponse": "B",
        "explication": "Selon le guide QGIS de l'IAI, pour le Cameroun on choisit le SCR WGS 84 (EPSG:4326) lors de l'ajout d'une couche."
      },
      {
        "q": "Dans la Legende de QGIS, quel ordre d'empilement assure un bon affichage ?",
        "options": [
          "A) Images en haut, puis surfaciques, lineaires, ponctuelles",
          "B) Ponctuelles en haut, puis lineaires, surfaciques, images en bas",
          "C) Lineaires en haut, puis ponctuelles, images, surfaciques",
          "D) L'ordre n'a aucune importance"
        ],
        "reponse": "B",
        "explication": "On place en haut de la Legende les couches ponctuelles, en dessous les lineaires, ensuite les surfaciques et enfin les images, pour eviter qu'une couche en ecrase une autre."
      },
      {
        "q": "Dans QGIS, quel mode de l'onglet Style represente les objets par des symboles differents selon un attribut hierarchise par classes de valeurs ?",
        "options": [
          "A) Symbole unique",
          "B) Gradue",
          "C) Aucun symbole",
          "D) Heatmap"
        ],
        "reponse": "B",
        "explication": "Le mode Gradue represente les objets par des symboles differents en fonction des classes de valeurs d'un attribut choisi (ex : capacite)."
      },
      {
        "q": "Quelle extension de fichier correspond au format d'export des logiciels de la gamme ESRI utilise dans le TP QGIS ?",
        "options": [
          "A) .mif/.mid",
          "B) .shp (Shapefile)",
          "C) .geojson",
          "D) .kml"
        ],
        "reponse": "B",
        "explication": "Le format Shape (.shp) est le format export des logiciels ESRI. Le format MIF-MID est celui de MapInfo."
      },
      {
        "q": "Quelle specification de l'OGC definit les types et fonctions d'une base de donnees spatiale ?",
        "options": [
          "A) WKB",
          "B) SFSQL (Simple Features for SQL)",
          "C) GeoJSON",
          "D) SRID"
        ],
        "reponse": "B",
        "explication": "La specification SFSQL (Simple Features for SQL) definit, selon l'OGC, les types et fonctions devant etre disponibles dans une base spatiale."
      },
      {
        "q": "Quelles tables internes PostGIS sont maintenues automatiquement pour gerer les geometries et projections ?",
        "options": [
          "A) commune et departement",
          "B) geometry_columns et spatial_ref_sys",
          "C) feature_table et raster_columns",
          "D) wkb_table et wkt_table"
        ],
        "reponse": "B",
        "explication": "PostGIS maintient a jour les tables internes geometry_columns (colonnes geometriques) et spatial_ref_sys (systemes de reference spatiale)."
      }
    ],
    "questionsOuvertes": [
      {
        "q": "Definissez un Systeme d'Information Geographique (SIG), enumerez et expliquez ses cinq composants majeurs.",
        "reponseAttendue": "Un SIG (Systeme d'Information Geographique) est un systeme informatique permettant l'acquisition, le stockage, le traitement et l'affichage d'informations sous forme de donnees spatiales et geographiques. C'est avant tout un outil d'aide a la decision qui permet de comprendre les relations spatiales complexes. Ses fonctionnalites se resument en 5A : Abstraction, Acquisition, Archivage, Analyse, Affichage. Un SIG ne se reduit pas a un logiciel ; il repose sur CINQ composants majeurs : (1) Le Materiel : ordinateurs, serveurs, GPS, tablettes qui supportent le systeme. (2) Le Logiciel : les applications qui font fonctionner le SIG, comme QGIS, ArcGIS ou GRASS GIS. (3) Les Donnees : le cœur du systeme, comprenant les donnees spatiales (la composante 'ou ?', la localisation) et les donnees attributaires (la composante 'quoi ?', les caracteristiques). (4) Les Personnes : les utilisateurs, des techniciens aux decideurs, qui exploitent le systeme. (5) Les Methodes : les procedures et protocoles assurant la coherence et la reussite d'un projet. La synergie de ces cinq composants distingue un veritable SIG d'un simple logiciel de cartographie."
      },
      {
        "q": "Comparez les modeles vecteur et raster de representation des donnees geographiques. Pour chacun, donnez la structure, des exemples de cas d'usage et des operations d'analyse spatiale associees.",
        "reponseAttendue": "Les deux modeles de representation des donnees repondent a deux visions complementaires du monde. LE MODELE VECTEUR represente le monde par des objets geometriques discrets : le Point (dimension nulle : arbre, lampadaire), la Ligne (unidimensionnel : route, riviere) et le Polygone (bidimensionnel : parcelle, lac, pays). Chaque entite possede une geometrie (sa forme) et des attributs stockes en table (nom, longueur, type). Il convient aux objets bien delimites et aux reseaux. Les operations d'analyse vecteur associees sont : la selection par localisation (ex : trouver les hopitaux dans une zone inondable), le Buffer ou tampon (zone d'influence autour d'une entite, ex : 100 m autour d'une riviere), et les operateurs Intersection, Union et Fusion combinant plusieurs couches. LE MODELE RASTER represente le monde par une grille reguliere de cellules (pixels), chaque cellule portant une valeur representant un phenomene (couleur, altitude, temperature, occupation du sol). Il est ideal pour les donnees continues : Modeles Numeriques de Terrain (MNT), images satellites, photographies aeriennes. Les operations d'analyse raster associees sont : l'algebre des cartes (combinaison mathematique de couches, ex : addition de couches de pluviometrie) et l'analyse de pente et d'orientation calculee a partir d'un MNT. En synthese, le vecteur privilegie la precision geometrique des objets discrets, tandis que le raster excelle pour les phenomenes continus et l'imagerie."
      },
      {
        "q": "Expliquez la difference entre un systeme de coordonnees geographiques et une projection cartographique. Pourquoi la gestion du SRID est-elle cruciale dans un projet SIG ?",
        "reponseAttendue": "La Terre est ronde mais les cartes sont planes : c'est le probleme fondamental de la cartographie. UN SYSTEME DE COORDONNEES GEOGRAPHIQUES repere un point a la surface de la Terre par sa latitude et sa longitude exprimees en degres, sur un ellipsoide modelisant la Terre (ex : 48.8566 N, 2.3522 E pour Paris). Les coordonnees sont angulaires et l'unite est le degre. UNE PROJECTION CARTOGRAPHIQUE est la methode mathematique transformant la surface courbe de la Terre en une surface plane (la carte). Comme on aplatit une surface courbe, TOUTE projection deforme inevitablement au moins une de ces proprietes : les surfaces, les formes, les distances ou les angles. Par exemple, la projection Mercator (utilisee par Google Maps) conserve les angles mais deforme fortement les surfaces aux poles. LE SRID (Spatial Reference IDentifier) est l'identifiant numerique du systeme de projection d'un objet : par exemple 2154 pour le RGF93/Lambert93 (unite : metre) ou EPSG:4326 pour le WGS 84. Sa gestion est CRUCIALE car une erreur courante est de melanger des donnees dans des projections differentes, ce qui entraine des superpositions incorrectes des couches : les donnees ne se calent pas geographiquement. Il faut donc toujours s'assurer que toutes les couches d'un projet sont dans le meme systeme de coordonnees. De plus, le choix de la projection conditionne la validite des mesures : pour mesurer correctement distances et surfaces dans QGIS, les donnees doivent etre en coordonnees projetees (unite metrique), faute de quoi le logiciel avertit que les resultats seront errones."
      },
      {
        "q": "Presentez les principales clauses du langage SQL pour la selection et l'agregation de donnees, en illustrant chaque clause par un exemple. Precisez la difference entre WHERE et HAVING.",
        "reponseAttendue": "SQL (Structured Query Language) est le langage de manipulation des bases de donnees. La requete de base suit la syntaxe SELECT (attributs) FROM (tables) WHERE (conditions). LA CLAUSE SELECT indique les colonnes a afficher : ex SELECT nom_comm, population FROM commune. L'etoile * selectionne tous les attributs. On peut renommer avec AS : SELECT nom_comm AS commune. LA CLAUSE FROM designe la ou les tables sources. LA CLAUSE WHERE (optionnelle) exprime les conditions a l'aide d'operateurs de comparaison (=, <>, <, >, BETWEEN B AND C, IN(...), LIKE 'A%' avec jokers % et _) et logiques (AND, OR, NOT). Ex : SELECT * FROM commune WHERE population > 1000 AND statut = 'Sous-prefecture'. LA CLAUSE ORDER BY trie le resultat (DESC pour decroissant) : ex ORDER BY nom_comm DESC. LA CLAUSE LIMIT n [OFFSET m] limite et decale le nombre de lignes retournees. L'AGREGATION utilise GROUP BY suivi du critere de regroupement, en concert avec les fonctions d'agregation count() (nombre), sum() (somme), max(), min() et avg() (moyenne). Ex : SELECT nom_dept, sum(population) AS population_dept FROM commune GROUP BY nom_dept. DIFFERENCE ENTRE WHERE ET HAVING : WHERE filtre les enregistrements AVANT l'agregation et porte sur des colonnes existant dans la table de depart. HAVING filtre APRES l'agregation, sur une colonne calculee par une fonction d'agregation. On ne peut pas ecrire WHERE population_dept > 20000 car cette colonne agregee n'existe pas encore au moment du WHERE ; on ecrit donc GROUP BY nom_dept HAVING sum(population) > 20000 (sous PostgreSQL, il faut repeter la fonction d'agregation dans le HAVING). En resume : WHERE = filtre sur lignes brutes, HAVING = filtre sur groupes agreges."
      },
      {
        "q": "Decrivez les extensions spatiales de PostgreSQL (PostGIS) : types geometriques, stockage, tables internes et principales fonctions ST_. Donnez un exemple de requete calculant la surface et le perimetre.",
        "reponseAttendue": "PostGIS est l'extension spatiale de reference de PostgreSQL : elle ajoute le stockage et la manipulation d'objets spatiaux en introduisant des types de donnees geometriques et des fonctions spatiales, conformement a la specification SFSQL (Simple Features for SQL) de l'OGC. LES TYPES GEOMETRIQUES en dimension 2 sont essentiellement le point, la ligne et le polygone. LE STOCKAGE de la geometrie se fait dans un format binaire WKB (Well-Known Binary) ou eventuellement textuel WKT (Well-Known Text), ex : POLYGON((30 10, 10 20, 20 40, 40 40, 30 10)), dans une colonne souvent nommee geometry, geom ou the_geom. LES TABLES INTERNES maintenues automatiquement sont geometry_columns (recensant les colonnes geometriques) et spatial_ref_sys (recensant les systemes de reference). Le SRID est l'identifiant du systeme de projection (ex : 2154 pour RGF93/Lambert93). En cas de probleme, la fonction Populate_Geometry_Columns() met a jour geometry_columns. LES PRINCIPALES FONCTIONS ST_ (prefixe recommande pour la conformite au standard SQL/MM) sont : ST_SRID() (code de projection), ST_IsValid()/ST_IsValidReason()/ST_MakeValid() (verification et correction de geometrie), ST_X() et ST_Y() (coordonnees d'un point), ST_Centroid() (centroide d'un polygone), ST_Area() (surface), ST_Perimeter() (perimetre), ST_Length() (longueur), ST_Buffer() (tampon). EXEMPLE de requete calculant surface (km2) et perimetre (km) des communes de la Sarthe, avec une geometrie nommee geometry en SRID 2154 (unite metre), arrondis a deux decimales : SELECT \"NOM_COMM\", round((ST_Area(geometry)/1000000)::numeric, 2) AS surface_km2, round((ST_Perimeter(geometry)/1000)::numeric, 2) AS perimetre_km FROM commune WHERE \"NOM_DEPT\" = 'SARTHE'. On divise par 1 000 000 pour passer des m2 aux km2, et par 1 000 pour passer des metres aux km, ces fonctions ne prenant pas de parametre d'unite."
      }
    ]
  },
  {
    "id": "siad",
    "titre": "SI d'Aide à la Décision",
    "sousTitre": "SIAD / Business Intelligence",
    "icone": "📈",
    "couleur": "#0d9488",
    "ue": "app_bd",
    "placeholder": true,
    "resume": [],
    "qcm": [],
    "questionsOuvertes": []
  },
  {
    "id": "j2e",
    "titre": "Programmation J2E",
    "sousTitre": "Java EE / Jakarta EE",
    "icone": "☕",
    "couleur": "#0891b2",
    "ue": "prog1",
    "placeholder": false,
    "resume": [
      {
        "titre": "Architecture multi-tiers Java EE",
        "contenu": "Java EE/Jakarta EE structure une application en couches: client (tier presentation), tier web (Servlets/JSP/JSF), tier metier (EJB/CDI) et tier EIS/donnees (JPA/JDBC). Cette separation favorise scalabilite, maintenabilite et reutilisation."
      },
      {
        "titre": "Conteneurs et services",
        "contenu": "Un conteneur (web ou EJB) heberge les composants et fournit des services transverses: cycle de vie, injection de dependances, transactions, securite, concurrence et nommage JNDI. Le developpeur se concentre sur la logique metier, le conteneur gere l'infrastructure."
      },
      {
        "titre": "Servlet et cycle de vie",
        "contenu": "Une Servlet est un composant Java cote serveur qui traite des requetes HTTP. Son cycle de vie est gere par le conteneur: `init()` une seule fois au chargement, `service()` (puis `doGet`/`doPost`) a chaque requete, et `destroy()` au dechargement."
      },
      {
        "titre": "doGet vs doPost",
        "contenu": "`doGet()` traite les requetes GET (parametres dans l'URL, idempotente, cacheable, limitee en taille); `doPost()` traite les requetes POST (donnees dans le corps, non idempotente, adaptee aux formulaires et donnees sensibles). Toutes deux recoivent `HttpServletRequest` et `HttpServletResponse`."
      },
      {
        "titre": "JSP (JavaServer Pages)",
        "contenu": "JSP permet d'ecrire des pages dynamiques mélant HTML et code Java. Une JSP est compilee en Servlet par le conteneur. On privilegie EL (`${...}`) et JSTL (`<c:forEach>`, `<c:if>`) plutot que les scriptlets `<% %>` pour separer presentation et logique."
      },
      {
        "titre": "JSF (JavaServer Faces)",
        "contenu": "JSF est un framework MVC oriente composants pour construire des interfaces web. Il repose sur des managed beans, un arbre de composants UI, le langage d'expression et un cycle de vie en 6 phases (Restore View, Apply Request Values, Process Validations, Update Model, Invoke Application, Render Response)."
      },
      {
        "titre": "JDBC",
        "contenu": "JDBC (Java Database Connectivity) est l'API bas niveau d'acces aux bases relationnelles. Le flux type: `DriverManager`/`DataSource` -> `Connection` -> `PreparedStatement` (parametre, anti-injection SQL) -> `ResultSet` -> fermeture des ressources (try-with-resources)."
      },
      {
        "titre": "JPA et ORM",
        "contenu": "JPA (Jakarta Persistence API) est la specification de mapping objet-relationnel; Hibernate en est l'implementation la plus repandue. Elle mappe des entites Java vers des tables et evite l'ecriture manuelle du SQL CRUD."
      },
      {
        "titre": "Entites JPA",
        "contenu": "Une entite est une classe annotee `@Entity` avec une cle primaire `@Id` (souvent `@GeneratedValue`). Les associations se declarent via `@OneToMany`, `@ManyToOne`, `@OneToOne`, `@ManyToMany`, et le mapping de colonnes via `@Column`, `@Table`, `@JoinColumn`."
      },
      {
        "titre": "EntityManager",
        "contenu": "L'`EntityManager` est l'interface centrale de JPA: il gere le cycle de vie des entites (`persist`, `merge`, `remove`, `find`) et le contexte de persistance. Les requetes se font en JPQL via `createQuery` ou avec l'API Criteria, dans le cadre d'une transaction."
      },
      {
        "titre": "EJB (Enterprise JavaBeans)",
        "contenu": "Les EJB sont des composants metier transactionnels geres par le conteneur. On distingue les Session Beans `@Stateless` (sans etat, mutualises), `@Stateful` (etat par client) et `@Singleton` (instance unique), avec gestion automatique des transactions et de la securite."
      },
      {
        "titre": "Modele MVC",
        "contenu": "Le pattern MVC separe Modele (donnees/entites JPA), Vue (JSP/JSF) et Controleur (Servlet ou managed bean). En Java EE le 'Model 2' utilise une Servlet comme controleur frontal qui delegue la logique aux EJB et choisit la vue JSP a afficher."
      },
      {
        "titre": "Sessions et suivi d'etat",
        "contenu": "HTTP etant sans etat, le suivi de session utilise `HttpSession` (via `request.getSession()`), generalement implementee par un cookie `JSESSIONID` ou la reecriture d'URL. On y stocke des attributs propres a l'utilisateur (panier, identite) entre les requetes."
      },
      {
        "titre": "Deploiement et serveurs",
        "contenu": "Une application web Java EE se package en archive `WAR` (et un module EE complet en `EAR`). Elle se deploie sur un conteneur web comme Tomcat (Servlet/JSP) ou un serveur d'applications complet comme GlassFish/WildFly/Payara (qui ajoute EJB, JMS, JTA)."
      },
      {
        "titre": "Descripteur web.xml et annotations",
        "contenu": "Le deploiement web se configure via `web.xml` (mapping de servlets, filtres, parametres) ou via les annotations equivalentes `@WebServlet`, `@WebFilter`, `@WebListener`. Depuis Servlet 3.0, le `web.xml` est devenu optionnel grace aux annotations."
      }
    ],
    "qcm": [
      {
        "q": "Quelle methode du cycle de vie d'une Servlet est appelee une seule fois, au chargement de la Servlet?",
        "options": [
          "A) service()",
          "B) doGet()",
          "C) init()",
          "D) destroy()"
        ],
        "reponse": "C",
        "explication": "init() est invoquee une unique fois par le conteneur lors du premier chargement de la Servlet, pour son initialisation."
      },
      {
        "q": "Dans quelle archive package-t-on une application web Java EE?",
        "options": [
          "A) JAR",
          "B) WAR",
          "C) EAR",
          "D) ZIP"
        ],
        "reponse": "B",
        "explication": "Le WAR (Web Application Archive) contient Servlets, JSP, classes et ressources web. L'EAR regroupe plusieurs modules d'une application EE complete."
      },
      {
        "q": "Quelle annotation declare une classe comme entite JPA?",
        "options": [
          "A) @Table",
          "B) @Entity",
          "C) @Column",
          "D) @Bean"
        ],
        "reponse": "B",
        "explication": "@Entity marque une classe Java comme entite persistante mappee sur une table de la base de donnees."
      },
      {
        "q": "Quelle interface JPA gere le cycle de vie des entites (persist, merge, remove, find)?",
        "options": [
          "A) EntityManager",
          "B) Session",
          "C) Connection",
          "D) Statement"
        ],
        "reponse": "A",
        "explication": "L'EntityManager est le point central de JPA pour manipuler les entites et le contexte de persistance. Session est l'equivalent specifique a Hibernate."
      },
      {
        "q": "Quelle methode HTTP est generalement traitee par doPost() dans une Servlet?",
        "options": [
          "A) GET",
          "B) POST",
          "C) PUT",
          "D) HEAD"
        ],
        "reponse": "B",
        "explication": "doPost() traite les requetes HTTP POST, typiquement la soumission de formulaires avec des donnees dans le corps de la requete."
      },
      {
        "q": "Quel type d'EJB ne conserve aucun etat conversationnel entre les appels du client?",
        "options": [
          "A) @Stateful",
          "B) @Singleton",
          "C) @Stateless",
          "D) @Entity"
        ],
        "reponse": "C",
        "explication": "Un Stateless Session Bean ne maintient pas d'etat propre au client; ses instances sont mutualisees dans un pool par le conteneur."
      },
      {
        "q": "Quel objet JDBC faut-il privilegier pour eviter les injections SQL?",
        "options": [
          "A) Statement",
          "B) PreparedStatement",
          "C) ResultSet",
          "D) Connection"
        ],
        "reponse": "B",
        "explication": "PreparedStatement utilise des requetes parametrees (?), ce qui separe le code SQL des donnees et previent l'injection SQL."
      },
      {
        "q": "Quelle technologie est compilee en Servlet par le conteneur a la premiere requete?",
        "options": [
          "A) JSP",
          "B) EJB",
          "C) JPA",
          "D) JNDI"
        ],
        "reponse": "A",
        "explication": "Une page JSP est traduite en code source Servlet puis compilee par le conteneur lors de sa premiere execution."
      },
      {
        "q": "Quel objet permet de suivre l'etat d'un utilisateur entre plusieurs requetes HTTP?",
        "options": [
          "A) HttpServletRequest",
          "B) HttpServletResponse",
          "C) HttpSession",
          "D) ServletContext"
        ],
        "reponse": "C",
        "explication": "HttpSession stocke des attributs propres a un utilisateur entre les requetes, le suivi reposant souvent sur le cookie JSESSIONID."
      },
      {
        "q": "Dans le pattern MVC 'Model 2' de Java EE, quel composant joue le role de controleur frontal?",
        "options": [
          "A) La JSP",
          "B) L'entite JPA",
          "C) La Servlet",
          "D) Le fichier web.xml"
        ],
        "reponse": "C",
        "explication": "Dans le Model 2, une Servlet centralise la reception des requetes, delegue la logique metier et choisit la vue (JSP) a afficher."
      },
      {
        "q": "Quelle annotation remplace la declaration d'une servlet dans web.xml depuis Servlet 3.0?",
        "options": [
          "A) @WebFilter",
          "B) @WebServlet",
          "C) @WebListener",
          "D) @Path"
        ],
        "reponse": "B",
        "explication": "@WebServlet permet de declarer une Servlet et son mapping d'URL directement par annotation, rendant web.xml optionnel."
      },
      {
        "q": "Quel langage de requete oriente objet est utilise par JPA?",
        "options": [
          "A) SQL natif uniquement",
          "B) JPQL",
          "C) HQL exclusivement",
          "D) XPath"
        ],
        "reponse": "B",
        "explication": "JPQL (Jakarta Persistence Query Language) interroge les entites et leurs attributs plutot que les tables et colonnes directement."
      },
      {
        "q": "Quel serveur est un conteneur web 'leger' qui supporte Servlet et JSP mais pas nativement les EJB?",
        "options": [
          "A) GlassFish",
          "B) WildFly",
          "C) Apache Tomcat",
          "D) Payara"
        ],
        "reponse": "C",
        "explication": "Tomcat est un conteneur de Servlets/JSP. GlassFish, WildFly et Payara sont des serveurs d'applications complets supportant EJB, JMS, JTA."
      },
      {
        "q": "Quelle annotation declare la cle primaire d'une entite JPA?",
        "options": [
          "A) @Column",
          "B) @Id",
          "C) @Key",
          "D) @Primary"
        ],
        "reponse": "B",
        "explication": "@Id designe l'attribut servant de cle primaire; il est souvent associe a @GeneratedValue pour la generation automatique."
      },
      {
        "q": "Combien de phases comporte le cycle de vie de traitement d'une requete en JSF?",
        "options": [
          "A) 3",
          "B) 4",
          "C) 6",
          "D) 8"
        ],
        "reponse": "C",
        "explication": "JSF comporte 6 phases: Restore View, Apply Request Values, Process Validations, Update Model Values, Invoke Application, Render Response."
      },
      {
        "q": "Quel objet recoit une Servlet pour lire les parametres et entetes d'une requete?",
        "options": [
          "A) HttpServletResponse",
          "B) HttpServletRequest",
          "C) ServletConfig",
          "D) PrintWriter"
        ],
        "reponse": "B",
        "explication": "HttpServletRequest encapsule la requete entrante: parametres, entetes, methode HTTP, session et corps de la requete."
      },
      {
        "q": "Quelle annotation JPA mappe une relation 'plusieurs vers un'?",
        "options": [
          "A) @OneToMany",
          "B) @ManyToOne",
          "C) @ManyToMany",
          "D) @OneToOne"
        ],
        "reponse": "B",
        "explication": "@ManyToOne place le cote 'plusieurs' d'une relation, c'est generalement lui qui porte la cle etrangere (@JoinColumn)."
      },
      {
        "q": "Quelle technologie standard fournit l'injection de dependances dans Jakarta EE?",
        "options": [
          "A) JNDI",
          "B) CDI",
          "C) JAXB",
          "D) JTA"
        ],
        "reponse": "B",
        "explication": "CDI (Contexts and Dependency Injection) standardise l'injection (@Inject), la gestion des scopes et des beans dans Jakarta EE."
      },
      {
        "q": "Quel service transverse le conteneur EJB gere-t-il automatiquement par defaut?",
        "options": [
          "A) Le rendu HTML",
          "B) Les transactions",
          "C) La compilation JSP",
          "D) Le routage DNS"
        ],
        "reponse": "B",
        "explication": "Le conteneur EJB applique la gestion declarative des transactions (CMT): chaque methode d'un bean s'execute par defaut dans une transaction."
      },
      {
        "q": "Quel mecanisme de suivi de session est utilise lorsque les cookies sont desactives?",
        "options": [
          "A) La reecriture d'URL (URL rewriting)",
          "B) Le cache HTTP",
          "C) Le DNS",
          "D) Le multicast"
        ],
        "reponse": "A",
        "explication": "La reecriture d'URL ajoute l'identifiant de session (jsessionid) dans l'URL quand les cookies ne sont pas disponibles."
      },
      {
        "q": "Quelle API Jakarta EE est dediee a la creation de services web REST?",
        "options": [
          "A) JAX-WS",
          "B) JAX-RS",
          "C) JMS",
          "D) JPA"
        ],
        "reponse": "B",
        "explication": "JAX-RS (avec les annotations @Path, @GET, @POST) permet de construire des services web RESTful. JAX-WS concerne les services SOAP."
      },
      {
        "q": "Quelle technologie permet d'iterer sur une collection dans une JSP sans scriptlet?",
        "options": [
          "A) <c:forEach> de JSTL",
          "B) <% for %>",
          "C) @ManyToOne",
          "D) DriverManager"
        ],
        "reponse": "A",
        "explication": "La balise JSTL <c:forEach> parcourt une collection de maniere declarative, evitant les scriptlets Java dans la JSP."
      },
      {
        "q": "Que represente le contexte de persistance dans JPA?",
        "options": [
          "A) Un pool de threads",
          "B) Un ensemble d'entites gerees suivies par l'EntityManager",
          "C) Le descripteur web.xml",
          "D) Une file de messages JMS"
        ],
        "reponse": "B",
        "explication": "Le contexte de persistance est l'ensemble des entites 'managed' suivies par l'EntityManager; les changements y sont synchronises avec la base au flush/commit."
      },
      {
        "q": "Quelle methode de la Servlet est appelee juste avant son dechargement par le conteneur?",
        "options": [
          "A) init()",
          "B) service()",
          "C) destroy()",
          "D) finalize()"
        ],
        "reponse": "C",
        "explication": "destroy() est invoquee une fois par le conteneur avant de retirer la Servlet, pour liberer les ressources."
      },
      {
        "q": "Quel fichier est le descripteur de deploiement standard d'une application web Java EE?",
        "options": [
          "A) application.xml",
          "B) web.xml",
          "C) persistence.xml",
          "D) pom.xml"
        ],
        "reponse": "B",
        "explication": "web.xml (situe dans WEB-INF) configure servlets, filtres et parametres web. application.xml concerne l'EAR, persistence.xml la persistance JPA."
      },
      {
        "q": "Ou se situe le fichier de configuration persistence.xml dans un projet JPA?",
        "options": [
          "A) Dans WEB-INF",
          "B) Dans META-INF",
          "C) A la racine du WAR",
          "D) Dans le dossier lib"
        ],
        "reponse": "B",
        "explication": "persistence.xml, qui definit les unites de persistance (persistence-unit), se place dans le repertoire META-INF du classpath."
      },
      {
        "q": "Quel type d'EJB garantit une instance unique partagee par toute l'application?",
        "options": [
          "A) @Stateless",
          "B) @Stateful",
          "C) @Singleton",
          "D) @RequestScoped"
        ],
        "reponse": "C",
        "explication": "Un Singleton Session Bean (@Singleton) fournit une instance unique pour l'ensemble de l'application, utile pour un cache ou un etat partage."
      },
      {
        "q": "Dans une URL de requete GET, ou se trouvent les parametres transmis?",
        "options": [
          "A) Dans le corps de la requete",
          "B) Dans la query string de l'URL",
          "C) Dans un cookie obligatoire",
          "D) Dans le fichier web.xml"
        ],
        "reponse": "B",
        "explication": "En GET, les parametres figurent dans la query string de l'URL (apres le ?), ce qui les rend visibles et limites en taille."
      }
    ],
    "questionsOuvertes": [
      {
        "q": "Decrivez en detail le cycle de vie d'une Servlet et le role du conteneur web dans sa gestion.",
        "reponseAttendue": "Le cycle de vie d'une Servlet est entierement gere par le conteneur web (Tomcat, etc.) et comporte trois grandes phases. 1) Chargement et instanciation: au demarrage de l'application ou a la premiere requete (selon load-on-startup), le conteneur charge la classe et cree une unique instance de la Servlet. 2) Initialisation: le conteneur appelle init(ServletConfig) une seule fois; on y place l'initialisation des ressources couteuses (connexion, configuration). 3) Service: pour chaque requete entrante, le conteneur appelle service(HttpServletRequest, HttpServletResponse) dans un thread distinct; la methode service() route vers doGet(), doPost(), doPut(), etc. selon la methode HTTP. Une seule instance traite donc plusieurs requetes concurrentes, ce qui impose d'eviter les attributs d'instance mutables non synchronises (probleme de thread-safety). 4) Destruction: lors du dechargement (arret du serveur, redeploiement), le conteneur appelle destroy() une fois pour liberer les ressources. Le conteneur fournit aussi les services transverses: gestion du pool de threads, des sessions, du mapping d'URL (@WebServlet ou web.xml) et de la duree de vie de l'instance."
      },
      {
        "q": "Expliquez le pattern MVC (Model 2) dans une application Java EE et le role de chaque couche avec les technologies associees.",
        "reponseAttendue": "Le pattern MVC (Model-View-Controller), dans sa variante Java EE appelee 'Model 2', separe l'application en trois responsabilites. Le Modele represente les donnees et la logique metier: il est constitue des entites JPA (@Entity), des services/EJB et des DAO; il ne connait ni la presentation ni le protocole HTTP. La Vue gere l'affichage: realisee avec JSP (+ EL et JSTL) ou JSF; elle ne contient idealement pas de logique metier, seulement de la mise en forme. Le Controleur orchestre: une Servlet joue le role de controleur frontal (front controller) qui recoit toutes les requetes, lit les parametres, invoque la logique metier (EJB/services), place les resultats dans la requete ou la session (request.setAttribute), puis transfere (RequestDispatcher.forward) vers la JSP appropriee. L'interet: separation des preoccupations, testabilite, reutilisation, et substitution facile des vues. Le flux type est: navigateur -> Servlet (controleur) -> EJB/service (modele) -> JPA (donnees) -> retour des donnees -> forward vers JSP (vue) -> reponse HTML. En JSF, ce role est tenu par le FacesServlet et les managed beans, mais le principe de separation reste identique."
      },
      {
        "q": "Comparez JDBC et JPA pour l'acces aux donnees: principes, avantages et inconvenients de chacun.",
        "reponseAttendue": "JDBC (Java Database Connectivity) est l'API bas niveau standard d'acces aux bases relationnelles. Principe: on obtient une Connection (via DriverManager ou un DataSource du pool), on cree un PreparedStatement parametre, on execute la requete SQL, on parcourt le ResultSet, puis on ferme les ressources (idealement avec try-with-resources). Avantages: controle total et fin du SQL, performances previsibles, leger. Inconvenients: code verbeux et repetitif, mapping manuel entre lignes et objets, SQL specifique au SGBD (portabilite reduite), gestion manuelle des transactions et ressources, risque d'erreurs. JPA (Jakarta Persistence API), implementee par Hibernate/EclipseLink, est une couche ORM de plus haut niveau. Principe: on mappe des entites (@Entity, @Id, @OneToMany, etc.) vers les tables; l'EntityManager realise les operations CRUD (persist, find, merge, remove) et on interroge en JPQL ou via Criteria. Avantages: productivite (CRUD genere), portabilite entre SGBD, gestion du cache, des relations, du chargement paresseux (lazy), et integration aux transactions du conteneur. Inconvenients: courbe d'apprentissage, surcout pour requetes tres complexes, comportements subtils (lazy loading, N+1, contexte de persistance) a maitriser. En pratique, JPA est privilegie pour la majorite des cas; JDBC reste utile pour le SQL natif optimise ou les traitements de masse."
      },
      {
        "q": "Qu'est-ce qu'une session HTTP, pourquoi est-elle necessaire et comment est-elle implementee en Java EE?",
        "reponseAttendue": "HTTP est un protocole sans etat (stateless): chaque requete est independante et le serveur n'a, par defaut, aucune memoire des requetes precedentes d'un meme utilisateur. Or de nombreuses applications doivent maintenir un etat propre a l'utilisateur entre plusieurs requetes (authentification, panier d'achat, preferences). La session HTTP resout ce probleme. En Java EE, l'objet HttpSession represente cette session cote serveur; on l'obtient via request.getSession() (qui en cree une si necessaire) et on y stocke des attributs avec setAttribute(nom, valeur) / getAttribute(nom). Le conteneur attribue a chaque session un identifiant unique (sessionId). Le mecanisme de suivi le plus courant est le cookie JSESSIONID renvoye au navigateur et automatiquement renvoye a chaque requete; si les cookies sont desactives, on utilise la reecriture d'URL (URL rewriting) qui ajoute l'identifiant a l'URL. La session a une duree de vie configurable (timeout dans web.xml ou setMaxInactiveInterval) et peut etre invalidee explicitement (invalidate(), ex: deconnexion). Points d'attention: ne pas stocker de donnees volumineuses (impact memoire et clustering), securiser le cookie (HttpOnly, Secure), et se proteger contre le vol de session et la fixation de session (regenerer l'id apres login)."
      },
      {
        "q": "Decrivez les differents types d'EJB Session Beans et le role du conteneur EJB dans la gestion des transactions et de la securite.",
        "reponseAttendue": "Les Session Beans sont les composants metier des EJB, geres par le conteneur EJB. Il en existe trois types. 1) Stateless (@Stateless): sans etat conversationnel; chaque appel est independant, le conteneur mutualise les instances dans un pool, ce qui offre une excellente scalabilite; ideal pour des services metier transactionnels (ex: traitement d'une commande). 2) Stateful (@Stateful): maintient un etat propre a un client donne entre plusieurs appels (ex: panier multi-etapes); une instance est dediee a un client pendant toute la conversation. 3) Singleton (@Singleton): instance unique pour toute l'application, utile pour un cache partage ou une initialisation au demarrage (@Startup), avec gestion de la concurrence (@Lock). Le conteneur EJB fournit des services transverses cles. Transactions: par defaut, les EJB utilisent la gestion declarative des transactions (CMT, Container-Managed Transactions): chaque methode s'execute dans une transaction selon des attributs (@TransactionAttribute: REQUIRED par defaut, REQUIRES_NEW, MANDATORY, etc.); en cas d'exception non geree, le conteneur effectue un rollback automatique. On peut aussi opter pour BMT (Bean-Managed Transactions) avec UserTransaction. Securite: le conteneur applique une securite declarative via @RolesAllowed, @PermitAll, @DenyAll, en s'appuyant sur l'identite et les roles authentifies; on peut interroger le contexte (isCallerInRole). Le conteneur gere aussi le cycle de vie, l'injection (@EJB, CDI), la concurrence et le pooling, dechargeant le developpeur de l'infrastructure."
      }
    ]
  },
  {
    "id": "python",
    "titre": "Python Avancée",
    "sousTitre": "Programmation Python",
    "icone": "📘",
    "couleur": "#3b82f6",
    "ue": "prog1",
    "placeholder": false,
    "resume": [
      {
        "titre": "Origine et nature de Python",
        "contenu": "Python est un langage cree en 1990 par Guido van Rossum, libre (licence gratuite), portable (independant de l'OS) et interprete. Sa syntaxe lisible le rend adapte aussi bien aux debutants qu'aux experts (web, data science, automatisation)."
      },
      {
        "titre": "Execution et REPL",
        "contenu": "On execute du code soit interactivement dans l'interpreteur (chevrons `>>>`) via la commande `python` (ou `py`/`python3`), soit en lancant un script avec `python mon_fichier.py`. Sous Windows il faut cocher \"Add to PATH\" a l'installation."
      },
      {
        "titre": "Variables et affectation",
        "contenu": "Une variable est un nom associe a une valeur, declaree par l'operateur d'affectation `=`, par exemple `livre = \"Gatsby le Magnifique\"`. La reassignation reutilise simplement `=`. Une variable possede trois elements : son nom, son type et sa valeur."
      },
      {
        "titre": "Conventions de nommage (PEP8)",
        "contenu": "Les noms doivent etre descriptifs, en mots complets, sans accents, commencant par une lettre ou un underscore, et suivre le snake_case (`revenu_annuel`). Les noms sont sensibles a la casse : `age`, `Age` et `AGE` sont trois variables differentes."
      },
      {
        "titre": "Types de donnees primitifs",
        "contenu": "Les types primitifs sont les entiers (`int`), les flottants (`float`, decimale notee avec un point : `3.14`), les chaines (`str`) et les booleens (`bool`). La fonction `type()` renvoie le type d'un objet, utile pour verifier la nature d'une valeur."
      },
      {
        "titre": "Operateurs arithmetiques",
        "contenu": "Python supporte `+` (somme), `-` (difference), `*` (produit), `/` (quotient, toujours float), `%` (reste/modulo). Il existe aussi `//` (division entiere) et `**` (puissance). L'interpreteur peut servir de calculatrice : `(100 + 81) * 11` donne `1991`."
      },
      {
        "titre": "Chaines de caracteres",
        "contenu": "Une chaine est du texte entoure de guillemets simples ou doubles (`'bonjour'` ou `\"bonjour\"`). `'912'` est une chaine alors que `912` est un entier. Les chaines sont immuables : elles ne peuvent pas etre modifiees apres creation."
      },
      {
        "titre": "f-strings (formatage)",
        "contenu": "Une f-string est une chaine prefixee par `f` contenant des expressions entre accolades `{}` evaluees a l'execution, par exemple `f\"Je m'appelle {prenom} et j'ai {age} ans\"`. C'est le moyen recommande pour inserer des variables dans du texte."
      },
      {
        "titre": "Listes : creation et indexation",
        "contenu": "Une liste, notee entre crochets `[ ]`, stocke une collection ordonnee et modifiable d'elements de types quelconques. L'indexation commence a 0 (`liste[0]` premier element) et accepte les indices negatifs (`liste[-1]` dernier element)."
      },
      {
        "titre": "Methodes de liste",
        "contenu": "Les listes offrent `append()` (ajout en fin), `remove()` (retire la 1re occurrence), `sort()` (tri), `extend()`, `insert()`, `pop()`, `index()`, `count()`, `reverse()`. La fonction `len()` donne la taille ; un indice >= a la taille leve une `IndexError`."
      },
      {
        "titre": "Tuples et immutabilite",
        "contenu": "Un tuple, note entre parentheses `( )`, partage l'indexation des listes mais est immuable : ses elements ne peuvent pas etre modifies apres creation. On l'utilise pour des donnees fixes (coordonnees, enregistrements constants)."
      },
      {
        "titre": "Operateur d'appartenance in",
        "contenu": "L'operateur `in` teste l'appartenance d'un element a une sequence (liste, tuple, chaine) et renvoie `True` ou `False`. Exemple : `\"a\" in \"chat\"` vaut `True`. Il sert aussi a iterer dans une boucle `for x in sequence`."
      },
      {
        "titre": "Indexation des chaines comme listes",
        "contenu": "Une chaine se comporte comme une liste de caracteres : chaque caractere possede un indice de 0 a la longueur moins un. Pour `langage = \"PYTHON\"`, `langage[2]` renvoie `\"T\"` et l'indice negatif `langage[-4]` renvoie egalement `\"T\"`."
      }
    ],
    "qcm": [
      {
        "q": "En quelle annee et par qui Python a-t-il ete cree ?",
        "options": [
          "A) 1985 par Dennis Ritchie",
          "B) 1990 par Guido van Rossum",
          "C) 1995 par James Gosling",
          "D) 2000 par Bjarne Stroustrup"
        ],
        "reponse": "B",
        "explication": "Le cours indique que Python a ete invente en 1990 par Guido van Rossum."
      },
      {
        "q": "Quel operateur permet de declarer/affecter une variable en Python ?",
        "options": [
          "A) ==",
          "B) :=",
          "C) =",
          "D) ->"
        ],
        "reponse": "C",
        "explication": "L'affectation et la reassignation utilisent l'operateur `=`. `==` est la comparaison d'egalite."
      },
      {
        "q": "Quelle convention de nommage est recommandee par la PEP8 pour les variables ?",
        "options": [
          "A) camelCase",
          "B) PascalCase",
          "C) snake_case",
          "D) kebab-case"
        ],
        "reponse": "C",
        "explication": "La PEP8 recommande le snake_case : mots minuscules separes par des underscores, comme `revenu_annuel`."
      },
      {
        "q": "Que renvoie `type(100.0)` ?",
        "options": [
          "A) <class 'int'>",
          "B) <class 'float'>",
          "C) <class 'str'>",
          "D) <class 'bool'>"
        ],
        "reponse": "B",
        "explication": "La presence d'une decimale fait de 100.0 un flottant (float), contrairement a 100 qui est un entier."
      },
      {
        "q": "Parmi ces variables, laquelle est de type chaine de caracteres ?",
        "options": [
          "A) age = 912",
          "B) age = 912.0",
          "C) age = '912'",
          "D) age = True"
        ],
        "reponse": "C",
        "explication": "`'912'` est entoure de guillemets, c'est donc une chaine ; `912` serait un entier."
      },
      {
        "q": "Comment ecrit-on le nombre 12,4 (francais) en Python ?",
        "options": [
          "A) 12,4",
          "B) 12.4",
          "C) '12,4'",
          "D) 12;4"
        ],
        "reponse": "B",
        "explication": "En Python la virgule decimale francaise devient un point : on ecrit `12.4`."
      },
      {
        "q": "Quel symbole prefixe une f-string ?",
        "options": [
          "A) s\"...\"",
          "B) f\"...\"",
          "C) r\"...\"",
          "D) b\"...\""
        ],
        "reponse": "B",
        "explication": "Une f-string est prefixee par `f` (ou `F`) et evalue les expressions placees entre accolades `{}`."
      },
      {
        "q": "Quelle est la valeur de `(100 + 81) * 11` ?",
        "options": [
          "A) 1881",
          "B) 1991",
          "C) 2091",
          "D) 1091"
        ],
        "reponse": "B",
        "explication": "100+81 = 181, puis 181*11 = 1991 ; le cours souligne que 1991 evoque la naissance de Python."
      },
      {
        "q": "A quel indice commence le premier element d'une liste en Python ?",
        "options": [
          "A) 1",
          "B) 0",
          "C) -1",
          "D) Selon la liste"
        ],
        "reponse": "B",
        "explication": "Comme dans la plupart des langages, l'indexation commence a 0 ; `liste[0]` est le premier element."
      },
      {
        "q": "Comment acceder au dernier element d'une liste `L` ?",
        "options": [
          "A) L[len]",
          "B) L[fin]",
          "C) L[-1]",
          "D) L[last]"
        ],
        "reponse": "C",
        "explication": "Les indices negatifs comptent depuis la fin : `L[-1]` renvoie le dernier element."
      },
      {
        "q": "Quelle methode ajoute un element a la fin d'une liste ?",
        "options": [
          "A) add()",
          "B) append()",
          "C) push()",
          "D) insert()"
        ],
        "reponse": "B",
        "explication": "`append()` ajoute un seul element a la fin de la liste existante."
      },
      {
        "q": "Que fait `remove()` sur une liste contenant plusieurs fois la meme valeur ?",
        "options": [
          "A) Retire toutes les occurrences",
          "B) Retire la derniere occurrence",
          "C) Retire la premiere occurrence",
          "D) Leve une erreur"
        ],
        "reponse": "C",
        "explication": "`remove()` ne retire que la premiere instance de l'element saisi."
      },
      {
        "q": "Quelle erreur survient si on accede a un indice superieur ou egal a la taille de la liste ?",
        "options": [
          "A) KeyError",
          "B) ValueError",
          "C) IndexError",
          "D) TypeError"
        ],
        "reponse": "C",
        "explication": "Un acces hors bornes leve une `IndexError`."
      },
      {
        "q": "Par quel symbole se caracterisent les tuples ?",
        "options": [
          "A) Les crochets [ ]",
          "B) Les accolades { }",
          "C) Les parentheses ( )",
          "D) Les chevrons < >"
        ],
        "reponse": "C",
        "explication": "Les tuples utilisent les parentheses `( )`, contrairement aux listes qui utilisent les crochets `[ ]`."
      },
      {
        "q": "Quelle est la principale difference entre une liste et un tuple ?",
        "options": [
          "A) Le tuple ne peut contenir que des nombres",
          "B) La liste est immuable, le tuple est modifiable",
          "C) Le tuple est immuable, la liste est modifiable",
          "D) Aucune difference"
        ],
        "reponse": "C",
        "explication": "Les tuples sont immuables (non modifiables apres creation) alors que les listes sont modifiables."
      },
      {
        "q": "Que signifie qu'un objet est \"immuable\" ?",
        "options": [
          "A) Il occupe peu de memoire",
          "B) Il ne peut pas etre modifie apres sa creation",
          "C) Il est toujours public",
          "D) Il est trie automatiquement"
        ],
        "reponse": "B",
        "explication": "Immuable (immutable) signifie qu'un objet ne peut plus etre modifie une fois cree ; les chaines en sont un exemple."
      },
      {
        "q": "Que renvoie l'operateur `in` quand l'element est present dans la sequence ?",
        "options": [
          "A) 1",
          "B) True",
          "C) yes",
          "D) found"
        ],
        "reponse": "B",
        "explication": "`in` renvoie `True` si l'element est present, `False` sinon."
      },
      {
        "q": "Pour `langage = \"PYTHON\"`, que renvoie `langage[2]` ?",
        "options": [
          "A) 'Y'",
          "B) 'T'",
          "C) 'H'",
          "D) 'P'"
        ],
        "reponse": "B",
        "explication": "L'indice 2 correspond au 3e caractere (P=0, Y=1, T=2), donc `\"T\"`."
      },
      {
        "q": "Quel operateur donne le reste d'une division entiere ?",
        "options": [
          "A) /",
          "B) //",
          "C) %",
          "D) **"
        ],
        "reponse": "C",
        "explication": "`%` (modulo) renvoie le reste de x divise par y ; `//` donnerait le quotient entier."
      },
      {
        "q": "Quelle fonction renvoie le nombre d'elements d'une liste ?",
        "options": [
          "A) size()",
          "B) count()",
          "C) len()",
          "D) length()"
        ],
        "reponse": "C",
        "explication": "`len()` renvoie la longueur (nombre d'elements) d'une liste, d'un tuple ou d'une chaine."
      },
      {
        "q": "Comment trie-t-on les elements d'une liste sur place ?",
        "options": [
          "A) order()",
          "B) sort()",
          "C) arrange()",
          "D) rank()"
        ],
        "reponse": "B",
        "explication": "`sort()` trie alphabetiquement (chaines) ou numeriquement (nombres) les elements de la liste."
      },
      {
        "q": "Quel mot-cle definit une fonction en Python ?",
        "options": [
          "A) function",
          "B) def",
          "C) func",
          "D) define"
        ],
        "reponse": "B",
        "explication": "Une fonction se declare avec `def nom(parametres):` suivi d'un bloc indente."
      },
      {
        "q": "Que represente `*args` dans la signature d'une fonction ?",
        "options": [
          "A) Un nombre variable d'arguments positionnels regroupes en tuple",
          "B) Un seul argument obligatoire",
          "C) Les arguments nommes regroupes en dictionnaire",
          "D) Une multiplication"
        ],
        "reponse": "A",
        "explication": "`*args` capture un nombre variable d'arguments positionnels sous forme de tuple ; `**kwargs` capture les arguments nommes en dictionnaire."
      },
      {
        "q": "Quelle syntaxe cree une liste des carres de 0 a 4 par comprehension ?",
        "options": [
          "A) [x*x for x in range(5)]",
          "B) {x*x for x in range(5)}",
          "C) (x*x in range(5))",
          "D) for x in range(5): x*x"
        ],
        "reponse": "A",
        "explication": "Une comprehension de liste s'ecrit `[expression for variable in iterable]`, ici `[x*x for x in range(5)]`."
      },
      {
        "q": "Quel mot-cle transforme une fonction en generateur ?",
        "options": [
          "A) return",
          "B) yield",
          "C) async",
          "D) gen"
        ],
        "reponse": "B",
        "explication": "`yield` produit une valeur a la fois et suspend l'etat de la fonction, creant un generateur paresseux."
      },
      {
        "q": "Quelle structure capture les exceptions en Python ?",
        "options": [
          "A) try / except",
          "B) check / catch",
          "C) do / rescue",
          "D) if / error"
        ],
        "reponse": "A",
        "explication": "On gere les erreurs avec `try:` ... `except TypeErreur:` ..., eventuellement `else` et `finally`."
      },
      {
        "q": "Que produit `list(map(lambda x: x+1, [1,2,3]))` ?",
        "options": [
          "A) [1, 2, 3]",
          "B) [2, 3, 4]",
          "C) [1, 4, 9]",
          "D) 6"
        ],
        "reponse": "B",
        "explication": "`map` applique la lambda `x+1` a chaque element : [2, 3, 4]."
      },
      {
        "q": "A quoi sert un decorateur en Python ?",
        "options": [
          "A) A supprimer une fonction",
          "B) A modifier/enrichir le comportement d'une fonction sans changer son code",
          "C) A typer une variable",
          "D) A trier une liste"
        ],
        "reponse": "B",
        "explication": "Un decorateur (`@mon_decorateur`) enveloppe une fonction pour en augmenter le comportement (logging, cache, controle d'acces)."
      },
      {
        "q": "Quelle methode speciale (dunder) est appelee a la creation d'un objet ?",
        "options": [
          "A) __str__",
          "B) __init__",
          "C) __call__",
          "D) __new__ uniquement"
        ],
        "reponse": "B",
        "explication": "`__init__` est le constructeur/initialiseur appele apres l'instanciation pour initialiser les attributs."
      },
      {
        "q": "Comment une classe `Chien` herite-t-elle de la classe `Animal` ?",
        "options": [
          "A) class Chien -> Animal:",
          "B) class Chien(Animal):",
          "C) class Chien extends Animal:",
          "D) class Chien: inherit Animal"
        ],
        "reponse": "B",
        "explication": "L'heritage se declare en placant la classe parente entre parentheses : `class Chien(Animal):`."
      }
    ],
    "questionsOuvertes": [
      {
        "q": "Expliquez ce qu'est une variable en Python et detaillez ses trois constituants. Illustrez la declaration, la reassignation et l'affichage avec une f-string.",
        "reponseAttendue": "Une variable est un nom (etiquette) associe a un emplacement memoire contenant une valeur ; on peut la comparer a un carton etiquete servant a stocker une donnee pour la reutiliser. Elle possede trois constituants : (1) son nom (identifiant), (2) son type (determine par la nature de la valeur : int, float, str, bool), (3) sa valeur. Declaration via l'operateur d'affectation `=` : `livre = \"Gatsby le Magnifique\"`. Reassignation avec la meme syntaxe : `livre = \"Beloved\"` ; le nom pointe alors vers la nouvelle valeur. Le nommage suit la PEP8 (snake_case, noms descriptifs, sans accents, debutant par une lettre ou underscore, sensible a la casse). Affichage avec une f-string : `prenom = \"Sam\"; age = 20; print(f\"Je m'appelle {prenom} et j'ai {age} ans\")` qui affiche \"Je m'appelle Sam et j'ai 20 ans\" ; les expressions entre accolades sont evaluees a l'execution."
      },
      {
        "q": "Comparez les listes et les tuples : syntaxe, indexation, mutabilite, et cas d'usage. Donnez des exemples de code.",
        "reponseAttendue": "Listes : notees entre crochets `[ ]`, ex. `plateformes = [\"Facebook\", \"X\", \"Instagram\"]`. Tuples : notes entre parentheses `( )`, ex. `point = (3, 4)`. Indexation : identique pour les deux, commence a 0, supporte les indices negatifs : `plateformes[0]` -> premier, `plateformes[-1]` -> dernier. Mutabilite : c'est la difference fondamentale. Les listes sont modifiables : on peut reaffecter `plateformes[0] = \"LinkedIn\"`, ajouter avec `append()`, retirer avec `remove()`, trier avec `sort()`. Les tuples sont immuables : toute tentative `point[0] = 5` leve une `TypeError`. Cas d'usage : liste pour une collection evolutive (panier, inventaire dynamique) ; tuple pour des donnees fixes/constantes (coordonnees, dates, enregistrements qui ne doivent pas changer, cles de dictionnaire). L'immutabilite des tuples offre une garantie d'integrite et permet leur utilisation comme cles."
      },
      {
        "q": "Presentez les types de donnees primitifs de Python et le role de la fonction type(). Montrez comment distinguer un entier d'un flottant et une chaine d'un nombre.",
        "reponseAttendue": "Les quatre types primitifs sont : les entiers `int` (nombres entiers : 1, 4, 3934), les flottants `float` (nombres decimaux avec un point : 3.14, 99.9), les chaines `str` (texte entre guillemets simples ou doubles), et les booleens `bool` (`True` / `False`). Distinction int/float : la presence d'une decimale ; `100` est un int, `100.0` est un float ; en Python la virgule decimale francaise devient un point (`12.4`). Distinction chaine/nombre : les guillemets ; `'912'` et `\"912\"` sont des chaines (texte) tandis que `912` est un entier exploitable en calcul. La fonction `type()` renvoie le type d'un objet : `type(100)` -> `<class 'int'>`, `type(100.0)` -> `<class 'float'>`, `type(\"912\")` -> `<class 'str'>`, `type(True)` -> `<class 'bool'>`. Elle permet de verifier rapidement la nature d'une donnee, utile avant une operation pour eviter les erreurs de type. Les booleens sont essentiels au controle du flux logique (conditions, tests de reussite)."
      },
      {
        "q": "Decrivez les principales operations et methodes disponibles sur les listes (ajout, suppression, tri, longueur, parcours). Precisez les erreurs possibles.",
        "reponseAttendue": "Creation : `L = [\"a\", \"b\", \"c\"]`. Acces : indexation `L[0]`, indices negatifs `L[-1]`. Ajout : `append(x)` ajoute x en fin ; `extend([...])` ajoute plusieurs elements ; `insert(i, x)` insere x a la position i. Suppression : `remove(x)` retire la premiere occurrence de x ; `pop(i)` supprime et renvoie l'element a l'indice i (ou le dernier sans argument). Tri : `sort()` trie en place (alphabetique pour les chaines, numerique pour les nombres) ; `reverse()` inverse l'ordre. Information : `len(L)` donne la taille ; `index(x)` renvoie la position de la premiere occurrence ; `count(x)` compte les occurrences. Parcours : `for element in L:` ou test d'appartenance `if x in L:` (renvoie True/False). Erreurs possibles : acceder a un indice >= a la taille leve une `IndexError` (ex. `L[4]` sur une liste de 3 elements) ; `remove(x)` ou `index(x)` sur un element absent leve une `ValueError`. Les methodes comme `sort()` et `append()` modifient la liste sur place et renvoient `None`."
      },
      {
        "q": "Expliquez ce qu'est une fonction en Python, l'interet des parametres *args/**kwargs, des fonctions lambda et de map/filter, avec exemples. (Extension du cours)",
        "reponseAttendue": "Une fonction est un bloc de code reutilisable defini avec `def nom(parametres):`, eventuellement renvoyant une valeur via `return`. Ex. `def carre(x): return x*x`. Elle favorise la modularite, la lisibilite et la reutilisation. Parametres variables : `*args` capture un nombre arbitraire d'arguments positionnels sous forme de tuple (`def somme(*args): return sum(args)` ; `somme(1,2,3)` -> 6) ; `**kwargs` capture les arguments nommes sous forme de dictionnaire (`def afficher(**kwargs): ...`). Cela rend les fonctions flexibles. Fonctions lambda : fonctions anonymes en une expression, `f = lambda x: x+1`, utiles comme arguments. Programmation fonctionnelle : `map(fonction, iterable)` applique une fonction a chaque element (`list(map(lambda x: x*2, [1,2,3]))` -> [2,4,6]) ; `filter(predicat, iterable)` ne garde que les elements verifiant le predicat (`list(filter(lambda x: x%2==0, [1,2,3,4]))` -> [2,4]) ; `reduce` (du module functools) agrege les elements en une seule valeur. Ces outils permettent un style declaratif concis. Note : ces notions prolongent le cours qui pose les bases (variables, types, listes) jusqu'a la programmation avancee."
      }
    ]
  },
  {
    "id": "oracle",
    "titre": "Administration BD Oracle",
    "sousTitre": "Oracle Database",
    "icone": "🅾️",
    "couleur": "#f97316",
    "ue": "admin_bd",
    "placeholder": true,
    "resume": [],
    "qcm": [],
    "questionsOuvertes": []
  },
  {
    "id": "sqlserver",
    "titre": "Administration BD SQL-Server",
    "sousTitre": "Microsoft SQL Server",
    "icone": "🗄️",
    "couleur": "#ea580c",
    "ue": "admin_bd",
    "placeholder": true,
    "resume": [],
    "qcm": [],
    "questionsOuvertes": []
  },
  {
    "id": "chinois",
    "titre": "Chinois",
    "sousTitre": "Mandarin 中文",
    "icone": "🇨🇳",
    "couleur": "#0ea5e9",
    "ue": "langues",
    "placeholder": true,
    "resume": [],
    "qcm": [],
    "questionsOuvertes": []
  },
  {
    "id": "techcom",
    "titre": "Techniques de Communication",
    "sousTitre": "Communication professionnelle",
    "icone": "📣",
    "couleur": "#38bdf8",
    "ue": "langues",
    "placeholder": true,
    "resume": [],
    "qcm": [],
    "questionsOuvertes": []
  },
  {
    "id": "entreprenariat",
    "titre": "Entreprenariat",
    "sousTitre": "Création d'entreprise",
    "icone": "💼",
    "couleur": "#ec4899",
    "ue": "droit",
    "placeholder": false,
    "resume": [
      {
        "titre": "Entrepreneur",
        "contenu": "Personne (ou groupe) qui cree, developpe et implante une entreprise dont elle assume les risques, en mobilisant des moyens financiers, humains et materiels pour realiser un profit (Larousse). C'est celui qui poursuit inlassablement une occasion d'affaire au-dela des ressources qu'il controle deja."
      },
      {
        "titre": "Entreprise",
        "contenu": "Entite economique et juridiquement autonome, organisee, comprenant une ou plusieurs personnes qui combinent les facteurs de production (travail et capital) pour produire des biens ou services vendus sur un marche afin de satisfaire des besoins et degager un profit."
      },
      {
        "titre": "Entrepreneuriat (3 finalites)",
        "contenu": "Action de creer de la richesse et/ou de l'emploi par la creation ou la reprise d'une entreprise. Selon l'OCDE, c'est une action dynamique humaine visant a generer de la valeur par la creation/expansion d'activites economiques et l'exploitation de nouveaux produits, processus ou marches."
      },
      {
        "titre": "Esprit d'entreprendre",
        "contenu": "Etat d'esprit traduisant une orientation forte vers la recherche d'opportunites, la prise de risques et les initiatives creatrices de valeur. Il valorise l'imagination, l'adaptabilite, l'acceptation du risque et l'engagement personnel, y compris au sein d'organisations existantes."
      },
      {
        "titre": "Formes d'entrepreneuriat",
        "contenu": "On distingue quatre origines de la creation : la creation `ex-nihilo` (a partir de rien, risque maximal), la creation par `essaimage` (avec l'appui de son employeur), la creation par `franchise` (franchiseur/franchise, accompagnement payant) et la `reprise d'entreprise` (saine ou en difficulte, risque moindre)."
      },
      {
        "titre": "Intrapreneuriat",
        "contenu": "Processus par lequel un individu (ou groupe), en association avec une organisation existante, cree une nouvelle activite ou genere le renouvellement/l'innovation au sein de cette organisation (Sharma et Chrisman, 1999). L'intrapreneur reste un salarie soumis a des obligations contractuelles envers son employeur."
      },
      {
        "titre": "Innerpreneuriat",
        "contenu": "Du latin 'inne' (dedans) : l'innerpreneur tire sa motivation de lui-meme et d'une cause profonde plutot que du marche. Mu par une raison d'etre, il vise l'impact et l'accomplissement plus que la performance. Exemples : Y. Chouinard (Patagonia), S. Jobs (Apple), O. Winfrey, B. Mycoskie (TOMS)."
      },
      {
        "titre": "Theories economiques de l'entrepreneur",
        "contenu": "Cantillon (1725) : preneur de risque dans l'incertitude (achat a prix certain, revente a prix incertain). J.-B. Say : coordinateur qui combine les facteurs de production. Schumpeter (1934) : innovateur moteur de la `destruction creatrice`. Marshall : assimile l'entrepreneur au manager. Marx : analyse l'exploitation capital/travail."
      },
      {
        "titre": "Innovation et destruction creatrice",
        "contenu": "Concept de Schumpeter : l'innovation (bien nouveau, methode de production, debouche, matiere premiere, organisation nouvelle) rend obsolete l'ancien et renouvelle le systeme economique. L'entrepreneur-innovateur, moteur du developpement, identifie les opportunites que les acteurs en place ne voient pas."
      },
      {
        "titre": "Environnement de l'entreprise",
        "contenu": "Ensemble des facteurs externes influencant l'entreprise. On distingue le `macro-environnement` (politique, juridique, economique, socioculturel : facteurs subis), le `micro-environnement` (clients, fournisseurs, concurrents, distributeurs : parties prenantes) et le `meso-environnement` (intensite concurrentielle du secteur, modele des 5+1 forces de Porter)."
      },
      {
        "titre": "Classification des entreprises",
        "contenu": "Selon la taille (TPE 0-9, PE 10-49, ME 50-199, GE 200+ salaries ; aussi CA et capital investi), le secteur d'activite (primaire, secondaire, tertiaire, quaternaire/information) et la forme juridique. Au Cameroun, 99% des ~94 000 entreprises sont des PME et le secteur informel reste dominant."
      },
      {
        "titre": "Etapes de la creation d'entreprise",
        "contenu": "Cinq grandes etapes : (1) evaluation de l'opportunite ; (2) conception et formulation du projet (etudes de marche, juridique, financiere) ; (3) montage juridique et scenarios de financement/rentabilite ; (4) prise de decision ; (5) lancement de l'activite. La gestion de projet repose sur le `triangle d'or` cout-delai-performance."
      },
      {
        "titre": "Formalites de creation au Cameroun (OHADA)",
        "contenu": "Les formalites se font au `CFCE` (Centre de Formalites de Creation d'Entreprise) de Yaounde. Cout indicatif : 21 500 FCFA d'immatriculation au RCCM + 20 000 FCFA de droits fixes d'enregistrement ; delai de 3 a 7 jours. Formes OHADA : EURL/SASU, SARL (2-9 associes), SA/SPA (10+), SNC, GIC ; les societes morales se creent chez un notaire."
      },
      {
        "titre": "Business plan",
        "contenu": "Document ecrit (plan d'affaires) formalisant un projet de creation, reprise ou modification d'activite. Il comporte un volet redactionnel (idee, marche, concurrence, positionnement, cadre juridique) et un volet financier (compte previsionnel, bilan previsionnel, plan de financement, tresorerie, BFR, CAF). Sa vocation est argumentaire : convaincre banquiers et investisseurs."
      },
      {
        "titre": "Management des organisations",
        "contenu": "Ensemble de techniques pour gerer, organiser, diriger, controler et planifier les activites. Selon Fayol : prevoir/planifier, organiser, commander, coordonner et controler. Outils : agenda partage, diagramme de `Gantt`, ecoute active, tableau de bord, methodes de gestion de projet (traditionnelle, Agile, PERT, chemin critique, PRINCE2, Lean)."
      },
      {
        "titre": "Obstacles et risques de la creation",
        "contenu": "Trois grandes familles d'obstacles : techniques/materiels (besoin d'un business plan, d'une idee, d'un benchmark), le manque de temps, et les obstacles financiers (refus bancaire, ROI insuffisant). Solutions : `business angels`, aides etatiques, accompagnement. Argent et temps sont les deux contraintes principales de toute creation."
      }
    ],
    "qcm": [
      {
        "q": "Que signifie l'acronyme SWOT en analyse strategique ?",
        "options": [
          "A) Forces, faiblesses, opportunites et menaces",
          "B) Strategie, finances, opportunites et risques",
          "C) Solutions, work, organisation et technologie",
          "D) Systeme, web, operations et tactiques"
        ],
        "reponse": "A",
        "explication": "SWOT = Strengths, Weaknesses, Opportunities, Threats, soit Forces, faiblesses, opportunites et menaces."
      },
      {
        "q": "Sur quoi un exemple de force porte-t-il dans une analyse SWOT ?",
        "options": [
          "A) Une menace exterieure",
          "B) Une faiblesse interne du marche",
          "C) Un nouveau ardeur entrant sur le marche",
          "D) Une baisse de relation directe avec le conseil de l'entreprise"
        ],
        "reponse": "B",
        "explication": "Les forces (Strengths) sont des elements internes positifs ; par opposition, une faiblesse interne du marche releve aussi de l'analyse interne. La force decrit un atout propre a l'entreprise."
      },
      {
        "q": "Quel est l'objectif principal de l'environnement interne d'une entreprise ?",
        "options": [
          "A) Tendances du marche externe",
          "B) Structure organisationnelle",
          "C) Demande du marche et concurrence",
          "D) Politiques et procedures de l'entreprise"
        ],
        "reponse": "B",
        "explication": "L'environnement interne renvoie a l'organisation propre de la firme : sa structure organisationnelle, ses ressources et procedures, par opposition au marche externe."
      },
      {
        "q": "Quel est un exemple de facteur externe qui affecte l'environnement d'une entreprise ?",
        "options": [
          "A) Les preferences et la formation des employes",
          "B) La structure organisationnelle",
          "C) La demande du marche et la concurrence",
          "D) Les politiques et procedures de l'entreprise"
        ],
        "reponse": "C",
        "explication": "La demande du marche et la concurrence sont des facteurs externes (micro-environnement) que l'entreprise subit, contrairement aux elements internes."
      },
      {
        "q": "Quelle est une caracteristique cle d'une structure organisationnelle hierarchique ?",
        "options": [
          "A) Organigramme plat avec peu de niveaux",
          "B) Prise de decision decentralisee",
          "C) Plusieurs niveaux de gestion et chaine de commandement claire",
          "D) Structure flexible et adaptable"
        ],
        "reponse": "C",
        "explication": "Une structure hierarchique se caracterise par plusieurs niveaux de gestion et une chaine de commandement claire (lignes d'autorite descendantes)."
      },
      {
        "q": "Dans une structure organisationnelle hierarchique, qui rapporte generalement au gestionnaire de departement ?",
        "options": [
          "A) Employes de premiere ligne",
          "B) Chef d'equipe ou superviseurs",
          "C) Plusieurs niveaux de gestion et la direction",
          "D) Parties prenantes externes"
        ],
        "reponse": "B",
        "explication": "Le gestionnaire de departement encadre directement les chefs d'equipe ou superviseurs, qui eux-memes supervisent les employes de premiere ligne."
      },
      {
        "q": "Qui est credite du developpement de la theorie de la gestion scientifique ?",
        "options": [
          "A) Frederick Winslow Taylor",
          "B) Henri Fayol",
          "C) Max Weber",
          "D) Douglas McGregor"
        ],
        "reponse": "A",
        "explication": "Frederick W. Taylor est le pere de l'organisation scientifique du travail (taylorisme / scientific management)."
      },
      {
        "q": "Quel est le principe cle de la theorie de la gestion scientifique ?",
        "options": [
          "A) Automatisation et autonomie des employes",
          "B) Standardisation de processus de travail et des taches",
          "C) Structure organisationnelle plate",
          "D) Style de leadership participatif"
        ],
        "reponse": "B",
        "explication": "Le taylorisme repose sur la standardisation et la decomposition des processus et taches de travail afin d'optimiser le rendement."
      },
      {
        "q": "Quel type de structure organisationnelle combine les structures fonctionnelles et basees sur le projet ?",
        "options": [
          "A) Structure hierarchique",
          "B) Structure fonctionnelle",
          "C) Structure plate",
          "D) Structure matricielle"
        ],
        "reponse": "D",
        "explication": "La structure matricielle croise une logique fonctionnelle (metiers) et une logique projet, chaque employe ayant deux lignes de rattachement."
      },
      {
        "q": "Quel type d'innovation implique l'introduction du commerce electronique et de l'education en ligne ?",
        "options": [
          "A) Innovation de produit",
          "B) Innovation de processus",
          "C) Innovation de modele commercial",
          "D) Innovation d'interaction client"
        ],
        "reponse": "C",
        "explication": "Le e-commerce et l'e-learning transforment la facon de creer et capter de la valeur : il s'agit d'une innovation de modele commercial (business model)."
      },
      {
        "q": "Quel est un moteur cle de l'innovation ?",
        "options": [
          "A) Aversion au risque",
          "B) Culture bureaucratique",
          "C) Collaboration et experimentation",
          "D) Adhesion stricte aux methodes traditionnelles"
        ],
        "reponse": "C",
        "explication": "L'innovation est stimulee par la collaboration et l'experimentation, alors que l'aversion au risque et la bureaucratie la freinent."
      },
      {
        "q": "Quel est l'objectif principal d'une entreprise ?",
        "options": [
          "A) Fournir une protection sociale",
          "B) Generer des profits et creer de la valeur",
          "C) Reduire l'emploi",
          "D) Promouvoir la politique gouvernementale"
        ],
        "reponse": "B",
        "explication": "Le but premier de l'entreprise est de faire des profits en creant de la valeur, en repondant a la demande des consommateurs."
      },
      {
        "q": "Quelle est une caracteristique d'une entreprise prospere ?",
        "options": [
          "A) Manque d'innovation",
          "B) Incapacite a s'adapter au changement",
          "C) Leadership fort et planification strategique",
          "D) Dependance excessive a l'egard d'un seul client"
        ],
        "reponse": "C",
        "explication": "Un leadership fort et une planification strategique sont des facteurs cles de succes ; la dependance a un seul client est au contraire un facteur de risque."
      },
      {
        "q": "Quelle est l'etape cle dans le processus de creation d'une entreprise ?",
        "options": [
          "A) Realiser des etudes de marche et des analyses",
          "B) Developper un plan d'affaires complet",
          "C) Lancer une campagne de marketing",
          "D) Toutes les reponses ci-dessus"
        ],
        "reponse": "D",
        "explication": "Le processus de creation enchaine etude de marche, elaboration du business plan et lancement commercial : toutes ces etapes sont cles."
      },
      {
        "q": "Qu'est-ce qui est essentiel pour obtenir un financement pour une nouvelle entreprise ?",
        "options": [
          "A) Un plan d'affaires bien redige",
          "B) Une strategie marketing detaillee",
          "C) Une conception de produit complete",
          "D) Un large reseau de contacts"
        ],
        "reponse": "A",
        "explication": "Le business plan (plan d'affaires) est le document de reference qui permet de convaincre banquiers et investisseurs d'accorder un financement."
      },
      {
        "q": "Qui est credite du developpement de la theorie de la gestion administrative ?",
        "options": [
          "A) Frederick Winslow Taylor",
          "B) Henri Fayol",
          "C) Max weber",
          "D) Elton Mayo"
        ],
        "reponse": "B",
        "explication": "Henri Fayol est le fondateur de la theorie administrative et des fonctions du management (prevoir, organiser, commander, coordonner, controler)."
      },
      {
        "q": "Selon la theorie de la gestion administrative, quelle est l'une des fonctions cles de la gestion ?",
        "options": [
          "A) Controler",
          "B) Diriger",
          "C) Organiser",
          "D) Toutes les reponses ci-dessus"
        ],
        "reponse": "D",
        "explication": "Fayol identifie cinq fonctions : prevoir/planifier, organiser, commander/diriger, coordonner et controler. Toutes sont des fonctions cles."
      },
      {
        "q": "Quelle est la source courante d'idees commerciales ?",
        "options": [
          "A) Etudes de marche analyse",
          "B) Experience personnelle et competences",
          "C) Analyses de la concurrence",
          "D) Toutes les reponses ci-dessus"
        ],
        "reponse": "D",
        "explication": "Une idee d'affaires peut emerger des etudes de marche, de l'experience personnelle et de l'analyse de la concurrence : toutes sont des sources valables."
      },
      {
        "q": "Qu'est-ce qu'une potentielle d'opportunites commerciales ?",
        "options": [
          "A) Technologies emergentes et tendances",
          "B) Changement de reglementation gouvernementale",
          "C) Changement de comportement des consommateurs",
          "D) Toutes les reponses ci-dessus"
        ],
        "reponse": "D",
        "explication": "Les opportunites d'affaires naissent des technologies emergentes, des changements reglementaires et de l'evolution du comportement des consommateurs."
      },
      {
        "q": "Qu'est-ce qui est consideration cle lors de l'evaluation de la faisabilite d'une idee commerciale ?",
        "options": [
          "A) Taille et potentiel de croissance du marche",
          "B) Paysage concurrentiel et part de marche",
          "C) Projection financiere et retour sur investissement",
          "D) Toutes les reponses ci-dessus"
        ],
        "reponse": "D",
        "explication": "L'evaluation de la faisabilite integre la taille/croissance du marche, la concurrence et les projections financieres (ROI) : toutes ces dimensions comptent."
      },
      {
        "q": "Selon Richard Cantillon (1725), comment se definit l'entrepreneur ?",
        "options": [
          "A) Un innovateur qui met en oeuvre une technologie inedite",
          "B) Une personne qui prend des risques en achetant a prix certain pour revendre a prix incertain",
          "C) Un coordinateur qui combine les facteurs de production",
          "D) Un manager assimile au gestionnaire salarie"
        ],
        "reponse": "B",
        "explication": "Cantillon definit l'entrepreneur comme un preneur de risque agissant dans l'incertitude : il achete a un prix certain pour revendre a un prix incertain."
      },
      {
        "q": "Pour Joseph Schumpeter, quelle est l'essence de la fonction d'entrepreneur ?",
        "options": [
          "A) La recherche exclusive du profit",
          "B) La coordination des facteurs de production",
          "C) L'innovation et la destruction creatrice",
          "D) La gestion administrative routiniere"
        ],
        "reponse": "C",
        "explication": "Schumpeter fait de l'entrepreneur un innovateur, moteur de la destruction creatrice : il revolutionne la routine de production. Chez lui, la joie de creer l'emporte sur le seul profit."
      },
      {
        "q": "Quelles sont les cinq grandes etapes du processus de creation d'entreprise selon le cours ?",
        "options": [
          "A) Idee, brevet, production, vente, dividende",
          "B) Evaluation de l'opportunite, conception/formulation, montage juridique et financier, prise de decision, lancement",
          "C) Etude, embauche, production, marketing, cloture",
          "D) Capital, local, materiel, personnel, profit"
        ],
        "reponse": "B",
        "explication": "Le cours retient cinq etapes : evaluation de l'opportunite, conception/formulation du projet, montage juridique et scenarios de financement, prise de decision, puis lancement de l'activite."
      },
      {
        "q": "Quels sont les trois sommets du 'triangle d'or' de la gestion de projet ?",
        "options": [
          "A) Qualite, client, profit",
          "B) Cout, delai, performance",
          "C) Idee, equipe, financement",
          "D) Offre, demande, prix"
        ],
        "reponse": "B",
        "explication": "Le triangle d'or de la gestion de projet articule trois objectifs interdependants : le cout, le delai et la performance."
      },
      {
        "q": "Au Cameroun, ou s'effectuent les formalites de creation d'entreprise ?",
        "options": [
          "A) A la chambre de commerce uniquement",
          "B) Au CFCE (Centre de Formalites de Creation d'Entreprise)",
          "C) Directement a la banque centrale",
          "D) Au ministere du Travail"
        ],
        "reponse": "B",
        "explication": "Les formalites de creation se font au CFCE (Centre de Formalites de Creation d'Entreprise), notamment celui de Yaounde."
      },
      {
        "q": "Quelle forme de societe en droit OHADA correspond a une societe limitee a 2 a 9 associes designant un gerant ?",
        "options": [
          "A) EURL",
          "B) SARL",
          "C) SA / SPA",
          "D) GIC"
        ],
        "reponse": "B",
        "explication": "La SARL (Societe A Responsabilite Limitee) regroupe selon le cours entre 2 et 9 associes qui designent un gerant ; l'EURL est unipersonnelle et la SA/SPA va de 10 associes et plus."
      },
      {
        "q": "Que designe la creation 'ex-nihilo' ?",
        "options": [
          "A) La reprise d'une entreprise existante",
          "B) La creation a partir de rien, sans structure preexistante",
          "C) La creation avec l'appui de son employeur (essaimage)",
          "D) La creation par imitation d'une formule (franchise)"
        ],
        "reponse": "B",
        "explication": "'Ex-nihilo' signifie 'a partir de rien' : creer quand rien n'existe, ce qui exige beaucoup de travail, de rigueur et presente le niveau de risque le plus eleve."
      },
      {
        "q": "Qu'est-ce que l'essaimage 'a chaud' (curatif) ?",
        "options": [
          "A) Une creation realisee quand l'entreprise-mere est en bonne sante",
          "B) Une creation par franchise payante",
          "C) Une creation par les salaries dans le cadre d'une restructuration / reduction d'effectifs",
          "D) Une reprise d'entreprise en difficulte"
        ],
        "reponse": "C",
        "explication": "L'essaimage 'a chaud' ou curatif s'inscrit dans une restructuration : il vise a reduire les effectifs en douceur. L'essaimage 'a froid' (dynamique) intervient quand la situation est bonne."
      },
      {
        "q": "Qu'est-ce qu'une opportunite d'affaire selon le cours ?",
        "options": [
          "A) Une idee sans rapport avec le marche",
          "B) L'ancrage entre l'idee et le marche (une occasion d'affaire)",
          "C) Un document juridique de creation",
          "D) Un type de financement bancaire"
        ],
        "reponse": "B",
        "explication": "L'opportunite est definie comme une occasion d'affaire, c'est l'ancrage (la rencontre) entre l'idee et le marche, ce qui la distingue de la simple idee."
      },
      {
        "q": "Selon le modele des '6 M' du management americain, lequel des elements suivants en fait partie ?",
        "options": [
          "A) Money, Men, Machines, Materials, Market, Management",
          "B) Marketing, Money, Media, Market, Men, Methods",
          "C) Mission, Money, Market, Men, Methods, Margin",
          "D) Men, Money, Market, Mission, Media, Machines"
        ],
        "reponse": "A",
        "explication": "Le cours cite les six M du management : Money, Men, Machines, Materials, Market, Management."
      }
    ],
    "questionsOuvertes": [
      {
        "q": "Definissez et distinguez avec precision les notions d'entreprise, d'entrepreneur, d'entrepreneuriat et d'esprit d'entreprendre, puis montrez les liens qui les unissent.",
        "reponseAttendue": "L'ENTREPRISE est une entite economique et juridiquement autonome, organisee, qui combine les facteurs de production (travail et capital) pour produire des biens (materiels) ou des services (immateriels) vendus sur un marche afin de satisfaire des besoins et degager un profit. L'ENTREPRENEUR (du francais 'celui qui entreprend') est la personne, ou le groupe, qui cree, developpe et implante cette entreprise en assumant les risques et en mobilisant des moyens financiers, humains et materiels (Larousse) ; il poursuit une occasion d'affaire au-dela des ressources qu'il controle. L'ENTREPRENEURIAT est l'action de creer de la richesse et/ou de l'emploi par la creation ou la reprise d'une entreprise ; selon l'OCDE, c'est une action dynamique humaine visant a generer de la valeur par la creation/expansion d'activites economiques et l'exploitation de nouveaux produits, processus ou marches. L'ESPRIT D'ENTREPRENDRE est l'etat d'esprit (orientation vers l'opportunite, prise de risque, initiative creatrice de valeur, imagination, adaptabilite) qui peut s'exprimer aussi bien dans la creation d'une entreprise que dans une organisation existante (intrapreneuriat). LIENS : l'esprit d'entreprendre est le moteur psychologique ; l'entrepreneur en est le porteur ; l'entrepreneuriat est le processus qu'il met en oeuvre ; l'entreprise en est le resultat organisationnel. On insistera sur le fait que tout le monde peut entreprendre meme si certains ont plus d'aptitudes, et que l'argent et le temps sont les deux contraintes principales."
      },
      {
        "q": "Presentez la vision de l'entrepreneur chez Cantillon, J.-B. Say et J. Schumpeter, et montrez en quoi l'apport de Schumpeter renouvelle l'analyse.",
        "reponseAttendue": "RICHARD CANTILLON (1725) est le premier a developper largement la notion : l'entrepreneur (ex. le fermier) est un PRENEUR DE RISQUE qui agit dans l'INCERTITUDE ; il distingue celui qui prend les risques de celui qui fournit les capitaux. L'entrepreneur achete a un prix certain pour revendre a un prix incertain. JEAN-BAPTISTE SAY voit l'entrepreneur comme un COORDINATEUR : il reunit et combine les moyens (services productifs) de production ; personnage central qui recoit les directions du savant et les transmet a l'ouvrier, il doit prevoir, organiser, commander, coordonner, controler, et savoir innover pour surmonter la mevente. Say le situe au centre du processus economique mais dans un univers tendant vers l'equilibre (l'offre cree sa propre demande). JOSEPH SCHUMPETER (1934, 1942) fait de l'entrepreneur un INNOVATEUR qui reforme ou revolutionne la routine de production : son essence est la DESTRUCTION CREATRICE. L'innovation peut etre un bien nouveau, une methode de production, un nouveau debouche, une nouvelle matiere premiere ou une nouvelle organisation. RENOUVELLEMENT : la ou Say raisonne en univers stable, Schumpeter introduit le DYNAMISME et le CHANGEMENT ; l'entrepreneur va a l'encontre du statu quo, fait preuve de leadership, et la 'joie de creer' l'emporte sur la recherche du seul profit. L'entrepreneur n'est ni une profession ni un etat durable car il doit sans cesse executer de nouvelles combinaisons. On pourra completer par Marshall (entrepreneur assimile au manager) et Marx (probleme de l'exploitation capital/travail)."
      },
      {
        "q": "Decrivez les diverses formes de creation d'entreprise (ex-nihilo, essaimage, franchise, reprise) et precisez le critere principal qui les differencie ainsi que leur niveau de risque respectif.",
        "reponseAttendue": "QUATRE FORMES : (1) CREATION EX-NIHILO : creer 'a partir de rien' quand rien n'existe ; exige du temps pour implanter le produit, beaucoup de travail, de rigueur et de tenacite ; les besoins financiers doivent etre soigneusement dimensionnes ; RISQUE MAXIMAL. (2) CREATION PAR ESSAIMAGE : creer en etant encore salarie, avec l'aide de son entreprise (accompagnement materiel, intellectuel, commercial, financier), ce qui reduit le risque. On distingue l'essaimage 'a chaud'/curatif (situation degradee, restructuration, reduction d'effectifs en douceur) et l'essaimage 'a froid'/dynamique (situation saine, dynamisation interne, vision novatrice). (3) CREATION PAR FRANCHISE : relation franchiseur/franchise ; on imite une formule qui existe deja ; accompagnement important mais PAYANT ; convient a celui qui n'a pas d'idee propre ou peu de capacite a innover. (4) REPRISE D'ENTREPRISE : l'organisation existe deja, on s'appuie sur des donnees connues, l'incertitude et le RISQUE sont MOINDRES ; reprise en bonne sante (information rare, prix eleve, competences de management requises) ou en difficulte (cadre legal du redressement, forte recapitalisation, gestion de crise). CRITERE PRINCIPAL DE DIFFERENCIATION : le DEGRE D'INNOVATION et le rapport a l'existant (creer du nouveau vs reprendre/imiter de l'existant), ce qui determine directement le niveau d'incertitude et de risque assume par l'entrepreneur."
      },
      {
        "q": "Decrivez les etapes necessaires a la creation d'une entreprise au Cameroun, en precisant les formes juridiques disponibles, le role du CFCE, le cout et les delais indicatifs.",
        "reponseAttendue": "DEMARCHE GENERALE : l'entrepreneur choisit d'abord entre deux grandes formes - l'ENTREPRISE INDIVIDUELLE (EI, registre de commerce pour personne physique, on est seul commercant) ou une SOCIETE (registre de commerce pour personne morale, creee chez un NOTAIRE via les statuts, possibilite de plusieurs associes, obligation de commissaire aux comptes). FORMES OHADA citees : EURL/SASU (un seul associe), SARL (2 a 9 associes designant un gerant), SA/SPA (10 associes et plus, modele de la grande entreprise), SNC (societe familiale en nom collectif), GIC (groupement d'initiative commune, organisation autonome privee). LIEU : les formalites se font au CFCE (Centre de Formalites de Creation d'Entreprise) de Yaounde (entre le carrefour Warda et la maison de la radio), guichet unique. PIECES : plan de localisation, acte de naissance/CNI ou passeport/carte de sejour, acte de mariage, formulaire unique CFCE, demande d'immatriculation au registre de commerce, demande de carte de contribuable, declaration sur l'honneur ; puis denomination, contrat de bail du siege, creation des statuts, carte fiscale, NIS (numero d'identifiant statistique), ouverture d'un compte bancaire. COUT INDICATIF : 21 500 FCFA d'immatriculation au RCCM + 20 000 FCFA de droits fixes d'enregistrement (et honoraires de notaire pour une societe). DELAIS : files d'attente et passage au guichet de quelques minutes ; entree en possession des documents de creation sous 3 a 7 jours. REMARQUE : ces conditions evoluent (lois de finances, code des investissements)."
      },
      {
        "q": "Qu'est-ce qu'un business plan ? Presentez son utilite, ses destinataires et son contenu (volets redactionnel et financier), puis situez-le dans le processus de creation.",
        "reponseAttendue": "DEFINITION : le business plan (ou plan d'affaires) est un document ECRIT permettant de formaliser un projet de creation d'entreprise, de reprise ou de modification d'activite. UTILITE / VOCATION : il a une visee ARGUMENTAIRE, il doit convaincre le destinataire ; il permet d'obtenir un financement bancaire, de beneficier de participations d'investisseurs externes, et de negocier des tarifs preferentiels et delais de paiement aupres de fournisseurs. DESTINATAIRES : porteur de projet lui-meme, entourage, banquiers et investisseurs (il a pour principal objectif de seduire les investisseurs potentiels). QUESTIONS AUXQUELLES IL REPOND : qui est le porteur et quel est son parcours ? que vend-il et a qui ? qui sont les concurrents et quels avantages a-t-il ? selon quel calendrier deploie-t-il le projet ? quels besoins financiers, comment les financer, quel retour sur investissement ? CONTENU EN DEUX VOLETS : (a) une PARTIE REDACTIONNELLE (idee, analyse des concurrents, positionnement strategique, intensite concurrentielle, moyens, cadre juridique) ; (b) une PARTIE FINANCIERE (compte previsionnel, bilan previsionnel, plan de financement previsionnel, budget de tresorerie) faisant apparaitre des notions cles comme le BFR (besoin en fonds de roulement), la CAF (capacite d'autofinancement) et divers ratios. PLACE DANS LE PROCESSUS : il intervient surtout a l'etape de conception/formulation et au montage juridico-financier ; c'est le document de reference qui engage le dialogue avec les partenaires financiers et conditionne le succes de la demande de financement. Sa qualite et son exhaustivite sont determinantes."
      }
    ]
  },
  {
    "id": "droittravail",
    "titre": "Droit du Travail",
    "sousTitre": "Législation du travail",
    "icone": "⚖️",
    "couleur": "#f43f5e",
    "ue": "droit",
    "placeholder": true,
    "resume": [],
    "qcm": [],
    "questionsOuvertes": []
  },
  {
    "id": "multimedia",
    "titre": "Multimédia & Infographie",
    "sousTitre": "Techniques multimédias",
    "icone": "🎨",
    "couleur": "#8b5cf6",
    "ue": "prog2",
    "placeholder": false,
    "resume": [
      {
        "titre": "Infographie",
        "contenu": "L'infographie est le domaine de la creation d'images numeriques assistee par ordinateur ; c'est aussi, au sens du cours, la communication par l'image. Elle articule une dimension technique (logiciels, formats) et une dimension semiotique (porter un sens via l'image)."
      },
      {
        "titre": "Image numerique",
        "contenu": "Une image numerique est toute image acquise, creee, traitee et stockee sous forme binaire (suite de 0 et 1). Une image au sens general est une representation visuelle, voire mentale, de quelque chose : objet, etre vivant ou concept."
      },
      {
        "titre": "Signe et semiologie",
        "contenu": "Un signe est une marque, naturelle ou conventionnelle, designant pour quelqu'un un objet ou un concept et destinee a etre interpretee par un tiers. La semiologie (ou semeiologie) est l'etude des signes linguistiques, verbaux (avec parole) et non verbaux (sans parole)."
      },
      {
        "titre": "Signifiant et signifie",
        "contenu": "En linguistique (Saussure), le signe est la reunion d'un signifiant et d'un signifie. Le signifiant est l'image acoustique du mot, sa face materielle ; le signifie est le concept, la representation mentale de la chose. En infographie, l'image (signifiant visuel) doit transmettre le bon signifie."
      },
      {
        "titre": "Monosemie et polysemie",
        "contenu": "La monosemie qualifie un mot/une expression a un seul sens (un signifiant pour un signifie), ex. la logique 1+1=2. La polysemie qualifie un signifiant a plusieurs signifies, ex. une croix dans l'art ; une image polysemique appelle un contexte pour fixer le sens vise."
      },
      {
        "titre": "Notion de projet et demarche",
        "contenu": "Concevoir une image part d'un theme pour aboutir a un visuel via une demarche structuree : I - Analyse (A. Definition des mots-cles, B. Choix des elements majeurs refletant le sens du theme) puis II - Avant-projet, materialisation caricaturale associant des images aux elements majeurs retenus."
      },
      {
        "titre": "Supports de communication",
        "contenu": "Un support de communication est tout ce qui sert a conserver, transporter et transmettre une information. On distingue deux grands groupes : ceux lies a la chaine graphique (impression) et ceux lies a l'edition numerique (ecrans/web)."
      },
      {
        "titre": "Chaine graphique vs edition numerique",
        "contenu": "La chaine graphique est l'ensemble des professions intervenant de la conception a la finalisation d'un produit imprime en multiples exemplaires. L'edition numerique est l'ensemble des pratiques de production, mise en forme, circulation et legitimation d'un contenu dans un environnement numerique (livre numerique, site web)."
      },
      {
        "titre": "Format A4 et chaine graphique",
        "contenu": "La chaine graphique s'appuie sur un element de mesure de dimension : le format A4 (210 x 297 mm). Par convention il se presente en portrait (presentation a la francaise) et peut se presenter en paysage (a l'italienne). L'A4 a des multiples (A3, A2, A1, A0) et sous-multiples (A5, A6...)."
      },
      {
        "titre": "Resolution et pixel",
        "contenu": "Le pixel (picture element) est la plus petite unite d'une image matricielle. La resolution est un rapport de densite : le nombre de pixels affichables/imprimables dans un pouce (2,54 cm), exprime en `ppp/dpi`. Reperes usuels : 72 dpi pour l'ecran/web, 300 dpi pour l'impression de qualite."
      },
      {
        "titre": "Definition vs resolution",
        "contenu": "La definition d'une image est son nombre total de pixels (ex. `1920 x 1080`), independante du support. La resolution lie ces pixels a une dimension physique (dpi). Pour une definition fixe, augmenter la resolution reduit la taille imprimee, et inversement."
      },
      {
        "titre": "Matriciel (bitmap) vs vectoriel",
        "contenu": "L'image matricielle (bitmap : JPEG, PNG, GIF, TIFF, PSD) est une grille de pixels, riche en nuances mais pixellisee a l'agrandissement (dependante de la resolution). L'image vectorielle (SVG, AI, EPS) decrit des formes par des equations mathematiques (courbes de Bezier) : redimensionnable sans perte, ideale pour logos et typographie."
      },
      {
        "titre": "Profondeur de couleur et modes colorimetriques",
        "contenu": "La profondeur de couleur est le nombre de bits codant chaque pixel (1 bit = 2 couleurs, 8 bits = 256, 24 bits = ~16,7 millions en `true color`). Modes : RVB (additif, Rouge-Vert-Bleu, ecrans), CMJN (soustractif, Cyan-Magenta-Jaune-Noir, impression), TSL/TSV (Teinte-Saturation-Luminosite, modele intuitif de selection)."
      },
      {
        "titre": "Formats et compression",
        "contenu": "Compression sans perte (PNG, GIF, TIFF) : aucune degradation, fichiers plus lourds. Compression avec perte (JPEG) : taux de compression eleve mais artefacts, ideal pour les photos. GIF gere 256 couleurs + animation + transparence binaire ; PNG la transparence alpha ; SVG est vectoriel ; PSD est le format natif (calques) de Photoshop."
      },
      {
        "titre": "Logiciels et PAO",
        "contenu": "Les logiciels du cours sont Adobe Photoshop (retouche matricielle), Adobe Illustrator (dessin vectoriel) et QuarkXPress (mise en page/PAO) ; GIMP est l'alternative libre a Photoshop. La PAO (Publication Assistee par Ordinateur) designe la creation de documents destines a l'impression via des logiciels de mise en page (InDesign, QuarkXPress)."
      }
    ],
    "qcm": [
      {
        "q": "Selon le cours, qu'est-ce que l'infographie ?",
        "options": [
          "A) L'etude statistique des donnees graphiques",
          "B) Le domaine de la creation d'images numeriques assistee par ordinateur",
          "C) La fabrication de circuits imprimes",
          "D) Une technique d'impression offset"
        ],
        "reponse": "B",
        "explication": "Le cours definit l'infographie comme le domaine de la creation d'images numeriques assistee par ordinateur, et aussi comme la communication par l'image."
      },
      {
        "q": "Une image numerique est une image qui est :",
        "options": [
          "A) Imprimee sur papier glace",
          "B) Dessinee a la main puis scannee uniquement",
          "C) Acquise, creee, traitee et stockee sous forme binaire",
          "D) Toujours en couleur"
        ],
        "reponse": "C",
        "explication": "L'appellation image numerique designe toute image acquise, creee, traitee et stockee sous forme binaire (0 et 1)."
      },
      {
        "q": "Qu'est-ce qu'un signe selon le cours ?",
        "options": [
          "A) Un pixel colore",
          "B) Une marque designant pour quelqu'un un objet ou un concept, destinee a etre interpretee",
          "C) Un format de fichier",
          "D) Une couleur primaire"
        ],
        "reponse": "B",
        "explication": "Un signe est une marque, naturelle ou conventionnelle, designant pour quelqu'un un objet ou un concept et destinee a etre interpretee par un tiers."
      },
      {
        "q": "La semiologie est l'etude :",
        "options": [
          "A) Des couleurs et de leur melange",
          "B) Des signes linguistiques verbaux et non verbaux",
          "C) Des resolutions d'ecran",
          "D) Des algorithmes de compression"
        ],
        "reponse": "B",
        "explication": "La semiologie (ou semeiologie) est l'etude des signes linguistiques a la fois verbaux (avec parole) et non verbaux (sans parole)."
      },
      {
        "q": "En linguistique, le signe est la reunion :",
        "options": [
          "A) D'un pixel et d'un vecteur",
          "B) D'un signifiant et d'un signifie",
          "C) D'une teinte et d'une saturation",
          "D) D'un format et d'une resolution"
        ],
        "reponse": "B",
        "explication": "Le signe linguistique (Saussure) est la reunion d'un signifiant (image acoustique, face materielle) et d'un signifie (concept)."
      },
      {
        "q": "Le signifie designe :",
        "options": [
          "A) La face materielle du mot",
          "B) L'image acoustique",
          "C) Le concept, la representation mentale d'une chose",
          "D) Le son du mot"
        ],
        "reponse": "C",
        "explication": "Le signifie designe le concept, c'est-a-dire la representation mentale d'une chose ; le signifiant en est la face materielle (image acoustique)."
      },
      {
        "q": "Un mot polysemique est un mot :",
        "options": [
          "A) Qui n'a aucun sens",
          "B) Qui a un seul sens",
          "C) Qui a plusieurs sens ou significations differentes",
          "D) Qui ne peut pas etre image"
        ],
        "reponse": "C",
        "explication": "La polysemie : pour un seul signifiant on a plusieurs signifies (ex. une croix). La monosemie : un signifiant pour un seul signifie (ex. 1+1=2)."
      },
      {
        "q": "L'avant-projet, dans la demarche de creation, est :",
        "options": [
          "A) La version finale imprimee",
          "B) Une materialisation caricaturale associant des images aux elements majeurs",
          "C) Le devis du client",
          "D) Le choix du papier"
        ],
        "reponse": "B",
        "explication": "L'avant-projet est une materialisation caricaturale du projet : on y associe les images liees aux elements majeurs listes lors de l'analyse."
      },
      {
        "q": "Dans la demarche, l'etape Analyse comprend :",
        "options": [
          "A) La definition du theme et le choix des elements majeurs",
          "B) L'impression et la livraison",
          "C) La facturation",
          "D) Le choix de l'imprimante"
        ],
        "reponse": "A",
        "explication": "L'Analyse comprend A. Definition (definir le theme, redefinir les mots-cles) et B. Choix des elements majeurs refletant le sens general du theme."
      },
      {
        "q": "Un support de communication sert a :",
        "options": [
          "A) Uniquement decorer",
          "B) Conserver, transporter et transmettre une information",
          "C) Coder des programmes",
          "D) Mesurer la luminosite"
        ],
        "reponse": "B",
        "explication": "Le cours definit le support de communication comme tout ce qui sert a conserver, transporter et transmettre une information."
      },
      {
        "q": "Les supports de communication se divisent en deux grands groupes :",
        "options": [
          "A) Numerique et analogique",
          "B) Chaine graphique et edition numerique",
          "C) RVB et CMJN",
          "D) Matriciel et sonore"
        ],
        "reponse": "B",
        "explication": "Le cours distingue les supports lies a la chaine graphique (impression) et ceux lies a l'edition numerique (ecrans/web)."
      },
      {
        "q": "La chaine graphique designe :",
        "options": [
          "A) Une suite d'images animees",
          "B) L'ensemble des professions de la conception a la finalisation d'un produit imprime en multiples exemplaires",
          "C) Un cable reliant l'ordinateur a l'ecran",
          "D) Un mode colorimetrique"
        ],
        "reponse": "B",
        "explication": "La chaine graphique regroupe l'ensemble des professions intervenant de la conception a la finalisation d'un produit graphique imprime en multiples exemplaires."
      },
      {
        "q": "Sur quel format de mesure la chaine graphique s'appuie-t-elle ?",
        "options": [
          "A) Le format A4",
          "B) Le format Letter US",
          "C) Le pouce carre",
          "D) Le pixel"
        ],
        "reponse": "A",
        "explication": "La chaine graphique s'appuie sur un element de mesure de dimension appele format A4 (210 x 297 mm)."
      },
      {
        "q": "Par convention, le format A4 est presente en :",
        "options": [
          "A) Paysage (italien)",
          "B) Portrait (francais)",
          "C) Carre",
          "D) Panoramique"
        ],
        "reponse": "B",
        "explication": "Par convention l'A4 est presente en portrait (presentation a la francaise) ; en usage il peut se presenter en paysage (a l'italienne)."
      },
      {
        "q": "L'edition numerique s'appuie principalement sur :",
        "options": [
          "A) Le grammage du papier",
          "B) Les resolutions ecrans",
          "C) Le format A0",
          "D) Le nombre de calques"
        ],
        "reponse": "B",
        "explication": "Le cours indique que l'edition numerique s'appuie sur les resolutions ecrans."
      },
      {
        "q": "La resolution exprime :",
        "options": [
          "A) Le poids du fichier en octets",
          "B) Le nombre de pixels affichables dans un pouce (2,54 cm)",
          "C) Le nombre de couleurs primaires",
          "D) La taille du disque dur"
        ],
        "reponse": "B",
        "explication": "La resolution est un rapport de densite : elle exprime le nombre de pixels que l'ecran peut afficher dans un pouce (2,54 cm), en dpi/ppp."
      },
      {
        "q": "Le pixel est :",
        "options": [
          "A) Une unite de mesure du son",
          "B) La plus petite unite d'une image matricielle",
          "C) Un format de fichier vectoriel",
          "D) Une couleur du mode CMJN"
        ],
        "reponse": "B",
        "explication": "Le pixel (picture element) est le plus petit element ponctuel composant une image matricielle (bitmap)."
      },
      {
        "q": "Quelle difference entre definition et resolution d'une image ?",
        "options": [
          "A) Aucune, ce sont des synonymes",
          "B) La definition est le nombre total de pixels ; la resolution lie ces pixels a une dimension physique (dpi)",
          "C) La definition concerne le son, la resolution l'image",
          "D) La resolution est le nombre de pixels, la definition le nombre de couleurs"
        ],
        "reponse": "B",
        "explication": "La definition = nombre total de pixels (ex. 1920x1080). La resolution = densite de pixels par pouce reliant l'image a une taille physique."
      },
      {
        "q": "Une image matricielle (bitmap), agrandie au-dela de sa definition :",
        "options": [
          "A) Reste parfaitement nette",
          "B) Se pixellise / perd en nettete",
          "C) Devient vectorielle",
          "D) Change de mode colorimetrique"
        ],
        "reponse": "B",
        "explication": "Une image bitmap depend de la resolution : agrandie, elle se pixellise car ses pixels deviennent visibles. Le vectoriel, lui, ne perd pas en qualite."
      },
      {
        "q": "Quel type d'image est decrit par des equations mathematiques (courbes) ?",
        "options": [
          "A) L'image matricielle",
          "B) L'image vectorielle",
          "C) Le bitmap",
          "D) Le JPEG"
        ],
        "reponse": "B",
        "explication": "L'image vectorielle decrit les formes par des objets mathematiques (courbes de Bezier), d'ou un redimensionnement sans perte de qualite (SVG, AI, EPS)."
      },
      {
        "q": "Le mode colorimetrique adapte a l'affichage sur ecran est :",
        "options": [
          "A) CMJN",
          "B) RVB (additif)",
          "C) Niveaux de gris",
          "D) Bitmap 1 bit"
        ],
        "reponse": "B",
        "explication": "Le RVB (Rouge-Vert-Bleu) est une synthese additive de la lumiere, utilisee par les ecrans. Le CMJN (soustractif) est reserve a l'impression."
      },
      {
        "q": "Le mode CMJN est utilise pour :",
        "options": [
          "A) Les ecrans de smartphone",
          "B) L'impression (synthese soustractive)",
          "C) Le codage audio",
          "D) Les pages web uniquement"
        ],
        "reponse": "B",
        "explication": "Le CMJN (Cyan, Magenta, Jaune, Noir) est une synthese soustractive utilisee en imprimerie ; le N (noir) ameliore densite et economie d'encres."
      },
      {
        "q": "Le modele colorimetrique TSL repose sur :",
        "options": [
          "A) Teinte, Saturation, Luminosite",
          "B) Trois Sources Lumineuses",
          "C) Total des Surfaces Lisses",
          "D) Type, Style, Ligne"
        ],
        "reponse": "A",
        "explication": "Le TSL (HSL en anglais) decrit la couleur par Teinte (angle chromatique), Saturation (purete) et Luminosite : plus intuitif pour la selection humaine."
      },
      {
        "q": "Une profondeur de couleur de 24 bits permet de coder environ :",
        "options": [
          "A) 256 couleurs",
          "B) 65 536 couleurs",
          "C) 16,7 millions de couleurs",
          "D) 2 couleurs"
        ],
        "reponse": "C",
        "explication": "24 bits = 2^24 ~ 16,7 millions de couleurs (true color), soit 8 bits par canal R, V et B."
      },
      {
        "q": "Quel format utilise une compression AVEC perte, ideale pour les photographies ?",
        "options": [
          "A) PNG",
          "B) JPEG",
          "C) TIFF",
          "D) SVG"
        ],
        "reponse": "B",
        "explication": "Le JPEG applique une compression destructive (avec perte) tres efficace sur les photos ; PNG et TIFF sont sans perte, SVG est vectoriel."
      },
      {
        "q": "Quel format gere la transparence et l'animation avec une palette limitee a 256 couleurs ?",
        "options": [
          "A) GIF",
          "B) JPEG",
          "C) PSD",
          "D) TIFF"
        ],
        "reponse": "A",
        "explication": "Le GIF gere 256 couleurs maximum, l'animation et une transparence binaire ; le PNG offre une transparence alpha mais sans animation native."
      },
      {
        "q": "Le format PSD est le format natif de :",
        "options": [
          "A) Adobe Illustrator",
          "B) Adobe Photoshop (gestion des calques)",
          "C) QuarkXPress",
          "D) GIMP"
        ],
        "reponse": "B",
        "explication": "Le PSD (Photoshop Document) est le format natif de Photoshop, conservant calques, masques et reglages d'edition."
      },
      {
        "q": "Parmi les logiciels cites dans le cours, lequel est dedie au dessin vectoriel ?",
        "options": [
          "A) Adobe Photoshop",
          "B) Adobe Illustrator",
          "C) QuarkXPress",
          "D) GIMP"
        ],
        "reponse": "B",
        "explication": "Le cours cite Photoshop (matriciel/retouche), Illustrator (vectoriel) et QuarkXPress (PAO). Illustrator est l'outil de dessin vectoriel."
      },
      {
        "q": "La PAO designe :",
        "options": [
          "A) La Programmation Assistee par Ordinateur",
          "B) La Publication Assistee par Ordinateur",
          "C) La Photographie Analogique Optimisee",
          "D) La Palette Additive d'Origine"
        ],
        "reponse": "B",
        "explication": "La PAO (Publication Assistee par Ordinateur) regroupe les techniques de creation de documents destines a l'impression (mise en page : InDesign, QuarkXPress)."
      },
      {
        "q": "Quelle resolution est generalement recommandee pour une impression de qualite ?",
        "options": [
          "A) 72 dpi",
          "B) 96 dpi",
          "C) 300 dpi",
          "D) 10 dpi"
        ],
        "reponse": "C",
        "explication": "300 dpi est la reference pour l'impression de qualite ; 72 dpi suffit pour l'affichage ecran/web ou la densite de pixels est moindre."
      }
    ],
    "questionsOuvertes": [
      {
        "q": "Definissez l'infographie et expliquez en quoi elle constitue une forme de communication par l'image, en mobilisant les notions de signe, de signifiant et de signifie.",
        "reponseAttendue": "L'infographie est le domaine de la creation d'images numeriques assistee par ordinateur ; le cours la qualifie aussi de communication par l'image. Communiquer par l'image revient a produire un signe : une marque (naturelle ou conventionnelle) qui designe pour quelqu'un un objet ou un concept et est destinee a etre interpretee par un tiers (recepteur). En s'appuyant sur la theorie saussurienne, tout signe est la reunion d'un signifiant (la face materielle : ici, l'image visible, ses formes, couleurs, compositions) et d'un signifie (le concept, la representation mentale que le destinataire doit reconstruire). L'infographiste manipule donc le signifiant visuel pour vehiculer le bon signifie. La difficulte tient a la nature souvent polysemique de l'image (un meme signifiant peut renvoyer a plusieurs signifies, ex. une croix) : le contexte, la legende, la typographie et le choix des elements majeurs servent a reduire l'ambiguite et a fixer le sens vise. Une bonne creation infographique est donc celle qui rend le signifie le plus univoque et fidele a l'intention de communication, ce qui suppose une maitrise a la fois technique (resolution, format, colorimetrie) et semiotique."
      },
      {
        "q": "Decrivez la demarche de conception d'une image a partir d'un theme (de l'analyse a l'avant-projet) en l'illustrant par un exemple concret.",
        "reponseAttendue": "La demarche structuree part d'un theme pour aboutir a un visuel. Etape I - Analyse : (A) Definition, qui consiste a definir le theme et a redefinir les mots-cles issus des differentes definitions (decomposer le theme en concepts, chercher leur sens precis) ; (B) Choix des elements majeurs, ou l'on selectionne les mots ou termes qui refletent le sens general du theme. Etape II - Avant-projet : materialisation caricaturale (esquisse) du projet, dans laquelle on associe a chaque element majeur une ou plusieurs images representatives, afin de prefigurer la composition. Exemple (tire du cours) : pour une affiche de l'Eglise catholique de Nkolanga sur le theme INCULTURATION, l'analyse definit les mots-cles (inculturation = adapter l'annonce de l'Evangile a une culture donnee, chretien, missiologie, Evangile = Bonne nouvelle, culture, rites, coutumes, initiation). On choisit ensuite les elements majeurs (la croix/Bible pour la foi chretienne ; le tam-tam, les balafons, la danse, les masques pour la culture locale et l'initiation). L'avant-projet associe ces elements : par exemple une croix integree a des motifs traditionnels camerounais, des personnages en tenue locale autour d'une Bible, etc. On obtient une esquisse qui fusionne foi chretienne et culture africaine, traduisant visuellement l'inculturation avant la realisation finale."
      },
      {
        "q": "Comparez la chaine graphique et l'edition numerique : definition, finalite, unite de mesure de reference et exemples de supports.",
        "reponseAttendue": "La chaine graphique est l'ensemble des professions qui interviennent de la conception a la finalisation d'un produit graphique destine a etre produit en de multiples exemplaires par un procede d'impression. Sa finalite est l'imprime ; elle s'appuie sur une unite de mesure de dimension, le format A4 (210 x 297 mm), presente par convention en portrait (a la francaise) ou en paysage (a l'italienne), avec ses multiples (A3, A2, A1, A0) et sous-multiples (A5, A6...). Exemples de supports : affiches, prospectus, brochures, depliants, flyers, banderoles, panneaux publicitaires, roll-up, serigraphie, carterie. Sur le plan technique, elle exige le mode CMJN et une haute resolution (300 dpi). L'edition numerique est l'ensemble des pratiques permettant la production, la mise en forme, la circulation et la legitimation d'un contenu dans un environnement numerique (livre numerique, site web, autres documents numeriques). Sa finalite est l'ecran ; elle s'appuie sur les resolutions ecrans, la resolution etant un rapport de densite exprimant le nombre de pixels affichables dans un pouce (2,54 cm). Exemples de supports : pages web, banniere, diaporamas partages, mails/newsletters, images et videos partagees, affichage numerique, presse et publicite en ligne. Techniquement, elle privilegie le mode RVB et des resolutions plus basses (souvent 72 dpi). En resume : chaine graphique = imprime, A4, CMJN, 300 dpi ; edition numerique = ecran/web, resolution ecran, RVB."
      },
      {
        "q": "Expliquez la difference entre image matricielle (bitmap) et image vectorielle. Donnez leurs principes, avantages, inconvenients, formats associes et cas d'usage recommandes.",
        "reponseAttendue": "Image matricielle (bitmap) : elle est constituee d'une grille de pixels, chaque pixel ayant une couleur codee selon une profondeur de couleur (ex. 24 bits = ~16,7 millions de couleurs). Caracterisee par sa definition (nombre total de pixels) et sa resolution (pixels par pouce). Avantages : rendu photorealiste, nuances et degrades fins, ideale pour les photographies. Inconvenients : dependante de la resolution, donc elle se pixellise (perte de nettete) a l'agrandissement, et les fichiers haute resolution sont lourds. Formats : JPEG (compression avec perte, photos), PNG (sans perte, transparence alpha), GIF (256 couleurs, animation, transparence binaire), TIFF (sans perte, pro/impression), PSD (natif Photoshop, calques). Logiciels : Photoshop, GIMP. Image vectorielle : elle decrit les formes par des objets mathematiques (points, droites, courbes de Bezier) plutot que par des pixels. Avantages : redimensionnable a l'infini sans perte de qualite, fichiers legers, edition par objets, ideale pour logos, pictogrammes, typographie, illustrations a aplats. Inconvenients : peu adaptee aux images photorealistes et aux degrades complexes. Formats : SVG, AI (Illustrator), EPS. Logiciels : Illustrator, Inkscape. Cas d'usage : on choisit le matriciel pour les photos et retouches, le vectoriel pour les logos et tout element destine a etre redimensionne (signaletique, grands formats). Un projet professionnel combine souvent les deux (logo vectoriel place sur une photo matricielle)."
      },
      {
        "q": "Presentez les modes colorimetriques RVB, CMJN et TSL ainsi que la notion de profondeur de couleur, en precisant pour chaque mode son principe et son contexte d'utilisation.",
        "reponseAttendue": "La profondeur de couleur est le nombre de bits utilises pour coder la couleur de chaque pixel : 1 bit code 2 couleurs (noir/blanc), 8 bits 256 couleurs (palette indexee ou niveaux de gris), 24 bits ~16,7 millions de couleurs (true color, 8 bits par canal). Plus la profondeur est elevee, plus la palette et la finesse des degrades sont grandes, mais plus le fichier est lourd. RVB (Rouge-Vert-Bleu) : synthese additive de la lumiere ; on additionne des faisceaux lumineux colores, l'addition des trois primaires a intensite maximale donne du blanc, leur absence du noir. C'est le mode des ecrans (moniteurs, smartphones, projecteurs) et donc de l'edition numerique / du web. CMJN (Cyan-Magenta-Jaune-Noir) : synthese soustractive ; sur un support blanc, les encres absorbent (soustraient) une partie de la lumiere, la superposition des primaires tendant vers le noir (le N, noir veritable, est ajoute pour la densite, la nettete des textes et l'economie d'encres). C'est le mode de l'imprimerie / de la chaine graphique. TSL (Teinte-Saturation-Luminosite, HSL/TSV en variante) : modele percu, plus intuitif pour l'humain ; la Teinte est l'angle sur la roue chromatique (la couleur pure), la Saturation la purete/intensite de la couleur, la Luminosite la quantite de clarte. Il ne sert pas a l'affichage final mais facilite la selection et l'ajustement des couleurs dans les logiciels. En pratique, on travaille en RVB pour un livrable ecran, on convertit en CMJN avant impression (en anticipant les ecarts de gamut), et on utilise le selecteur TSL pour choisir/regler les teintes."
      }
    ]
  }
];
