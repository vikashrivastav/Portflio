require('dotenv').config();
const express=require('express');const cors=require('cors');const cookieParser=require('cookie-parser');const path=require('path');const {login,current,logout}=require('./auth');
const app=express();app.use(cors({origin:(origin,cb)=>cb(null,!origin||/^http:\/\/localhost:517[34]$/.test(origin)),credentials:true}));app.use(express.json());app.use(cookieParser());
const auth=(req,res,next)=>{const user=current(req.cookies.portfolio_session);if(!user)return res.status(401).json({error:'Authentication required'});req.user=user;next()};
app.post('/api/auth/login',(req,res)=>{const token=login(req.body.email,req.body.password);if(!token)return res.status(401).json({error:'Invalid email or password'});res.cookie('portfolio_session',token,{httpOnly:true,sameSite:'lax',secure:false,maxAge:86400000});res.json({user:{email:req.body.email}})});
app.get('/api/auth/me',auth,(req,res)=>res.json({user:req.user}));app.post('/api/auth/logout',(req,res)=>{logout(req.cookies.portfolio_session);res.clearCookie('portfolio_session');res.json({ok:true})});
app.get('/',(req,res)=>res.json({name:'Portfolio API',status:'running',health:'/api/health'}));
app.get('/api/health',(req,res)=>res.json({ok:true}));
app.listen(process.env.PORT||4000,()=>console.log(`API running at http://localhost:${process.env.PORT||4000}`));
