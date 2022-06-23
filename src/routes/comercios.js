const express = require('express');
const router=express.Router();
const pool = require('../database');

router.get('/',(req,res)=>{
    res.send('La Ruta Inicial Funciona');
});

router.get('/folio/:id',(req,res)=>{
    let folio = req.params;
    res.render('general/comercio',{folio:folio});
});

router.get('/folio',(req,res)=>{
    //let folio = req.params;
    res.render('general/comercio');
});

router.post('/folios',(req,res)=>{
    res.send(req.body);
});

module.exports=router;