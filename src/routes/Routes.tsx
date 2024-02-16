import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ThemeProviderEnum, themeVar } from '../graphql/variables/Shared';
import { useWeb3React } from "@web3-react/core"
import {AppContext} from '../contexts'
import { Header } from '../components/layout/Header';
import {UserData} from '../types/userType';
import { useGetRole } from '../hooks/useTransactions';
import {parseBigNumberToFloat} from '../services/UtilService';
const MarketplacePage = lazy(() => import('../pages/MarketplacePage'));
const AdminPage = lazy(() => import('../pages/AdminPage'));
const NotFoundPage = lazy(() => import('../pages/Page404'));

export default function Router() {
    const { account } = useWeb3React();
    const getRole = useGetRole();
    const [theme, setTheme] = useState({theme: localStorage.getItem('theme') + ''});

    useEffect(()=> {
        if(theme.theme === 'dark') {
            themeVar(ThemeProviderEnum.dark);
        } else {
            themeVar(ThemeProviderEnum.light);
        }
    }, [theme])

    const [user, setUser] = useState<UserData>({
        account: "",
        role: 0
    });

    useEffect(() => {
        const autoLogin = async (account: string) => {
            let role = await getRole(account);
            role = parseBigNumberToFloat(role, 0);
 
            setUser({
                account: account,
                role: role
            })
        }
    
        if(!!account && user !== undefined && user.account !== account)
          autoLogin(account);
    }, [account])

    return (
        <Suspense fallback={<Header />}>
            <AppContext.Provider value={{user, setUser, theme, setTheme}}>
                <Routes>        
                    <Route path='/' element={<MarketplacePage />} />
                    <Route path='/admin' element={<AdminPage />} />
                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            </AppContext.Provider>
        </Suspense>
    )
} 
