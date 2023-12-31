import React from 'react'
import cards from '../../env/cards.json'

const Welcome: React.FC = () => {
    return (
        <>          
            <h1 className='welcome__headline'>Modus Vivendi</h1>
            <h3 className='lazy-text'>Платформа для свободных людей</h3>
            <div className='items'>
                {cards.map(el =>
                    <div className='item panel'>
                        <h2>{el.title}</h2>
                        <p className='pale'>{el.category}</p>
                        <p>{el.text}</p>
                    </div>    
                )}
            </div>
        </>
    )
}

export default Welcome