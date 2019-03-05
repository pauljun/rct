import React from 'react';
import { Button } from 'antd';

import '../style/submit.less'

export default ({ handleSave, handleCancel,btnLoad }) => (
	<React.Fragment>
		<div className="setting-edit-btns village-btn">
			<Button
				className="cancel-btn ant-btn"
				name="cancel-btn"
				onClick={() => handleCancel()}
				style={{ display: 'inline-block' }}
			>
				{'取消'}
			</Button>
			<Button
				className="save-btn ant-btn"
				type="primary"
				name="save-btn"
				loading = {btnLoad}
				onClick={() => handleSave()}
				style={{ display:'inline-block' }}
			>
				{'保存'}
			</Button>
		</div>
	</React.Fragment>
);
