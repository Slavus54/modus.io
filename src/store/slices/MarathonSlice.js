import {createSlice} from '@reduxjs/toolkit'
import Centum from 'centum.js'

export const centum = new Centum()

export const marathonSlice = createSlice({
    name: 'marathon',
    initialState: {
        routes: [],
        cords: {
            lat: 0,
            long: 0
        },
        distance: 0
    },
    reducers: {
        init: (state, action) => {
            state.cords = action.payload
        },
        reset: (state) => {
            state.routes = []
            state.distance = 0
        },
        update: (state, action) => {
            let distance = centum.haversine([state.cords.lat, state.cords.long, action.payload.lat, action.payload.long], 3) * 1000

            state.routes = [...state.routes, action.payload]
            state.cords = action.payload
            state.distance += distance
        }
    }
})

export const {init, reset, update} = marathonSlice.actions

export default marathonSlice.reducer