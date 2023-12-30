import React, {useState, useMemo} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl'
import {useSelector, useDispatch} from 'react-redux'
import {VIEW_CONFIG, token} from '../../env/env'
//@ts-ignore
import MapPicker from '../UI&UX/MapPicker'
import {AccountPageComponentProps} from '../../types/types'
import {init, reset, update, centum} from '../../store/slices/MarathonSlice'

const ProfileMarathon = ({profile, context} : AccountPageComponentProps) => {
    const [view, setView] = useState(VIEW_CONFIG)
    const [speed, setSpeed] = useState<number>(60)
    const [time, setTime] = useState<number>(0)
    const cords = useSelector((state: any) => state.marathon.cords)
    const routes = useSelector((state: any) => state.marathon.routes)
    const distance = useSelector((state: any) => state.marathon.distance)
    const dispatch = useDispatch()

    useMemo(() => {
        if (context !== null) {
            dispatch(init(routes.length === 0 ? profile.cords : routes[routes.length - 1]))
        }
    }, [])

    useMemo(() => {
        let result = Math.floor((distance*10**-3 / speed) * 3e2) 
        
        setTime(result)
    }, [distance, speed])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 17})
    }, [cords])

    const onChangeMapPos = (e: any) => {
        let dot = centum.mapboxCords(e)

        dispatch(update(dot))
    }
  
    return (
        <>
            <h2>Марафон</h2>
            <div className='items small'>
                <h4 className='pale'>Скорость: <b>{speed / 5}</b> км/ч</h4>
                <h4 className='pale'>Время: <b>{centum.time(time, 'convert')}</b></h4>
            </div>
            <input value={speed} onChange={e => setSpeed(parseInt(e.target.value))} type='range' step={1} />
            <button onClick={() => dispatch(reset())} className='pale'>Сбросить</button>
            <h3 className='pale'>Дистанция: <b>{distance}</b> метров</h3>
            <ReactMapGL onClick={e => onChangeMapPos(e)} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token} className='map'>
                <Marker latitude={profile.cords.lat} longitude={profile.cords.long}>
                    <MapPicker type='home' />
                </Marker>
                {routes.map((el: any) => 
                    <Marker latitude={el.lat} longitude={el.long}>
                        <MapPicker type='picker' />
                    </Marker>
                )}
            </ReactMapGL>      
        </> 
    )
}

export default ProfileMarathon