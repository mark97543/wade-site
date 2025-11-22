import React, {useState, useEffect} from "react"
import { Button, Input } from "@wade/ui"


export function Register(){

    const [firstName, setFirstName] = useState('')
    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [confirmPass, setConfirmPass]=useState('')
    const [message, setMessage]=useState('')
    
    useEffect(() => {
        // Only check if the user has started typing the confirmation
        if (confirmPass && password !== confirmPass) {
            setMessage("Passwords do not match")
        } else {
            setMessage("") // Clear message if they match or confirm is empty
        }
    }, [password, confirmPass])


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
                valueOf={confirmPass}
                change={(e)=>setConfirmPass(e.target.value)}
            />
            
            <p className="reg_message">{message}</p>

            <Button text={'Register'} button_type={'primary'}/>
        </div>
    )

}
