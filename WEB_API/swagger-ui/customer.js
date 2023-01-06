/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - gender
 *         - email
 *       properties:
 *         customer_id:
 *           type: string
 *           description: id of the customer
 *         customer_name:
 *           type: string
 *           description: The name of your customer
 *         first_name:
 *           type: string
 *           description: The first_name
 *         last_name:
 *           type: string
 *           description: The last_name
 *         full_name:
 *           type: string
 *           description: The full_name
 *         email:
 *           type: string
 *           description: The email
 *         phone_number:
 *           type: string
 *           description: The phone_number
 *         address:
 *           type: string
 *           description: The address of your customer
 *         gender:
 *           type: number
 *           description: The gender of your customer (0 or 1)
 *         birthday:
 *           type: string
 *           description: The birthday
 *         default_picture_url:
 *           type: string
 *           description: The default_picture_url
 *       example:
 *         first_name: Lê
 *         last_name: Tuấn Kiệt
 *         gender: 1
 *         email: 20424101@gmail.com
 * tags:
 *   name: Customers
 *   description: The Customers managing API
 * /customer:
 *   get:
 *     summary: Lists customer
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: The list of the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Some server error
 * /customer/get-options:
 *   get:
 *     summary: List options function
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 * /customer/{customerId}/change-password:
 *   put:
 *    summary: Reset password a customer -- admin
 *    tags: [Customers]
 *    parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 * /customer/{customerId}/change-password-customer:
 *   put:
 *    summary: Change password a customer
 *    tags: [Customers]
 *    parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 * /customer/{customerId}:
 *   put:
 *    summary: Update a customer
 *    tags: [Customers]
 *    parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *   delete:
 *    summary: Delete a customer
 *    tags: [Customers]
 *    parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *   get:
 *    summary: Detail a customer
 *    tags: [Customers]
 *    parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 */
