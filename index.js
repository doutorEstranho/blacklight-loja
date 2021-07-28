const express = require('express');
const db = require("./db")
const app = express();
const path = require("path")
const bodyParser = require("body-parser")
const Discord = require("discord.js")
const mary = new Discord.Client()
const helper = new Discord.Client()
const blStore = new Discord.Client()
blStore.login(process.env.tokenBS)

helper.login(process.env.tokenH)
mary.login(process.env.token)
blStore.on("ready",()=>{
    console.log("eae men")
    blStore.user.setActivity(`https://loja.blacklight.net.br`, {
        type:"STREAMING",
        url:"https://twitch.tv/C0desaas"
    })
})
mary.on("ready",()=>{
    console.log(`Logado na ${mary.user.username}`)
   


})// 531997885760536577
blStore.on("ready",()=>{
    console.log(`Logado no ${blStore.user.username}`)
    let canal = blStore.channels.cache.get("866778276034773002")
   canal.bulkDelete(99, true).then(a=>{
     canal.send(`esperando alg comprar na https://loja.blacklight.net.br ...`).then(msg =>{
             db.ref("status").update({
                     m: msg.id
             })
     })   
   })

})// 531997885760536577

helper.on("message", async(msg)=>{
        if(msg.guild.id != "866030396864069662" && msg.guild.id !="741810958057472000") return;
     //  if (msg.member.hasPermission('KICK_MEMBERS')) return;
if(msg.author.bot) return;
let palavroes = [
        "BOQUETE",
        "CARALHO",
        "KU",
        "PÊNIS",
        "PENIS",
        "FODENDO",
        "K.U",
        "K . U",
        "FUCK",
        "K U",
        "TOMANOCU",
        "CUCK",
        "FUDENDU",
        "POURA",
        "PU NHE TS",
        "VADIA",
        "PIRANHA",
        "BITCH",
        "SAFADA",
        "SE LASCAR",
        "CACHORRO",
        "PUTINHA",
        "PIRIGUETE",
        "CACHORRA",
        "PUNHETS",
        "P A U",
        "BOLSETA",
        "FODE",
        "ME FODE",
        "DO CARALHO",
        "FODA",
        "FODASE",
        "FODA-SE",
        "FODER",
        "NEM FODENDO",
        "PAU",
        "PIKA",
        "PICA",
        "PORRA",
        "PUTA",
        "PUNHETA",
        "CÚ",
        "XOXOTA",
        "XOTA",
        "CHOCHOCA",
        "SEX",
        "PRR",
        "BUCETA",
        "POULA",
        "YOUTUBE"
]

const regex = new RegExp(`(${palavroes.join('|')})`, 'ig')
if(regex.test(msg.content.toUpperCase())){
msg.delete() 
db.ref(`helper/warns/${msg.guild.id}/${msg.author.id}`).once("value").then(async s=>{
        let warns = 0
        if(!s.val()) return;
        if(!s.val().w) warns=0
        if(s.val().w) warns=s.val().w
        warns++
db.ref(`helper/warns/${msg.guild.id}/${msg.author.id}`).update({
        w: warns
}) 
if(warns >= 6){
        
db.ref(`helper/warns/${msg.guild.id}/${msg.author.id}`).set({})
        return msg.member.ban({reason: `MaryBan - rule#05 E294CPQ`})
}
return msg.reply(`REGRA #05 DIZ: sem falar palavrões de alto calão,
que beleza você desobedeceu e recebeu 1 warn(5 warns = ban) falta ${6-warns} pra receber ban
`)
})

        
}
})
app.post("/github",(req,res)=>{console.dir(req.body);res.json({status:"OK"})})
app.get("/discord", async(req,res)=>{
        res.redirect("https://discord.gg/9yKbEyrdgm")
})
app.get("/api",(req,res)=>{
        res.status(200).json({status:"200"})
})
app.use(bodyParser.json());
var cookieParser = require('cookie-parser');
app.use(cookieParser())
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.engine("html",require("ejs").renderFile)
app.use(express.static(path.join(__dirname,"public")))
app.get('/', (req, res) => {
  res.render("ind.html")
});
app.post("/web", (req,res) => {res.json({status:200}); console.log(req.body)})
//require("./teste")
app.get(`/${process.env.lol}/:tie`, async(req,res)=>{
    let valor = Number(req.params.tie)
    if(isNaN(valor)){
        return res.send(`Use https://loja.blacklight.net.br/:token:/:valor: na url`)
    }
    let letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    let gift = ''
    let num = 0
    for(let i =0;i<=18;i++) {
        let eae = Math.floor(Math.random()* letras.length)
        gift=`${gift}${letras[eae]}`
    }
    let aa1=""
    let aa2=""
    let aa3=""
    db.ref(`giftcards/${gift}`).set({
      value:valor,
      usado:false
    }).then(()=>{
        res.send(`Code gift card mary:<br/>valor: R$${valor}<br/>Code: ${gift}`)
        num++
    })
})
app.listen(3000, () => {
  console.log('Loja on');
});
/* Rendem gift */
app.get("/resgatar", async (req,res)=>{
 let co = req.cookies.session
 if(!co) return res.redirect("/logar")
let eaeMen=await db.ref("sessions/"+co).once("value")
if(!eaeMen.val()) return res.redirect("/logar")
res.render("resgate.html")
})
app.post("/resgatar", async (req,res)=>{
   let co = req.cookies.session
 if(!co) return res.redirect("/logar")
let eaeMen=await db.ref("sessions/"+co).once("value")
if(!eaeMen.val()) return res.redirect("/logar")
let id = eaeMen.val().author
let user = mary.users.cache.get(id)
if(!user){
    return res.send(`
    Fale alguma coisa num server que estou pra resgatar!
    `)
}
   let code = req.body.code 
   if(!id || !code) return res.redirect("/resgatar")
  let deb = await db.ref(`giftcards/${code}`)
  let val =await deb.once("value")
  if(!val.val()) return res.redirect(`/resgatar?err=1`)
  if(val.val().usado != false) return res.send(`Codigo já usado!`)
   deb.update({
       usado: true
   }).then(async()=>{
       let saldoAtual = 0 
       let lol = await db.ref(`saldo/${id}`).once("value")
       if(lol.val()) saldoAtual=lol.val().saldo
       if(!lol.val()) saldoAtual=0
      db.ref(`saldo/${id}`).update({
          saldo: saldoAtual+val.val().value
      }).then(()=>{
          saldoAtual=saldoAtual+val.val().value
          res.render("resgate/sucess.html",{
              user:user,
              db: val,
              saldoAtual
          })
      })
   })
   // res.json(req.body)
})
app.get("/@me/comprar-com-pix", async (req,res) => {
    let co = req.cookies.session
 if(!co) return res.redirect("/logar")
let eaeMen=await db.ref("sessions/"+co).once("value")
if(!eaeMen.val()) return res.redirect("/logar")
let user = mary.users.cache.get(eaeMen.val().author)
if(!user)return res.send(`Fale qualquer coisa em algum server que eu esteja pra eu te liberar essa página, depois de re load `)
    res.render(`pix.html`,{user})
})
app.get("/comprar-gift", async (req,res)=>{
 let co = req.cookies.session
 if(!co) return res.redirect("/logar")
let eaeMen=await db.ref("sessions/"+co).once("value")
if(!eaeMen.val()) return res.redirect("/logar")
let user = mary.users.cache.get(eaeMen.val().author)
if(!user)return res.send(`Fale qualquer coisa em algum server que eu esteja pra eu te liberar essa página, depois de re load `)
res.render("comprar-gift.html", {user})
})
/* Login */
app.get("/logar",async(req,res)=>{
    let co = req.cookies.session
 //if(co) return res.redirect("/")
let eaeMen=await db.ref("sessions/"+co).once("value")
if(eaeMen.val()) return res.redirect("/") 
res.render("log.html")
})
app.post("/logar", async function(req,res){
    let id = req.body.id
    let membro = mary.users.cache.get(id)
    if(!membro) return res.send(`Volte uma pagina e fale qualquer coisa no meu suporte`)
    let codigo = Math.floor(Math.random()*919999)+90000
    //codigo=String(codigo)
    let msg = `Seu codigo da MaryStore(https://loja.blacklight.net.br) é ${codigo}\nSe você não pediu esse codigo, apenas iguinore!`
   membro.send(msg).then(m=>{
        db.ref(`codes/${codigo}`).set({
       author:id
   }).then(()=>{
       res.render("login1.html",{id})
   m.delete({timeout:180000})
       
   })
   }).catch(e=>{
       res.send(`Alerta! ative sua dm antes de usar isso!`)
   })
   // res.send(codigo)
})
app.post("/logar/voc", async function(req,res){
    let body = req.body
    let ids ={
        pessoa: body.id,
        codigo: body.id1
    }
    if(!ids.pessoa || !ids.codigo){
        return res.redirect("/logar")
    }
    let dab =await db.ref(`codes/${ids.codigo}`).once("value")
    dab=dab.val()
    if(!dab) {
        return res.send(`Codigo invalido!`)
    }
    if(ids.pessoa != dab.author) {
        return res.send(`Codigo até existe, só que não é desse membro :(`)
    }
    
    let letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9','a','b']
    let session = ''
    for(let i= 0;i<=90;i++){
        let numero = Math.floor(Math.random()*letras.length)
        session=`${session}${letras[numero]}`
    }
    db.ref(`sessions/${session}`).set({author:ids.pessoa})
    res.cookie("session",session).redirect("/")
    db.ref(`codes/${ids.codigo}`).set({})
  //  res.json(body)
})
/* Products */
app.get("/products",async(req,res)=>{
    let co = req.cookies.session
 if(!co) return res.redirect("/logar")
let eaeMen=await db.ref("sessions/"+co).once("value")
if(!eaeMen.val()) return res.redirect("/logar") 
let p = await db.ref("products").once("value")
let rows ={
    um:"",
    dois:"",
    tres:""
}
let num = 1
let seta = new Set()
let array = Object.keys(p.val())
array.forEach(async(e) => { 
        let id = `${e}`
        let infoProduto = {
            id:id,
            nome: p.val()[e].name,
            desc: p.val()[e].desc,
            price: p.val()[e].price
        }
        seta.add(infoProduto)
    });
    let pe = Array.from(seta);
    let a = ""
    pe.map(e=>{
         let valo = String(e.price)
        if(num < 4){
        rows.um=`${rows.um}
<loja>
<h1>${e.nome}</h1>
<h2>${e.desc}</h2>
<h3>Por: R$${valo.replace(".",",")}
</h3>
<a href="/buyau/cat${e.id}iau"><button>Comprar</button></a>
</loja>  `    
        }else if(num<8){
          rows.dois=`${rows.dois}
<loja>
<h1>${e.nome}</h1>
<h2>${e.desc}</h2>
<h3>Por: R$${valo.replace(".",",")}
</h3>
<a href="/buy/${e.id}"><button>Comprar</button></a>
</loja>     `  
        } else if(num <12){
            rows.tres=`${rows.tres}
<loja>
<h1>${e.nome}</h1>
<h2>${e.desc}</h2>
<h3>Por: R$${valo.replace(".",",")}
</h3>
<a href="/buy/${e.id}"><button>Comprar</button></a>
</loja>     `
        }
        
      num++
    })
   // console.dir
   let saldou = 0
   db.ref(`saldo/${eaeMen.author}`).once("value").then(async saldoh =>{
      res.render("products.html",{
       products: rows,
   }) 
   })
   
})
/* Gerador code*/
function gerar(valo){
    let valor = Number(valo)
    let letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    let gift = ''
    for(let i =0;i<=30;i++) {
        let eae = Math.floor(Math.random()* letras.length)
        gift=`${gift}${letras[eae]}`
    }
  // db.ref(`giftcards`).set({rai:"lorena"})
    db.ref(`giftcards/${gift}`).set({
      value:valor,
      usado:false
    }).then(()=>{
       // return gift
    }) 
    return gift
}
//console.dir(gerar(1000))
/* auto-drops */
helper.on("ready",async()=>{
setInterval(()=>{
    let canai =[
{id:"865346327332519989",value:5},
{id:"865346364237152302",value:10},
{id:"865346479975825428",value:15},
{id:"865346508819660800",value:20},
{id:"865346556202188831",value:50},

]

},1000)
   setInterval(()=>{
       let i = Math.floor(Math.random()*99999)+10000
    let i1 = Math.floor(Math.random()*99999)+10000
      // console.log(`1: ${i} 2: ${i1}`)
       if(i == i1){
         //olha dc
           let valores = ["5","5","5","5","5","5","5","5","5","5","10","10","10","10","10","10","10","10","15","15","15","15","15","15","15","20","25","50","5","50","50","5","5","5","50", "100", "10", "10", "100", "100",] 
           let num = Math.floor(Math.random()* valores.length)
           let valor = valores[num]
           let codigo = gerar(valor)
           let messa = `
===========MaryDrop===========
Valor: ${valor}
Code: \`${codigo}\`
Resgate aqui: https://loja.blacklight.net.br/resgatar
Menção:<@&865966976181731379>
==============================
           `
helper.channels.cache.get("865952953549586432").send(messa)
       }
       
   },1000) 
   setInterval(()=>{
       let canai = [
{id:"865346327332519989",value:5, "guild":"865345885151428608"},
{id:"865346364237152302",value:10, "guild":"865345885151428608"},
{id:"865346479975825428",value:15, "guild":"865345885151428608"},
{id:"865346508819660800",value:20, "guild":"865345885151428608"},
{id:"865346530139701258",value:50, "guild":"865345885151428608"},
{id:"865346556202188831",value:100, "guild":"865345885151428608"},
{id:"865350702457028649",value:200, "guild":"865345885151428608"},

]
canai.map(c =>{
    let valor = c.value
    let canal = helper.guilds.cache.get(c.guild).channels.cache.get(c.id)
    if(!canal) return;
    let code = gerar(c.value)
    canal.send(`
Code gift card mary:
valor: R$${valor}
Code: ${code}
    `)

})
   },10000000)
})
app.get("/sua-namorada-agora",(req,res)=>{
        res.render("bugs.html")
})
/* Buy product */
app.get("/buyal/cat:id",async(req,res)=>{
      let co = req.cookies.session
 if(!co) return res.redirect("/logar")
let eaeMen=await db.ref("sessions/"+co).once("value")
if(!eaeMen.val()) return res.redirect("/logar")  
let {id} = req.params
id=id.replace("au")
let user = mary.users.cache.get(eaeMen.val().author)
if(!user) return res.send(`Fale qualquer coisa no meu suporte!`)
let product = await db.ref(`products/${id}`).once("value")
product=product.val()
if(!product) return res.redirect("https://loja.blacklight.net.br/products")
let preco = product.price
//res.send(`Nome: ${product.name}`)
let saldo = await db.ref(`saldo/${user.id}`).once("value")
saldo=saldo.val().saldo
if(preco>saldo) {
    return res.send(`Você tem ${saldo}, lhe falta R$${preco-saldo} pra comprar isso!`)
}
db.ref(`saldo/${user.id}`).update({
    saldo: saldo-preco
}).then(()=>{
 blStore.channels.cache.get("865963739761344522").send(`
<@&865966976181731379>
==========COMPRA==========
User: ${user.tag}(${user.id})
Produto: ${product.name}
Preço: R$${String(product.price).replace(".",",")}

==========================
`).then(async()=>{
        let dbj = await db.ref("status")
        let vals = await dbj.once("value")
        vals=vals.val()
        dbj.update({
                buys: Number(vals.buys)+1,
                buys1: Number(vals.buys1)+1,
                gastos: Number(vals.gastos)+product.price,
                gastos1: Number(vals.gastos1)+product.price
                
                
        })
        let date = new Date()
let embed = new Discord.MessageEmbed()
embed.setTitle(`Status da lojinha <3`) 
embed.setDescription(`Url: [aqui](https://loja.blacklight.net.br)
\`${vals.buys+1}\` compras no total
\`${vals.buys1+1}\` compras hoje

\`R$${String(Number(vals.gastos + product.price).toFixed(2)).replace(".",",")}\` reais gastos no total
\`R$${String(Number(vals.gastos1 + product.price).toFixed(2)).replace(".",",")}\` reais gastos hoje
Ultimo comprador: ${user.tag}(${user.id}) comprando: ${product.name}
`)
embed.setFooter(`BlacklightStore© 2021-${date.getFullYear()} todos os direitos reservados`)
let msg = await blStore.channels.cache.get("866778276034773002").messages.cache.get(String(vals.m))
try {
    msg.edit("",{
embed: embed
})
} catch(e) {
let canal = blStore.channels.cache.get("866778276034773002")
   canal.bulkDelete(99, true).then(a=>{
     canal.send(embed).then(msg =>{
             db.ref("status").update({
                     m: msg.id
             })
     })   
   })
}

  res.send(`Enviando mensagem pro ademir falando que vc quer comprar!`)
  
})  
})

})
function quatro04(r,rs){
    rs.status(404).render("404.html")
}
app.use(quatro04)
let rotas = {
        me: require('./routes/me.js')
}
app.get("/me",rotas.me)
app.get("/minerar-mcoins", async (req,res) => {

})
app.use("/app",require("./routes/android/app"))