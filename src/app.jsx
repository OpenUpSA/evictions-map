import React from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';

import { Map} from './components/Map';

import './app.scss';

// const urlParams = new URLSearchParams(window.location.search);
// const version = urlParams.get('version');
const version = process.env.MAP_VERSION;

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
            <Map version={version}/>
        )
    }

}

let container;

if(version === 'widget') {
    container = document.getElementsByClassName('officemap-widget')[0];
} else {
    container = document.getElementsByClassName('officemap')[0];
}
const root = createRoot(container);
root.render(<App />);