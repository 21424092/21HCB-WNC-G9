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
 *           type: boolean
 *           description: The gender of your user
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
 *         updated_user:
 *           type: string
 *           description: The updated_user of your user
 *         created_user:
 *           type: string
 *           description: The created_user of your user
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
 *     summary: Create the user account
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 *   put:
 *    summary: Update the book by the id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The book id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */
