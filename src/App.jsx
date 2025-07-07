import { Provider } from 'react-redux';
import AppRouter from './routes/routes';
import store from './store/store';
import AppContent from './AppContent';
import { useEffect } from 'react';
import { connectSocket, disconnectSocket } from './socket/socket';

function App() {

  useEffect(() => {
    connectSocket();
    return (() => {
      disconnectSocket();
    })
  }, []);

  return (
    <>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </>
  );
}

export default App;
