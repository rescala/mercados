const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    res.send('La Ruta Inicial Funciona');
});

module.exports=router;