import React from "react";

import { Desktop_Layout } from "./Desktop/Desktop_Layout";
import { Mobile_Layout } from "./Mobile/Mobile_Layout";

export function TopPage(){
    return(
        <div className="top_page_wrapper">
            <Desktop_Layout />
            <Mobile_Layout/>
        </div>
    )
}