import React from 'react';
import ReactDOM from 'react-dom';
import { App } from '../src/components/App';
import reportWebVitals from './reportWebVitals';
import './styles/styles.css';
import { client } from './apollo';
import { ApolloProvider } from '@apollo/client';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
