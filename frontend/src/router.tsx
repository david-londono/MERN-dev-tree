import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginView from './views/LoginView';
import SignupView from './views/SignupView';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import LinkTreeView from './views/LinkTreeView';
import ProfileView from './views/ProfileView';
import HandleView from './views/HandleView';
import NotFoundView  from './views/NotFoundView';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path='/auth/login' element={<LoginView />} />
                    <Route path='/auth/signup' element={<SignupView />} />
                </Route>
                <Route path='/admin' element={<AppLayout />} >
                    <Route index={true} element={<LinkTreeView />} />
                    <Route path='profile' element={<ProfileView/>} />
                </Route>
                
                <Route path='/:handle' element={<AuthLayout />}>
                    <Route element={<HandleView />} index={true}></Route>
                </Route>

                <Route path='/404' element={<AuthLayout />}>
                    <Route element={<NotFoundView />} index={true}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
