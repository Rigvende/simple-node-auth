import React, { useContext, useEffect, useState } from 'react';
import { useHttp } from '../utils/http.hook';
import { useMessage } from '../utils/message.hook';
import { AuthContext } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';

export const AuthPage = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const message = useMessage();
    const { loading, error, clearError, request } = useHttp();
    const [form, setForm] = useState({
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

    const authHandler = async () => {
        try {
            const data = await request('/auth', 'POST', { ...form });
            auth.login(data.token, data.id);
        } catch (err) { }
    };

    const registerHandler = () => history.push('/register');

    return (
        <div className='row'>
            <div className='col s6 offset-s3'>
                <h2>Welcome!</h2>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Enter the system:</span>
                        <div>
                            <div className="row">
                                <div className="input-field">
                                    <input id="email"
                                        type="text"
                                        name="email"
                                        value={form.email}
                                        className="yellow-input"
                                        onChange={changeHandler} />
                                    <label
                                        className="label-white"
                                        htmlFor="email">Email</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field">
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        className="yellow-input"
                                        onChange={changeHandler} />
                                    <label
                                        className="label-white"
                                        htmlFor="password">Password</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className='btn yellow darken-4'
                            disabled={loading}
                            onClick={authHandler}>
                            Login
                        </button>
                        <button
                            className='btn grey'
                            disabled={loading}
                            onClick={registerHandler}>
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};
