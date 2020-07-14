import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import FilterTable from '../component/filterTable';
function AppRouter (props){
    return(
        <Router>
            <Switch>
                <Redirect exact path="/" to='/filter'/>
                <Route exact component={FilterTable} path='/filter' />
               
            </Switch>
        </Router>
    )
}
export default AppRouter;