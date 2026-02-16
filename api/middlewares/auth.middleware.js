import jwt from 'jsonwebtoken'
import dotenv from "dotenv";

dotenv.config();


// Middleware to authenticate requests using JWT
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace('Bearer ', ''); //get token from header
    // Check if no token
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

  
    //decode token
    try {
      // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //attach user to request object
        req.user = decoded;
        //pass to the next middleware or route handler
        next();

        
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

// Export the authMiddleware
export default authMiddleware;