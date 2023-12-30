import React, {useState, useMemo, useContext} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation, gql} from '@apollo/react-hooks'
import {ROLES, IMAGE_TYPES, VIEW_CONFIG, token} from '../../env/env'
import TOWNS from '../../env/towns.json'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import DataPagination from '../UI&UX/DataPagination'
import CloseIt from '../UI&UX/CloseIt'
import ImageLoader from '../UI&UX/ImageLoader'
import ImageLook from '../UI&UX/ImageLook'
import MapPicker from '../UI&UX/MapPicker'
import Loading from '../UI&UX/Loading'
import {CollectionPropsType} from '../../types/types'

const Workshop: React.FC<CollectionPropsType> = ({params}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [cords, setCords] = useState({lat: 0, long: 0})
    const [images, setImages] = useState<any[]>([])
    const [workshop, setWorkshop] = useState<any | null>(null)
    const [personanity, setPersonanity] = useState<any | null>(null)
    const [task, setTask] = useState<any | null>(null)
    const [image, setImage] = useState<any | null>(null)
    const [piece, setPiece] = useState<number>(1)
    const [photo, setPhoto] = useState<string>('')
    const [state, setState] = useState<any>({
        role: ROLES[0],
        title: '',
        category: IMAGE_TYPES[0]
    })

    const {role, title, category} = state

    const centum = new Centum()

    const getWorkshopM = gql`
        mutation getWorkshop($username: String!, $shortid: String!) {
            getWorkshop(username: $username, shortid: $shortid) {
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

    const manageWorkshopStatusM = gql`
        mutation manageWorkshopStatus($username: String!, $id: String!, $option: String!, $role: String!, $task: String!) {
            manageWorkshopStatus(username: $username, id: $id, option: $option, role: $role, task: $task)
        }
    `

    const updateWorkshopTaskM = gql`
        mutation updateWorkshopTask($username: String!, $id: String!, $coll_id: String!, $piece: Float!) {
            updateWorkshopTask(username: $username, id: $id, coll_id: $coll_id, piece: $piece)
        }
    `

    const manageWorkshopImageM = gql`
        mutation manageWorkshopImage($username: String!, $id: String!, $option: String!, $title: String!, $category: String!, $photo_url: String!, $coll_id: String!) {
            manageWorkshopImage(username: $username, id: $id, option: $option, title: $title, category: $category, photo_url: $photo_url, coll_id: $coll_id)
        }
    `

    const [manageWorkshopImage] = useMutation(manageWorkshopImageM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.manageWorkshopImage)
            window.location.reload()
        }
    })

    const [updateWorkshopTask] = useMutation(updateWorkshopTaskM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.updateWorkshopTask)
            window.location.reload()
        }
    })

    const [manageWorkshopStatus] = useMutation(manageWorkshopStatusM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.manageWorkshopStatus)
            window.location.reload()
        }
    })

    const [getWorkshop] = useMutation(getWorkshopM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.getWorkshop)
            setWorkshop(data.getWorkshop)
        }
    })

    useMemo(() => {
        if (context !== null) {
            getWorkshop({
                variables: {
                    username: context.username, shortid: params.id
                }
            })
        }
    }, [])

    useMemo(() => {
        if (workshop !== null) {
            let result = workshop.members.find((el: any) => centum.search([el.account_id, context.account_id], 100))

            if (result !== undefined) {
                setPersonanity(result)
            }

            setCords(workshop.cords)        
        }
    }, [workshop])

    useMemo(() => {
        if (personanity !== null) {
            setState({...state, role: personanity.role})
        }
    }, [personanity])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 18})
    }, [cords])

    useMemo(() => {
        if (workshop !== null && task !== null) {
            let length: number = workshop.members.length
            let percent = 100 - task.progress

            let result = centum.percent(Math.floor(100 / length), percent, 0)

            setPiece(result)
        }
    }, [task])
    
    const onManageStatus = (option: string) => {
        manageWorkshopStatus({
            variables: {
                username: context.username, id: params.id, option, role, task: task !== null ? task.headline : '' 
            }
        })
    }

    const onUpdateTask = () => {
        updateWorkshopTask({
            variables: {
                username: context.username, id: params.id, coll_id: task !== null ? task.id : '', piece
            }
        })
    }

    const onManageImage = (option: string) => {
        manageWorkshopImage({
            variables: {
                username: context.username, id: params.id, option, title, category, photo_url: photo, coll_id: image !== null ? image.shortid : ''
            }
        })
    }

    return (
        <>         
            {workshop !== null && personanity === null && 
                <>
                    <h1>Добро пожаловать на семинар</h1>
                    <div className='items small'>
                        <h4 className='pale'>Дата: {workshop.dateUp}</h4>
                        <h4 className='pale'>Время: {workshop.time}</h4>
                    </div>
                    <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                        {ROLES.map(el => <option value={el}>{el}</option>)}
                    </select>
                    <div className='items half'>
                        {workshop.tasks.map((el: any) => 
                            <div onClick={() => setTask(el)} className='item card'>
                                <h4 className='pale'>{centum.shorter(el.headline)}</h4>
                                <p>{el.level}</p>
                            </div>
                        )}
                    </div>
                    <button onClick={() => onManageStatus('join')}>Присоединиться</button>
                </>
            }
            {workshop !== null && personanity !== null && 
                <>
                    <h1>{workshop.title}</h1>
                    <div className='items small'>
                        <h4 className='pale'>Дата: {workshop.dateUp}</h4>
                        <h4 className='pale'>Время: {workshop.time}</h4>
                    </div>

                    <h2>Личная информация</h2>
                    <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                        {ROLES.map(el => <option value={el}>{el}</option>)}
                    </select>
                    <div className='items small'>
                        <button onClick={() => onManageStatus('exit')}>Выйти</button>
                        <button onClick={() => onManageStatus('update')}>Обновить</button>
                    </div>

                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token} className='map'>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL>    

                    <h2>Задачи</h2>
                    <div className='items half'>
                        {workshop.tasks.map((el: any) => 
                            <div onClick={() => setTask(el)} className='item card'>
                                <h4 className='pale'>{centum.shorter(el.headline)}</h4>
                            </div>
                        )}
                    </div>

                    {task !== null &&
                        <>
                            <CloseIt onClick={() => setTask(null)} />
                            <h2>Задача: {task.headline}</h2>
                            <div className='items small'>
                                <h4 className='pale'>Сложность: {task.level}</h4>
                                <h4 className='pale'>Прогресс: <b>{task.progress}%</b></h4>
                            </div>

                            <button onClick={onUpdateTask}>Выполнить на {piece}</button>
                        </>
                    }

                    <h2>Галерея</h2>
                    <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Подпись фото' type='text' />
                    <select value={category} onChange={e => setState({...state, category: e.target.value})}>
                        {IMAGE_TYPES.map(el => <option value={el}>{el}</option>)}
                    </select>
                    <ImageLoader setImage={setPhoto} />
                    <button onClick={() => onManageImage('create')}>Опубликовать</button>
                    <DataPagination initialItems={workshop.images} setItems={setImages} />
                    <div className='items half'>
                        {images.map(el => 
                            <div onClick={() => setImage(el)} className='item card'>
                                <h4>{centum.shorter(el.title)}</h4>
                            </div>
                        )}
                    </div>

                    {image !== null &&
                        <>
                            <CloseIt onClick={() => setImage(null)} />
                            {image.photo_url !== '' && <ImageLook src={image.photo_url} className='photo_item' alt='фото' />}
                            <h2>{image.title}</h2>
                            <div className='items small'>
                                <h4 className='pale'>Устройство: {image.category}</h4>
                                <h4 className='pale'><b>{image.likes}</b> лайков</h4>
                            </div>
                            
                            {context.username === image.name ? 
                                    <button onClick={() => onManageImage('delete')}>Удалить</button>
                                :
                                    <button onClick={() => onManageImage('like')}>Нравится</button>
                            }
                        </> 
                    }
                </>
               
            }
            {workshop === null && <Loading />}
        </>
    )
}

export default Workshop