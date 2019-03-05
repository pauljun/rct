import React from 'react';
import { Button } from 'antd';

const AuthComponent=Loader.loadBusinessComponent('AuthComponent');
const Search=Loader.loadBaseComponent('SearchInput');

export default ({ searchData, onChange, goPage }) => {
  return (
    <div className="role-container-search">
    <AuthComponent actionName="roleModify">
      <Button
        icon="plus"
        type="primary"
        className="orange-btn"
        onClick={() => goPage('roleModify',{isAdd:true})}
      >
        新建角色
      </Button>
    </AuthComponent>
      <Search
        placeholder="请输入角色名称"
        enterButton
        defaultValue={searchData.roleName}
        onChange={value =>
          onChange({
            roleName: value
          })
        }
      />
      <style jsx>{`
        .role-container-search{
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .role-container-search .ant-input-affix-wrapper{
          width:240px;
        }
        .role-container-search .orange-btn{
        }
      `}</style>
    </div>
  );
};
