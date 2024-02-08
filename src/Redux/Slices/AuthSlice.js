import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";
const initialState = {
    isLoggedIn:localStorage.getItem('isLoggedIn') === 'true' || false
}

export const login = createAsyncThunk('/login', async(loginData) => {
    try{
        const response = axiosInstance.post('/login', loginData);
        toast.promise(response,{
            loading:'Wait for loggin !!',
            success:'Successfully Logged in',
            error:'Error in log you in! Try again later'
        })

        return (await response).data;
    }catch(e){
        toast.error(e?.response?.data?.message);
    }
})

export const signup = createAsyncThunk('/signup', async(signupData) =>{
    try{
        const response = axiosInstance.post('/signup', signupData);
        toast.promise(response,{
            loading:'Creating a new Account !!',
            success:'Successfully Logged in',
            error:'Error in creating a new account! Try again later'
        })

        return (await response).data;
    }catch(e){
        toast.error(e?.response?.data?.message);
    }
})

export const logout = createAsyncThunk('logout', async() => {
    try {
        const response = axiosInstance.post('/logout');
        toast.promise(response,{
            loading:'Logging out',
            success:'Successfully Logged Out',
            error:'Try Again later'
        })
        return (await response).data;   
    }catch(e){
        toast.error(e?.response?.data?.message);
    }
})

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(login.fulfilled , (state,action)=> {    
            localStorage.setItem('isLoggedIn', true);
            state.isLoggedIn = true;
        })
        .addCase(signup.fulfilled , (state,action)=> {    
            localStorage.setItem('isLoggedIn', true);
            state.isLoggedIn = true;
        })
        .addCase(logout.fulfilled , (state,action) => {
            localStorage.setItem('isLoggedIn', false);
            state.isLoggedIn = false;
        })
    }
})

export default authSlice.reducer;