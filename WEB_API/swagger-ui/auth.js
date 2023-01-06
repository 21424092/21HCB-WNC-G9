/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       required:
 *         - user_name
 *         - password
 *       properties:
 *         user_name:
 *           type: string
 *           description: input user_name
 *         password:
 *           type: string
 *           description: input password
 *       example:
 *         user_name: Administrator
 *         password: 123456
 * tags:
 *   name: Auths
 *   description: The Auths managing API
 * /auth/token:
 *   post:
 *     summary: Get token
 *     tags: [Auths]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: Successed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       500:
 *         description: Some server error
 * /auth/refresh-token:
 *   post:
 *     summary: refresh token
 *     tags: [Auths]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: Successed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       500:
 *         description: Some server error
 * /auth/get-profile:
 *   get:
 *     summary: Get profile
 *     tags: [Auths]
 *     responses:
 *       200:
 *         description: Successed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       500:
 *         description: Some server error
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auths]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: Successed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       500:
 *         description: Some server error
 */
