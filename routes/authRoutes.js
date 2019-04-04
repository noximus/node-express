const passport = require("passport");

module.exports = app => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  app.get("/auth/google/callback", checkUserAuth, passport.authenticate("google"));
  function checkUserAuth(req,res,next){
    if(req.session.user) return next();
    return next(new NotAuthorizedError())
  }

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.send(req.user);
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
