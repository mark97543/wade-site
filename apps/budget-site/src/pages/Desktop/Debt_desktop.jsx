import React from 'react'

function Debt_desktop({selected}) {
  return (
    <div className={selected === "debt" ? "budget_desktop_selected" : "budget_desktop_not_selected"} >
        Debt
    </div>
  )
}

export default Debt_desktop