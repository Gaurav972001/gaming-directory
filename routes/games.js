const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
// const Game = require('../models/Game');
// const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp' ,'images/gif'];
const controller= require('../controller/controller')

//show add page
//@route get /games/add
router.get('/add', ensureAuth, controller.addPage);

//Process add form
//@route   POST /games
router.post('/', ensureAuth, controller.addForm);

// Show all games
// @route   GET /games
router.get('/', ensureAuth, controller.showAllGames);

//Show edit page
// @route   GET /games/edit/:id
router.get('/edit/:id', controller.showEdit);

//Update game
// @route   PUT /game/:id
router.put('/:id', controller.updateGame);

// Delete game
// @route   DELETE /games/:id
router.delete('/:id', ensureAuth,controller.deleteGame);

//Show single game
// @route   GET /game/:id
router.get('/:id', ensureAuth, controller.showSingleGame);

// User games
// @route   GET /games/user/:userId
router.get('/user/:userId', ensureAuth, controller.userGames)

// function saveCover(game, coverEncoded) {
//   if (coverEncoded == null) return
//   const cover = JSON.parse(coverEncoded)
//   if (cover != null && imageMimeTypes.includes(cover.type)) {
//     game.coverImage = new Buffer.from(cover.data, 'base64')
//     game.coverImageType = cover.type
//   }
// }


module.exports = router
