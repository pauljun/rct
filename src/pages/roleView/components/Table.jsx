import React from "react";
import { withRouter } from "react-router-dom";
import { inject } from "mobx-react";
import * as _ from "lodash";

const IconFont = Loader.loadBaseComponent("IconFont");
const Pagination = Loader.loadBaseComponent("Pagination");
const Table = Loader.loadBaseComponent("Table");
const AuthComponent = Loader.loadBusinessComponent("AuthComponent");

@withRouter
@inject("tab")
class view extends React.Component {
  goPage = (moduleName, data) => {
    this.props.tab.goPage({
      moduleName,
      location: this.props.location,
      data,
      isUpdate: false
    });
  };
  render() {
    const {
      dataSource,
      loading,
      total,
      searchData,
      deleteAction,
      menuList,
      onChange,
      ...props
    } = this.props;
    const columns = [
      {
        title: "序号",
        width: "10%",
        dataIndex: "index",
        render: (status, item, index) => index + 1
      },
      {
        title: "角色名称",
        width: "15%",
        dataIndex: "roleName",
        render: (text, item) => {
          return (
            <span onClick={this.goPage.bind(this, "roleModify", { id: item.id })}>
              {text}
            </span>
          );
        }
      },
      {
        title: "权限信息",
        width: "50%",
        dataIndex: "privilegeCodes",
        className: "privilegeIds-td",
        render: (text, item, index) => {
          let privilegeIds = text ? text.split(",").map(v => Number(v)) : "";
          let itemss = [];
          privilegeIds.length > 0 &&
            privilegeIds.map(item => {
              menuList.map(v => {
                if (item === v.id) {
                  itemss.push(v.text);
                }
              });
            });
          return (
            itemss && (
              <span className="ellipsis" title={itemss.join(",")}>
                {itemss.join(",")}{" "}
              </span>
            )
          );
        }
      },
      {
        title: "描述",
        width: "15%",
        dataIndex: "description",
        render: (status, item, index) => (status ? status : "-")
      },
      {
        title: "操作",
        dataIndex: "action",
        width: "10%",
        render: (text, item, index) => {
          return (
            <div className="table-tools">
              <AuthComponent actionName="roleModify">
                <IconFont
                  type="icon-Edit_Main"
                  style={{ cursor: "pointer" }}
                  disabled={item.roleType === 111902}
                  className="actionIcon"
                  title="编辑角色"
                  onClick={this.goPage.bind(this, "roleModify", {
                    isAdd: false,
                    id: item.id
                  })}
                />
              </AuthComponent>
              <AuthComponent actionName="roleModify">
                <IconFont
                  type="icon-Delete_Main"
                  style={{ cursor: "pointer" }}
                  disabled={item.roleType === 111902}
                  className="actionIcon"
                  title="删除角色"
                  onClick={() => item.roleType !== 111902 && deleteAction(item)}
                />
              </AuthComponent>
            </div>
          );
        }
      }
    ];
    return (
      <div className="role-container">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          {...props}
        />
        <Pagination
          total={total}
          pageSize={searchData.pageSize}
          current={searchData.pageNum}
          onChange={onChange}
        />
      </div>
    );
  }
}

export default view;
