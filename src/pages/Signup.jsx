import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/authContext';



const Signup = () => {
    const { user, setAccessToken, setRefreshToken } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await fetch('/api/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, first_name: '', last_name: ''})
            });
            if (!res.ok) {
                const errors = await res.json();    
                setErrors(errors);
                console.error('signup errors', errors);
                throw new Error('Error signing up: ', errors);
                
            }
            const data = await res.json();
            const tokenRes = await fetch('/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: email, password })
            })
            if (!tokenRes.ok) {
                setErrors(tokenRes);
                throw new Error('Error getting token. Please try again.');
            }
            const tokenData = await tokenRes.json();
            const newAccessToken = tokenData.access;
            const newRefreshToken = tokenData.refresh;
            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);
        }catch(err){
            console.error(err);
        }
    };

    useEffect(() => {
        if (user) {
            navigate('/');
        }else{
            setLoading(false);
        }
    }, [user]);


    useEffect(() => {
        setErrors({});
    }, [username, email, password]);

    return (
        <div style={styles.container}>
            <h1>Sign Up</h1>
            {errors.detail && <p style={{color: 'red'}}>{errors.detail}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                {errors.username && <p style={{color: 'red'}}>{errors.username}</p>}
                <input
                    type="text"
                    placeholder="Username (display name)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />
                {errors.email && <p style={{color: 'red'}}>{errors.email}</p>}
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
                    Sign Up
                </button>
            </form>
            <div style={styles.linkContainer}>
                <p>Already have an account? <Link to="/login" style={styles.link}>Log In</Link></p>
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

export default Signup;
