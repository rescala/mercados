const express=require('express');
const router=express.Router();
const pool = require('../database');
const {isLoggedIn, isNotLoggedIn}=require('../lib/verifier_editor');

router.get('/',isLoggedIn,async(req,res)=>{
    const folios = await pool.query('SELECT `comercio`.Folio,`comerciante`.Ape_Pat,`comerciante`.Ape_Mat,`comerciante`.Nombres,`comerciante`.Pago_Derechos, `comercio`.Id FROM `comercio` INNER JOIN `comerciante` on `comerciante`.Id_Comercio=`comercio`.Id INNER JOIN `direccion_comercio` on `direccion_comercio`.Id_Comercio=`comercio`.Id;');
    res.render('editor/datos',{folios});
});

router.get('/ingresar',isNotLoggedIn,async(req,res)=>{
    res.render('editor/ingresar');
});

router.get('/dulceros',isLoggedIn,async(req,res)=>{
    const folios = await pool.query('SELECT `comercio`.Folio,`comerciante`.Ape_Pat,`comerciante`.Ape_Mat,`comerciante`.Nombres,`comerciante`.Pago_Derechos, `comercio`.Id FROM `comercio` INNER JOIN `comerciante` on `comerciante`.Id_Comercio=`comercio`.Id INNER JOIN `direccion_comercio` on `direccion_comercio`.Id_Comercio=`comercio`.Id;');
    res.render('editor/datos_dulces',{folios});
});


router.get('/nuevo',isLoggedIn,async(req,res)=>{
    const folio = await pool.query('Select Folio from comercio where id=(select MAX(id) from comercio);');
    const result = Object.values(JSON.parse(JSON.stringify(folio[0])));
    result.forEach((v) => resultado=v);
    const replaced = resultado.replace(/\D/g, '');
    console.log(replaced); //imprime folio limpio
    let num;
    if (replaced !== '') {
        num = Number(replaced); //imprime folio numérico
    }
    console.log(num);
    new_num=num+1; //incrementa el número de folio
    console.log('Nuevo Folio: '+new_num);
    console.log('Largo de Cadena: '+new_num.toString().length);
    if(new_num.toString().length==4){
        folio_final='DMPM0'+new_num;
        console.log(folio_final);
    }
    if(new_num.toString().length==5){
        folio_final='DMPM'+new_num;
        console.log(folio_final);
    }

    res.render('editor/nuevo',{folio_final});
});


router.post('/editar_comercio/:id',isLoggedIn, async (req,res) =>{
    const id=req.params.id;
    const {Nomb_Comercial, Horario, Giro, Descripcion, Area_Permitida, Turno, Ape_Pat, Ape_Mat, Nombres, clave_elector, Union_Comercio, antiguedad, Pago_Derechos, Telefono, Calle, Numero, Colonia, Sector}=req.body;
    const Comercio = {
        Nomb_Comercial,
        Horario,
        Giro,
        Descripcion,
        Area_Permitida,
        Turno,
        antiguedad
    };
    const Direccion_Comercio = {
        Calle,
        Numero,
        Colonia,
        Sector
    };
    const Comerciante = {
        Ape_Pat,
        Ape_Mat,
        Nombres,
        clave_elector,
        Union_Comercio,
        Pago_Derechos,
        Telefono
    };
    console.log(Comercio);
    console.log(Direccion_Comercio);
    console.log(Comerciante);
    console.log('Id: '+id);
    await pool.query('UPDATE comercio set ? WHERE Id=?',[Comercio,id]);
    await pool.query('UPDATE comerciante set ? WHERE Id_Comercio=?',[Comerciante,id]);
    await pool.query('UPDATE direccion_comercio set ? WHERE Id_Comercio=?',[Direccion_Comercio,id]);
    req.flash('success','Comercio Editado Correctamente');
    res.redirect('/editor/');
});

router.post('/registrar_comercio/',isLoggedIn, async (req,res) =>{
    const id=req.params.id;
    const {Nomb_Comercial, Horario, Giro, Folio, Descripcion, Area_Permitida, Turno, Ape_Pat, Ape_Mat, Nombres, clave_elector, Union_Comercio, antiguedad, Pago_Derechos, Telefono, Calle, Numero, Colonia, Sector}=req.body;
    const Comercio = {
        Nomb_Comercial,
        Horario,
        Giro,
        Folio,
        Descripcion,
        Area_Permitida,
        Turno,
        antiguedad
    };
    await pool.query('INSERT INTO comercio set ?',[Comercio]);
    const Id_Comercios = await pool.query('Select MAX(id) from comercio;');
    const result = Object.values(JSON.parse(JSON.stringify(Id_Comercios[0])));
    result.forEach((v) => Id_Comercio=v);
    const Direccion_Comercio = {
        Id_Comercio,
        Calle,
        Numero,
        Colonia,
        Sector
    };
    const Comerciante = {
        Id_Comercio,
        Ape_Pat,
        Ape_Mat,
        Nombres,
        clave_elector,
        Union_Comercio,
        Pago_Derechos,
        Telefono
    };
    console.log(Comercio);
    console.log(Direccion_Comercio);
    console.log(Comerciante);
    await pool.query('INSERT INTO comerciante set ? ',[Comerciante]);
    await pool.query('INSERT INTO direccion_comercio set ?',[Direccion_Comercio]);
    const folio = await pool.query('SELECT MAX(`Id`) as Id FROM `comercio`;');
    const result2 = Object.values(JSON.parse(JSON.stringify(folio)));
    console.log(result2[0].Id);
    await pool.query('INSERT INTO `historial_pagos`(`Id_Pagos`, `Id_Comercio`) VALUES (1,'+result2[0].Id+'),(2,'+result2[0].Id+'),(3,'+result2[0].Id+'),(4,'+result2[0].Id+'),(5,'+result2[0].Id+'),(6,'+result2[0].Id+'),(7,'+result2[0].Id+'),(8,'+result2[0].Id+'),(9,'+result2[0].Id+'),(10,'+result2[0].Id+'),(11,'+result2[0].Id+'),(12,'+result2[0].Id+'),(13,'+result2[0].Id+'),(14,'+result2[0].Id+'),(15,'+result2[0].Id+'),(16,'+result2[0].Id+'),(17,'+result2[0].Id+'),(18,'+result2[0].Id+'),(19,'+result2[0].Id+'),(20,'+result2[0].Id+'),(21,'+result2[0].Id+'),(22,'+result2[0].Id+'),(23,'+result2[0].Id+'),(24,'+result2[0].Id+'),(25,'+result2[0].Id+'),(26,'+result2[0].Id+'),(27,'+result2[0].Id+'),(28,'+result2[0].Id+'),(29,'+result2[0].Id+'),(30,'+result2[0].Id+'),(31,'+result2[0].Id+'),(32,'+result2[0].Id+'),(33,'+result2[0].Id+'),(34,'+result2[0].Id+'),(35,'+result2[0].Id+'),(36,'+result2[0].Id+');');
    req.flash('success','Comercio Registrado Correctamente');
    res.redirect('/editor/');
});

router.get('/editar_comercio/:id',isLoggedIn,async(req,res)=>{
    const comercio = await pool.query('SELECT `comercio`.Id,`comercio`.Folio,`comercio`.Nomb_Comercial,`comercio`.Horario,`comercio`.Giro,`comercio`.Descripcion,`comercio`.Area_Permitida,`comercio`.Turno,`comerciante`.Ape_Pat,`comerciante`.Ape_Mat,`comerciante`.Nombres,`comerciante`.Union_Comercio,`comercio`.antiguedad,`comerciante`.Pago_Derechos, `comerciante`.clave_elector, `comerciante`.Telefono,`direccion_comercio`.Calle,`direccion_comercio`.Numero,`direccion_comercio`.Colonia,`direccion_comercio`.Sector FROM `comercio` INNER JOIN `comerciante` on `comerciante`.Id_Comercio=`comercio`.Id INNER JOIN `direccion_comercio` on `direccion_comercio`.Id_Comercio=`comercio`.Id WHERE `comercio`.Folio="'+req.params.id+'";');
    console.log(comercio);
    res.render('editor/editar_comercio',{comercio});
});


router.get('*',(req,res)=>{
    res.render('general/404');
});

module.exports=router;

//SELECT historial_pagos.`Id`, historial_pagos.`Id_Pagos`, historial_pagos.`Id_Comercio`, historial_pagos.`Pago`, DATE_FORMAT(pagos.Fecha, "%b-%Y") AS Mes FROM `historial_pagos` INNER JOIN `pagos` ON historial_pagos.Id_Pagos=pagos.Id INNER JOIN comercio ON historial_pagos.Id_Comercio=comercio.Id WHERE comercio.Id=2;