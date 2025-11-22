import React from "react"
import { Button } from "../Button/Button"
import { Hamburger_Button } from "../HamButton/HamburgerButton"

export function MobileHeader({lastItem, listItems}){


    return(
        <div className='header_mobile'>
            <Hamburger_Button lastItem={lastItem} listItems={listItems}/>
        </div>
    )
}