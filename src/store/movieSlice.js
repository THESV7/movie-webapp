import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    bannerData : [],
    imageURL: "",
    error: false
}

export const movieSlice = createSlice({
    name : 'movie',
    initialState,
    reducers : {
        setBannerData : (state, action) => {
            state.bannerData = action.payload
        },
        setImageURL : (state, action) => {
            state.imageURL = action.payload
        },
        setError : (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setBannerData, setImageURL, setError } = movieSlice.actions

export default movieSlice.reducer