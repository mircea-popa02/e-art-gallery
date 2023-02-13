import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


// ReactDOM.createRoot is not a function



// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <App />
// );


const rootNode = document.getElementById('root');
ReactDOM.render(<App />, rootNode);



