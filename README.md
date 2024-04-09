**Sommaire:** Outil pour faciliter le téléchargement des données de l'API Météo-France.

#### 1. Problématique et proposition de valeur


Actuellement, les packages de données sur meteodata.gouv ont des volumes trop importants. Dans le cas où l’utilisateur a besoin de télécharger, pour un modèle de prévision donné, plusieurs paramètres météo sur plusieurs échéances à plusieurs niveaux d’altitude, le volume de données atteint plusieurs Go, ce qui n’est pas compatible avec une utilisation ciblée.

Le projet réalisé veut répondre à cette problématique de volume de données trop conséquent. Pour cela,  nous proposons de limiter le volume des fichiers téléchargés en préselectionnant les critères ciblés en amont.


#### 2. Solution

La solution apportée est une interface-homme-machine html qui permet de sélectionner pour AROME, modèle pris en exemple, les différents critères de coverage API avant le téléchargement d’un GRIB2.
Il est possible de choisir, après avoir renseigné sa clé token, émise automatiquement via le portail API de MF, les critères suivants :

- la latitude
- la longitude
- le paramètre météorologique
- le réseau du modèle
- l’altitude
- l’échéance

Après la sélection des différents critères, on télécharge un monogrib GRIB2 en local avec un volume beaucoup plus restreint, et donc un transfert beaucoup plus rapide. Cette solution réduit également les capacités de stockage.

Dans ce projet les données sont la source de l’application. L'objectif est de faire des requêtes API sur des données disponibles en Open Data.

Nous avons créé une page HTML avec un script JavaScript qui permet la facilitation des requêtes vers l'API de Météo-France pour ceux qui n'ont pas les compétences techniques pour y accèder.


#### 3. Impact envisagé
Le temps pour sélectionner et télécharger les données serait beaucoup plus réduit.
L'API permet de télécharger uniquement les données nécessaires.

Les personnes ciblées sont celles qui connaissent et utilisent déjà le service Publithèque qui ne sera bientôt plus disponible. L'API peut être dédiée également aux utilisateurs qui ont une idée précise des paramètres qu'ils veulent exploiter sur une zone dédiée.

#### 4. Ressources

Lien vers le code et la documentation: 
https://github.com/guylifshitz/meteofrance-easyaccess

API Météo-France:
https://portail-api.meteofrance.fr/web/

#### 5.Retours sur la qualité des données exploitées

Impossibilité de filtrer les données sur le site meteodata.gouv, nécéssitant l'utilisation de l'API de Météo-France et des compétences de développement pas forcément existantes chez les utilisateurs de données. 
Les packages de données de modèles de prévisions ne sont pas lisibles par certains utilitaires type panoply ou xygrib.


