import React, {useState, useEffect} from "react"
import { Button, Input } from "@wade/ui"
import { useAuth } from "@wade/auth";
import { useNavigate } from "react-router-dom";




export function Register(){

    const [firstName, setFirstName] = useState('')
    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [confirmPass, setConfirmPass]=useState('')
    const [message, setMessage]=useState('')
    const navigate = useNavigate();
    
    const {addUser, login,user} = useAuth()

    const startingRole = import.meta.env.VITE_PENDING_USER


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPass) {
            setMessage("Passwords do not match. Please correct and try again.");
            return;
        }

        if(!firstName){
            setMessage("Please enter a first name")
            return;
        }

        if(!email){
            setMessage("Please enter an email")
            return;
        }

        if(!password){
            setMessage("Please enter a password")
            return;
        }

        if(!confirmPass){
            setMessage("Please confirm your password")
            return;
        }
        setMessage(''); // Clear previous messages

        try {
            const newUser = {
                first_name: firstName,
                email: email,
                password: password,
                status: 'active',
                role: startingRole
                // Depending on your Directus setup, you may need to provide a role ID here
                // for new users, e.g., role: 'your-public-role-uuid'
            };
            await addUser(newUser);
            await login(email, password);
            setMessage("Registration successful! You are now logged in.");
            setFirstName('');
            setEmail('');
            setPassword('');
            setConfirmPass('');
        } catch (err) {
            setMessage('Registration failed. The email might already be in use or login failed.');
            console.error("Registration error:", err);
        }
    };
    
    useEffect(() => {
        // Only check if the user has started typing the confirmation
        if (confirmPass && password !== confirmPass) {
            setMessage("Passwords do not match")
        } else {
            setMessage("") // Clear message if they match or confirm is empty
        }
    }, [password, confirmPass])

    useEffect(() => {
        if(user){
            navigate('/pending')
        }
    }, [user])


    return(
        <div className="register_wrapper">
            <h2>Register here</h2>
            <Input 
                labelText={'First Name: '} 
                type={'text'} 
                id={'first_name'} 
                value={firstName} 
                change={(e) => setFirstName(e.target.value)}
            />

            <Input 
                labelText={'Email: '} 
                type={'email'} 
                id={'email'} 
                value={email} 
                change={(e)=>setEmail(e.target.value)}
            />

            <Input
                labelText={'Password: '}
                type={'password'}
                id={'password'}
                value={password}
                change={(e)=>setPassword(e.target.value)}
            />
            
            <Input
                labelText={'Confirm Password'}
                type={'password'}
                id={'password2'}
                value={confirmPass}
                change={(e)=>setConfirmPass(e.target.value)}
            />
            
            <p className="reg_message">{message}</p>

            <Button text={'Register'} button_type={'primary'} func={handleSubmit}/>
        </div>
    )

}
