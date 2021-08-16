module.exports = {
    ensureAuth: (req, res, next)=>{
        if(req.isAuthenticated() ){
            return next();
        }else{
            res.redirect('/');
        }
    },
    ensureGuest: (req, res, next)=>{
        // console.log(req.isAuthenticated())
        if(req.isAuthenticated() && req.user.username){
            res.redirect('/admin');
        }
        else if(req.isAuthenticated() && !req.user.username){
            res.redirect('/username');
        }
        else{
            return next();
        }
    },
    ensureUserName : (req, res, next)=>{
        //console.log(req.isAuthenticated())
        if(req.user.username){
            return next();
        }
        else{
            res.redirect('/username');
        }
    }
}