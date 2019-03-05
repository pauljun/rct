import React from "react";
import { withRouter } from "react-router-dom";
import { inject } from "mobx-react";
import moment from 'moment';

const AuthComponent = Loader.loadBusinessComponent("AuthComponent");
const Table = Loader.loadBaseComponent("Table");
const Pagination = Loader.loadBaseComponent("Pagination");
const IconFont = Loader.loadBaseComponent("IconFont");

@withRouter
@inject("tab")
class view extends React.Component {
  render() {
    const {
      dataSource,
      loading,
      total,
      searchData,
      onChange,
      goPage,
      resetVillage,
      ...props
    } = this.props;
    const columns = [
      {
        width: "15%",
        title: "小区名称",
        dataIndex: "villageName"
      },
      {
        width: "20%",
        title: "小区地址",
        dataIndex: "address",
        render: (status, item, index) => (status ? status : "-")
      },
      {
        width: '15%',
        title: '创建时间',
        dataIndex: 'createTime',
        render: text => {
          return moment(text * 1).format('YYYY.MM.DD HH:mm:ss');
        }
      },
      {
      	width: '25%',
      	title: '所属组织',
      	dataIndex: 'associateOrganization',
      	render: (status, item, index) => {
      		return (
      			<span title={item.associateOrganization.organizationName} className="user-tr">
      				{item.associateOrganization.organizationName}
      			</span>
      		);
      	}
      },
      {
        title: "操作",
        dataIndex: "tools",
        render: (text, item) => (
          <div className="table-tools">
          <AuthComponent actionName="villageDetail">
            <IconFont
              type="icon-Reset_Dark"
              style={{ cursor: 'pointer' }}
              title="重置"
              onClick={() => resetVillage(item)}
            />
            </AuthComponent>
            <AuthComponent actionName="villageDetail">
              <IconFont
                type="icon-Edit_Main"
                style={{ cursor: "pointer" }}
                title="编辑基本信息"
                onClick={() =>
                  goPage("villageDetail", {
                    isAdd: false,
                    id: item.id
                  })
                }
              />
            </AuthComponent>
            <AuthComponent actionName="villageDetail">
              <IconFont
                type="icon-TreeIcon_People_Main2"
                style={{ cursor: "pointer" }}
                title="人员信息录入"
                onClick={() =>
                  goPage("peopleEntry", {
                    id: item.id
                  })
                }
              />
            </AuthComponent>
          </div>
        )
      }
    ];
    return (
      <React.Fragment>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          {...props}
        />
        <Pagination
          total={total}
          pageSize={searchData.pageSize}
          current={searchData.page}
          onChange={onChange}
        />
      </React.Fragment>
    );
  }
}

export default view;
