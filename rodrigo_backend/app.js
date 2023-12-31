const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const HttpError = require('./HttpError');

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const crypto = require('crypto');


const recetteRouter = require('./routes/recetteRouter');

const commentRouter = require('./routes/commentRouter');

const etapeRouter = require('./routes/EtapeRouter');

const ingredientRouter = require('./routes/IngredientRouter');

const appreciationRouter = require('./routes/AppreciationRouter');

const userAccountQueries = require("./queries/UserAccountQueries");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));


class BasicStrategyModified extends BasicStrategy {
  constructor(options, verify) {
    return super(options, verify);
  }

  _challenge() {
    return 'xBasic realm="' + this._realm + '"';
  }
}

passport.use(new BasicStrategyModified((user_email, password, cb) => {
  userAccountQueries.getLoginByUserAccountEmail(user_email).then(login => {
    if (!login || !login.isActive) {
      return cb(null, false);
    }

    const iterations = 100000;
    const keylen = 64;
    const digest = "sha512";

    crypto.pbkdf2(password, login.passwordSalt, iterations, keylen, digest, (err, hashedPassword) => {
      if (err) {
        return cb(err);
      }

      const passwordHashBuffer = Buffer.from(login.passwordHash, "base64");

      if (!crypto.timingSafeEqual(passwordHashBuffer, hashedPassword)) {
        return cb(null, false);
      }

      return cb(null, login);
    });
  }).catch(err => {
    return cb(err);
  });
}));

app.use('/recettes', recetteRouter);
app.use('/comments', commentRouter);
app.use('/etapes', etapeRouter);
app.use('/ingredients', ingredientRouter);
app.use('/appreciation', appreciationRouter);

app.get('/login',
  passport.authenticate('basic', { session: false }),
  (req, res, next) => {

    if (req.user) {

      const userDetails = {
        courrielUtilisateur: req.user.courrielUtilisateur,
        nomComplet: req.user.nomComplet,
        isAdmin: req.user.isAdmin,
        isActive: req.user.isActive
      };

      res.json(userDetails);
    } else {
      return next({ status: 500, message: "Propriété user absente" });
    }
  }
);

app.post('/login',
  (req, res, next) => {
    if (!req.body.courrielUtilisateur || req.body.courrielUtilisateur === '') {
      return next(new HttpError(400, "Propriété courrielUtilisateur requise"));
    }

    if (!req.body.password || req.body.password === '') {
      return next(new HttpError(400, "Propriété password requise"));
    }

    const saltBuf = crypto.randomBytes(16);
    const salt = saltBuf.toString("base64");

    crypto.pbkdf2(req.body.password, salt, 100000, 64, "sha512", async (err, derivedKey) => {
      if (err) {
        return next(err);
      }

      const passwordHashBase64 = derivedKey.toString("base64");

      try {
        const userAccountWithPasswordHash = await userAccountQueries.createUserAccount(req.body.courrielUtilisateur, req.body.nomComplet,
          passwordHashBase64, salt);

        const userDetails = {
          courrielUtilisateur: userAccountWithPasswordHash.courrielUtilisateur,
          nomComplet: userAccountWithPasswordHash.nomComplet,
          isAdmin: userAccountWithPasswordHash.isAdmin,
          isActive: userAccountWithPasswordHash.isActive
        };

        res.json(userDetails);
      } catch (err) {
        return next(err);
      }

    });
  }
);

app.use((err, req, res, next) => {
  console.log("error handler: ", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500)
  if (err instanceof HttpError) {
    res.json(err.getJsonMessage());
  } else {
    res.json(err);
  }
});

module.exports = app;
