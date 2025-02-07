/*
 * @Author: Vir
 * @Date: 2021-11-17 17:41:30
 * @Last Modified by: Vir
 * @Last Modified time: 2021-11-21 16:22:35
 */
const {
  allDataPath,
  classifyDataPath,
  exportPath,
  classifyDataOutPath,
  allDataOutPath,
  typesPath,
  typesOutPath,
  interfacePath,
  interfaceOutPath,
} = require('../config');
const { copyFile, tsToJs, templete, prettierFile } = require('./file');
const { writeFileSync, unlinkSync } = require('fs');
const Log = require('./log');

const log = new Log();

const copyAndSwitchFile = () => {
  const classify = copyFile(classifyDataPath, classifyDataOutPath);
  const all = copyFile(allDataPath, allDataOutPath);
  const types = copyFile(typesPath, typesOutPath);
  const interface = copyFile(interfacePath, interfaceOutPath);

  if (classify && all && types && interface) {
    const classifyRes = tsToJs(classifyDataOutPath);
    const allRes = tsToJs(allDataOutPath);
    if (classifyRes) log.success('classify 转换成功');
    if (allRes) log.success('all 转换成功');
    return true;
  } else {
    log.error('执行失败');
    return false;
  }
};

const formatData = (classify = [], website = []) => {
  return classify.map((i) => {
    if (i.subClassify) {
      const classifyWebsite = website.filter((j) =>
        j.classify.includes(i.path),
      );
      return { ...i, subClassify: formatData(i.subClassify, classifyWebsite) };
    } else {
      const { children, ...rest } = i;
      return {
        ...rest,
        children:
          children !== undefined
            ? children.filter((j) => j.classify.includes(i.path))
            : website.filter((j) => j.classify.includes(i.path)),
      };
    }
  });
};

const exportFile = () => {
  const res = copyAndSwitchFile();
  if (!res) return;
  log.info('正在导出文件');
  const data = require('./source/all');
  const classify = require('./source/classify');
  if (data && classify) {
    const all = formatData(classify.default, data.default);
    const strWriteData = templete(all);
    const pre = prettierFile(strWriteData);
    if (pre) {
      writeFileSync('./outFile.ts', pre, 'utf8');
      copyFile('./outFile.ts', exportPath);
      unlinkSync('./outFile.ts');
      log.success(`导出成功 ${exportPath}`);
    } else {
      log.error('导出失败');
    }
  }
};

module.exports = { exportFile, copyAndSwitchFile };
