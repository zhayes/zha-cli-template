import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import {connect} from 'react-redux';
import { UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import {withRouter, matchPath} from 'react-router';
import Style from './index.less';

const { Sider } = Layout;

function SiderMenu(props:any){
    const [collapsed, setCollapsed] = useState(props.collapsed);
    const [menuData, setMenuData] = useState(props.menuData);
    const [selectedKeys, setSelectedKeys] = useState<string[]|undefined>([]);
    const [parentSelectedKeys, setParentSelectedKeys] = useState<string[]|undefined>([]);

    function setMenuOpenStatus(){
        const routePath = props.history.location.pathname;
        let parentKeys:string[] = [];
        const selectedKey:string[] = []

        function matchSiderNav(data: any[], isOuter=false):void{

            for(let i=0; i<data.length; i++){
                isOuter && (parentKeys = []);

                const {selected, path, children} = data[i];
                const routeItem = matchPath(routePath, {path});

                if(children && children.length){
                    parentKeys.push(selected)
                    matchSiderNav(children)
                }else if(routeItem){
                    selectedKey.push(selected);
                    setParentSelectedKeys(parentKeys);
                    setSelectedKeys(selectedKey);
                    break;
                }
            }
        }

        matchSiderNav(props.menuData, true);

        if(!parentKeys.length && !selectedKey.length){
            setParentSelectedKeys(parentKeys);
            setSelectedKeys(selectedKey);
        }
    }

    useEffect(() => {
        setMenuOpenStatus()
    }, [props.history.location]);

    useEffect(() => {
        setMenuData(props.menuData);
        setMenuOpenStatus();
    }, [props.menuData]);

    useEffect(()=>{
        if(!props.collapsed){
            setMenuOpenStatus();
        }else{
            setParentSelectedKeys([]);
        }
        setCollapsed(props.collapsed);
    }, [props.collapsed]);


    function unfoldMenuHandle(parentSelectedKeys:any){
        setParentSelectedKeys(parentSelectedKeys);
    }


    const renderMenu = (menus: SiderMenuItemList = []): React.ReactNode => {
        return menus.map((menu: SiderMenuItem) => {
            if (menu.children && menu.children.length) {
                return (
                    <Menu.SubMenu
                        key={menu.selected}
                        title={
                            <span>{menu.title}</span>
                        }
                    >
                        {
                            renderMenu(menu.children)
                        }
                    </Menu.SubMenu>
                )
            }

            return (
                <Menu.Item 
                    key={menu.selected}
                >
                    <Link to={menu.path as string}>
                        <UserOutlined />
                        <span>{menu.title}</span>
                    </Link>
                </Menu.Item>
            )
        })
    }

    
    return (
        <Sider
            collapsible collapsed={!!collapsed}
            trigger={null}
        >
            <div className={Style.logo} />
            <Menu 
                theme="dark" 
                mode="inline"
                openKeys={parentSelectedKeys} 
                selectedKeys={selectedKeys}
                onOpenChange={unfoldMenuHandle}
            >
                {
                    renderMenu(menuData)
                }
            </Menu>
        </Sider>
    )
    
}

export default  connect((state:any)=>{
    return {
        menuData: state.common.sideMenu as SiderMenuItemList
    }
})(withRouter(SiderMenu))