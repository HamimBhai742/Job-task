import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CiLogin, CiLogout } from 'react-icons/ci';
import { FaUser } from 'react-icons/fa6';
import { GrOverview, GrTransaction } from 'react-icons/gr';
import { MdAdminPanelSettings, MdManageAccounts } from 'react-icons/md';
import { SiPowervirtualagents } from 'react-icons/si';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosPublic from '../../hooks/useAxiosPublic';
// import { useQuery } from '@tanstack/react-query';

const Sidebar = () => {
    const nevigate = useNavigate()
    const findUser = localStorage.getItem('token')
    const email = localStorage.getItem('email')
    const [role, setRole] = useState(null)
    const [name, setName] = useState(null)
    const axiosSecure = useAxiosSecure()
    const axiosPublic = useAxiosPublic()
    // console.log(findUser);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosSecure.get(`/user?email=${email}`)
                console.log(res.data);
                setName(res.data.name)
                setRole(res.data.role);

            }
            catch (err) {
                console.log('err', err);
            }
        }
        fetchData()
    }, [axiosSecure, email])
    // console.log(role);
    const handelLogOutBtn = () => {
        const token = localStorage.getItem('token')
        // console.log(token);
        if (!token) {
            return nevigate('/login')
        }

        Swal.fire({
            title: "Are you sure?",
            text: "You want to be Logout!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Log Out!"
        }).then((result) => {
            if (result.isConfirmed) {
                if (token) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('access-token')
                    localStorage.removeItem('email')
                    nevigate('/login')
                    setRole(null)
                    return
                }
                else {
                    // console.log('Jwt no accesF');
                }
                Swal.fire({
                    title: "Logout Successfully!",
                    text: "Your have been logout.",
                    icon: "success"
                });

            }
        });


    }
    return (
        <div className="flex fixed flex-col h-full p-3 w-60 bg-gray-800 min-h-screen text-white">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <img src='../../../public/Nagad_Logo__1_-removebg-preview.png' alt="" />
                </div>

                <div className="flex-1">
                    <ul className="pt-2 pb-4 space-y-1 text-sm">
                        <li className="text-xl">
                            <NavLink to='/'>
                                <a rel="noopener noreferrer" href="#" className="flex items-center p-2 space-x-3 rounded-md">
                                    <p><GrOverview /></p>
                                    <span>Dashboard</span>
                                </a>
                            </NavLink>
                        </li>
                        {role === 'user' && <li className="text-xl">
                            <NavLink to='/user'>
                                <a rel="noopener noreferrer" href="#" className="flex items-center p-2 space-x-3 rounded-md">
                                    <p><FaUser></FaUser></p>
                                    <span>User</span>
                                </a>
                            </NavLink>
                        </li>}
                        {role === 'user' && <li className="text-xl">
                            <NavLink to='/transactions'>
                                <a rel="noopener noreferrer" href="#" className="flex items-center p-2 space-x-3 rounded-md">
                                    <p><GrTransaction /></p>
                                    <span>Transactions</span>
                                </a>
                            </NavLink>
                        </li>}
                        {role === 'agent' && <li className="text-xl">
                            <NavLink to='/agent'>
                                <a rel="noopener noreferrer" href="#" className="flex items-center p-2 space-x-3 rounded-md">
                                    <p><SiPowervirtualagents /></p>
                                    <span>Agent</span>
                                </a>
                            </NavLink>
                        </li>}
                        {role === 'agent' && <li className="text-xl">
                            <NavLink to='/transactions-agent'>
                                <a rel="noopener noreferrer" href="#" className="flex items-center p-2 space-x-3 rounded-md">
                                    <p><GrTransaction /></p>
                                    <span>Transactions</span>
                                </a>
                            </NavLink>
                        </li>}
                        {role === 'admin' && <li className="text-xl">
                            <NavLink to='/admin'>
                                <a className="flex items-center p-2 space-x-3 rounded-md">
                                    <p><MdAdminPanelSettings /></p>
                                    <span>Admin</span>
                                </a>
                            </NavLink>
                        </li>}
                        {role === 'admin' && <li className="text-xl">
                            <NavLink to='/user-management'>
                                <a className="flex items-center p-2 space-x-3 rounded-md">
                                    <p><MdManageAccounts></MdManageAccounts></p>
                                    <span>User Management</span>
                                </a>
                            </NavLink>
                        </li>}

                        <li className="text-xl hover:cursor-pointer" onClick={handelLogOutBtn}>
                            {findUser ?
                                <a className="flex items-center p-2 space-x-3 rounded-md">
                                    <p><CiLogout></CiLogout></p>
                                    <span>Logout</span>
                                </a> :
                                <a className="flex items-center p-2 space-x-3 rounded-md">
                                    <p><CiLogin></CiLogin></p>
                                    <span>Login</span>
                                </a>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;