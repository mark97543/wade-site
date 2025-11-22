import React from "react";
import './Button.css'

/**
 * A customizable button component.
 * @param {object} props - The component's props.
 * @param {string} props.text - The text to display inside the button.
 * @param {'primary' | ''} props.button_type - The type of button, which determines its styling.
 * @param {function} props.function - The function to be called when the button is clicked.
 */
export function Button({text, button_type, func} ){

    let buttonClass ='';

    if(button_type === 'primary'){
        buttonClass = 'primary_button'
    }else if(button_type === 'close'){
        buttonClass = 'close_button'
    }else{
        buttonClass = ''
    }

    return(
        <>
            <button className={buttonClass} onClick={func}>{text}</button>
        </>
    )
}