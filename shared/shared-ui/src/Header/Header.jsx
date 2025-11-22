import React from "react";
import './Header.css'
import { Desktop } from "./Desktop";
import { Button } from "../Button/Button"
import { useAuth } from "@wade/auth";
import { useNavigate } from "react-router-dom";
import { MobileHeader } from "./Mobile";

export function Header (){
    const listItems = [];
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

    
    let lastItem=""
    if (user) {
        lastItem=<Button text={'Logout'} button_type={'close'} func={logourFunc}/>
        listItems.push({id: 1, label: "Budget", link: ""})
    }else{
        lastItem=<Button text={'Login'} button_type={'primary'} func={loginFunc}/>
    }
        

    return(
        <div className='header_background'>
            <div className='header-logo-div'>
                <a href="/" className='header_logo'>M+S</a>
            </div>
            
            <Desktop lastItem={lastItem} listItem={listItems}/>

            <MobileHeader lastItem={lastItem} listItems={listItems}/>

        </div>
    )
}