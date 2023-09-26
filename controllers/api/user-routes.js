const router = require('express').Router();
const { User } = require('../../models');

// when first coming to our website, system will check if there is a saved user logged in
router.post('/', async (req, res) => {
  try {
    const existingUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    //if there is a user logged in, session storage will save them until they actually push 'log out'
    req.session.save(() => {
      req.session.loggedIn = true;

      res.status(200).json(existingUser);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// from the login/sign-up page, if the user clicks 'login' they will be taken here
router.post('/login', async (req, res) => {
  try {
    const existingUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!existingUser) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    const validPassword = await existingUser.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    req.session.save(() => {
      req.session.loggedIn = true;

      res
        .status(200)
        .json({ user: existingUser, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// logout
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
