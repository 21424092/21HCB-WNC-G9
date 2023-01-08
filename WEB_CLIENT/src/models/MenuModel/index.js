//
import Model from '../Model';
import MenuEntity from '../MenuEntity';
/**
 * @class MenuModel
 */
export default class MenuModel extends Model {
  /** @var {String} redux store::state key */
  _stateKeyName = "menus";

  /** @var {Ref} */
  _entity = MenuEntity;

  /** @var {String} */
  static API_MENU_LIST = "menu";
  /** @var {String} */
  static API_MENU_OPTS = "menu/get-options";
  /** @var {String} */
  static API_MENU_CREATE = "menu";
  /** @var {String} */
  static API_MENU_UPDATE = "menu/:id"; // PUT
  /** @var {String} */
  static API_MENU_READ = "menu/:id"; // GET
  /** @var {String} */
  static API_MENU_DELETE = "menu/:id"; // DELETE
  /** @var {String} */
  static API_MENU_UPDATE_STATUS = "menu/:id/change-status"; // PUT
  /** @var {String} */
  static API_MENU_GET_BY_USER = "menu/get-by-user"; // GET
  /** @var {String} */
  static API_MENU_GET_BY_CUSTOMER = "menu/get-by-customer"; // GET

  /**
   * @var {String} Primary Key
   */
  primaryKey = "menu_id";

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = "";

  /**
   * jqx's grid columns & datafields!
   * @var {Array}
   */
  static _jqxGridColumns = [
    { datafield: "menu_id" },
    {
      text: "Tên menu",
      datafield: "menu_name",
      pinned: true,
      width: 180,
    },
    { datafield: "function_id" },
    {
      text: "Module",
      datafield: "module_name",
      width: 120,
    },
    {
      text: "Link",
      datafield: "link_menu",
      width: 180,
    },
    {
      text: "Thứ tự",
      datafield: "order_index",
      width: 80,
    },
    {
      text: "Mô tả",
      datafield: "description",
      sortable: false,
      filterable: false,
    },
    {
      text: "Active?",
      datafield: [
        "is_active",
        {
          type: "int",
        },
      ],
      width: 60,
      cellsalign: "center",
      columntype: "checkbox",
      filtertype: "bool",
    },
  ];

  /**
   *
   * @static
   * @memberof MenuModel
   */
  static getOptionsRecursive(input, opts, output) {
    // console.log('getOptionsRecursive');
    // Format output
    output = output instanceof Array ? output : [];

    // Format opts
    // +++
    opts = Object.assign(
      {
        level: 0,
        prefix: " |--- ",
        idProp: "menu_id",
        pidProp: "parent_id",
        nameProp: "menu_name",
        sortProp: "order_index",
      },
      opts
    );
    // +++
    opts.level++;
    // +++
    let parentId = opts.parentId;
    parentId =
      parentId === null || parentId === undefined ? "0" : "" + parentId;
    // +++
    opts.merge =
      opts.merge ||
      function ({ item, output, opts /*, input*/ }) {
        output.push(item);
      };

    // Sort?
    if (opts.level === 1 && input.length) {
      input.sort(function (a, b) {
        let aIdx = 1 * a[opts.sortProp];
        let bIdx = 1 * b[opts.sortProp];
        return !isNaN(aIdx) && isNaN(bIdx) ? aIdx > bIdx : 0;
      });
    }

    //
    (input || []).forEach((item) => {
      item = Object.assign({}, item);
      if (opts.pidProp in item && "" + item[opts.pidProp] === parentId) {
        if (opts.nameProp in item) {
          item[opts.nameProp] =
            new Array(opts.level).join(opts.prefix) + item[opts.nameProp];
        }
        opts.merge({ item, output, opts, input });
        let id = item.id || item[opts.idProp];
        if (id) {
          Object.assign(opts, { parentId: id });
          _static.getOptionsRecursive(input, opts, output);
        }
      }
    });

    return output;
  }

  /**
   * @return {Object}
   */
  fillable = () => ({
    menu_name: "",
    function_id: "",
    link_menu: "",
    is_active: 1,
    is_customer: 1,
    description: "",
    parent_id: null,
    order_index: "0",
    icon_path: "",
  });

  /**
   * Return jqx's grid columns
   * @param {Object} opts Options
   * @return {Array}
   */
  static jqxGridProps(opts) {
    let _self = new _static();

    // Get, format options
    opts = Object.assign(
      {
        prefix: _static.columnPrefix,
        // events
        // +++ format (mapping) API data before render
        postBeforeProcessing: (data) => {
          (data.items || []).forEach((item) => {
            // Case:
            // if ('' in item) {}
            //
          });
        },
      },
      opts
    );

    //
    let props = Model.jqxGridProps(_static._jqxGridColumns, opts);
    // +++
    Object.assign(props.source, {
      url: _static.apiClass.buildApiUri(_static.API_MENU_LIST),
      id: _self.primaryKey,
    });

    // Return;
    return props;
  }

  /**
   * Get list
   * @returns Promise
   */
  list(_opts) {
    // Get, format input
    let opts = Object.assign({}, _opts);
    let formatOpts = opts["_format"] || {};
    delete opts["_format"];

    let ret = this._api.get(_static.API_MENU_LIST, opts);

    // Recursive?
    if (true === formatOpts.recursive) {
      ret.then((data) => {
        let { items } = data;
        // console.log(items)
        if (items && items.length) {
          Object.assign(data, {
            items: _static.getOptionsRecursive(items),
          });
        }
        return data;
      });
    }

    return ret;
  }

  /**
   * Get options (list opiton)
   * @returns Promise
   */
  getOptions(_opts) {
    // Format options
    let opts = _opts || {};
    let apiOpts = Object.assign(
      {
        itemsPerPage: 256, // Number.MAX_SAFE_INTEGER // @TODO: get all records
        is_active: 1,
        exclude_id: [],
      },
      opts["_api"]
    );
    delete opts["_api"];

    //
    return this.list(apiOpts)
      .then(({ items }) => {
        let ret = _static.getOptionsRecursive(items, opts);
        // console.log('getOptions: ', ret, items);
        return ret;
      })
      .then((items) => {
        let excludeIdStr = "|" + apiOpts.exclude_id.join("|") + "|";
        let ret = (items || []).map(
          ({ menu_id: id, menu_name: name, parent_id }) => {
            // Nam trong list exclude --> set null
            if (excludeIdStr.indexOf("|" + id + "|") >= 0) {
              return null;
            }
            return { name, id, parent_id };
          }
        );
        // Filter null items
        return ret.filter((item) => item);
      });
  }

  /**
   * Get options (list opiton)
   * @param {Object} opts
   * @returns Promise
   */
  getOptionsRev2(opts) {
    return this._api.get(_static.API_MENU_OPTS, opts);
  }

  /**
   * @return {Promise}
   */
  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, this.fillable(), _data);
    //
    return this._api.post(_static.API_MENU_CREATE, data);
  }

  /**
   * @return {Promise}
   */
  read(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api
      .get(_static.API_MENU_READ.replace(":id", id), data)
      .then((data) => new MenuEntity(data));
  }

  /**
   * @return {Promise}
   */
  update(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(_static.API_MENU_UPDATE.replace(":id", id), data);
  }

  /**
   * @return {Promise}
   */
  delete(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.delete(_static.API_MENU_DELETE.replace(":id", id), data);
  }

  /**
   * @return {Promise}
   */
  changeStatus(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(
      _static.API_MENU_UPDATE_STATUS.replace(":id", id),
      data
    );
  }

  /**
   * @return {Promise}
   */
  getByUser(_data = {}) {
    // Get, format data?!
    let data = Object.assign({}, _data);
    //
    return this._api.get(_static.API_MENU_GET_BY_USER, data);
  }

  /**
   * @return {Promise}
   */
  getByCustomer(_data = {}) {
    // Get, format data?!
    let data = Object.assign({}, _data);
    //
    return this._api.get(_static.API_MENU_GET_BY_CUSTOMER, data);
  }

  /**
   * @return {Promise}
   */
  getNavigation(_opts) {
    // Format options
    let opts = _opts || {
      prefix: "",
      //
      //
      merge: function ({ item, output, opts /*, input*/ }) {
        let { level } = opts;
        output.push(Object.assign(item, { _: { level } }));
      },
    };
    let apiOpts = Object.assign({}, opts["_api"]);
    delete opts["_api"];

    //
    return this.getByUser(apiOpts)
      .then((data) => {
        let ret = _static.getOptionsRecursive(data || [], opts);
        // console.log('getNavigationRecursive: ', ret, data);
        return ret;
      })
      .then((items) => {
        let itemsMap = {};
        let ret = (items || []).map((item) => {
          let opts = item._ || {};
          delete item._;
          let parentItem = itemsMap[item.parent_id];
          let navItem = {
            title: !(1 * item.parent_id),
            name: item.menu_name,
            class: item.class_menu,
            url: item.link_menu,
            icon: item.icon_path,
            attributes: Object.assign(
              {
                id: `menu-item-${item.menu_id}`,
              },
              item.attributes
            ),
          };
          itemsMap[item.menu_id] = navItem;
          if (parentItem && opts.level > 2) {
            parentItem.children = parentItem.children || [];
            parentItem.children.push(navItem);
            return null;
          }
          return navItem;
        });
        return { items: ret.filter((item) => !!item) };
      });
  }
  /**
   * @return {Promise}
   */
  getNavigationCustomer(_opts) {
    // Format options
    let opts = _opts || {
      prefix: "",
      //
      //
      merge: function ({ item, output, opts /*, input*/ }) {
        let { level } = opts;
        output.push(Object.assign(item, { _: { level } }));
      },
    };
    let apiOpts = Object.assign({}, opts["_api"]);
    delete opts["_api"];

    //
    return this.getByCustomer(apiOpts)
      .then((data) => {
        let ret = _static.getOptionsRecursive(data || [], opts);
        // console.log('getNavigationRecursive: ', ret, data);
        return ret;
      })
      .then((items) => {
        let itemsMap = {};
        let ret = (items || []).map((item) => {
          let opts = item._ || {};
          delete item._;
          let parentItem = itemsMap[item.parent_id];
          let navItem = {
            title: !(1 * item.parent_id),
            name: item.menu_name,
            class: item.class_menu,
            url: item.link_menu,
            icon: item.icon_path,
            attributes: Object.assign(
              {
                id: `menu-item-${item.menu_id}`,
              },
              item.attributes
            ),
          };
          itemsMap[item.menu_id] = navItem;
          if (parentItem && opts.level > 2) {
            parentItem.children = parentItem.children || [];
            parentItem.children.push(navItem);
            return null;
          }
          return navItem;
        });
        return { items: ret.filter((item) => !!item) };
      });
  }
}
// Make alias
const _static = MenuModel;
