type Props = {
    onClick: any
}

const CloseIt = ({onClick}: Props) => <img src='https://img.icons8.com/ios/50/delete-sign.png' className='close' onClick={onClick} alt='close' />

export default CloseIt