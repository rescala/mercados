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

router.get('/editar',(req,res)=>{
    res.render('contador/editar');
});

router.get('*',(req,res)=>{
    res.render('general/404');
});

module.exports=router;