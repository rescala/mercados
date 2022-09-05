const express = require('express');
const router=express.Router();
const pool = require('../database');
const {isLoggedIn}=require('../lib/verifier');

router.get('/',(req,res)=>{
    res.send('La Ruta Inicial Funciona');
});

router.get('/folio/:id',async (req,res)=>{
    let folio = req.params;
    const folios = await pool.query('SELECT `comercio`.Folio,`comercio`.Nomb_Comercial,`comercio`.Horario,`comercio`.Giro,`comercio`.Descripcion,`comercio`.Area_Permitida,`comercio`.Turno,`comerciante`.Ape_Pat,`comerciante`.Ape_Mat,`comerciante`.Nombres,`comerciante`.Union_Comercio,`comercio`.antiguedad,`comerciante`.Pago_Derechos,`comerciante`.Telefono,`direccion_comercio`.Calle,`direccion_comercio`.Numero,`direccion_comercio`.Colonia,`direccion_comercio`.Sector FROM `comercio` INNER JOIN `comerciante` on `comerciante`.Id_Comercio=`comercio`.Id INNER JOIN `direccion_comercio` on `direccion_comercio`.Id_Comercio=`comercio`.Id WHERE `comercio`.Folio="'+folio.id+'";');
    console.log(folios);
    if (folios == "") {
        res.redirect("/comercios/no-encontrado");
    } else {
        res.render('general/comercio',{folios});    
    }
    
});

router.get('/inspeccion/:folio', isLoggedIn, async (req,res)=>{
    //console.log(req.user.Nombres);
    let folio2 = req.params.folio;
    const folios2 = await pool.query('SELECT `comercio`.Folio,`comercio`.Nomb_Comercial,`comercio`.Horario,`comercio`.Giro,`comercio`.Descripcion,`comercio`.Area_Permitida,`comercio`.Turno,`comerciante`.Ape_Pat,`comerciante`.Ape_Mat,`comerciante`.Nombres,`comerciante`.Union_Comercio,`comercio`.antiguedad,`comerciante`.Pago_Derechos,`comerciante`.Telefono,`direccion_comercio`.Calle,`direccion_comercio`.Numero,`direccion_comercio`.Colonia,`direccion_comercio`.Sector, UPPER(DATE_FORMAT(pagos.Fecha, "%b-%Y")) AS Mes, historial_pagos.`Pago` FROM `comercio` INNER JOIN `comerciante` on `comerciante`.Id_Comercio=`comercio`.Id INNER JOIN `direccion_comercio` on `direccion_comercio`.Id_Comercio=`comercio`.Id INNER JOIN historial_pagos ON historial_pagos.Id_Comercio=comercio.Id INNER JOIN pagos ON pagos.Id=historial_pagos.Id_Pagos WHERE DATE_FORMAT(CURRENT_DATE, "%b-%Y")=DATE_FORMAT(pagos.Fecha, "%b-%Y") AND `comercio`.Folio="'+folio2+'";');
    //console.log(folios2);

    res.render('inspectores/comercio',{folios2,folio2,layout:'inspector'});
});

router.get('/no-encontrado',(req,res)=>{
    res.render('general/no-resultado');
});

router.post('/finalizar_inspeccion',async(req,res)=>{
    console.log(req.body.comentario);
    const identifier = await pool.query('select * from comercio where Folio="'+req.body.folio+'";');
    //console.log(identifier[0].Id);
    const inspeccion = await pool.query('select Id from supervicion where Hora >= date_sub(now(),interval 30 minute) AND Id_Comercio='+identifier[0].Id+' ORDER BY id DESC LIMIT 1;')
    console.log(inspeccion[0].Id);
    await pool.query('UPDATE `supervicion` SET `Comentarios`="'+req.body.comentario+'" where Id='+inspeccion[0].Id);
    res.redirect('/logout');
});

router.get('*',(req,res)=>{
    res.render('general/404');
});

module.exports=router;