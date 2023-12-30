import React, {useState, useMemo, useContext} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation, gql} from '@apollo/react-hooks'
import {MIRACLE_TYPES, CENTURES, VIEW_CONFIG, token} from '../../env/env'
import TOWNS from '../../env/towns.json'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import QuantityLabel from '../UI&UX/QuantityLabel'
import MapPicker from '../UI&UX/MapPicker'
import FormPagination from '../UI&UX/FormPagination'


type Props = {
    params: {
        id: string
    }
}

type FormType = {
    title: string
    category: string
    century: string
    region: string
    cords: any
    rating: number
}

const CreateMiracle: React.FC<Props> = ({params}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [idx, setIdx] = useState(0)
    const [state, setState] = useState<FormType>({
        title: '', 
        category: MIRACLE_TYPES[0], 
        century: CENTURES[0],
        region: TOWNS[0].title, 
        cords: TOWNS[0].cords,
        rating: 50
    })

    const centum = new Centum()

    const {title, category, century, region, cords, rating} = state

    const createMiracleM = gql`
        mutation createMiracle($username: String!, $id: String!, $title: String!, $category: String!, $century: String!, $region: String!, $cords: ICord!, $rating: Float!) {
            createMiracle(username: $username, id: $id, title: $title, category: $category, century: $century, region: $region, cords: $cords, rating: $rating)
        }
    `

    const [createMiracle] = useMutation(createMiracleM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.createMiracle)
            window.location.reload()
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
        createMiracle({
            variables: {
                username: context.username, id: params.id, title, category, century, region, cords, rating
            }
        })
    }
    
    return (
        <div className='main'>          
            <FormPagination label='Создайте чудо' num={idx} setNum={setIdx} items={[
                    <>
                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название европейского чуда' />
                        <h3>Тип и век</h3>
                        <div className='items small'>
                            {MIRACLE_TYPES.map((el: string) => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>
                        <select value={century} onChange={e => setState({...state, century: e.target.value})}>
                            {CENTURES.map(el => <option value={el}>{el}</option>)}
                        </select>
                    </>,
                    <>
                        <h2>Где это находится?</h2>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Ближайший город' type='text' />
                        <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token} className='map'>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        </ReactMapGL>  
                    </>
                ]} 
            />

            <button onClick={onCreate}>Создать</button>
        </div>
    )
}

export default CreateMiracle