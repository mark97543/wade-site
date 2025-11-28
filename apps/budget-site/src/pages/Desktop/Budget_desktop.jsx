import React from 'react'
import {Input, Button} from '@wade/ui'

function Budget_desktop({selected}) {
  return (
    <div className={selected === "budget" ? "budget_desktop_selected" : "budget_desktop_not_selected"} >
        <div className='budget_desktop_add'>
          <Input labelText={'Add Item'}/>
          <Input labelText={'Amount'}/>
        </div>
    </div>
  )
}

export default Budget_desktop