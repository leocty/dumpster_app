'use client'
import React, { useEffect, useState } from 'react';
import {
  BarChartOutlined,
  CarOutlined, 
  ControlOutlined, 
  DollarOutlined, 
  HomeOutlined, 
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,    
  QuestionCircleOutlined, 
  ReconciliationOutlined,
  RestOutlined, 
  SolutionOutlined, 
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {  Button, Flex, Layout, Menu, Spin,  } from 'antd';
import DumpsterLogo from '@/app/ui/components/logo'; 
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}
 
  

const items: MenuItem[] = [
  getItem('Home', '/dashboard/home',<HomeOutlined />),
  getItem('Reports', '/dashboard/reports',<BarChartOutlined />),
  getItem('Dumpsters', '/dashboard/dumpsters' ,<RestOutlined />),
  getItem('Customers', '/dashboard/customers',<SolutionOutlined />),
  getItem('Contracts', '/dashboard/contracts',<ReconciliationOutlined />),
  getItem('Fixes', '/dashboard/fixs',<DollarOutlined />) ,
  getItem('Drivers', '/dashboard/drivers',<CarOutlined />),
  getItem('Management', 'sub1' ,<ControlOutlined />, [
    getItem('Users', '/dashboard/userManagement', <UserOutlined />),
    getItem('Dumpster Status', '/dashboard/dumpstersStatus', <QuestionCircleOutlined />),
  ])  
 ];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false); 
  const { user, login, logout } = useAuth();
  const router = useRouter();
 
const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    
     const width = window.innerWidth;
    if( width<576){
      setCollapsed(true);
    }else{
      setCollapsed(false)
    }
    setIsMounted(true);
    // Forzar repaint para aplicar estilos correctamente
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
  }, []);
   

 const handleMenuClick = (event:any) => {
  router.push(event.key)  
  }

  return ( 
    
    <Layout   style={{ minHeight: '100vh',minWidth: '90vh',visibility: isMounted ? 'visible' : 'hidden' }}>
      <Sider  trigger={null} collapsible collapsed={collapsed}>
        <div className="w-32 text-white md:w-40">
          {!collapsed ?  <Image
                       src="/dumpster_rental_logo_w.svg"  
                       alt="Dumpster Rental"
                       priority
                       width={240}
                       height={100}
                       />:<></> }
        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={handleMenuClick} />
      </Sider>
      <Layout >
        <Header className="main-header" >
          <Flex   justify='space-between' align='center'> 
            <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '24px',
              width: 64,
              height: 64,
              color:'#fff'
            }}
          />
           
          <div className="flex justify-end items-center">
             
           <Button
            type="text"
            icon={ <LogoutOutlined />}
            onClick={() => {logout();  router.push("/") }}
            style={{
              fontSize: '24px',
              width: 64,
              height: 64,
              color:'#fff'
            }}
          />        
          
          </div>
          </Flex>
        </Header>
        <Content style={{ margin: '0 16px' }}>
            {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
         
        </Footer>
      </Layout>
    </Layout>
   
    
  );
};

