# Conjugaison – Dictée complète (46 verbes)

Fichiers à publier sur GitHub Pages :

    german-cy/
      index.html             (application d'allemand existante, NE PAS remplacer)
      francais/
        index.html           (application française)
        data.js              (tableaux n° 1–46, pages 28–73)
        config.js            (options et objectif quotidien)

Déployer les trois fichiers dans le dossier `francais/` du dépôt `seay98/german-cy`.
Adresse après publication : https://seay98.github.io/german-cy/francais/

UTILISATION
- Par défaut : tous les verbes, tous les modes et tous les temps, ordre aléatoire.
- Choisir un verbe / mode / temps pour travailler une série précise.
- Chaque question porte sur TOUTES les personnes du temps choisi.
- Les formes doivent être écrites SANS pronoms : `ai`, `avons`, `suis venu`.
- Une question compte pour le défi quotidien seulement si toutes les réponses sont correctes.
- Les bonnes orthographes multiples du manuel sont acceptées, par exemple `paie / paye`.
- Le tableau du subjonctif imparfait/plus-que-parfait est limité à « il », conformément au manuel.
- `falloir` et `pleuvoir` sont interrogés à la seule troisième personne du singulier.
- Pour les verbes conjugués avec être, les réponses suivent les formes masculines du manuel : « venu / venus ».
- La mémoire est conservée dans localStorage (`french_cy_progress_v1`) du même domaine.
  Ne pas changer cette clé dans index.html et ne pas effacer les données du navigateur.
- Un bouton de sauvegarde JSON reste disponible en secours. Le stockage local n'est pas une sauvegarde cloud.

OPTIONS
Dans `config.js`, régler `DAILY_GOAL: 50` pour modifier la cible quotidienne.
Changer ce chiffre n'efface pas les résultats déjà enregistrés ni les dates étoilées.

SOURCE ET CONTRÔLE
Ce jeu a été rédigé à partir des 46 tableaux photographiés par l'utilisateur.
L'ordre, les temps, les personnes et les principales variantes ont été conservés.
Les composés sont construits à partir des tableaux des auxiliaires avoir/être de ce même manuel.
Pour les participes passés de l'auxiliaire être : accord masculin singulier/pluriel affiché dans les tableaux.
Les verbes dérivés cités en bas de chaque page ne sont pas ajoutés automatiquement.
