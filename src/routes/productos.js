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


//disminuir disponibilidad

router.post("/productos/existencia/:id",(req,res)=>{
  const { id } = req.params;
  const { cantidad } = req.body;
  productos.findOne({_id:id})
      .then((producto)=>{
        if(producto){
          const existencia_actual = producto.disponibilidad
          const existencia_nueva = existencia_actual- cantidad  
          const updateQuery = {$set:{disponibilidad: existencia_nueva}};
          return productos.updateOne({_id:id}, updateQuery)
            .then(() => {
              res.json({message: "La existencia se actualizó correctamente"});
            })
            .catch((error) => {
              res.json({message: error});
            });
        }else{
          res.json({message: "No se encontró el producto con el id proporcionado"});
        }
      })
      .catch((error)=> res.json({message: error}));
});


//consultar solo un producto 

router.get("/productos/:id",(req,res)=>{
    const { id }=req.params;
    productos
        .findById(id)
        .then((data)=> res.json(data))
        .catch((error)=> res.json({message: error}));
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
