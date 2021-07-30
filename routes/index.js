const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest }= require('../middleware/auth');
const Game= require('../models/Game')
//login
//@route get /
router.get('/', ensureGuest, (req, res)=>{
    res.render('login', {
        layout : 'login'
    })
});

//admin 
//@route get /admin
router.get('/admin', ensureAuth, async (req,res)=>{
    try{
        const games= await Game.find({user: req.user.id}).lean();
        res.render('admin',{
            name: req.user.firstName,
            games,
        })
    }catch(err){
        console.error(err)
        res.render('error/500')
    }
});

module.exports=router