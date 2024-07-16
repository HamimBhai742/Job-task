import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

const Agent = () => {
    const token = localStorage.getItem('token')
    console.log(token,'lil');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/chole', {
                    headers: {
                        Authorization: token
                    }
                })
                console.log(res.data);
            }
            catch (err) {
                console.log('err', err);
            }
        }
        fetchData()
    }, [])
    return (
        <div>
            <p>Agent</p>
        </div>
    );
};

export default Agent;