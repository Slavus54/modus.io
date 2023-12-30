import React from 'react'

type Props = {
    setImage: any
    label?: string
}

const ImageLoader: React.FC<Props> = ({setImage, label = ''}) => {

    const onLoad = (e: any) => {
        let reader = new FileReader()

        reader.onload = (file: any) => {
            setImage(file.target.result)
        }

        reader.readAsDataURL(e.target.files[0])
    }

    return (
        <>
            <input onChange={e => onLoad(e)} type='file' id='loader' />
            <label htmlFor='loader'>{label}</label>
        </>
    )
}

export default ImageLoader