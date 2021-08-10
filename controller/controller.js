const Game = require("../models/Game");
const imageMimeTypes = ["image/jpeg", "image/png", "image/webp", "images/gif"];

addPage = (req, res) => {
  res.render("games/add");
};

addForm = async (req, res) => {
  let newgame = new Game({
    name: req.body.name,
    description: req.body.description,
    status: req.body.status,
    user: req.user.id,
    link: req.body.link,
  });
  try {
    saveCover(newgame, req.body.cover);
    // req.body.user = req.user.id
    // await Game.create(req.body)
    newgame = await newgame.save();
    res.redirect("/games");
  } catch (err) {
    console.error(err);
    res.render("error/form");
  }
};

showAllGames = async (req, res) => {
  try {
    const games = await Game.find({status : 'active' })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("games/index", {
      games,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
};

showEdit = async (req, res) => {
  try {
    let game = await Game.findOne({
      _id: req.params.id,
    });
    game = game.toJSON();
    // console.log(game);
    if (!game) {
      return res.render("error/404");
    }

    // if (game.user != req.user.id) {
    //   res.redirect("/games");
    // } else {
    res.render("games/edit", {
      game,
    });
    // }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
};

updateGame = async (req, res) => {
  try {
    let game = await Game.findById(req.params.id).lean();

    if (!game) {
      return res.render("error/404");
    }
    // if (game.user != req.user.id) {
    //   res.redirect("/games");
    // } else {
    story = await Game.findOneAndUpdate({ _id: req.params.id }, {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      link: req.body.link,
    }, {
      new: true,
      runValidators: true,
    });
    if (saveCover(story, req.body.cover)) {
      //saveCover(story, req.body.cover);
      await story.save();
      res.redirect("/admin");
    } else {
      res.redirect("/admin");
    }

  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
};


toggleGame = async (req, res) => {
  try {
    let game = await Game.findById(req.params.id).lean();
    console.log(game);
    if (!game) {
      return res.render("error/404");
    }
    if (game.status === 'active') {
      story = await Game.findOneAndUpdate({ _id: req.params.id }, {
        status: 'inactive',
      }, {
        new: true,
        runValidators: true,
      });
    } else {
      story = await Game.findOneAndUpdate({ _id: req.params.id }, {
        status: 'active',
      }, {
        new: true,
        runValidators: true,
      });
    }
    res.redirect("/games");
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
};



deleteGame = async (req, res) => {
  try {
    let game = await Game.findById(req.params.id).lean();

    if (!game) {
      return res.render("error/404");
    }

    if (game.user != req.user.id) {
      res.redirect("/games");
    } else {
      await Game.remove({ _id: req.params.id });
      res.redirect("/admin");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
};

showSingleGame = async (req, res) => {
  try {
    let game = await Game.findById(req.params.id).populate("user");
    game = game.toJSON();
    // console.log(game);
    if (!game) {
      return res.render("error/404");
    }

    if (game.user._id != req.user.id && game.status == "private") {
      res.render("error/404");
    } else {
      //console.log(game);
      res.render("games/show", {
        game,
      });
    }
  } catch (err) {
    console.error(err);
    res.render("error/404");
  }
};

userGames = async (req, res) => {
  try {
    const games = await Game.find({
      user: req.params.userId,
      status: "active",
    })
      .populate("user")
      .lean();

    res.render("games/index", {
      games,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
};

function saveCover(game, coverEncoded) {
  if (coverEncoded == null) return false;
  try {
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      game.coverImage = new Buffer.from(cover.data, "base64");
      game.coverImageType = cover.type;
    }
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  addPage,
  addForm,
  showAllGames,
  showEdit,
  updateGame,
  deleteGame,
  showSingleGame,
  userGames,
  toggleGame
};
