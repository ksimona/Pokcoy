module.exports = function (req,res,next){
    req.logout();
    res.render('home',{countonline:req.session.countonline, loggedin:false});
}