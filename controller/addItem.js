var path = require('path');
var fs = require('fs');
var formidable = require('formidable');

var addItem = function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.resolve(__dirname+'/../public/images/');
    form.parse(req,function(err,fields,files){
        var count = 1;
        var oldpath = files.file.path;
        var newpath = __dirname+'/../public/images/' + files.file.name;

        while(fs.existsSync(newpath)){
            count++;
            newpath = __dirname+'/../public/images/' + path.basename(files.file.name, path.extname(files.file.name)) + count + path.extname(files.file.name);
        }
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.render('shop',{message:'File uploaded and moved!'});
            res.end();
        });
    });
}

module.exports={
    addItem:addItem
}