import { useSelector } from "react-redux"
import FreindSuggestion from "./FreindSuggestion";


const PrivateHome = () => {

  let user = useSelector(store => store.auth.user);

  return (
    <>
      <div>
        <div className="bg-gradient-to-t from-gray-900 to-gray-800 py-20 md:py-32 px-32 md:px-52 font-bold text-center">
          <div className="text-3xl md:text-4xl lg:text-5xl">
            Welcome back, <span className = 'text-purple-600'>{user?.fullName}</span>
          </div>
        </div>
        <FreindSuggestion />
      </div>
    </>
  )
}

export default PrivateHome