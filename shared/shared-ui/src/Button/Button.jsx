import React from "react";
import './Button.css'

/**
 * A customizable button component.
 * @param {object} props - The component's props.
 * @param {string} props.text - The text to display inside the button.
 * @param {'primary' | ''} props.button_type - The type of button, which determines its styling.
 */
export function Button({text, button_type}){

    let buttonClass ='';

    if(button_type === 'primary'){
        buttonClass = 'primary_button'
    }else{
        buttonClass = ''
    }

    return(
        <>
            <button className={buttonClass}>{text}</button>
        </>
    )
}