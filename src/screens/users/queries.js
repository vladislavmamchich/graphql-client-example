import { gql } from 'apollo-boost'

// export const USER = gql`
//     query User($id: ID!) {
//         user(id: $id) {
//             id
//             name
//             email
//         }
//     }
// `
export const USERS = gql`
    query Users($skip: Int, $limit: Int) {
        users(skip: $skip, limit: $limit) {
            id
            name
            email
        }
    }
`
export const CREATE_USER = gql`
    mutation CreateUser($name: String!, $email: Email!) {
        createUser(input: { name: $name, email: $email }) {
            id
            name
            email
        }
    }
`
export const UPDATE_USER = gql`
    mutation UpdateUser($id: ID!, $name: String!, $email: Email!) {
        updateUser(id: $id, input: { name: $name, email: $email }) {
            id
            name
            email
        }
    }
`
export const DELETE_USER = gql`
    mutation DeleteUser($id: ID!) {
        deleteUser(id: $id) {
            id
            name
            email
        }
    }
`
