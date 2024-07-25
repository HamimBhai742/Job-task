import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import nagadimg from '../../../assets/nagad.jpg'
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import Swal from 'sweetalert2';

const Registation = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const axiosPublic = useAxiosPublic()
    const navigate = useNavigate()
    const onSubmit = async (data) => {
        console.log(data);
        try {
            const res = await axiosPublic.post('/auth/register', data)
            console.log(res.data.response);
            if (res.data) {
                reset()
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "You have been successfully registration.",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/login')
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${err.response.data.message}`
            });
        }

    }
    // console.log(errors.pin?.type);
    return (
        <div className='m-8'>
            <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-full">
                <div className="hidden  lg:block lg:w-[650px] relative">
                    <img src={nagadimg} className='h-full' alt="" />
                </div>
                <div className="w-full px-6 py-8 md:px-8 lg:w-1/2 bg-pink-100">
                    <div className="flex justify-center mx-auto">
                        <img className="w-auto h-20" src="/public/Nagad_Logo__1_-removebg-preview.png" alt="" />
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mt-4">
                            <label className="block mb-2 text-sm font-inter font-bold text-gray-600 dark:text-gray-200">Name</label>
                            <input {...register('name', { required: true })} placeholder='Your name' className="block h-12 w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-pink-400 focus:ring-opacity-40 dark:focus:border-pink-300 focus:outline-none focus:ring focus:ring-pink-300 border-gray-300" type="text" />
                        </div>
                        <div className="mt-4">
                            <label className="block mb-2 text-sm font-inter font-bold text-gray-600 dark:text-gray-200">Phone</label>
                            <input {...register('phone', {
                                required: true, pattern: {
                                    value: /^01[0-9]{9}$/,
                                    message: "Phone number must be 11 digits and start with '01'"
                                }
                            })} placeholder='Enter your phone number' className="block h-12 w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-pink-400 focus:ring-opacity-40 dark:focus:border-pink-300 focus:outline-none focus:ring focus:ring-pink-300 border-gray-300" type="number" />
                        </div>
                        <p className='text-red-600'>{errors.phone?.message}</p>
                        <div className="mt-4">
                            <label className="block mb-2 text-sm font-inter font-bold text-gray-600 dark:text-gray-200">Email</label>
                            <input {...register('email', { required: true })} placeholder='Enter your email' className="block h-12 w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-pink-400 focus:ring-opacity-40 dark:focus:border-pink-300 focus:outline-none focus:ring focus:ring-pink-300 border-gray-300" type="email" />
                        </div>
                        <div className="mt-4">
                            <label className="block mb-2 text-sm font-inter font-bold text-gray-600 dark:text-gray-200">Role</label>
                            <select {...register('role')} className="select select-bordered w-full max-w-xs">
                                <option disabled selected>Choose your role</option>
                                <option value='agent'>Agent</option>
                                <option value='user'>User</option>
                            </select>
                        </div>
                        <div className="mt-4 relative">
                            <label className="block mb-2 text-sm font-inter font-bold text-gray-600 dark:text-gray-200">PIN</label>
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
                                })} placeholder='Enter your pin' className="block h-12 w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-pink-400 focus:ring-opacity-40 dark:focus:border-pink-300 focus:outline-none focus:ring focus:ring-pink-300 border-gray-300" type='password' />
                        </div>
                        <p className='text-red-600'>{errors.pin?.message}</p>
                        <div className="mt-6">
                            <button className="w-full bg-pink-600 px-6 py-3 font-inter font-bold tracking-wide text-white capitalize transition-colors duration-300 transform rounded-lg hover:bg-pink-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
                                Registration
                            </button>
                        </div>
                    </form>
                    <div>
                        <p className='text-sm mt-2'>Already have an account? <Link className='font-semibold' to='/login'>Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registation;