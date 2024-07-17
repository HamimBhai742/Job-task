import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Transactions = () => {
    const axiosSecure = useAxiosSecure()
    const [transactions, setTransactions] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosSecure.get('/transactions')
                setTransactions(res.data);
            }
            catch (err) {
                console.log('err', err);
            }
        }
        fetchData()
    }, [])
    return (
        <div>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr className='text-lg'>
                            <th>No.</th>
                            <th>Transaction Id</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody className='text-lg'>
                        {
                            transactions.map((transaction, idx) => <tr key={idx} className="hover">
                                <th>{idx + 1}</th>
                                <td>{transaction?.id}</td>
                                <td>{transaction?.amount}TK</td>
                                <td>{transaction?.status}</td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;