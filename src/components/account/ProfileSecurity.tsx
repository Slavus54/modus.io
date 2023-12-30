import React, {useState, useMemo} from 'react';
import {useMutation, gql} from '@apollo/react-hooks'
import {CODE_ATTEMPTS} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {AccountPageComponentProps} from '../../types/types'
import ImageLook from '../UI&UX/ImageLook'

const ProfileSecurity = ({profile, context}: AccountPageComponentProps) => {
    const [flag, setFlag] = useState(false)
    const [attempts, setAttempts] = useState<number>(CODE_ATTEMPTS)
    const [percent, setPercent] = useState(50)
    const [state, setState] = useState({
        security_code: ''
    })

    const centum = new Centum()

    const {security_code} = state

    const updateProfileSecurityCodeM = gql`
        mutation updateProfileSecurityCode($account_id: String!, $security_code: String!) {
            updateProfileSecurityCode(account_id: $account_id, security_code: $security_code)
        }
    `

    const [updateProfileSecurityCode] = useMutation(updateProfileSecurityCodeM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.updateProfileSecurityCode)
            window.location.reload()
        }
    })

    useMemo(() => {
        if (flag) {
            setState({...state, security_code: centum.password(percent / 10)})
        }
    }, [flag, percent])

    const onUpdate = async () => {
        if (flag) {
            updateProfileSecurityCode({
                variables: {
                    account_id: context.account_id, security_code
                }
            })
        } else if (profile.security_code === security_code) {
            setFlag(true)
        } else {
            setAttempts(attempts > 0 ? attempts - 1 : 0)
        }
    }
    
    return (
        <>
            {attempts > 0 ? 
                    <>
                        <h1>Обновите код безопасности</h1>
                       
                        <input value={security_code} onChange={e => setState({...state, security_code: e.target.value})} placeholder='Код безопасности' type='text' />
                        {flag ? 
                                <>
                                    <h3 className='lazy-text'>Защищённость - {percent}%</h3>
                                    <ImageLook src='https://img.icons8.com/ios/50/rubiks-cube.png' min='3rem' max='3rem' double_max='3rem' className='icon' />
                                    <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />
                                </>
                            :
                                <h3 className='lazy-text'>Осталось {attempts} попыток для подтверждения кода</h3>                                   
                        }
                       
                        <button onClick={onUpdate}>{flag ? 'Обновить' : 'Проверить'}</button>
                    </>
                    
                :
                    <h3 className='lazy-text'>Попробуйте позже</h3>
            }
        </> 
    )
}

export default ProfileSecurity