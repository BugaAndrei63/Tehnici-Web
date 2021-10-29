

/*ETAPA 4 EX1 */
const express = require('express'); //includem un modul din node_modules
/*ETAPA 4 EX1 */

const app = express(); // obiectul server
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const {Client} = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'Andrei',
    password: 'SYSTEM',
    database: 'TWProiect',
    port: 5432
})

client.connect();


app.set("view engine", "ejs"); // sistem de templateizare

app.use("/Resurse",express.static(__dirname+"/Resurse") ); //este un middle wear gen spatiu de procesare intermediar, gen daca vine 
//cererea cu /resurse vine aici, facem folderul resurse static ca sa se duca la calea asta 
//cu "/" este localhost, dam functie callback care se apeleaza cand ii vine momentul, req e cererea(am numit-o arbitrar), res e raspuns

function verificaImagini()
{
    var textFisier = fs.readFileSync("Resurse/json/galerie.json");
    var jsi = JSON.parse(textFisier);
    var caleGalerie = jsi.cale_galerie;
    let vectorCai = [];
    

    for(let im of jsi.imagini)
    {
        var imVeche = path.join(caleGalerie, im.fisier);
        var ext = path.extname(im.fisier);
        var numeFisier = path.basename(im.fisier,ext);
        let imNoua = path.join(caleGalerie+"/mic/",numeFisier+"-mic"+".webp");

        var data = new Date;
        var dataLuna = data.getMonth();
        var picDate;
        var simMonth;
        switch(im.anotimp)
        {
            case "iarna":
                picDate = 0;
                break;
            case "vara":
                picDate = 1;
                break;
            case "primavara":
                picDate = 2;
                break;
            case "toamna":
                picDate = 3;
                break;
        }

        switch(data.getMonth())
        {
            case 11:
            case 0:
            case 1:
                simMonth = 0;
                break;
            case 2:
            case 3:
            case 4:
                simMonth = 2;
                break;
            case 5:
            case 6:
            case 7:
                simMonth = 1;
                break;
            case 8:
            case 9:
            case 10:
                simMonth = 3;
                break;
        }

        if(simMonth == picDate && vectorCai.length < 13)
        {
            vectorCai.push({mare:"/"+imVeche,mic:"/"+imNoua,text_descriere: im.text_descriere,titlu: im.titlu,anotimp: im.anotimp});
        }
        if(!fs.existsSync(imNoua))
            sharp(imVeche)
                .resize(150)
                .toFile(imNoua,function(err){
                    if(err)
                    console.log("eroare conversie",imVeche,"->",imNoua,err);
                })
        
    }
    return vectorCai;
}

function ImaginiAnimate()
{
    var textFisier = fs.readFileSync("Resurse/json/galerie.json");
    var jsi = JSON.parse(textFisier);
    var caleGalerie = jsi.cale_galerie;
    let vectorCaiAnim = [];
    var numere = [9,12,15]
    const randomPos = Math.floor(Math.random()*numere.length);
    var randomNum = numere[randomPos]

    for(let im of jsi.imagini)
    {
        var imVeche = path.join(caleGalerie, im.fisier);
        var ext = path.extname(im.fisier);
        var numeFisier = path.basename(im.fisier,ext);
        let imNoua = path.join(caleGalerie+"/mic/",numeFisier+"-mic"+".webp");
        
        if(vectorCaiAnim.length < randomNum && im.galerie_animata == "true")
            vectorCaiAnim.push({mare:"/"+imVeche,mic:"/"+imNoua,text_descriere: im.text_descriere,titlu: im.titlu});
            
        if(!fs.existsSync(imNoua))
            sharp(imVeche)
                .resize(150)
                .toFile(imNoua,function(err){
                    if(err)
                    console.log("eroare conversie",imVeche,"->",imNoua,err);
                })
        
    }
    return vectorCaiAnim;
}

/*ETAPA 4 EX6 */
app.get(["/","/index"], function(req,res){ 
    var ip = req.ip;
    
    res.render("pagini/index", {"ip":ip, imagini:verificaImagini(), imaginianim: ImaginiAnimate()});            
}); //punem calea relativa la folderul special views(folderul view engine ului) 
/*ETAPA 4 EX6 */

app.get("/account", function(req,res){ 
    
    res.render("pagini/account");  
});
app.get("/login", function(req,res){ 
    
    res.render("pagini/login");  
});
app.get("/signup", function(req,res){ 
    
    res.render("pagini/signup");  
});
app.get("/gallery", function(req,res){ 
    
    res.render("pagini/galerie",{imagini:verificaImagini()});  
});

/* ETAPA 5 EX4*/
app.get("/games", function(req,res){ 
    
    
    var conditie = req.query.categ ? " where gen_principal='"+req.query.categ+"'" : "";
    console.log("select * from games"+conditie)
    
    const rezultat = client.query("select * from games"+conditie, function(err,rez){
        console.log(rez.rows)
        res.render("pagini/games",{games:rez.rows});  
    });
    
    
});
/* ETAPA 5 EX4*/

/* ETAPA 5 EX2*/
app.get("/ar_ent_:id", function(req,res){ 
    
    const rezultat = client.query("select * from games where id ="+req.params.id, function(err,rez){
        
        res.render("pagini/ar_ent_",{games:rez.rows[0]});  
    });

    
});
/* ETAPA 5 EX2*/

app.get("/action", function(req,res){ 
    
    res.render("pagini/action");  
});
app.get("/FPS", function(req,res){ 
    
    res.render("pagini/FPS");  
});
app.get("/Horror", function(req,res){ 
    
    res.render("pagini/Horror");  
});


app.get("/firma", function(req,res){ 
    
    res.render("pagini/firma");  
});
/*ETAPA 4 EX10 */
app.get(["/Resurse","/Resurse/json","/Resurse/json/galerie","/Resurse/json/galerie.json"], function(req,res){ 
    
    res.render("pagini/403");  
});
/*ETAPA 4 EX10 */

/*ETAPA 4 EX7 */
app.get("/*", function(req,res){  //functie generala pentru returnarea paginilor
    res.render("pagini"+req.url,function(err,rezultatRender){
        if(err)
        {
            if(err.message.includes("Failed to lookup view"))
            {
                res.status(404).render("pagini/404");
            }else
            {
                throw err;
            }
        }else
        {
            res.send(rezultatRender);
        }
    });  
});
/*ETAPA 4 EX7 */

/*ETAPA 4 EX1 */
app.listen(8080); //un port des folosit pentru web
/*ETAPA 4 EX1 */
console.log("Server pornit.");