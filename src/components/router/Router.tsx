import React, {useState} from 'react'
import {Route} from 'wouter'
import routes from '../../env/routes.json'
import RouterItem from './RouterItem'
import ReplicMenu from '../UI&UX/ReplicMenu'
import MenuProverb from '../UI&UX/MenuProverb'
import Home from '../hoc/Home'
import Register from '../hoc/Register'
import Login from '../hoc/Login'
import CreateLecture from '../hoc/CreateLecture'
import Lectures from '../hoc/Lectures'
import Lecture from '../hoc/Lecture'
import CreateWorkshop from '../hoc/CreateWorkshop'
import Workshops from '../hoc/Workshops'
import Workshop from '../hoc/Workshop'
import CreateMiracle from '../hoc/CreateMiracle'
import Miracles from '../hoc/Miracles'
import Miracle from '../hoc/Miracle'
import Profiles from '../hoc/Profiles'
import Profile from '../hoc/Profile'

interface Props {
    account_id: string
}

const Router = ({account_id}: Props) => {
    const [isVisible, setIsVisible] = useState(true)

    return (
        <>
            <ReplicMenu flag={isVisible} setFlag={setIsVisible} />

            <div className='navbar'>
                {isVisible ? 
                        routes.filter(el => account_id.length === 0 ? el.access_value < 1 : el.access_value > -1).map(el => <RouterItem title={el.title} url={el.url} />) 
                    : 
                        <MenuProverb />
                }         
            </div>
     
            <Route component={Home} path='/' /> 
            <Route component={Register} path='/register' />    
            <Route component={Login} path='/login' />  
            <Route component={CreateLecture} path='/create-lecture/:id' />  
            <Route component={Lectures} path='/lectures' />
            <Route component={Lecture} path='/lecture/:id' />
            <Route component={CreateWorkshop} path='/create-workshop/:id' />  
            <Route component={Workshops} path='/workshops' />  
            <Route component={Workshop} path='/workshop/:id' />  
            <Route component={CreateMiracle} path='/create-miracle/:id' />  
            <Route component={Miracles} path='/miracles' />
            <Route component={Miracle} path='/miracle/:id' />    
            <Route component={Profiles} path='/profiles' />
            <Route component={Profile} path='/profile/:id' />
        </>
    )
}

export default Router