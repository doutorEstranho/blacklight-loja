const express = require("express")
const Router = express.Router()
Router.get("/perfil",(req,res) => {
        res.json(req.cookies)
})
module.exports = Router