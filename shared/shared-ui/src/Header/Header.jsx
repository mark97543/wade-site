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

    const rootDomain = import.meta.env.VITE_ROOT_DOMAIN
    const loginUrl = `${rootDomain}/login`
    const budgetURL=`${window.location.protocol}//${import.meta.env.VITE_BUDGET_DOMAIN}`

    console.log(budgetURL)

    const loginFunc = () => {
        window.location.href = `${window.location.protocol}//${loginUrl}`;
        
    };

    const logourFunc=()=>{
        logout()

        window.location.href = `${window.location.protocol}//${rootDomain}/`;
    }

    
    let lastItem=""
    if (user) {
        lastItem=<Button text={'Logout'} button_type={'close'} func={logourFunc}/>
        listItems.push({id: 1, label: "Budget", link: budgetURL})
    }else{
        lastItem=<Button text={'Login'} button_type={'primary'} func={loginFunc}/>
    }
        

    return(
        <div className='header_background'>
            <div className='header-logo-div'>
                <a href={`${window.location.protocol}//${rootDomain}/`} className='header_logo'>M+S</a>
            </div>
            
            <Desktop lastItem={lastItem} listItem={listItems}/>

            <MobileHeader lastItem={lastItem} listItems={listItems}/>

        </div>
    )
}