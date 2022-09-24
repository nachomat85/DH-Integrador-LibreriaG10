const express = require("express");
const path = require('path');
//const fs = require('fs');
// const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
//const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
const session = require('express-session');
const { check, body, validationResult } = require('express-validator');
let bcrypt = require("bcryptjs");
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const { Console } = require("console");
const { promiseImpl } = require("ejs");
const usersController = {
    register: (req, res) => {
        res.render('../views/users/register.ejs')
    },
    store: (req, res) => {
        db.Users.findAll().then(function (usuarios) {
            encontrados = usuarios;
        }).then(function () {
            let duplicado = false;
            for (let i = 0; i < encontrados.length; i++) {
                if (encontrados[i].email == req.body.email) {
                    duplicado = true;
                    break;
                }
            }
            console.log("usuario duplicado " + duplicado)
            if (!duplicado) {
                db.Users.create({
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    email: req.body.email,
                    domicilio: req.body.domicilio,
                    password: bcrypt.hashSync(req.body.password, 10),
                    tipo_id: 1,
                }).then((user) => {
                    console.log(user)
                    res.render('../views/users/login.ejs')
                })
            }
            else {
                return res.render('../views/users/register.ejs', {
                    errors: [{ msg: 'El email ' + req.body.email + ' ya se encuentra registrado. Intente nuevamente' }
                    ]
                });
            }
        })
    }
    ,
    login: (req, res) => {
        res.render('../views/users/login.ejs')
    },
    loginProcess: (req, res) => {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            db.Users.findAll().then(function (usuarios) {
                encontrados = usuarios;
            }).then(function () {
                let usuarioALoguearse;
                for (let i = 0; i < encontrados.length; i++) {
                    if (encontrados[i].email == req.body.email) {
                        if (bcrypt.compareSync(req.body.password, encontrados[i].password)) {
                            usuarioALoguearse = encontrados[i];
                            break;
                        }
                    }
                }
                if (usuarioALoguearse == undefined) {
                    return res.render('../views/users/login.ejs', {
                        errors: [{ msg: 'Credenciales inválidas' }
                        ]
                    });
                }
                // parte que hace el loggin
                //delete.usuarioALoguearse.password; //para no guardarla en la sesion
                req.session.usuarioLogueado = usuarioALoguearse;
                console.log(usuarioALoguearse);
                // 60.000 mls= 60 seg
                if (req.body.recordame != undefined) {
                    res.cookie('recordame', usuarioALoguearse.email, { maxAge: 600000 })
                }
            }).then(function () {
                res.render('../views/users/profile.ejs', { user: req.session.usuarioLogueado })
            })
        }
        else {
            return res.render('../views/users/login.ejs', { errors: errors.errors });
        }
    },
    edit: (req, res) => {
        db.Users.findByPk(req.params.id).then(function (user) {
            req.session.usuarioLogueado = user; // sino, cuando edito el usuario, el logueado es el primero sin cambios
            res.render('../views/users/userEdit.ejs', { user: req.session.usuarioLogueado });
        })
    },
    update: (req, res) => {
        db.Users.update({
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            domicilio: req.body.domicilio,
        }, {
            where: {
                id: req.params.id
            }
        }).then(function (user) {
            db.Users.findByPk(req.params.id).then(function (user) {
                res.render('../views/users/profile.ejs', { user: user }) // el profile no agarra los datos pero se cambiaron
            })
        })
    },
    profile: (req, res) => {
        res.render('../views/users/profile.ejs', { user: req.session.usuarioLogueado })
    },
    logout: (req, res) => {
        if (req.session) {
            req.session.destroy(err => {
                if (err) {
                    res.status(400).send('Unable to log out')
                } else {
                    res.render('../views/users/login.ejs')
                }
            });
        } else {
            res.end()
        }
    },
}
module.exports = usersController