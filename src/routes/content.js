const express = require('express');
const { body } = require('express-validator');
const contentController = require('../controllers/contentController');
const { auth, editorAuth, apiLimitCheck } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Content:
 *       type: object
 *       required:
 *         - title
 *         - slug
 *         - contentType
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the content
 *         title:
 *           type: string
 *           description: The content title
 *         slug:
 *           type: string
 *           description: The content slug
 *         content:
 *           type: string
 *           description: The content body
 *         excerpt:
 *           type: string
 *           description: The content excerpt
 *         metadata:
 *           type: object
 *           description: Additional metadata
 *         contentType:
 *           type: string
 *           description: The content type
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *           description: The content status
 *         publishedAt:
 *           type: string
 *           format: date-time
 *           description: The date the content was published
 *         authorId:
 *           type: string
 *           description: The author id
 *         tenantId:
 *           type: string
 *           description: The tenant id
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the content was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the content was last updated
 */

/**
 * @swagger
 * /content:
 *   get:
 *     summary: Get all content for the authenticated tenant
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, apiLimitCheck, contentController.getContentList);

/**
 * @swagger
 * /content/{id}:
 *   get:
 *     summary: Get content by ID
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The content ID
 *     responses:
 *       200:
 *         description: Content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   $ref: '#/components/schemas/Content'
 *       404:
 *         description: Content not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', auth, apiLimitCheck, contentController.getContentDetail);

/**
 * @swagger
 * /content:
 *   post:
 *     summary: Create new content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - contentType
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               metadata:
 *                 type: object
 *               contentType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Content created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 content:
 *                   $ref: '#/components/schemas/Content'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth, editorAuth, [
  body('title').trim().notEmpty(),
  body('slug').trim().notEmpty(),
  body('content').optional().trim(),
  body('excerpt').optional().trim(),
  body('metadata').optional().isObject(),
  body('contentType').trim().notEmpty(),
], contentController.createContent);

/**
 * @swagger
 * /content/{id}:
 *   put:
 *     summary: Update content by ID
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The content ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               metadata:
 *                 type: object
 *               contentType:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *     responses:
 *       200:
 *         description: Content updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 content:
 *                   $ref: '#/components/schemas/Content'
 *       404:
 *         description: Content not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', auth, editorAuth, [
  body('title').optional().trim().notEmpty(),
  body('slug').optional().trim().notEmpty(),
  body('content').optional().trim(),
  body('excerpt').optional().trim(),
  body('metadata').optional().isObject(),
  body('contentType').optional().trim().notEmpty(),
  body('status').optional().isIn(['draft', 'published', 'archived']),
], contentController.updateContent);

/**
 * @swagger
 * /content/{id}:
 *   delete:
 *     summary: Delete content by ID
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The content ID
 *     responses:
 *       200:
 *         description: Content deleted successfully
 *       404:
 *         description: Content not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', auth, editorAuth, contentController.deleteContent);

module.exports = router;
