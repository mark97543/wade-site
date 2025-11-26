
export function Desktop_Layout(){
    return(
        <div className="budget_desktop_layout">


            <div className="budget_left_panel">
                <div>
                    <img src="./dashboard.png"/>
                    <h6>Dashboard</h6>
                </div>
                <div>
                    <img src="./budget.png"/>
                    <h6>Budget</h6>
                </div>
                <div>
                    <img src="./transaction.png"/>
                    <h6>Transactions</h6>
                </div>
                <div>
                    <img src="./debt.png"/>
                    <h6>Debt</h6>
                </div>
                <div>
                    <img src="./goals.png"/>
                    <h6>Goals</h6>
                </div>
                <div>
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