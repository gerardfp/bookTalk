var User = require('../models/user.model');

var register = (req, res, next) => {
    var errors = "";

    var correcte = 0;
    if (req.body.username == "") {
        errors += "El Nombre de usuario está vacio. \n";
        console.log("No ha introducido el nombre de usuario");
    } else {
        //mirar si està a la bbdd
        User.find({username: req.body.username}, function(err, user) {
            if (user != undefined) {
                correcte++;
                console.log("Username correcte");
            } else {
                errors += "El Nombre de usuario ya existe. \n";
                console.log("Username incorrecte");
            }
        });
    }

    if (req.body.completeName == "") {
        errors += "El Nombre completo está vacio. \n";
        console.log("No ha introducido su nombre completo")
    } else {
        correcte++;
    }

    if (req.body.birthDate == "") {
        errors += "La fecha de nacimiento está vacia";
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
            errors += "La fecha no es correcta. \n";
        } else {
            correcte++;
        }
    }

    if (req.body.email == "") {
        console.log("No ha introducido el correo electronico");
    } else {
        //comprobar que sigui un email
        emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        if (emailRegex.test(req.body.email)) {
            correcte++;
            console.log("email correcte");
        } else {
            errors += "El email no es correcto. \n";
            console.log("email incorrecte");
        }
        
    }

    if ( req.body.password == "") {
        console.log("No ha introducido la contraseña");
    } else {
        //comprovar que la contrasenya té minim una minuscula, una majuscula i un numero
        passwordRegex = /^(?=(?:.*\d){1})(?=(?:.*[A-Z]){1})(?=(?:.*[a-z]){1})\S{4,}$/i;
        if (passwordRegex.test(req.body.password)) {
            correcte++;
            console.log("contraseña correcta");
            if (req.body.password2 == "") {
                errors += "No ha vuelto a escribir la contraseña. \n";
                console.log("No ha vuelto a escribir la contraseña");
            } else {
                //comprobar que les 2 contrasenyes son iguals
                if (req.body.password == req.body.password2) {
                    correcte++;
                    console.log("Contraseñas iguales");
                } else {
                    errors += "Las contraseñas no son iguales. \n";
                    console.log("Contraseñas distintas");
                }
            }
        } else {
            errors += "Contraseña incorrecta: minimo una mayuscula, una minuscula y un numero. \n";
            console.log("contraseña incorrecta");
        }
    }
    
    if (correcte == 5) {
        console.log("S'ha registrat");
        var user = new User({username: req.body.username, completeName: req.body.completeName, birthDate: req.body.birthDate, password: req.body.password, email: req.body.email});
        user.save();
        res.redirect("/user/signin");
    } else {
        backURL = req.header('Referer') || '/';
        console.log("No s'ha registrat");
        //Volver atras
        res.redirect(backURL);
    }
};

var login = (req, res, next) => {
    User.findOne({username: req.body.username, completeName: req.body.completeName, birthDate: req.body.birthDate, password: req.body.password, email: req.body.email}, function(err, user) {
        if (user != undefined) {
            res.redirect('/');
        } else {
            res.redirect('/user/signup');
        }
    });
};

module.exports = {register, login};