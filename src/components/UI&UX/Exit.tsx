import React, {useContext} from 'react'
import {EXIT} from '../../env/env'
import ImageLook from '../UI&UX/ImageLook'
import {Context} from '../../context/WebProvider'

const Exit = () => {
    const {change_context, context} = useContext(Context)

    const onExit = () => {
        if (context.account_id === '') {
            window.open('https://www.youtube.com')
        } else {
            change_context('update', null, 1)
        }
    }

    return <ImageLook onClick={onExit} src={EXIT} min='3rem' max='3rem' double_max='3rem' className='icon' alt='exit' />
}

export default Exit