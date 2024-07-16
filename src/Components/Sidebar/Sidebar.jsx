import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CiLogin, CiLogout } from 'react-icons/ci';
import { FaUser } from 'react-icons/fa6';
import { GrOverview } from 'react-icons/gr';
import { MdAdminPanelSettings } from 'react-icons/md';
import { SiPowervirtualagents } from 'react-icons/si';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Sidebar = () => {
    const nevigate = useNavigate()
    const findUser = localStorage.getItem('token')
    const email = localStorage.getItem('email')
    const [role, setRole] = useState(null)
    console.log(email);


    const fetchData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/user?email=${email}`, {
                headers: {
                    Authorization: findUser
                }
            })
            console.log(res.data);
            setRole(res.data.role);

        }
        catch (err) {
            console.log('err', err);
        }
    }
    fetchData()
    console.log(role);
    const handelLogOutBtn = () => {
        const token = localStorage.getItem('token')
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
                    console.log('Jwt no accesF');
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
        <div className="flex flex-col h-full p-3 w-60 bg-gray-800 min-h-screen text-white">
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
                        {role === 'agent' && <li className="text-xl">
                            <NavLink to='/agent'>
                                <a rel="noopener noreferrer" href="#" className="flex items-center p-2 space-x-3 rounded-md">
                                    <p><SiPowervirtualagents /></p>
                                    <span>Agent</span>
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
            <div className="flex items-center p-2 mt-12 space-x-4 justify-self-end">
                <img src="https://source.unsplash.com/100x100/?portrait" alt="" className="w-12 h-12 rounded-lg dark:bg-gray-500" />
                <div>
                    <h2 className="text-lg font-semibold">Leroy Jenkins</h2>
                    <span className="flex items-center space-x-1">
                        <a rel="noopener noreferrer" href="#" className="text-xs hover:underline dark:text-gray-600">View profile</a>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;