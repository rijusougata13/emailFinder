import React, {createContext, useReducer} from 'react';
import searchParamReducer from './searchParamReducer';
//  init the state parameter

const initialState ={
    searchDetails:{
		
    }
}

// create the context

export const GlobalContext = createContext(initialState);

// create provider

export const GlobalProvider = ({children}) =>{
	 const [state,dispatch] = useReducer(searchParamReducer,initialState)

	 // actions functions
	 const editDetails = (value) =>{
       dispatch({
				 type: 'EDIT_DETAILS',
				 payload: value
			 })
	 }

	
	 
	 return (
		 <GlobalContext.Provider value={{
			 searchDetails: state.searchDetails,
			 editDetails,
		 }}> 
		 {children}
		 </GlobalContext.Provider>
	 )


}