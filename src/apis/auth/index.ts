/*
 * @Author: Vir
 * @Date: 2021-09-01 13:49:23
 * @Last Modified by: Vir
 * @Last Modified time: 2021-12-15 14:45:58
 */

import { authDefaultData } from '@/data/account/default';
import {
  AuthBackground,
  AuthData,
  AuthLogo,
  Navigation,
} from '@/data/account/interface';
import StorageDB from 'bsdb';

const BaseDB = new StorageDB({
  storage: localStorage,
  database: 'database',
});

export const AuthDB = BaseDB.get('auth');

// 获取账户列表 参数id查找除此id外的账户
export const findAccounts = (id?: string | null) => {
  let query = {} as { _id: { $ne: string } };

  if (id) {
    query._id = {
      $ne: id,
    };
  }

  return AuthDB.find(query);
};

// 获取单个账户
export const findAccount = (id: string) => {
  return AuthDB.findOne(id);
};

// 获取单个账户
export const findAccountByName = (name: string) => {
  let query = {
    username: {
      $eq: name,
    },
  };
  return AuthDB.findOne(query);
};

// 删除账户
export const delAccount = (id: string): any => {
  return AuthDB.remove(id);
};

// 修改账户
export const editAccount = (
  id: string,
  query: { username?: string; background?: AuthBackground },
) => {
  return AuthDB.update(id, query);
};

// 添加账户
export const addAccount = (data: any): any => {
  return AuthDB.inset(data);
};

// 账户总数
export const accountsCount = () => {
  return AuthDB.count();
};

// 单独更新 logo 设置数据
export const updateLogoSetting = (id: string, data: AuthLogo) => {
  return AuthDB.update(id, { logo: data });
};

// 单独更新 navigation 设置数据
export const updateNavigationSetting = (id: string, data: Navigation) => {
  return AuthDB.update(id, { navigation: data });
};

// 获取账户中指定字段
export const getAuthDataByKey = (id: string, key: string) => {
  const account = AuthDB.findOne(id);
  if (!account) throw new Error('未找到该账户');
  const result = account[key];
  if (!result) throw new Error(`${key} is undefined`);
  if (result) return result;
  const defaultData = authDefaultData as any;
  const defResult = defaultData[key];
  if (!result) throw new Error(`${key} is undefined`);
  AuthDB.update(id, { key: defResult });
  return defaultData[key];
};
