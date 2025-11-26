import React from 'react'

function Cat_desktop({selected}) {
  return (
    <div className={selected === "cat" ? "budget_desktop_selected" : "budget_desktop_not_selected"} >
        Budget Categories
    </div>
  )
}

export default Cat_desktop