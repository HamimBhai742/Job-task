import React from 'react';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useUser from '../../../hooks/useUser';
import { useForm } from 'react-hook-form';


const User1 = () => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email')
    const axiosPublic = useAxiosPublic()
    const axiosSecure = useAxiosSecure()
    const [userData] = useUser()
    // console.log(userData, 'ljhj');
    const chaekAm = parseInt(userData.amount)
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const cashOutBtn = async (cashData) => {
        const { email, amount, pin, agentEmail } = cashData
        const cashOut = {
            agentEmail,
            email,
            amount,
            status: 'pendings'
        }
        console.log(cashOut);
        const resAgent = await axiosSecure.get(`/send-user`)
        const findAgent = resAgent.data.find(fi => fi.email === agentEmail)
        console.log(findAgent);
        const afterCashOutAm = parseFloat(chaekAm - cashData.amount)
        console.log(afterCashOutAm);
        try {
            const res = await axiosPublic.post(`/auth/login`, cashData)
            if (chaekAm <= 50) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `Your blance is low cashout is not possible`
                });
                reset()
                return
            }
            if (!findAgent) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `Can't find agent. Please Provide valid agent email.`
                });
                reset()
                return
            }
            else if (findAgent.role !== 'agent') {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `This is not agent email.`
                });
                reset()
                return
            }
            else if (findAgent.status === 'pending') {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `Agent can't approved by admin.`
                });
                reset()
                return
            }
            if (afterCashOutAm < 0) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `Cash out blance is not enough`
                });
                reset()
                return
            }
            console.log('object');
            const result = await axiosSecure.post(`/cash-in-out`, cashOut)
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "You have been successfully cash-out request. Please wait few minits",
                showConfirmButton: false,
                timer: 1500
            });
            reset()
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${err.response.data.message}`
            });
            reset()
        }
    }
    return (
        <div className="max-w-7xl p-6 mt-6 bg-white rounded-md shadow-xl">
            <h2 className="text-2xl font-bold text-gray-700 capitalize dark:text-white">Cash-out</h2>
            <form onSubmit={handleSubmit(cashOutBtn)}>
                <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                    <div>
                        <label className="text-gray-700 dark:text-gray-200" >Email</label>
                        <input defaultValue={email} {...register('email', { required: true })} type="email" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                    </div>
                    <div>
                        <label className="text-gray-700 dark:text-gray-200" >Agent Email</label>
                        <input {...register('agentEmail')} type="email" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
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
    );
};

export default User1;