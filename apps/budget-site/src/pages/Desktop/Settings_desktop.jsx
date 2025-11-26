import React from 'react'

function Settings_desktop({selected}) {
  return (
    <div className={selected === "settings" ? "budget_desktop_selected" : "budget_desktop_not_selected"} >
        Settings
    </div>
  )
}

export default Settings_desktop