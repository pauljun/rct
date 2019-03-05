import React from 'react';
import { replace ,escapeRegExp} from 'lodash';
import 'src/assets/style/components/highLevel.less';
export default function HighLevel({
  keyword,
  name,
  highLevelclassName = 'high-level'
}) {
  if (!keyword) {
    return <span>{name}</span>;
  }
  let reg = new RegExp(escapeRegExp(keyword), 'g');
  let html = replace(
    name,
    reg,
    `<span class="${highLevelclassName}">${keyword}</span>`
  );
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
