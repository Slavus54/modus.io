import React, {useState, useMemo, useContext} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation, gql} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import {ATTAINMENT_TYPES, VIEW_CONFIG, token} from '../../env/env'
import TOWNS from '../../env/towns.json'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import DataPagination from '../UI&UX/DataPagination'
import MapPicker from '../UI&UX/MapPicker'
import Loading from '../UI&UX/Loading'

const Workshops = () => {
    const {context} = useContext<any>(Context)
    const [loc, setLoc] = useLocation()
    const [view, setView] = useState(VIEW_CONFIG)
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState(ATTAINMENT_TYPES[0])
    const [region, setRegion] = useState(TOWNS[0].title)
    const [cords, setCords] = useState(TOWNS[0].cords)
    const [isMyField, setIsMyField] = useState(false)
    const [workshops, setWorkshops] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])

    const centum = new Centum()

    const getWorkshopsM = gql`
        mutation getWorkshops($username: String!) {
            getWorkshops(username: $username) {
                shortid
                account_id
                username
                title
                category
                tasks {
                    id
                    headline
                    level
                    progress
                }
                dateUp
                time
                region
                cords {
                    lat
                    long
                }
                telegram_tag
                members {
                    account_id
                    username
                    role
                    task
                }
                images {
                    shortid
                    name
                    title
                    category
                    photo_url
                    likes
                }
            }
        }
    `

    const [getWorkshops] = useMutation(getWorkshopsM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.getWorkshops)
            setWorkshops(data.getWorkshops)
        }
    })

    useMemo(() => {
        if (context.account_id !== '') {
            getWorkshops({
                variables: {
                    username: context.username
                }
            })
        }
    }, [])

    useMemo(() => {
        if (region !== '') {
            let result = TOWNS.find(el => centum.search([el.title, region], 60)) 
    
            if (result !== undefined) {
                setRegion(result.title)
                setCords(result.cords)
            }           
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 17})
    }, [cords])

    useMemo(() => {
        setCategory(isMyField ? context.field : ATTAINMENT_TYPES[0])
    }, [isMyField])

    useMemo(() => {
        if (workshops !== null) {
            let result = workshops.filter(el => el.category === category && el.region === region)

            if (title !== '') {
                result = result.filter(el => centum.search([el.title, title], 50))
            }

            setFiltered(result)
            setIsMyField(context.field === category)
        }
    }, [workshops, title, category, region])
    
    return (
        <>         
            <h1>Найдите лучшую практику</h1> 
            <div className='items half'>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Название семинара' type='text' />
                <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Ближайший город' type='text' />   
            </div>
            <div className='items small'>
                {ATTAINMENT_TYPES.map((el: string) => <div onClick={() => setCategory(el)} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div>

            <button onClick={() => setIsMyField(!isMyField)} className='pale'>{isMyField ? 'Моя' : 'Иная'} сфера</button>        

            <DataPagination initialItems={filtered} setItems={setFiltered} />
            {workshops !== null &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token} className='map'>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>
                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <b onClick={() => setLoc(`/workshop/${el.shortid}`)}>{centum.shorter(el.title, 2)}</b>
                        </Marker>    
                    )}
                </ReactMapGL>      
            }
            {workshops === null && <Loading />}
        </>
    )
}

export default Workshops