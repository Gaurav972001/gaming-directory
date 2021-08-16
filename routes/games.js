const express = require('express');
const router = express.Router();
const { ensureAuth, ensureUserName } = require('../middleware/auth');
// const Game = require('../models/Game');
// const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp' ,'images/gif'];
const controller= require('../controller/controller')

//show add page
//@route get /games/add
router.get('/add', [ensureAuth, ensureUserName], controller.addPage);

//Process add form
//@route   POST /games
router.post('/', [ensureAuth, ensureUserName], controller.addForm);

// Show all games
// @route   GET /games
router.get('/', [ensureAuth, ensureUserName], controller.showAllGames);

//Show edit page
// @route   GET /games/edit/:id
router.get('/edit/:id', [ensureAuth, ensureUserName], controller.showEdit);

//Update game
// @route   PUT /game/:id
router.put('/:id', [ensureAuth, ensureUserName], controller.updateGame);

//toggle game status
// @route   PUT /game/toggle/:id
router.put('/toggle/:id', [ensureAuth, ensureUserName], controller.toggleGame);

// Delete game
// @route   DELETE /games/:id
router.delete('/:id', [ensureAuth, ensureUserName], controller.deleteGame);

//Show single game
// @route   GET /game/:id
router.get('/:id',[ensureAuth, ensureUserName],controller.showSingleGame);

// User games
// @route   GET /games/user/:userId
router.get('/user/:userId', [ensureAuth, ensureUserName], controller.userGames)


module.exports = router
