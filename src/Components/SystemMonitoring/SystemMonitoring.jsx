import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const SystemMonitoring = () => {
    const axiosSecure = useAxiosSecure()
    const [allTransaction, setAllTransaction] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosSecure.get('/all-transactions?status=complete')
                setAllTransaction(res.data);
            }
            catch (err) {
                console.log('err', err);
            }
        }
        fetchData()
    }, [])
    const positiveTypes = ['Cash In', 'Received Money', 'New User Bonus','New Agent Bonus'];
    return (
        <div className=' mx-10 mt-8 ml-72'>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr className='text-lg'>
                            <th>No.</th>
                            <th>Transaction Id</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Payment Status</th>
                        </tr>
                    </thead>
                    <tbody className='text-lg'>
                        {
                            allTransaction.map((transaction, idx) => {
                                const isPositiveType = positiveTypes.includes(transaction.type);
                                return (
                                    <tr key={idx} className="hover">
                                        <th>{idx + 1}</th>
                                        <td>{transaction?.transactionId}</td>
                                        <td>{transaction?.amount} TK</td>
                                        <td>
                                            <p className='flex gap-2 items-center'>{isPositiveType ? <span className='text-green-600'><FaArrowRight></FaArrowRight></span> : <span className='text-red-600'><FaArrowLeft></FaArrowLeft></span>}{transaction?.type}</p>
                                        </td>
                                        <td>
                                            <p className={transaction?.status === 'complete' ? 'bg-emerald-100 font-medium text-emerald-600 px-5 rounded-full' : 'bg-pink-100 font-medium text-pink-600 px-5 rounded-full'}>{transaction?.status}</p>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SystemMonitoring;