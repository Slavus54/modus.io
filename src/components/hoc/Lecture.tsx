import React, {useState, useMemo, useContext} from 'react';
import {useMutation, gql} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import {RESOURCE_TYPES, TOOL_TYPES} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import CloseIt from '../UI&UX/CloseIt'
import ImageLoader from '../UI&UX/ImageLoader'
import ImageLook from '../UI&UX/ImageLook'
import DataPagination from '../UI&UX/DataPagination'
import Loading from '../UI&UX/Loading'
import {CollectionPropsType} from '../../types/types'


const Lecture: React.FC<CollectionPropsType> = ({params}) => {
    const {context} = useContext<any>(Context)
    const [loc, setLoc] = useLocation()
    const [resources, setResources] = useState<any[]>([])
    const [manuscripts, setManuscripts] = useState<any[]>([])
    const [image, setImage] = useState('')
    const [lecture, setLecture] = useState<any>(null)
    const [manuscript, setManuscript] = useState<any>(null)
    const [direction, setDirection] = useState<any>(null)
    const [isCanSub, setIsCanSub] = useState<boolean>(false)
    const [state, setState] = useState({
        title: '',
        category: RESOURCE_TYPES[0],
        url: '',
        headline: '',
        tool: TOOL_TYPES[0],
        size: 20,
        rate: 50
    })

    const {title, category, url, headline, tool, size, rate} = state

    const centum = new Centum()

    const getLectureM = gql`
        mutation getLecture($username: String!, $shortid: String!) {
            getLecture(username: $username, shortid: $shortid) {
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

    const getProfileM = gql`
        mutation getProfile($account_id: String!) {
            getProfile(account_id: $account_id) {
                account_id
                username
                account_components {
                    shortid
                    title
                    path
                }
            }
        }
    `

    const makeLectureResourceM = gql`
        mutation makeLectureResource($username: String!, $id: String!, $title: String!, $category: String!, $url: String!) {
            makeLectureResource(username: $username, id: $id, title: $title, category: $category, url: $url)
        }
    `

    const manageLectureManuscriptM = gql`
        mutation manageLectureManuscript($username: String!, $id: String!, $option: String!, $headline: String!, $tool: String!, $size: Float!, $photo_url: String!, $coll_id: String!) {
            manageLectureManuscript(username: $username, id: $id, option: $option, headline: $headline, tool: $tool, size: $size, photo_url: $photo_url, coll_id: $coll_id)
        }
    `

    const subscribeLectureM = gql`
        mutation subscribeLecture($username: String!, $id: String!) {
            subscribeLecture(username: $username, id: $id)
        }
    `

    const [subscribeLecture] = useMutation(subscribeLectureM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.subscribeLecture)
            window.location.reload()
        }
    })

    const [manageLectureManuscript] = useMutation(manageLectureManuscriptM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.manageLectureManuscript)
            window.location.reload()
        }
    })

    const [makeLectureResource] = useMutation(makeLectureResourceM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.makeLectureResource)
            window.location.reload()
        }
    })

    const [getProfile] = useMutation(getProfileM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.getProfile)

            let result = data.getProfile.account_components.find((el: any) => centum.search([el.shortid, lecture.shortid], 100))

            setIsCanSub(result === undefined)
        }
    })

    const [getLecture] = useMutation(getLectureM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.getLecture)
            setLecture(data.getLecture)
        }
    })

    useMemo(() => {
        if (context !== null) {
            getLecture({
                variables: {
                    username: context.username, shortid: params.id
                }
            })
        }
    }, [])

    useMemo(() => {
        if (lecture !== null) {
            getProfile({
                variables: {
                    account_id: context.account_id
                }
            })
        }
    }, [lecture])

    useMemo(() => {
        setState({...state, rate: direction !== null ? direction.rate : 50})   
    }, [direction])

    const onView = (url: string) => {
        window.open(url)
    }
    
    const onMakeResource = () => {
        makeLectureResource({
            variables: {
                username: context.username, id: params.id, title, category, url
            }
        })
    }

    const onSub = () => {
        subscribeLecture({
            variables: {
                username: context.username, id: params.id
            }
        })
    }

    const onManageManuscript = (option: string) => {
        manageLectureManuscript({
            variables: {
                username: context.username, id: params.id, option, headline, tool, size, photo_url: image, coll_id: manuscript === null ? '' : manuscript.shortid
            }
        })
    }

    return (
        <>         
            {lecture !== null &&
                <>
                    <h1>{lecture.title}</h1>

                    {isCanSub && <button onClick={onSub} className='light-btn'>Подписаться</button>}
                    
                    <DataPagination initialItems={lecture.resources} setItems={setResources} label='Список ресурсов:' />
                    <div className='items half'>
                        {resources.map(el => 
                            <div onClick={() => onView(el.url)} className='item card'>
                                <h4>{centum.shorter(el.title)}</h4>
                            </div>
                        )}
                    </div>

                    <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Название ресурса' type='text' />
                    <select value={category} onChange={e => setState({...state, category: e.target.value})}>
                        {RESOURCE_TYPES.map(el => <option value={el}>{el}</option>)}
                    </select>
                    <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='URL' type='text' />
                    <button onClick={onMakeResource}>Добавить</button>
                  
                    <h2>Ваше эссе</h2>
                    <textarea value={headline} onChange={e => setState({...state, headline: e.target.value})} placeholder='Название заголовка' />
                    <select value={tool} onChange={e => setState({...state, tool: e.target.value})}>
                        {TOOL_TYPES.map(el => <option value={el}>{el}</option>)}
                    </select>
                    <h3>Кол-во предложений - <b>{size}</b></h3>
                    <input value={size} onChange={e => setState({...state, size: parseInt(e.target.value)})} type='range' step={1} />
                    <ImageLoader setImage={setImage} />
                    <button onClick={() => onManageManuscript('create')}>Опубликовать</button>
                    <DataPagination initialItems={lecture.manuscripts} setItems={setManuscripts} label='Рукописи:' />
                    <div className='items half'>
                        {manuscripts.map(el => 
                            <div onClick={() => setManuscript(el)} className='item card'>
                                <h4>{centum.shorter(el.headline)}</h4>
                            </div>
                        )}
                    </div>

                    {manuscript !== null &&
                        <>
                            <CloseIt onClick={() => setManuscript(null)} />
                            {manuscript.photo_url !== '' && <ImageLook src={manuscript.photo_url} className='photo_item' alt='фото рукописи' />}
                            <h3>{manuscript.headline}</h3>
                            <div className='items half'>
                                <h4 className='pale'>Инструмент: {manuscript.tool}</h4>
                                <h4 className='pale'><b>{manuscript.likes}</b> лайков</h4>
                                <h4 className='pale'>Размер: {manuscript.size} предложений</h4>
                            </div>
                            
                            {context.username === manuscript.name ? 
                                    <button onClick={() => onManageManuscript('delete')}>Удалить</button>
                                :
                                    <button onClick={() => onManageManuscript('like')}>Нравится</button>
                            }
                        </>
                    }

                    <h2>Направления</h2>
                    <div className='items half'>
                        {lecture.directions.map((el: any) => 
                            <div onClick={() => setDirection(el)} className='item card'>
                                <h4>{centum.shorter(el)}</h4>
                            </div>    
                        )}
                    </div>

                    {direction !== null &&
                        <>
                            <CloseIt onClick={() => setDirection(null)} />
                            <h2>{direction}</h2>
                        </>
                    }
                </>
            }
            {lecture === null && <Loading />}
        </>
    )
}

export default Lecture