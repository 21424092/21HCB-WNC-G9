import React from "react";

// Menu
const Menus = React.lazy(() => import("./components/Menus/Menus"));
const MenuAdd = React.lazy(() => import("./components/Menus/MenuAdd"));
const MenuDetail = React.lazy(() => import("./components/Menus/MenuDetail"));
const MenuEdit = React.lazy(() => import("./components/Menus/MenuEdit"));
const MenuDelete = React.lazy(() => import("./components/Menus/MenuDelete"));
//.end#Menu

// UserGroups
const UserGroups = React.lazy(() =>
  import("./components/UserGroups/UserGroups")
);
const UserGroupsAdd = React.lazy(() =>
  import("./components/UserGroups/UserGroupsAdd")
);
const UserGroupsEdit = React.lazy(() =>
  import("./components/UserGroups/UserGroupsEdit")
);
const UserGroupsDetail = React.lazy(() =>
  import("./components/UserGroups/UserGroupsDetail")
);
//.end#UsersGroups
// Users
const Users = React.lazy(() => import("./components/Users/Users"));
const UserAdd = React.lazy(() => import("./components/Users/UserAdd"));
const UserDetail = React.lazy(() => import("./components/Users/UserDetail"));
const UserEdit = React.lazy(() => import("./components/Users/UserEdit"));
const UserDelete = React.lazy(() => import("./components/Users/UserDelete"));
const UserChangePassword = React.lazy(() =>
  import("./components/Users/UserChangePassword")
);
const ChangePassword = React.lazy(() =>
  import("./components/Users/ChangePassword")
);
//.end#Users

// FunctionGroups
const FunctionGroups = React.lazy(() =>
  import("./components/FunctionGroups/FunctionGroups")
);
const FunctionGroupAdd = React.lazy(() =>
  import("./components/FunctionGroups/FunctionGroupAdd")
);
const FunctionGroupDetail = React.lazy(() =>
  import("./components/FunctionGroups/FunctionGroupDetail")
);
const FunctionGroupEdit = React.lazy(() =>
  import("./components/FunctionGroups/FunctionGroupEdit")
);
const FunctionGroupDelete = React.lazy(() =>
  import("./components/FunctionGroups/FunctionGroupDelete")
);
//.end#FunctionGroups

// Function
const Functions = React.lazy(() => import("./components/Functions/Functions"));
const FunctionAdd = React.lazy(() =>
  import("./components/Functions/FunctionAdd")
);
const FunctionDetail = React.lazy(() =>
  import("./components/Functions/FunctionDetail")
);
const FunctionEdit = React.lazy(() =>
  import("./components/Functions/FunctionEdit")
);
const FunctionDelete = React.lazy(() =>
  import("./components/Functions/FunctionDelete")
);
//.end#Function

// Permissions
const Permissions = React.lazy(() =>
  import("./components/Permissions/Permissions")
);
//.end#Permissions

// FunctionGroups
const AccountReceive = React.lazy(() =>
  import("./components/AccountReceive/AccountReceive")
);
const AccountReceiveAdd = React.lazy(() =>
  import("./components/AccountReceive/AccountReceiveAdd")
);
const AccountReceiveDetail = React.lazy(() =>
  import("./components/AccountReceive/AccountReceiveDetail")
);
const AccountReceiveEdit = React.lazy(() =>
  import("./components/AccountReceive/AccountReceiveEdit")
);
//.end#FunctionGroups

// FunctionGroups
const Debit = React.lazy(() => import("./components/Debit/Debit"));
const DebitAdd = React.lazy(() => import("./components/Debit/DebitAdd"));
const DebitDetail = React.lazy(() => import("./components/Debit/DebitDetail"));
const DebitEdit = React.lazy(() => import("./components/Debit/DebitEdit"));
//.end#FunctionGroups

// Admin Website: Customer
const Customer = React.lazy(() => import("./components/Customers/Customers"));
const CustomerAdd = React.lazy(() =>
  import("./components/Customers/CustomerAdd")
);
const Accounts = React.lazy(() => import("./components/Account/Accounts"));
const Retweet = React.lazy(() => import("./components/Tranfer/Retweet"));

//.End

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  // dashboard
  {
    path: "/",
    exact: true,
    name: "Trang chủ",
    function: "DASHBOARD_VIEW",
    component: () => {
      if (!!window._$g.userAuth) window._$g.rdr("/users");
      if (!!window._$g.customerAuth) window._$g.rdr("/account-list");

      return null;
    },
  },
  //.end#dashboard

  //Menus
  {
    path: "/menus",
    exact: true,
    name: "Danh sách menu",
    function: "SYS_MENU_VIEW",
    component: Menus,
  },
  {
    path: "/menus/add",
    exact: true,
    name: "Thêm mới",
    function: "SYS_MENU_ADD",
    component: MenuAdd,
  },
  {
    path: "/menus/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "SYS_MENU_EDIT",
    component: MenuEdit,
  },
  {
    path: "/menus/delete/:id",
    exact: true,
    name: "Xóa",
    function: "SYS_MENU_DEL",
    component: MenuDelete,
  },
  {
    path: "/menus/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "SYS_MENU_VIEW",
    component: MenuDetail,
  },
  //.end#Menus

  //UserGroup
  {
    path: "/user-groups",
    exact: true,
    name: "Danh sách nhóm người dùng",
    function: "SYS_USERGROUP_VIEW",
    component: UserGroups,
  },
  {
    path: "/user-groups/add",
    exact: true,
    name: "Thêm mới",
    function: "SYS_USERGROUP_ADD",
    component: UserGroupsAdd,
  },
  {
    path: "/user-groups/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "SYS_USERGROUP_VIEW",
    component: UserGroupsDetail,
  },
  {
    path: "/user-groups/delete/:id",
    exact: true,
    name: "Xóa",
    function: "SYS_USERGROUP_DEL",
  },
  {
    path: "/user-groups/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "SYS_USERGROUP_EDIT",
    component: UserGroupsEdit,
  },
  //.end#UserGroup

  // Users
  {
    path: "/users",
    exact: true,
    name: "Danh sách nhân viên",
    function: "SYS_USER_VIEW",
    component: Users,
  },
  {
    path: "/users/add",
    exact: true,
    name: "Thêm mới",
    function: "SYS_USER_ADD",
    component: UserAdd,
  },
  {
    path: "/users/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "SYS_USER_VIEW",
    component: UserDetail,
  },
  {
    path: "/users/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "SYS_USER_EDIT",
    component: UserEdit,
  },
  {
    path: "/users/delete/:id",
    exact: true,
    name: "Xóa",
    function: "SYS_USER_DEL",
    component: UserDelete,
  },
  {
    path: "/users/change-password/:id",
    exact: true,
    name: "Thay đổi mật khẩu",
    function: "SYS_USER_PASSWORD",
    component: UserChangePassword,
  },
  {
    path: "/change-password",
    exact: true,
    name: "Thay đổi mật khẩu",
    function: null,
    component: ChangePassword,
  },
  //.end#Users

  //FunctionGroups
  {
    path: "/function-groups",
    exact: true,
    name: "Danh sách nhóm quyền",
    function: "SYS_FUNCTIONGROUP_VIEW",
    component: FunctionGroups,
  },
  {
    path: "/function-groups/add",
    exact: true,
    name: "Thêm mới",
    function: "SYS_FUNCTIONGROUP_ADD",
    component: FunctionGroupAdd,
  },
  {
    path: "/function-groups/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "SYS_FUNCTIONGROUP_EDIT",
    component: FunctionGroupEdit,
  },
  {
    path: "/function-groups/delete/:id",
    exact: true,
    name: "Xóa",
    function: "SYS_FUNCTIONGROUP_DEL",
    component: FunctionGroupDelete,
  },
  {
    path: "/function-groups/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "SYS_FUNCTIONGROUP_VIEW",
    component: FunctionGroupDetail,
  },
  //.end#FunctionGroups

  //Functions
  {
    path: "/functions",
    exact: true,
    name: "Danh sách quyền",
    function: "SYS_FUNCTION_VIEW",
    component: Functions,
  },
  {
    path: "/functions/add",
    exact: true,
    name: "Thêm mới",
    function: "SYS_FUNCTION_ADD",
    component: FunctionAdd,
  },
  {
    path: "/functions/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "SYS_FUNCTION_EDIT",
    component: FunctionEdit,
  },
  {
    path: "/functions/delete/:id",
    exact: true,
    name: "Xóa",
    function: "SYS_FUNCTION_DEL",
    component: FunctionDelete,
  },
  {
    path: "/functions/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "SYS_FUNCTION_VIEW",
    component: FunctionDetail,
  },
  //.end#Functions

  // permissions
  {
    path: "/permissions",
    exact: true,
    name: "Phân quyền",
    function: "PERMISSION_VIEW",
    component: Permissions,
  },

  //.end#permissions

  // Admin Website: Customer
  {
    path: "/customers",
    exact: true,
    name: "Danh sách khách hàng",
    function: "CRM_ACCOUNT_VIEW",
    component: Customer,
  },
  {
    path: "/customers/add",
    exact: true,
    name: "Thêm mới",
    function: "CRM_ACCOUNT_ADD",
    component: CustomerAdd,
  },
  {
    path: "/account-list",
    exact: true,
    name: "Danh sách tài khoản",
    function: "CRM_ACCOUNT_ADD",
    component: Accounts,
  },

  //FunctionGroups
  {
    path: "/list-of-receiving-accounts",
    exact: true,
    name: "Danh sách người nhận",
    function: "SYS_FUNCTIONGROUP_VIEW",
    component: AccountReceive,
  },
  {
    path: "/list-of-receiving-accounts/add",
    exact: true,
    name: "Thêm mới",
    function: "SYS_FUNCTIONGROUP_ADD",
    component: AccountReceiveAdd,
  },
  {
    path: "/list-of-receiving-accounts/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "SYS_FUNCTIONGROUP_EDIT",
    component: AccountReceiveEdit,
  },
  {
    path: "/list-of-receiving-accounts/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "SYS_FUNCTIONGROUP_VIEW",
    component: AccountReceiveDetail,
  },
  //FunctionGroups
  {
    path: "/debit",
    exact: true,
    name: "Danh sách nợ",
    function: "SYS_FUNCTIONGROUP_VIEW",
    component: Debit,
  },
  {
    path: "/debit/add",
    exact: true,
    name: "Thêm mới",
    function: "SYS_FUNCTIONGROUP_ADD",
    component: DebitAdd,
  },
  {
    path: "/debit/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "SYS_FUNCTIONGROUP_EDIT",
    component: DebitEdit,
  },
  {
    path: "/debit/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "SYS_FUNCTIONGROUP_VIEW",
    component: DebitDetail,
  },
  //.end#FunctionGroups

  {
    path: "/retweet",
    exact: true,
    name: "Chuyển khoản nội bộ",
    function: "SYS_FUNCTIONGROUP_ADD",
    component: Retweet,
  },
  //.End
];

export default routes;
