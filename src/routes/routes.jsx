import { Route, BrowserRouter, Navigate, Routes, Outlet } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';
import MainLayout from '../layouts/MainLayout';
import SignupPage from '../features/auth/pages/SignupPage';
import LoginPage from '../features/auth/pages/LoginPage';
import HomePage from '../features/home/pages/HomePage';
import ProfilePage from '../features/profile/pages/ProfilePage';
import UserRoute from './UserRoute';
import StudentsPage from '../features/students/pages/StudentPage';
import ConnectionsPage from '../features/students/pages/ConnectionsPage';
import MessagePage from '../features/chat/pages/MessagePage';
import PersonalChatPage from '../features/chat/pages/PersonalChatPage';
import GroupChatPage from '../features/chat/pages/GroupChatPage';
import GroupList from '../features/chat/pages/GroupListPage';

const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Navigate to="/notfound" replace />} />
          <Route path="/notfound" element={<NotFound />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />


          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
          </Route>

          <Route path="/" element={<UserRoute />} >
            <Route path="/students" element={<Outlet/>}>
              <Route index element={<StudentsPage />} />
              <Route path='/students/connections' element={<ConnectionsPage />} />
            </Route>
            <Route path = "/chat" element={<Outlet />}>
              <Route index element={<MessagePage />} />
              <Route path = "/chat/personal" element={<PersonalChatPage />} />
              <Route path = "/chat/group" element = {<GroupChatPage />} />
              <Route path = "/chat/groups" element = {<GroupList />} />
            </Route>
          </Route>

          <Route path="/profile" element={<ProfilePage />} />


        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRouter;
