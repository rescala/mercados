const express=require('express');
const router=express.Router();
const pool = require('../database');
const passport=require('passport');


router.get('/login/:id', (req,res)=>{
    let folio=req.params;
    res.render('login/inspector',{folio,layout:'inspector'});
});

router.post('/registrar_maximo', passport.authenticate('local.registrar_maximo',{
    successRedirect:'/contador/',
    failureRedirect:'/contador/registrar',
    failureFlash: true
}));

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
});

router.post('/login_administrador', async (req,res,next)=>{
    const folio=req.body.folio;
    console.log(folio);
    passport.authenticate('local.login_administrador',{
        successRedirect:'/contador/',
        failureRedirect:'/contador/ingresar/',
        failureFlash:true
    })(req,res,next);
});

router.post('/login_contador', async (req,res,next)=>{
    const folio=req.body.folio;
    console.log(folio);
    passport.authenticate('local.login_contador',{
        successRedirect:'/contador_nvo/pago/',
        failureRedirect:'/contador_nvo/ingresar/',
        failureFlash:true
    })(req,res,next);
});

router.post('/login_editor', async (req,res,next)=>{
    const folio=req.body.folio;
    console.log(folio);
    passport.authenticate('local.login_editor',{
        successRedirect:'/editor/',
        failureRedirect:'/',
        failureFlash:true
    })(req,res,next);
});

router.get("/logout", (req, res) => {
    req.logOut(req.user, err => {
      if(err) return next(err);
      res.redirect("/");
    });
  });

router.get("/logout_contador_nvo", (req, res) => {
    req.logOut(req.user, err => {
      if(err) return next(err);
      res.redirect("/contador_nvo/ingresar");
    });
});

router.get("/logout_editor", (req, res) => {
    req.logOut(req.user, err => {
      if(err) return next(err);
      res.redirect("/editor/ingresar");
    });
});

router.get("/logout_administrador", (req, res) => {
    req.logOut(req.user, err => {
      if(err) return next(err);
      res.redirect("/contador/ingresar");
    });
});

module.exports=router;