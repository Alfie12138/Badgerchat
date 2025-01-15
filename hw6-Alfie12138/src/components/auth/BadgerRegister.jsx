import React,{ useState } from 'react';
import {Card,Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function BadgerRegister() {

    // TODO Create the register component.
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setrepeatPassword] = useState('');
    const navigate = useNavigate();

    function handleRegister(e) {
        e?.preventDefault();

        //To check If the user does not enter a username or pin
        if (!username || !password) {
            alert("You must provide both a username and password!");
            return;
        }

        //To check if the pin or repeated pin is not exactly 7-digits
        if (!/^\d{7}$/.test(password) || !/^\d{7}$/.test(repeatPassword)) {
            alert("Your pin must be a 7-digit number!");
            return;
        }

        //To check if the pins match each other
        if (password !== repeatPassword) {
            alert("Your pins do not match!");
            return;
        }

        fetch('https://cs571api.cs.wisc.edu/rest/f24/hw6/register', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username:username,
                pin:password 
            }),
             
        })
        .then(res => {
            if(res.status===200){
                alert("Registration was successful!");
                navigate('/');
            }else{
                alert("That username has already been taken!");
            }
        });
    }

    return <>
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="Reg_username" style={{ display: 'block' }}>
                    Username:
                </label>
                <input 
                    id="Reg_username"
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="rounded-input"
                />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="Reg_password" style={{ display: 'block' }}>
                    Password:
                </label>
                <input 
                    id="Reg_password"
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="rounded-input"
                />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="Reg_Repeatpassword" style={{ display: 'block' }}>
                    Repeat Password:
                </label>
                <input 
                    id="Reg_Repeatpassword"
                    type="password" 
                    value={repeatPassword} 
                    onChange={(e) => setrepeatPassword(e.target.value)} 
                    className="rounded-input"
                />
            </div>
            <Button type="submit">Register</Button>
        </form>
    </>
}
