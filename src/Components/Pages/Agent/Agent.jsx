import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import crypto from 'crypto';
import { nanoid } from 'nanoid';

const Agent = () => {
    // const [startfn, setStartfn] = useState(false)
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email')
    console.log(token, 'lil');
    const axiosPublic = useAxiosPublic()
    const axiosSecure = useAxiosSecure()

    // console.log(generateId());
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
            const res = await axiosSecure.get('/cash-in-out-request?status=pending')
            return res.data
        }
    })
    const { data: cashOutRequest = [], refetch: reUse } = useQuery({
        queryKey: ['cashOutRequest'],
        queryFn: async () => {
            const res = await axiosSecure.get('/cash-in-out-request?status=pendings')
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
        const agentAmount = parseFloat(agent?.amount)
        const currentCashInAmount = parseFloat(cashIn.amount)
        const previousAmount = parseFloat(findUser.amount)
        const totalCashInAmount = parseFloat(previousAmount + currentCashInAmount)
        const totalCashOutAmount = parseFloat(agentAmount - currentCashInAmount)
        const generateId = () => nanoid(12);
        const cashOuts = {
            amount: currentCashInAmount,
            email: email,
            transactionId: generateId(),
            type: 'Cash Out',
            status: 'complete'
        }

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
                const res = await axiosSecure.patch(`/cash-out/${email}?amount=${totalCashOutAmount}`)
                console.log(res.data);
                const resCashIn = await axiosSecure.patch(`/cash-in/${cashIn?.email}?amount=${totalCashInAmount}`)
                console.log(resCashIn.data);
                const resCA = await axiosSecure.patch(`/cash-outs/${id}?type=Cash In`)
                // console.log(resCA);
                const cashOut = await axiosSecure.post('/cash-out', cashOuts)
                console.log(cashOut.data);
                Swal.fire({
                    title: "Approved!",
                    text: "Cash In Request Approved Successfully.",
                    icon: "success"
                });
                window.location.reload()
                reCall()
                refetch()
            }
        });
        // console.log(findUser);
        // console.log(cashIn);
    }
    const handelCashOutApproveBtn = async (id) => {
        console.log(id);
        const cashOut = cashOutRequest.find(ca => ca?._id === id)
        console.log(cashOut);
        const findUserss = alldata.find(ca => ca?.email === cashOut?.email)
        const agent = alldata.find(ca => ca?.email === email)
        let agentAmount = parseFloat(agent?.amount)
        let currenCashOutAmount = parseFloat(cashOut.amount * 1.5 / 100)
        console.log(currenCashOutAmount);
        let currentCashOutAmount = parseFloat(cashOut.amount)
        let userAmount = parseFloat(findUserss.amount)
        let totalCashIn = parseFloat(agentAmount + currentCashOutAmount + currenCashOutAmount)
        let totalCashOut = parseFloat(userAmount - currentCashOutAmount - currenCashOutAmount)
        console.log(totalCashIn);
        const generateId = () => nanoid(12);
        const cashInss = {
            amount: currentCashOutAmount,
            email: email,
            transactionId: generateId(),
            type: 'Cash In',
            status: 'complete'
        }
        console.log(cashInss);
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
                const res = await axiosSecure.patch(`/cash-out/${email}?amount=${totalCashIn}`)
                console.log(res.data);
                const resCashIn = await axiosSecure.patch(`/cash-in/${cashOut?.email}?amount=${totalCashOut}`)
                const resCA = await axiosSecure.patch(`/cash-outs/${id}?type=Cash Out`)
                console.log(resCA);
                const cashOutss = await axiosSecure.post('/cash-out', cashInss)
                console.log(cashOutss.data);
                Swal.fire({
                    title: "Approved!",
                    text: "Cash In Request Approved Successfully.",
                    icon: "success"
                });
                window.location.reload()
                reCall()
                refetch()
            }
        });
    }
    return (
        <div className='m-10 ml-72'>
            <div className=' text-2xl font-semibold'>
                <p>Current Amount: {agent?.amount} TK</p>
            </div>
            <div className="overflow-x-auto mt-6">
                <p className=' text-2xl font-semibold my-5'>Cash In Request</p>
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
            <div className="overflow-x-auto mt-8">
                <p className=' text-2xl font-semibold my-5'>Cash Out Request</p>
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
                            cashOutRequest?.map((ca, idx) => <tr key={idx} className="hover">
                                <th>{idx + 1}</th>
                                <td>{ca?.email}</td>
                                <td>{ca?.amount} TK</td>
                                <td>{ca?.status}</td>
                                <td>
                                    <button disabled={ca?.status === 'complete'} className={ca?.status === 'complete' ? 'bg-emerald-500  p-3 rounded-lg text-lg font-semibold' : 'bg-blue-600  p-3 rounded-lg text-lg font-semibold'} onClick={() => handelCashOutApproveBtn(ca?._id)}>{ca?.status === 'pending' ? 'Approve' : 'Approved'}</button>
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