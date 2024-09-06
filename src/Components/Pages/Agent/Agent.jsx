import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import crypto from 'crypto';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';

const Agent = () => {
    // const [startfn, setStartfn] = useState(false)
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email')
    // console.log(token, 'lil');
    const axiosPublic = useAxiosPublic()
    const axiosSecure = useAxiosSecure()
    const formattedDate = format(new Date(), "MMM d, hh:mm a");
    // console.log(generateId());
    // const [cashInRequst, setCashInRequst] = useState([])
    const generateId = () => nanoid(12);
    const [transactions, setTransactions] = useState(generateId())

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
            const res = await axiosSecure.get(`/cash-in-out-request?status=pending&&email=${email}`)
            return res.data
        }
    })
    const { data: cashOutRequest = [], refetch: reUse } = useQuery({
        queryKey: ['cashOutRequest'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/cash-in-out-request?status=pendings&&email=${email}`)
            return res.data
        }
    })
    const handelCashInApproveBtn = async (id) => {
        // const agent=alldata
        const cashIn = cashInRequest.find(ca => ca?._id === id)
        const findUser = alldata.find(ca => ca?.email === cashIn?.email)
        const agent = alldata.find(ca => ca?.email === email)
        const agentAmount = parseFloat(agent?.amount)
        const currentCashInAmount = parseFloat(cashIn.amount)
        const agentCommssion = parseFloat(currentCashInAmount * 0.410 / 100)
        // const agentCommssionAmount = parseFloat(agentAmount + agentCommssion)
        const previousAmount = parseFloat(findUser.amount)
        const totalCashInAmount = parseFloat(previousAmount + currentCashInAmount)
        const totalCashOutAmount = parseFloat(agentAmount + agentCommssion - currentCashInAmount)
        // console.log(agentCommssionAmount);
        const agentCommissionss = {
            amount: agentCommssion,
            email: email,
            transactionId: generateId(),
            type: 'Cash Out Commission',
            status: 'complete',
            time: formattedDate
        }
        setTransactions(generateId())
        const cashOuts = {
            amount: currentCashInAmount,
            email: email,
            transactionId: transactions,
            type: 'Cash Out',
            status: 'complete',
            time: formattedDate
        }
        Swal.fire({
            title: "Are you sure?",
            text: "You want approved this user cash in",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Approved!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.patch(`/cash-out/${email}?amount=${totalCashOutAmount}`)
                const resCashIn = await axiosSecure.patch(`/cash-in/${cashIn?.email}?amount=${totalCashInAmount}`)
                const resCA = await axiosSecure.patch(`/cash-outs/${id}?type=Cash In&&tra=${transactions}&&time=${formattedDate}`)
                const docdoc = [cashOuts, agentCommissionss]
                const cashOut = await axiosSecure.post('/cash-out', docdoc)
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Cash In Request Approved Successfully.",
                    showConfirmButton: false,
                    timer: 1500
                });
                reCall()
                refetch()
            }
        });
        console.log(findUser);
        console.log(cashIn);
    }


    const handelCashOutApproveBtn = async (id) => {
        const cashOut = cashOutRequest.find(ca => ca?._id === id)
        const findUserss = alldata.find(ca => ca?.email === cashOut?.email)
        const agent = alldata.find(ca => ca?.email === email)
        let agentAmount = parseFloat(agent?.amount)
        let currenCashOutAmount = parseFloat(cashOut.amount * 1.5 / 100)
        let currentCashOutAmount = parseFloat(cashOut.amount)
        let userAmount = parseFloat(findUserss.amount)
        let agentsCommssions = parseFloat(currentCashOutAmount * 0.410 / 100)
        let totalCashIn = parseFloat(agentAmount + currentCashOutAmount + agentsCommssions)
        let totalCashOut = parseFloat(userAmount - currentCashOutAmount - currenCashOutAmount)
        const cashOutFee = {
            amount: currenCashOutAmount,
            email: cashOut?.email,
            transactionId: generateId(),
            type: 'Cash Out Fee',
            status: 'complete',
            time: formattedDate
        }
        const agentCommissionsss = {
            amount: agentsCommssions,
            email: email,
            transactionId: generateId(),
            type: 'Cash In Commission',
            status: 'complete',
            time: formattedDate
        }
        setTransactions(generateId())
        const cashInss = {
            amount: currentCashOutAmount,
            email: email,
            transactionId: transactions,
            type: 'Cash In',
            status: 'complete',
            time: formattedDate
        }

        console.log(cashInss);
        Swal.fire({
            title: "Are you sure?",
            text: "You want approved this user cash out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Approved!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.patch(`/cash-out/${email}?amount=${totalCashIn}`)
                const resCashIn = await axiosSecure.patch(`/cash-in/${cashOut?.email}?amount=${totalCashOut}`)
                const resCA = await axiosSecure.patch(`/cash-outs/${id}?type=Cash Out&&tra=${transactions}&&time=${formattedDate}`)
                const doc = [cashInss, cashOutFee, agentCommissionsss]
                const cashOutss = await axiosSecure.post('/cash-out', doc)
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Cash In Request Approved Successfully.",
                    showConfirmButton: false,
                    timer: 1500
                });
                reCall()
                refetch()
            }
        });
    }
    const amountss = parseFloat(agent?.amount).toFixed(2)
    return (
        <div className='m-10 ml-72'>
            <div className=' text-2xl font-semibold'>
                <p>Current Amount: {amountss} TK</p>
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