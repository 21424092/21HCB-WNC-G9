/**
 * @swagger
 * components:
 *   schemas:
 *     FunctionGroup:
 *       type: object
 *       required:
 *         - function_group_name
 *         - order_index
 *         - is_active
 *       properties:
 *         function_group_id:
 *           type: string
 *           description: The function_group_id
 *         function_group_name:
 *           type: string
 *           description: The function_group_name
 *         description:
 *           type: string
 *           description: The description
 *         order_index:
 *           type: number
 *           description: The order_index
 *         is_active:
 *           type: number
 *           description: The order_index
 *       example:
 *         function_group_name: fgn_test
 *         order_index: 10
 *         is_active: 1
 * tags:
 *   name: FunctionGroups
 *   description: The FunctionGroups managing API
 * /function-group:
 *   get:
 *     summary: Lists all the FunctionGroups
 *     tags: [FunctionGroups]
 *     responses:
 *       200:
 *         description: The list of the FunctionGroups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FunctionGroup'
 *   post:
 *     summary: Create a new FunctionGroup
 *     tags: [FunctionGroups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FunctionGroup'
 *     responses:
 *       200:
 *         description: The created FunctionGroup.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FunctionGroup'
 *       500:
 *         description: Some server error
 * /function-group/get-options:
 *   get:
 *     summary: Get options the FunctionGroups
 *     tags: [FunctionGroups]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FunctionGroup'
 * /function-group/{id}:
 *   put:
 *    summary: Update a Function Group
 *    tags: [FunctionGroups]
 *    parameters:
 *       - in: path
 *         name: functionGroupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The function group id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FunctionGroup'
 *   delete:
 *    summary: Delete a Function Group
 *    tags: [FunctionGroups]
 *    parameters:
 *       - in: path
 *         name: functionGroupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The function group id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FunctionGroup'
 *   get:
 *    summary: Detail a Function Group
 *    tags: [FunctionGroups]
 *    parameters:
 *       - in: path
 *         name: functionGroupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The function group id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FunctionGroup'
 * /function-group/{id}/status:
 *   put:
 *    summary: Update a Function Group
 *    tags: [FunctionGroups]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FunctionGroup'
 *    parameters:
 *       - in: path
 *         name: functionGroupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The function group id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FunctionGroup'
 */
