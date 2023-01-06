/**
 * @swagger
 * components:
 *   schemas:
 *     UserGroup:
 *       type: object
 *       required:
 *         - user_group_name
 *         - order_index
 *         - is_active
 *       properties:
 *         user_group_id:
 *           type: string
 *           description: The user_group_id
 *         user_group_name:
 *           type: string
 *           description: The user_group_name
 *         description:
 *           type: string
 *           description: The description
 *         order_index:
 *           type: number
 *           description: The order_index
 *         is_active:
 *           type: number
 *           description: The is_active (0 or 1)
 *       example:
 *         user_group_name: gName01
 *         order_index: 1
 *         is_active: 1
 * tags:
 *   name: UserGroups
 *   description: The Use Groups managing API
 * /usergroup:
 *   get:
 *     summary: Lists user group
 *     tags: [UserGroups]
 *     responses:
 *       200:
 *         description: The list of the use group
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserGroup'
 *   post:
 *     summary: Create new a user group
 *     tags: [UserGroups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserGroup'
 *     responses:
 *       200:
 *         description: The created user group.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserGroup'
 *       500:
 *         description: Some server error
 * /usergroup/get-options:
 *   get:
 *     summary: List options
 *     tags: [UserGroups]
 *     responses:
 *       200:
 *         description: List options success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserGroup'
 * /usergroup/{userGroupId}(\\d+):
 *   put:
 *    summary: Update a user group
 *    tags: [UserGroups]
 *    parameters:
 *       - in: path
 *         name: userGroupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user group id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserGroup'
 *   get:
 *    summary: Detail a user group
 *    tags: [UserGroups]
 *    parameters:
 *       - in: path
 *         name: userGroupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user group id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserGroup'
 *   delete:
 *    summary: Delete a user group
 *    tags: [UserGroups]
 *    parameters:
 *       - in: path
 *         name: userGroupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user group id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserGroup'
 * 
 * /usergroup/{userGroupId}/change-status:
 *   put:
 *    summary: Change status a user group
 *    tags: [UserGroups]
 *    parameters:
 *       - in: path
 *         name: userGroupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user group id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserGroup'
 */
