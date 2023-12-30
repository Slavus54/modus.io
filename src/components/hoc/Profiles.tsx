import React, {useState, useMemo, useContext} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation, gql} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import {ATTAINMENT_TYPES, GENDERS, VIEW_CONFIG, token} from '../../env/env'
import TOWNS from '../../env/towns.json'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import DataPagination from '../UI&UX/DataPagination'
import MapPicker from '../UI&UX/MapPicker'
import Loading from '../UI&UX/Loading'

const Profiles = () => {
    const {context} = useContext<any>(Context)
    const [loc, setLoc] = useLocation()
    const [view, setView] = useState(VIEW_CONFIG)
    const [username, setUsername] = useState('')
    const [field, setField] = useState(ATTAINMENT_TYPES[0])
    const [sex, setSex] = useState(GENDERS[0])
    const [region, setRegion] = useState(TOWNS[0].title)
    const [cords, setCords] = useState(TOWNS[0].cords)
    const [isMyField, setIsMyField] = useState(false)
    const [profiles, setProfiles] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])

    const centum = new Centum()

    const getProfilesM = gql`
        mutation getProfiles($username: String!) {
            getProfiles(username: $username) {
                account_id
                username
                sex
                region
                cords {
                    lat
                    long
                }
                field
            }
        }
    `

    const [getProfiles] = useMutation(getProfilesM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.getProfiles)
            setProfiles(data.getProfiles)
        }
    })

    useMemo(() => {
        if (context.account_id !== '') {
            getProfiles({
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
        setField(isMyField ? context.field : ATTAINMENT_TYPES[0])
    }, [isMyField])

    useMemo(() => {
        if (profiles !== null) {
            let result = profiles.filter(el => el.region === region && el.sex === sex)

            if (username !== '') {
                result = result.filter(el => centum.search([el.username, username], 50))
            }

            result = result.filter(el => el.field === field)

            setFiltered(result)
            setIsMyField(context.field === field)
        }
    }, [profiles, username, field, sex, region])

    const onRedirect = (id: string) => {
        if (context.account_id !== id) {
            setLoc('/')
        } else {
            setLoc(`/profile/${id}`)
        }
    }
    
    return (
        <>         
            <h1>Поиск {sex === 'Мужчина' ? 'друга' : 'подруги'}</h1> 
            <div className='items half'>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder='Имя пользователя' type='text' />
                <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Ближайший город' type='text' />   
            </div>
            <div className='items small'>
                {ATTAINMENT_TYPES.map((el: string) => <div onClick={() => setField(el)} className={el === field ? 'item label active' : 'item label'}>{el}</div>)}
            </div>
            <div className='items small'>
                <select value={sex} onChange={e => setSex(e.target.value)}>
                    {GENDERS.map(el => <option value={el}>{el}</option>)}
                </select>
                <button onClick={() => setIsMyField(!isMyField)} className='pale'>{isMyField ? 'Моя' : 'Иная'} сфера</button>
            </div> 

            <DataPagination initialItems={filtered} setItems={setFiltered} />
            {profiles !== null &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token} className='map'>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>
                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <b onClick={() => onRedirect(el.account_id)}>{el.username}</b>
                        </Marker>    
                    )}
                </ReactMapGL>      
            }
            {profiles === null && <Loading />}
        </>
    )
}

export default Profiles