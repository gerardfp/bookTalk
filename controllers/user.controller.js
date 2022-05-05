var User = require('../models/user.model');
var app = require('../app.js');


var register = (req, res, next) => {
    var errors = [];

    var correcte = 0;
    if (req.body.username == "") {
        errors[0] = "El Nombre de usuario está vacio. \n";
        console.log("No ha introducido el nombre de usuario");
    } else {
        //mirar si està a la bbdd
        User.model.findOne({username: req.body.username}, function(err, user) {
            if (user != undefined) {
                errors[0] = "El Nombre de usuario ya existe. \n";
                console.log("Username incorrecte");
            } else {
                correcte++;
                console.log("Username correcte");
            }
        });
    }

    if (req.body.completeName == "") {
        errors[1] = "El Nombre completo está vacio. \n";
        console.log("No ha introducido su nombre completo")
    } else {
        correcte++;
    }

    if (req.body.birthDate == "") {
        errors[2] = "La fecha de nacimiento está vacia";
        console.log("No ha introducido la fecha de nacimiento");
    } else {
        //comprobar que és una data més antiga a l'actual
        var birthDate = req.body.birthDate.split("-");
        var year = birthDate[0];
        var month = birthDate[1];
        var day = birthDate[2];
        var data = new Date;
        var OldDate = new Date(year, month, day);
        if (data.getTime() < OldDate.getTime()) {
            errors[2] = "La fecha no es correcta. \n";
        } else {
            correcte++;
        }
    }

    if (req.body.email == "") {
        errors[3] = "El email está vacio. \n";
        console.log("No ha introducido el correo electronico");
    } else {
        //comprobar que sigui un email
        emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        if (emailRegex.test(req.body.email)) {
            correcte++;
            console.log("email correcte");
        } else {
            errors[3] = "El email no es correcto. \n";
            console.log("email incorrecte");
        }
        
    }

    if ( req.body.password == "") {
        errors[4] = "La contraseña está vacia. \n";
        console.log("No ha introducido la contraseña");
    } else {
        //comprovar que la contrasenya té minim una minuscula, una majuscula i un numero
        passwordRegex = /^(?=(?:.*\d){1})(?=(?:.*[A-Z]){1})(?=(?:.*[a-z]){1})\S{4,}$/i;
        if (passwordRegex.test(req.body.password)) {
            correcte++;
            console.log("contraseña correcta");
            if (req.body.password2 == "") {
                errors[4] = "No ha vuelto a escribir la contraseña. \n";
                console.log("No ha vuelto a escribir la contraseña");
            } else {
                //comprobar que les 2 contrasenyes son iguals
                if (req.body.password == req.body.password2) {
                    correcte++;
                    console.log("Contraseñas iguales");
                } else {
                    errors[4] = "Las contraseñas no son iguales. \n";
                    console.log("Contraseñas distintas");
                }
            }
        } else {
            errors[4] = "Contraseña incorrecta: minimo una mayuscula, una minuscula y un numero. \n";
            console.log("contraseña incorrecta");
        }
    }
    
    if (correcte == 5) {
        console.log("S'ha registrat");
        console.log(req.body.birthDate);
        var user = new User.model({username: req.body.username, completeName: req.body.completeName, birthDate: req.body.birthDate, password: req.body.password, email: req.body.email});
        user.save();
        res.redirect("/user/signin");
    } else {
        backURL = req.header('Referer') || '/';
        console.log("No s'ha registrat");
        //Volver atras
        var sess = req.session;
        sess.errors0 = errors[0];
        sess.errors1 = errors[1];
        sess.errors2 = errors[2];
        sess.errors3 = errors[3];
        sess.errors4 = errors[4];
        res.redirect(backURL);
    }
};

var login = (req, res, next) => {
    User.model.findOne({username: req.body.username, password: req.body.password}, function(err, user) {
        if (user != undefined) {
            var birthDate = user.birthDate;
            let formatted_date = birthDate.getFullYear() + '-' + (birthDate.getDate() - 1) + '-' + (birthDate.getMonth() + 1);
            
            var sess = req.session;
            sess.username = user.username;
            sess.completeName = user.completeName;
            sess.birthDate = formatted_date;
            sess.email = user.email;
            sess.biography = user.biography;
            sess.profilePicture = "/public/" + user.profilePicture;
            res.redirect('/');
        } else {
            res.redirect('/user/signup');
        }
    });
};

var edit = (req, res, next) => { 
    var param = req.body.tipoDatos;
    if (param == "username") {
        if (req.body.username != "") {
            var sess = req.session;
            User.model.findOneAndUpdate({username: sess.username}, {username: req.body.username}, function(err, user) {
                user.save();
            });
            sess.username = req.body.username;
            res.redirect('/user/edit');
        } else {
            res.redirect('/user/edit');
        }
    } else if (param == "completeName") {
        if (req.body.completeName != "") {
            var sess = req.session;
            User.model.findOneAndUpdate({completeName: sess.completeName}, {completeName: req.body.completeName}, function(err, user) {
                user.save();
            });
            sess.completeName = req.body.completeName;
            res.redirect('/user/edit');
        } else {
            res.redirect('/user/edit');
        }
    } else if (param == "birthDate") {
        if (req.body.birthDate != "") {
            var sess = req.session;
            var d = req.body.birthDate.split('-');
            var data = new Date(d[0], d[1] - 1, d[2]);
            console.log(data);
            
            var year = d[0];
            var month = d[1];
            var day = d[2];
            User.model.findOneAndUpdate({username: sess.username}, {birthDate: req.body.birthDate}, function(err, user) {
                console.log(user);
                var dataAct = new Date;
                var OldDate = new Date(year, month, day);
                if (dataAct.getTime() > OldDate.getTime()) {
                    user.save();
                }
            });
            sess.birthDate = year + "-" + day + "-" + month;
            res.redirect('/user/edit');
        } else {
            res.redirect('/user/edit');
        }
    } else if (param == "email") {
        if (req.body.email != "") {
            var sess = req.session;
            User.model.findOneAndUpdate({username: sess.username, email: sess.email}, {email: req.body.email}, function(err, user) {
                user.save();
            });
            sess.email = req.body.email;
            res.redirect('/user/edit');
        } else {
            res.redirect('/user/edit');
        }
    } else if (param == "biography") {
        if (req.body.biography != "") {
            var sess = req.session;
            User.model.findOneAndUpdate({username: sess.username}, {biography: req.body.biography}, function(err, user) {
                user.save();
            });
            sess.biography = req.body.biography;
            res.redirect('/user/edit');
        } else {
            res.redirect('/user/edit');
        }
    }
    
    
};

module.exports = {register, login, edit};