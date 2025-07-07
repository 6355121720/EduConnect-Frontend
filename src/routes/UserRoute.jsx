import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout';

const UserRoute = () => {

  const isAuthenticated = useSelector(store => store.auth.isAuthenticated);

  if (isAuthenticated){
    return <MainLayout />;
  }
  else{
    <Navigate to="/unauthorized" replace />
  }

}

export default UserRoute