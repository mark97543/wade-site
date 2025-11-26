import React from 'react'

function Goals_desktop({selected}) {
  return (
    <div className={selected === "goals" ? "budget_desktop_selected" : "budget_desktop_not_selected"} >
        Goals
    </div>
  )
}

export default Goals_desktop