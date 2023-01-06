/**
 * @swagger
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       required:
 *         - menu_name
 *         - is_active
 *       properties:
 *         menu_id:
 *           type: string
 *           description: id of the menu
 *         function_id:
 *           type: string
 *           description: The function id
 *         function_name:
 *           type: string
 *           description: The function name
 *         menu_name:
 *           type: string
 *           description: The menu name
 *         link_menu:
 *           type: string
 *           description: The link of menu
 *         description:
 *           type: string
 *           description: The description of menu
 *         icon_path:
 *           type: string
 *           description: The icon path
 *         parent_id:
 *           type: string
 *           description: The parent id
 *         order_index:
 *           type: string
 *           description: The order index
 *         is_active:
 *           type: number
 *           description: The state active of menu
 *         is_customer:
 *           type: string
 *           description: The is_customer
 *       example:
 *         menu_name: Test
 *         is_active: 1
 * tags:
 *   name: Menu
 *   description: The menu managing API
 * /menu:
 *   get:
 *     summary: Lists menu
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: The list of the menu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 *   post:
 *     summary: Create new a menu
 *     tags: [Menu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 * /get-by-user:
 *   get:
 *     summary: List menu by user
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: List menu by user success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 * /{menuId}(\\d+):
 *   put:
 *    summary: Update a menu
 *    tags: [Menu]
 *    parameters:
 *       - in: path
 *         name: menuId
 *         schema:
 *           type: string
 *         required: true
 *         description: The menu id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 *   get:
 *    summary: Detail a menu
 *    tags: [Menu]
 *    parameters:
 *       - in: path
 *         name: menuId
 *         schema:
 *           type: string
 *         required: true
 *         description: The menu id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 *   delete:
 *    summary: Delete a menu
 *    tags: [Menu]
 *    parameters:
 *       - in: path
 *         name: menuId
 *         schema:
 *           type: string
 *         required: true
 *         description: The menu id
 *    responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 * 
 * /{menuId}(\\d+)/change-status:
 *   put:
 *    summary: Change status a menu
 *    tags: [Menu]
 *    parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The menu id
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
