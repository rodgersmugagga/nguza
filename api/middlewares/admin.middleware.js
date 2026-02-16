export const adminMiddleware = (req, res, next) => {
  // req.user is attached by authMiddleware
  // It contains { user: { id, isAdmin, ... } }

  if (!req.user || !req.user.user || !req.user.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Administrative privileges required."
    });
  }

  next();
};

export default adminMiddleware;
