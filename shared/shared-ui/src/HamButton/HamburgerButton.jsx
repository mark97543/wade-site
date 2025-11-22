import React, {useState} from "react";
import './HamburgerButton.css'

export const Hamburger_Button = ({lastItem, listItems}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const hamFunction = () => {
        setIsOpen(!isOpen);
    }

    return(
        <div className="ham_menu">
            <div className={`ham_container ${isOpen ? 'change' : ''}`} onClick={hamFunction}>
                <div className='bar1'></div>
                <div className='bar2'></div>
                <div className='bar3'></div>
            </div>
            
            <nav className={`ham_dropdown ${isOpen ? 'change' : ''}`} onClick={hamFunction}>

                {listItems.map((tag) => (
                    <a key={tag.id} className="active" href={tag.link}>{tag.label}</a>
                ))}

                <div className="menu_divider"></div>
                {lastItem}
            </nav>

        </div>
    )

}