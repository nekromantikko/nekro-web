import React from 'react';
import './App.css';

const LogoLink = (props: {
    url: string
    img: string
    alt: string
}) => {

    return (
        <a href={props.url} target='_blank' rel='noreferrer'>
            <img className='linkLogo' src={props.img} alt={props.alt} />
        </a>
    )
}

export default LogoLink;