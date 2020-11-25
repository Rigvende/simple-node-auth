import { useState, useCallback, useEffect } from 'react';

const STORAGE = 'userData';

export const useAuth = () => {
    const [ready, setReady] = useState(false);
    const [token, setToken] = useState(null);
    const [idUser, setIdUser] = useState(null);

    const login = useCallback((jwt, id) => {
        setToken(jwt);
        setIdUser(id);

        localStorage.setItem(STORAGE, JSON.stringify({ token: jwt, idUser: id }));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setIdUser(null);
        localStorage.removeItem(STORAGE);
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(STORAGE));
        if (data && data.token) {
            login(data.token, data.idUser);
        }

        setReady(true);
    }, [login])

    return { login, logout, token, idUser, ready };
}