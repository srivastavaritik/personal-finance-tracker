import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";
import GoogleSignInButton from "../components/GoogleSignInButton/GoogleSignInButton";
import { Grid } from "react-loader-spinner";

function Login({ setIsAuth }) {
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="login__container">
                <div className="login__text">
                    <h1>Sign in to Personal Finance Tracker</h1>
                </div>
                {loading ? (
                    <div className='loaderCont'>
                        <div className='loader'>
                            <Grid
                                height="80"
                                width="80"
                                color="#4fa94d"
                                ariaLabel="grid-loading"
                                radius="12.5"
                                wrapperStyle={{}}
                                wrapperClass=""
                                visible={true}
                            />
                        </div>
                    </div> // Render a loader component while logging in
                ) : (
                    <GoogleSignInButton type="submit" onClick={handleLogin} />
                )}
                {error && <div className="login__error">{error}</div>}
            </div>
        </div>
    );
}

export default Login;
