const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest, ensureUserName} = require('../middleware/auth');
const Game = require('../models/Game')
const mongoose = require('mongoose');
const User = require('../models/User')
//login
//@route get /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
        error: req.flash('error')
    })
});
//admin 
//@route get /admin
router.get('/admin', [ensureAuth, ensureUserName], async (req, res) => {
    // console.log(req);
    try {
        const games = await Game.find({ user: req.user.id }).lean();
        res.render('admin', {
            name: req.user.username,
            games,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
});

//username page
//@route   get /username
router.get('/username', ensureAuth, (req, res) => {
    res.render('username', {
        layout: 'username',
        error: req.flash('error')
    })
});

//save username
///@route post /username
router.post('/username', ensureAuth, async (req, res) => {
    try {
        let uniqueUserName = await User.findOne({ username: req.body.username });
        //console.log(unique)
        if (uniqueUserName) {
            req.session.message = {
                type: 'error',
                message: 'Username not available'
            };
            res.redirect('/username');
        } else {
            await User.updateOne({ googleId: req.user.googleId }, {
                $set: {
                    username: req.body.username,
                }
            });
            res.redirect('/admin');
        }
    } catch (err) {
        req.session.message = {
            type: 'danger',
            message: 'Please insert the requested information.'
        };
        res.redirect('/username');
    }
});


module.exports = router