import PersonalProfileInfo from './PersonalProfileInfo'
import GeoProfileInfo from './GeoProfileInfo'
import ProfileSecurity from './ProfileSecurity'
import ProfileAttainments from './ProfileAttainments'
import ProfileExercises from './ProfileExercises'
import ProfileMarathon from './ProfileMarathon'
import ProfileComponents from './ProfileComponents'
import {AccountPageComponentType} from '../../types/types'


const components: AccountPageComponentType[] = [
    {
        title: 'Profile',
        icon: 'https://img.icons8.com/ios/50/edit-user-male.png',
        component: PersonalProfileInfo
    },
    {
        title: 'Location',
        icon: 'https://img.icons8.com/ios/50/marker.png',
        component: GeoProfileInfo
    },
    {
        title: 'Security',
        icon: 'https://img.icons8.com/ios/50/fingerprint--v1.png',
        component: ProfileSecurity
    },
    {
        title: 'Attainments',
        icon: 'https://img.icons8.com/ios/50/project-management.png',
        component: ProfileAttainments
    },
    {
        title: 'Exercises',
        icon: 'https://img.icons8.com/ios/50/curls-with-dumbbells.png',
        component: ProfileExercises
    },
    {
        title: 'Marathon',
        icon: 'https://img.icons8.com/ios/50/exercise.png',
        component: ProfileMarathon
    },
    {
        title: 'Components',
        icon: 'https://img.icons8.com/dotty/80/list.png',
        component: ProfileComponents
    }
]

export const default_component = components[0]

export default components