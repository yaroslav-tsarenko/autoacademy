"use client";

import React, {useState} from 'react';
import ButtonUI from "@/ui/button/ButtonUI";
import Input from "@mui/joy/Input";
import Box from "@mui/joy/Box";
import styles from "./Admin.module.scss";
import Typography from "@mui/joy/Typography";
import AdminContent from "@/components/admin-content/AdminContent";

const ADMIN_LOGIN = process.env.NEXT_PUBLIC_ADMIN_LOGIN;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

const Admin = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [authorized, setAuthorized] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
            setAuthorized(true);
            setError('');
        } else {
            setError('Неправильні дані');
        }
    };

    if (authorized) {
        return (
            <AdminContent/>
        );
    }

    return (
        <div className={styles.wrapper}>
            <Box
                sx={{
                    maxWidth: 400,
                    mx: "auto",
                    mt: 8,
                    p: 3,
                    borderRadius: 3,
                    boxShadow: "md",
                    bgcolor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Typography sx={{mb: 2, textAlign: "center"}}>Адмін Панель</Typography>
                <Input
                    type="text"
                    placeholder="Login"
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                    size="lg"
                    variant="outlined"
                    sx={{mb: 1, fontWeight: 300}}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    size="lg"
                    variant="outlined"
                    sx={{mb: 1, fontWeight: 300}}
                />
                <ButtonUI color="primary" onClick={handleLogin}>Ввійти</ButtonUI>
                {error && (
                    <Typography color="danger" sx={{mt: 1, textAlign: "center"}}>
                        {error}
                    </Typography>
                )}
            </Box>
        </div>
    );
};

export default Admin;