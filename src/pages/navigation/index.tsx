/*
 * @Author: Vir
 * @Date: 2021-07-25 00:07:11
 * @Last Modified by: Vir
 * @Last Modified time: 2021-12-08 22:26:38
 */

import { MenuLayoutMenu, MenuListItem } from '@/components/layout/menu-layout';
import MenuLayoutNew from '@/components/layout/menu-layout-new';
import Header, { SubHeader } from '@/components/layout/menu-layout/header';
import navigations from '@/data/navigation';
import { Classify } from '@/data/navigation/interface';
import { PageProps } from '@/typings';
import { Input, List } from '@material-ui/core';
import { InsertComment } from '@material-ui/icons';
import React from 'react';
import WebsiteCardNew from './components/websiteCardNew';

const basePath = '/navigation';

const Recursion = (data: Classify, parent?: Classify) => {
  return (
    <>
      {data?.children?.map((j) => (
        <WebsiteCardNew key={j.id} datasource={j} />
      ))}
      {data?.subClassify?.map((i) => {
        return (
          <>
            <div
              key={i.id}
              id={i.id}
              style={{
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
              }}
            >
              {parent ? (
                <SubHeader icon={i.icon} title={i.name} />
              ) : (
                <Header icon={i.icon} title={i.name} />
              )}

              {i.children ? (
                <div className="grid grid-cols-3 gap-3 max-w-4xl">
                  {i.children.map((j) => (
                    <WebsiteCardNew key={i.id} datasource={j} />
                  ))}
                </div>
              ) : (
                Recursion(i, data)
              )}
            </div>
          </>
        );
      })}
    </>
  );
};

const NavigationPage: React.FC<PageProps> = (props) => {
  const menu: Classify[] = navigations;
  const { history, match } = props;
  const [selected, setSelected] = React.useState<Classify>({} as Classify);

  const changeSelect = (path: string, type: 'push' | 'replace' = 'replace') => {
    const find = menu.find((i) => i.path === path);
    if (find) {
      const path = `${basePath}/${find.path}`;
      if (type === 'push') history.push(path);
      if (type === 'replace') history.replace(path);
      setSelected(find);
    }
  };

  const menuChange = (id: string, item: Classify) => {
    changeSelect(item.path, 'push');
  };

  React.useEffect(() => {
    const path = history.location.pathname;
    if (path === basePath) {
      history.replace(`${basePath}/${menu[0].path}`);
      setSelected(menu[0]);
    } else {
      const { classify } = match.params as any;
      changeSelect(classify);
    }
  }, []);

  return (
    <MenuLayoutNew
      {...props}
      mode="page"
      menu={menu as MenuLayoutMenu[]}
      pathname="/navigation"
      onChange={menuChange}
      menuFooter={
        <List dense>
          <MenuListItem
            icon={<InsertComment />}
            primary="提交网站"
            onClick={() => history.push('/help/commit_website')}
          />
        </List>
      }
    >
      {Recursion(selected)}
    </MenuLayoutNew>
  );
};

export default NavigationPage;
