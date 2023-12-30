import React, {useState, useMemo, useContext} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation, gql} from '@apollo/react-hooks'
import {useDispatch} from 'react-redux'
import {BUILDING_TYPES, LEVELS, VIEW_CONFIG, token} from '../../env/env'
import TOWNS from '../../env/towns.json'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import {update} from '../../store/slices/MarathonSlice'
import DataPagination from '../UI&UX/DataPagination'
import CloseIt from '../UI&UX/CloseIt'
import ImageLoader from '../UI&UX/ImageLoader'
import ImageLook from '../UI&UX/ImageLook'
import MapPicker from '../UI&UX/MapPicker'
import Loading from '../UI&UX/Loading'
import {CollectionPropsType} from '../../types/types'

const Miracle: React.FC<CollectionPropsType> = ({params}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [cords, setCords] = useState(TOWNS[0].cords)
    const [image, setImage] = useState<string>('')
    const [points, setPoints] = useState<number>(0)
    const [buildings, setBuildings] = useState<any[]>([])
    const [building, setBuilding] = useState<any | null>(null)
    const [question, setQuestion] = useState<any | null>(null)
    const [miracle, setMiracle] = useState<any | null>(null)
    const [state, setState] = useState<any>({
        text: '',
        level: LEVELS[0],
        answer: '',
        title: '',
        category: BUILDING_TYPES[0],
        rating: 50
    })

    const {text, level, answer, title, category, rating} = state

    const dispatch = useDispatch()

    const centum = new Centum()

    const getMiracleM = gql`
        mutation getMiracle($username: String!, $shortid: String!) {
            getMiracle(username: $username, shortid: $shortid) {
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

    const makeMiracleQuestionM = gql`
        mutation makeMiracleQuestion($username: String!, $id: String!, $text: String!, $level: String!, $answer: String!) {
            makeMiracleQuestion(username: $username, id: $id, text: $text, level: $level, answer: $answer)
        }
    `

    const updateMiracleRatingM = gql`
        mutation updateMiracleRating($username: String!, $id: String!, $rating: Float!) {
            updateMiracleRating(username: $username, id: $id, rating: $rating)
        }
    `

    const manageMiracleBuildingM = gql`
        mutation manageMiracleBuilding($username: String!, $id: String!, $option: String!, $title: String!, $category: String!, $cords: ICord!, $photo_url: String!, $coll_id: String!) {
            manageMiracleBuilding(username: $username, id: $id, option: $option, title: $title, category: $category, cords: $cords, photo_url: $photo_url, coll_id: $coll_id)
        }
    `

    const [manageMiracleBuilding] = useMutation(manageMiracleBuildingM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.manageMiracleBuilding)
            window.location.reload()
        }
    })

    const [updateMiracleRating] = useMutation(updateMiracleRatingM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.updateMiracleRating)
            window.location.reload()
        }
    })

    const [makeMiracleQuestion] = useMutation(makeMiracleQuestionM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.makeMiracleQuestion)
            window.location.reload()
        }
    })

    const [getMiracle] = useMutation(getMiracleM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.getMiracle)
            setMiracle(data.getMiracle)
        }
    })

    useMemo(() => {
        if (context !== null) {
            getMiracle({
                variables: {
                    username: context.username, shortid: params.id
                }
            })
        }
    }, [])

    useMemo(() => {
        if (miracle !== null) {
            setState({...state, rating: miracle.rating})
            setCords(miracle.cords)        
        }
    }, [miracle])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 17})
    }, [cords])

    useMemo(() => {
        setState({...state, answer: ''})
    }, [question])

    const onGenQuestion = () => {
        let result = centum.random(miracle.questions)?.value

        if (result !== undefined) {
            setQuestion(result)
        }
    }

    const onCheckQuestion = () => {
        let award = LEVELS.indexOf(question.level) + 1

        if (centum.search([question.answer, answer], 100)) {
            setPoints(points + award)
        }
    
        setQuestion(null)
    }
    
    const onManageBuilding = (option: string) => {
        manageMiracleBuilding({
            variables: {
                username: context.username, id: params.id, option, title, category, cords: {lat: cords.lat, long: cords.long}, photo_url: image, coll_id: building !== null ? building.shortid : ''
            }
        })
    }

    const onMakeQuestion = () => {
        makeMiracleQuestion({
            variables: {
                username: context.username, id: params.id, text, level, answer
            }
        })
    }

    const onUpdateRating = () => {
        updateMiracleRating({
            variables: {
                username: context.username, id: params.id, rating
            }
        })
    }

    return (
        <>         
            {miracle !== null &&
                <>
                    <h1>{miracle.title}</h1>
                    <div className='items small'>
                        <h4 className='pale'>Тип: {miracle.category}</h4>
                        <h4 className='pale'>Рейтинг - <b>{rating}%</b></h4>
                    </div>
                   
                    <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />
                    <button onClick={onUpdateRating} className='light-btn'>Оценить</button>
                    
                    {question === null ? 
                            <>
                                <h2>Задайте вопрос</h2>
                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Формулировка вопроса...' />
                                <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                    {LEVELS.map(el => <option value={el}>{el}</option>)}
                                </select>
                                <input value={answer} onChange={e => setState({...state, answer: e.target.value})} placeholder='Правильный ответ' type='text' />
                                <div className='items small'>
                                    <button onClick={onGenQuestion}>Сгенерировать</button>
                                    <button onClick={onMakeQuestion}>Опубликовать</button>
                                </div>
                              
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setQuestion(null)} />
                                <h2>Узнайте больше, ответив на вопрос ({points} очков)</h2>
                                <h3 className='pale'>{question.text}</h3>
                                <input value={answer} onChange={e => setState({...state, answer: e.target.value})} placeholder='Правильный ответ' type='text' />
                                <button onClick={onCheckQuestion} className='light-btn'>Проверить</button>
                            </>
                    }

                {building === null ?
                        <>
                            <h2>Карта построек</h2>
                            <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название здания' type='text' />
                            <div className='items small'>
                                {BUILDING_TYPES.map((el: string) => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                            </div>
                            <ImageLoader setImage={setImage} />
                            <button onClick={() => onManageBuilding('create')}>Создать</button>
                            <DataPagination initialItems={miracle.buildings} setItems={setBuildings} />
                        </>
                    :
                        <>
                            <CloseIt onClick={() => setBuilding(null)} />
                            {building.photo_url !== '' && <ImageLook src={building.photo_url} className='photo_item' alt='фото здания' />}
                            <h2>{building.title}</h2>
                            <div className='items small'>
                                <h4 className='pale'>Стиль: {building.category}</h4>
                                <h4 className='pale'><b>{building.likes}</b> лайков</h4>
                            </div>

                            <h3 className='pale'>Добавьте постройку в марафон</h3>
                            <button onClick={() => dispatch(update(building.cords))} className='pale'>+</button>

                            {context.username === building.name ? 
                                    <button onClick={() => onManageBuilding('delete')}>Удалить</button>
                                :
                                    <button onClick={() => onManageBuilding('like')}>Нравится</button>
                            }
                        </>
                    } 
                  
                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token} className='map'>
                        <Marker latitude={miracle.cords.lat} longitude={miracle.cords.long}>
                            <MapPicker type='home' />
                        </Marker>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                        {buildings.map((el: any) => 
                            <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                                <b onClick={() => setBuilding(el)}>{centum.shorter(el.title)}</b>
                            </Marker>    
                        )}
                    </ReactMapGL>                    
                </>
            }
            {miracle === null && <Loading />}
        </>
    )
}

export default Miracle