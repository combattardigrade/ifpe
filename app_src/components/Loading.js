import React from 'react'
import { Row, Col, Spinner } from 'react-bootstrap'

function Loading(props) {
    return (
        <Row style={{ marginTop: 40 }}>
            <Col md={{ span: 8, offset: 2 }} style={{textAlign:'center'}}>
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </Col>
        </Row>
    )
}

export default Loading