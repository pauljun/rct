import React from 'react';
import { Button } from 'antd';

const AuthComponent = Loader.loadBusinessComponent("AuthComponent");
const SearchInput = Loader.loadBaseComponent("SearchInput");

export default ({ value, onChange, goPage }) => {
  return (
    <div className="village-table-search">
    <AuthComponent actionName="villageDetail">
      <Button
        type="primary"
        // className="orange-btn"
        style={{ cursor: "pointer" }}
        icon="plus"
        onClick={() => goPage( 'villageDetail',{isAdd:true})}
      >
        新建小区
      </Button>
    </AuthComponent>
      <SearchInput
        placeholder="请输入您想搜索的内容"
        enterButton
        defaultValue={value}
        onChange={value =>
          onChange({
            key: value
          })
        }
      />
      <style jsx>{`
        .village-table-search{
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .village-table-search>span{
          width:240px;
        }
      `}</style>
    </div>
  );
};
