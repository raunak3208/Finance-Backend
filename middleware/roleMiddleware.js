const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const hasRole = allowedRoles.includes(req.user.role);

    if (!hasRole) {
      return res.status(403).json({
        message: `Access denied. Only ${allowedRoles.join(', ')} can do this.`,
      });
    }
    next();
  };
};

module.exports = { allowRoles };