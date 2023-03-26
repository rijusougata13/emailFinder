export default (state, action) =>{
	switch(action.type){
    case 'EDIT_DETAILS':
			return {
				...state,
				searchDetails: action.payload
			}
		

		default:
			return state;
	}
}