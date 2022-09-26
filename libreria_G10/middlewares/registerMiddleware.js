const { body } = require('express-validator');


const registerValidation = [

    body('nombre').isLength({ min: 3 }).withMessage('El nombre debe ser mas largo').bail()
        .notEmpty().withMessage("Debes completar el nombre"),

    body('apellido').isLength({ min: 3 }).withMessage('El apellido debe ser mas largo').bail()
        .notEmpty().withMessage("Debes completar el apellido"),

    body('domicilio').isLength({ min: 8 }).withMessage('Contraseña de 8 caracteres como mínimo').bail()
        .notEmpty().withMessage("Debes completar el domicilio"),

    body('telefono').isLength({ min: 8 }).withMessage('Contraseña de 8 caracteres como mínimo').bail()
        .notEmpty().withMessage("Debes completar el telefono"),

    body('email').isEmail().withMessage('Email inválido').bail()
        .notEmpty().withMessage("Debes completar el email"),

    body('password').isLength({ min: 8 }).withMessage('Contraseña de 8 caracteres como mínimo').bail()
        .notEmpty().withMessage("Debes completar la contraseña"),


]

module.exports = registerValidation;