import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Users, UserPlus, UserCheck, Clock, Loader2 } from 'lucide-react'
import { getSuggestion } from '../../../api/userApi'
import { NavLink } from 'react-router-dom'
import { acceptConnect, sendConnect } from '../../../api/connectAPI'

const FreindSuggestion = () => {
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [buttonStates, setButtonStates] = useState({});

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await getSuggestion();
        if (res.status === 200) {
          console.log(res.data);
          setFriends(res.data);
        } else {
          console.log("Friend suggestion error.");
        }
      } catch (e) {
        console.log("Friend suggestion error.", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const scrollRef = useRef();

  const onScrollClick = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

  const onScrollDoubleClick = (direction) => {
    if (scrollRef.current) {
      const width = scrollRef.current.scrollWidth;
      scrollRef.current.scrollTo({
        left: direction === "left" ? 0 : width,
        behavior: 'smooth'
      });
    }
  };

  const sendConnectionRequest = async (e) => {
    const btn = e.currentTarget;
    const userId = btn.id;
    
    setButtonStates(prev => ({ ...prev, [userId]: { loading: true, text: 'Connecting...' } }));
    
    try {
      const res = await sendConnect({ id: userId });
      if (res.status === 200) {
        setButtonStates(prev => ({ ...prev, [userId]: { loading: false, text: 'PENDING', disabled: true } }));
      } else {
        console.log("Error while connecting.");
        setButtonStates(prev => ({ ...prev, [userId]: { loading: false, text: 'CONNECT', disabled: false } }));
      }
    } catch (e) {
      console.log("Error while connection", e);
      setButtonStates(prev => ({ ...prev, [userId]: { loading: false, text: 'CONNECT', disabled: false } }));
    }
  };

  const acceptConnectionRequest = async (e) => {
    const btn = e.currentTarget;
    const userId = btn.id;
    
    setButtonStates(prev => ({ ...prev, [userId]: { loading: true, text: 'Accepting...' } }));
    
    try {
      const res = await acceptConnect({ id: userId });
      if (res.status === 200) {
        setButtonStates(prev => ({ ...prev, [userId]: { loading: false, text: 'CONNECTED', disabled: true } }));
      } else {
        console.log("Error while connecting.");
        setButtonStates(prev => ({ ...prev, [userId]: { loading: false, text: 'ACCEPT', disabled: false } }));
      }
    } catch (e) {
      console.log("Error while connection", e);
      setButtonStates(prev => ({ ...prev, [userId]: { loading: false, text: 'ACCEPT', disabled: false } }));
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 py-16 md:py-24 px-8 md:px-16 min-h-screen">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-royal-blue/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gold/3 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Enhanced Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="card-glass p-10 flex flex-col items-center space-y-6 max-w-sm mx-4 text-center shadow-2xl">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-gold animate-spin" />
              <div className="absolute inset-0 w-12 h-12 rounded-full bg-gold/20 animate-ping"></div>
            </div>
            <div className="space-y-2">
              <p className="text-white font-body text-lg font-semibold">Finding Amazing Students</p>
              <p className="text-gray-400 font-body text-sm">Matching you with the perfect study buddies...</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div className="bg-gold h-1 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Section Header */}
      <div className="text-center mb-16 md:mb-20 relative z-10">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="p-3 bg-gold/20 rounded-full border border-gold/30">
            <Users className="w-8 h-8 text-gold" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-transparent bg-yellow-400 bg-clip-text">
            Suggested Students
          </h2>
        </div>
        <p className="text-gray-400 text-xl font-body max-w-3xl mx-auto leading-relaxed">
          Connect with fellow students who share your interests and academic goals
        </p>
      </div>

      {/* Enhanced Navigation Buttons */}
      <button 
        onClick={() => onScrollClick("left")} 
        onDoubleClick={() => onScrollDoubleClick("left")} 
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 btn-icon-primary hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl group"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform duration-200" />
      </button>
      
      <button 
        onClick={() => onScrollClick("right")} 
        onDoubleClick={() => onScrollDoubleClick("right")} 
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 btn-icon-primary hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl group"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform duration-200" />
      </button>

      {/* Enhanced Student Cards Container */}
      <div 
        ref={scrollRef} 
        className="flex space-x-8 overflow-x-hidden px-4 md:px-8 scroll-smooth relative z-10 pb-8"
      >
        {friends.map((item, index) => {
          const buttonState = buttonStates[item.user.id] || {};
          
          return (
            <div 
              key={index} 
              className="card-glass min-w-[300px] md:min-w-[340px] p-8 flex flex-col items-center text-center group hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-fade-in shadow-xl hover:shadow-2xl relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-yellow-400"></div>
              
              {/* Enhanced Avatar Section */}
              <div 
                className="mb-6 group/avatar block cursor-pointer"
                onClick={() => console.log(`Navigate to profile: ${item.user.username}`)}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl scale-110 opacity-0 group-hover/avatar:opacity-100 transition-all duration-500"></div>
                  <img 
                    src={item.user.avatar} 
                    alt={item.user.fullName} 
                    className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-3 border-gold/50 group-hover/avatar:border-gold transition-all duration-300 group-hover/avatar:scale-110 object-cover shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-gold/30 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300"></div>
                  
                  
                </div>
              </div>

              {/* Enhanced User Info */}
              <div className="mb-8 space-y-3 flex-grow">
                <h3 className="text-xl md:text-2xl font-display font-bold text-white group-hover:text-gold transition-colors duration-300">
                  {item.user.fullName}
                </h3>
                <p className="text-gray-400 font-body text-base md:text-lg">
                  {item.university}
                </p>
                
                {/* Additional Info */}
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mt-4">
                  <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    New Student
                  </span>
                </div>
              </div>

              {/* Enhanced Action Button */}
              <div className="w-full space-y-3">
                {item.status === "NEVER" ? (
                  <button 
                    id={item.user.id} 
                    onClick={sendConnectionRequest}
                    disabled={buttonState.loading}
                    className="btn-premium w-full flex items-center justify-center space-x-3 py-4 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group/btn"
                  >
                    {buttonState.loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-semibold">{buttonState.text}</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                        <span className="font-semibold">CONNECT</span>
                      </>
                    )}
                  </button>
                ) : item.status === "ACCEPT" ? (
                  <button 
                    id={item.user.id} 
                    onClick={acceptConnectionRequest}
                    disabled={buttonState.loading}
                    className="btn-secondary w-full flex items-center justify-center space-x-3 py-4 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group/btn"
                  >
                    {buttonState.loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-semibold">{buttonState.text}</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                        <span className="font-semibold">ACCEPT</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button 
                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-600 text-gray-400 font-body font-semibold cursor-not-allowed flex items-center justify-center space-x-3 bg-gray-800/30"
                    disabled
                  >
                    {item.status === "PENDING" ? (
                      <>
                        <Clock className="w-5 h-5 animate-pulse" />
                        <span>PENDING</span>
                      </>
                    ) : item.status === "CONNECTED" ? (
                      <>
                        <UserCheck className="w-5 h-5" />
                        <span>CONNECTED</span>
                      </>
                    ) : (
                      <span>{item.status}</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Empty State */}
      {!loading && friends.length === 0 && (
        <div className="text-center py-24 relative z-10">
          <div className="card-glass max-w-lg mx-auto p-12 space-y-6">
            <div className="p-4 bg-gold/20 rounded-full w-fit mx-auto border border-gold/30">
              <Users className="w-16 h-16 text-gold mx-auto" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
                No Suggestions Available
              </h3>
              <p className="text-gray-400 font-body text-lg leading-relaxed max-w-md mx-auto">
                Complete your profile to get personalized student recommendations based on your interests and goals
              </p>
            </div>
            <button className="btn-premium px-8 py-3 mx-auto hover:scale-105 transition-all duration-300">
              Complete Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreindSuggestion;
