import React from 'react';
import SidePanel from '../components/SidePandel/SidePanel'
import { Outlet } from 'react-router-dom';
const Layout = () => {
    return (
        <div className='main_site'>
            <SidePanel />
            <Outlet />
        </div>
    );
}

export default Layout;
