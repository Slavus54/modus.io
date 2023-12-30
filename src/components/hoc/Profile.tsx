import React, {useState, useMemo, useContext} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation, gql} from '@apollo/react-hooks'
import ProfilePhoto from '../../assets/profile_photo.jpg'
import {VIEW_CONFIG, token} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import DataPagination from '../UI&UX/DataPagination'
import ImageLook from '../UI&UX/ImageLook'
import CloseIt from '../UI&UX/CloseIt'
import MapPicker from '../UI&UX/MapPicker'
import Loading from '../UI&UX/Loading'
import {CollectionPropsType} from '../../types/types'

const Profile: React.FC<CollectionPropsType> = ({params}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [cords, setCords] = useState({lat: 0, long: 0})
    const [exercises, setExercises] = useState<any[]>([])
    const [exercise, setExercise] = useState<any | null>(null)
    const [attainments, setAttainments] = useState<any[]>([])
    const [attainment, setAttainment] = useState<any | null>(null)
    const [profile, setProfile] = useState<any | null>(null)
    const [rating, setRating] = useState<number>(50)

    const centum = new Centum()

    const getProfileM = gql`
        mutation getProfile($account_id: String!) {
            getProfile(account_id: $account_id) {
                account_id
                username
                security_code
                telegram_tag
                sex
                region
                cords {
                    lat
                    long
                }
                field
                attainments {
                    shortid
                    title
                    category
                    format
                    level
                    photo_url
                    likes
                }
                exercises {
                    shortid
                    text
                    category
                    weekday
                    repetitions
                    photo_url
                    rating
                }
                main_photo
                account_components {
                    shortid
                    title
                    path
                }
            }
        }
    `

    const manageProfileAttainmentM = gql`
        mutation manageProfileAttainment($account_id: String!, $option: String!, $title: String!, $category: String!, $format: String!, $level: String!, $photo_url: String!, $coll_id: String!) {
            manageProfileAttainment(account_id: $account_id, option: $option, title: $title, category: $category, format: $format, level: $level, photo_url: $photo_url, coll_id: $coll_id)
        }
    `

    const manageProfileExerciseM = gql`
        mutation manageProfileExercise($account_id: String!, $option: String!, $text: String!, $category: String!, $weekday: String!, $repetitions: Float!, $photo_url: String!, $rating: Float!, $coll_id: String!) {
            manageProfileExercise(account_id: $account_id, option: $option, text: $text, category: $category, weekday: $weekday, repetitions: $repetitions, photo_url: $photo_url, rating: $rating, coll_id: $coll_id) 
        }
    `

    const [manageProfileExercise] = useMutation(manageProfileExerciseM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.manageProfileExercise)
            window.location.reload()
        }
    })

    const [manageProfileAttainment] = useMutation(manageProfileAttainmentM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.manageProfileAttainment)
            window.location.reload()
        }
    })

    const [getProfile] = useMutation(getProfileM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.getProfile)
            setProfile(data.getProfile)
        }
    })

    useMemo(() => {
        if (context.account_id !== '') {
            getProfile({
                variables: {
                    account_id: params.id
                }
            })
        }
    }, [])

    useMemo(() => {
        if (profile !== null) {
            setCords(profile.cords)          
        }
    }, [profile])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 17})
    }, [cords])

    useMemo(() => {
        if (exercise !== null) {
            setRating(exercise.rating)
        }
    }, [exercise])

    const onLikeAttainment = () => {
        manageProfileAttainment({
            variables: {
                account_id: params.id, option: 'like', title: '', category: '', format: '', level: '', photo_url: '', coll_id: attainment.shortid
            }
        })
    }

    const onEstimateExercise = () => {
        manageProfileExercise({
            variables: {
                account_id: params.id, option: 'rate', text: '', category: '', weekday: '', repetitions: 0, photo_url: '', rating, coll_id: exercise.shortid 
            }
        })
    }

    return (
        <>         
            {profile !== null &&
                <>
                    <ImageLook src={profile.main_photo === '' ? ProfilePhoto : profile.main_photo} className='photo_item' alt='фото аккаунта' />
                    <h1>{profile.username}</h1>
                    <button onClick={() => centum.telegramLink(profile.telegram_tag)} className='light-btn'>Telegram</button>

                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token} className='map'>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL>      

                    <DataPagination initialItems={profile.attainments} setItems={setAttainments} label='Список достижений:' />
                    <div className='items half'>
                        {attainments.map(el => 
                            <div onClick={() => setAttainment(el)} className='item card'>
                                <h4>{centum.shorter(el.title)}</h4>
                            </div>
                        )}
                    </div>

                    {attainment !== null &&
                        <>
                            <CloseIt onClick={() => setAttainment(null)} />
                            {attainment.photo_url !== '' && <ImageLook src={attainment.photo_url} className='photo_item' alt='attainment photo' />}
                            <h2>{attainment.title}</h2>
                            <div className='item small'>
                                <h4 className='pale'>Тип: {attainment.category}</h4>
                                <h4 className='pale'><b>{attainment.likes}</b> лайков</h4>
                            </div>

                            <button onClick={onLikeAttainment}>Нравится</button>
                        </>
                    }

                    <DataPagination initialItems={profile.exercises} setItems={setExercises} label='Телесные занятия:' />
                    <div className='items half'>
                        {exercises.map(el => 
                            <div onClick={() => setExercise(el)} className='item card'>
                                <h4>{centum.shorter(el.text)}</h4>
                            </div>
                        )}
                    </div>

                    {exercise !== null &&
                        <>
                            <CloseIt onClick={() => setExercise(null)} />
                            {exercise.photo_url !== '' && <ImageLook src={exercise.photo_url} className='photo_item' alt='фото упражения' />}
                            <h3>{exercise.text}</h3>
                            <div className='items small'>
                                <h4 className='pale'>Тип: {exercise.category}</h4>
                                <h4 className='pale'><b>{exercise.repetitions}</b> повторений</h4>
                            </div>

                            <h3>Рейтинг - <b>{rating}%</b></h3>
                            <input value={rating} onChange={e => setRating(parseInt(e.target.value))} type='range' step={1} />
                            <button onClick={onEstimateExercise}>Оценить</button>
                        </>
                    }
                </>
            }
            {profile === null && <Loading />}
        </>
    )
}

export default Profile