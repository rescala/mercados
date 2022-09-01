const express=require('express');
const router=express.Router();
const pool = require('../database');
const passport=require('passport');

router.get('/login/:id', (req,res)=>{
    let folio=req.params;
    res.render('login/inspector',{folio,layout:'inspector'});
});


router.post('/signup', passport.authenticate('local.signup',{
    successRedirect:'/contador/inspectores/',
    failureRedirect:'/contador/inspectores/',
    failureFlash: true
}));

router.post('/signup2', passport.authenticate('local.signup2',{
    successRedirect:'/contador/inspectores/',
    failureRedirect:'/contador/inspectores/',
    failureFlash: true
}));



router.post('/login', async (req,res,next)=>{
    const folio=req.body.folio;
    console.log(folio);
    passport.authenticate('local.login',{
        successRedirect:'/comercios/inspeccion/'+req.body.folio,
        failureRedirect:'/',
        failureFlash:true
    })(req,res,next);
    // let folio2 = req.body.folio;
    // const folios2 = await pool.query('SELECT `comercio`.Folio,`comercio`.Nomb_Comercial,`comercio`.Horario,`comercio`.Giro,`comercio`.Descripcion,`comercio`.Area_Permitida,`comercio`.Turno,`comerciante`.Ape_Pat,`comerciante`.Ape_Mat,`comerciante`.Nombres,`comerciante`.Union_Comercio,`comercio`.antiguedad,`comerciante`.Pago_Derechos,`comerciante`.Telefono,`direccion_comercio`.Calle,`direccion_comercio`.Numero,`direccion_comercio`.Colonia,`direccion_comercio`.Sector, UPPER(DATE_FORMAT(pagos.Fecha, "%b-%Y")) AS Mes, historial_pagos.`Pago` FROM `comercio` INNER JOIN `comerciante` on `comerciante`.Id_Comercio=`comercio`.Id INNER JOIN `direccion_comercio` on `direccion_comercio`.Id_Comercio=`comercio`.Id INNER JOIN historial_pagos ON historial_pagos.Id_Comercio=comercio.Id INNER JOIN pagos ON pagos.Id=historial_pagos.Id_Pagos WHERE DATE_FORMAT(CURRENT_DATE, "%b-%Y")=DATE_FORMAT(pagos.Fecha, "%b-%Y") AND `comercio`.Folio="'+folio2+'";');
    // console.log(folios2);
    // res.render('inspectores/comercio',{folios2,layout:'inspector'});
});

router.get("/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/");
    });
  });

module.exports=router;