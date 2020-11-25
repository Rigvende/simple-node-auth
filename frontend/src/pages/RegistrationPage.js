import React, { useEffect, useState } from 'react';
import { useHttp } from '../utils/http.hook';
import { useMessage } from '../utils/message.hook';
import { useHistory } from 'react-router-dom';

export const RegistrationPage = () => {
    const history = useHistory();
    const message = useMessage();
    const { loading, error, clearError, request } = useHttp();
    const [form, setForm] = useState({
        name: '',
        age: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    const changeHandler = event => setForm({ ...form, [event.target.name]: event.target.value });

    const registerHandler = async () => {
        try {
            await request('/users', 'POST', { ...form });
            history.push('/');
        } catch (err) { }
    };

    const cancelHandler = () => history.push('/');

    return (
        <div className='row'>
            <div className='col s6 offset-s3'>
                <h2>Registration</h2>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Fill all fields:</span><br />
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
                            <div className="input-field">
                                <label
                                    className="label-white"
                                    htmlFor="email">Email</label>
                                <input
                                    placeholder="Enter email"
                                    id="email"
                                    type="text"
                                    name="email"
                                    value={form.email}
                                    className="yellow-input"
                                    onChange={changeHandler} />
                            </div>
                            <div className="input-field">
                                <label
                                    className="label-white"
                                    htmlFor="password">Password</label>
                                <input
                                    placeholder="Enter password"
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    className="yellow-input"
                                    onChange={changeHandler} />
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className='btn yellow darken-4'
                            disabled={loading}
                            onClick={registerHandler}>
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
