import React from "react";
import './Input.css'


/**
 * A customizable input.
 * @param {string} labelText The text content for the input's label.
 * @param {string} type The type attribute for the input element (e.g., "text", "password", "email").
 * @param {string} id A unique identifier for the input and label association.
 * @param {string} value the current value of the item
 * @param {string} change function to change item
 */
export function Input({labelText, type, id, value, change}){
    return(
        <div className="std_label_div">
            <label  htmlFor={id}>{labelText}</label>
            <input  type={type} id={id} name={id} value={value} onChange={change}/>
        
        </div>
    )
}