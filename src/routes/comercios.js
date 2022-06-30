const express = require('express');
const router=express.Router();
const pool = require('../database');

router.get('/',(req,res)=>{
    res.send('La Ruta Inicial Funciona');
});

router.get('/folio/:id',async (req,res)=>{
    let folio = req.params;
    const folios = await pool.query('SELECT `comercio`.Folio,`comercio`.Nomb_Comercial,`comercio`.Horario,`comercio`.Giro,`comercio`.Descripcion,`comercio`.Area_Permitida,`comercio`.Turno,`comerciante`.Ape_Pat,`comerciante`.Ape_Mat,`comerciante`.Nombres,`comerciante`.Union_Comercio,`comercio`.antiguedad,`comerciante`.Pago_Derechos,`comerciante`.Telefono,`direccion_comercio`.Calle,`direccion_comercio`.Numero,`direccion_comercio`.Colonia,`direccion_comercio`.Sector FROM `comercio` INNER JOIN `comerciante` on `comerciante`.Id_Comercio=`comercio`.Id INNER JOIN `direccion_comercio` on `direccion_comercio`.Id_Comercio=`comercio`.Id WHERE `comercio`.Folio="'+folio.id+'";');
    console.log(folios);
    res.render('general/comercio',{folios});
});

router.post('/inspeccion', async (req,res)=>{
    console.log(req.body);
    let folio2 = req.body.folio;
    const folios2 = await pool.query('SELECT `comercio`.Folio,`comercio`.Nomb_Comercial,`comercio`.Horario,`comercio`.Giro,`comercio`.Descripcion,`comercio`.Area_Permitida,`comercio`.Turno,`comerciante`.Ape_Pat,`comerciante`.Ape_Mat,`comerciante`.Nombres,`comerciante`.Union_Comercio,`comercio`.antiguedad,`comerciante`.Pago_Derechos,`comerciante`.Telefono,`direccion_comercio`.Calle,`direccion_comercio`.Numero,`direccion_comercio`.Colonia,`direccion_comercio`.Sector FROM `comercio` INNER JOIN `comerciante` on `comerciante`.Id_Comercio=`comercio`.Id INNER JOIN `direccion_comercio` on `direccion_comercio`.Id_Comercio=`comercio`.Id WHERE `comercio`.Folio="'+folio2+'";');
    console.log(folios2);
    res.render('inspectores/comercio',{folios2,layout:'inspector'});
});

router.get('/folio/inspector/:id', (req,res)=>{
    let folio=req.params;
    res.render('login/inspector',{folio,layout:'inspector'});
});

router.post('/folios',(req,res)=>{
    res.send(req.body);
});

module.exports=router;