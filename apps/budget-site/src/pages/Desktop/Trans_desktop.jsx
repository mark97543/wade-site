import React from 'react'
import {Input, Button, Dropdown} from '@wade/ui'

function Trans_desktop({selected}) {
  return (
    <div className={selected === "trans" ? "budget_desktop_selected" : "budget_desktop_not_selected"} >
        <div className='trans_desktop_container'>
            <div className='trans_desktop_add'>
              <Input placeholder={'Search'} type={'text'} id={'search'} />
              <Button className={'primary'} text={'Add'}/>
            </div>
            <div className='trans_desktop_table'>
                <table className='standard-table double-row'>
                    <thead>
                        <tr>
                            <th>Delete</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th><Input labelText={'Checking Balance'} placeholder={'Checking Balance'} type={'number'} id={'checking_balance'} /></th>
                            <th><Input labelText={'Savings Balance'} placeholder={'Savings Balance'} type={'number'} id={'savings_balance'} /></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowSpan={2}><button className='cat_button'><img src='./delete.png'/></button></td>
                            <td rowSpan={1}>Food</td>
                            <td rowSpan={1}>$100</td>
                            <td rowSpan={1}>2022-01-01</td>
                            <td rowSpan={1}>$100</td>
                            <td rowSpan={1}>$100</td>
                        </tr>
                        <tr>
                            <td colspan="5"><strong>Note:</strong> Monthly Rent</td>
                        </tr>
                        <tr>
                            <td rowSpan={2}><button className='cat_button'><img src='./delete.png'/></button></td>
                            <td rowSpan={1}>Food</td>
                            <td rowSpan={1}>$100</td>
                            <td rowSpan={1}>2022-01-01</td>
                            <td rowSpan={1}>$100</td>
                            <td rowSpan={1}>$100</td>
                        </tr>
                        <tr>
                            <td colspan="5"><strong>Note:</strong> Monthly Rent</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default Trans_desktop