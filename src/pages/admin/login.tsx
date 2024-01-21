import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setStoreIsLogin, setStoreProfile, saveStateToLocalStorage } from '../../utils/store';
import { loginApi } from '../../utils/api';
import Head from 'next/head';
import '../../styles/styles.css';
import { UserModel } from '@/src/models/users.model';

interface LoginPageProps { }

const LoginPage: React.FC<LoginPageProps> = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {

        const loadFromLocalStorage = () => {
            const persistedIsLogin = localStorage.getItem('isLogin');
            const persistedProfile = localStorage.getItem('profile');
            if (persistedIsLogin && persistedProfile) {
                const isLogin = JSON.parse(persistedIsLogin);
                const profile = JSON.parse(persistedProfile);
                dispatch(setStoreIsLogin(isLogin));
                dispatch(setStoreProfile(profile));
                if (isLogin && profile.type === "Admin") {
                    router.replace('/admin/chat-history');
                }
            }
        };

        loadFromLocalStorage();

    }, [dispatch, router]);

    const handleLogin = async () => {
        console.log("handleLogin");
        try {
            const response = await loginApi(username, password);
            if (response.responseCode === "00000") {
                const data: UserModel = response.responseData;
                console.log("data", data);
                if (data.type === "Admin") {
                    dispatch(setStoreProfile(data));
                    dispatch(setStoreIsLogin(true));
                    saveStateToLocalStorage({ isLogin: true, profile: data });
                    router.replace('/admin/chat-history');
                } else {
                    setDescription("Username or password incorrect");
                }
            } else {
                setDescription(response.responseDesc);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Error during login. Please try again.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        await handleLogin();
    };

    const handleRegister = async () => {
        console.log("handleRegister");
        router.push('/admin/register');
    };

    return (
        <div>
            <Head>
                <title>Admin Login Page</title>
            </Head>
            <main >
                <div>
                    <Form className="form" onSubmit={handleSubmit}>
                        <Form.Group className="form-group">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                    setDescription("")
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="form-group">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setDescription("")
                                }}
                            />
                        </Form.Group>
                        <label className="error">{description}</label>
                        <Button variant="primary" className="button-form" type="submit">
                            Login
                        </Button>
                        <Button variant="primary" className="button-register" onClick={handleRegister}>
                            register
                        </Button>
                    </Form>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;