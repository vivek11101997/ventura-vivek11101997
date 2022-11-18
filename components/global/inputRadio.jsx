import React from "react";

const InputRadio = (props) => {

    const keyy = props.key;
    return(
        <div className="radio-group animate" key={props.key} >
            <input 
                id={props.id}
                name={props.name} 
                type="radio"
                value={props.listId}
                onChange={props.handleChange}
                aria-label={props.value}
            />
            <label onKeyPress={(e) => {
                props.accessiblityHandler(e.target.getAttribute("data-val"))
            }} htmlFor={props.id} tabIndex="1" data-val={props.listId}>{props.value}</label>
        </div>
    )
}
export default InputRadio;