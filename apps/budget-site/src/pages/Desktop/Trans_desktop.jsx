import React from 'react'

function Trans_desktop({selected}) {
  return (
    <div className={selected === "trans" ? "budget_desktop_selected" : "budget_desktop_not_selected"} >
        Transactions
    </div>
  )
}

export default Trans_desktop