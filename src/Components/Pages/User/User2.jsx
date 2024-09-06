import React, { useState } from 'react';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useUser from '../../../hooks/useUser';
import { useForm } from 'react-hook-form';
import { nanoid } from 'nanoid';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

const User2 = () => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email')
    const axiosPublic = useAxiosPublic()
    const axiosSecure = useAxiosSecure()
    const [userData] = useUser()
    const generateId = () => nanoid(12);
    const [transaction, setTransaction] = useState(generateId())
    const chaekAm = parseInt(userData.amount)
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const sendMoneyData = async (data) => {
        const sendData = {
            transactionId: generateId()
        }
        const resUser = await axiosSecure.get(`/send-user`)
        const findUser = resUser.data.find(fi => fi.email === data.userEmail)
        console.log(data.userEmail);
        // console.log(resUser.data);
        if (!findUser) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `User can't find`
            });
            reset()
            return
        }
        else if (findUser.role !== 'user') {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `This is not user email.`
            });
            reset()
            return
        }
        else if (findUser.status === "pending") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `User can't approved by agent`
            });
            reset()
            return
        }


        const formattedDate = format(new Date(), "MMM d, hh:mm a");
        const userAmount = parseFloat(findUser?.amount)
        const currentSendAmount = parseFloat(data.amount)
        let currentAmount = parseFloat(userData.amount)
        if (currentSendAmount >= 100) {
            currentAmount = parseFloat(userData.amount - 5)
        }
        console.log(currentAmount);
        const totalSendAmount = parseFloat(userAmount + currentSendAmount)
        const totalRecivedAmount = parseFloat(currentAmount - currentSendAmount)
        try {
            const res = await axiosPublic.post(`/auth/login`, data)
            if (chaekAm <= 50) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `Your blance is low send money is not possible`
                });
                reset()
                return
            }
            if (totalRecivedAmount < 0) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `Send Money blance is not enough`
                });
                reset()
                return
            }
            setTransaction(generateId())
            const sendMoneyUser = {
                email: email,
                amount: data.amount,
                transactionId: transaction,
                status: 'complete',
                type: 'Send Money',
                time: formattedDate
            }

            const recivedMoneyUser = {
                email: data.userEmail,
                amount: data.amount,
                transactionId: transaction,
                status: 'complete',
                type: 'Received Money',
                time: formattedDate
            }
            const requests = [
                await axiosSecure.patch(`/received-money/${data.userEmail}?amount=${totalSendAmount}`),
                await axiosSecure.patch(`/send-money/${email}?amount=${totalRecivedAmount}`),
                await axiosSecure.post('/send-money', sendMoneyUser),
                await axiosSecure.post('/recived-money', recivedMoneyUser)
            ];

            if (currentSendAmount >= 100) {
                const sendFee = {
                    email: email,
                    amount: 5,
                    transactionId: generateId(),
                    status: 'complete',
                    type: 'Send Money Fee',
                    time: formattedDate
                }
                const sendMoneyFee = await axiosSecure.post('/send-money-fee', sendFee)
            }
            const [upRecivedAmount, upSendAmount, sendMoney, recivedMoney] = await Promise.all(requests);
            if (sendMoney.data.insertedId && recivedMoney.data.insertedId) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Send Money Successfull",
                    showConfirmButton: false,
                    timer: 1500
                });
                reset()
            }
            window.location.reload()
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
            <h2 className="text-2xl font-bold text-gray-700 capitalize dark:text-white">Send Money</h2>
            <form onSubmit={handleSubmit(sendMoneyData)}>
                <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                    <div>
                        <label className="text-gray-700 dark:text-gray-200" >Email</label>
                        <input defaultValue={email} {...register('email', { required: true })} type="email" className="block  w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                    </div>
                    <div>
                        <label className="text-gray-700 dark:text-gray-200" >User Email</label>
                        <input {...register('userEmail', { required: true })} type="email" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
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
                    <button className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md focus:outline-none focus:bg-gray-600 hover:bg-blue-600">Send Money</button>
                </div>
            </form>
        </div>
    );
};

export default User2;