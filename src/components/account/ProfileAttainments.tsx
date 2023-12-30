import React, {useState} from 'react';
import {useMutation, gql} from '@apollo/react-hooks'
import {ATTAINMENT_TYPES, ATTAINMENT_FORMATS, LEVELS} from '../../env/env'
import ImageLoader from '../UI&UX/ImageLoader'
import ImageLook from '../UI&UX/ImageLook'
import DataPagination from '../UI&UX/DataPagination'
import CloseIt from '../UI&UX/CloseIt'
//@ts-ignore
import Centum from 'centum.js'
import {AccountPageComponentProps} from '../../types/types'

const ProfileAttainments = ({profile, context}: AccountPageComponentProps) => {
    const [attainments, setAttainments] = useState<any[]>([])
    const [attainment, setAttainment] = useState<any>(null)
    const [image, setImage] = useState('')
    const [state, setState] = useState({
        title: '', 
        category: profile.field, 
        format: ATTAINMENT_FORMATS[0],
        level: LEVELS[0]
    })

    const centum = new Centum()

    const {title, category, format, level} = state

    const manageProfileAttainmentM = gql`
        mutation manageProfileAttainment($account_id: String!, $option: String!, $title: String!, $category: String!, $format: String!, $level: String!, $photo_url: String!, $coll_id: String!) {
            manageProfileAttainment(account_id: $account_id, option: $option, title: $title, category: $category, format: $format, level: $level, photo_url: $photo_url, coll_id: $coll_id)
        }
    `

    const [manageProfileAttainment] = useMutation(manageProfileAttainmentM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.manageProfileAttainment)
            window.location.reload()
        }
    })
    
    const onManageAttainment = (option: string) => {
        manageProfileAttainment({
            variables: {
                account_id: context.account_id, option, title, category, format, level, photo_url: image, coll_id: attainment === null ? '' : attainment.shortid
            }
        })
    }

    return (
        <>
            {attainment === null ? 
                    <>
                        <h1>Достижения</h1>
                        <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название успеха' type='text' />
                        <h3>Сфера</h3>
                        <div className='items small'>
                            {ATTAINMENT_TYPES.map((el: string) => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>
                        <div className='items small'>
                            <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                {LEVELS.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                {ATTAINMENT_FORMATS.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>
                        <ImageLoader setImage={setImage} />
                        <button onClick={() => onManageAttainment('create')}>Добавить</button>
                        <DataPagination initialItems={profile.attainments} setItems={setAttainments} />
                        <div className='items half'>    
                            {attainments.map(el => <div onClick={() => setAttainment(el)} className='item card'>{centum.shorter(el.title)}</div>)}
                        </div>
                    </>
                :
                    <>
                        <CloseIt onClick={() => setAttainment(null)} />
                        {attainment.photo_url !== '' && <ImageLook src={attainment.photo_url} className='photo_item' alt='фото достижения' />}
                        <h2>{attainment.title}</h2>
                        <div className='items small'>
                            <h4 className='pale'>Тип: {attainment.category}</h4>
                            <h4 className='pale'><b>{attainment.likes}</b> лайков</h4>
                        </div>
                       
                        
                        <button onClick={() => onManageAttainment('delete')}>Удалить</button>
                    </>
            }
        </> 
    )
}

export default ProfileAttainments