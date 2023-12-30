import React from 'react'

type Props = {
    label: string
    num: number
    setNum: any
    items: any[]
}

const FormPagination: React.FC<Props> = ({label = '', num, setNum, items = []}) => {
    return (
        <>
            <div className='items small'>
                <img onClick={() => num > 0 && setNum(num - 1)} src='https://img.icons8.com/ios/50/left--v1.png' className='s' alt='prev' />
                <h1>{label}</h1>
                <img onClick={() => num < items.length - 1 && setNum(num + 1)} src='https://img.icons8.com/ios/50/right--v1.png' className='icon' alt='next' />
            </div>
            {items[num]}           
        </>
    )
}

export default FormPagination