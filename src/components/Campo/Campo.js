import React from 'react';
import './Campo.css';

const Campo = ({
    onChange,
    tamanhoMaximo,
    type = "text",
    value,
    placeholder
}) => {
    return ( 
        <input className="campo"
            type={type}
            placeholder={placeholder}
            maxLength={tamanhoMaximo}
            value={value}
            onChange={onChange}
        />
     );
}
 
export default Campo;