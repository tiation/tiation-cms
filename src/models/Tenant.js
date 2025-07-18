const { DataTypes } = require('sequelize');
const database = require('../config/database');

const Tenant = database.define('Tenant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^[a-zA-Z0-9-]+$/,
      len: [3, 50],
    },
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  settings: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  subscription: {
    type: DataTypes.ENUM('starter', 'professional', 'enterprise', 'custom'),
    defaultValue: 'starter',
  },
  subscriptionStatus: {
    type: DataTypes.ENUM('active', 'trial', 'canceled', 'suspended'),
    defaultValue: 'trial',
  },
  trialEndsAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  billingEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stripeSubscriptionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  apiCallsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  apiCallsLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 100000, // 100K for starter
  },
  storageUsed: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  storageLimit: {
    type: DataTypes.BIGINT,
    defaultValue: 10737418240, // 10GB for starter
  },
}, {
  hooks: {
    beforeCreate: (tenant) => {
      tenant.slug = tenant.slug.toLowerCase();
    },
    beforeUpdate: (tenant) => {
      if (tenant.changed('slug')) {
        tenant.slug = tenant.slug.toLowerCase();
      }
    },
  },
});

// Instance methods
Tenant.prototype.canMakeApiCall = function() {
  return this.apiCallsCount < this.apiCallsLimit;
};

Tenant.prototype.canUploadFile = function(fileSize) {
  return (this.storageUsed + fileSize) <= this.storageLimit;
};

Tenant.prototype.incrementApiCalls = async function() {
  this.apiCallsCount += 1;
  await this.save();
};

Tenant.prototype.updateStorageUsed = async function(bytes) {
  this.storageUsed += bytes;
  await this.save();
};

module.exports = Tenant;
