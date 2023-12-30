import React, {useState, useMemo, useContext} from 'react';
import {useMutation, gql} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import {LEVELS, ATTAINMENT_TYPES} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import DataPagination from '../UI&UX/DataPagination'
import Loading from '../UI&UX/Loading'

const Lectures = () => {
    const {context} = useContext<any>(Context)
    const [loc, setLoc] = useLocation()
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState(ATTAINMENT_TYPES[0])
    const [level, setLevel] = useState(LEVELS[0])
    const [isMyField, setIsMyField] = useState(false)
    const [lectures, setLectures] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])

    const centum = new Centum()

    const getLecturesM = gql`
        mutation getLectures($username: String!) {
            getLectures(username: $username) {
                shortid
                account_id
                username
                title
                category
                level
                directions
                resources {
                    shortid
                    name
                    title
                    category
                    url 
                }
                manuscripts {
                    shortid
                    name
                    headline
                    tool
                    size
                    photo_url
                    likes
                }
            }
        }
    `

    const [getLectures] = useMutation(getLecturesM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.getLectures)
            setLectures(data.getLectures)
        }
    })

    useMemo(() => {
        if (context.account_id !== '') {
            getLectures({
                variables: {
                    username: context.username
                }
            })
        }
    }, [])

    useMemo(() => {
        setCategory(isMyField ? context.field : ATTAINMENT_TYPES[0])
    }, [isMyField])

    useMemo(() => {
        if (lectures !== null) {
            let result = lectures.filter(el => el.category === category && el.level === level)

            if (title !== '') {
                result = result.filter(el => centum.search([el.title, title], 50))
            }

            setFiltered(result)
            setIsMyField(context.field === category)     
        }
    }, [lectures, title, category, level])
    
    return (
        <>         
            <h1>Найдите лучший материал</h1> 
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Название лекции' type='text' />
            <div className='items small'>
                {ATTAINMENT_TYPES.map((el: string) => <div onClick={() => setCategory(el)} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div>
            <div className='items small'>
                <select value={level} onChange={e => setLevel(e.target.value)}>
                    {LEVELS.map(el => <option value={el}>{el}</option>)}
                </select>
                <button onClick={() => setIsMyField(!isMyField)} className='pale'>{isMyField ? 'Моя' : 'Иная'} сфера</button>
            </div> 

            <DataPagination initialItems={filtered} setItems={setFiltered} />
            {lectures !== null &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div onClick={() => setLoc(`/lecture/${el.shortid}`)} className='item card'>
                            <h4>{el.title}</h4>
                        </div>
                    )}
                </div>
            }
            {lectures === null && <Loading />}
        </>
    )
}

export default Lectures