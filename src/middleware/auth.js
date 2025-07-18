const jwt = require('jsonwebtoken');
const { User, Tenant } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findOne({
      where: { id: decoded.id, isActive: true },
      include: [{
        model: Tenant,
        as: 'tenant',
        where: { isActive: true },
      }],
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid token.' 
      });
    }

    req.user = user;
    req.tenant = user.tenant;
    next();
  } catch (error) {
    res.status(401).json({ 
      error: 'Invalid token.' 
    });
  }
};

const adminAuth = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Access denied. Admin role required.' 
    });
  }
  next();
};

const editorAuth = async (req, res, next) => {
  if (!['admin', 'editor'].includes(req.user.role)) {
    return res.status(403).json({ 
      error: 'Access denied. Editor role or higher required.' 
    });
  }
  next();
};

const apiLimitCheck = async (req, res, next) => {
  try {
    if (!req.tenant.canMakeApiCall()) {
      return res.status(429).json({
        error: 'API call limit exceeded. Please upgrade your plan.',
        current: req.tenant.apiCallsCount,
        limit: req.tenant.apiCallsLimit,
      });
    }
    
    // Increment API call count
    await req.tenant.incrementApiCalls();
    next();
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error during API limit check.' 
    });
  }
};

module.exports = {
  auth,
  adminAuth,
  editorAuth,
  apiLimitCheck,
};
