const User = require('./User');
const Tenant = require('./Tenant');
const Content = require('./Content');

// Define associations
Tenant.hasMany(User, {
  foreignKey: 'tenantId',
  as: 'users',
});

User.belongsTo(Tenant, {
  foreignKey: 'tenantId',
  as: 'tenant',
});

Tenant.hasMany(Content, {
  foreignKey: 'tenantId',
  as: 'contents',
});

Content.belongsTo(Tenant, {
  foreignKey: 'tenantId',
  as: 'tenant',
});

User.hasMany(Content, {
  foreignKey: 'authorId',
  as: 'contents',
});

Content.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
});

// Self-referential association for content hierarchy
Content.hasMany(Content, {
  foreignKey: 'parentId',
  as: 'children',
});

Content.belongsTo(Content, {
  foreignKey: 'parentId',
  as: 'parent',
});

module.exports = {
  User,
  Tenant,
  Content,
};
