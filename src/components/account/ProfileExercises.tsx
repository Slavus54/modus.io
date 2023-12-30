import React, {useState, useMemo} from 'react';
import {useMutation, gql} from '@apollo/react-hooks'
import {EXERCISE_TYPES} from '../../env/env'
import ImageLoader from '../UI&UX/ImageLoader'
import ImageLook from '../UI&UX/ImageLook'
import DataPagination from '../UI&UX/DataPagination'
import CloseIt from '../UI&UX/CloseIt'
//@ts-ignore
import {Datus, full_days} from 'datus.js'
//@ts-ignore
import Centum from 'centum.js'
import {AccountPageComponentProps} from '../../types/types'

const ProfileExercises = ({profile, context}: AccountPageComponentProps) => {
    const [exercises, setExercises] = useState<any[]>([])
    const [exercise, setExercise] = useState<any>(null)
    const [isExerToday, setIsExerToday] = useState<boolean>(false)
    const [image, setImage] = useState('')
    const datus = new Datus()
    const [state, setState] = useState({
        text: '', 
        category: EXERCISE_TYPES[0], 
        weekday: full_days[0],
        repetitions: 20
    })

    const centum = new Centum()

    const {text, category, weekday, repetitions} = state

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

    useMemo(() => {
        if (exercise !== null) {
            setImage(exercise.photo_url)
            setIsExerToday(datus.weekday === exercise.weekday)
        } else {
            setIsExerToday(false)
        }
    }, [exercise])
    
    const onManageExercise = (option: string) => {
        manageProfileExercise({
            variables: {
                account_id: context.account_id, option, text, category, weekday, repetitions, photo_url: image, rating: 100, coll_id: exercise === null ? '' : exercise.shortid
            }
        })
    }

    return (
        <>
            {exercise === null ? 
                    <>
                        <h1>Упражнения</h1>
                        <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Описание занятия...' />
                        <h3>Тип</h3>
                        <div className='items small'>
                            {EXERCISE_TYPES.map((el: string) => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>
                        <select value={weekday} onChange={e => setState({...state, weekday: e.target.value})}>
                            {full_days.map((el: string) => <option value={el}>{el}</option>)}
                        </select>
                        <h3>Повторений - <b>{repetitions}</b></h3>
                        <input value={repetitions} onChange={e => setState({...state, repetitions: parseInt(e.target.value)})} type='range' step={1} />
                        <ImageLoader setImage={setImage} />
                        <button onClick={() => onManageExercise('create')}>Добавить</button>
                        <DataPagination initialItems={profile.exercises} setItems={setExercises} />
                        <div className='items half'>    
                            {exercises.map(el => <div onClick={() => setExercise(el)} className='item card'>{centum.shorter(el.text)}</div>)}
                        </div>
                    </>
                :
                    <>
                        <CloseIt onClick={() => setExercise(null)} />
                        {image !== '' && <ImageLook src={image} className='photo_item' alt='фото упражения' />}
                        <h3>{exercise.text} ({isExerToday ? 'Сегодня' : exercise.weekday})</h3>
                        <div className='items small'>
                            <h4 className='pale'>Тип: {exercise.category}</h4>
                            <h4 className='pale'>Рейтинг: <b>{exercise.rating}%</b></h4>
                        </div>

                        <ImageLoader setImage={setImage} />

                        <div className='items small'>
                            <button onClick={() => onManageExercise('delete')}>Удалить</button>
                            <button onClick={() => onManageExercise('update')}>Обновить</button>
                        </div>
                    </>
            }
        </> 
    )
}

export default ProfileExercises