// build a login with google component using firebase auth from ../firebase.js
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


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
            navigate("/home");
        } catch {
            setError("Failed to log in");
        }
        setLoading(false);
    };

    return (
        <div className="login">
            <div className="login__container">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png"
                    alt=""
                />
                <div className="login__text">

                    <h1>Sign in to PfinTracker</h1>
                </div>

                <button type="submit" onClick={handleLogin}>
                    Sign In With Google
                </button>
                <div className="login__signup">
                    <h4>Don't have an account?</h4>
                    {/* <button onClick={handleSignup}>Sign Up</button> */}
                </div>
            </div>
        </div>
    );
}

export default Login;

