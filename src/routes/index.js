const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const router = express.Router();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tiation CMS API',
      version: '1.0.0',
      description: 'Enterprise-grade headless CMS API for industry-specific content management',
      contact: {
        name: 'Tiation Team',
        email: 'tiatheone@protonmail.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}${process.env.API_PREFIX || '/api/v1'}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// API Documentation
if (process.env.SWAGGER_ENABLED === 'true') {
  router.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}

// Health check specific to API
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Tiation CMS API is running',
    timestamp: new Date().toISOString(),
  });
});

// Import route modules
const authRoutes = require('./auth');
const contentRoutes = require('./content');
// const userRoutes = require('./users');
// const uploadRoutes = require('./upload');

// Register routes
router.use('/auth', authRoutes);
router.use('/content', contentRoutes);
// router.use('/users', userRoutes);
// router.use('/upload', uploadRoutes);

// Temporary placeholder routes for development
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Tiation CMS API',
    version: '1.0.0',
    documentation: '/docs',
    endpoints: {
      auth: '/auth',
      content: '/content',
      users: '/users',
      upload: '/upload',
    },
  });
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API information
 *     description: Returns basic information about the Tiation CMS API
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 version:
 *                   type: string
 *                 documentation:
 *                   type: string
 *                 endpoints:
 *                   type: object
 */

module.exports = router;
