import React, {useState, useMemo, useContext} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation, gql} from '@apollo/react-hooks';
import {GENDERS, VIEW_CONFIG, token} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import TOWNS from '../../env/towns.json'
import {Context} from '../../context/WebProvider'
import ImageLoader from '../UI&UX/ImageLoader'
import MapPicker from '../UI&UX/MapPicker'
import FormPagination from '../UI&UX/FormPagination'

const Register = () => {
    const {change_context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [image, setImage] = useState('')
    const [idx, setIdx] = useState(0)
    const [state, setState] = useState({
        username: '', 
        security_code: '', 
        telegram_tag: '',
        sex: GENDERS[0],
        region: TOWNS[0].title, 
        cords: TOWNS[0].cords
    })

    const centum = new Centum()

    const {username, security_code, telegram_tag, sex, region, cords} = state

    const registerM = gql`
        mutation register($username: String!, $security_code: String!, $telegram_tag: String!, $sex: String!, $region: String!, $cords: ICord!, $main_photo: String!) {
            register(username: $username, security_code: $security_code, telegram_tag: $telegram_tag, sex: $sex, region: $region, cords: $cords, main_photo: $main_photo) {
                account_id
                username
                field
            }
        }
    `

    const [register] = useMutation(registerM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.register)
            change_context('update', data.register, 1)
        }
    })

    useMemo(() => {
        if (region !== '') {
            let result = TOWNS.find(el => centum.search([el.title, region], 60)) 
    
            if (result !== undefined) {
                setState({...state, region: result.title, cords: result.cords})
            }           
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 17})
    }, [cords])

    const onCreate = () => {
        register({
            variables: {
                username, security_code, telegram_tag, sex, region, cords, main_photo: image
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination label='Создайте аккаунт' num={idx} setNum={setIdx} items={[
                    <>
                        <input value={username} onChange={e => setState({...state, username: e.target.value})} placeholder='Ваше имя' type='text' />
                        <input value={security_code} onChange={e => setState({...state, security_code: e.target.value})} placeholder='Код безопасности' type='text' />
                        <select value={sex} onChange={e => setState({...state, sex: e.target.value})}>
                            {GENDERS.map(el => <option value={el}>{el}</option>)}
                        </select>
                    </>,
                    <>
                        <h2>Ваш канал и фото</h2>
                        <input value={telegram_tag} onChange={e => setState({...state, telegram_tag: e.target.value})} placeholder='Тэг в telegram' type='text' />
                        <ImageLoader setImage={setImage} />
                    </>,
                    <>
                        <h2>Где вы проживаете?</h2>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Ближайший город' type='text' />
                        <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token} className='map'>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        </ReactMapGL>  
                    </>
                ]} 
            />

            <button onClick={onCreate}>Начать</button>
        </div>
    )
}

export default Register