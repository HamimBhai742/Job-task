import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import useUser from '../../../hooks/useUser';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
const User = () => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email')
    const axiosPublic = useAxiosPublic()
    const axiosSecure = useAxiosSecure()
    const [userData] = useUser()
    console.log(userData, 'ljhj');
    const chaekAm = parseInt(userData.amount)
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data) => {
        const { email, amount, pin } = data
        const cashIn = {
            email,
            amount,
            status: 'pending'
        }
        try {
            const res = await axiosPublic.post(`/auth/login`, data)
            const result = await axiosSecure.post(`/cash-in-out`, cashIn)
            if (result.data) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "You have been successfully cash-in request. Please wait few minits",
                    showConfirmButton: false,
                    timer: 1500
                });
            }

        }
        catch (err) {
            console.log(err.response.data.message);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${err.response.data.message}`
            });
        }
    }
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // const res = await axios.post('http://localhost:5000/post', {
    //             //     name: 'bangla'
    //             // })
    //             // console.log(res.data);
    //         }
    //         catch (err) {
    //             console.log('err', err);
    //         }
    //     }
    //     fetchData()
    // }, [])
    const cashOutBtn = async (cashData) => {
        const { email, amount, pin } = cashData
        const cashOut = {
            email,
            amount,
            status: 'pendings'
        }
        try {
            if (chaekAm > 0) {
                const res = await axiosPublic.post(`/auth/login`, cashData)
                const result = await axiosSecure.post(`/cash-in-out`, cashOut)
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "You have been successfully cash-out request. Please wait few minits",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
    //     queryKey: ['repoData'],
    //     queryFn: async () => {
    //         const res = await axios.get(`http://localhost:5000/post`, {
    //             headers: {
    //                 Authorization: token
    //             }

    //         })
    //         return res.data
    //         // console.log();
    //     }
    // })
    // console.log(repoData);
    return (

        <div className='m-10 ml-72'>
            <div>
                <h3 className='text-3xl font-bold'>Current Amount: {userData?.amount} TK</h3>
            </div>
            <div className='grid grid-cols-2 gap-5'>
                <div className="max-w-7xl p-6 mt-6 bg-white rounded-md shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-700 capitalize dark:text-white">Cash-in</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                            <div>
                                <label className="text-gray-700 dark:text-gray-200" >Email</label>
                                <input defaultValue={email} {...register('email', { required: true })} type="email" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                            </div>

                            <div>
                                <label className="text-gray-700 dark:text-gray-200" >Amount</label>
                                <input {...register('amount', {
                                    required: true, min: {
                                        value: 50,
                                        message: 'Minimum cash in 50 TK'
                                    }
                                })} type="number" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                <p className='text-red-600'>{errors.amount?.message}</p>
                            </div>

                            <div>
                                <label className="text-gray-700 dark:text-gray-200">PIN</label>
                                <input {...register('pin',
                                    {
                                        required: true, maxLength: {
                                            value: 5,
                                            message: "PIN cannot exceed 5 characters"
                                        },
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: "PIN must be only numbers"
                                        }
                                    })} type="password" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                <p className='text-red-600'>{errors.pin?.message}</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md focus:outline-none focus:bg-gray-600 hover:bg-blue-600">Cash-In Request</button>
                        </div>
                    </form>
                </div>

                <div className="max-w-7xl p-6 mt-6 bg-white rounded-md shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-700 capitalize dark:text-white">Cash-out</h2>
                    <form onSubmit={handleSubmit(cashOutBtn)}>
                        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                            <div>
                                <label className="text-gray-700 dark:text-gray-200" >Email</label>
                                <input defaultValue={email} {...register('email', { required: true })} type="email" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                            </div>

                            <div>
                                <label className="text-gray-700 dark:text-gray-200" >Amount</label>
                                <input {...register('amount', {
                                    required: true, min: {
                                        value: 50,
                                        message: 'Minimum cash in 50 TK'
                                    }
                                })} type="number" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                <p className='text-red-600'>{errors.amount?.message}</p>
                            </div>

                            <div>
                                <label className="text-gray-700 dark:text-gray-200">PIN</label>
                                <input {...register('pin',
                                    {
                                        required: true, maxLength: {
                                            value: 5,
                                            message: "PIN cannot exceed 5 characters"
                                        },
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: "PIN must be only numbers"
                                        }
                                    })} type="password" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                <p className='text-red-600'>{errors.pin?.message}</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md focus:outline-none focus:bg-gray-600 hover:bg-blue-600">Cash-Out Request</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default User;