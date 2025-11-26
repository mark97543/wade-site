import React from 'react'

function Budget_desktop({selected}) {
  return (
    <div className={selected === "budget" ? "budget_desktop_selected" : "budget_desktop_not_selected"} >
        Budget
    </div>
  )
}

export default Budget_desktop