/*
 * @Author: Vir
 * @Date: 2021-09-17 23:07:52
 * @Last Modified by: Vir
 * @Last Modified time: 2021-10-22 15:26:46
 */

import { Router } from '@/config/router';
import { AuthData } from '@/data/account/interface';
import ItemCard from '@/pages/setting/components/itemCard';
import RenderContent from '@/pages/setting/components/renderContent';
import { PageProps } from '@/typings';
import React from 'react';
import AccountCard from './components/accountCard';
import { getAccount } from './utils/acount';

const Auth: React.FC<PageProps> = ({ history, route, children, ...props }) => {
  const [list, setList] = React.useState<Router[]>([]);
  const [account, setAccount] = React.useState<AuthData>(
    {} as AuthData,
  );

  React.useEffect(() => {
    setList(route?.routes || []);
    setAccount(getAccount());
  }, []);

  return (
    <RenderContent
      location={history.location as unknown as Location}
      pChildren={children}
    >
      <AccountCard account={account} />
      <div className="flex flex-col gap-2 my-4">
        {list.map((i) => (
          <ItemCard
            key={i.path}
            title={i.title}
            icon={i.icon}
            onClick={() => history.push(i.path)}
          ></ItemCard>
        ))}
      </div>
    </RenderContent>
  );
};

export default Auth;
