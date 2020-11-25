import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useHttp } from '../utils/http.hook';
import { useMessage } from '../utils/message.hook';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import { UsersList } from '../components/UsersList';

export const MainPage = () => {
    const { token } = useContext(AuthContext);
    const message = useMessage();
    const { loading, error, clearError, request } = useHttp();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const getUsers = useCallback(async () => {
        try {
            const data = await request(`/users`, 'GET', null, { Authorization: `Bearer ${token}` });
            setUsers(data.data.users);
        } catch (err) { }
    }, [request, token]);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            { !loading && <UsersList users={users} />}
        </>
    )
};
