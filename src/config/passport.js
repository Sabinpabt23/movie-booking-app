const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
},
async (req, accessToken, refreshToken, profile, done) => {
    try {
        // Check if user exists with google_id
        let user = await User.findOne({ where: { google_id: profile.id } });
        
        if (!user) {
            // Check if user exists with same email
            user = await User.findOne({ where: { user_email: profile.emails[0].value } });
            
            if (user) {
                // Link Google account to existing user
                await user.update({
                    google_id: profile.id,
                    avatar: profile.photos[0]?.value || null
                });
            } else {
                // Create new user
                user = await User.create({
                    user_name: profile.displayName,
                    user_email: profile.emails[0].value,
                    google_id: profile.id,
                    avatar: profile.photos[0]?.value || null,
                    user_reg_date: new Date()
                });
            }
        }
        
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;