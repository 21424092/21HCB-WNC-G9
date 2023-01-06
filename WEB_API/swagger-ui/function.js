/**
 * @swagger
 * components:
 *   schemas:
 *     Function:
 *       type: object
 *       required:
 *         - function_name
 *         - function_alias
 *         - function_group_id
 *         - is_active
 *       properties:
 *         function_id:
 *           type: string
 *           description: The function_id
 *         function_name:
 *           type: string
 *           description: The function_name
 *         function_alias:
 *           type: string
 *           description: The function_alias
 *         function_group_id:
 *           type: number
 *           description: The function_group_id
 *         function_group_is_check:
 *           type: string
 *           description: The function_group_is_check
 *         description:
 *           type: string
 *           description: The description
 *         is_active:
 *           type: number
 *           description: The is_active (0 or 1)
 *       example:
 *         function_name: f-name-test
 *         function_alias: f-alias-test
 *         function_group_id: f-gId-test
 *         is_active: 1
 * tags:
 *   name: Functions
 *   description: The Function managing API
 * /function:
 *   get:
 *     summary: Lists function
 *     tags: [Functions]
 *     responses:
 *       200:
 *         description: The list of the function
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Function'
 *   post:
 *     summary: Create new a function
 *     tags: [Functions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Function'
 *     responses:
 *       200:
 *         description: The created function.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Function'
 *       500:
 *         description: Some server error
 * /function/get-options:
 *   get:
 *     summary: List options
 *     tags: [Functions]
 *     responses:
 *       200:
 *         description: List options success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Function'
 * /function/functions-by-user-group:
 *   get:
 *     summary: List functions by user group
 *     tags: [Functions]
 *     responses:
 *       200:
 *         description: Successed
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Function'
 * /function/{functionId}(\\d+):
 *   put:
 *    summary: Update a function
 *    tags: [Functions]
 *    parameters:
 *       - in: path
 *         name: functionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The function id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Function'
 *   get:
 *    summary: Detail a function
 *    tags: [Functions]
 *    parameters:
 *       - in: path
 *         name: functionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The function id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Function'
 *   delete:
 *    summary: Delete a function
 *    tags: [Functions]
 *    parameters:
 *       - in: path
 *         name: functionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The function id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Function'
 * 
 * /function/{functionId}/change-status:
 *   put:
 *    summary: Change status a function
 *    tags: [Functions]
 *    parameters:
 *       - in: path
 *         name: functionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The function id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Function'
 */
