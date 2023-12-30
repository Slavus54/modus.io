import React, {useState, useMemo, useContext} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation, gql} from '@apollo/react-hooks'
import {ATTAINMENT_TYPES, ROLES, TIME_BORDERS, LEVELS, VIEW_CONFIG, token} from '../../env/env'
import TOWNS from '../../env/towns.json'
//@ts-ignore
import {Datus} from 'datus.js'
//@ts-ignore
import shortid from 'shortid'
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
    tasks: any[]
    dateUp: any
    time: string
    region: string
    cords: any
    role: string
}

const CreateWorkshop: React.FC<Props> = ({params}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [idx, setIdx] = useState(0)
    const [dateIdx, setDateIdx] = useState(0)
    const [timer, setTimer] = useState(TIME_BORDERS[0])
    const [task, setTask] = useState({
        id: shortid.generate().toString(),
        headline: '',
        level: LEVELS[0],
        progress: 0
    })
    const datus = new Datus()
    const [state, setState] = useState<FormType>({
        title: '', 
        category: ATTAINMENT_TYPES[0], 
        tasks: [], 
        dateUp: datus.formatting(datus.date, 'default'), 
        time: '', 
        region: TOWNS[0].title, 
        cords: TOWNS[0].cords,
        role: ROLES[0]
    })

    const centum = new Centum()

    const {title, category, tasks, dateUp, time, region, cords, role} = state
    const {id, headline, level, progress} = task

    const createWorkshopM = gql`
        mutation createWorkshop($username: String!, $id: String!, $title: String!, $category: String!, $tasks: [TaskInp]!, $dateUp: String!, $time: String!, $region: String!, $cords: ICord!, $role: String!) {
            createWorkshop(username: $username, id: $id, title: $title, category: $category, tasks: $tasks, dateUp: $dateUp, time: $time, region: $region, cords: $cords, role: $role)
        }
    `

    const [createWorkshop] = useMutation(createWorkshopM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.createWorkshop)
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

    useMemo(() => {
        setState({...state, dateUp: datus.move('day', '+', dateIdx, 'default')})
    }, [dateIdx])

    useMemo(() => {
        setState({...state, time: centum.time(timer, 'convert')})
    }, [timer])

    const onTask = () => {
        if (tasks.find(el => centum.search([el.headline, headline], 50)) === undefined) {
            setState({...state, tasks: [...tasks, task]})
        }

        setTask({
            id: shortid.generate().toString(),
            headline: '',
            level: LEVELS[0],
            progress: 0
        })
    }

    const onCreate = () => {
        createWorkshop({
            variables: {
                username: context.username, id: params.id, title, category, tasks, dateUp, time, region, cords, role
            }
        })
    }
    
    return (
        <div className='main'>          
            <FormPagination label='Создайте семинар' num={idx} setNum={setIdx} items={[
                    <>
                        <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название семинара' type='text' />
                        <h3>Тип и роль</h3>
                        <div className='items small'>
                            {ATTAINMENT_TYPES.map((el: string) => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>
                        <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                            {ROLES.map(el => <option value={el}>{el}</option>)}
                        </select>
                    </>,
                    <>
                        <h2>Место и время</h2>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Ближайший город' type='text' />
                       
                        <div className='items half'>
                            <QuantityLabel num={dateIdx} setNum={setDateIdx} min={0} part={1} label={`Текущая дата: ${dateUp}`} />
                            <QuantityLabel num={timer} setNum={setTimer} part={30} label={`Начало в ${time}`} />
                        </div>

                        <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token} className='map'>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        </ReactMapGL>  
                    </>,
                    <>
                        <h2>Задачи семинара</h2>
                        <textarea value={headline} onChange={e => setTask({...task, headline: e.target.value})} placeholder='Текст задачи...' />
                        <select value={level} onChange={e => setTask({...task, level: e.target.value})}>
                            {LEVELS.map(el => <option value={el}>{el}</option>)}
                        </select>
                        <button onClick={onTask} className='pale'>Добавить</button>
                    </>
                ]} 
            />

            <button onClick={onCreate}>Создать</button>
        </div>
    )
}

export default CreateWorkshop