import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'
import { SnackbarProvider } from 'notistack'

const { REACT_APP_SERVER } = process.env

const client = new ApolloClient({
	uri: REACT_APP_SERVER,
})

ReactDOM.render(
	<ApolloProvider client={client}>
		<SnackbarProvider preventDuplicate maxSnack={3} hideIconVariant>
			<App />
		</SnackbarProvider>
	</ApolloProvider>,
	document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
