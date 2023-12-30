import React from 'react'

type Props = {
    num: number
    setNum: any
    part?: number
    min?: number
    max?: number
    label?:string
}

const QuantityLabel: React.FC<Props> = ({num, setNum, part = 1, min = part, max = part * 100, label = ''}) => {
    return (
        <div className='items small'>
            <img onClick={() => num > min && setNum(num - part)} src='https://img.icons8.com/ios/50/minus.png' className='arrow' />
            <h3>{label}</h3>
            <img onClick={() => num < max && setNum(num + part)} src='https://img.icons8.com/ios/50/plus--v1.png' className='arrow' />
        </div>
    )
}   

export default QuantityLabel