import React from 'react';
import './index.less';

const IconFont = Loader.loadBaseComponent('IconFont')

export default ({
    label,
    icon,
    value
}) => <div className='resource-item'>
    <IconFont type={`${icon}`} />
    <span className='name'>{label}</span>
    <span className='font-resource-normal'>{value}</span>
</div>