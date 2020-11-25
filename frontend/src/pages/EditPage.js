import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../utils/http.hook';
import { useMessage } from '../utils/message.hook';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const EditPage = () => {
    const id = useParams().id;
    const { token } = useContext(AuthContext);
    const history = useHistory();
    const message = useMessage();
    const { loading, error, clearError, request } = useHttp();
    const [form, setForm] = useState({
        name: '',
        age: '',
    });

    const getUser = useCallback(async () => {
        if (id) {
            try {
                const data = await request(`/users/${id}`, 'GET', null, { Authorization: `Bearer ${token}` });
                const { user } = data.data;

                if (user) {
                    const { name, age } = user;
                    setForm({ name, age });
                } else {
                    history.push('/users');
                }
            } catch (err) { }
        } else {
            history.push('/users');
        }
    }, [id, request, history, token]);

    useEffect(() => {
        getUser();
    }, [getUser]);

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    const changeHandler = event => setForm({ ...form, [event.target.name]: event.target.value });

    const updateHandler = async () => {
        try {
            await request(`/users/${id}`, 'PATCH', { ...form }, { Authorization: `Bearer ${token}` });
            history.push('/users');
        } catch (err) { }
    };

    const cancelHandler = () => history.push('/users');

    return (
        <div className='row'>
            <div className='col s6 offset-s3'>
                <h2>Edition</h2>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Change fields:</span><br />
                        <div>
                            <div className="input-field">
                                <label
                                    className="label-white"
                                    htmlFor="name">Name</label>
                                <input
                                    placeholder="Enter name"
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    className="yellow-input"
                                    onChange={changeHandler} />
                            </div>
                            <div className="input-field">
                                <label
                                    className="label-white"
                                    htmlFor="age">Age</label>
                                <input
                                    placeholder="Enter age"
                                    id="age"
                                    type="text"
                                    name="age"
                                    value={form.age}
                                    className="yellow-input"
                                    onChange={changeHandler} />
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className='btn yellow darken-4'
                            disabled={loading}
                            onClick={updateHandler}>
                            Save
                        </button>
                        <button
                            className='btn grey'
                            disabled={loading}
                            onClick={cancelHandler}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};
