import React, {useState} from 'react'

type Props = {
    src: any
    min?: string
    max?: string
    double_max?: string
    className: string
    onClick?: any
    alt?: string
}

const ImageLook: React.FC<Props> = ({src, min = '16rem', max = '18rem', double_max = '20rem', className = 'photo_item', onClick = () => {}, alt = 'фото'}) => {
    let [isZoom, setIsZoom] = useState(false)

    const onLookImage = (target: any, value: string, isChanged = false) => {
        target.style.transition = '0.2s'
        target.style.width = isChanged ? (isZoom ? max : value) : value 

        if (isChanged) {
            setIsZoom(!isZoom)
        }
    }

    return (
        <img src={src} onClick={onClick} onDoubleClick={e => onLookImage(e.target, double_max, true)} onMouseEnter={e => onLookImage(e.target, max)} onMouseLeave={e => onLookImage(e.target, min)} className={className} alt={alt} />
    )
}

export default ImageLook