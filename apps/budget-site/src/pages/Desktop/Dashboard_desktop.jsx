import React from 'react'

function Dashboard_desktop({selected}) {
  return (
    <div className={selected === "dashboard" ? "budget_desktop_selected" : "budget_desktop_not_selected"} >
        Dashboard
    </div>
  )
}

export default Dashboard_desktop