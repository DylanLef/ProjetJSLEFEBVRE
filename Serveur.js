//VERSION FINAL PAS FINI

//----------------------------REQUIS--------------------------------------

const express = require('express'); // intégration du module express
const app = express();  // attribution du module dans une variable
const methodOverride = require("method-override");
const crypte = require('bcrypt')

const session = require('express-session')
const MongoDB = require('connect-mongodb-session')(session)
const cookie = require("cookie-parser")

const mongoose = require('mongoose'); //intégration du module mongoose
const passport = require('passport');
const { MongoRuntimeError } = require('mongodb');
const cookieParser = require('cookie-parser');
const { send } = require('process');


//--------------------------------app.use------------------
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static("./src/public"))
app.use(express.json());
app.use(cookieParser());

//----------------------------app.set------------------------
app.set("views","./src/public");
app.set("view engine", "ejs");

//------------------------Connexion à la BDD---------------------------
const coBase = "mongodb://localhost:27017/Jeu"

 mongoose.connect(coBase, { useNewUrlParser: true }).then(() => //connection en localhost
    console.log("Connected to Mongo…")).catch((error) =>                                //affiche message
        console.log(error.message))

//---------------------SHEMAS:--------------------
const ListeUtilisateur = mongoose.Schema({
    Username: {
        type: String,
        required: [true, 'Vous devez renseigner un nom'],
    },
    mdp: {
        type: String,
        required: [true, 'Vous devez renseigner un mot de passe'],
    },
    isPublished: Boolean

});
const ListeParties = mongoose.Schema({
    nomPartie: String,
    lot: { type: Number, required: true, default: 6},
    j1: {
        nomJ1: {type: String, required: true},
        jetons: {type: Number, default:100},
        isConnected: {type: Boolean, required: true, default: false},
    },
    j2: {
        nomJ2: {type: String, required: true},
        jetons: {type: Number, default:100},
        isConnected: {type: Boolean, required: true, default: false},
    },
    round: {type: Number, required: true, default: 1},
    spectateur: {type: Array},
    statue: {type: String, enum: ['en Attente','En cours', 'Terminé'], default:'en Attente'},
    createur: String,
    miseJ1: { type:Number, default: 0, min : 0, max : 100} ,
    miseJ2:   {type: Number, default: 0, min : 0, max : 100},
    date: {type: Date, default: Date.now},

})


const sessionShema = new mongoose.Schema({
    session:{
        isAuth: Boolean,
        userid: String
    }
})
//--------------------Créarion des shémas-----------------------
const listeusers = mongoose.model("listeusers", ListeUtilisateur);
const listeParties = mongoose.model("ListeParties", ListeParties);
const listeSessions = mongoose.model("sessions", sessionShema);


//-----------------REQUÊTES-----------------
async function createUsers(username, mdp) {
    const user = new listeusers({
        Username: username,
        mdp: mdp,
        isPublished: true

    });
    const result = await user.save();
    console.log(result);
}

async function createGame(nom,joueur1,joueur2, createur) {
    const Game = new listeParties({
        nomPartie: nom,
        j1: {
            nomJ1: joueur1,
        },
        j2: {
            nomJ2: joueur2,
        },  
        
        createur: createur
        

    });
    const result = await Game.save();
    console.log(result);
}
//---------------------------------Session---------------------------------------

const store =new MongoDB({
    uri : coBase,
    collection: 'sessions'
})


app.use(session({
    secret: 'Clepriveeanepasdonnercarilsontpasbesoindelavoir',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 3600000},
    store: store
  }))

  app.get('/',(req,res)=>{
    if(req.session.isAuth === true){
     res.redirect('/ListeParties.ejs');
    }else
    res.sendfile('Index.html') 
  
 });
 
 app.get('/',(req,res) => {

    if(req.session.isAuth === true){
        res.redirect('/listeDesParties.ejs');
    }else
    res.sendFile('Index.html')
});

app.post('/connexion',async (req,res) => {
    await listeusers.findOne({
        
            Username: req.body.name
        
    }).then(function (user) {
        if (!user) return res.redirect('/connexion.html');

        
        crypte.compare(req.body.mdp, user.mdp, function (err, result) {
            if (!result) return res.redirect('/connexion.html');

            req.session.isAuth = true
            req.session.userid = req.body.name

            req.session.user = {
                id: user._id, 
                username: user.name
            };

            res.redirect('/lobby');
        });
    });
});
 
 
 app.get('/logout', (req,res)=>{
     req.session.destroy();
     res.redirect('/')
 })
 


 
//-----------------------Express /user--------------------------
app.post("/user", async (req, res) => {  // récupère les info contenue dans les champs du fichier html qui sont dans la balise form avec le chemin correspondant

    crypte.hash(req.body.mdp, 10)
        .then((hash) => {
            createUsers(req.body.name, hash);
        })
        .catch((error) => res.status(500).json({ error }))
    res.redirect("/connexion.html")

})


//--------------------------------Express /partie--------------------------
app.post("/partie", (req, res) => {  // récupère les info contenue dans les champs du fichier html qui sont dans la balise form avec le chemin correspondant
    createGame(req.body.name,req.session.userid, req.body.adver, req.session.userid);
    res.redirect("/lobby")
})

app.get("/lobby",(req,res)=>{
    if(!req.session.user)return res.redirect("/connexion.html")
    res.render("ListesParties.ejs")
})

app.get("/recupGames", async (req, res)=>{
    await listeParties.find().then((game)=>{
        res.json(game)
    })
})

app.get("/recupInfos", async (req, res)=>{
    await listeParties.find().then((game)=>{
        res.json(game)
    })
})


app.get("/recupJoueur", async (req,res)=>{
    await listeParties.find().then((joueurs)=>{
        res.json()
    })
})



app.get("/supprimer/:id" , async (req, res)=>{
   
    listeusers.findOne({"_id" : req.params.id} , '_id', async function(err, suppr){
    await listeParties.deleteOne({'_id' : req.params.id})
    res.redirect("/lobby");
})

})



const rejoindre = (req, res) =>{
    res.render('jeu.ejs')
}

app.get('/rejoindre/:id', async (req, res) => {
    if (!req.session.user) return res.redirect('/lobby');
    let game = await listeParties.findById(req.params.id)
    if (!game) return res.redirect("/lobby");

    let user1 = await listeusers.findOne({"Username":game.j1.nomJ1});
    let user2 = await listeusers.findOne({"Username":game.j2.nomJ2});

    let type = null;

    if (user1.id == req.session.user.id || user2.id == req.session.user.id) {
        type = true;
    } else {
        type = false;
    }
    res.render('Jeu.ejs', {game: game, user1: user1, user2: user2, isplayer: type})
});



app.get('/session', (req, res) => {

    res.json(req.session)

})

app.get('/recupAdver', async (req,res)=>{
await listeusers.find().then((users)=>{
    res.json(users);
})
})

//Pas fini de faire la mise

// app.post('/miseJ1/:id' , async (req,res)=>{
// let miseJ1 = req.body.miseJ1
// console.log(miseJ1);
// await listeParties.updateOne({miseJ1: {_id : "61814b91850ce9e29db9ddfd" }, }, {$set:{miseJ1: miseJ1}})
// })
// app.post('/miseJ2', async(req,res)=>{
// })


//-------------------------Ecoute du serveur-------------------------
app.listen(3000, () => { // écoute ce qu'il se passe sur le port 3000
   
    console.log("Server démarré.");   // affiche le texte
});



