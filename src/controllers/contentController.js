const { Content, Tenant } = require('../models');
const { validationResult } = require('express-validator');

const createContent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, slug, content, excerpt, metadata, contentType } = req.body;

    // Validate tenant's capacity for creating content
    if (!req.tenant.canMakeApiCall()) {
      return res.status(403).json({ error: 'API call limit exceeded. Upgrade your plan.' });
    }

    const newContent = await Content.create({
      title,
      slug,
      content,
      excerpt,
      metadata,
      contentType,
      authorId: req.user.id,
      tenantId: req.tenant.id,
    });

    await req.tenant.incrementApiCalls();

    res.status(201).json({
      message: 'Content created successfully',
      content: newContent,
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ error: 'Server error creating content' });
  }
};

const updateContent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, slug, content, excerpt, metadata, contentType, status } = req.body;
    const { id } = req.params;

    const contentFound = await Content.findOne({ where: { id, tenantId: req.tenant.id } });
    if (!contentFound) {
      return res.status(404).json({ error: 'Content not found' });
    }

    await contentFound.update({
      title,
      slug,
      content,
      excerpt,
      metadata,
      contentType,
      status,
    });

    res.json({
      message: 'Content updated successfully',
      content: contentFound,
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Server error updating content' });
  }
};

const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const contentFound = await Content.findOne({ where: { id, tenantId: req.tenant.id } });
    if (!contentFound) {
      return res.status(404).json({ error: 'Content not found' });
    }

    await contentFound.destroy();

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: 'Server error deleting content' });
  }
};

const getContentList = async (req, res) => {
  try {
    const contents = await Content.findAll({ where: { tenantId: req.tenant.id } });

    res.json({ contents });
  } catch (error) {
    console.error('Fetch contents error:', error);
    res.status(500).json({ error: 'Server error fetching contents' });
  }
};

const getContentDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Content.findOne({ where: { id, tenantId: req.tenant.id } });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json({ content });
  } catch (error) {
    console.error('Fetch content error:', error);
    res.status(500).json({ error: 'Server error fetching content' });
  }
};

module.exports = {
  createContent,
  updateContent,
  deleteContent,
  getContentList,
  getContentDetail,
};

