import React from 'react'
import { Alert } from 'react-bootstrap'

function MyAlert(props) {
    return (
        <Alert show={props.serverRes != '' ? true : false} onClose={props.closeAlert} variant={props.error == true ? "danger" : "primary" } dismissible>
            {props.serverRes}
        </Alert>
    )
}

export default MyAlert