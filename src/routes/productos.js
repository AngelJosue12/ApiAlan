const express = require("express");
const productos = require("../models/productos");

const router = express.Router();

//crear productos
router.post("/productos",(req,res)=>{
    const prod = productos(req.body);
    prod.save()
                .then((data)=> res.json(data))
                .catch((error)=>res.json({message:error}));
});

//consultar
router.get('/productos',(req,res)=>{
    productos.aggregate([
        {
            $lookup:{
                from:'categorias',
                localField:'nombreCategoria', 
                foreignField:'_id', 
                as:'nombreCategoria'
            }
        }
    ])
    .then((data)=>res.json(data))
    .catch((error)=>res.json({message:error}));
});

//exportar
module.exports = router ;