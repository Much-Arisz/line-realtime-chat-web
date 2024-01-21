import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form } from 'react-bootstrap';
import { loginApi } from '../../utils/api';
import Head from 'next/head';
import '../../styles/styles.css';

interface LoginPageProps { }

const LoginPage: React.FC<LoginPageProps> = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const router = useRouter();

    const handleLogin = async () => {
        console.log("handleLogin");
        try {
            const response = await loginApi(username, password);
            if (response.responseCode === "00000") {
                const data = response.responseData;
                if (data.type === "User") {
                    setSuccess(true);
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
        router.push('/user/register');
    };

    return (
        <div>
            <Head>
                <title>Login Page</title>
            </Head>
            <main >
                <div>
                    {success 
                    ?   <div className='success'>
                            <h1>Success</h1>
                            <p>Thank you, You can close this page.</p>
                        </div> 
                    :   <Form className="form" onSubmit={handleSubmit}>
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
                            <Button variant="primary" className="button" onClick={handleRegister}>
                                register
                            </Button>
                        </Form>
                    }
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
