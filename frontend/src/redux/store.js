import {configureStore} from '@reduxjs/toolkit'

const store = configureStore({
    reducer : {
        
    },
    middleware : (getdefaultmiddleware)=> getdefaultmiddleware().concat()
})
export default store