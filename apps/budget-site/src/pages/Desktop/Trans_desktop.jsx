import React from 'react'
import {Input, Button, Dropdown} from '@wade/ui'

function Trans_desktop({selected}) {
  return (
    <div className={selected === "trans" ? "budget_desktop_selected" : "budget_desktop_not_selected"} >
        <div className='trans_desktop_container'>
            <div className='trans_desktop_add'>
              <Input placeholder={'Search'} type={'text'} id={'search'} />
              <Button />
            </div>
        </div>
    </div>
  )
}

export default Trans_desktop