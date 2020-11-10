import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Loading from '../Loading'
import AddReportOperation from './AddReportOperation'
// bootstrap
import { Form, Row, Col, Button, Table, Modal, Tabs, Tab, OverlayTrigger, Popover } from 'react-bootstrap'

// api
import { getReportOperations, deleteOperation, deleteReport, getCSRFToken } from '../../utils/api'

// alert
import { withAlert } from 'react-alert'

// CSV
import { CSVLink } from 'react-csv'

class Report extends Component {
    state = {
        loading: true,
        serverRes: '',
        csrf: '',
        alertError: true,
        showModal: false,
        redirect: false,
        fileData: [],
        fileName: ''
    }

    componentDidMount() {
        document.title = 'Ver reporte | Sistema Automatizado'
        let self = this
        const { match: { params } } = this.props

        getReportOperations({ reportId: params.reporteId })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                self.setState({ loading: false, report: res })
            })
        getCSRFToken()
            .then(res => this.setState({ csrf: res.csrf }))
    }

    handleDeleteReport = (e) => {
        e.preventDefault()
        const { csrf } = this.state
        const { match: { params } } = this.props
        let c = confirm('¿Estas seguro que deseas eliminar el reporte y todas sus operaciones?')
        c && (
            deleteReport({ reporteId: params.reporteId, _csrf: csrf })
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    if ('status' in res && res.status == 'OK') {
                        this.setState({ redirect: true })
                    } else {
                        this.props.alert.error(res.message)
                        return
                    }
                })
        )
    }

    handleDeleteOperation = (operationId) => {
        if (!operationId)
            return this.props.alert.error("Ocurrió un error al intentar realizar la operación")
        const { csrf, report } = this.state
        let c = confirm('¿Estas seguro que deseas eliminar la operación?')
        c && (
            deleteOperation({ operationId, _csrf: csrf })
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    if ('status' in res && res.status == 'OK') {
                        this.setState({
                            report: {
                                ...report,
                                operacionReportes: report.operacionReportes.filter(op => op.id != operationId)
                            }
                        })
                        this.props.alert.show(res.message)
                    } else {
                        this.props.alert.error(res.message)
                        return
                    }
                })
        )
    }

    handleGenerateReport = (event, done) => {        
        let ops = this.state.report.operacionReportes        
        // order by folio
        ops = Object.values(ops).sort((a,b) => {
            return parseInt(a.folio)  - parseInt(b.folio)
        })
        // generate new array
        let data = []
        for(let i = 0; i < ops.length; i++) {
            data.push([
                // column 1
                ops[i].tipoReporte.toUpperCase(),
                // column 2
                ops[i].periodoReporte.toUpperCase(),
                // column 3
                ops[i].folio.toUpperCase(),
                // column 4
                ops[i].organoSupervisor.toUpperCase(),
                // column 5
                ops[i].claveSujetoObligado.toUpperCase(),
                // column 6
                ops[i].localidad.toUpperCase(),
                // column 7
                ops[i].codigoPostalSucursal.toUpperCase(),
                // column 8
                ops[i].tipoOperacion.toUpperCase(),
                // column 9
                ops[i].instrumentoMonetario.toUpperCase(),
                // column 10
                ops[i].numeroCuenta.toUpperCase(),
                // column 11
                ops[i].monto.toUpperCase(),
                // column 12
                ops[i].moneda.toUpperCase(),
                // column 13
                ops[i].fechaOperacion.toUpperCase(),
                // column 14
                ops[i].fechaDeteccionOperacion.toUpperCase(),
                // column 15
                ops[i].nacionalidad.toUpperCase(),
                // column 16
                ops[i].tipoPersona.toUpperCase(),
                // column 17
                ops[i].razonSocial.toUpperCase(),
                // column 18
                ops[i].nombre.toUpperCase(),
                // column 19
                ops[i].apellidoPaterno.toUpperCase(),
                // column 20
                ops[i].apellidoMaterno.toUpperCase(),
                // column 21
                ops[i].rfc.toUpperCase(),
                // column 22
                ops[i].curp.toUpperCase(),
                // column 23
                ops[i].fechaNacimiento.toUpperCase(),
                // column 24
                ops[i].domicilio.toUpperCase(),
                // column 25
                ops[i].colonia.toUpperCase(),
                // column 26
                ops[i].ciudad.toUpperCase(),
                // column 27
                ops[i].telefono.toUpperCase(),
                // column 28
                ops[i].actividadEconomica.toUpperCase(),
                // column 29
                ops[i].consecutivoCuentas.toUpperCase(),
                // column 30
                ops[i].numeroCuentaOperacionRelacionada.toUpperCase(),
                // column 31
                ops[i].claveSujetoObligadoOperacionRelacionada.toUpperCase(),
                // column 32
                ops[i].nombrePersonaRelacionada.toUpperCase(),
                // column 33
                ops[i].apellidoPaternoPersonaRelacionada.toUpperCase(),
                // column 34
                ops[i].apellidoMaternoPersonaRelacionada.toUpperCase(),
                // column 35
                ops[i].descripcionOperacion.toUpperCase(),
                // column 36
                ops[i].razones.toUpperCase(),
            ])
        }
        const fileName = ops[0].tipoReporte + ops[0].claveSujetoObligado + ops[0].periodoReporte + '.' + ops[0].organoSupervisor
        this.setState({fileData: data, fileName}, done())        
    }


    render() {

        const { report, loading, redirect } = this.state


        if (loading) {
            return <Loading />
        }

        if (redirect) {
            return <Redirect to={{ pathname: '/admin/reportes/1', state: { from: this.props.location.pathname } }} />
        }

        return (
            <Fragment>
                <Row style={{ marginTop: 40 }}>
                    <Col sm={{ span: 12 }} md={{ span: 10, offset: 1 }}>
                        <h3>Reporte</h3>

                        <h5 style={{ marginTop: 20 }}>Resumen general</h5>
                        <Table style={{ marginTop: 20 }}>

                            <tbody>
                                <tr>
                                    <td>Estado</td>
                                    <td>{report.status}</td>
                                </tr>
                                <tr>
                                    <td>Alias</td>
                                    <td>{report.alias}</td>
                                </tr>
                                <tr>
                                    <td>Total operaciones</td>
                                    <td>{report.operacionReportes.length}</td>
                                </tr>
                                <tr>
                                    <td>Fecha de última modificación</td>
                                    <td>{report.updatedAt}</td>
                                </tr>
                                <tr>
                                    <td>Fecha de creación</td>
                                    <td>{report.createdAt}</td>
                                </tr>
                                <tr>
                                    <td>Descargar Reporte</td>
                                    <td>

                                        <CSVLink
                                            data={this.state.fileData}
                                            separator={";"}
                                            asyncOnClick={true}
                                            onClick={this.handleGenerateReport}
                                            filename={this.state.fileName}
                                        >
                                            Descargar reporte
                                        </CSVLink>
                                    </td>
                                </tr>
                                {
                                    report.status == 'incompleto'
                                        ?
                                        <Fragment>
                                            <tr>
                                                <td>Agregar Operación</td>
                                                <td>
                                                    <Button onClick={e => this.setState({ showModal: true })}>Agregar operación</Button>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>Eliminar Reporte</td>
                                                <td>
                                                    <Button onClick={this.handleDeleteReport} variant="danger">Eliminar reporte</Button>
                                                </td>
                                            </tr>
                                        </Fragment>
                                        : null
                                }
                            </tbody>
                        </Table>

                        <h5 style={{ marginTop: 40 }}>Operaciones</h5>
                        <Tabs justify variant="tabs" style={{ marginTop: 20 }}>
                            {
                                report.operacionReportes.length > 0
                                    ?
                                    Object.values(report.operacionReportes).map((op, index) => {
                                        return (
                                            <Tab key={op.id} eventKey={"op" + (op.id)} title={"Operación No." + (index + 1)} style={{ marginTop: 20 }}>
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <td><b>Columna (archivo)</b></td>
                                                            <td><b>Campo</b></td>
                                                            <td><b>Valor</b></td>
                                                            <td><b>Valor (archivo)</b></td>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>-</td>
                                                            <td>Categoría</td>
                                                            <td>{op.categoria}</td>
                                                            <td>-</td>
                                                        </tr>
                                                        <tr>
                                                            <td>1</td>
                                                            <td>Tipo de reporte</td>
                                                            <td>{op.tipoReporte == 1 ? 'Operación Relevante' : op.tipoReporte == 2 ? 'Operación Inusual' : 'Operación Interna Preocupante'}</td>
                                                            <td>{op.tipoReporte}</td>
                                                            <td></td>

                                                        </tr>
                                                        <tr>
                                                            <td>2</td>
                                                            <td>Periodo de reporte</td>
                                                            <td>{op.periodoReporte}</td>
                                                            <td>{op.periodoReporte}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>3</td>
                                                            <td>Folio</td>
                                                            <td>{op.folio}</td>
                                                            <td>{op.folio}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>4</td>
                                                            <td>Órgano supervisor</td>
                                                            <td>{op.organoSupervisor == '0000002' ? 'CNBV' : 'Desconocido'}</td>
                                                            <td>{op.organoSupervisor}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>5</td>
                                                            <td>Clave o número de registro del Sujeto Obligado</td>
                                                            <td>{op.claveSujetoObligado}</td>
                                                            <td>{op.claveSujetoObligado}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>6</td>
                                                            <td>Localidad</td>
                                                            <td>{op.localidad}</td>
                                                            <td>{op.localidad}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>7</td>
                                                            <td>Código Postal de la sucursal</td>
                                                            <td>{op.codigoPostalSucursal}</td>
                                                            <td>{op.codigoPostalSucursal}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>7</td>
                                                            <td>Código Postal de la sucursal</td>
                                                            <td>{op.codigoPostalSucursal}</td>
                                                            <td>{op.codigoPostalSucursal}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>8</td>
                                                            <td>Tipo de operación</td>
                                                            <td>{op.tipoOperacion}</td>
                                                            <td>{op.tipoOperacion}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>9</td>
                                                            <td>Instrumento monetario</td>
                                                            <td>{op.instrumentoMonetario}</td>
                                                            <td>{op.instrumentoMonetario}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>10</td>
                                                            <td>Número de cuenta, contrato u operación</td>
                                                            <td>{op.numeroCuenta}</td>
                                                            <td>{op.numeroCuenta}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>11</td>
                                                            <td>Monto</td>
                                                            <td>{op.monto}</td>
                                                            <td>{op.monto}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>12</td>
                                                            <td>Moneda</td>
                                                            <td>{op.moneda}</td>
                                                            <td>{op.moneda}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>13</td>
                                                            <td>Fecha de la operación</td>
                                                            <td>{op.fechaOperacion}</td>
                                                            <td>{op.fechaOperacion}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>14</td>
                                                            <td>Fecha de detección de la operación</td>
                                                            <td>{op.fechaDeteccionOperacion}</td>
                                                            <td>{op.fechaDeteccionOperacion}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>15</td>
                                                            <td>Nacionalidad</td>
                                                            <td>{op.nacionalidad == 1 ? 'Mexicana' : op.nacionalidad == 2 ? 'Extranjero' : op.nacionalidad}</td>
                                                            <td>{op.nacionalidad}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>16</td>
                                                            <td>Tipo persona</td>
                                                            <td>{op.tipoPersona == 1 ? 'Persona Física' : op.tipoPersona == 2 ? 'Persona Moral' : op.tipoPersona}</td>
                                                            <td>{op.tipoPersona}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>17</td>
                                                            <td>Razón social o denominación</td>
                                                            <td>{op.razonSocial}</td>
                                                            <td>{op.razonSocial}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>18</td>
                                                            <td>Nombre</td>
                                                            <td>{op.nombre}</td>
                                                            <td>{op.nombre}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>19</td>
                                                            <td>Apellido Paterno</td>
                                                            <td>{op.apellidoPaterno}</td>
                                                            <td>{op.apellidoPaterno}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>20</td>
                                                            <td>Apellido Materno</td>
                                                            <td>{op.apellidoMaterno}</td>
                                                            <td>{op.apellidoMaterno}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>21</td>
                                                            <td>RFC</td>
                                                            <td>{op.rfc}</td>
                                                            <td>{op.rfc}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>22</td>
                                                            <td>CURP</td>
                                                            <td>{op.curp}</td>
                                                            <td>{op.curp}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>23</td>
                                                            <td>Fecha de nacimiento o constitución</td>
                                                            <td>{op.fechaNacimiento}</td>
                                                            <td>{op.fechaNacimiento}</td>
                                                        </tr>                                                        
                                                        <tr>
                                                            <td>24</td>
                                                            <td>Domicilio</td>
                                                            <td>{op.domicilio}</td>
                                                            <td>{op.domicilio}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>25</td>
                                                            <td>Colonia</td>
                                                            <td>{op.colonia}</td>
                                                            <td>{op.colonia}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>26</td>
                                                            <td>Ciudad o población</td>
                                                            <td>{op.ciudad}</td>
                                                            <td>{op.ciudad}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>27</td>
                                                            <td>Teléfono</td>
                                                            <td>{op.telefono}</td>
                                                            <td>{op.telefono}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>28</td>
                                                            <td>Actividad económica</td>
                                                            <td>{op.actividadEconomica}</td>
                                                            <td>{op.actividadEconomica}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>29</td>
                                                            <td>Consecutivo de cuentas y/o personas relacionadas</td>
                                                            <td>{op.consecutivoCuentas}</td>
                                                            <td>{op.consecutivoCuentas}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>30</td>
                                                            <td>Número de cuenta, contrato, operación</td>
                                                            <td>{op.numeroCuentaOperacionRelacionada}</td>
                                                            <td>{op.numeroCuentaOperacionRelacionada}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>31</td>
                                                            <td>Clave del Sujeto Obligado</td>
                                                            <td>{op.claveSujetoObligadoOperacionRelacionada}</td>
                                                            <td>{op.claveSujetoObligadoOperacionRelacionada}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>32</td>
                                                            <td>Nombre del titular de la cuenta o de la persona relacionada</td>
                                                            <td>{op.nombrePersonaRelacionada}</td>
                                                            <td>{op.nombrePersonaRelacionada}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>33</td>
                                                            <td>Apellido paterno persona relacionada</td>
                                                            <td>{op.apellidoPaternoPersonaRelacionada}</td>
                                                            <td>{op.apellidoPaternoPersonaRelacionada}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>34</td>
                                                            <td>Apellido materno persona relacionada</td>
                                                            <td>{op.apellidoMaternoPersonaRelacionada}</td>
                                                            <td>{op.apellidoMaternoPersonaRelacionada}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>35</td>
                                                            <td>Descripción de la operación</td>
                                                            <td>{op.descripcionOperacion}</td>
                                                            <td>{op.descripcionOperacion}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>36</td>
                                                            <td>Razones</td>
                                                            <td>{op.razones}</td>
                                                            <td>{op.razones}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                                {
                                                    report.status == 'incompleto'
                                                        ?
                                                        <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 20 }}>
                                                            <Button onClick={e => { e.preventDefault(); this.handleDeleteOperation(op.id) }} variant="danger">Eliminar Operación No. {(index + 1)}</Button>
                                                        </div>
                                                        : null
                                                }

                                            </Tab>
                                        )

                                    })
                                    : null

                            }
                        </Tabs>

                    </Col>
                </Row>
                <MyModal
                    onHide={() => this.setState({ showModal: false })}
                    showModal={this.state.showModal}
                    reporteId={this.state.report.id}
                />
            </Fragment>
        )
    }
}

function MyModal(props) {
    return (
        <Modal onHide={props.onHide} show={props.showModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>Añadir operación al reporte</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AddReportOperation reporteId={props.reporteId} closeModal={props.onHide} />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}
function MyPopover(props) {
    return (
        <Popover id="popover-basic">
            <Popover.Title as="h3">{props.title}</Popover.Title>
            <Popover.Content>
                {props.content}
            </Popover.Content>
        </Popover>
    )
}
function mapStateToProps() {
    return {

    }
}

export default withAlert()(connect(mapStateToProps)(Report))