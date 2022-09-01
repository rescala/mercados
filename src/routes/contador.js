const express=require('express');
const router=express.Router();
const pool = require('../database');

router.get('/',async(req,res)=>{
    const folios = await pool.query('SELECT `comercio`.Folio,`comerciante`.Ape_Pat,`comerciante`.Ape_Mat,`comerciante`.Nombres,`comerciante`.Pago_Derechos, `comercio`.Id FROM `comercio` INNER JOIN `comerciante` on `comerciante`.Id_Comercio=`comercio`.Id INNER JOIN `direccion_comercio` on `direccion_comercio`.Id_Comercio=`comercio`.Id;');
    res.render('contador/datos',{folios});
});

router.get('/inspecciones',(req,res)=>{
    res.send('<h1>Aquí van las inspecciones</h1>');
});

router.get('/inspectores', async (req,res)=>{
    const inspectores = await pool.query('Select * from personal;');
    res.render('contador/inspectores',{inspectores});
});

router.get('/nuevo',async(req,res)=>{
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

    res.render('contador/nuevo',{folio_final});
});

router.get('/nuevo_inspector',(req,res)=>{
    res.render('contador/nuevo_inspector');
});

router.post('/registrar_inspector', async (req,res) =>{
    console.log(req.body);
    const {Nombres, Ape_Pat, Ape_Mat, turno, zonas, usuario, password}=req.body;
    const newInspector = {
        Ape_Pat,
        Ape_Mat,
        Nombres,
        turno,
        zonas,
        usuario,
        password
    }
    console.log(req.body.turno);
    await pool.query('Insert into personal set ?',[newInspector]);
    req.flash('success','Inspector Editado Correctamente');
    res.redirect('/contador/inspectores');
});

router.post('/editar_inspector', async (req,res) =>{
    const id=req.body.Id;
    const {Nombres, Ape_Pat, Ape_Mat, turno, zonas, usuario, password}=req.body;
    const newInspector = {
        Ape_Pat,
        Ape_Mat,
        Nombres,
        turno,
        zonas,
        usuario,
        password
    }
    console.log(newInspector);
    console.log('Id: '+id);
    await pool.query('UPDATE personal set ? WHERE Id=?',[newInspector,id]);
    req.flash('success','Inspector Editado Correctamente');
    res.redirect('/contador/inspectores');
});

router.post('/editar_comercio/:id', async (req,res) =>{
    const id=req.params.id;
    const {Nomb_Comercial, Horario, Giro, Descripcion, Area_Permitida, Turno, Ape_Pat, Ape_Mat, Nombres, Union_Comercio, antiguedad, Pago_Derechos, Telefono, Calle, Numero, Colonia, Sector}=req.body;
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
    res.redirect('/contador/');
});

router.post('/registrar_comercio/', async (req,res) =>{
    const id=req.params.id;
    const {Nomb_Comercial, Horario, Giro, Folio, Descripcion, Area_Permitida, Turno, Ape_Pat, Ape_Mat, Nombres, Union_Comercio, antiguedad, Pago_Derechos, Telefono, Calle, Numero, Colonia, Sector}=req.body;
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
        Union_Comercio,
        Pago_Derechos,
        Telefono
    };
    console.log(Comercio);
    console.log(Direccion_Comercio);
    console.log(Comerciante);
    await pool.query('INSERT INTO comerciante set ? ',[Comerciante]);
    await pool.query('INSERT INTO direccion_comercio set ?',[Direccion_Comercio]);
    req.flash('success','Comercio Registrado Correctamente');
    res.redirect('/contador/');
});

router.get('/editar_comercio/:id',async(req,res)=>{
    const comercio = await pool.query('SELECT `comercio`.Id,`comercio`.Folio,`comercio`.Nomb_Comercial,`comercio`.Horario,`comercio`.Giro,`comercio`.Descripcion,`comercio`.Area_Permitida,`comercio`.Turno,`comerciante`.Ape_Pat,`comerciante`.Ape_Mat,`comerciante`.Nombres,`comerciante`.Union_Comercio,`comercio`.antiguedad,`comerciante`.Pago_Derechos,`comerciante`.Telefono,`direccion_comercio`.Calle,`direccion_comercio`.Numero,`direccion_comercio`.Colonia,`direccion_comercio`.Sector FROM `comercio` INNER JOIN `comerciante` on `comerciante`.Id_Comercio=`comercio`.Id INNER JOIN `direccion_comercio` on `direccion_comercio`.Id_Comercio=`comercio`.Id WHERE `comercio`.Folio="'+req.params.id+'";');
    console.log(comercio);
    res.render('contador/editar_comercio',{comercio});
});

router.get('/editar/:id',async(req,res)=>{
    const inspector = await pool.query('Select * from personal where id='+req.params.id+';');
    console.log(req.params.id);
    res.render('contador/editar',{inspector});
});

router.get('/pago',async(req,res)=>{
    const comercios = await pool.query('Select Id,Folio from comercio;');
    res.render('contador/pago',{comercios});
});

router.get('/pago_detalle/:id', async (req,res)=>{
    await pool.query('SET lc_time_names = "es_MX";');
    const folio = await pool.query('select * from comercio where Id='+req.params.id+';');
    const comercios = await pool.query('SELECT historial_pagos.`Id`, historial_pagos.`Id_Pagos`, historial_pagos.`Id_Comercio`,IF(historial_pagos.Pago="Adeuda", 1,null) as valor, historial_pagos.`Pago`, UPPER(DATE_FORMAT(pagos.Fecha, "%b-%Y")) AS Mes FROM `historial_pagos` INNER JOIN `pagos` ON historial_pagos.Id_Pagos=pagos.Id INNER JOIN comercio ON historial_pagos.Id_Comercio=comercio.Id WHERE comercio.Id='+req.params.id+';');
    folio_= folio[0];
    console.log(folio_);
    res.render('contador/pago_detalle',{comercios,folio_});
});

router.get('/realizar_pago/:id', async (req,res)=>{
    const folio = await pool.query('SELECT * FROM `historial_pagos` where Id='+req.params.id+';');
    //pool.query('UPDATE `historial_pagos` SET `Pago`="Pagado" where Id='+req.params.id);
    folio_= folio[0];
    console.log(folio_);
    res.render('contador/pago_confirmacion',{folio_});
});

router.get('/correccion_pago/:id', async (req,res)=>{
    const folio = await pool.query('SELECT * FROM `historial_pagos` where Id='+req.params.id+';');
    //pool.query('UPDATE `historial_pagos` SET `Pago`="Pagado" where Id='+req.params.id);
    folio_= folio[0];
    console.log(folio_);
    res.render('contador/pago_correccion',{folio_});
});

router.get('/concretar_pago/:id', async (req,res)=>{
    const folio = await pool.query('SELECT * FROM `historial_pagos` where Id='+req.params.id+';');
    pool.query('UPDATE `historial_pagos` SET `Pago`="Pagado" where Id='+req.params.id);
    folio_ = folio[0];
    console.log(folio_.Id_Comercio);
    req.flash('success','Pago Actualizado Correctamente');
    res.redirect('/contador/pago_detalle/'+folio_.Id_Comercio);
    //res.send('Pagado');
});

router.get('/corregir_pago/:id', async (req,res)=>{
    const folio = await pool.query('SELECT * FROM `historial_pagos` where Id='+req.params.id+';');
    pool.query('UPDATE `historial_pagos` SET `Pago`="Adeuda" where Id='+req.params.id);
    folio_ = folio[0];
    console.log(folio_.Id_Comercio);
    req.flash('success','Pago Actualizado Correctamente')
    res.redirect('/contador/pago_detalle/'+folio_.Id_Comercio);
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