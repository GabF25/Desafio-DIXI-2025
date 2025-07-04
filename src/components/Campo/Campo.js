import React from 'react';
import './Campo.css';

const Campo = ({
    onChange,
    tamanhoMaximo,
    type = "text",
    value,
    placeholder,
    className,
    children
}) => { 
    return ( 
        <>
            <label className={"label-input"}>
                {children}
            </label>
            <input
                className={`campo ${className || ''}`}
                type={type}
                placeholder={placeholder}
                maxLength={tamanhoMaximo}
                value={value}
                onChange={onChange}
            />
        </>
     );
}

export default Campo;