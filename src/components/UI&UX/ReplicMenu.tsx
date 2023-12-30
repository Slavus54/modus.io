import React, {useState} from 'react'
import ImageLook from './ImageLook'

type Props = {
    flag: boolean
    setFlag: any
}

const BurgerMenu: React.FC<Props> = ({flag, setFlag}) =>  
    <ImageLook 
        onClick={() => setFlag(!flag)} 
        src='https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-greek-human-civilization-vol2-microdots-premium-microdot-graphic.png' 
        min='4rem' max='4rem' double_max='4rem' 
        className='burger-menu' 
    /> 

export default BurgerMenu