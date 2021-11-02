# ProjetJS LEFEBVRE Dylan
Grille de notation BACK (sur 33 points):
18 points

-----------------------------------------FAIT-------------------------------------------

Les users sont stockés en BDD : 1 point (ok)

Les mots de passe sont stockés en base de données sous forme hashée+salée avec bcryptjs : 1 point (ok)

Les parties sont stockées en BDD : 1 point (ok)

Les users ont des parties : 1 point (ok)

Une partie appartient à un seul user : 1 point (ok)

chaque participant peut se créer un compte : 2 points (ok)

chaque participant peut s'authentifier : 1 point (ok)

chaque participant peut se deconnecter : 1 point (ok)

On peut créer une nouvelle partie : 2 points (ok)

Il faut etre logué pour créer une partie : 1 point (ok)

On peut lister les parties : 2 points (ok)

Il faut etre logué pour lister les parties : 1 point (ok)

chaque joueur possède initialement 100 jetons : 1 point (ok)

le créateur de la partie peut supprimer cette partie : 1 point (ok)

on ne peut pas supprimer une partie dont on est pas le créateur : 1 point (ok)


---------------------------------PAS FAIT------------------------------------------

si l'utilisateur n'est pas l'adversaire, la partie sera affichée du point de vue d'un spectateur : 1 point

si l'utilisateur participe à la partie, la partie sera affichée du point de vue du joueur : 1 point

Chaque joueur mise en secret un certain nombre de jetons (entre 1 et 100) : 2 

Celui qui a misé le plus se voit retirer le montant de sa mise de ses jetons, mais voit le lot avancer d'un cran dans sa direction : 3 points

le joueur qui n'a pas remporté le pari garde sa mise et ne perd aucun jeton : 2 points

Les joueurs continuent à parier jusqu'à que le lot arrive sur l'emplacement d'un des joueurs : 1 point

Les joueurs continuent à parier jusqu'à que les deux joueurs n'aient plus de jetons : 1 point

Les joueurs continuent à parier jusqu'à 20 paris maximum : 1 point

Si le lot arrive sur l'emplacement d'un joueur, ce joueur remporte le lot (vainqueur), la partie est terminée : 3 points



Grille de notation FRONT (sur 24 points):
14 points (avec point bonus du dark mod)

-----------------------FAIT-------------------------------------

Il y a un bouton "créer un compte" : 2 points (ok)

Il y a un bouton "s'authentifier" : 1 point (ok)

Il y a un bouton "se deconnecter" : 1 point(ok)

Il y a un bouton "créer une nouvelle partie" : 2 points (ok)

On peut lister les parties : 2 points (ok)

Pour chaque partie de la liste, on voit son nom, son adversaire,son état, un lien pour afficher la partie : 1 point (ok)

On voit 11 emplacements contigus : 2 points(ok)

le créateur de la partie peut supprimer cette partie : 1 point(ok)

on ne peut pas supprimer une partie dont on est pas le créateur : 1 point(ok)

Darkmod (ok) 

-----------------------------------------PAS SUR---------------------------------

la partie sera mise à jour sans intervention de l'utilisateur : 3 points (pas sur, j'utilise un interval pour la liste des parties qui refresh la page avec vérif dans la console, mais pas sur que ce soit ce que vous vouliez, donx j'ai pas compté les points)

------------------------------------------EN COURS-------------------------------------

On peut miser : 3 points

------------------------------------------PAS FAIT-------------------------------------

si l'utilisateur n'est pas l'adversaire, la partie sera affichée du point de vue d'un spectateur : 1 point
si l'utilisateur participe à la partie, la partie sera affichée du point de vue du joueur : 1 point
On voit le nom et nombre de jetons des joueurs : 1 point

un pari est généré automatiquement après 30 secondes (entre 0 et le nombre de jetons du joueur) : 1 point

On voit le nom du gagnant : 1 point


