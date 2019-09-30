import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getListByPage } from '../../utils/api'
import Loading from '../Loading'
// bootstrap
import { Row, Col, Button, Table } from 'react-bootstrap'

class ViewList extends Component {

    state = {
        loading: true,
        count: '',
        pages: '',
        results: {}
    }

    componentDidMount() {
        let self = this
        const { match: { params } } = this.props

        getListByPage({ list: params.list, page: params.page })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                this.setState({
                    count: res.count,
                    pages: res.pages,
                    results: res.result,
                    loading: false
                })
            })
    }

    render() {

        const { match: { params } } = this.props
        const { loading, pages, count, results } = this.state

        if (loading) {
            return <Loading />
        }

        return (
            <Row style={{ marginTop: 40 }}>
                <Col md={{ span: 10, offset: 1 }}>
                    <h6>Total: {count} | Total de páginas: {pages}</h6>
                    <h3>Lista de {
                        params.list == 'bloqueadas'
                            ?
                            'Personas Bloqueadas'
                            :
                            params.list == 'sancionadas'
                                ?
                                'Personas Sancionadas (OFAC)'
                                :
                                params.list == 'boletinadas'
                                    ?
                                    'Personas Boletinadas'
                                    :
                                    params.list == 'peps'
                                        ?
                                        'Personas Políticamente Expuestas (PEPs)'
                                        :
                                        null
                    }</h3>
                    <Table striped bordered hover style={{ marginTop: 20 }}>
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>Nombre</td>
                                <td>Tipo Persona</td>
                                <td>País</td>
                                <td>Motivo</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                results.length > 0
                                    ?
                                    Object.values(results).map((p) => (

                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td>{p.name}</td>
                                            <td>{p.personType}</td>
                                            <td>{p.motive}</td>
                                            <td>{p.country}</td>
                                        </tr>
                                    ))
                                    :
                                    <tr>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                    {
                        parseInt(params.page) > 1
                            ?
                            <Link to={'/admin/lista/' + params.list + '/' + (parseInt(params.page) - 1)}>
                                <Button variant="secondary">Página anterior</Button>
                            </Link>
                            :
                            null
                    }
                    <Link to={'/admin/lista/' + params.list + '/' + (parseInt(params.page) + 1)}>
                        <Button style={{marginLeft: 10}}>Página siguiente</Button>
                    </Link>

                </Col>
            </Row>
        )
    }
}

function mapStateToProps() {
    return {

    }
}

export default connect(mapStateToProps)(ViewList)