import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setStoreIsLogin, setStoreProfile, RootState, saveStateToLocalStorage, store } from '../../utils/store';
import { UserModel, initialProfile } from '../../models/users.model';
import { UserMessageModel } from '../../models/user-message.model';
import { MessageModel } from '../../models/message.model';
import { getUserListApi, getImageChat } from '../../utils/api';
import { FaAngleDown, FaImage } from 'react-icons/fa';
import exportToCSV from '../../utils/exportFile';
import socket from '../../utils/socket';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';

import '../../styles/chat-history.css';

dayjs.extend(isSameOrAfter);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

interface ChatHistoryPageProps { }

const ChatHistoryPage: React.FC<ChatHistoryPageProps> = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [showLogout, setShowLogout] = useState<boolean>(false);
    const [users, setUsers] = useState<UserMessageModel[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<UserMessageModel | null>(null);
    const [chatMessages, setChatMessages] = useState<MessageModel[]>([]);
    const [messageData, setMessageData] = useState<{ [messageId: string]: JSX.Element | null }>({});
    const [blockUser, setBlockUser] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const profile: UserModel = store.getState().auth.profile;
    const isLogin: boolean = store.getState().auth.isLogin;

    useEffect(() => {

        const loadFromLocalStorage = () => {
            const persistedState = localStorage.getItem('state');
            if (persistedState) {
                const state: RootState['auth'] = JSON.parse(persistedState);
                const stateIsLogin = state.isLogin;
                const stateProfile = state.profile;;
                dispatch(setStoreIsLogin(stateIsLogin));
                dispatch(setStoreProfile(stateProfile));

                if (stateIsLogin && stateProfile.type === "Admin") {
                    fetchUserList();
                    setupSocketListeners();
                } else {
                    router.replace("/admin/login");
                }
            }
        };

        loadFromLocalStorage();
    }, [dispatch, router, isLogin, profile]);

    const handleLogout = async () => {
        dispatch(setStoreProfile(initialProfile));
        dispatch(setStoreIsLogin(false));
        saveStateToLocalStorage({ isLogin: false, profile: initialProfile });
        router.push('/admin/login');
    };

    const fetchUserList = async () => {
        try {
            setIsLoading(true);
            const response = await getUserListApi();
            const userList = response.responseData.userList
            if (userList && userList.length > 0) {
                const userSorted = sortUsers(userList);
                const messages: MessageModel[] = userSorted[0].message;
                setSelectedUser(userSorted[0]);
                setChatMessages(messages);
                for (const message of messages) {
                    const messageElement = await showChatMessage(message);
                    setMessageData((prevMessageData) => ({
                        ...prevMessageData,
                        [message._id]: messageElement,
                    }));
                }
                setIsLoading(false);
            } else {
                setIsLoading(false);
                console.log('User list is empty');
            }
        } catch (error) {
            setIsLoading(false);
            alert(`${error}`);
            console.error('error', error);
        }
    };

    const setupSocketListeners = () => {
        socket.on('webhook', (data) => {
            console.log('Received webhook data:', data);
            updateMessageDetail(data.user, data.message);
        });

        return () => {
            socket.off('webhook');
            if (socket) {
                socket.disconnect();
            }
        };
    };

    const sortUsers = (userList: UserMessageModel[]) => {
        const usersWithLatestMessage = userList.map((user) => {
            const latestMessage = user.message[0];
            return { ...user, latestMessage };
        });

        const sortedUsers = usersWithLatestMessage.sort((a, b) => {
            const latestMessageA = a.latestMessage;
            const latestMessageB = b.latestMessage;

            if (!latestMessageA && !latestMessageB) {
                return 0;
            }

            if (!latestMessageA) {
                return 1; 
            }

            if (!latestMessageB) {
                return -1; 
            }

            const dateA = dayjs(latestMessageA.dateTime);
            const dateB = dayjs(latestMessageB.dateTime);

            return dateB.isSameOrAfter(dateA) ? -1 : 1;
        });
        setUsers(sortedUsers);
        return sortedUsers;
    }

    const updateMessageDetail = async (userData: UserModel, message: MessageModel) => {
        const messageElement = await showChatMessage(message);
        setMessageData((prevMessageData) => ({
            ...prevMessageData,
            [message._id]: messageElement,
        }));
        setUsers((prevUsers) => {
            const updatedUsers = prevUsers.map((user) => {
                if (user._id === userData._id) {
                    user.message.push(message);
                }
                return user;
            });
            return updatedUsers;
        });
        sortUsers(users);
        setTimeout(() => { focusChat(); }, 50);
    };

    const handleAngleDown = async () => {
        setShowLogout(!showLogout);
    }

    const handleSendMessage = () => {
        if (inputMessage.trim() !== '' && selectedUser) {
            const { message, ...userModel } = selectedUser;
            const input: MessageModel = {
                _id: `${Date.now()}`,
                contactId: userModel._id,
                contactName: userModel.name,
                channel: "Line",
                senderId: profile._id,
                senderType: profile.type,
                senderName: profile.name,
                dateTime: new Date().toISOString(),
                messageType: "text",
                detail: inputMessage,
            }
            updateMessageDetail(userModel, input);
            sortUsers(users);
            socket.emit('adminReply', input);
            setInputMessage('');
        }
    };

    const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const showTitleMessage = (user: UserMessageModel) => {
        const message = user.message[user.message.length - 1];
        const msgType = message ? message.messageType : "null";
        const details = msgType === "text" ? message.detail : "";
        return (
            <div>
                {msgType === "image" ? <FaImage className='user-detail-image' /> : <p>{details}</p>}
            </div>
        );
    }

    const showChatMessage = async (message: MessageModel) => {
        const msgType = message.messageType;

        if (msgType === "image") {
            try {
                const imageResponse = await getImageChat(message.detail);
                if (imageResponse) {
                    return <img key={message.detail} src={imageResponse} alt={message.detail} className='message-detail-image' />;
                }
            } catch (error) {
                console.error("Error fetching image:", error);

            }
        } else {
            return <p>{message.detail}</p>;
        }

        return null;
    };

    const handleUserSelect = async (user: UserMessageModel) => {
        setSelectedUser(user);
        setChatMessages(user.message);
        for (const message of user.message) {
            const messageElement = await showChatMessage(message);
            setMessageData((prevMessageData) => ({
                ...prevMessageData,
                [message._id]: messageElement,
            }));
        }
        focusChat();
    };

    const formatDate = (date: Date) => {
        if (dayjs(date).isToday()) return 'วันนี้';
        if (dayjs(date).isYesterday()) return 'เมื่อวาน';
        return dayjs(date).format('DD/MM/YYYY');
    };

    const focusChat = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }


    const getDisplayDate = (message: MessageModel, index: number, messages: MessageModel[]) => {
        const prevMessage = messages[index - 1];
        const date = new Date(message.dateTime);
        if (
            index === 0 ||
            (prevMessage && !dayjs(date).isSame(new Date(prevMessage.dateTime), 'day'))
        ) {
            return formatDate(date);
        }
        return null;
    };

    const handleExport = () => {
        if (selectedUser) {
            const { message, ...userModel } = selectedUser;
            exportToCSV(userModel, chatMessages)
        } else {
            console.log('Data not found');
        }
    };

    const handleBlocks = () => {
        setBlockUser(!blockUser)
    };

    return (
        <div>
            {isLogin && profile.type === 'Admin' && (
                <>
                    {isLoading ? (
                        <div className='loading'>Loading...</div> // หรือใช้ component สำหรับแสดงการโหลดที่มีการออกแบบมาเป็นพิเศษ
                    ) : (
                        <div className="container">
                            <div className="chat-header">
                                <div className="profile-image-placeholder"></div>
                                <span className="profile-name">{profile.name}</span>
                                <FaAngleDown className="angle-down" onClick={handleAngleDown} />
                            </div>
                            {showLogout && (
                                <div className="logout-button">
                                    <Button variant="primary" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </div>
                            )}
                            <div className="chat-history-container">
                                <div className="user-list">
                                    {users.length > 0 ?
                                        <div>
                                            {users.map((user, index) => (
                                                <div key={index} className="user-list-item" onClick={() => handleUserSelect(user)}>
                                                    <img src={user.image} alt={user.name} />
                                                    <div className="user-info">
                                                        <h5>{user.username}</h5>
                                                        {showTitleMessage(user)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        : (<div className='space'></div>)
                                    }
                                </div>
                                <div className="chat-window">
                                    <div className="chat-container">
                                        <div className="chat-box">
                                            {chatMessages.map((message, index) => (
                                                <>
                                                    {getDisplayDate(message, index, chatMessages) && (
                                                        <div className="date-separator">
                                                            {getDisplayDate(message, index, chatMessages)}
                                                        </div>
                                                    )}
                                                    <div key={message._id + index} className={`message ${message.senderType === 'User' ? 'received' : 'sent'}`}>
                                                        <div>
                                                            {message.senderType === 'User' && selectedUser
                                                                ? <img key={message._id} src={selectedUser.image} alt={selectedUser.name} className="message-user-image" />
                                                                : <div className="message-user-image-placeholder"></div>}
                                                        </div>
                                                        <div className='message-detail'>
                                                            {messageData[message._id] ?? <p>Loading...</p>}
                                                        </div>
                                                        <span className="timestamp">{dayjs(message.dateTime).format("HH:mm")}</span>
                                                    </div>
                                                </>
                                            ))}
                                            <div ref={messagesEndRef} />
                                        </div>
                                        <div className="input">
                                            {!blockUser ? (
                                                <div className="input-area">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Text Here..."
                                                        onFocus={focusChat}
                                                        value={inputMessage}
                                                        onChange={handleMessageChange}
                                                        onKeyUp={handleKeyPress}
                                                    />
                                                    <button onClick={handleSendMessage}>Send</button>
                                                </div>
                                            ) : (
                                                <div className="input-block">
                                                    <p>This user has been blocked.</p>
                                                </div>
                                            )
                                            }

                                        </div>
                                    </div>
                                </div>
                                <div className="detail-container">
                                    {selectedUser ?
                                        (
                                            <div className="detail-profile">
                                                <img src={selectedUser?.image} alt={selectedUser._id} />
                                                <h5>{selectedUser.username}</h5>
                                                <div className="detail-profile-info">
                                                    <p>Name : {selectedUser.name}</p>
                                                    <p>LastName : {selectedUser.lastName}</p>
                                                    <p>Email : {selectedUser.email}</p>
                                                </div>
                                                <Button onClick={handleExport}>Export</Button>
                                                <Button onClick={handleBlocks}>{blockUser ? "Unblock" : "Block"}</Button>
                                            </div>
                                        ) : (<div className='space'></div>)
                                    }
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ChatHistoryPage;
