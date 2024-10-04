import { render } from 'preact'
import  App  from './app.jsx'
import './index.css'
import {createBrowserRouter , createRoutesFromElements , Route} from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App/>}>

        </Route>
    )
)

render(<RouterProvider router={router}/>, document.getElementById('app'))
