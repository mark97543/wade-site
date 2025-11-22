import React, { useState } from "react";
import { useNavigate } from "react-router-dom";



export function Desktop ({lastItem ,listItem = []}){

    const navigate = useNavigate();
    


    return(
        <div className="desktop_header_div">
            <div className="desktop_header_links">
                {listItem.map((tag) => (
                    <a key={tag.id} className="active" href={tag.link}>{tag.label}</a>
                ))}
            </div>

            {lastItem}

        </div>
    )
}