import jwt from 'jsonwebtoken'
import { handleError } from '../helpers/handleError.js'

export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return next(handleError(403, "Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // <-- IMPORTANT

    next();
  } catch (err) {
    return next(handleError(403, "Invalid or expired token"));
  }
};
