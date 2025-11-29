import React, { useState } from 'react'
import {Input, Button, Dropdown} from '@wade/ui'


const DummyData = [
    {
        item: "Food",
        amount: "$100",
        date: "2022-01-01",
        type: "w",
        note: "Monthly Rent"
    },
    {
        item: "Gas",
        amount: "$45",
        date: "2022-01-02",
        type: "w",
        note: "Shell Station"
    },
    {
        item: "Paycheck",
        amount: "$2000",
        date: "2022-01-03",
        type: "d",
        note: "Work"
    },
    {
        item: "Groceries",
        amount: "$150",
        date: "2022-01-05",
        type: "w",
        note: "Whole Foods"
    },
    {
        item: "Dining Out",
        amount: "$60",
        date: "2022-01-06",
        type: "w",
        note: "Olive Garden"
    },
    {
        item: "Utilities",
        amount: "$120",
        date: "2022-01-07",
        type: "w",
        note: "Electric Bill"
    },
    {
        item: "Gym",
        amount: "$30",
        date: "2022-01-08",
        type: "w",
        note: "Planet Fitness"
    },
    {
        item: "Movie",
        amount: "$25",
        date: "2022-01-09",
        type: "w",
        note: "AMC Theaters"
    },
    {
        item: "Insurance",
        amount: "$100",
        date: "2022-01-10",
        type: "w",
        note: "Car Insurance"
    },
    {
        item: "Phone",
        amount: "$50",
        date: "2022-01-11",
        type: "w",
        note: "Verizon"
    },
    {
        item: "Coffee",
        amount: "$5",
        date: "2022-01-12",
        type: "w",
        note: "Starbucks"
    },
    {
        item: "Books",
        amount: "$20",
        date: "2022-01-13",
        type: "w",
        note: "Amazon"
    },
    {
        item: "Clothing",
        amount: "$80",
        date: "2022-01-14",
        type: "w",
        note: "H&M"
    },
    {
        item: "Electronics",
        amount: "$200",
        date: "2022-01-15",
        type: "w",
        note: "Best Buy"
    },
    {
        item: "Gifts",
        amount: "$50",
        date: "2022-01-16",
        type: "w",
        note: "Birthday Gift"
    },
    {
        item: "Charity",
        amount: "$20",
        date: "2022-01-17",
        type: "w",
        note: "Red Cross"
    },
    {
        item: "Music",
        amount: "$10",
        date: "2022-01-18",
        type: "w",
        note: "Spotify"
    },
    {
        item: "Games",
        amount: "$60",
        date: "2022-01-19",
        type: "w",
        note: "Steam"
    },
    {
        item: "Travel",
        amount: "$300",
        date: "2022-01-20",
        type: "w",
        note: "Flight Ticket"
    },
    {
        item: "Hotel",
        amount: "$150",
        date: "2022-01-21",
        type: "w",
        note: "Marriott"
    }
]

function Trans_desktop({selected}) {
    const [transactions, setTransactions] = useState(DummyData)
    
    let currentChecking = 12445.23;
    let currentSavings = 12345.23;

    const calculatedTransactions = transactions.map(transaction => {
        const amount = parseFloat(transaction.amount.replace('$', ''));
        
        if (transaction.type === 'd') {
            currentChecking += amount;
        } else {
            currentChecking -= amount;
        }
        
        return {
            ...transaction,
            checking: `$${currentChecking.toFixed(2)}`,
            savings: `$${currentSavings.toFixed(2)}`
        };
    });

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
                            <th className='trans_delete_col'>Del</th>
                            <th className='trans_date_col'>Date</th>
                            <th className='trans_item_col'>Item</th>
                            <th className='trans_amount_col'>Amount</th>
                            <th className='trans_type_col'>Type</th>
                            <th className='trans_balance_col'>Checking</th>
                            <th className='trans_balance_col'>Savings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calculatedTransactions.map((data, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td className='trans_delete_col' rowSpan={2}><button className='cat_button'><img src='./delete.png'/></button></td>
                                    <td className='trans_date_col' rowSpan={2}>{data.date}</td>
                                    <td className='trans_item_col' rowSpan={1}>{data.item}</td>
                                    <td className='trans_amount_col' rowSpan={1}>{data.amount}</td>
                                    <td className='trans_type_col' rowSpan={1}>{data.type}</td>
                                    <td className='trans_balance_col' rowSpan={2}>{data.checking}</td>
                                    <td className='trans_balance_col' rowSpan={2}>{data.savings}</td>
                                </tr>
                                <tr className='trans_note_col'>
                                    <td className='trans_subrow' colSpan="3"><strong>Note:</strong> {data.note}</td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default Trans_desktop