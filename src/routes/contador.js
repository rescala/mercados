const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    res.render('contador/datos');
});

router.get('/inspecciones',(req,res)=>{
    res.render('contador/datos');
});

router.get('/inspectores',(req,res)=>{
    res.render('contador/datos');
});

router.get('/nuevo',(req,res)=>{
    res.render('contador/nuevo');
});

module.exports=router;