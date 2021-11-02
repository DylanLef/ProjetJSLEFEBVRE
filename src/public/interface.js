

const DateTime = luxon.DateTime;
let session;
document.addEventListener('DOMContentLoaded', async (req, res) => {

    fetch('/session').then((userdata) => {

        return userdata.json()

    }).then((reponseUser)=>{

        if (reponseUser.userid == undefined || reponseUser.userid == null){
            window.location.replace("/")
        } else{
            session = reponseUser;
            
            if (window.location.pathname.startsWith("/lobby")) {
                const interval = 5;
                const validTime = [0,5,10,15,20,25,30,35,45,50,55];
            
                let next_time = DateTime.now();
                let check = validTime.find(t => t >= next_time.second);
                let cloak_time = (check) ? check : validTime[0];
            
                let params = {};
                if (cloak_time == 0) {
                    params.minutes = next_time.minute + 1;
                    params.seconds = 0;
                } else {
                    params.seconds = cloak_time;
                }
                let new_time = DateTime.now().set(params);
            
                refreshGames();
                recupUser();
            
                setTimeout(async () => {
                    setInterval(async () => {
            
                        console.log("Refresh de 5 secondes");
                        await refreshGames();
                        await recupUser();
            
            
            
                    }, interval * 1000);
            
            
            
                }, new_time.diff(DateTime.now()).toObject().milliseconds)
            
            }

            async function refreshGames() {
                const liste = document.querySelector(".listeDesParties");
                let MaSession= session;
                let actualItems = [];
            
                for (let index = 0; index < liste.children.length; index++) {       //stocke tt les id déjà existant
                    const element = liste.children[index];
                    actualItems.push(element.id);
                }
            
                await fetch("/recupGames").then(reponse => reponse.json())
                    .then(async data => {
                        data.forEach(async game => {
            
                            await actualItems.splice(actualItems.indexOf(game._id), 1); // retire l'élément de la liste
            
                            if (document.getElementById(game._id)) {
                                let item = document.getElementById(game._id);
                                if (game.createur == MaSession.userid){
                                    item.innerHTML = " Nom de la partie: " + game.nomPartie + "<br> Joueur 1: " + game.j1.nomJ1 + "<br> Joueur 2 : " + game.j2.nomJ2 + "<br> Etat : " + game.statue +"<br><form action='/supprimer/'"+game._id+"' method='get'><button class='btn btn-primary btn-sm' type='submit'>Supprimer</button></form> "
                                    +"<br> <a href='/rejoindre/"+game._id+"'><button class='btn btn-primary btn-sm' type='submit'" + game._id +"'>Rejoindre</button></a>";
                                }else{
                                    item.innerHTML = " Nom de la partie: " + game.nomPartie + "<br> Joueur 1: " + game.j1.nomJ1 + "<br> Joueur 2 : " + game.j2.nomJ2 + "<br> Etat : " + game.statue 
                                    +"<br> <a href='/rejoindre/"+game._id+"'><button class='btn btn-primary btn-sm' type='submit'" + game._id +"'>Rejoindre</button></a>";    
                                }
                                
            
            
                            }
                            else {
                                let li = document.createElement("li");
                                li.id = game._id
                                if (game.createur==MaSession.userid){
                                    li.innerHTML =" Nom de la partie: " + game.nomPartie + "<br> Joueur 1: " + game.j1.nomJ1 + "<br> Joueur 2 : " + game.j2.nomJ2 + "<br> Etat : " + game.statue +"<br><form action='/supprimer/" +game._id+"' method='get'><button class='btn btn-primary btn-sm' type='submit'>Supprimer</button></form> "
                                    +"<br> <a href='/rejoindre/"+game._id+"'><button class='btn btn-primary btn-sm' type='submit'" + game._id +"'>Rejoindre</button></a>";;
                                liste.appendChild(li);
                                }else{
                                    li.innerHTML = " Nom de la partie: " + game.nomPartie + "<br> Joueur 1: " + game.j1.nomJ1 + "<br> Joueur 2 : " + game.j2.nomJ2 + "<br> Etat : " + game.statue  
                                    +"<br> <a href='/rejoindre/"+game._id+"' method='get'><button class='btn btn-primary btn-sm' type='submit'" + game._id +"'>Rejoindre</button></a>";
                                liste.appendChild(li);
                                }
                                
                                
            
                            }
            
                        });
                    })



                await actualItems.forEach(actualItem => {       // récupère l'item et le supprime ( supprime les game qui n'existe plus )
                    let obj = document.getElementById(actualItem);
                    obj.parentNode.removeChild(obj);
                })
            }
            
        }

    })


    async function recupUser() {
        const liste = document.querySelector(".adversaire");
      
        let actualItems = [];
    
        for (let index = 0; index < liste.children.length; index++) {       //stocke tt les id déjà existant
            const element = liste.children[index];
            actualItems.push(element.id);
        }
    
        await fetch("/recupAdver").then(reponse => reponse.json())
            .then(async data => {
                data.forEach(async game => {
    
                    await actualItems.splice(actualItems.indexOf(game._id), 1); // retire l'élément de la liste
    
                    if (document.getElementById(game._id)) {
                        let item = document.getElementById(game._id);
                        
                        item.innerHTML = game.Username
                        liste.appendChild(item)
                    }
                    else {
                        let option = document.createElement("option");
                        option.id = game._id
                        
                        option.innerHTML = game.Username
                        liste.appendChild(option)

                        
                    }
    
                });
            })



        await actualItems.forEach(actualItem => {       // récupère l'item et le supprime ( supprime les game qui n'existe plus )
            let obj = document.getElementById(actualItem);
            obj.parentNode.removeChild(obj);
        })
    }
    
})

