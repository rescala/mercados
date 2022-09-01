const passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers')

passport.use('local.login', new LocalStrategy({
    usernameField:'usuario',
    passwordField:'password',
    passReqToCallback: true
}, async (req, usuario, password, done)=>{
    
    const rows = await pool.query('select * from personal where usuario ="'+[usuario]+'";');
    const rows2 = rows[0];
    
    if (rows){
        const user = rows2;
        console.log(user.password);
        console.log(password);
        const validPassword = await helpers.matchPassword(password,user.password);
        if (validPassword){
            done(null, user, req.flash('success','Hola, '+user.Nombres));
        } else {
            done(null,false,req.flash('message','Password Incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message','Usuario Inexistente'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField:'usuario',
    passwordField:'password',
    passReqToCallback: true
    
}, async (req,usuario,password, done) =>{
    const {Nombres} = req.body;
    const {Ape_Pat} = req.body;
    const {Ape_Mat} = req.body;
    const {zonas} = req.body;
    const {turno} = req.body;
    const newInspector = {
        Nombres,
        Ape_Pat,
        Ape_Mat,
        zonas,
        turno,
        usuario,
        password
    };
    newInspector.password = await helpers.encryptPassword(password);
    
    const result = await pool.query('Insert into personal set ?',[newInspector]);
    return done(null);


}));

passport.use('local.signup2', new LocalStrategy({
    usernameField:'usuario',
    passwordField:'password',
    passReqToCallback: true
    
}, async (req,usuario,password, done) =>{
    const {Nombres} = req.body;
    const {Ape_Pat} = req.body;
    const {Ape_Mat} = req.body;
    const {zonas} = req.body;
    const {turno} = req.body;
    const id =req.body.Id;
    const newInspector = {
        Nombres,
        Ape_Pat,
        Ape_Mat,
        zonas,
        turno,
        usuario,
        password
    };
    console.log(newInspector.password);
    newInspector.password = await helpers.encryptPassword(password);
    console.log(newInspector);    
    const result = await pool.query('UPDATE personal set ? WHERE Id=?',[newInspector,id]);
    req.flash('success','Inspector Editado Correctamente');
    return done(null);


}));

passport.serializeUser((user, done) => {
    done(null, user.Id);
  });
  
  passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM personal WHERE id = ?', [id]);
    done(null, rows[0]);
  });
