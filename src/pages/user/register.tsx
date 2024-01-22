import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form } from 'react-bootstrap';
import { registerApi } from '../../utils/api';
import Head from 'next/head';
import '../../styles/styles.css';

interface RegisterPageProps { }

const RegisterPage: React.FC<RegisterPageProps> = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const router = useRouter();
    const lineId = `${router.query.userId}`;

    const handleRegister = async () => {
        console.log("handleRegister");
        try {
            if (password !== confirmPassword) {
                setDescription('Passwords do not match');
            } else {
                setDescription('');
                const response = await registerApi(username, password, "User", name, lastName, email, lineId);
                if (response.responseCode === "00000") {
                    setSuccess(true);
                } else {
                    setDescription(response.responseDesc);
                }
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert(`Error during Register. Please try again. url=${process.env.NEXT_PUBLIC_API_URL}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents the default form submission behavior
        await handleRegister();
    };

    return (
        <div>
            <Head>
                <title>Register Page</title>
            </Head>
            <main >
                <div>
                    {success
                        ? <div className='success'>
                            <h1>Success</h1>
                            <p>Thank you, You can close this page.</p>
                        </div>
                        : <Form className="form" onSubmit={handleSubmit}>
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
                    }
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;