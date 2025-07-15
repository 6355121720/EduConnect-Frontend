import React, { useEffect, useRef, useState } from 'react'
// import friends from '../../../constants/friends'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getSuggestion } from '../../../api/userApi'
import { NavLink } from 'react-router-dom'
import { acceptConnect, sendConnect } from '../../../api/connectAPI'


const FreindSuggestion = () => {

  
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState([]);

  useEffect(() => {

    const fun = async () => {
      setLoading(true);
      try{
        const res = await getSuggestion();
        if (res.status === 200){
          console.log(res.data);
          setFriends(res.data);
        }
        else{
          console.log("Freind suggestion error.")
        }
      }
      catch(e) {
        console.log("Freind suggestion error.", e)
      }
      finally{
        setLoading(false);
      }
    }

    fun();

  }, [])


  const scrollRef = useRef()

  let onScrollClick = (direction) => {
    scrollRef.current.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: 'smooth'
    })
  };

  let onScrollDoubleClick = (direction) => {
    let width = scrollRef.current.scrollWidth;
    scrollRef.current.scrollTo({
      left: direction == "left" ? 0 : width,
      behavior: 'smooth'
    });
  }

  let sendConnectionRequest = async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.innerHTML = "Loading..."
    try{
      const res = await sendConnect({id : btn.id});
      if (res.status === 200){
        btn.innerHTML = "PENDING";
      }
      else{
        console.log("Error while connecting.");
        btn.innerHTML = "CONNECT";
      }
    }
    catch(e){
      console.log("Error while connection", e);
      btn.innerHTML = "CONNECT";
    }
    finally{
      btn.disabled = false;
    }
  }

  const acceptConncetionRequest = async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.innerHTML = "Loading..."
    try{
      const res = await acceptConnect({id : btn.id});
      if (res.status === 200){
        btn.innerHTML = "CONNECTED";
      }
      else{
        console.log("Error while connecting.");
        btn.innerHTML = "ACCEPT";
      }
    }
    catch(e){
      console.log("Error while connection", e);
      btn.innerHTML = "ACCEPT";
    }
    finally{
      btn.disabled = false;
    }
  }


  return (
    <> 
      <div className="bg-gray-800 py-12 md:py-20 px-8 md:px-16 relative">
        <div className = {`${loading ? "" : "hidden"} z-100 min-w-[100vw] min-h-[100vh] fixed flex justify-center items-center`}>Loading</div>
        <div className=" pb-16 md:pb-24 text-center text-2xl md:text-4xl lg:text-5xl font-semibold text-purple-500">Suggsted Students</div>
        <button onClick={() => onScrollClick("left")} onDoubleClick={() => onScrollDoubleClick("left")} className="absolute left-2 md:left-4 scale-150 md:scale-200 top-1/2 -translate-y-1/2"><ChevronLeft /></button>
        <button onClick={() => onScrollClick("right")} onDoubleClick={() => onScrollDoubleClick("right")} className="absolute right-2 md:right-4 scale-150 md:scale-200 top-1/2 -translate-y-1/2"><ChevronRight /></button>
        <div ref={scrollRef} className = "px-4 md:px-8 flex space-x-5 overflow-x-hidden">
          {
            friends.map((item, index) => (
                <div key={index} className="bg-gray-900 rounded-xl border border-gray-400 flex-col items-center flex gap-3 md:gap-5 sm:text-sm md:text-[1rem] text-center p-5 md:p-7 min-w-32 md:min-w-48 lg:min-w-60">
                  <NavLink to={"/profile?username=" + item.user.username} className = "flex items-center justify-center">
                    <img src={item.user.avatar} alt={item.user.fullName} className="cursor-pointer rounded-full border-gray-500 border max-w-20" />
                  </NavLink>
                  <div className="">{item.user.fullName}</div>
                  <div className="text-gray-300">{item.university}</div>
                  {item.status === "NEVER" ? 
                  <>
                    <button id={item.user.id} onClick = {sendConnectionRequest} className = "border border-gray-300 rounded-xl p-2 md:p-3">CONNECT</button>
                  </>
                  :
                  (item.status === "ACCEPT" ? 
                    <>
                      <button id={item.user.id} onClick = {acceptConncetionRequest} className = "border border-gray-300 rounded-xl p-2 md:p-3">ACCEPT</button>
                    </>
                    :
                    <>
                      <button id={item.user.id} className = "border border-gray-300 rounded-xl p-2 md:p-3 cursor-not-allowed">{item.status}</button>
                    </>
                  )}
                </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default FreindSuggestion