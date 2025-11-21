import React from "react";
import './Header.css'
import { Desktop } from "./Desktop";


export function Header (){
    return(
        <div className='header_background'>
            <div className='header-logo-div'>
                <a  className='header_logo'>M+S</a>
            </div>

            <Desktop/>

        </div>
    )
}