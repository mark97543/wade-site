

/**
 * A customizable dropdown component that can render options from an array of strings or an array of objects.
 *
 * @param {object} props - The component props.
 * @param {Array<string|object>} props.Items - The array of items to populate the dropdown. Can be simple strings or objects with a 'catID' property.
 * @param {boolean} [props.catID=false] - If true, the component will use the 'catID' property from the item objects for the option value and key. If false or omitted, it will use the item itself (for simple string arrays).
 */

export function Dropdown({Items, catID}){

    return(
        <div>
            <select>
                {Items?.map((item) => {
                    const value = catID ? item.catID : item;
                    return (
                        <option key={value} id={value} value={value}>
                            {value}
                        </option>
                    );
                })}
            </select>
        </div>
    )
}