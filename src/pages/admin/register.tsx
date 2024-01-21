import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setStoreIsLogin, setStoreProfile, saveStateToLocalStorage } from '../../utils/store';
import { registerApi } from '../../utils/api';
import Head from 'next/head';
import '../../styles/styles.css';
import { UserModel } from '@/src/models/users.model';

interface RegisterPageProps { }

const RegisterPage: React.FC<RegisterPageProps> = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
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

    const handleRegister = async () => {
        console.log("handleRegister");
        try {
            if (password !== confirmPassword) {
                setDescription('Passwords do not match');
            } else {
                setDescription('');
                const response = await registerApi(username, password, "Admin", name, lastName, email, "");
                if (response.responseCode === "00000") {
                    const data: UserModel = response.responseData;
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
            }
        } catch (error) {
            console.error('Error during login:', error);
            // แสดง popup แจ้งเตือนเมื่อมีข้อผิดพลาด
            alert('Error during login. Please try again.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents the default form submission behavior
        await handleRegister();
    };

    return (
        <div>
            <Head>
                <title>Admin Register Page</title>
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
                                    setUsername(e.target.value);
                                    setDescription("");
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="form-group">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setDescription("");
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="form-group">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setDescription("");
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="form-group">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setDescription("");
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="form-group">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                    setDescription("");
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="form-group">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setDescription("");
                                }}
                            />
                        </Form.Group>
                        <label className="error">{description}</label>
                        <Button variant="primary" className="button-form" type="submit">
                            Submit
                        </Button>
                    </Form>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;