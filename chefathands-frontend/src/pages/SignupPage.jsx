import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        // client-side validation: password minimum length
        if (!password || password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setError("");
        try {
            await signup(username, email, password);

            alert("Account created!");
            navigate("/");
        } catch (err) {
            const status = err?.response?.status;
            if (status === 409) {
                alert("Username already exists");
            } else if (status === 400) {
                alert("Invalid input");
            } else {
                alert("Server error — please try again later");
                console.error(err);
            }
        }
    };

    return (
        <div className="container">
            <div className="card" style={{maxWidth:480, margin:'24px auto'}}>
                <h1 className="center">Sign Up</h1>

                <div style={{marginBottom:10}}>
                    <input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div style={{marginBottom:10}}>
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div style={{marginBottom:14}}>
                    { /* show real-time validation */ }
                    {(() => {
                        const tooShort = password && password.length > 0 && password.length < 6;
                        return (
                            <input
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                                minLength={6}
                                style={tooShort ? { borderColor: 'crimson' } : undefined}
                            />
                        );
                    })()}

                    {password && password.length > 0 && password.length < 6 && (
                        <div style={{color:'crimson', marginTop:8}}>Password must be at least 6 characters.</div>
                    )}

                    {error && <div style={{color:'crimson', marginTop:8}}>{error}</div>}
                </div>

                <div className="row" style={{justifyContent:'center'}}>
                    <button className="btn" onClick={handleSignup} disabled={password.length < 6}>Create Account</button>
                </div>
            </div>
        </div>
    );

}