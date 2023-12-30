import React, {useState} from 'react'
//@ts-ignore
import Centum from 'centum.js'
import PROVERBS from '../../env/proverbs.json'

const MenuProverb = () => {
    const centum = new Centum()
    const [proverb] = useState<string>(centum.random(PROVERBS)?.value)

    return <span className='nav_item'>{proverb}</span>
}

export default MenuProverb