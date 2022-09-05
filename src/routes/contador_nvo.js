const express=require('express');
const router=express.Router();
const pool = require('../database');
const {isLoggedIn, isNotLoggedIn}=require('../lib/verifier_contador');

router.get('/',isNotLoggedIn,async(req,res)=>{
    res.redirect('/contador_nvo/ingresar');
});

router.get('/ingresar',isNotLoggedIn,async(req,res)=>{
    res.render('contador_nvo/ingresar');
});

// router.get('/registrar',async(req,res)=>{
//     res.render('contador/registrar');
// });


router.get('/pago',isLoggedIn,async(req,res)=>{
    const comercios = await pool.query('SELECT `comercio`.Id,`comercio`.Folio,`comerciante`.Ape_Pat,`comerciante`.Ape_Mat,`comerciante`.Nombres,`comerciante`.Pago_Derechos, `comercio`.Id FROM `comercio` INNER JOIN `comerciante` on `comerciante`.Id_Comercio=`comercio`.Id INNER JOIN `direccion_comercio` on `direccion_comercio`.Id_Comercio=`comercio`.Id;');
    res.render('contador_nvo/pago',{comercios});
});

router.get('/pago_detalle/:id',isLoggedIn, async (req,res)=>{
    await pool.query('SET lc_time_names = "es_MX";');
    const folio = await pool.query('select * from comercio where Id='+req.params.id+';');
    const comercios = await pool.query('SELECT historial_pagos.`Id`, historial_pagos.`Id_Pagos`, historial_pagos.`Id_Comercio`,IF(historial_pagos.Pago="Adeuda", 1,null) as valor, historial_pagos.`Pago`, UPPER(DATE_FORMAT(pagos.Fecha, "%b-%Y")) AS Mes FROM `historial_pagos` INNER JOIN `pagos` ON historial_pagos.Id_Pagos=pagos.Id INNER JOIN comercio ON historial_pagos.Id_Comercio=comercio.Id WHERE comercio.Id='+req.params.id+';');
    folio_= folio[0];
    console.log(folio_);
    res.render('contador_nvo/pago_detalle',{comercios,folio_});
});

router.get('/realizar_pago/:id',isLoggedIn, async (req,res)=>{
    const folio = await pool.query('SELECT * FROM `historial_pagos` where Id='+req.params.id+';');
    //pool.query('UPDATE `historial_pagos` SET `Pago`="Pagado" where Id='+req.params.id);
    folio_= folio[0];
    console.log(folio_);
    res.render('contador_nvo/pago_confirmacion',{folio_});
});

router.get('/correccion_pago/:id',isLoggedIn, async (req,res)=>{
    const folio = await pool.query('SELECT * FROM `historial_pagos` where Id='+req.params.id+';');
    //pool.query('UPDATE `historial_pagos` SET `Pago`="Pagado" where Id='+req.params.id);
    folio_= folio[0];
    console.log(folio_);
    res.render('contador_nvo/pago_correccion',{folio_});
});

router.get('/concretar_pago/:id',isLoggedIn, async (req,res)=>{
    const folio = await pool.query('SELECT * FROM `historial_pagos` where Id='+req.params.id+';');
    pool.query('UPDATE `historial_pagos` SET `Pago`="Pagado" where Id='+req.params.id);
    folio_ = folio[0];
    console.log(folio_.Id_Comercio);
    req.flash('success','Pago Actualizado Correctamente');
    res.redirect('/contador_nvo/pago_detalle/'+folio_.Id_Comercio);
    //res.send('Pagado');
});

router.get('/corregir_pago/:id',isLoggedIn, async (req,res)=>{
    const folio = await pool.query('SELECT * FROM `historial_pagos` where Id='+req.params.id+';');
    pool.query('UPDATE `historial_pagos` SET `Pago`="Adeuda" where Id='+req.params.id);
    folio_ = folio[0];
    console.log(folio_.Id_Comercio);
    req.flash('success','Pago Actualizado Correctamente')
    res.redirect('/contador_nvo/pago_detalle/'+folio_.Id_Comercio);
    //res.send('Pagado');
});

//router.get('/insert_pagos', async (req,res)=>{
//    const folio = await pool.query('SELECT `Id` FROM `comercio` WHERE Id>1;');
//    const result = Object.values(JSON.parse(JSON.stringify(folio)));
    //result.forEach((v) => console.log(resultado=v));
//    result.forEach(result => {
        //console.log(result.Id);
//        pool.query('INSERT INTO `historial_pagos`(`Id_Pagos`, `Id_Comercio`) VALUES (1,'+result.Id+'),(2,'+result.Id+'),(3,'+result.Id+'),(4,'+result.Id+'),(5,'+result.Id+'),(6,'+result.Id+'),(7,'+result.Id+'),(8,'+result.Id+'),(9,'+result.Id+'),(10,'+result.Id+'),(11,'+result.Id+'),(12,'+result.Id+'),(13,'+result.Id+'),(14,'+result.Id+'),(15,'+result.Id+'),(16,'+result.Id+'),(17,'+result.Id+'),(18,'+result.Id+'),(19,'+result.Id+'),(20,'+result.Id+'),(21,'+result.Id+'),(22,'+result.Id+'),(23,'+result.Id+'),(24,'+result.Id+'),(25,'+result.Id+'),(26,'+result.Id+'),(27,'+result.Id+'),(28,'+result.Id+'),(29,'+result.Id+'),(30,'+result.Id+'),(31,'+result.Id+'),(32,'+result.Id+'),(33,'+result.Id+'),(34,'+result.Id+'),(35,'+result.Id+'),(36,'+result.Id+');');
//    });
//    res.send('Proceso de pagos');
//});

router.get('*',(req,res)=>{
    res.render('general/404');
});

module.exports=router;

//SELECT historial_pagos.`Id`, historial_pagos.`Id_Pagos`, historial_pagos.`Id_Comercio`, historial_pagos.`Pago`, DATE_FORMAT(pagos.Fecha, "%b-%Y") AS Mes FROM `historial_pagos` INNER JOIN `pagos` ON historial_pagos.Id_Pagos=pagos.Id INNER JOIN comercio ON historial_pagos.Id_Comercio=comercio.Id WHERE comercio.Id=2;