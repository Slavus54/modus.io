import {configureStore} from '@reduxjs/toolkit'
import marathonReducer from './slices/MarathonSlice'

export default configureStore({
    reducer: {
        marathon: marathonReducer
    }
})