/**
 * 创建A标签下载
 * @param {string} url: 下载地址
 * @param {string} title: 下载标题
 * @param {string} target: 窗口位置（默认新开窗口）
 */
export function tagAToDownload({ url, title = '', target = '_blank' }) {
  let tagA = document.createElement('a');
  tagA.setAttribute('href', url);
  tagA.setAttribute('download', title);
  tagA.setAttribute('target', target);
  document.body.appendChild(tagA);
  tagA.click();
  document.body.removeChild(tagA);
}
