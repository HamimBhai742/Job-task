import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Agent = () => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email')
    console.log(token, 'lil');
    const axiosPublic = useAxiosPublic()
    const axiosSecure = useAxiosSecure()
    const [agent, setAgent] = useState()
    const [alldata, setAllData] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axiosSecure.get(`/agent?email=${email}`)
                setAgent(result.data);
                const res = await axiosSecure.get(`/all-user`)
                setAllData(res.data);
            }
            catch (err) {
                console.log('err', err);
            }
        }
        fetchData()
    }, [])
    console.log(alldata);
    const { data: cashInRequest = [] } = useQuery({
        queryKey: ['cashInRequest'],
        queryFn: async () => {
            const res = await axiosPublic.get('/cash-in-request')
            return res.data
        }
    })
    console.log(cashInRequest);
    const handelCashInApproveBtn = async(id) => {
        console.log(id);
        const cashIn = cashInRequest.find(ca => ca?._id === id)
        const findUser = alldata.find(ca => ca?.email === cashIn?.email)
        const res=await axiosSecure.patch('/cash-in')
        // console.log(findUser);
        // console.log(cashIn);
    }
    return (
        <div className='m-10'>
            <div className='flex justify-between items-center'>
                <p>Cash In Request</p>
                <p>Current Amount: {agent?.amount} TK</p>
            </div>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr className='text-lg'>
                            <th>No.</th>
                            <th>Email</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className='text-lg'>
                        {
                            cashInRequest.map((ca, idx) => <tr key={idx} className="hover">
                                <th>{idx + 1}</th>
                                <td>{ca?.email}</td>
                                <td>{ca?.amount} TK</td>
                                <td>{ca?.status}</td>
                                <td>
                                    <button className='bg-blue-600 p-3 rounded-lg text-lg font-semibold' onClick={() => handelCashInApproveBtn(ca?._id)}>Approve</button>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Agent;