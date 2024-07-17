import React from 'react';
import nagadimg from '../../../assets/nagad.jpg'
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
const Login = () => {
    const { register, handleSubmit } = useForm();
    const findUser = localStorage.getItem('token')
    const navigate = useNavigate()
    if (findUser) {
        return <Navigate to='/'></Navigate>
    }
    const onSubmit = async (formdata) => {
        console.log(formdata);

        // if (findUser) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: "Something went wrong!"
        //     });
        //     return
        // }
        try {
            const res = await axios.post(`http://localhost:5000/auth/login`, formdata)
            // console.log(AxiosError.message);
            console.log(res.data);
            if (res.data) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "You have been successfully login",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/')
            }
            const jwtToken = res.data.token
            localStorage.setItem('token', jwtToken)
            localStorage.setItem('email', formdata.email)
        }
        catch (err) {
            console.log(err.response.data.message);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${err.response.data.message}`
              });
        }

        // const findUser = res.data?.find(user => user?.email === formdata?.emailOrnumber || user?.phone === formdata?.emailOrnumber)
        // console.log(findUser);
        // if (findUser?.pin === formdata?.pin) {
        //     console.log('login');
        //     console.log(findUser);
        // }
        // else {
        //     console.log('incorrected');
        // }

    }
    // const { isLoading, error, data } = useQuery({
    //     queryKey: ['repoData'],
    //     queryFn: async () => {
    //         const res = await axios.get(`http://localhost:5000/registration?email=${formdata?.email}`)
    //         console.log(res.data);
    //     }
    // })
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
                            <label className="block mb-2 text-sm font-inter font-bold text-gray-600 dark:text-gray-200">Email</label>
                            <input {...register('email', { required: true })} placeholder='Your name' className="block h-12 w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-pink-400 focus:ring-opacity-40 dark:focus:border-pink-300 focus:outline-none focus:ring focus:ring-pink-300 border-gray-300" type="email" />
                        </div>
                        <div className="mt-4 relative">
                            <label className="block mb-2 text-sm font-inter font-bold text-gray-600 dark:text-gray-200">PIN</label>
                            <input {...register('pin',
                                {
                                    required: true,
                                })} placeholder='Enter your pin' className="block h-12 w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-pink-400 focus:ring-opacity-40 dark:focus:border-pink-300 focus:outline-none focus:ring focus:ring-pink-300 border-gray-300" type='password' />
                        </div>
                        <div className="mt-6">
                            <button className="w-full bg-pink-600 px-6 py-3 font-inter font-bold tracking-wide text-white capitalize transition-colors duration-300 transform rounded-lg hover:bg-pink-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
                                Login
                            </button>
                        </div>
                    </form>
                    <div>
                        <p className='text-sm mt-2'>Don't have an account? <Link className='font-semibold' to='/registation'>Registration</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;