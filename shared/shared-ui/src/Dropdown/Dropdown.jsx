/**
 * A customizable dropdown component that can render options from an array of strings or an array of objects.
 *
 * @param {object} props - The component props.
 * @param {string} props.label - The label text to display for the select input.
 * @param {string|number} props.value - The currently selected value (controlled input).
 * @param {function} props.change - The event handler function called when the selection changes.
 * @param {Array<string|object>} props.Items - The array of items to populate the dropdown.
 * @param {string} [props.catID] - The object key to use for values if `Items` contains objects (e.g., 'category'). If omitted, `Items` is treated as an array of strings.
 */
export function Dropdown({Items, catID, label, value, change}){ // Add value & change props
    return(
        <div>
            <label htmlFor={label}>{label}</label>
            <select name={label} id={label} value={value} onChange={change}>
                <option value="" disabled hidden>Select an option</option>
                {Items?.map((item, index) => {
                 
                    const optionValue = catID ? item[catID] : item;
                    return (
                        <option key={index} value={optionValue}>
                            {optionValue}
                        </option>
                    );
                })}
            </select>
        </div>
    )
}