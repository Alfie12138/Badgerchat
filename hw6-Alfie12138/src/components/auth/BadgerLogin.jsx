import React,{ createRef,useContext }from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext'; 

export default function BadgerLogin() {

    // TODO Create the login component.
    const usernameRef = createRef();
    const pinRef = createRef();
    const navigate = useNavigate();
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    function handleLogin(e) {
        e?.preventDefault(); 

        const username = usernameRef.current.value;
        const pin = pinRef.current.value;

        //To check If the user does not enter a username or pin
        if (!username || !pin) {
            alert("You must provide both a username and pin!");
            return;
        }

        //To check If the pin is not exactly 7-digits
        if (!/^\d{7}$/.test(pin)) {
            alert("Your pin must be a 7-digit number!");
            return;
        }

        // Send our request
        fetch('https://cs571api.cs.wisc.edu/rest/f24/hw6/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                pin: pin
            }),
        }).then(res=>{
            if(res.status===200){
                alert("Login was successful!");
                setLoginStatus(true);
                sessionStorage.setItem("isLoggedIn", true);
                navigate('/');         
            }else{
                alert("Incorrect username or pin!");
            }
        });
    }

    return <>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="Log_userName" style={{ display: 'block' }}>
                    Username:
                </label>
                <input
                    id="Log_userName"
                    type="text"
                    ref={usernameRef} 
                    className="rounded-input"
                />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="Log_password" style={{ display: 'block' }}>
                    Password:
                </label>
                <input
                    id="Log_password"
                    type="password" // 隐藏PIN
                    ref={pinRef} // Special bond together
                    className="rounded-input"
                />
            </div>
            <Button type="submit">Login</Button>
        </form>
    </>
}
