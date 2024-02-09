import React from 'react'
import './css/SafeUrl.css';

export function SafeUrl(props) {
  return ( props.trigger ) ? (
    <div className='popup'>
       <div className="popup-inner">
        {props.children}
        <button className="close-btn" onClick={() => props.setTrigger(false)}>close</button>
        <button className="copy-btn" onClick={() => navigator.clipboard.writeText(props.safeUrl)}>copy</button>
        </div> 
    </div>
  ) : "";
}
