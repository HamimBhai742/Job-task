import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosPublic from '../../hooks/useAxiosPublic.jsx'
import Swal from 'sweetalert2';

const UserManagement = () => {
    const axiosSucre = useAxiosSecure()
    const axiosPublic = useAxiosPublic()
    const { data: allUsers = [], refetch } = useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => {
            const res = await axiosSucre.get('/users-management')
            return res.data;
        }
    })

    const handelBtn = async (e) => {
        const selected = e.target.value
        const email = selected.split(',')[1]
        const status = selected.split(',')[0]
        const role = selected.split(',')[2]
        const bonus = selected.split(',')[3]
        console.log(bonus);
        if (role === 'admin') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You can't change the admin status!"
            });
            return
        }
        console.log(status, email);
        const result = await axiosSucre.patch(`/update-user/${email}?status=${status}`)
        console.log(result.data);
        refetch()
        if (role === 'user' && bonus === 'undefined') {
            const re = await axiosSucre.patch(`/new-user-bonus/${email}`)
            console.log(re.data);
        }
        
        if (role === 'agent' && bonus === 'undefined') {
            const re = await axiosSucre.patch(`/new-agent-bonus/${email}`)
            console.log(re.data);
        }
    }
    return (
        <div className='ml-72 mt-10'>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr className='text-lg'>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Current Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className='text-lg'>
                        {
                            allUsers.map((user, idx) => <tr key={idx} className="hover">
                                <th>{idx + 1}</th>
                                <td>{user?.name}</td>
                                <td>{user?.email}</td>
                                <td>{user?.role}</td>
                                <td>
                                    <p className={user?.status==='pending'?'bg-rose-100 text-rose-500 font-medium px-5 rounded-full':'bg-sky-100 text-sky-500 font-medium px-5 rounded-full'}>{user?.status}</p>
                                </td>
                                <td >
                                    <select onChange={handelBtn} className="select select-bordered w-full max-w-xs">
                                        <option disabled selected>User Status</option>
                                        <option value={`approved,${user?.email},${user?.role},${user?.newUserBonus}`}>Active</option>
                                        <option value={`pending,${user?.email},${user?.role},${user?.newUserBonus}`}>Block</option>
                                    </select>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;