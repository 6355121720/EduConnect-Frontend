import React, { useEffect, useState } from 'react';
import { useSelector , useDispatch } from 'react-redux';
import BellButton from '../components/BellButton';
import NotificationDrawer from '../components/NotificationDrawer';
import ToastHost from '../components/ToastHost';
import { Link } from 'react-router-dom';
import FreindSuggestion from "./FreindSuggestion";
import {fetchNotifications, addNotification} from '../../../store/slices/notificationsSlice';
import SocketService from '../../../services/SocketService';


const PrivateHome = () => {
  let user = useSelector(store => store.auth.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Welcome Section */}
      <div className="bg-gradient-to-b from-yellow-900/10 via-transparent to-transparent py-32 px-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="slide-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-white mb-8 leading-tight">
              Welcome back,<br />
              <span className="text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">
                {user?.fullName}
              </span>
            </h1>
            <p className="text-gray-300 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
              Ready to connect, learn, and grow with your student community?
            </p>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="card-glass p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="text-yellow-400 text-3xl mb-4">🎓</div>
                <h3 className="text-white font-bold text-lg mb-2">Find Students</h3>
                <p className="text-gray-400">Connect with peers</p>
              </div>
              <div className="card-glass p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="text-yellow-400 text-3xl mb-4">📅</div>
                <h3 className="text-white font-bold text-lg mb-2">Join Events</h3>
                <p className="text-gray-400">Discover opportunities</p>
              </div>
              <div className="card-glass p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="text-yellow-400 text-3xl mb-4">💬</div>
                <h3 className="text-white font-bold text-lg mb-2">Start Chatting</h3>
                <p className="text-gray-400">Build relationships</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Friend Suggestions Section */}
      <div className="py-16">
        <FreindSuggestion />
      </div>
    </div>
  )
}

const UpdatesHero = ({ user }) => (
  <div className="bg-gradient-to-b from-yellow-900/10 via-transparent to-transparent py-20 px-4 relative overflow-hidden">
    <div className="max-w-5xl mx-auto text-center relative z-10">
      <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3">
        Welcome back, <span className="text-yellow-400">{user?.fullName}</span>
      </h1>
      <p className="text-gray-300 max-w-2xl mx-auto">Your updates hub — events, messages, and connection requests in one place.</p>
    </div>
  </div>
);

const SummaryPanels = () => {
  const unread = useSelector((s) => s.notifications?.unreadCount || 0);
  return (
    <aside className="hidden lg:block w-72 p-4">
      <div className="bg-gray-800 p-4 rounded-lg space-y-3">
        <div className="text-xs text-gray-400">Today</div>
        <div className="text-2xl font-semibold text-white">{unread}</div>
        <div className="text-sm text-gray-300">unread notifications</div>

        <div className="mt-4">
          <div className="text-xs text-gray-400 mb-2">Upcoming events</div>
          <ul className="space-y-2">
            <li className="text-sm text-gray-200">No upcoming events — <Link to="/events" className="text-indigo-400">Explore</Link></li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

const UpdatesListPlaceholder = () => (
  <div className="space-y-3">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="h-20 bg-gray-800 animate-pulse rounded-lg" />
    ))}
  </div>
);

const UpdatesHub = () => {
  const user = useSelector((s) => s.auth.user);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const notificationsState = useSelector((s) => s.notifications);
  const dispatch = useDispatch();
  const items = notificationsState.order.map((id) => notificationsState.byId[id]).filter(Boolean);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);
  const onNotificationReceived = (notifi) => {
    dispatch(addNotification(notifi));

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notifi.title || "New Notification", {
        body: notifi.message || "",
        // icon: "/icon-192.png", 
      });
    }
  };

  useEffect(() => {
    let subscription;
    const timeoutId = setTimeout(() => {
      subscription = SocketService.setOnNotificationCallback(onNotificationReceived);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (subscription) subscription();
    };
  }, []);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <ToastHost />
      <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <header className="sticky top-0 z-40 bg-transparent border-b border-gray-800 backdrop-blur-sm py-3">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Updates</h2>
            <div className="text-xs text-gray-400">All your activity in one place</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <input aria-label="Search updates" placeholder="Search updates" className="px-3 py-2 rounded bg-gray-800 text-white text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
            <button className="text-sm px-3 py-2 bg-gray-800 rounded text-gray-200">Unread only</button>
            <BellButton onClick={() => setDrawerOpen(true)} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <section className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-gray-300">Recent</h3>
              <div className="text-xs text-gray-400">Sorted by priority & time</div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            {/* {notificationsState.status === 'loading' && <UpdatesListPlaceholder />} */}

            {notificationsState.status !== 'loading' && items.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <p className="mb-3">No recent updates</p>
                <Link to="/events" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded">Explore events</Link>
              </div>
            )}

            {notificationsState.status !== 'loading' && items.length > 0 && (
              <div className="space-y-3">
                {items.map((n) => (
                  <div key={n.id} className="p-2">
                    <div className={`p-3 rounded-lg ${n.read ? 'bg-gray-800' : 'bg-gray-700 ring-1 ring-indigo-500/20'}`}>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-600 rounded-md flex items-center justify-center text-white">
                          {n.type.split('_')[0][0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="text-sm text-white font-semibold">{n.title}</div>
                              {n.message && <div className="text-xs text-gray-300 line-clamp-2">{n.message}</div>}
                            </div>
                            <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute:'2-digit' })}</div>
                          </div>
                          <div className="mt-2 flex gap-2">
                            {/* Quick actions: adapt based on notification type */}
                            {n.type.startsWith('FRIEND') && (
                              <>
                                <button className="px-3 py-1 bg-emerald-600 text-white text-xs rounded">Accept</button>
                                <button className="px-3 py-1 bg-rose-600 text-white text-xs rounded">Decline</button>
                              </>
                            )}
                            {n.type.startsWith('EVENT') && (
                              <>
                                <button className="px-3 py-1 bg-indigo-600 text-white text-xs rounded">View</button>
                                <button className="px-3 py-1 bg-gray-700 text-gray-200 text-xs rounded">RSVP</button>
                              </>
                            )}
                            {n.type.startsWith('CHAT') && (
                              <>
                                <button className="px-3 py-1 bg-indigo-600 text-white text-xs rounded">Open</button>
                                <button className="px-3 py-1 bg-gray-700 text-gray-200 text-xs rounded">Mute</button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <SummaryPanels />
      </main>
    </div>
  );
};

export default UpdatesHub;