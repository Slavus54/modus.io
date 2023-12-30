import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals'
import ApolloClient from 'apollo-boost'
import {Provider} from 'react-redux'
import {ApolloProvider} from '@apollo/react-hooks'
import {WebProvider} from './context/WebProvider'
import store from './store/store'

const client: any = new ApolloClient({
  uri: 'https://modus-vivendi.onrender.com/graphql'
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <WebProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </WebProvider>
    </ApolloProvider>
  </React.StrictMode>
);

reportWebVitals()
