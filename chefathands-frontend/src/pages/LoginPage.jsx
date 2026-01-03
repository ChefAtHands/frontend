import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginApi } from "../api/auth";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await loginApi(username, password);

            localStorage.setItem("userId", String(res.data.userId));
            localStorage.setItem("username", res.data.username);

            navigate("/dashboard");

        } catch (err) {
            const status = err?.response?.status;
            if (status === 401) {
                alert("Invalid username or password");
            } else {
                alert("Server error — please try again later");
                console.error(err);
            }
        }
    };

    return (
        <div className="container">
            <div className="card" style={{maxWidth:420, margin:'24px auto'}}>
                <h1 className="center">Login</h1>

                <div style={{marginBottom:10}}>
                    <input 
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div style={{marginBottom:14}}>
                    <input 
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="row" style={{justifyContent:'center'}}>
                    <button className="btn" onClick={handleLogin}>Login</button>
                </div>

                <p className="center" style={{marginTop:12}}>
                    No account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
}