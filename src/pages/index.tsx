// /pages/index.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../utils/store';

const IndexPage: React.FC = () => {
    const router = useRouter();
    const isLogin = useSelector((state: RootState) => state.auth.isLogin);
    const profile = useSelector((state: RootState) => state.auth.profile);

    useEffect(() => {
        if (isLogin) {
            if (profile.type === "Admin") {
                router.push('/admin/chat-history');
            } else {
                router.push('/user/login');
            }
        } else {
            router.push('/admin/login');
        }
    }, [isLogin, profile, router]);

    return <div></div>;
};

export default IndexPage;
