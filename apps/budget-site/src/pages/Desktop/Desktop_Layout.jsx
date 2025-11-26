import React, {useState} from "react"
import Dashboard_desktop from "./Dashboard_desktop"
import Budget_desktop from "./Budget_desktop"
import Trans_desktop from "./Trans_desktop"
import Debt_desktop from "./Debt_desktop"
import Goals_desktop from "./Goals_desktop"
import Settings_desktop from "./Settings_desktop"
import Cat_desktop from "./Cat_desktop"


export function Desktop_Layout(){

    const [selected, setSelected]=useState("dashboard")

    const selectionClicked = (number)=>{
        setSelected(number)
    }


    return(
        <div className="budget_desktop_layout">


            <div className="budget_left_panel">
                <div 
                    className={selected === "dashboard" ? "budget_desktop_hovered" : ""}
                    onClick={()=>selectionClicked("dashboard")}
                    >
                        <img src="./dashboard.png"/>
                        <h6>Dashboard</h6>
                </div>
                <div 
                    className={selected === "budget" ? "budget_desktop_hovered" : ""}
                    onClick={()=>selectionClicked("budget")}
                    >
                        <img src="./budget.png"/>
                        <h6>Budget</h6>
                </div>
                <div 
                    className={selected === "trans" ? "budget_desktop_hovered" : ""}
                    onClick={()=>selectionClicked("trans")}
                    >
                        <img src="./transaction.png"/>
                        <h6>Transactions</h6>
                </div>
                <div 
                    className={selected === "debt" ? "budget_desktop_hovered" : ""}
                    onClick={()=>selectionClicked("debt")}
                    >
                        <img src="./debt.png"/>
                        <h6>Debt</h6>
                </div>
                <div 
                    className={selected === "goals" ? "budget_desktop_hovered" : ""}
                    onClick={()=>selectionClicked("goals")}
                    >
                        <img src="./goals.png"/>
                        <h6>Goals</h6>
                </div>
                <div 
                    className={selected === "cat" ? "budget_desktop_hovered" : ""}
                    onClick={()=>selectionClicked("cat")}
                    >
                        <img src="./Cat.png"/>
                        <h6>Budget Catagories</h6>
                </div>               
                <div 
                    className={selected === "settings" ? "budget_desktop_hovered" : ""}
                    onClick={()=>selectionClicked("settings")}
                    >
                        <img src="./settings.png"/>
                        <h6>Settings</h6>
                </div>
            </div>


            <div className="budget_right_panel">
                <Dashboard_desktop selected={selected} />
                <Budget_desktop selected={selected}/>
                <Trans_desktop selected={selected}/>
                <Debt_desktop selected={selected}/>
                <Goals_desktop selected={selected}/>
                <Cat_desktop selected={selected}/>
                <Settings_desktop selected={selected}/>
            </div>
        </div>
    )
}