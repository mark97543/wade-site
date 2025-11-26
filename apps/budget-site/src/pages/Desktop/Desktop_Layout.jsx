import React, {useState} from "react"


export function Desktop_Layout(){

    const [selected, setSelected]=useState(1)

    const selectionClicked = (number)=>{
        setSelected(number)
    }


    return(
        <div className="budget_desktop_layout">


            <div className="budget_left_panel">
                <div 
                    className={selected === 1 ? "budget_desktop_hovered" : ""}
                    onClick={()=>selectionClicked(1)}
                    >
                        <img src="./dashboard.png"/>
                        <h6>Dashboard</h6>
                </div>
                <div 
                    className={selected === 2 ? "budget_desktop_hovered" : ""}
                    onClick={()=>selectionClicked(2)}
                    >
                        <img src="./budget.png"/>
                        <h6>Budget</h6>
                </div>
                <div 
                    className={selected === 3 ? "budget_desktop_hovered" : ""}
                    onClick={()=>selectionClicked(3)}
                    >
                        <img src="./transaction.png"/>
                        <h6>Transactions</h6>
                </div>
                <div 
                    className={selected === 4 ? "budget_desktop_hovered" : ""}
                    onClick={()=>selectionClicked(4)}
                    >
                        <img src="./debt.png"/>
                        <h6>Debt</h6>
                </div>
                <div 
                    className={selected === 5 ? "budget_desktop_hovered" : ""}
                    onClick={()=>selectionClicked(5)}
                    >
                        <img src="./goals.png"/>
                        <h6>Goals</h6>
                </div>
                <div 
                    className={selected === 6 ? "budget_desktop_hovered" : ""}
                    onClick={()=>selectionClicked(6)}
                    >
                        <img src="./settings.png"/>
                        <h6>Settings</h6>
                </div>
            </div>


            <div className="budget_right_panel">
                <h2>Item View Port</h2>
            </div>
        </div>
    )
}