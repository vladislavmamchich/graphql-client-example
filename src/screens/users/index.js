import React, { useState } from 'react'

import { useQuery, useMutation } from 'react-apollo'
import MaterialTable from 'material-table'

import { forwardRef } from 'react'

import { useSnackbar } from 'notistack'
import { Input } from '@material-ui/core'

import AddBox from '@material-ui/icons/AddBox'
import Check from '@material-ui/icons/Check'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Clear from '@material-ui/icons/Clear'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Edit from '@material-ui/icons/Edit'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'

import { USERS, CREATE_USER, UPDATE_USER, DELETE_USER } from './queries'

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
        <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
        <ChevronLeft {...props} ref={ref} />
    )),
}
const columns = [
    {
        title: 'Name',
        field: 'name',
        editComponent: (props) => (
            <Input
                autoFocus
                type="text"
                defaultValue={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                placeholder="Name"
            />
        ),
    },
    { title: 'Email', field: 'email' },
]

function Users() {
    const [users, setUsers] = useState([])
    const { enqueueSnackbar } = useSnackbar()

    const onCompleted = (data) => {
        if (data && data.users) {
            setUsers(data.users)
        }
    }

    const { loading, error, fetchMore } = useQuery(USERS, {
        variables: { skip: 0, limit: 10 },
        onCompleted: (data) => onCompleted(data),
    })

    const [createUser] = useMutation(CREATE_USER, {
        onCompleted: (data) => {
            if (data && data.createUser) {
                setUsers((prevState) => {
                    const users = [...prevState]
                    users.push(data.createUser)
                    return users
                })
            }
        },
        onError: ({
            networkError: {
                result: { errors },
            },
        }) => enqueueSnackbar(errors[0].message, { variant: 'warning' }),
    })

    const [updateUser] = useMutation(UPDATE_USER, {
        onCompleted: (data) => {
            if (data && data.updateUser) {
                setUsers((prevState) => {
                    const users = [...prevState]
                    const index = users.findIndex(
                        (u) => u.id === data.updateUser.id
                    )
                    users.splice(index, 1, data.updateUser)
                    return users
                })
            }
        },
        onError: ({
            networkError: {
                result: { errors },
            },
        }) => enqueueSnackbar(errors[0].message, { variant: 'warning' }),
    })

    const [deleteUser] = useMutation(DELETE_USER, {
        onCompleted: (data) => {
            if (data && data.deleteUser) {
                setUsers((prevState) => {
                    let users = [...prevState]
                    users = users.filter((u) => u.id !== data.deleteUser.id)
                    return users
                })
            }
        },
    })

    const handleScroll = ({ target }) => {
        if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
            fetchMore({
                variables: {
                    skip: users.length,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev
                    setUsers([...users, ...fetchMoreResult.users])
                },
            })
        }
    }

    if (error) return <p>Error :(</p>
    if (loading) return <p>Loading...</p>

    return (
        <div onScroll={(e) => handleScroll(e)}>
            <MaterialTable
                isLoading={loading}
                icons={tableIcons}
                title="Users"
                columns={columns}
                data={users}
                editable={{
                    onRowAdd: ({ name, email }) =>
                        new Promise(async (resolve, reject) => {
                            const res = await createUser({
                                variables: { name, email },
                            })
                            if (!res) {
                                reject()
                            }
                            resolve()
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise(async (resolve, reject) => {
                            const res = await updateUser({
                                variables: {
                                    id: oldData.id,
                                    name: newData.name,
                                    email: newData.email,
                                },
                            })
                            if (!res) {
                                reject()
                            }
                            resolve()
                        }),

                    onRowDelete: ({ id }) =>
                        deleteUser({
                            variables: { id },
                        }),
                }}
                detailPanel={(rowData) => (
                    <div style={{ padding: '20px' }}>
                        Detail: {JSON.stringify(rowData, null, 3)}
                    </div>
                )}
                options={{
                    search: false,
                    headerStyle: {
                        backgroundColor: '#eee',
                        fontWeight: 700,
                    },
                    paging: false,
                    maxBodyHeight: '90vh',
                    addRowPosition: 'first',
                }}
                onRowClick={(event, rowData, togglePanel) => togglePanel()}
            />
        </div>
    )
}

export default Users
