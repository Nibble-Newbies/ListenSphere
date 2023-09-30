import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../../models/user.js'; // Adjust the path accordingly

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret',
};

const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findOne({ id: jwt_payload.sub });

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  } catch (err) {
    return done(err, false);
  }
});

export default jwtStrategy;