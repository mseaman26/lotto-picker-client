import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/authContext';


const Login = () => {
    const navigate = useNavigate();
    // Get user and setUser from AuthContext
    const { user, setAccessToken, setRefreshToken} = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await fetch('api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: email, password })
            })
            if (!res.ok) {
                const errors = await res.json();
                return setErrors(errors);
            }
            const data = await res.json();
            const newAccessToken = data.access;
            const newRefreshToken = data.refresh;
            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);
        }catch(err){
            console.error(err);
        }finally{
            // Redirect to home page
            setLoading(false);
        }
        
       
    };

    // if user is logged in, redirect to home page
    useEffect(() => {
        if (user) {
            navigate('/');
        }else{
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        setErrors({});
    }, [email, password]);

    if (loading) {
        // Optionally show a spinner or placeholder while loading
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h1>Login</h1>
            {errors.detail && <p style={{color: 'red'}}>{errors.detail}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                {errors.username && <p style={{color: 'red'}}>{errors.username}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />
                {errors.password && <p style={{color: 'red'}}>{errors.password}</p>}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
                <button
                    type="submit"
                    style={styles.button}
                    onMouseEnter={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                    onMouseLeave={e => e.target.style.backgroundColor = styles.button.backgroundColor}
                >
                    Login
                </button>
            </form>
            <div style={styles.linkContainer}>
                <p>Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link></p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    },
    input: {
        marginBottom: '15px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ddd'
    },
    button: {
        padding: '10px',
        fontSize: '16px',
        color: 'white',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    buttonHover: {
        backgroundColor: '#0056b3'
    },
    linkContainer: {
        marginTop: '10px',
        textAlign: 'center',
        fontSize: '14px'
    },
    link: {
        color: '#007bff',
        textDecoration: 'none'
    }
};

export default Login;
