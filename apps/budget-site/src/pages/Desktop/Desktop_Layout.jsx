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
    const [collapsed, setCollapsed] = useState(false)

    const selectionClicked = (number)=>{
        setSelected(number)
    }


    return(
        <div className="budget_desktop_layout">


            <div className={`budget_left_panel ${collapsed ? "collapsed" : ""}`}>
                <div className="collapse_toggle_container">
                    <button 
                        className="collapse_toggle_btn" 
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? <img src="./right.png"/>: <img src="./left.png"/>}
                    </button>
                </div>
                <div 
                    className={`budget_menu_item ${selected === "dashboard" ? "budget_desktop_hovered" : ""}`}
                    onClick={()=>selectionClicked("dashboard")}
                    title="Dashboard"
                    >
                        <img src="./dashboard.png"/>
                        {!collapsed && <h6>Dashboard</h6>}
                </div>
                <div 
                    className={`budget_menu_item ${selected === "budget" ? "budget_desktop_hovered" : ""}`}
                    onClick={()=>selectionClicked("budget")}
                    title="Budget"
                    >
                        <img src="./budget.png"/>
                        {!collapsed && <h6>Budget</h6>}
                </div>
                <div 
                    className={`budget_menu_item ${selected === "trans" ? "budget_desktop_hovered" : ""}`}
                    onClick={()=>selectionClicked("trans")}
                    title="Transactions"
                    >
                        <img src="./transaction.png"/>
                        {!collapsed && <h6>Transactions</h6>}
                </div>
                <div 
                    className={`budget_menu_item ${selected === "debt" ? "budget_desktop_hovered" : ""}`}
                    onClick={()=>selectionClicked("debt")}
                    title="Debt"
                    >
                        <img src="./debt.png"/>
                        {!collapsed && <h6>Debt</h6>}
                </div>
                <div 
                    className={`budget_menu_item ${selected === "goals" ? "budget_desktop_hovered" : ""}`}
                    onClick={()=>selectionClicked("goals")}
                    title="Goals"
                    >
                        <img src="./goals.png"/>
                        {!collapsed && <h6>Goals</h6>}
                </div>
                <div 
                    className={`budget_menu_item ${selected === "cat" ? "budget_desktop_hovered" : ""}`}
                    onClick={()=>selectionClicked("cat")}
                    title="Budget Categories"
                    >
                        <img src="./Cat.png"/>
                        {!collapsed && <h6>Budget Catagories</h6>}
                </div>               
                <div 
                    className={`budget_menu_item ${selected === "settings" ? "budget_desktop_hovered" : ""}`}
                    onClick={()=>selectionClicked("settings")}
                    title="Settings"
                    >
                        <img src="./settings.png"/>
                        {!collapsed && <h6>Settings</h6>}
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