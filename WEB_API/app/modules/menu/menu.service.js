const database = require('../../models');
const MenuClass = require('../menu/menu.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');

const getListMenu = async (req) => {
  try {
    const page = apiHelper.getPage(req);
    const limit = apiHelper.getLimit(req);

    const query = `${PROCEDURE_NAME.SYS_MENU_GETLIST} 
      @PAGESIZE=:PAGESIZE,
      @PAGEINDEX=:PAGEINDEX,
      @KEYWORD=:KEYWORD,
      @ORDERBYDES=:ORDERBYDES,
      @FUNCTIONID=:FUNCTIONID,
      @ISACTIVE=:ISACTIVE`;
    const menus = await database.sequelize.query(query, {
      replacements: {
        PAGESIZE: limit,
        PAGEINDEX: page,
        KEYWORD: apiHelper.getQueryParam(req, 'search'),
        ORDERBYDES: apiHelper.getQueryParam(req, 'sortorder'),
        FUNCTIONID: apiHelper.getQueryParam(req, 'function_Id'),
        ISACTIVE: apiHelper.getQueryParam(req, 'is_active'),
      },
      type: database.QueryTypes.SELECT,
    });

    return {
      data: MenuClass.list(menus),
      page: page,
      limit: limit,
      total: apiHelper.getTotalData(menus),
    };
  } catch (error) {
    console.error('menuService.getListMenu', error);
    return [];
  }
};
const getListMenuByUser = async (req) => {
  try {
    const user_groups = req.auth.user_groups;
    const query = `${PROCEDURE_NAME.SYS_MENU_GETBYUSERGROUP} 
      @USERGROUPID=:USERGROUPID`;
    const menus = await database.sequelize.query(query, {
      replacements: {
        USERGROUPID: user_groups ? user_groups.join('|') : '',
      },
      type: database.QueryTypes.SELECT,
    });
    return {
      data: MenuClass.list(menus),
    };
  } catch (error) {
    console.error('menuService.getListMenuByUser', error);
    return [];
  }
};

const createMenu = async (req) => {
  try {
    req.body.menu_id = null;

    await createOrUpdateMenu(req);

    return true;
  } catch (error) {
    console.error('menuService.createMenu', error);
    return false;
  }
};

const updateMenu = async (req) => {
  try {
    req.body.menu_id = req.params.menuId;

    await createOrUpdateMenu(req);

    return true;
  } catch (error) {
    console.error('menuService.updateMenu', error);
    return false;
  }
};

const createOrUpdateMenu = async (req) => {
  let data = {
    MENUID: req.body.menu_id,
    FUNCTIONID: req.body.function_id,
    MENUNAME: req.body.menu_name,
    LINKMENU: req.body.link_menu,
    DESCRIPTION: req.body.description,
    PARENTID: req.body.parent_id,
    ORDERINDEX: req.body.order_index,
    ICONPATH: req.body.icon_path,
    ISCUSTOMER: req.body.is_customer,
    ISACTIVE: req.body.is_active,
    CREATEDUSER: apiHelper.getAuthId(req),
  };

  let query = `${PROCEDURE_NAME.SYS_MENU_CREATEORUPDATE} 
        @MENUID=:MENUID,
        @FUNCTIONID=:FUNCTIONID,
        @MENUNAME=:MENUNAME,
        @LINKMENU=:LINKMENU,
        @DESCRIPTION=:DESCRIPTION,
        @PARENTID=:PARENTID,
        @ORDERINDEX=:ORDERINDEX,
        @ICONPATH=:ICONPATH,
        @ISACTIVE=:ISACTIVE,
        @ISCUSTOMER=:ISCUSTOMER,
        @CREATEDUSER=:CREATEDUSER`;

  // Call procedure
  await database.sequelize.query(query, {
    replacements: data,
    type: database.QueryTypes.INSERT,
  });
};

const detailMenu = async (menuId) => {
  try {
    const func = await database.sequelize.query(
      `${PROCEDURE_NAME.SYS_MENU_GETBYID} @MENUID=:MENUID`,
      {
        replacements: {
          MENUID: menuId,
        },
        type: database.QueryTypes.SELECT,
      },
    );

    if (func.length) {
      return MenuClass.detail(func[0]);
    }

    return null;
  } catch (error) {
    console.error('menuService.detailMenu', error);
    return null;
  }
};

const deleteMenu = async (menuId, req) => {
  try {
    await database.sequelize.query(
      `${PROCEDURE_NAME.SYS_MENU_DELETE} @MENUID=:MENUID,@UPDATEDUSER=:UPDATEDUSER`,
      {
        replacements: {
          MENUID: menuId,
          UPDATEDUSER: apiHelper.getAuthId(req),
        },
        type: database.QueryTypes.UPDATE,
      },
    );

    return true;
  } catch (error) {
    console.error('menuService.deleteMenu', error);
    return true;
  }
};

const changeStatusMenu = async (menuId, req) => {
  try {
    const query = `${PROCEDURE_NAME.SYS_MENU_UPDATESTATUS} 
      @MENUID=:MENUID,
      @UPDATEDUSER=:UPDATEDUSER,
      @ISACTIVE=:ISACTIVE`;
    await database.sequelize.query(query, {
      replacements: {
        MENUID: menuId,
        ISACTIVE: req.body.is_active,
        UPDATEDUSER: apiHelper.getAuthId(req),
      },
      type: database.QueryTypes.UPDATE,
    });

    return true;
  } catch (error) {
    console.error('menuService.changeStatusMenu', error);
    return true;
  }
};

module.exports = {
  getListMenu,
  getListMenuByUser,
  createMenu,
  detailMenu,
  updateMenu,
  deleteMenu,
  changeStatusMenu,
};
