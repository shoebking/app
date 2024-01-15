const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
	new GoogleStrategy(
		{
			clientID: '929336516247-grl4rdr29re76otfi8siarl6g3osbt2g.apps.googleusercontent.com',
			clientSecret: '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',
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},
		function (accessToken, refreshToken, profile, callback) {
			callback(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});