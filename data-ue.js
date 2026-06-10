// Unites d'enseignement (UE) + matieres des rattrapages SN1/SN2.
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
    "placeholder": false,
    "resume": [
      {
        "titre": "SIAD : definition",
        "contenu": "Un Systeme d'Information d'Aide a la Decision (SIAD / DSS) est un systeme interactif assistant le decideur dans des problemes semi-structures, en combinant donnees, modeles et interface. Il ne remplace pas le decideur mais l'eclaire."
      },
      {
        "titre": "Modele de rationalite economique",
        "contenu": "Ce modele suppose un decideur parfaitement rationnel disposant d'informations completes, de preferences stables et capable de maximiser son utilite. Il s'oppose a la rationalite limitee (Simon) ou information et capacite cognitive sont bornees."
      },
      {
        "titre": "Types de decisions",
        "contenu": "On distingue les decisions structurees (programmables, automatisables), semi-structurees (cible des SIAD) et non structurees (strategiques, jugement humain). On les classe aussi en strategiques, tactiques et operationnelles selon l'horizon."
      },
      {
        "titre": "Loi de Pareto (80/20)",
        "contenu": "Loi statistique selon laquelle environ 80 % des effets proviennent de 20 % des causes. Elle aide a prioriser : on concentre l'effort sur le petit nombre de causes (les 20 %) responsables de la majorite des consequences."
      },
      {
        "titre": "Diagramme de Pareto",
        "contenu": "Representation par un histogramme decroissant des causes complete d'une courbe cumulative des pourcentages. Il visualise les causes dominantes (les `vital few`) a traiter en priorite par rapport aux `trivial many`."
      },
      {
        "titre": "Matrice d'Eisenhower",
        "contenu": "Outil de gestion du temps croisant deux axes (Important / Non important) x (Urgent / Non urgent), donnant 4 quadrants : Faire, Planifier, Deleguer, Eliminer. Elle hierarchise les taches pour reduire la procrastination."
      },
      {
        "titre": "Diagramme d'Ishikawa (causes-effets)",
        "contenu": "Aussi appele diagramme en arete de poisson, il organise les causes d'un probleme par familles (souvent les 5M : Main-d'oeuvre, Methode, Materiel, Matiere, Milieu). Combine a Pareto, il approfondit l'analyse des causes racines."
      },
      {
        "titre": "Matrice de decision (tableau multicritere)",
        "contenu": "Tableau croisant alternatives (lignes) et criteres (colonnes). Chaque critere recoit un poids, chaque alternative un score par critere ; le score pondere total designe la meilleure option. Methode d'aide a la decision multicritere."
      },
      {
        "titre": "Methode AHP",
        "contenu": "L'Analytic Hierarchy Process (Saaty) pondere les criteres par comparaisons par paires sur une echelle 1-9, structurees en hierarchie. Elle calcule des priorites via les vecteurs propres et controle la coherence (ratio de coherence)."
      },
      {
        "titre": "Normalisation des scores",
        "contenu": "Pour comparer des criteres d'echelles differentes, on convertit les scores en valeurs comprises entre 0 et 1 (ex. min-max). Cela rend les criteres homogenes avant ponderation et agregation dans la matrice de decision."
      },
      {
        "titre": "Analyse SWOT",
        "contenu": "Outil strategique recensant Forces, Faiblesses (interne), Opportunites et Menaces (externe). Il aide au diagnostic prealable a la decision strategique en croisant capacites internes et environnement."
      },
      {
        "titre": "Analyse PESTEL",
        "contenu": "Cadre d'analyse de l'environnement macro selon 6 dimensions : Politique, Economique, Sociologique, Technologique, Ecologique, Legal. Il identifie les facteurs externes influencant la decision strategique."
      },
      {
        "titre": "Diagramme de Gantt",
        "contenu": "Outil de planification de projet representant les taches en barres horizontales le long d'un axe temporel, montrant durees, jalons et dependances. Il sert au pilotage et au suivi, non a la ponderation de criteres."
      },
      {
        "titre": "Process de prise de decision",
        "contenu": "Le modele de Simon decrit 3 a 4 phases : Intelligence (identifier le probleme), Design/Conception (generer les alternatives), Choix (selectionner via criteres) et Implementation/Controle (executer et evaluer)."
      }
    ],
    "qcm": [
      {
        "q": "Le modele de rationalite economique suppose que :",
        "options": [
          "A) Les decideurs ont des informations parfaites et completes",
          "B) Les decisions sont prises sur la base de l'instinct",
          "C) Les emotions jouent un role crucial dans la prise de decision",
          "D) Les contraintes de ressources sont ignorees"
        ],
        "reponse": "A",
        "explication": "La rationalite economique postule un decideur disposant d'une information parfaite et complete et maximisant son utilite, par opposition a la rationalite limitee de Simon."
      },
      {
        "q": "Quelle est la definition de la loi de Pareto ?",
        "options": [
          "A) Une loi statistique qui indique que 80 % des effets proviennent de 20 % des causes",
          "B) Une regle qui conseille de maintenir 20 % des causes en reserve sur les 80 %",
          "C) Une loi economique stipulant que 80 % des revenus sont generes par 20 % de la population",
          "D) Une theorie mathematique sur la repartition des nombres premiers"
        ],
        "reponse": "A",
        "explication": "La loi de Pareto (principe 80/20) enonce qu'environ 80 % des effets proviennent de 20 % des causes ; les autres formulations sont des cas particuliers ou des erreurs."
      },
      {
        "q": "Quels sont les quatre quadrants de la matrice d'Eisenhower ?",
        "options": [
          "A) Important-Urgent, Important-Non Urgent, Non Important-Urgent, Non Important-Non Urgent",
          "B) Important-Non Important, Urgent-Non Urgent, Important-Urgent, Non Important-Non Urgent",
          "C) Critique-Non Critique, Immediat-Non Immediat, Important-Non Important, Urgent-Non Urgent",
          "D) Important-Critique, Non Important-Non Critique, Urgent-Non Urgent, Important-Non Urgent"
        ],
        "reponse": "A",
        "explication": "La matrice croise les axes Importance et Urgence, donnant les 4 quadrants Important-Urgent, Important-Non Urgent, Non Important-Urgent et Non Important-Non Urgent."
      },
      {
        "q": "Quelle technique peut etre combinee avec la loi de Pareto pour une analyse plus approfondie des causes principales des problemes ?",
        "options": [
          "A) Analyse SWOT",
          "B) Analyse de regression",
          "C) Diagramme d'Ishikawa (causes et effets)",
          "D) Analyse PESTEL"
        ],
        "reponse": "C",
        "explication": "Le diagramme d'Ishikawa (arete de poisson) detaille les familles de causes ; couple a Pareto qui hierarchise, il approfondit l'analyse des causes racines."
      },
      {
        "q": "Comment la matrice d'Eisenhower aide-t-elle a ameliorer la gestion du temps ?",
        "options": [
          "A) En augmentant le nombre de taches a accomplir",
          "B) En se concentrant sur les taches non urgentes",
          "C) En reduisant la procrastination en hierarchisant les taches importantes et urgentes",
          "D) En divisant les taches en segments de 5 minutes"
        ],
        "reponse": "C",
        "explication": "En classant les taches selon importance et urgence, la matrice fait prioriser l'essentiel et reduit la procrastination."
      },
      {
        "q": "Dans une matrice de decision, comment les alternatives sont-elles generalement evaluees ?",
        "options": [
          "A) Par un vote des employes",
          "B) En attribuant des poids et des scores a chaque critere pour chaque alternative",
          "C) En utilisant un algorithme de tri rapide",
          "D) En suivant l'opinion du decideur principal sans structure formelle"
        ],
        "reponse": "B",
        "explication": "La matrice de decision pondere chaque critere et note chaque alternative ; le score pondere agrege departage les options."
      },
      {
        "q": "Quelle methode est couramment utilisee pour ponderer les criteres dans une matrice de decision ?",
        "options": [
          "A) Analyse de regression",
          "B) Methode de la hierarchie analytique (AHP)",
          "C) Analyse de variance",
          "D) Diagramme de Gantt"
        ],
        "reponse": "B",
        "explication": "L'AHP de Saaty pondere les criteres par comparaisons par paires sur une echelle 1-9 et controle la coherence des jugements."
      },
      {
        "q": "Quelle technique peut etre utilisee pour normaliser les scores dans une matrice de decision ?",
        "options": [
          "A) Multiplication des scores par un facteur constant",
          "B) Conversion des scores en valeurs comprises entre 0 et 1",
          "C) Utilisation de l'algorithme de tri rapide",
          "D) Chiffrement des donnees"
        ],
        "reponse": "B",
        "explication": "La normalisation ramene les scores a une echelle commune (ex. entre 0 et 1) pour rendre comparables des criteres d'unites differentes."
      },
      {
        "q": "Laquelle des affirmations suivantes est une application correcte de la loi de Pareto dans le domaine des affaires ?",
        "options": [
          "A) 80 % des produits d'une entreprise representent 20 % des ventes",
          "B) 80 % des ventes proviennent de 20 % des clients",
          "C) 20 % des employes sont responsables de 80 % des problemes",
          "D) 80 % des couts sont dus a 20 % des fournisseurs"
        ],
        "reponse": "B",
        "explication": "L'application classique du 80/20 : une minorite (20 %) de clients genere la majorite (80 %) du chiffre d'affaires. Les options B, C et D illustrent toutes le principe, mais B en est l'exemple commercial canonique."
      },
      {
        "q": "Quel est un potentiel inconvenient de l'application stricte de la loi de Pareto ?",
        "options": [
          "A) Cela peut entrainer une surcharge de travail pour les employes",
          "B) Cela peut conduire a une negligence des problemes moins frequents mais critiques",
          "C) Cela peut augmenter les couts de production",
          "D) Cela peut reduire la qualite des produits"
        ],
        "reponse": "B",
        "explication": "En ne ciblant que les 20 % dominants, on risque d'ignorer des problemes rares mais a fort impact (ex. risques critiques)."
      },
      {
        "q": "Que designe la rationalite limitee de Herbert Simon ?",
        "options": [
          "A) Un decideur omniscient maximisant parfaitement son utilite",
          "B) Un decideur dont l'information, le temps et les capacites cognitives sont bornes et qui se contente d'une solution satisfaisante",
          "C) Une absence totale de logique dans la decision",
          "D) Une decision prise uniquement par algorithme"
        ],
        "reponse": "B",
        "explication": "Simon montre que le decideur reel, limite en information et cognition, vise le 'satisficing' (solution satisfaisante) plutot que l'optimum."
      },
      {
        "q": "Quelle phase NE fait PAS partie du modele de decision de Simon ?",
        "options": [
          "A) Intelligence (identification du probleme)",
          "B) Conception (generation des alternatives)",
          "C) Choix (selection d'une alternative)",
          "D) Facturation (emission des factures)"
        ],
        "reponse": "D",
        "explication": "Le modele de Simon comprend Intelligence, Conception (Design), Choix et Implementation/Controle ; la facturation n'en fait pas partie."
      },
      {
        "q": "Quel type de decision un SIAD cible-t-il en priorite ?",
        "options": [
          "A) Les decisions totalement structurees et automatisables",
          "B) Les decisions semi-structurees",
          "C) Les decisions purement aleatoires",
          "D) Aucune decision"
        ],
        "reponse": "B",
        "explication": "Les SIAD assistent surtout les problemes semi-structures, ou modeles et donnees aident sans remplacer le jugement humain."
      },
      {
        "q": "Dans la matrice d'Eisenhower, que faire d'une tache Importante mais Non Urgente ?",
        "options": [
          "A) La faire immediatement",
          "B) La planifier",
          "C) La deleguer",
          "D) L'eliminer"
        ],
        "reponse": "B",
        "explication": "Important-Non Urgent correspond a la planification : ces taches a forte valeur doivent etre programmees avant de devenir urgentes."
      },
      {
        "q": "Dans la matrice d'Eisenhower, que faire d'une tache Non Importante mais Urgente ?",
        "options": [
          "A) La faire soi-meme en priorite absolue",
          "B) La deleguer",
          "C) La planifier a long terme",
          "D) L'ignorer definitivement"
        ],
        "reponse": "B",
        "explication": "Non Important-Urgent se delegue : la tache presse mais n'apporte pas de valeur propre au decideur."
      },
      {
        "q": "Sur quelle echelle l'AHP compare-t-elle les criteres par paires ?",
        "options": [
          "A) Une echelle de 1 a 9",
          "B) Une echelle de 0 a 1",
          "C) Une echelle binaire 0/1",
          "D) Une echelle de -10 a +10"
        ],
        "reponse": "A",
        "explication": "Saaty utilise une echelle de jugement de 1 (importance egale) a 9 (importance extreme) pour les comparaisons par paires."
      },
      {
        "q": "Que mesure le ratio de coherence (CR) dans l'AHP ?",
        "options": [
          "A) La rentabilite du projet",
          "B) La coherence des jugements de comparaison par paires",
          "C) La duree des taches",
          "D) Le cout total des alternatives"
        ],
        "reponse": "B",
        "explication": "Le CR verifie que les jugements ne sont pas contradictoires ; un CR <= 0,10 est generalement juge acceptable."
      },
      {
        "q": "L'analyse SWOT distingue des facteurs :",
        "options": [
          "A) Uniquement financiers",
          "B) Internes (Forces, Faiblesses) et externes (Opportunites, Menaces)",
          "C) Uniquement temporels",
          "D) Uniquement reglementaires"
        ],
        "reponse": "B",
        "explication": "SWOT croise le diagnostic interne (Forces/Faiblesses) et l'analyse externe (Opportunites/Menaces)."
      },
      {
        "q": "Que recouvre l'acronyme PESTEL ?",
        "options": [
          "A) Politique, Economique, Sociologique, Technologique, Ecologique, Legal",
          "B) Produit, Echange, Service, Technique, Energie, Logistique",
          "C) Prix, Etude, Strategie, Tactique, Evaluation, Logique",
          "D) Personne, Equipe, Systeme, Technologie, Environnement, Loi"
        ],
        "reponse": "A",
        "explication": "PESTEL analyse l'environnement macro : Politique, Economique, Sociologique, Technologique, Ecologique et Legal."
      },
      {
        "q": "A quoi sert principalement un diagramme de Gantt ?",
        "options": [
          "A) A ponderer des criteres de decision",
          "B) A planifier et suivre l'ordonnancement des taches d'un projet dans le temps",
          "C) A normaliser des scores entre 0 et 1",
          "D) A analyser les causes racines d'un probleme"
        ],
        "reponse": "B",
        "explication": "Le Gantt visualise les taches, durees et dependances sur un axe temporel pour planifier et piloter un projet."
      },
      {
        "q": "Dans un diagramme de Pareto, comment sont ordonnees les categories de causes ?",
        "options": [
          "A) Par ordre alphabetique",
          "B) Par frequence/impact decroissant avec une courbe cumulative",
          "C) De maniere aleatoire",
          "D) Par ordre chronologique d'apparition"
        ],
        "reponse": "B",
        "explication": "Le diagramme de Pareto classe les causes par frequence decroissante et superpose une courbe des pourcentages cumules."
      },
      {
        "q": "Le diagramme d'Ishikawa est aussi appele :",
        "options": [
          "A) Diagramme en arete de poisson",
          "B) Diagramme de Gantt",
          "C) Diagramme de flux",
          "D) Diagramme de Venn"
        ],
        "reponse": "A",
        "explication": "Sa forme en arete de poisson lui vaut ce surnom ; il organise les causes par familles (souvent les 5M)."
      },
      {
        "q": "Que represente la regle des 5M dans le diagramme d'Ishikawa ?",
        "options": [
          "A) Cinq mois de planning",
          "B) Main-d'oeuvre, Methode, Materiel, Matiere, Milieu",
          "C) Cinq metriques financieres",
          "D) Cinq managers responsables"
        ],
        "reponse": "B",
        "explication": "Les 5M regroupent les familles de causes : Main-d'oeuvre, Methode, Materiel, Matiere (matieres premieres) et Milieu (environnement)."
      },
      {
        "q": "Quel bareme s'applique a la partie QCM de l'epreuve de SIAD (rattrapage 2025) ?",
        "options": [
          "A) Bonne reponse 1 pt, fausse 0 pt, pas de reponse 0 pt",
          "B) Bonne reponse 0,5 pt, fausse -0,5 pt, pas de reponse 0 pt",
          "C) Bonne reponse 0,5 pt, fausse 0 pt, pas de reponse -0,5 pt",
          "D) Bonne reponse 2 pts, fausse -1 pt, pas de reponse 0 pt"
        ],
        "reponse": "B",
        "explication": "L'enonce precise : bonne reponse 0,5 pt, fausse reponse -0,5 pt, pas de reponse 0 pt (penalisation des erreurs)."
      },
      {
        "q": "Pourquoi normaliser les scores avant l'agregation dans une matrice de decision multicritere ?",
        "options": [
          "A) Pour chiffrer les donnees et les securiser",
          "B) Pour rendre comparables des criteres exprimes dans des unites et echelles differentes",
          "C) Pour augmenter artificiellement le nombre de criteres",
          "D) Pour supprimer les poids des criteres"
        ],
        "reponse": "B",
        "explication": "Sans normalisation, des criteres d'echelles heterogenes (ex. prix en FCFA vs note sur 10) fausseraient l'agregation ponderee."
      },
      {
        "q": "Quelle affirmation caracterise le mieux un SIAD par rapport a un systeme transactionnel ?",
        "options": [
          "A) Il automatise entierement la decision sans intervention humaine",
          "B) Il fournit donnees, modeles et analyses pour eclairer le decideur, qui garde le choix final",
          "C) Il sert uniquement a enregistrer les operations courantes",
          "D) Il remplace le decideur par un vote collectif"
        ],
        "reponse": "B",
        "explication": "Un SIAD est un outil d'aide : il appuie le decideur par des modeles et analyses sans se substituer a son jugement, contrairement a un systeme transactionnel qui traite les operations."
      }
    ],
    "questionsOuvertes": [
      {
        "q": "Presentez le schema de la matrice d'Eisenhower et expliquez l'action recommandee pour chacun des quatre quadrants (sujet de la Partie 2 de l'epreuve).",
        "reponseAttendue": "La matrice d'Eisenhower est un tableau 2x2 croisant deux axes : l'axe de l'IMPORTANCE (Important / Non important) et l'axe de l'URGENCE (Urgent / Non urgent). On obtient quatre quadrants :\n\n1) Important ET Urgent -> FAIRE immediatement soi-meme (crises, echeances imminentes, problemes critiques).\n2) Important ET Non urgent -> PLANIFIER (prevention, planification strategique, formation, taches a forte valeur a programmer pour ne pas qu'elles deviennent urgentes).\n3) Non important ET Urgent -> DELEGUER (interruptions, certains mails ou appels : la tache presse mais n'apporte pas de valeur propre, on la confie a un tiers).\n4) Non important ET Non urgent -> ELIMINER / abandonner (distractions, activites chronophages sans valeur).\n\nSchema (representation) :\n                  URGENT            NON URGENT\nIMPORTANT      | 1. FAIRE        | 2. PLANIFIER  |\nNON IMPORTANT  | 3. DELEGUER     | 4. ELIMINER   |\n\nInteret : la matrice ameliore la gestion du temps en faisant hierarchiser les taches selon importance et urgence, ce qui reduit la procrastination et concentre l'energie sur ce qui cree de la valeur (quadrants 1 et surtout 2)."
      },
      {
        "q": "Donnez un exemple concret pour chacun des quatre cadrans de la matrice d'Eisenhower (sujet de la Partie 2 de l'epreuve).",
        "reponseAttendue": "Exemples (un par cadran) :\n\n- Important / Urgent (FAIRE) : repondre a une panne serveur en production qui bloque les clients ; rendre un rapport de projet du a la fin de la journee ; gerer un incident de securite.\n\n- Important / Non urgent (PLANIFIER) : preparer la revision d'un examen prevu dans trois semaines ; mettre en place une politique de sauvegarde des donnees ; suivre une formation pour monter en competence.\n\n- Non important / Urgent (DELEGUER) : repondre a certains courriels ou appels qui pressent mais peuvent etre traites par un collegue ; organiser une reunion logistique qu'un assistant peut prendre en charge.\n\n- Non important / Non urgent (ELIMINER) : consulter les reseaux sociaux sans objectif ; assister a une reunion sans ordre du jour ni enjeu ; trier des e-mails publicitaires inutiles.\n\nLa coherence des exemples avec les deux axes (valeur + delai) est l'element evalue."
      },
      {
        "q": "Expliquez la loi de Pareto (principe 80/20), illustrez-la par un exemple en gestion d'entreprise et indiquez une limite de son application stricte.",
        "reponseAttendue": "Definition : la loi de Pareto, ou principe 80/20, est une loi statistique selon laquelle environ 80 % des effets proviennent de 20 % des causes. Elle invite a concentrer l'effort sur la minorite de causes (les 'vital few', 20 %) responsable de la majeure partie des resultats, plutot que de disperser l'effort sur la multitude de causes secondaires ('trivial many').\n\nExemple en entreprise : 80 % du chiffre d'affaires est souvent realise par 20 % des clients ; on priorise donc la fidelisation de ces clients cles. Autres applications : 80 % des reclamations proviennent de 20 % des produits ; 80 % des retards de projet sont dus a 20 % des taches.\n\nOutils associes : le diagramme de Pareto (histogramme decroissant + courbe cumulative) visualise les causes dominantes ; couple au diagramme d'Ishikawa, il approfondit l'analyse des causes racines.\n\nLimite : une application strictement mecanique peut conduire a negliger des problemes peu frequents mais critiques (les 80 % de causes restantes peuvent inclure un risque rare a impact majeur, ex. defaillance de securite). Le ratio 80/20 n'est par ailleurs qu'une approximation, variable selon les contextes."
      },
      {
        "q": "Decrivez la demarche de construction d'une matrice de decision multicritere : structure du tableau, ponderation des criteres (role de l'AHP), normalisation des scores et choix final.",
        "reponseAttendue": "1) Structure : une matrice de decision est un tableau croisant les ALTERNATIVES (en lignes) et les CRITERES d'evaluation (en colonnes). Chaque cellule contient le score d'une alternative sur un critere.\n\n2) Definition et ponderation des criteres : on identifie les criteres pertinents puis on leur attribue des POIDS refletant leur importance relative. Une methode rigoureuse est l'AHP (Analytic Hierarchy Process) de Saaty : on compare les criteres deux a deux sur une echelle de 1 a 9, on en deduit les priorites (vecteur propre), et on controle la coherence des jugements via le ratio de coherence (CR <= 0,10 acceptable).\n\n3) Notation et normalisation : chaque alternative est notee sur chaque critere. Comme les criteres ont des unites et echelles differentes, on NORMALISE les scores, par exemple en les ramenant a une valeur comprise entre 0 et 1 (normalisation min-max), afin de les rendre comparables.\n\n4) Agregation et choix : on calcule pour chaque alternative un SCORE PONDERE total = somme (poids du critere x score normalise). L'alternative au score agrege le plus eleve est retenue.\n\n5) Analyse de sensibilite : on peut faire varier les poids pour verifier la robustesse du classement.\n\nCette demarche structure et objective la decision multicritere, par opposition a un choix fonde sur la seule intuition du decideur."
      },
      {
        "q": "Qu'est-ce qu'un Systeme d'Information d'Aide a la Decision (SIAD) ? Situez-le par rapport au modele de rationalite economique et a la rationalite limitee de Simon, et decrivez les phases du processus de decision.",
        "reponseAttendue": "Definition : un SIAD (Decision Support System) est un systeme d'information interactif qui assiste le decideur face a des problemes semi-structures, en combinant des donnees, des modeles d'analyse et une interface conviviale. Son but est d'eclairer la decision, non de la remplacer : le jugement final reste humain.\n\nRationalite economique vs rationalite limitee : le modele de rationalite economique suppose un decideur ideal disposant d'une information parfaite et complete, de preferences stables, et capable de maximiser son utilite. La realite releve plutot de la RATIONALITE LIMITEE (Herbert Simon) : l'information, le temps et les capacites cognitives sont bornes, si bien que le decideur se contente d'une solution SATISFAISANTE ('satisficing') plutot que de l'optimum theorique. Le SIAD vient precisement compenser ces limites en fournissant donnees et modeles.\n\nPhases du processus de decision (modele de Simon) :\n- Intelligence : detecter et formuler le probleme, collecter l'information.\n- Conception (Design) : generer et modeliser les alternatives possibles.\n- Choix : evaluer les alternatives selon des criteres (ex. matrice de decision, AHP) et selectionner la meilleure.\n- Implementation / Controle : mettre en oeuvre la decision puis en evaluer les resultats (boucle de retroaction).\n\nLe SIAD intervient a chaque phase : acces aux donnees (Intelligence), modelisation (Conception), simulation et comparaison d'alternatives (Choix), suivi par tableaux de bord (Controle)."
      }
    ]
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
    "placeholder": false,
    "resume": [
      {
        "titre": "Instance Oracle",
        "contenu": "Une instance Oracle est l'ensemble des structures mémoire (la SGA) et des processus d'arrière-plan (DBWR, LGWR, SMON, PMON, CKPT...) qui s'exécutent en RAM. Elle est distincte de la base de données (les fichiers sur disque) : une instance pilote une base, et c'est le couple instance + base qui forme un serveur Oracle opérationnel."
      },
      {
        "titre": "SGA (System Global Area)",
        "contenu": "La SGA est une zone mémoire partagée par tous les processus de l'instance, allouée au démarrage. Ses composants principaux sont le `Database Buffer Cache` (blocs de données), le `Shared Pool` (Library Cache + Data Dictionary Cache) et le `Redo Log Buffer` (vecteurs de reprise avant écriture dans les redo logs)."
      },
      {
        "titre": "PGA (Program Global Area)",
        "contenu": "La PGA est une zone mémoire privée, propre à chaque processus serveur/utilisateur, non partagée. Elle contient la zone de tri, les informations de session et l'état du curseur. Sa taille n'a aucun lien avec les arguments INITIAL/NEXT/MINEXTENTS de CREATE TABLESPACE qui concernent l'allocation disque des extents."
      },
      {
        "titre": "Processus d'arriere-plan",
        "contenu": "Ce sont les processus système de l'instance : `DBWR` (écrit les blocs modifiés du buffer cache vers les datafiles), `LGWR` (écrit le redo log buffer vers les fichiers redo), `SMON` (reprise d'instance, défragmentation), `PMON` (nettoie les processus utilisateur défaillants, libère les ressources) et `CKPT` (déclenche les points de reprise / checkpoints)."
      },
      {
        "titre": "DBWR et LGWR",
        "contenu": "`DBWR` (Database Writer) écrit asynchroniquement les blocs sales (dirty buffers) du Database Buffer Cache vers les datafiles. `LGWR` (Log Writer) écrit séquentiellement le contenu du Redo Log Buffer dans les fichiers redo log à chaque COMMIT, à chaque remplissage du tiers du buffer ou toutes les 3 secondes (write-ahead logging)."
      },
      {
        "titre": "SMON, PMON et CKPT",
        "contenu": "`SMON` effectue la récupération automatique de l'instance au redémarrage (instance recovery) et coalesce les espaces libres. `PMON` détecte et nettoie les processus utilisateur morts (rollback, libération de verrous). `CKPT` met à jour les en-têtes des datafiles et le fichier de contrôle lors d'un checkpoint pour synchroniser SGA et disque."
      },
      {
        "titre": "Fichiers de la base de donnees",
        "contenu": "Une base Oracle repose sur trois types de fichiers physiques : les `datafiles` (données et index réels), les `control files` (métadonnées sur la structure de la base : noms/emplacements des fichiers, SCN, informations RMAN) et les `redo log files` (journalisation de toutes les modifications, indispensables à la reprise)."
      },
      {
        "titre": "Tablespaces et segments",
        "contenu": "Un `tablespace` est une unité logique de stockage qui regroupe un ou plusieurs datafiles. Le tablespace `SYSTEM` contient obligatoirement le dictionnaire de données (data dictionary) et ne peut être supprimé. La hiérarchie logique est : tablespace → segment (table, index) → extent (extent) → bloc Oracle (plus petite unité d'E/S)."
      },
      {
        "titre": "Demarrage de l'instance (NOMOUNT / MOUNT / OPEN)",
        "contenu": "Le démarrage suit trois phases : `STARTUP NOMOUNT` lit le fichier de paramètres et alloue la SGA + démarre les processus (instance seule) ; `MOUNT` lit le fichier de contrôle et associe la base ; `OPEN` ouvre les datafiles et redo logs, rendant la base accessible aux utilisateurs. `SHUTDOWN` parcourt l'inverse."
      },
      {
        "titre": "Mode ARCHIVELOG et RMAN",
        "contenu": "En mode `ARCHIVELOG`, le processus ARCn archive chaque redo log rempli avant réécriture, permettant la récupération jusqu'à un instant précis (point-in-time recovery). `RMAN` (Recovery Manager) est l'outil Oracle de sauvegarde/restauration : sauvegardes complètes, incrémentielles, validation des blocs et catalogue de récupération."
      },
      {
        "titre": "PL/SQL",
        "contenu": "`PL/SQL` est l'extension procédurale d'Oracle au langage SQL : il ajoute variables, structures de contrôle (IF, LOOP), curseurs, gestion d'exceptions et blocs nommés. Un bloc se structure en sections `DECLARE` / `BEGIN` / `EXCEPTION` / `END;` et permet d'écrire procédures stockées, fonctions, packages et triggers exécutés côté serveur."
      },
      {
        "titre": "Utilisateurs, privileges et roles",
        "contenu": "Oracle gère la sécurité via des `utilisateurs` (schémas), des `privilèges` système (CREATE SESSION, CREATE TABLE) ou objet (SELECT, UPDATE sur une table), accordés par `GRANT` et retirés par `REVOKE`. Un `rôle` regroupe un ensemble de privilèges pour les attribuer en bloc (ex. rôles prédéfinis CONNECT, RESOURCE, DBA)."
      },
      {
        "titre": "SQL*Plus et outils d'administration",
        "contenu": "`SQL*Plus` est l'interface ligne de commande historique pour se connecter à Oracle et exécuter SQL/PL/SQL. Les principaux outils d'administration sont `Oracle Enterprise Manager` (OEM, console graphique), `SQL Developer` (IDE graphique) et `SQL*Plus`. C'est par SQL*Plus connecté SYSDBA qu'on lance STARTUP/SHUTDOWN."
      },
      {
        "titre": "Operateurs d'ensemble",
        "contenu": "Les opérateurs d'ensemble combinent les résultats de deux requêtes SELECT compatibles en projection : `UNION` (fusion sans doublons), `UNION ALL` (fusion avec doublons), `INTERSECT` (lignes communes aux deux ensembles) et `MINUS` (lignes du premier absent du second). Ils exigent le même nombre de colonnes et des types compatibles."
      },
      {
        "titre": "GROUP BY, ROLLUP et CUBE",
        "contenu": "`GROUP BY` regroupe les lignes pour appliquer des fonctions d'agrégation. `ROLLUP(a,b)` produit en plus des sous-totaux hiérarchiques et un total général (agrégation en cascade de droite à gauche). `CUBE(a,b)` génère tous les sous-totaux de toutes les combinaisons possibles de colonnes, donnant un tableau croisé multidimensionnel complet."
      }
    ],
    "qcm": [
      {
        "q": "Quel processus d'arriere-plan effectue les taches de nettoyage (recuperation d'instance, coalescence des espaces libres) au niveau d'une instance Oracle ?",
        "options": [
          "A) CKPT",
          "B) LGWR",
          "C) SMON",
          "D) DBWR"
        ],
        "reponse": "C",
        "explication": "SMON (System Monitor) assure la recuperation automatique de l'instance et le nettoyage/coalescence des extents libres."
      },
      {
        "q": "Quel processus libere les ressources et nettoie les processus utilisateur defaillants ?",
        "options": [
          "A) DBWR",
          "B) PMON",
          "C) LGWR",
          "D) ARCn"
        ],
        "reponse": "B",
        "explication": "PMON (Process Monitor) detecte les processus utilisateur morts, effectue le rollback et libere verrous et ressources."
      },
      {
        "q": "Parmi ces outils, lesquels servent a administrer un SGBD Oracle ?",
        "options": [
          "A) Oracle Enterprise Manager, SQL Developer et SQL*Plus",
          "B) Microsoft Access uniquement",
          "C) phpMyAdmin",
          "D) pgAdmin"
        ],
        "reponse": "A",
        "explication": "OEM (console graphique), SQL Developer (IDE) et SQL*Plus (ligne de commande) sont les outils d'administration Oracle."
      },
      {
        "q": "A quel moment la SGA est-elle creee dans l'environnement de la base de donnees ?",
        "options": [
          "A) A la creation de la base",
          "B) Quand la base est montee (MOUNT)",
          "C) Quand l'instance est demarree (STARTUP NOMOUNT)",
          "D) Quand le processus utilisateur demarre"
        ],
        "reponse": "C",
        "explication": "La SGA est allouee des le demarrage de l'instance, en phase NOMOUNT, avant tout montage ou ouverture de la base."
      },
      {
        "q": "Quelle affirmation decrit correctement la memoire PGA ?",
        "options": [
          "A) Elle est partagee par tous les processus",
          "B) Elle est propre a chaque processus serveur/utilisateur",
          "C) Elle correspond a l'argument INITIAL de CREATE TABLESPACE",
          "D) Elle est stockee dans le fichier de controle"
        ],
        "reponse": "B",
        "explication": "La PGA est une zone memoire privee, non partagee, dediee a chaque processus (tri, session, curseur)."
      },
      {
        "q": "L'instance Oracle est composee de :",
        "options": [
          "A) SGA + processus d'arriere-plan",
          "B) SGA + PGA + processus d'arriere-plan",
          "C) Base de donnees + SGA",
          "D) Fichiers de donnees uniquement"
        ],
        "reponse": "B",
        "explication": "Une instance = structures memoire (SGA et PGA) + processus d'arriere-plan ; la base de donnees (fichiers) en est distincte."
      },
      {
        "q": "Que contient la SGA (System Global Area) ?",
        "options": [
          "A) Database Buffer Cache, Shared Pool et Redo Log Buffer",
          "B) Uniquement le Database Buffer Cache",
          "C) Les fichiers de controle",
          "D) Les processus utilisateur"
        ],
        "reponse": "A",
        "explication": "La SGA regroupe le Database Buffer Cache, le Shared Pool et le Redo Log Buffer (et parfois Large/Java Pool)."
      },
      {
        "q": "Quel est le role du processus DBWR (Database Writer) ?",
        "options": [
          "A) Ecrire les modifications dans les fichiers redo log",
          "B) Ecrire les blocs modifies du buffer cache vers les datafiles",
          "C) Gerer les connexions utilisateur",
          "D) Archiver les fichiers redo log"
        ],
        "reponse": "B",
        "explication": "DBWR transfere les blocs sales (dirty buffers) du Database Buffer Cache vers les fichiers de donnees."
      },
      {
        "q": "Que contiennent les fichiers de controle (control files) d'Oracle ?",
        "options": [
          "A) Les donnees des tables",
          "B) Les metadonnees sur la structure de la base",
          "C) Les requetes SQL en cours",
          "D) Uniquement les index"
        ],
        "reponse": "B",
        "explication": "Les control files stockent la structure physique : noms/emplacements des fichiers, SCN, infos de checkpoint et RMAN."
      },
      {
        "q": "Concernant le tablespace SYSTEM, quelle affirmation est exacte ?",
        "options": [
          "A) Il peut etre supprime sans probleme",
          "B) Il contient le dictionnaire de donnees d'Oracle",
          "C) Il ne contient que des donnees utilisateur",
          "D) Il est optionnel dans une base Oracle"
        ],
        "reponse": "B",
        "explication": "Le tablespace SYSTEM heberge le dictionnaire de donnees, il est obligatoire et ne peut etre supprime."
      },
      {
        "q": "Que retourne une jointure INNER JOIN entre deux tables ?",
        "options": [
          "A) Toutes les lignes de la table de gauche",
          "B) Toutes les lignes de la table de droite",
          "C) Uniquement les lignes ayant une correspondance dans les deux tables",
          "D) Toutes les lignes des deux tables"
        ],
        "reponse": "C",
        "explication": "Un INNER JOIN ne conserve que les lignes pour lesquelles la condition de jointure est satisfaite des deux cotes."
      },
      {
        "q": "Quelle est la syntaxe Oracle traditionnelle (implicite) pour une jointure interne entre A et B ?",
        "options": [
          "A) SELECT * FROM A INNER JOIN B ON A.id = B.id",
          "B) SELECT * FROM A, B WHERE A.id = B.id",
          "C) SELECT * FROM A LEFT JOIN B ON A.id = B.id",
          "D) SELECT * FROM A UNION B"
        ],
        "reponse": "B",
        "explication": "La syntaxe traditionnelle Oracle exprime la jointure dans la clause WHERE : FROM A, B WHERE A.id = B.id."
      },
      {
        "q": "Que retourne un LEFT OUTER JOIN ?",
        "options": [
          "A) Toutes les lignes de la table de droite",
          "B) Toutes les lignes de la table de gauche, avec NULL quand il n'y a pas de correspondance",
          "C) Le meme resultat qu'un INNER JOIN",
          "D) Il ne peut pas utiliser NULL"
        ],
        "reponse": "B",
        "explication": "Le LEFT OUTER JOIN conserve toutes les lignes de la table de gauche, completees par NULL si aucune correspondance a droite."
      },
      {
        "q": "Pour eviter le produit cartesien lors d'une jointure, il faut :",
        "options": [
          "A) Utiliser DISTINCT",
          "B) Specifier une condition de jointure (WHERE ou ON)",
          "C) Utiliser ORDER BY",
          "D) Limiter avec ROWNUM"
        ],
        "reponse": "B",
        "explication": "Sans condition de jointure, toutes les combinaisons de lignes sont produites (produit cartesien) ; il faut une clause de liaison."
      },
      {
        "q": "Soit la requete : SELECT e.nom, d.nom_dept FROM employes e, departements d WHERE e.dept_id = d.id ; cette jointure est :",
        "options": [
          "A) Une syntaxe Oracle classique correcte",
          "B) Fausse car il manque INNER JOIN",
          "C) Fausse car les alias sont incorrects",
          "D) Fausse car WHERE est mal place"
        ],
        "reponse": "A",
        "explication": "C'est la syntaxe de jointure traditionnelle d'Oracle, parfaitement valide : alias + condition dans WHERE."
      },
      {
        "q": "Quel processus ecrit le contenu du Redo Log Buffer dans les fichiers redo log ?",
        "options": [
          "A) DBWR",
          "B) LGWR",
          "C) PMON",
          "D) SMON"
        ],
        "reponse": "B",
        "explication": "LGWR (Log Writer) ecrit sequentiellement le Redo Log Buffer vers les redo log files, notamment a chaque COMMIT."
      },
      {
        "q": "Dans quel ordre se deroulent les phases de demarrage d'une instance Oracle ?",
        "options": [
          "A) OPEN, MOUNT, NOMOUNT",
          "B) MOUNT, NOMOUNT, OPEN",
          "C) NOMOUNT, MOUNT, OPEN",
          "D) STARTUP, SHUTDOWN, OPEN"
        ],
        "reponse": "C",
        "explication": "STARTUP NOMOUNT (SGA + processus), puis MOUNT (lecture control file), puis OPEN (ouverture datafiles/redo)."
      },
      {
        "q": "A quoi sert le processus CKPT (Checkpoint) ?",
        "options": [
          "A) Il ecrit les donnees vers les datafiles",
          "B) Il met a jour les en-tetes des datafiles et le control file lors d'un checkpoint",
          "C) Il archive les redo logs",
          "D) Il gere les sessions utilisateur"
        ],
        "reponse": "B",
        "explication": "CKPT declenche le checkpoint et met a jour les en-tetes de fichiers + le control file pour synchroniser SGA et disque."
      },
      {
        "q": "Quel mode d'archivage permet une recuperation jusqu'a un instant precis (point-in-time) ?",
        "options": [
          "A) NOARCHIVELOG",
          "B) ARCHIVELOG",
          "C) MOUNT mode",
          "D) READ ONLY"
        ],
        "reponse": "B",
        "explication": "En mode ARCHIVELOG, les redo logs remplis sont archives, autorisant une recuperation complete ou jusqu'a un instant donne."
      },
      {
        "q": "Quel est l'outil Oracle dedie a la sauvegarde et restauration de la base ?",
        "options": [
          "A) SQL*Loader",
          "B) RMAN (Recovery Manager)",
          "C) Data Pump",
          "D) SQL*Plus"
        ],
        "reponse": "B",
        "explication": "RMAN gere les sauvegardes (completes/incrementielles), la validation des blocs et la restauration/recuperation."
      },
      {
        "q": "Quelle commande SQL accorde un privilege a un utilisateur ou un role ?",
        "options": [
          "A) GRANT",
          "B) COMMIT",
          "C) ALTER",
          "D) ASSIGN"
        ],
        "reponse": "A",
        "explication": "GRANT attribue privileges systeme ou objet ; REVOKE les retire. Exemple : GRANT SELECT ON t TO user;"
      },
      {
        "q": "Qu'est-ce qu'un role dans la gestion des droits Oracle ?",
        "options": [
          "A) Un fichier de donnees",
          "B) Un regroupement nomme de privileges attribuable en bloc",
          "C) Un processus d'arriere-plan",
          "D) Un segment de la SGA"
        ],
        "reponse": "B",
        "explication": "Un role regroupe plusieurs privileges (ex. CONNECT, RESOURCE, DBA) pour faciliter leur attribution aux utilisateurs."
      },
      {
        "q": "Que fait l'operateur d'ensemble INTERSECT ?",
        "options": [
          "A) Fusionne les deux ensembles sans doublons",
          "B) Retourne les lignes communes aux deux requetes",
          "C) Retourne les lignes du premier absent du second",
          "D) Retourne le produit cartesien"
        ],
        "reponse": "B",
        "explication": "INTERSECT ne renvoie que les lignes presentes simultanement dans les deux ensembles de resultats."
      },
      {
        "q": "Que fait l'operateur MINUS en SQL Oracle ?",
        "options": [
          "A) Retourne les lignes du premier SELECT absentes du second",
          "B) Retourne les lignes communes",
          "C) Additionne les deux ensembles",
          "D) Trie les resultats"
        ],
        "reponse": "A",
        "explication": "MINUS (equivalent EXCEPT) renvoie les lignes du premier ensemble qui ne figurent pas dans le second."
      },
      {
        "q": "Quelle est la difference entre ROLLUP et CUBE ?",
        "options": [
          "A) ROLLUP genere tous les sous-totaux, CUBE seulement le total general",
          "B) ROLLUP genere des sous-totaux hierarchiques, CUBE genere toutes les combinaisons de sous-totaux",
          "C) Ils sont strictement identiques",
          "D) CUBE ne fonctionne qu'avec une seule colonne"
        ],
        "reponse": "B",
        "explication": "ROLLUP produit une agregation hierarchique (n+1 niveaux), CUBE produit tous les sous-totaux de toutes les combinaisons (2^n)."
      },
      {
        "q": "A quoi sert la clause CONNECT BY PRIOR dans une requete Oracle ?",
        "options": [
          "A) A joindre deux tables",
          "B) A parcourir des donnees hierarchiques (requete arborescente)",
          "C) A creer un index",
          "D) A archiver les redo logs"
        ],
        "reponse": "B",
        "explication": "CONNECT BY PRIOR (avec START WITH) realise une requete hierarchique parent-enfant (parcours d'arbre)."
      },
      {
        "q": "Quelle section d'un bloc PL/SQL gere les erreurs d'execution ?",
        "options": [
          "A) DECLARE",
          "B) BEGIN",
          "C) EXCEPTION",
          "D) END"
        ],
        "reponse": "C",
        "explication": "La section EXCEPTION capture et traite les erreurs runtime ; DECLARE declare, BEGIN execute, END termine le bloc."
      },
      {
        "q": "Quelle est la plus petite unite d'entree/sortie geree par Oracle sur le disque ?",
        "options": [
          "A) Le tablespace",
          "B) Le segment",
          "C) L'extent",
          "D) Le bloc de donnees (data block)"
        ],
        "reponse": "D",
        "explication": "Hierarchie : tablespace > segment > extent > bloc Oracle, le bloc etant la plus petite unite d'E/S logique."
      },
      {
        "q": "Pour limiter le nombre de lignes retournees dans Oracle (avant la clause FETCH), on utilise traditionnellement :",
        "options": [
          "A) ROWNUM",
          "B) LIMIT",
          "C) TOP",
          "D) OFFSET seul"
        ],
        "reponse": "A",
        "explication": "Oracle utilise la pseudo-colonne ROWNUM (LIMIT/TOP appartiennent a MySQL/SQL Server). Depuis 12c, FETCH FIRST existe aussi."
      },
      {
        "q": "Le Redo Log Buffer fait partie de quelle structure memoire ?",
        "options": [
          "A) La PGA",
          "B) La SGA",
          "C) Le fichier de controle",
          "D) Le datafile"
        ],
        "reponse": "B",
        "explication": "Le Redo Log Buffer est un composant de la SGA, ecrit ensuite vers les redo log files par LGWR."
      }
    ],
    "questionsOuvertes": [
      {
        "q": "Representez et expliquez l'architecture d'un serveur Oracle (instance + base de donnees), en detaillant les structures memoire (SGA, PGA) et les principaux processus d'arriere-plan.",
        "reponseAttendue": "Un serveur Oracle = une INSTANCE + une BASE DE DONNEES.\n\n1) L'INSTANCE (en memoire RAM) comprend les structures memoire et les processus d'arriere-plan, allouees au demarrage (STARTUP NOMOUNT) :\n- SGA (System Global Area), zone partagee : Database Buffer Cache (copies des blocs de donnees), Shared Pool (Library Cache pour les ordres SQL/PL-SQL parses + Data Dictionary Cache), Redo Log Buffer (vecteurs de reprise), et optionnellement Large Pool / Java Pool.\n- PGA (Program Global Area), zone privee a chaque processus serveur : zone de tri, variables de session, etat des curseurs.\n- Processus d'arriere-plan : DBWR ecrit les blocs modifies du buffer cache vers les datafiles ; LGWR ecrit le Redo Log Buffer vers les redo log files (a chaque COMMIT) ; SMON assure la recuperation d'instance et la coalescence ; PMON nettoie les processus utilisateur defaillants ; CKPT declenche les checkpoints et met a jour control files et en-tetes de datafiles ; ARCn (en mode ARCHIVELOG) archive les redo logs.\n\n2) La BASE DE DONNEES (fichiers sur disque) comprend trois types de fichiers :\n- Datafiles : donnees et index reels (organises en tablespaces).\n- Control files : metadonnees de structure (noms/emplacements des fichiers, SCN, infos RMAN).\n- Redo Log Files : journalisation de toutes les modifications, indispensable a la reprise.\n\nLes deux TYPES de serveur Oracle (2 TYPE attendu) :\n- Serveur dedie (Dedicated Server) : chaque processus utilisateur dispose de son propre processus serveur.\n- Serveur partage (Shared/Multi-Threaded Server) : un pool de processus serveur partages sert plusieurs connexions utilisateur via un dispatcher.\n\nSchema logique : Utilisateur -> Processus serveur -> SGA (Buffer Cache/Shared Pool/Redo Buffer) -> processus DBWR/LGWR/CKPT -> fichiers (datafiles, control files, redo logs)."
      },
      {
        "q": "Expliquez les trois etapes de demarrage d'une instance Oracle (NOMOUNT, MOUNT, OPEN), ce qui se passe a chaque etape, et a quoi servent ces niveaux pour l'administration.",
        "reponseAttendue": "Le demarrage d'Oracle est progressif en trois phases :\n\n1) STARTUP NOMOUNT : Oracle lit le fichier de parametres (pfile/spfile), alloue la SGA et demarre les processus d'arriere-plan. L'instance existe mais aucune base n'est associee. Niveau utile pour CREATE DATABASE ou recreer un control file.\n\n2) ALTER DATABASE MOUNT (ou STARTUP MOUNT) : l'instance lit le fichier de controle et associe la base de donnees ; elle connait alors l'emplacement des datafiles et redo logs, mais ils ne sont pas encore ouverts. Niveau utile pour les operations de maintenance : renommer des datafiles, activer le mode ARCHIVELOG, effectuer une recuperation complete (RECOVER), restaurer avec RMAN.\n\n3) ALTER DATABASE OPEN (ou STARTUP, niveau par defaut) : Oracle ouvre les datafiles et les redo log files, effectue si necessaire la recuperation d'instance (SMON), et la base devient accessible aux utilisateurs.\n\nLe SHUTDOWN parcourt l'inverse (close, dismount, shutdown). Les modes d'arret : SHUTDOWN NORMAL/TRANSACTIONAL/IMMEDIATE (arret propre) et SHUTDOWN ABORT (arret brutal necessitant une recuperation d'instance au redemarrage). Ces niveaux permettent au DBA d'effectuer des operations selon le niveau d'acces requis."
      },
      {
        "q": "Definissez : SGBD Oracle, operateur d'ensemble, integrite des donnees, et l'operateur INTERSECT. Donnez un exemple pour INTERSECT.",
        "reponseAttendue": "SGBD Oracle : Systeme de Gestion de Base de Donnees relationnel (SGBDR) edite par Oracle Corporation. C'est un logiciel qui permet de definir, stocker, manipuler, securiser et administrer de grands volumes de donnees structurees, garantissant les proprietes ACID des transactions, le controle d'acces concurrent et la persistance.\n\nOperateur d'ensemble : operateur SQL qui combine les resultats de deux requetes SELECT compatibles (meme nombre de colonnes, types compatibles) en appliquant la theorie des ensembles. Les quatre operateurs Oracle sont UNION, UNION ALL, INTERSECT et MINUS.\n\nIntegrite des donnees : ensemble de regles et contraintes garantissant l'exactitude, la coherence et la validite des donnees dans la base. On distingue l'integrite de domaine (types, CHECK, NOT NULL), l'integrite d'entite (cle primaire unique et non nulle) et l'integrite referentielle (cle etrangere referencant une cle existante).\n\nOperateur INTERSECT : retourne uniquement les lignes communes (l'intersection) aux deux ensembles de resultats, sans doublons.\nExemple :\nSELECT id_client FROM commandes_2024\nINTERSECT\nSELECT id_client FROM commandes_2025;\n-> renvoie les clients ayant commande a la fois en 2024 et en 2025."
      },
      {
        "q": "Expliquez la difference entre GROUP BY, GROUP BY ROLLUP et CUBE. Illustrez avec une requete d'agregation sur les ventes par region et produit.",
        "reponseAttendue": "GROUP BY : regroupe les lignes partageant les memes valeurs sur les colonnes specifiees pour appliquer des fonctions d'agregation (SUM, COUNT, AVG...). Il ne produit que les regroupements detailles, sans sous-totaux ni total general.\n\nGROUP BY ROLLUP(a, b) : produit en plus des regroupements detailles des sous-totaux HIERARCHIQUES, en agregeant de droite a gauche, plus un total general. Pour ROLLUP(region, produit), on obtient : (region, produit), puis le sous-total par region, puis le total general -> n+1 niveaux d'agregation.\n\nGROUP BY CUBE(a, b) : genere TOUTES les combinaisons possibles de sous-totaux (2^n niveaux pour n colonnes). Pour CUBE(region, produit) : (region, produit), sous-total par region, sous-total par produit, et total general -> tableau croise multidimensionnel complet.\n\nExemple :\nSELECT region, produit, SUM(montant) AS total\nFROM ventes\nGROUP BY ROLLUP(region, produit);\n-> lignes detaillees + sous-total par region + total general.\n\nEn remplacant ROLLUP par CUBE, on obtient en plus les sous-totaux par produit (toutes regions confondues). ROLLUP convient aux hierarchies (annee>mois>jour), CUBE aux analyses croisees multidimensionnelles."
      },
      {
        "q": "Decrivez la strategie de sauvegarde et de restauration d'une base Oracle : difference entre mode NOARCHIVELOG et ARCHIVELOG, role de RMAN, et types de recuperation.",
        "reponseAttendue": "Modes d'archivage :\n- NOARCHIVELOG : les fichiers redo log sont reutilises de maniere circulaire sans etre archives. Seules des sauvegardes a froid (base fermee) sont coherentes ; en cas de perte, on ne peut restaurer qu'a l'etat de la derniere sauvegarde (perte des transactions intermediaires). Pas de point-in-time recovery.\n- ARCHIVELOG : avant qu'un redo log rempli ne soit reecrit, le processus ARCn l'archive sur disque (archived redo logs). Cela autorise les sauvegardes a chaud (base ouverte) et la recuperation complete ou jusqu'a un instant precis (point-in-time recovery) en rejouant les archives.\n\nRMAN (Recovery Manager) : outil Oracle dedie a la sauvegarde/restauration. Il permet : sauvegardes completes et incrementielles (niveau 0/1), compression et validation des blocs (detection de corruption), gestion d'un catalogue de recuperation, sauvegarde des datafiles, control files, spfile et archived redo logs. Commandes typiques : BACKUP DATABASE; , RESTORE DATABASE; , RECOVER DATABASE;.\n\nTypes de recuperation :\n- Recuperation d'instance (instance recovery) : automatique au redemarrage apres un crash (SMON rejoue les redo logs en ligne, roll forward + rollback).\n- Recuperation de media (media recovery) : manuelle apres perte/corruption d'un fichier, via RESTORE puis RECOVER (rejeu des archives en mode ARCHIVELOG).\n- Recuperation complete : ramene la base a l'etat le plus recent.\n- Recuperation incomplete / point-in-time : ramene la base a un instant ou un SCN donne (UNTIL TIME / UNTIL SCN), utile apres une erreur logique.\n\nUne bonne strategie combine ARCHIVELOG + sauvegardes RMAN regulieres (completes + incrementielles) + sauvegardes multiplexees du control file et des redo logs."
      }
    ]
  },
  {
    "id": "sqlserver",
    "titre": "Administration BD SQL-Server",
    "sousTitre": "Microsoft SQL Server",
    "icone": "🗄️",
    "couleur": "#ea580c",
    "ue": "admin_bd",
    "placeholder": false,
    "resume": [
      {
        "titre": "Architecture client-serveur SQL Server",
        "contenu": "Microsoft SQL Server est un SGBDR client-serveur dont le moteur relationnel (Database Engine) traite les requêtes T-SQL via le protocole `TDS` (Tabular Data Stream). Une instance est une copie isolée du moteur, identifiée par défaut par le nom de la machine ou nommée (`MACHINE\\INSTANCE`), avec son propre jeu de bases système, ports et services."
      },
      {
        "titre": "Bases de données système",
        "contenu": "`master` stocke la configuration serveur, les logins et les métadonnées de toutes les bases ; `model` est le gabarit copié à chaque `CREATE DATABASE` ; `msdb` héberge SQL Server Agent (jobs, alertes, historique de sauvegarde) ; `tempdb` est recréée à chaque démarrage et sert aux objets temporaires et au tri."
      },
      {
        "titre": "Fichiers d'une base (.mdf/.ndf/.ldf)",
        "contenu": "Une base comporte un fichier de données primaire `.mdf` (obligatoire, un seul), des fichiers secondaires `.ndf` (optionnels, pour répartir les données sur plusieurs disques/groupes de fichiers) et au moins un fichier journal `.ldf` qui enregistre toutes les transactions pour la récupération."
      },
      {
        "titre": "Transact-SQL (T-SQL)",
        "contenu": "`Transact-SQL` est l'extension procédurale propriétaire de SQL par Microsoft. Elle ajoute au SQL standard les variables (`DECLARE`), le contrôle de flux (`IF`, `WHILE`, `TRY...CATCH`), les fonctions intégrées, les procédures stockées, les déclencheurs et la gestion explicite des transactions."
      },
      {
        "titre": "DDL, DML, DCL, TCL",
        "contenu": "Le T-SQL se décline en DDL (structure : `CREATE`, `ALTER`, `DROP`), DML (données : `SELECT`, `INSERT`, `UPDATE`, `DELETE`), DCL (droits : `GRANT`, `REVOKE`, `DENY`) et TCL (transactions : `BEGIN TRAN`, `COMMIT`, `ROLLBACK`)."
      },
      {
        "titre": "DROP vs DELETE vs TRUNCATE",
        "contenu": "`DELETE` (DML) supprime des lignes selon un `WHERE`, est journalisé ligne à ligne et déclenche les triggers ; `DROP` (DDL) supprime intégralement l'objet (table, structure et données) ; `TRUNCATE` vide une table en désallouant les pages, sans `WHERE`, non journalisé ligne à ligne et réinitialise l'`IDENTITY`."
      },
      {
        "titre": "Composants de la suite SQL Server",
        "contenu": "Au-delà du moteur de base de données : `SSIS` (Integration Services, ETL Extract-Transform-Load), `SSAS` (Analysis Services, cubes OLAP et data mining), `SSRS` (Reporting Services, états/rapports), interrogés en `MDX`/`DAX`, plus les outils `SSMS`, `SQL Server Profiler`, `sqlcmd` et l'Assistant de paramétrage du moteur de base de données."
      },
      {
        "titre": "OLTP vs OLAP",
        "contenu": "Un serveur OLTP (transactionnel) gère de nombreuses petites transactions concurrentes en lecture/écriture sur un schéma normalisé, optimisé pour l'intégrité et le temps de réponse. Un serveur OLAP (analytique, ex. SSAS) agrège de gros volumes historiques dénormalisés (étoile/flocon) pour l'aide à la décision, en lecture quasi exclusive."
      },
      {
        "titre": "SSMS et SQL Server Profiler",
        "contenu": "`SSMS` (SQL Server Management Studio) est l'environnement graphique d'administration et d'écriture de requêtes. `SQL Server Profiler` capture et trace en temps réel les événements du serveur (requêtes, connexions, deadlocks) ; cette trace, persistée dans un fichier `.trc`, fait office de journal d'audit/diagnostic des activités."
      },
      {
        "titre": "Sécurité : logins, users, rôles, schémas",
        "contenu": "Un `login` (niveau serveur, stocké dans `master`) authentifie une connexion ; un `user` (niveau base) lui est mappé pour autoriser l'accès à une base. Les permissions s'octroient via des rôles serveur (`sysadmin`) et de base (`db_owner`, `db_datareader`). Un `schema` est un conteneur de noms d'objets servant aussi d'unité de gestion des droits."
      },
      {
        "titre": "SGBD multi-bases et multi-schémas",
        "contenu": "Une même instance SQL Server héberge plusieurs bases de données indépendantes (multi-bases). Au sein de chaque base, les objets sont organisés en plusieurs schémas (`dbo`, `ventes`, ...), namespaces logiques qui isolent et sécurisent les objets : SQL Server est donc multi-base ET multi-schéma."
      },
      {
        "titre": "Sauvegardes : full, differential, log",
        "contenu": "`BACKUP DATABASE` complète copie toute la base ; la sauvegarde différentielle ne copie que les pages modifiées depuis la dernière complète (base = dernière full) ; `BACKUP LOG` copie le journal des transactions (mode FULL/BULK_LOGGED) et permet une restauration à un instant précis (`point-in-time`)."
      },
      {
        "titre": "Restauration et RESTORE",
        "contenu": "La restauration applique `RESTORE DATABASE ... WITH NORECOVERY` pour la full, puis la différentielle, puis les logs dans l'ordre, et enfin `WITH RECOVERY` (ou `STOPAT`) pour rendre la base accessible. La restauration complète remplace toute la base ; la différentielle nécessite d'abord la full de base correspondante."
      },
      {
        "titre": "Index clustered et non-clustered",
        "contenu": "L'index `CLUSTERED` ordonne physiquement les lignes selon la clé (un seul par table, souvent la clé primaire) : les pages de données sont les feuilles. L'index `NONCLUSTERED` est une structure séparée (B-tree) dont les feuilles pointent vers les lignes ; on peut en créer plusieurs pour accélérer les recherches sur d'autres colonnes."
      },
      {
        "titre": "SQL Server Agent et jobs",
        "contenu": "`SQL Server Agent` est le service de planification stocké dans `msdb`. Il exécute des `jobs` (tâches T-SQL, SSIS, scripts) selon des `schedules`, déclenche des `alerts` et envoie des notifications par `operators`, automatisant sauvegardes, réindexations et maintenance."
      },
      {
        "titre": "Contraintes et intégrité",
        "contenu": "L'intégrité est garantie par des contraintes : `PRIMARY KEY` (identité unique non nulle), `FOREIGN KEY` (intégrité référentielle), `UNIQUE`, `NOT NULL`, `CHECK` (règle de validation) et `DEFAULT`. Elles s'ajoutent en DDL (`ALTER TABLE ... ADD CONSTRAINT`) et le moteur les vérifie à chaque modification."
      },
      {
        "titre": "Déclencheurs (triggers) et procédures stockées",
        "contenu": "Une procédure stockée est un bloc T-SQL nommé et précompilé exécuté par `EXEC`. Un `trigger` est une procédure liée à une table, déclenchée automatiquement sur `INSERT`/`UPDATE`/`DELETE` (tables logiques `inserted`/`deleted`) ; il sert à maintenir des règles métier, par ex. décrémenter les places disponibles d'une table de mariage."
      },
      {
        "titre": "BULK INSERT, BCP et chargement de masse",
        "contenu": "`BULK INSERT` est une commande T-SQL qui charge un fichier de données dans une table depuis l'intérieur du serveur. `bcp` (Bulk Copy Program) est un utilitaire en ligne de commande externe qui importe ET exporte des données entre un fichier et une table, scriptable hors SSMS."
      }
    ],
    "qcm": [
      {
        "q": "Quel élément est l'intrus parmi les outils/composants suivants ?",
        "options": [
          "A) SSMS",
          "B) SQL Server Profiler",
          "C) SQL SERVER",
          "D) sqlcmd"
        ],
        "reponse": "C",
        "explication": "SSMS, Profiler et sqlcmd sont des outils ; SQL SERVER désigne le SGBD lui-même, pas un outil de la suite (question issue de l'épreuve de rattrapage)."
      },
      {
        "q": "L'ETL (Extraction Transformation Loading) est mis en oeuvre par quel composant de SQL Server ?",
        "options": [
          "A) SSIS",
          "B) SSMS",
          "C) SSAS",
          "D) SSRS"
        ],
        "reponse": "A",
        "explication": "SSIS (SQL Server Integration Services) est le moteur ETL ; SSAS fait l'OLAP, SSRS les rapports, SSMS est l'outil d'administration."
      },
      {
        "q": "En quelle année est sortie la première version de SQL Server ?",
        "options": [
          "A) 1979",
          "B) 1969",
          "C) 1989",
          "D) 1959"
        ],
        "reponse": "C",
        "explication": "La première version (SQL Server 1.0, sous OS/2, issue d'un partenariat Microsoft-Sybase-Ashton-Tate) date de 1989."
      },
      {
        "q": "L'Assistant de paramétrage du moteur de base de données (Database Engine Tuning Advisor) permet :",
        "options": [
          "A) Une optimisation du fonctionnement du moteur de BD",
          "B) De réaliser toutes les opérations au niveau du moteur",
          "C) D'exécuter des requêtes au niveau du moteur",
          "D) De sauvegarder les bases système"
        ],
        "reponse": "A",
        "explication": "Le Tuning Advisor analyse une charge de travail et recommande des index/statistiques : il optimise les performances du moteur."
      },
      {
        "q": "Quelle est l'extension d'un fichier secondaire de données dans SQL Server ?",
        "options": [
          "A) .ldf",
          "B) .mdf",
          "C) .pdf",
          "D) .ndf"
        ],
        "reponse": "D",
        "explication": ".ndf = fichier de données secondaire ; .mdf = primaire ; .ldf = journal des transactions."
      },
      {
        "q": "Quelle base système est recréée à chaque démarrage de l'instance ?",
        "options": [
          "A) master",
          "B) model",
          "C) tempdb",
          "D) msdb"
        ],
        "reponse": "C",
        "explication": "tempdb est entièrement reconstruite à partir de model à chaque redémarrage ; elle ne conserve aucune donnée."
      },
      {
        "q": "Quelle base système sert de modèle (gabarit) à toute nouvelle base créée ?",
        "options": [
          "A) master",
          "B) model",
          "C) msdb",
          "D) tempdb"
        ],
        "reponse": "B",
        "explication": "CREATE DATABASE copie la structure de model ; toute modification de model se répercute sur les futures bases."
      },
      {
        "q": "Où SQL Server Agent stocke-t-il ses jobs et son historique ?",
        "options": [
          "A) master",
          "B) tempdb",
          "C) msdb",
          "D) model"
        ],
        "reponse": "C",
        "explication": "msdb héberge SQL Server Agent : jobs, schedules, alertes et historique des sauvegardes."
      },
      {
        "q": "Quel protocole assure le transport des résultats entre client et serveur SQL Server ?",
        "options": [
          "A) HTTP",
          "B) TDS (Tabular Data Stream)",
          "C) ODBC",
          "D) FTP"
        ],
        "reponse": "B",
        "explication": "TDS est le protocole applicatif natif de SQL Server pour échanger requêtes et jeux de résultats tabulaires."
      },
      {
        "q": "Combien une table peut-elle posséder d'index clustered au maximum ?",
        "options": [
          "A) 0",
          "B) 1",
          "C) 2",
          "D) Illimité"
        ],
        "reponse": "B",
        "explication": "L'index clustered ordonne physiquement les lignes : il ne peut donc en exister qu'un seul par table."
      },
      {
        "q": "Quelle commande supprime définitivement la structure ET les données d'une table ?",
        "options": [
          "A) DELETE",
          "B) TRUNCATE",
          "C) DROP",
          "D) DENY"
        ],
        "reponse": "C",
        "explication": "DROP TABLE supprime l'objet entier ; DELETE/TRUNCATE ne suppriment que les lignes en gardant la structure."
      },
      {
        "q": "Quelle différence essentielle existe entre DELETE et TRUNCATE ?",
        "options": [
          "A) DELETE supprime la table, TRUNCATE non",
          "B) TRUNCATE accepte une clause WHERE",
          "C) TRUNCATE ne journalise pas ligne à ligne et réinitialise l'IDENTITY",
          "D) DELETE est du DDL, TRUNCATE du DML"
        ],
        "reponse": "C",
        "explication": "TRUNCATE désalloue les pages (peu journalisé), n'accepte pas de WHERE et remet le compteur IDENTITY à sa valeur initiale."
      },
      {
        "q": "Lequel de ces composants effectue l'analyse OLAP (cubes, agrégations) ?",
        "options": [
          "A) SSIS",
          "B) SSAS",
          "C) SSRS",
          "D) SSMS"
        ],
        "reponse": "B",
        "explication": "SSAS (Analysis Services) construit et interroge les cubes multidimensionnels et modèles tabulaires."
      },
      {
        "q": "Quel langage interroge nativement les cubes multidimensionnels de SSAS ?",
        "options": [
          "A) MDX",
          "B) DAX",
          "C) XML",
          "D) HTML"
        ],
        "reponse": "A",
        "explication": "MDX (MultiDimensional eXpressions) interroge les cubes OLAP ; DAX cible les modèles tabulaires/Power BI."
      },
      {
        "q": "Quel objet de sécurité existe au niveau du serveur et authentifie une connexion ?",
        "options": [
          "A) Le user de base",
          "B) Le schéma",
          "C) Le login",
          "D) Le rôle de base"
        ],
        "reponse": "C",
        "explication": "Le login (stocké dans master) authentifie au niveau serveur ; il est ensuite mappé à un user dans chaque base."
      },
      {
        "q": "Quel rôle serveur fixe confère les privilèges les plus élevés ?",
        "options": [
          "A) db_owner",
          "B) public",
          "C) sysadmin",
          "D) db_datareader"
        ],
        "reponse": "C",
        "explication": "sysadmin est le rôle serveur le plus puissant : ses membres peuvent tout faire sur l'instance."
      },
      {
        "q": "Quelle sauvegarde ne copie que les pages modifiées depuis la dernière sauvegarde complète ?",
        "options": [
          "A) Complète (full)",
          "B) Différentielle",
          "C) Du journal (log)",
          "D) Copy-only"
        ],
        "reponse": "B",
        "explication": "La sauvegarde différentielle copie uniquement les extents modifiés depuis la dernière full, qui lui sert de base."
      },
      {
        "q": "Pour une restauration à un instant précis (point-in-time), quel type de sauvegarde est indispensable ?",
        "options": [
          "A) Différentielle seule",
          "B) Du journal des transactions (log)",
          "C) Complète seule",
          "D) Copy-only"
        ],
        "reponse": "B",
        "explication": "Les sauvegardes de log, en mode de récupération FULL, permettent de rejouer les transactions jusqu'à un STOPAT précis."
      },
      {
        "q": "Quelle option de RESTORE laisse la base non opérationnelle pour appliquer d'autres sauvegardes ensuite ?",
        "options": [
          "A) WITH RECOVERY",
          "B) WITH NORECOVERY",
          "C) WITH REPLACE",
          "D) WITH INIT"
        ],
        "reponse": "B",
        "explication": "NORECOVERY laisse la base en mode 'restauration' afin d'appliquer ensuite différentielles et logs ; RECOVERY finalise et ouvre la base."
      },
      {
        "q": "Quelle contrainte garantit l'intégrité référentielle entre deux tables ?",
        "options": [
          "A) PRIMARY KEY",
          "B) CHECK",
          "C) FOREIGN KEY",
          "D) DEFAULT"
        ],
        "reponse": "C",
        "explication": "La FOREIGN KEY impose que la valeur référencée existe dans la table parente, assurant la cohérence des liens."
      },
      {
        "q": "Quel objet s'exécute AUTOMATIQUEMENT lors d'un INSERT/UPDATE/DELETE sur une table ?",
        "options": [
          "A) Une vue",
          "B) Une procédure stockée",
          "C) Un déclencheur (trigger)",
          "D) Une fonction scalaire"
        ],
        "reponse": "C",
        "explication": "Le trigger DML se déclenche automatiquement sur l'événement de modification, via les tables logiques inserted/deleted."
      },
      {
        "q": "Pour mettre à jour automatiquement les places disponibles d'une table quand une commande est passée, on utilise :",
        "options": [
          "A) Une vue indexée",
          "B) Un déclencheur (trigger) sur la table Commande",
          "C) Un index non-clustered",
          "D) Une contrainte CHECK"
        ],
        "reponse": "B",
        "explication": "Un trigger AFTER INSERT/DELETE sur Commande peut recalculer et propager le nombre de places restantes en temps réel."
      },
      {
        "q": "Quel utilitaire en ligne de commande importe ET exporte des données entre un fichier et une table ?",
        "options": [
          "A) BULK INSERT",
          "B) bcp (Bulk Copy Program)",
          "C) sqlcmd",
          "D) SSMS"
        ],
        "reponse": "B",
        "explication": "bcp est un exécutable externe bidirectionnel (import/export) ; BULK INSERT est une commande T-SQL qui n'importe que vers la table."
      },
      {
        "q": "Quelle différence distingue BULK INSERT de bcp ?",
        "options": [
          "A) BULK INSERT est externe au serveur",
          "B) bcp ne fait que de l'import",
          "C) BULK INSERT est une commande T-SQL interne, bcp un outil externe",
          "D) bcp s'exécute uniquement dans SSMS"
        ],
        "reponse": "C",
        "explication": "BULK INSERT s'exécute côté serveur en T-SQL (import seul) ; bcp est un programme en ligne de commande externe, bidirectionnel."
      },
      {
        "q": "Que représente un schéma (schema) dans une base SQL Server ?",
        "options": [
          "A) Un fichier physique .mdf",
          "B) Un conteneur logique d'objets et unité de gestion des droits",
          "C) Une sauvegarde différentielle",
          "D) Une instance du moteur"
        ],
        "reponse": "B",
        "explication": "Le schéma est un namespace (ex. dbo) qui regroupe des objets et sur lequel on peut accorder des permissions."
      },
      {
        "q": "Quelle commande crée la structure d'une nouvelle base de données ?",
        "options": [
          "A) BACKUP DATABASE",
          "B) CREATE DATABASE",
          "C) USE DATABASE",
          "D) ALTER LOGIN"
        ],
        "reponse": "B",
        "explication": "CREATE DATABASE crée la base et ses fichiers en se basant sur le gabarit model."
      },
      {
        "q": "Quelle clause de CREATE TABLE déclare une croissance automatique d'un fichier de 5 Go ?",
        "options": [
          "A) SIZE = 5GB",
          "B) FILEGROWTH = 5GB",
          "C) MAXSIZE = 5GB",
          "D) AUTOGROW = 5GB"
        ],
        "reponse": "B",
        "explication": "FILEGROWTH précise l'incrément (ici 5 Go) ajouté au fichier quand il est saturé ; SIZE fixe la taille initiale, MAXSIZE le plafond."
      },
      {
        "q": "Quel langage cible les modèles tabulaires (Power BI / SSAS Tabular) ?",
        "options": [
          "A) MDX",
          "B) DAX",
          "C) TDS",
          "D) BCP"
        ],
        "reponse": "B",
        "explication": "DAX (Data Analysis Expressions) est le langage des modèles tabulaires ; MDX reste celui des cubes multidimensionnels."
      },
      {
        "q": "Quelle affirmation décrit le mieux une trace SQL Server ?",
        "options": [
          "A) Une sauvegarde complète chiffrée",
          "B) Un enregistrement d'événements du serveur, persistable en fichier .trc faisant office de log d'audit",
          "C) Un index clustered",
          "D) Un fichier de données secondaire"
        ],
        "reponse": "B",
        "explication": "Une trace (Profiler/Extended Events) capture les événements ; sauvegardée en .trc, elle joue le rôle de journal d'audit/diagnostic."
      },
      {
        "q": "Citez une tâche typique d'un administrateur de bases SQL Server :",
        "options": [
          "A) Concevoir l'interface graphique de l'application cliente",
          "B) Gérer les sauvegardes/restaurations et la sécurité (logins, rôles)",
          "C) Rédiger le cahier des charges fonctionnel métier",
          "D) Développer le pilote TDS"
        ],
        "reponse": "B",
        "explication": "Le DBA assure sauvegardes/restaurations, sécurité, performance (index, tuning), maintenance et surveillance des instances."
      }
    ],
    "questionsOuvertes": [
      {
        "q": "Décrivez l'architecture de Microsoft SQL Server : notion d'instance, rôle des quatre bases système (master, model, msdb, tempdb) et types de fichiers (.mdf, .ndf, .ldf).",
        "reponseAttendue": "SQL Server est un SGBDR client-serveur. Une INSTANCE est une installation isolée du moteur de base de données, possédant ses propres services, ports, configuration et jeu de bases système ; on distingue l'instance par défaut (nom de la machine) et les instances nommées (MACHINE\\INSTANCE), plusieurs pouvant coexister sur un même serveur. Les clients dialoguent avec le moteur via le protocole TDS.\n\nLes quatre bases système :\n- master : contient la configuration de l'instance, les logins, les métadonnées de toutes les bases et l'emplacement des fichiers ; sa perte rend l'instance inutilisable.\n- model : base modèle/gabarit copiée à chaque CREATE DATABASE ; toute modification (taille, objets) se répercute sur les futures bases.\n- msdb : utilisée par SQL Server Agent pour stocker jobs, schedules, alertes, opérateurs et l'historique des sauvegardes.\n- tempdb : base de travail recréée à chaque démarrage à partir de model ; héberge tables temporaires, variables de table, résultats intermédiaires de tri/hachage et version store.\n\nLes fichiers d'une base :\n- .mdf : fichier de données primaire, obligatoire et unique, contenant les données et le pointeur vers les autres fichiers.\n- .ndf : fichiers de données secondaires, optionnels et multiples, pour répartir les données sur plusieurs disques ou groupes de fichiers (filegroups).\n- .ldf : fichier(s) journal des transactions, enregistrant toutes les modifications pour assurer la récupération (recovery), le rollback et les sauvegardes de log.\nLa correspondance avec l'épreuve : le fichier primaire 'gestion_prim' (.mdf), secondaire 'gestion_sec' (.ndf) et journal 'gestion_log' (.ldf)."
      },
      {
        "q": "Comparez la stratégie de sauvegarde et de restauration sous SQL Server : sauvegarde complète, différentielle et du journal des transactions. Donnez l'ordre de restauration et le rôle du mode de récupération.",
        "reponseAttendue": "Trois types de sauvegardes :\n1. Complète (FULL, BACKUP DATABASE) : copie l'intégralité des données de la base + assez de journal pour la rendre cohérente. Sert de point de base.\n2. Différentielle (WITH DIFFERENTIAL) : copie uniquement les extents modifiés depuis la DERNIÈRE sauvegarde complète. Plus rapide et plus petite qu'une full, mais dépend toujours de sa full de base. Elle est cumulative (chaque différentielle contient les changements depuis la full).\n3. Du journal (BACKUP LOG) : copie la partie active du journal des transactions ; disponible seulement en mode de récupération FULL ou BULK_LOGGED. Permet le point-in-time recovery (restauration à un instant précis via STOPAT) et tronque le journal.\n\nModes de récupération : SIMPLE (pas de sauvegarde de log, pas de point-in-time), FULL (toutes les transactions journalisées, restauration à la seconde près), BULK_LOGGED (variante de FULL optimisant les opérations en masse).\n\nOrdre de restauration typique :\n- RESTORE DATABASE ... FROM full WITH NORECOVERY ;\n- RESTORE DATABASE ... FROM derniere_differentielle WITH NORECOVERY ;\n- RESTORE LOG ... FROM log1 WITH NORECOVERY ; (puis les logs suivants dans l'ordre)\n- RESTORE LOG ... WITH RECOVERY (ou STOPAT = 'date heure') pour finaliser et ouvrir la base.\nNORECOVERY maintient la base en état de restauration pour appliquer d'autres sauvegardes ; RECOVERY effectue le rollforward/rollback final et rend la base accessible. Différences clés full vs différentielle : la full est complète et autonome, la différentielle est partielle, dépendante de sa full, plus rapide à produire et à restaurer."
      },
      {
        "q": "Expliquez le modèle de sécurité de SQL Server : différence entre login et user, rôles serveur et rôles de base, schémas, et commandes de gestion des privilèges (DCL).",
        "reponseAttendue": "La sécurité de SQL Server est hiérarchisée sur deux niveaux : serveur (instance) et base de données.\n\nNiveau serveur :\n- Login : principal d'authentification stocké dans master. Deux modes : authentification Windows (intégrée, Kerberos/NTLM) ou authentification SQL Server (login + mot de passe). Le login autorise la connexion à l'instance.\n- Rôles serveur fixes : sysadmin (tous droits), serveradmin, securityadmin, dbcreator, etc., regroupant des privilèges au niveau instance.\n\nNiveau base :\n- User : principal de base mappé à un login, donnant accès à une base précise. Un même login peut être mappé à plusieurs users dans différentes bases.\n- Rôles de base fixes : db_owner (tous droits sur la base), db_datareader (SELECT sur toutes les tables), db_datawriter (INSERT/UPDATE/DELETE), db_ddladmin, etc. On peut aussi créer des rôles applicatifs personnalisés (CREATE ROLE).\n\nSchémas : namespace logique (ex. dbo, ventes) qui regroupe des objets (tables, vues, procédures). Le schéma est à la fois un préfixe de nommage (schema.objet) et une unité de permission : accorder un droit sur un schéma le propage à tous ses objets. Chaque user possède un schéma par défaut.\n\nDCL (Data Control Language) :\n- GRANT permission ON objet TO principal : accorde un droit (ex. GRANT SELECT ON dbo.CLIENT TO user1).\n- REVOKE : retire un droit précédemment accordé ou refusé.\n- DENY : interdit explicitement un droit (le DENY l'emporte sur tout GRANT, même hérité d'un rôle).\nPrincipe du moindre privilège : n'accorder que les droits strictement nécessaires, de préférence via des rôles plutôt que individuellement."
      },
      {
        "q": "Comparez les composants de la suite SQL Server (moteur de BD, SSIS, SSAS, SSRS) et situez les langages T-SQL, MDX et DAX ainsi que les notions OLTP/OLAP.",
        "reponseAttendue": "La plateforme SQL Server regroupe plusieurs services complémentaires :\n- Database Engine (moteur de BD) : coeur relationnel qui stocke, sécurise et interroge les données via T-SQL ; cible les charges OLTP.\n- SSIS (Integration Services) : plateforme ETL (Extract, Transform, Load) pour extraire des données de sources hétérogènes, les transformer/nettoyer et les charger (ex. alimentation d'un entrepôt). Conçoit des packages (.dtsx).\n- SSAS (Analysis Services) : moteur OLAP/data mining ; construit des cubes multidimensionnels et des modèles tabulaires pour l'analyse décisionnelle (agrégations rapides sur de gros volumes).\n- SSRS (Reporting Services) : génération, publication et diffusion de rapports/états (tableaux, graphiques) à partir des données.\nOutils associés : SSMS (administration GUI), SQL Server Profiler (trace), sqlcmd, Database Engine Tuning Advisor.\n\nLangages :\n- T-SQL : dialecte procédural propriétaire pour le moteur relationnel (DDL, DML, DCL, TCL, procédures, triggers).\n- MDX (MultiDimensional eXpressions) : interrogation des cubes multidimensionnels SSAS.\n- DAX (Data Analysis eXpressions) : formules et mesures des modèles tabulaires SSAS / Power BI.\n\nOLTP vs OLAP :\n- OLTP (On-Line Transaction Processing) : nombreuses petites transactions concurrentes (insert/update/delete), schéma normalisé, priorité à l'intégrité et au temps de réponse. C'est le rôle du moteur relationnel.\n- OLAP (On-Line Analytical Processing) : peu d'utilisateurs analystes, requêtes complexes d'agrégation sur de grands volumes historiques, schéma dénormalisé (étoile/flocon), priorité à la rapidité de lecture/agrégation. C'est le rôle de SSAS.\nTrois différences OLTP/OLAP : usage (transactionnel vs analytique), modélisation (normalisé vs dénormalisé), volume/fréquence (beaucoup de petites écritures vs lectures massives agrégées)."
      },
      {
        "q": "Définissez procédure stockée et déclencheur (trigger), expliquez leurs différences, et montrez sur l'exemple d'une base de réservation comment un trigger maintient automatiquement le nombre de places disponibles d'une table.",
        "reponseAttendue": "Procédure stockée : bloc de code T-SQL nommé, précompilé et stocké dans la base, exécuté explicitement par l'utilisateur ou l'application avec EXEC nom_proc [params]. Avantages : réutilisation, réduction du trafic réseau, plan d'exécution mis en cache, encapsulation de la logique métier et meilleure sécurité (on accorde EXECUTE sans donner accès direct aux tables). Elle accepte paramètres d'entrée/sortie et valeur de retour.\nExemple : CREATE PROCEDURE InvitesParTable @id_table INT AS BEGIN SELECT I.nom FROM Invites I WHERE I.id_table = @id_table; END;\n\nDéclencheur (trigger) : type particulier de procédure stockée LIÉE à une table (ou vue) et exécutée AUTOMATIQUEMENT lors d'un événement DML (INSERT, UPDATE, DELETE) — AFTER ou INSTEAD OF. Il accède aux tables logiques 'inserted' (nouvelles lignes) et 'deleted' (anciennes lignes). On ne l'appelle jamais directement.\n\nDifférences clés :\n- Invocation : la procédure est appelée explicitement (EXEC) ; le trigger se déclenche automatiquement sur l'événement.\n- Paramètres : la procédure en accepte ; le trigger non (il lit inserted/deleted).\n- Usage : la procédure encapsule une logique réutilisable ; le trigger applique des règles d'intégrité/métier réactives et l'audit.\n\nMaintien automatique des places (cas du mariage / réservation) : on crée un trigger sur la table Commande (ou Invités) qui, à chaque INSERT, décrémente le champ 'places' de la table concernée, et à chaque DELETE le ré-incrémente :\nCREATE TRIGGER trg_MajPlaces ON Invites AFTER INSERT AS\nBEGIN\n  UPDATE T SET T.places = T.places - 1\n  FROM [Table] T\n  JOIN inserted i ON i.id_table = T.id_table;\nEND;\nAinsi, dès qu'un invité est affecté à une table, les places disponibles sont mises à jour sans intervention manuelle ; un trigger AFTER DELETE symétrique restaure la place libérée. Une contrainte CHECK (places >= 0) complète le dispositif pour empêcher le surnombre."
      }
    ]
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
    "placeholder": false,
    "resume": [
      {
        "titre": "Definition de la communication",
        "contenu": "La communication est le processus de transmission d'un message d'un emetteur vers un recepteur via un canal, dans le but de produire une comprehension partagee et eventuellement un changement de comportement. Elle repose sur le decodage correct du message et la presence d'un retour (feedback)."
      },
      {
        "titre": "Schema de Shannon-Weaver",
        "contenu": "Le modele canonique comporte sept elements : emetteur (source), message (information codee), canal (support de transmission), recepteur (destinataire), feedback (retour), bruit (perturbation) et contexte (situation). Le codage et le decodage assurent la mise en forme et l'interpretation du message."
      },
      {
        "titre": "Communication verbale vs non-verbale",
        "contenu": "La communication verbale utilise les mots (oral ou ecrit) ; la communication non-verbale passe par les gestes, postures, expressions du visage, regard, ton et silence. Le non-verbal accompagne, renforce ou contredit le verbal et porte une part importante du sens emotionnel."
      },
      {
        "titre": "Ecoute active",
        "contenu": "L'ecoute active consiste a comprendre reellement le message de l'interlocuteur avant de repondre, en se concentrant sur lui, en reformulant, en questionnant et en evitant de juger ou d'interrompre. Son objectif principal est de comprendre le message pour etablir une relation de confiance."
      },
      {
        "titre": "Communication interpersonnelle",
        "contenu": "Echange direct entre deux personnes (ou en petit groupe) en presence ou a distance. Elle se caracterise par l'immediatete du feedback, l'importance du non-verbal et l'adaptation au contexte relationnel des interlocuteurs."
      },
      {
        "titre": "Communication institutionnelle / corporate",
        "contenu": "La communication institutionnelle vise a promouvoir l'image, l'identite et la notoriete globale de l'entreprise (et non un produit precis) aupres de ses publics : valeurs, mission, responsabilite. Elle cible salaries, partenaires, medias, pouvoirs publics et grand public."
      },
      {
        "titre": "Communication marketing",
        "contenu": "La communication marketing a pour but de promouvoir un produit ou un service et d'influencer l'acte d'achat (publicite, promotion, marketing direct, communication digitale). Elle s'adresse aux clients et prospects et soutient les ventes et la differenciation face a la concurrence."
      },
      {
        "titre": "Communication interne vs externe",
        "contenu": "La communication interne s'adresse aux membres de l'entreprise (salaries, services) pour informer, motiver et federer ; la communication externe vise les publics exterieurs (clients, fournisseurs, medias, partenaires) pour vendre, informer et construire l'image. Toutes deux sont indispensables a la competitivite."
      },
      {
        "titre": "Communication electronique et Web 2.0",
        "contenu": "La communication electronique exploite les TIC et le Web 2.0 (site web, e-mailing, reseaux sociaux, blog, newsletter, podcast) pour diffuser l'information de maniere interactive, rapide et a faible cout. Elle augmente la visibilite, la reactivite et la notoriete de l'entreprise."
      },
      {
        "titre": "Objectifs cognitif, affectif et conatif",
        "contenu": "Une action de communication poursuit trois types d'objectifs : cognitif (faire connaitre, informer), affectif (faire aimer, creer une attitude favorable) et conatif (faire agir, declencher l'achat ou le comportement). Ils correspondent aux etapes du modele AIDA : Attention, Interet, Desir, Action."
      },
      {
        "titre": "Plan de communication",
        "contenu": "Document qui englobe toutes les actions necessaires pour guider la strategie de communication d'une entreprise. Ses etapes : analyser le contexte global, fixer les objectifs (strategie), determiner les cibles, definir les messages, choisir les outils/medias, puis elaborer et evaluer le plan."
      },
      {
        "titre": "Freins et obstacles a la communication",
        "contenu": "Les freins (bruits) peuvent etre techniques (canal defaillant), semantiques (vocabulaire mal compris), psychologiques (prejuges, emotions, stress), culturels ou organisationnels. Ils alterent le message ; on les reduit par la reformulation, la clarte, l'ecoute et le feedback."
      },
      {
        "titre": "Redaction administrative et professionnelle",
        "contenu": "La redaction administrative repond a des regles de clarte, concision, objectivite, courtoisie et respect des conventions de presentation. Elle privilegie un style neutre et precis ; ses ecrits types sont la lettre, la note de service, le compte rendu et le rapport."
      },
      {
        "titre": "Correspondance administrative",
        "contenu": "Une correspondance administrative comporte des elements normalises : en-tete (timbre/expediteur), references, objet, formule d'appel, corps du message structure, formule de politesse, signature et eventuelles pieces jointes. La lettre administrative entre services est impersonnelle, la lettre a caractere personnel s'adresse a un individu."
      },
      {
        "titre": "Prise de parole en public",
        "contenu": "La prise de parole efficace exige preparation (plan, message cle), maitrise du non-verbal (posture, regard, voix), gestion du trac et adaptation a l'auditoire. La structure type suit l'accroche, le developpement argumente et la conclusion percutante."
      },
      {
        "titre": "La reunion",
        "contenu": "Outil de communication interne collectif. Une reunion efficace requiert un ordre du jour, un animateur, un secretaire, un objectif clair, une duree maitrisee et un compte rendu diffuse. On distingue reunions d'information, de decision, de resolution de probleme et de brainstorming."
      },
      {
        "titre": "La contrefacon",
        "contenu": "La contrefacon est la reproduction ou imitation frauduleuse d'une marque, d'un produit ou d'une creation protegee, portant atteinte aux droits de propriete intellectuelle. On la combat par le depot de marque, la sensibilisation des consommateurs, les controles douaniers et les poursuites judiciaires."
      }
    ],
    "qcm": [
      {
        "q": "Quel est l'objectif principal de la communication verbale ?",
        "options": [
          "A) Influencer les autres physiquement",
          "B) Transmettre des informations pour etablir des relations et resoudre des problemes",
          "C) Ignorer le message",
          "D) Remplacer le non-verbal"
        ],
        "reponse": "B",
        "explication": "La communication verbale sert d'abord a transmettre l'information, etablir des relations et resoudre des problemes."
      },
      {
        "q": "Quel est le role de l'ecoute active dans la communication verbale ?",
        "options": [
          "A) Repondre au message immediatement",
          "B) Controler la conversation",
          "C) Comprendre le message de l'interlocuteur",
          "D) Ignorer le message"
        ],
        "reponse": "C",
        "explication": "L'ecoute active vise avant tout a comprendre reellement le message avant de reagir."
      },
      {
        "q": "Quel est l'avantage de la communication verbale par rapport a la communication non verbale ?",
        "options": [
          "A) Elle est plus rapide",
          "B) Elle est plus precise",
          "C) Elle est plus personnelle",
          "D) Elle est plus formelle"
        ],
        "reponse": "B",
        "explication": "Le langage verbal permet une plus grande precision dans la formulation et la comprehension du message."
      },
      {
        "q": "Que designe le terme 'feedback' dans le schema de la communication ?",
        "options": [
          "A) Le bruit qui perturbe le message",
          "B) Le canal de transmission",
          "C) Le retour du recepteur vers l'emetteur",
          "D) Le codage du message"
        ],
        "reponse": "C",
        "explication": "Le feedback est la reponse ou reaction du recepteur, qui ferme la boucle de communication."
      },
      {
        "q": "Dans le modele de Shannon-Weaver, qu'appelle-t-on 'bruit' ?",
        "options": [
          "A) Le message principal",
          "B) Toute perturbation qui altere la transmission du message",
          "C) Le recepteur",
          "D) Le retour d'information"
        ],
        "reponse": "B",
        "explication": "Le bruit designe toute interference (technique, semantique, psychologique) qui degrade le message."
      },
      {
        "q": "Un 'influenceur' sur les reseaux sociaux est principalement quelqu'un qui :",
        "options": [
          "A) Gere les serveurs d'une entreprise",
          "B) Oriente les opinions et comportements de sa communaute",
          "C) Redige uniquement des lois",
          "D) Repare le materiel informatique"
        ],
        "reponse": "B",
        "explication": "L'influenceur dispose d'une audience qu'il peut orienter, ce qui en fait un relais marketing."
      },
      {
        "q": "Qu'est-ce qu'un 'community manager' ?",
        "options": [
          "A) Le directeur financier",
          "B) Le responsable de l'animation et de la gestion des communautes en ligne",
          "C) Un developpeur back-end",
          "D) Un huissier de justice"
        ],
        "reponse": "B",
        "explication": "Le community manager anime, modere et federe la communaute d'une marque sur les reseaux sociaux."
      },
      {
        "q": "Qu'est-ce qu'un 'leader d'opinion' ?",
        "options": [
          "A) Une personne dont l'avis influence celui d'un groupe",
          "B) Le logiciel de gestion d'une marque",
          "C) Un type de bruit semantique",
          "D) Le canal de transmission"
        ],
        "reponse": "A",
        "explication": "Le leader d'opinion est une personnalite credible dont les avis orientent ceux de son groupe de reference."
      },
      {
        "q": "Qu'est-ce qu'un 'podcast' ?",
        "options": [
          "A) Un contenu audio (ou video) diffuse et ecoutable a la demande",
          "B) Une lettre administrative",
          "C) Un type de reunion",
          "D) Un bruit technique"
        ],
        "reponse": "A",
        "explication": "Le podcast est un contenu audio/video telechargeable et consultable a la demande, outil du Web 2.0."
      },
      {
        "q": "Qu'est-ce qu'un 'blog' ?",
        "options": [
          "A) Un site personnel ou d'entreprise publiant regulierement des articles",
          "B) Une formule de politesse",
          "C) Un compte rendu de reunion",
          "D) Un canal televise"
        ],
        "reponse": "A",
        "explication": "Le blog est un espace de publication d'articles dates, outil de communication digitale et de contenu."
      },
      {
        "q": "La communication institutionnelle a pour but principal de :",
        "options": [
          "A) Vendre un produit precis",
          "B) Promouvoir l'image et la notoriete globale de l'entreprise",
          "C) Reparer un bruit technique",
          "D) Remplacer la communication interne"
        ],
        "reponse": "B",
        "explication": "La communication institutionnelle (corporate) valorise l'image et l'identite de l'entreprise, pas un produit."
      },
      {
        "q": "La communication marketing vise principalement a :",
        "options": [
          "A) Federer le personnel interne",
          "B) Promouvoir un produit et influencer l'achat",
          "C) Rediger des notes de service",
          "D) Animer les reunions"
        ],
        "reponse": "B",
        "explication": "La communication marketing soutient la vente et l'achat d'un produit ou service."
      },
      {
        "q": "La communication interne s'adresse :",
        "options": [
          "A) Aux clients et fournisseurs",
          "B) Aux membres de l'entreprise (salaries, services)",
          "C) Uniquement aux medias",
          "D) Aux concurrents"
        ],
        "reponse": "B",
        "explication": "La communication interne cible les publics internes pour informer, motiver et federer."
      },
      {
        "q": "Quel objectif vise a 'faire agir' la cible (declencher l'achat) ?",
        "options": [
          "A) Cognitif",
          "B) Affectif",
          "C) Conatif",
          "D) Semantique"
        ],
        "reponse": "C",
        "explication": "L'objectif conatif vise le comportement et l'action (achat, adhesion)."
      },
      {
        "q": "Quel objectif vise a 'faire connaitre' et informer la cible ?",
        "options": [
          "A) Cognitif",
          "B) Affectif",
          "C) Conatif",
          "D) Technique"
        ],
        "reponse": "A",
        "explication": "L'objectif cognitif concerne la connaissance et la notoriete (faire savoir)."
      },
      {
        "q": "Quel objectif vise a 'faire aimer' et creer une attitude favorable ?",
        "options": [
          "A) Cognitif",
          "B) Affectif",
          "C) Conatif",
          "D) Organisationnel"
        ],
        "reponse": "B",
        "explication": "L'objectif affectif agit sur les sentiments et l'image (faire aimer)."
      },
      {
        "q": "Le modele AIDA decrit la sequence :",
        "options": [
          "A) Analyse - Information - Decision - Action",
          "B) Attention - Interet - Desir - Action",
          "C) Achat - Image - Diffusion - Audit",
          "D) Annonce - Interview - Debat - Avis"
        ],
        "reponse": "B",
        "explication": "AIDA = Attention, Interet, Desir, Action, etapes psychologiques de la persuasion publicitaire."
      },
      {
        "q": "Quelle est la premiere etape d'un plan de communication ?",
        "options": [
          "A) Choisir les outils",
          "B) Analyser le contexte global de l'entreprise",
          "C) Diffuser le message",
          "D) Evaluer les ventes"
        ],
        "reponse": "B",
        "explication": "On commence par analyser le contexte (diagnostic) avant de fixer objectifs, cibles et messages."
      },
      {
        "q": "Dans le plan de communication, apres avoir fixe les objectifs, on doit :",
        "options": [
          "A) Determiner les cibles",
          "B) Rediger le compte rendu",
          "C) Lancer la facturation",
          "D) Supprimer le feedback"
        ],
        "reponse": "A",
        "explication": "L'ordre logique : contexte, objectifs, cibles, messages, outils, elaboration."
      },
      {
        "q": "La contrefacon consiste a :",
        "options": [
          "A) Ameliorer un produit existant",
          "B) Reproduire frauduleusement une marque ou un produit protege",
          "C) Deposer une marque a l'INPI",
          "D) Faire une etude de marche"
        ],
        "reponse": "B",
        "explication": "La contrefacon est une imitation illicite portant atteinte a la propriete intellectuelle."
      },
      {
        "q": "Quel moyen permet de lutter efficacement contre la contrefacon ?",
        "options": [
          "A) Supprimer la marque",
          "B) Le depot de marque et les controles douaniers",
          "C) Baisser la qualite du produit",
          "D) Ignorer le phenomene"
        ],
        "reponse": "B",
        "explication": "La protection juridique (depot), les douanes et la sensibilisation luttent contre la contrefacon."
      },
      {
        "q": "La communication electronique repose principalement sur :",
        "options": [
          "A) Les TIC et les outils du Web 2.0",
          "B) Le courrier postal uniquement",
          "C) La reunion physique",
          "D) Le bouche-a-oreille seul"
        ],
        "reponse": "A",
        "explication": "Elle s'appuie sur Internet et les outils numeriques (site, mail, reseaux sociaux, blog)."
      },
      {
        "q": "Un avantage majeur de la communication electronique est :",
        "options": [
          "A) Son cout eleve et sa lenteur",
          "B) Sa rapidite, son interactivite et son faible cout",
          "C) L'absence de feedback",
          "D) Son caractere strictement oral"
        ],
        "reponse": "B",
        "explication": "Le numerique offre rapidite, large portee, interactivite et couts reduits."
      },
      {
        "q": "La lettre administrative a caractere personnel se distingue de la lettre entre services car elle :",
        "options": [
          "A) Est impersonnelle",
          "B) S'adresse nommement a un individu",
          "C) N'a pas d'objet",
          "D) Ne comporte pas de signature"
        ],
        "reponse": "B",
        "explication": "La lettre a caractere personnel s'adresse a une personne nommee ; la lettre entre services est impersonnelle."
      },
      {
        "q": "Quelle qualite est essentielle a la redaction administrative ?",
        "options": [
          "A) L'ambiguite",
          "B) La clarte et la concision",
          "C) Le langage familier",
          "D) La subjectivite"
        ],
        "reponse": "B",
        "explication": "L'ecrit administratif doit etre clair, concis, objectif et courtois."
      },
      {
        "q": "Lequel de ces elements fait partie d'une correspondance administrative ?",
        "options": [
          "A) Un hashtag publicitaire",
          "B) L'objet et la formule de politesse",
          "C) Un emoji",
          "D) Un slogan de marque"
        ],
        "reponse": "B",
        "explication": "L'objet, la formule d'appel et la formule de politesse sont des elements normalises de la lettre administrative."
      },
      {
        "q": "Pour une prise de parole en public reussie, il faut d'abord :",
        "options": [
          "A) Improviser totalement",
          "B) Preparer un plan et un message cle, et connaitre l'auditoire",
          "C) Lire mot a mot sans regarder le public",
          "D) Parler le plus vite possible"
        ],
        "reponse": "B",
        "explication": "La preparation (plan, message, connaissance de l'auditoire) conditionne l'efficacite de l'expose."
      },
      {
        "q": "Quel document formalise les decisions et echanges d'une reunion ?",
        "options": [
          "A) Le compte rendu (ou proces-verbal)",
          "B) Le slogan",
          "C) Le bon de commande",
          "D) Le podcast"
        ],
        "reponse": "A",
        "explication": "Le compte rendu (ou PV) consigne et diffuse les decisions prises en reunion."
      },
      {
        "q": "Quels sont des outils de communication EXTERNE d'une entreprise ?",
        "options": [
          "A) Note de service et intranet",
          "B) Publicite, site web et relations presse",
          "C) Reunion d'equipe interne",
          "D) Journal interne du personnel"
        ],
        "reponse": "B",
        "explication": "La publicite, le site web et les relations presse s'adressent aux publics externes."
      },
      {
        "q": "Le 'manager' dans une entreprise exerce notamment la fonction de :",
        "options": [
          "A) Planifier, organiser, diriger et controler",
          "B) Uniquement nettoyer les locaux",
          "C) Seulement signer les cheques",
          "D) Imiter les produits concurrents"
        ],
        "reponse": "A",
        "explication": "Les fonctions managériales classiques (Fayol) sont planifier, organiser, diriger/animer et controler."
      }
    ],
    "questionsOuvertes": [
      {
        "q": "Definissez la communication, presentez le schema complet de la communication (Shannon-Weaver) et expliquez le role de chaque composante.",
        "reponseAttendue": "La communication est le processus par lequel un emetteur transmet un message a un recepteur via un canal, en vue d'une comprehension partagee. Le schema de Shannon-Weaver comporte : 1) l'EMETTEUR (source) qui code le message ; 2) le MESSAGE, contenu informationnel mis en forme ; 3) le CANAL, support de transmission (voix, ecrit, reseau) ; 4) le RECEPTEUR qui decode et interprete ; 5) le FEEDBACK, retour du recepteur permettant de verifier la comprehension et de reguler l'echange ; 6) le BRUIT, toute perturbation (technique, semantique, psychologique) qui altere le message ; 7) le CONTEXTE, situation dans laquelle se deroule l'echange. Le codage (mise en signes) et le decodage (interpretation) sont essentiels : une communication reussie suppose un code commun, un canal adapte, un bruit minimal et un feedback effectif. Conclusion : la communication n'est efficace que lorsque le sens decode par le recepteur correspond a l'intention de l'emetteur."
      },
      {
        "q": "Comparez communication interne et communication externe de l'entreprise : definitions, cibles, objectifs et outils, en illustrant par des exemples dans l'environnement camerounais.",
        "reponseAttendue": "La communication INTERNE s'adresse aux membres de l'entreprise (salaries, services, directions) ; ses objectifs sont d'informer, motiver, federer, diffuser la culture d'entreprise et accompagner le changement. Outils : note de service, journal interne, intranet, reunions, affichage, messagerie interne. Exemple camerounais : une PME de Yaounde diffuse une note de service et anime une reunion hebdomadaire pour coordonner ses equipes. La communication EXTERNE vise les publics exterieurs (clients, prospects, fournisseurs, partenaires, medias, pouvoirs publics) ; ses objectifs sont de vendre, informer, construire l'image et la notoriete, fideliser. Outils : publicite (radio, affichage, reseaux sociaux), relations presse, site web, e-mailing, evenementiel, sponsoring. Exemple : un operateur telecom camerounais lance une campagne publicitaire et anime une page Facebook pour promouvoir un forfait. Les deux sont complementaires et indispensables a la competitivite : une communication interne efficace cree un climat social favorable qui soutient la performance et la coherence du discours externe."
      },
      {
        "q": "Une entreprise souhaite lancer un nouveau produit. En tant que responsable de la communication, elaborez le plan de communication etape par etape.",
        "reponseAttendue": "Plan de communication pour le lancement d'un nouveau produit : 1) ANALYSER LE CONTEXTE GLOBAL : diagnostic interne (forces/faiblesses, ressources) et externe (marche, concurrence, opportunites/menaces) - analyse SWOT. 2) FIXER LES OBJECTIFS : definir des objectifs cognitifs (faire connaitre le produit, notoriete), affectifs (creer une image favorable) et conatifs (declencher l'essai/l'achat), mesurables et dates. 3) DETERMINER LES CIBLES : identifier les publics vises (clients potentiels, prescripteurs, distributeurs) et les segmenter. 4) DEFINIR LES MESSAGES : construire un message cle clair, coherent avec le positionnement et adapte a chaque cible (axe et promesse). 5) CHOISIR LES OUTILS ET MEDIAS : selectionner les supports (publicite, reseaux sociaux, e-mailing, evenement de lancement, relations presse) selon la cible et le budget. 6) ELABORER ET PLANIFIER : etablir le calendrier, le budget et la repartition des actions. 7) METTRE EN OEUVRE ET EVALUER : deployer les actions puis mesurer les resultats (notoriete, ventes, engagement) au moyen d'indicateurs, et ajuster. Conclusion : un bon plan est coherent (objectifs-cibles-messages-outils) et evaluable."
      },
      {
        "q": "Definissez l'ecoute active et la communication non verbale, et montrez leur importance dans la communication interpersonnelle.",
        "reponseAttendue": "L'ECOUTE ACTIVE est une attitude d'ecoute qui vise a comprendre reellement le message de l'interlocuteur avant de repondre. Elle mobilise des techniques : concentration sur l'autre, reformulation (\"si je comprends bien...\"), questionnement, signes d'attention (regard, hochement), suspension du jugement et absence d'interruption. Son objectif principal est de comprendre le message et d'instaurer la confiance. La COMMUNICATION NON VERBALE regroupe tous les signaux non langagiers : gestes, postures, expressions du visage, regard, distance (proxemie), ton et debit de la voix, silences. Elle accompagne, renforce ou parfois contredit le verbal et transmet une large part de la charge emotionnelle et relationnelle. Importance en communication interpersonnelle : l'ecoute active reduit les malentendus, valorise l'interlocuteur et facilite la resolution de conflits ; le non-verbal permet de decoder les emotions, d'ajuster son discours et de garantir la coherence entre ce qui est dit et la maniere de le dire. Ensemble, ils ameliorent la qualite de la relation, la comprehension mutuelle et l'efficacite de l'echange."
      },
      {
        "q": "Qu'est-ce que la communication electronique ? Citez et expliquez quatre outils du Web 2.0 et montrez leur importance pour la communication d'une entreprise.",
        "reponseAttendue": "La communication electronique est la communication qui s'appuie sur les TIC et Internet, notamment les outils du Web 2.0 (web participatif et interactif), pour diffuser l'information de maniere rapide, interactive et a faible cout. Quatre outils du Web 2.0 : 1) LE SITE WEB / vitrine institutionnelle : presente l'entreprise, ses produits et permet le e-commerce, renforce la credibilite et la visibilite. 2) LES RESEAUX SOCIAUX (Facebook, LinkedIn, X) : permettent l'interaction directe avec les clients, l'animation de communaute (community management) et la diffusion virale des messages. 3) LE BLOG : publication reguliere d'articles (contenu/expertise) ameliorant le referencement et l'image de marque. 4) L'E-MAILING / NEWSLETTER : envoi cible et personnalise d'informations et d'offres, fidelisant la clientele a faible cout. (Le podcast et la video en ligne sont aussi possibles.) Importance pour l'entreprise : augmentation de la visibilite et de la notoriete, interaction et feedback immediats avec les cibles, ciblage precis, reduction des couts de communication, fidelisation et soutien aux ventes. Limites/freins a maitriser : fracture numerique, dependance technologique, gestion de l'e-reputation et besoin de competences specialisees."
      }
    ]
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
