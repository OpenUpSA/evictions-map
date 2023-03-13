import React from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';

import { Map} from './components/Map';
import './app.scss';

export class App extends React.Component {


    constructor(){
        super();
        this.state = {
        }
        
    }

    componentDidMount() {
        


    }

    componentDidUpdate() {}

    render() {
        return (
            <Map />
        )
    }

}


const container = document.getElementsByClassName('officemap-widget')[0];
const root = createRoot(container);
root.render(<App />);