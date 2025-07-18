// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { saveQuestion } from "../../../api/qnaApi";


// const PostQuestion = () => {

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     tags: ""
//   })
//   const [errorMessage, setErrorMessage] = useState("");
//   const currentUser = useSelector(store => store.auth.user);
//   const [loading, setLoading] = useState(false);

//   const onChange = (e) => {
//     setErrorMessage("");
//     setForm(prev => ({...prev, [e.target.name]: e.target.value}))
//   }

//   const postHandler = async (e) => {
//     e.preventDefault();
//     const regex = /^(?=.{1,25}$)(?:[a-zA-Z0-9]{1,10})(?: (?:[a-zA-Z0-9]{1,10})){0,4}$/;
//     if (!form.title || !form.description || !regex.test(form.tags)){
//       setErrorMessage("wrong input fields.");
//       return;
//     }
//     if (form.title.length < 8){
//       setErrorMessage("title must be atleast 8 characters.");
//       return;
//     }
//     if (form.description.length < 20){
//       setErrorMessage("description must be atleast 20 characters.");
//       return;
//     }

//     setLoading(true);
//     try{
//       console.log({
//         title: form.title,
//         description: form.description,
//         tags: form.tags,
//         authorUsername: currentUser.username
//       });
//       const res = await saveQuestion({
//         title: form.title,
//         description: form.description,
//         tags: form.tags,
//         authorUsername: currentUser.username
//       });
//       if (res.status === 200){
//         setForm({
//           title: "",
//           description: "",
//           tags: ""
//         });
//       }
//       else{
//         setErrorMessage(res.statusText + " from Backend.");
//       }
//     }
//     catch(e){
//       setErrorMessage("Something wrong happened.");
//       console.log("error while saving question.", e);
//     }
//     finally{
//       setLoading(false);
//     }

//   }


//   return (
//     <>
//       <div className="p-6">
//         <form className = " space-y-2" onSubmit = {postHandler}>
//           <label htmlFor="title" >Title :</label>
//           <br/>
//           <input className="border border-white" onChange = {onChange} value={form.title} type="text" name="title" id="title" />
//           <br/>
//           <label htmlFor="description" >Description :</label>
//           <br/>
//           <textarea className="border border-white" onChange={onChange}  value={form.description} id="description" name="description" />
//           <br/>
//           <label htmlFor="tag" >{'Tags : eg.(tag1 tag2 tag3), (must consist maximum 5 tags with maximum upto 25 characters, each with maximum 10 characters.'}</label>
//           <br/>
//           <input className="border border-white" onChange={onChange} type="text" value={form.tags} name="tags" id="tag" />
//           <br/>
//           <div className="">{errorMessage}</div>
//           <input className="border border-white rounded-xl p-1" type="submit" disabled={loading} placeholder="Submit" />
//         </form>
//       </div>
//     </>
//   )

// }


// export default PostQuestion;

import { useState } from "react";
import { useSelector } from "react-redux";
import { saveQuestion } from "../../../api/qnaApi";

const PostQuestion = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const currentUser = useSelector(store => store.auth.user);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setErrorMessage("");
    setForm(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const postHandler = async (e) => {
    e.preventDefault();
    const regex = /^(?=.{1,25}$)(?:[a-zA-Z0-9]{1,10})(?: (?:[a-zA-Z0-9]{1,10})){0,4}$/;
    if (!form.title || !form.description || !regex.test(form.tags)){
      setErrorMessage("wrong input fields.");
      return;
    }
    if (form.title.length < 8){
      setErrorMessage("title must be atleast 8 characters.");
      return;
    }
    if (form.description.length < 20){
      setErrorMessage("description must be atleast 20 characters.");
      return;
    }

    setLoading(true);
    try{
      console.log({
        title: form.title,
        description: form.description,
        tags: form.tags,
        authorUsername: currentUser.username
      });
      const res = await saveQuestion({
        title: form.title,
        description: form.description,
        tags: form.tags,
        authorUsername: currentUser.username
      });
      if (res.status === 200){
        setForm({
          title: "",
          description: "",
          tags: ""
        });
      }
      else{
        setErrorMessage(res.statusText + " from Backend.");
      }
    }
    catch(e){
      setErrorMessage("Something wrong happened.");
      console.log("error while saving question.", e);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-m">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Post a New Question</h1>
      
      <form className="space-y-4 text-black" onSubmit={postHandler}>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={onChange}
            value={form.title}
            type="text"
            name="title"
            id="title"
            placeholder="Enter your question title (min 8 characters)"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
            onChange={onChange}
            value={form.description}
            id="description"
            name="description"
            placeholder="Provide detailed information about your question (min 20 characters)"
          />
        </div>

        <div>
          <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
            Tags *
          </label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={onChange}
            type="text"
            value={form.tags}
            name="tags"
            id="tag"
            placeholder="tag1 tag2 tag3 (max 5 tags, 25 chars total, 10 chars each)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum 5 tags with maximum upto 25 characters, each with maximum 10 characters
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Posting Question..." : "Post Question"}
        </button>
      </form>
    </div>
  );
};

export default PostQuestion;