import React, { useEffect, useState } from 'react'
import { getFetchUsers } from '../../store/slices/API'
import { useDispatch } from 'react-redux'

function Users() {

    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(getFetchUsers())
    }, [])


    return (
        <div className='users'>
            <h1>all users</h1>
        </div>
    )
}

export default Users
