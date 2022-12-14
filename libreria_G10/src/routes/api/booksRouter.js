const express = require('express');
const router = express.Router();
const productsControllerAPI = require('../../controllers/api/productsControllerAPI');

//Rutas
//Listado de libros
router.get('/', productsControllerAPI.list);
// conteo de libros
// router.get('/count', productsControllerAPI.count);
router.get('/products', productsControllerAPI.products)

//cargar compra de carrito
router.post('/compra', productsControllerAPI.comprar)

// detalle de libro
router.get('/:id', productsControllerAPI.detail);



module.exports = router;