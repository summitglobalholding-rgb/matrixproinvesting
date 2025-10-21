import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const users = [
  { email: "admin@matrix", pass: "Reverse.rvs3", name: "Admin", role: "admin" }
];
const friends = [
  { name: "Marco", status: "Attivo" },
  { name: "Luca", status: "Sospeso" }
];
const bonuses = [
  { bookmaker:"SNAI", tipo:"Ricorrente", nome:"Multipla +5%", scadenza:"2025-10-31", profitto:"+2.3€" },
  { bookmaker:"StarCasino", tipo:"Casino", nome:"Free Spin 50", scadenza:"2025-10-31", profitto:"+5€" },
  { bookmaker:"Revolut", tipo:"Benvenuto", nome:"Bonus iscrizione 10€", scadenza:"2025-12-31", profitto:"+10€" }
];

app.post("/api/login",(req,res)=>{
  const {email,password}=req.body;
  const u=users.find(x=>x.email===email && x.pass===password);
  if(!u)return res.json({ok:false});
  res.json({ok:true,user:{email:u.email,name:u.name,role:u.role}});
});

app.post("/api/register",(req,res)=>{
  const {name,email,pass}=req.body;
  if(users.find(u=>u.email===email))return res.json({ok:false});
  users.push({name,email,pass,role:"user"});
  res.json({ok:true});
});

app.get("/api/bonuses",(req,res)=>res.json(bonuses));
app.get("/api/friends",(req,res)=>res.json(friends));
app.get("/api/users",(req,res)=>res.json(users));

app.post("/api/coach",async(req,res)=>{
  const {prompt}=req.body;
  const key=process.env.OPENAI_API_KEY;
  try{
    const r=await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Authorization":"Bearer "+key,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        model:"gpt-4o-mini",
        messages:[
          {role:"system",content:"Sei Matrix Assistant, coach chiaro e diretto."},
          {role:"user",content:prompt}
        ]
      })
    });
    const j=await r.json();
    const text=j?.choices?.[0]?.message?.content || "Errore nella risposta.";
    res.json({reply:text});
  }catch(e){
    res.json({reply:"Errore di connessione al coach."});
  }
});

app.get("/",(req,res)=>res.sendFile("index.html",{root:"public"}));
app.listen(10000,()=>console.log("Matrix Pro Investing in esecuzione su porta 10000"));
