// build a login with google component using firebase auth from ../firebase.js
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";
import GoogleSignInButton from "../components/GoogleSignInButton/GoogleSignInButton";

function Login({ setIsAuth}) {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setError("");
            setLoading(true);
            await signInWithPopup(auth, provider);
            localStorage.setItem("isAuth", true);
            setIsAuth(true);
            navigate("/transactions");
        } catch {
            setError("Failed to log in");
        }
        setLoading(false);
    };

    return (
        <div className="login">
            <div className="login__container">
                <div className="login__text">
                    <h1>Sign in to Personal Finance Tracker</h1>
                </div>
                <GoogleSignInButton type="submit" onClick={handleLogin}/>
            </div>
        </div>
    );
}

export default Login;

