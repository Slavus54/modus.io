import React, {useState, useContext} from 'react';
import {useMutation, gql} from '@apollo/react-hooks';
import {LEVELS, ATTAINMENT_TYPES} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import FormPagination from '../UI&UX/FormPagination'

type Props = {
    params: {
        id: string
    }
}

type FormType = {
    title: string
    category: string
    level: string
    directions: string[]
}

const CreateLecture: React.FC<Props> = ({params}) => {
    const {context} = useContext<any>(Context)
    const [idx, setIdx] = useState(0)
    const [direction, setDirection] = useState('')
    const [state, setState] = useState<FormType>({
        title: '', 
        category: ATTAINMENT_TYPES[0], 
        level: LEVELS[0], 
        directions: []
    })

    const centum = new Centum()

    const {title, category, level, directions} = state

    const createLectureM = gql`
        mutation createLecture($username: String!, $id: String!, $title: String!, $category: String!, $level: String!, $directions: [String]!) {
            createLecture(username: $username, id: $id, title: $title, category: $category, level: $level, directions: $directions)
        }
    `

    const [createLecture] = useMutation(createLectureM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.createLecture)
            window.location.reload()
        }
    })

    const onDirection = () => {
        if (directions.find(el => centum.search([el, direction], 100)) === undefined) {
            setState({...state, directions: [...directions, direction]})
        }

        setDirection('')
    }

    const onCreate = () => {
        createLecture({
            variables: {
                username: context.username, id: params.id, title, category, level, directions
            }
        })
    }
    
    return (
        <div className='main'>          
            <FormPagination label='Создайте лекцию' num={idx} setNum={setIdx} items={[
                    <>
                        <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название лекции' type='text' />
                        <div className='items small'>
                            {ATTAINMENT_TYPES.map((el: string) => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>
                        <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                            {LEVELS.map(el => <option value={el}>{el}</option>)}
                        </select>
                    </>,
                    <>
                        <h2>Направления</h2>
                        <textarea value={direction} onChange={e => setDirection(e.target.value)} placeholder='О чём это?' />
                        <button onClick={onDirection}>Добавить</button>
                    </>
                ]} 
            />

            <button onClick={onCreate}>Создать</button>
        </div>
    )
}

export default CreateLecture