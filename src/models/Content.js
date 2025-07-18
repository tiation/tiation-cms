const { DataTypes } = require('sequelize');
const database = require('../config/database');

const Content = database.define('Content', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  contentType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'page',
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft',
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  featuredImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  seoTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  seoDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  seoKeywords: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id',
    },
  },
  tenantId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Tenant',
      key: 'id',
    },
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Content',
      key: 'id',
    },
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  viewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'en',
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  indexes: [
    {
      fields: ['tenantId', 'status'],
    },
    {
      fields: ['tenantId', 'contentType'],
    },
    {
      fields: ['tenantId', 'slug'],
      unique: true,
    },
  ],
  hooks: {
    beforeCreate: (content) => {
      content.slug = content.slug.toLowerCase().replace(/\s+/g, '-');
    },
    beforeUpdate: (content) => {
      if (content.changed('slug')) {
        content.slug = content.slug.toLowerCase().replace(/\s+/g, '-');
      }
      if (content.changed('status') && content.status === 'published' && !content.publishedAt) {
        content.publishedAt = new Date();
      }
    },
  },
});

// Instance methods
Content.prototype.isPublished = function() {
  return this.status === 'published' && this.publishedAt && this.publishedAt <= new Date();
};

Content.prototype.incrementViews = async function() {
  this.viewsCount += 1;
  await this.save();
};

Content.prototype.publish = async function() {
  this.status = 'published';
  this.publishedAt = new Date();
  await this.save();
};

Content.prototype.unpublish = async function() {
  this.status = 'draft';
  this.publishedAt = null;
  await this.save();
};

module.exports = Content;
