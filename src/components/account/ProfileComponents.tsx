import React, {useState} from 'react'
import {useLocation} from 'wouter'
import components from '../../env/components.json'
import DataPagination from '../UI&UX/DataPagination'
import {AccountPageComponentProps} from '../../types/types'

const ProfileComponents = ({profile, context}: AccountPageComponentProps) => {
    const [loc, setLoc] = useLocation()
    const [items, setItems] = useState<any[]>([])

    return (
        <>
            <h1>Что я могу создать?</h1>   
            <div className='items small'>
                {components.map(el => <div onClick={() => setLoc(`/create-${el.path}/${context.account_id}`)} className='item label'><h4>{el.title}</h4></div>)}
            </div>

            <DataPagination initialItems={profile.account_components} setItems={setItems} label='Список компонентов:' />
            <div className='items half'>
                {items.map(el => <div onClick={() => setLoc(`/${el.path}/${el.shortid}`)} className='item card'>{el.title}</div>)}
            </div>
        </> 
    )
}

export default ProfileComponents