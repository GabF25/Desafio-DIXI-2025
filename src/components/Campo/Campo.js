import React from 'react';
import './Campo.css';

const Campo = ({
    onChange,
    tamanhoMaximo,
    type = "text",
    value,
    placeholder,
    className,
    children,
    label
}) => { 
    return ( 
        <>
        <div className="campo-container">
            {label && (
                <span className="campo-label">{label}</span>
            )}
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
        </div>
        </>
     );
}

export default Campo;