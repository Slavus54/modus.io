import React, {useState, useMemo, useContext} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation, gql} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import {MIRACLE_TYPES, CENTURES, VIEW_CONFIG, token} from '../../env/env'
import TOWNS from '../../env/towns.json'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import DataPagination from '../UI&UX/DataPagination'
import MapPicker from '../UI&UX/MapPicker'
import Loading from '../UI&UX/Loading'

const Miracles = () => {
    const {context} = useContext<any>(Context)
    const [loc, setLoc] = useLocation()
    const [view, setView] = useState(VIEW_CONFIG)
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState(MIRACLE_TYPES[0])
    const [century, setCentury] = useState(CENTURES[0])
    const [region, setRegion] = useState(TOWNS[0].title)
    const [cords, setCords] = useState(TOWNS[0].cords)
    const [miracles, setMiracles] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])

    const centum = new Centum()

    const getMiraclesM = gql`
        mutation getMiracles($username: String!) {
            getMiracles(username: $username) {
                shortid
                account_id
                username
                title
                category
                century
                region
                cords {
                    lat
                    long
                }
                rating
                questions {
                    shortid
                    name
                    text
                    level
                    answer
                }
                buildings {
                    shortid
                    name
                    title
                    category
                    cords {
                        lat
                        long
                    }
                    photo_url
                    likes
                }
            }
        }
    `

    const [getMiracles] = useMutation(getMiraclesM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.getMiracles)
            setMiracles(data.getMiracles)
        }
    })

    useMemo(() => {
        if (context.account_id !== '') {
            getMiracles({
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
        if (miracles !== null) {
            let result = miracles.filter(el => el.category === category && el.region === region)

            if (title !== '') {
                result = result.filter(el => centum.search([el.title, title], 50))
            }

            result = result.filter(el => el.century === century)

            setFiltered(result)
        }
    }, [miracles, title, category, century, region])
    
    return (
        <>         
            <h1>Поиск чудес Европы</h1> 
            <div className='items half'>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Что это?' type='text' />
                <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Ближайший город' type='text' />   
            </div>
            <div className='items small'>
                {MIRACLE_TYPES.map((el: string) => <div onClick={() => setCategory(el)} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div>     
            <select value={century} onChange={e => setCentury(e.target.value)}>
                {CENTURES.map(el => <option value={el}>{el}</option>)}
            </select>

            <DataPagination initialItems={filtered} setItems={setFiltered} />
            {miracles !== null &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token} className='map'>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>
                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <b onClick={() => setLoc(`/miracle/${el.shortid}`)}>{centum.shorter(el.title, 2)}</b>
                        </Marker>    
                    )}
                </ReactMapGL>      
            }
            {miracles === null && <Loading />}
        </>
    )
}

export default Miracles