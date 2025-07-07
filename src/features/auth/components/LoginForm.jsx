// src/features/auth/components/LoginForm.jsx
import React, { useState } from 'react';
import { isValidEmail, isValidPassword } from '../../../utils/Validator';
import { login } from '../../../api/authApi';
import { useDispatch } from 'react-redux';
import {login as loginSlice} from '../../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {


  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    setLoading(true)

    if (!formData.emailOrUsername || !formData.password) {
      setErrorMessage("Fill all the fields.");
      setLoading(false);
      return; // 🛑 stop execution
    }

    if (!isValidPassword(formData.password)) {
      setErrorMessage("Password should be of length 8 to 16 and must contain at least one alphabet, number and special character.");
      setLoading(false);
      return; // 🛑 stop execution
    }

    let username;
    let email;
    if (isValidEmail(formData.emailOrUsername)) {
      email = formData.emailOrUsername;
    } else {
      username = formData.emailOrUsername;
    }


    try {
      const res = await login({ email, username, password: formData.password })

      if (res.status === 200) {
        console.log(res.data);
        localStorage.setItem("accessToken", res.data.accessToken);
        dispatch(loginSlice(res.data.user));
        navigate('/');
        return;
      } else {
        setErrorMessage("Invalid login credentials.");
        setFormData({ emailOrUsername: '', password: '' });
      }
    } catch (err) {
      console.error("Login error:", err);
      console.log("hey")
      setErrorMessage("Something went wrong. Please try again.");
      setFormData({ emailOrUsername: '', password: '' });
    } finally{
      setLoading(false);
      console.log(localStorage.getItem("accessToken"));
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={loading} className="space-y-4 ">
        <input
          type="text"
          name="emailOrUsername"
          placeholder="Email or Username"
          value={formData.emailOrUsername}
          onChange={handleChange}
          className="w-full p-2 border rounded placeholder:text-gray-400"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
        <p
          id="form-message"
          className={`text-red-500 text-sm transition-opacity duration-200 ${
            errorMessage ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {errorMessage}
        </p>
      </fieldset>
    </form>
  );
};

export default LoginForm;