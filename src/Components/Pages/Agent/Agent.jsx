import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const Agent = () => {
    // const [startfn, setStartfn] = useState(false)
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email')
    console.log(token, 'lil');
    const axiosPublic = useAxiosPublic()
    const axiosSecure = useAxiosSecure()
    // const [cashInRequst, setCashInRequst] = useState([])

    const [alldata, setAllData] = useState([])
    const { data: agent, refetch: reCall } = useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => {
            const result = await axiosSecure.get(`/agent?email=${email}`)

            return result.data;
        }
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosSecure.get(`/all-user`)
                setAllData(res.data);
            }
            catch (err) {
                console.log('err', err);
            }
        }
        fetchData()
    }, [axiosSecure, email])

    console.log(alldata);
    const { data: cashInRequest = [], refetch } = useQuery({
        queryKey: ['cashInRequest'],
        queryFn: async () => {
            const res = await axiosPublic.get('/cash-in-request')
            return res.data
        }
    })
    console.log(cashInRequest);
    const handelCashInApproveBtn = async (id) => {
        console.log(id);
        // const agent=alldata
        const cashIn = cashInRequest.find(ca => ca?._id === id)
        console.log(cashIn);
        const findUser = alldata.find(ca => ca?.email === cashIn?.email)
        const agent = alldata.find(ca => ca?.email === email)
        const agentAmount = parseInt(agent.amount)
        const currentCashInAmount = parseInt(cashIn.amount)
        const previousAmount = parseInt(findUser.amount)
        const totalCashInAmount = parseInt(previousAmount + currentCashInAmount)
        const totalCashOutAmount = parseInt(agentAmount - currentCashInAmount)
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
                const res = await axiosSecure.patch(`/cash-out/${email}?amount=${totalCashOutAmount}`)
                console.log(res.data);
                const resCashIn = await axiosSecure.patch(`/cash-in/${cashIn?.email}?amount=${totalCashInAmount}`)
                console.log(resCashIn.data);
                const resCA = await axiosSecure.patch(`/cash-outs/${id}`)
                // console.log(resCA);
                // reCall()
                refetch()
            }
        });
        // console.log(resCA.data);
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
                            cashInRequest?.map((ca, idx) => <tr key={idx} className="hover">
                                <th>{idx + 1}</th>
                                <td>{ca?.email}</td>
                                <td>{ca?.amount} TK</td>
                                <td>{ca?.status}</td>
                                <td>
                                    <button disabled={ca?.status === 'complete'} className={ca?.status === 'complete' ? 'bg-emerald-500  p-3 rounded-lg text-lg font-semibold' : 'bg-blue-600  p-3 rounded-lg text-lg font-semibold'} onClick={() => handelCashInApproveBtn(ca?._id)}>{ca?.status === 'pending' ? 'Approve' : 'Approved'}</button>
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