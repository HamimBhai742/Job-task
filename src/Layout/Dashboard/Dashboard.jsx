import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar/Sidebar';

const Dashboard = () => {
    return (
        <div className='flex'>
            <div>
                <Sidebar></Sidebar>
            </div>
            <div>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Dashboard;