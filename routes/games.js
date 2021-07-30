const express = require('express');
const router = express.Router();
const {ensureAuth}= require('../middleware/auth');
const Game= require('../models/Game')

//show add page
//@route get /games/add
router.get('/add', ensureAuth, (req, res)=>{
    res.render('games/add');
});

//Process add form
//@route   POST /games
router.post('/', ensureAuth, async (req, res) => {
    try {
      req.body.user = req.user.id
      await Game.create(req.body)
      res.redirect('/admin')
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })

// Show all games
// @route   GET /games
router.get('/', ensureAuth, async (req, res) => {
    try {
      const games = await Game.find({ status: 'active' })
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean();
  
      res.render('games/index', {
        games,
      });
    } catch (err) {
      console.error(err);
      res.render('error/500');
    }
  });

//Show edit page
// @route   GET /games/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
      const game = await Game.findOne({
        _id: req.params.id,
      }).lean()
  
      if (!game) {
        return res.render('error/404');
      }
  
      if (game.user != req.user.id) {
        res.redirect('/games');
      } else {
        res.render('games/edit', {
          game,
        })
      }
    } catch (err) {
      console.error(err);
      return res.render('error/500');
    }
  });

//Update game
// @route   PUT /game/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
      let game = await Game.findById(req.params.id).lean()
  
      if (!game) {
        return res.render('error/404')
      }
  
      if (game.user != req.user.id) {
        res.redirect('/games')
      } else {
        story = await Game.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        })
  
        res.redirect('/admin')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  });

// Delete game
// @route   DELETE /games/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
      let game = await Game.findById(req.params.id).lean();
  
      if (!game) {
        return res.render('error/404');
      }
  
      if (game.user != req.user.id) {
        res.redirect('/games');
      } else {
        await Game.remove({ _id: req.params.id });
        res.redirect('/admin');
      }
    } catch (err) {
      console.error(err);
      return res.render('error/500');
    }
  });

//Show single game
// @route   GET /game/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
      let game = await Game.findById(req.params.id).populate('user').lean()
  
      if (!game) {
        return res.render('error/404')
      }
  
      if (game.user._id != req.user.id && game.status == 'private') {
        res.render('error/404')
      } else {
        res.render('games/show', {
          game,
        })
      }
    } catch (err) {
      console.error(err)
      res.render('error/404')
    }
  });

// User games
// @route   GET /games/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
      const games = await Game.find({
        user: req.params.userId,
        status: 'active',
      })
        .populate('user')
        .lean()
  
      res.render('games/index', {
        games,
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })

module.exports=router