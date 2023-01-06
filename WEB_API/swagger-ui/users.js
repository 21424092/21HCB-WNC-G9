/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - gender
 *         - email
 *       properties:
 *         user_id:
 *           type: string
 *           description: id of the user
 *         full_name:
 *           type: string
 *           description: The full name of your user
 *         email:
 *           type: string
 *           description: The user email
 *         phone_number:
 *           type: string
 *           description: The phone number of your user
 *         address:
 *           type: string
 *           description: The address of your user
 *         gender:
 *           type: number
 *           description: The gender of your user (0 or 1)
 *         default_picture_url:
 *           type: string
 *           description: The picture url of your user
 *         user_name:
 *           type: string
 *           description: The address of your user
 *         password:
 *           type: string
 *           description: The password of your user
 *         first_name:
 *           type: string
 *           description: The first_name of your user
 *         last_name:
 *           type: string
 *           description: The last_name of your user
 *         birthday:
 *           type: string
 *           description: The birthday of your user
 *         user_groups:
 *           type: string
 *           description: The user_groups of your user
 *       example:
 *         first_name: Lê
 *         last_name: Tuấn Kiệt
 *         gender: 1
 *         email: 20424101@gmail.com
 * tags:
 *   name: Users
 *   description: The users managing API
 * /user:
 *   get:
 *     summary: Lists all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 * /user/create:
 *   post:
 *     summary: Generate username
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Generate username success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 * /user/get-options:
 *   get:
 *     summary: Get options the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 * /user/{userId}/change-password:
 *   put:
 *    summary: Reset password a user -- admin
 *    tags: [Users]
 *    parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 * /user/{userId}/change-password-user:
 *   put:
 *    summary: Reset password a user
 *    tags: [Users]
 *    parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 * /user/{userId}:
 *   put:
 *    summary: Update a user
 *    tags: [Users]
 *    parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   delete:
 *    summary: Delete a user
 *    tags: [Users]
 *    parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   get:
 *    summary: Detail a user
 *    tags: [Users]
 *    parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
