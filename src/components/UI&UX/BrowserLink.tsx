import React from 'react'
import {GOOGLE_IMAGE} from '../../env/env'
import ImageLook from './ImageLook'

type PropsType = {
    url: string,
    alt?: string
}

const BrowserLink: React.FC<PropsType> = ({url, alt = 'link'}) => 

<ImageLook 
    onClick={() => window.open(url)} 
    src={GOOGLE_IMAGE} 
    min='3rem' max='3rem' double_max='3rem' 
    className='icon' 
    alt={alt} 
/>

export default BrowserLink