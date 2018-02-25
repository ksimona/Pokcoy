module.exports = {
    checkAuth:
    function (req,res,next){
        if(req.isAuthenticated()){
            next();
        }
        else{
            res.render('home',{countonline:req.session.countonline, message:"You are not logged in"});
        }
    }
};