import React, { useState } from "react";
import { useAuth } from "@wade/auth";
import { Button } from "../Button/Button"
import { useNavigate } from "react-router-dom";



export function Desktop (){

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    

    const loginFunc = () => {
        const parts = window.location.hostname.split('.').slice(-2);
        window.location.href = `${window.location.protocol}//${parts.join('.')}/login`;
    };

    const logourFunc=()=>{
        logout()
        navigate('/')
    }

    return(
        <div className="desktop_header_div">
            <div className="desktop_header_links">

            </div>
            {user ? (
                <Button text={'Logout'} button_type={'close'} func={logourFunc}/>
            ) : (
                <Button text={'Login'} button_type={'primary'} func={loginFunc}/>
            )}

        </div>
    )
}