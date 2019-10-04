import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getAllReportsByPage, getCSRFToken, deleteReport } from '../../utils/api'
import Loading from '../Loading'
// bootstrap
import { Row, Col, Button, Table } from 'react-bootstrap'
// alert
import { withAlert } from 'react-alert'

class ListReports extends Component {

    state = {
        loading: true,
        count: '',
        pages: '',
        results: {},
        csrf: ''
    }

    componentDidMount() {
        document.title = 'Reportes | Sistema Automatizado'
        let self = this
        const { match: { params } } = this.props

        getAllReportsByPage({ page: params.page })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                self.setState({ loading: false, results: res.result, count: res.count, pages: res.pages })
            })
        getCSRFToken()
            .then(res => self.setState({ csrf: res.csrf }))
    }

    handleDeleteReport = (reporteId) => {
        if(!reporteId) 
            return this.props.alert.error("Ocurrió un error al intentar realizar la operación")
        const { csrf, results } = this.state       
        deleteReport({ reporteId, _csrf: csrf })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                if ('status' in res && res.status == 'OK') {
                    this.setState({ results: results.filter(r => r.id != reporteId)})
                } else {
                    this.props.alert.error(res.message)
                    return
                }
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
                    <h1></h1>
                    <Table striped bordered hover style={{ marginTop: 20 }}>
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>Nombre Archivo</td>
                                <td>Alias</td>
                                <td>Estado</td>
                                <td>Fecha</td>
                                <td>Ver</td>
                                <td>Eliminar</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                results.length > 0
                                    ?
                                    Object.values(results).map((r) => (

                                        <tr key={r.id}>
                                            <td>{r.id}</td>
                                            <td>{r.nombreArchivo}</td>
                                            <td>{r.alias}</td>
                                            <td>{r.status}</td>
                                            <td>{r.createdAt}</td>
                                            <td>
                                                <Link to={"/admin/reporte/" + r.id}>
                                                    <Button>Ver reporte</Button>
                                                </Link>
                                            </td>
                                            <td>
                                                {
                                                    r.status == 'incompleto'
                                                        ?
                                                        <Button onClick={e => { e.preventDefault; this.handleDeleteReport(r.id) }} variant="danger">Eliminar</Button>
                                                        : null
                                                }
                                            </td>
                                        </tr>
                                    ))
                                    :
                                    <tr>
                                        <td>-</td>
                                        <td>-</td>
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
                            <Link to={'/admin/reportes/' + (parseInt(params.page) - 1)}>
                                <Button variant="secondary">Página anterior</Button>
                            </Link>
                            :
                            null
                    }
                    <Link to={'/admin/reportes/' + (parseInt(params.page) + 1)}>
                        <Button style={{ marginLeft: 10 }}>Página siguiente</Button>
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

export default withAlert()(connect(mapStateToProps)(ListReports))