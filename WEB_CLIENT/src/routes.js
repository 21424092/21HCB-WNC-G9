import React from "react";

// Dashboard
// const Dashboard = React.lazy(() => import('./containers/Common/Dashboard'))
//.end#Dashboard

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

// Menu
const Menus = React.lazy(() => import("./components/Menus/Menus"));
const MenuAdd = React.lazy(() => import("./components/Menus/MenuAdd"));
const MenuDetail = React.lazy(() => import("./components/Menus/MenuDetail"));
const MenuEdit = React.lazy(() => import("./components/Menus/MenuEdit"));
const MenuDelete = React.lazy(() => import("./components/Menus/MenuDelete"));
//.end#Menu

// Company
const Companies = React.lazy(() => import("./components/Companies/Companies"));
const CompaniesAdd = React.lazy(() =>
  import("./components/Companies/CompaniesAdd")
);
const CompaniesDetail = React.lazy(() =>
  import("./components/Companies/CompaniesDetail")
);
// end#Company

// Manufacturer
const Manufacturer = React.lazy(() =>
  import("./components/Manufacturer/Manufacturer")
);
const ManufacturerAdd = React.lazy(() =>
  import("./components/Manufacturer/ManufacturerAdd")
);
const ManufacturerDetail = React.lazy(() =>
  import("./components/Manufacturer/ManufacturerDetail")
);
const ManufacturerEdit = React.lazy(() =>
  import("./components/Manufacturer/ManufacturerEdit")
);
//.end#Manufacturer

// Permissions
const Permissions = React.lazy(() =>
  import("./components/Permissions/Permissions")
);
//.end#Permissions

// Store
const Store = React.lazy(() => import("./components/Store/Store"));
const StoreAdd = React.lazy(() => import("./components/Store/StoreAdd"));
const StoreDetail = React.lazy(() => import("./components/Store/StoreDetail"));
const StoreEdit = React.lazy(() => import("./components/Store/StoreEdit"));
//.end#Store

//Department
const Department = React.lazy(() =>
  import("./components/Department/Department")
);
const DepartmentAdd = React.lazy(() =>
  import("./components/Department/DepartmentAdd")
);
const DepartmentDetail = React.lazy(() =>
  import("./components/Department/DepartmentDetail")
);
const DepartmentEdit = React.lazy(() =>
  import("./components/Department/DepartmentEdit")
);
//.end#Department

// Admin Website: Account
const Account = React.lazy(() => import("./components/Account/Account"));
const AccountAdd = React.lazy(() => import("./components/Account/AccountAdd"));
const AccountDetail = React.lazy(() =>
  import("./components/Account/AccountDetail")
);
const AccountEdit = React.lazy(() =>
  import("./components/Account/AccountEdit")
);
const AccountChangePassword = React.lazy(() =>
  import("./components/Account/AccountChangePassword")
);
const AccChangePassword = React.lazy(() =>
  import("./components/Account/AccChangePassword")
);
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
      window._$g.rdr("/users");
      return null;
    },
  },
  //.end#dashboard
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

  // Companies
  {
    path: "/companies",
    exact: true,
    name: "Danh sách công ty",
    function: "AM_COMPANY_VIEW",
    component: Companies,
  },
  {
    path: "/companies/add",
    exact: true,
    name: "Thêm mới",
    function: "AM_COMPANY_ADD",
    component: CompaniesAdd,
  },
  {
    path: "/companies/details/:id",
    exact: true,
    name: "Chi tiết",
    function: "AM_COMPANY_VIEW",
    component: CompaniesDetail,
  },
  {
    path: "/companies/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "AM_COMPANY_EDIT",
    component: CompaniesAdd,
  },
  // .end#Companies

  // permissions
  {
    path: "/permissions",
    exact: true,
    name: "Phân quyền",
    function: "PERMISSION_VIEW",
    component: Permissions,
  },
  //.end#permissions

  // Manufacturer
  {
    path: "/manufacturer",
    exact: true,
    name: "Danh sách nhà sản xuất",
    function: "MD_MANUFACTURER_VIEW",
    component: Manufacturer,
  },
  {
    path: "/manufacturer/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_MANUFACTURER_ADD",
    component: ManufacturerAdd,
  },
  {
    path: "/manufacturer/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_MANUFACTURER_VIEW",
    component: ManufacturerDetail,
  },
  {
    path: "/manufacturer/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_MANUFACTURER_EDIT",
    component: ManufacturerEdit,
  },
  //.end#Manufacturer

  // Store
  {
    path: "/store",
    exact: true,
    name: "Danh sách cửa hàng",
    function: "MD_STORE_VIEW",
    component: Store,
  },
  {
    path: "/store/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_STORE_ADD",
    component: StoreAdd,
  },
  {
    path: "/store/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_STORE_VIEW",
    component: StoreDetail,
  },
  {
    path: "/store/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_STORE_EDIT",
    component: StoreEdit,
  },
  //.end#Store

  //Department
  {
    path: "/department",
    exact: true,
    name: "Danh sách phòng ban",
    function: "MD_DEPARTMENT_VIEW",
    component: Department,
  },
  {
    path: "/department/add",
    exact: true,
    name: "Thêm mới",
    function: "MD_DEPARTMENT_ADD",
    component: DepartmentAdd,
  },
  {
    path: "/department/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "MD_DEPARTMENT_VIEW",
    component: DepartmentDetail,
  },
  {
    path: "/department/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "MD_DEPARTMENT_EDIT",
    component: DepartmentEdit,
  },
  //.end#Department

  // Admin Website: Account
  {
    path: "/account",
    exact: true,
    name: "Danh sách sách khách hàng",
    function: "CRM_ACCOUNT_VIEW",
    component: Account,
  },
  {
    path: "/account/add",
    exact: true,
    name: "Thêm mới",
    function: "CRM_ACCOUNT_ADD",
    component: AccountAdd,
  },
  {
    path: "/account/detail/:id",
    exact: true,
    name: "Chi tiết",
    function: "CRM_ACCOUNT_VIEW",
    component: AccountDetail,
  },
  {
    path: "/account/edit/:id",
    exact: true,
    name: "Chỉnh sửa",
    function: "CRM_ACCOUNT_EDIT",
    component: AccountEdit,
  },
  {
    path: "/account/account-change-password/:id",
    exact: true,
    name: "Thay đổi mật khẩu",
    function: "SYS_ACCOUNT_PASSWORD",
    component: AccountChangePassword,
  },
  {
    path: "/acc-change-password",
    exact: true,
    name: "Thay đổi mật khẩu",
    function: null,
    component: AccChangePassword,
  },
  //.End
];

export default routes;
