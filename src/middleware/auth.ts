import jwt from "jsonwebtoken"
import DBUsers from "../db/DBUsers.js";
import { createError } from "../utils/error.js"
import { objectIsDecodedToken } from "../types.js";

const config = process.env

export const verifyUser = (req, res, next) => {
  const debug: boolean = process.env.DEBUG ? true : false;
  if (debug) return next();

  const accessToken = req.cookies.access_token;

  if (!accessToken || accessToken === undefined) {
    return next(createError(401, "A token is required for authentication"))
  }
  try {
    const decoded = jwt.verify(accessToken, config.ACCESS_KEY);
    req.user = decoded;
    if (req.user.user_id === req.params.id || req.user.isAdmin) {
      return next();
    } else {
      return next(createError(403, "Unauthenticated"));
    }
  } catch (err) {
    return next(createError(401, "Invalid token"));
  }
}

export const verifyAdmin = (req, res, next) => {
  // return next(createError(401, "A token is required for authentication"))
  const debug: boolean = process.env.DEBUG ? true : false;
  if (debug) return next();
  const accessToken = req.cookies.access_token;

  if (!accessToken || accessToken === undefined) {
    return next(createError(401, "A token is required for authentication"))
  }
  try {
    const decodedToken = jwt.verify(accessToken, config.ACCESS_KEY);
    let isActive = false;
    let isAdmin = false;
    if (objectIsDecodedToken(decodedToken)) {
      const dbUsers = new DBUsers();
      isActive = dbUsers.isActive(decodedToken.user_id);
      isAdmin = decodedToken.isAdmin;
    }
    if (isAdmin) {
      return next();
    } else {
      return next(createError(403, "Unauthenticated"));
    }
  } catch (err) {
    return next(createError(401, "Invalid token"));
  }
}


// After the auth token has expired, this is called sending the refresh token in the 
// headers to see if the user can create a new refresh token
export const verify = (token) => {
  try {
    const decoded = jwt.verify(token, config.ACCESS_KEY)
    const user: any = decoded
    return user.active
  } catch (err) {
    console.log("Invalid token")
  }
}

export const verifyRefreshToken = (req, res, next) => {
  const debug: boolean = process.env.DEBUG ? true : false;
  if (debug) return next();
  const bearer = req.header("authorization");
  const token = bearer?.split(" ")[1];

  if (!token || token === undefined) {
    return next(createError(401, "A token is required for authentication"))
  }
  try {
    const decoded = jwt.verify(token, config.ACCESS_KEY);
    req.user = decoded;
    if (req.user.active) {
      return next();
    } else {
      return next(createError(403, "Unauthenticated"));
    }
  } catch (err) {
    return next(createError(401, "Invalid token"));
  }
}