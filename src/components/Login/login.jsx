import React, { useState } from "react" 
import { useNavigate } from 'react-router-dom'
import '../../css/login.css'
import logo from '../../assets/logoipsum-410.png'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // for navigation after login

    const togglePassword = () => {
        setShowPassword(prev => !prev);
    };

    const isFormValid = username.trim() !== "" && password.trim() !== "";

    // ✅ New function to handle login API
    const handleLogin = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token); // store JWT
                alert("Login successful!");
                navigate("/dashboard"); // redirect after login
            } else {
                alert(data.message || "Invalid username or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Unable to connect to backend.");
        }
    };

    return (
        <>
        <div className="login-page">

            <div className="left-side"></div>

            <div className="right-side">
                <div className="login-form-container">

                    <div className="top-row">
                        <img src={logo} className="logo" alt="logo" />
                        <div className="vertical-line"></div>
                        <h1 className="form-heading">Testing Management System</h1>
                    </div>

                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>

                    <label>Password:</label>
                    <div className="password-container">
                        <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        
                        <span className="toggle-password" onClick={togglePassword}>
                            {showPassword ? <FaEyeSlash/> : <FaEye/>}
                        </span>
                    </div>

                    {/* ✅ Replaced Link with API call */}
                    <button disabled={!isFormValid} onClick={handleLogin}>LOGIN</button>

                </div>
            </div>

        </div>
        </>
    );
}

export default Login
