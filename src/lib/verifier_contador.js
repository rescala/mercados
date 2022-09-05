module.exports={

    isLoggedIn(req,res,next) {
        if(req.isAuthenticated()){
            return next();
        } else {
            res.redirect('/contador_nvo/ingresar/');
        }
    },

    isNotLoggedIn(req,res,next) {
        if(!req.isAuthenticated()){
            return next();
        } else {
            res.redirect('/contador_nvo/pago/');
        }
    }

};