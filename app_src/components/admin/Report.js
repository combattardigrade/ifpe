import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Loading from '../Loading'
// bootstrap
import { Form, Row, Col, Button, Table, Modal, OverlayTrigger, Popover, Tabs, Tab, } from 'react-bootstrap'
import MyAlert from './MyAlert'
// icons
import { MdInfo, MdAdd } from 'react-icons/md'
// api
import { getCSRFToken } from '../../utils/api'


class Report extends Component {
    state = {
        loading: true,
        serverRes: '',
        csrf: '',
        alertError: true,
        totalOps: 1,
        // form
        tipoReporte: 1,
        periodoReporte: '',
        organoSupervisor: '',
        claveSujetoObligado: '',
        localidad: '',
        codigoPostalSucursal: '',
        tipoOperacion: '',
        instrumentoMonetario: '',
        numeroCuenta: '',
        monto: '',
        moneda: '',
        fechaOperacion: '',
        fechaDeteccionOperacion: '',
        nacionalidad: 1,
        tipoPersona: 1,
        razonSocial: '',
        nombre: '',
        apellidoPaterno: 'XXXX',
        apellidoMaterno: 'XXXX',
        rfc: '',
        curp: '',
        fechaNacimiento: '',
        domicilio: '',
        colonia: '',
        ciudad: '',
        telefono: '',
        actividadEconomica: '',
        personaRelacionada: 'no',
        consecutivoCuentaRelacionada: '01',
        numeroCuentaRelacionada: '',
        claveSujetoObligado2: '',
        nombreRelacionada: '',
        apellidoPaternoRelacionada: '',
        apellidoMaternoRelacionada: '',
        descripcionOperacion: '',
        razonesOperacion: ''
    }

    componentDidMount() {
        document.title = 'Generar nuevo reporte | Sistema Automatizado'
        getCSRFToken()
            .then(res => this.setState({ csrf: res.csrf, loading: false }))
    }

    handleInputChange = (name, value) => {
        this.setState({ [name]: value })
    }

    handleNumInputChange = (name, value) => {
        const re = /^[0-9\b]+$/
        if (value === '' || re.test(value)) {
            this.setState({ [name]: value })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        console.log('click')
    }

    handleAddOp = (e) => {
        e.preventDefault()
        const { totalOps } = this.state
        console.log('click')
        this.setState({totalOps: (totalOps + 1)})
    }

    render() {

        const { loading } = this.state

        if (loading) {
            return <Loading />
        }
        let ops = []
        for (let i = 0; i < this.state.totalOps; i++) {
            ops.push(
                <Tab key={i} eventKey={"op" + (i + 1)} title={"Operación No." + (i + 1)} style={{marginTop: 20}}>
                    <h3>Operación No.{(i + 1)}</h3>
                    <Form style={{ marginTop: 20 }}>
                        <Form.Group>
                            <Form.Label>Tipo de reporte:</Form.Label>
                            <Form.Control name="tipoReporte" as="select" defaultValue="1" onChange={e => { e.preventDefault(); this.handleInputChange("tipoReporte", e.target.value) }}>
                                <option value="1">Operación Relevante</option>
                                <option value="2">Operación Inusual</option>
                                <option value="3">Operación Interna Preocupante</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'Ingresar la fecha en formato AAAAMM para Operaciones Relevantes y AAAAMMDD para otro tipo de Operaciones' })}><Form.Label>Fecha de reporte: <MdInfo color="#007bff" /> </Form.Label></OverlayTrigger>
                            <Form.Control value={this.state.periodoReporte} onChange={e => { e.preventDefault(); this.handleNumInputChange("periodoReporte", e.target.value) }} type="text" maxLength={this.state.tipoReporte == 1 ? 6 : 8} placeholder={this.state.tipoReporte == 1 ? 'Formato AAAAMM' : 'Formato AAAAMMDD'} />
                        </Form.Group>
                        <Form.Group>
                            <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'Folio de cada operación a reportar. Deberá iniciar en 000001' })}><Form.Label>Folio: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                            <Form.Control required type="text" name="folio" maxLength="6" defaultValue="000001" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Órgano Supervisor:</Form.Label>
                            <Form.Control value={this.state.organoSupervisor} onChange={e => { e.preventDefault(); this.handleInputChange("organoSupervisor", e.target.value) }} type="text" maxLength="6" />
                        </Form.Group>
                        <Form.Group>
                            <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'La clave del campo debe ser de acuerdo al catálogo CASFIM para entidades financieras. Debe ir sin el guión (-) intermedio y anteponiendo un 0 (cero) al inicio de la clave.' })}><Form.Label>Clave de Registro del Sujeto Obligado: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                            <Form.Control value={this.state.claveSujetoObligado} onChange={e => { e.preventDefault(); this.handleInputChange("claveSujetoObligado", e.target.value) }} type="text" maxLength="8" />
                        </Form.Group>
                        <Form.Group>
                            <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'La Localidad se debe capturar de acuerdo al catálogo que dé a conocer la Unidad de Inteligencia Financiera a través de la Comisión Nacional Bancaria y de Valores.' })}><Form.Label>Localidad: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                            <Form.Control value={this.state.localidad} onChange={e => { e.preventDefault(); this.handleInputChange("localidad", e.target.value) }} type="text" maxLength="8" placeholder="" />
                        </Form.Group>
                        <Form.Group>
                            <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'El código postal de la sucursal debe ser válido para la entidad federativa de la localidad reportada. Si la operación no se genera en sucursal, el código postal debe ser el de la casa matriz.' })}><Form.Label>Código Postal de la sucursal: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                            <Form.Control required value={this.state.codigoPostalSucursal} onChange={e => { e.preventDefault(); this.handleInputChange("codigoPostalSucursal", e.target.value) }} type="text" maxLength="5" />
                        </Form.Group>
                        <Form.Group>
                            <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'El Tipo de Operación se debe capturar de acuerdo al catálogo que dé a conocer la Unidad de Inteligencia Financiera a través de la Comisión Nacional Bancaria y de Valores' })}><Form.Label>Tipo de Operación: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                            <Form.Control required value={this.state.tipoOperacion} onChange={e => { e.preventDefault(); this.handleInputChange("tipoOperacion", e.target.value) }} type="text" maxLength="2" />
                        </Form.Group>
                        <Form.Group>
                            <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'El Instrumento Monetario se debe capturar de acuerdo al catálogo que dé a conocer la Unidad de Inteligencia Financiera a través de la Comisión Nacional Bancaria y de Valores.' })}><Form.Label>Instrumento monetario: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                            <Form.Control required value={this.state.instrumentoMonetario} onChange={e => { e.preventDefault(); this.handleInputChange("instrumentoMonetario", e.target.value) }} type="text" maxLength="2" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Número cuenta o contrato:</Form.Label>
                            <Form.Control required value={this.state.numeroCuenta} onChange={e => { e.preventDefault(); this.handleInputChange("numeroCuenta", e.target.value) }} type="text" maxLength="16" />
                        </Form.Group>
                        <Form.Group>
                            <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: '1) Las primeras 14 posiciones se utilizarán para los enteros y las 2 últimas para los decimales, separando las fracciones con un punto. 2) En los casos en que no esté involucrada una operación si no un acto, conducta o comportamiento que requiera ser reportado, esta casilla se deberá capturar en ceros.' })}><Form.Label>Monto: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                            <Form.Control required value={this.state.monto} onChange={e => { e.preventDefault(); this.handleNumInputChange("monto", e.target.value) }} type="text" maxLength="17" />
                        </Form.Group>
                        <Form.Group>
                            <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'La Moneda se debe capturar de acuerdo al catálogo que dé a conocer la Unidad de Inteligencia Financiera a través de la Comisión Nacional Bancaria y de Valores.' })}><Form.Label>Moneda: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                            <Form.Control required value={this.state.moneda} onChange={e => { e.preventDefault(); this.handleInputChange("moneda", e.target.value) }} type="text" maxLength="3" />
                        </Form.Group>
                        <Form.Group>
                            <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'Formato AAAAMMDD. La fecha de operación debe ser menor o igual al período del reporte.' })}><Form.Label>Fecha de la operación: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                            <Form.Control required value={this.state.fechaOperacion} onChange={e => { e.preventDefault(); this.handleNumInputChange("fechaOperacion", e.target.value) }} type="text" maxLength="8" placeholder="Formato AAAAMMDD" />
                        </Form.Group>
                        {
                            this.state.tipoReporte != 1
                                ?
                                <Form.Group>
                                    <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'Formato AAAAMMDD. Debe ser enviado dentro de los sesenta días naturales contados a partir de la fecha de detección.' })}><Form.Label>Fecha de detección de la Operación: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                                    <Form.Control required value={this.state.fechaDeteccionOperacion} onChange={e => { e.preventDefault(); this.handleNumInputChange("fechaDeteccionOperacion", e.target.value) }} type="text" maxLength="8" placeholder="Formato AAAAMMDD" />
                                </Form.Group>
                                : null
                        }
                        <Form.Group>
                            <Form.Label>Nacionalidad:</Form.Label>
                            <Form.Control required as="select" defaultValue="1" onChange={e => { e.preventDefault(); this.handleInputChange("nacionalidad", e.target.value) }}>
                                <option value="1">Mexicana</option>
                                <option value="2">Extranjero</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tipo de Persona:</Form.Label>
                            <Form.Control required as="select" defaultValue="1" onChange={e => { e.preventDefault(); this.handleInputChange("tipoPersona", e.target.value) }} >
                                <option value="1">Persona Física</option>
                                <option value="2">Persona Moral</option>
                            </Form.Control>
                        </Form.Group>
                        {
                            this.state.tipoPersona == 1
                                ?
                                <Fragment>
                                    <Form.Group>
                                        <Form.Label>Nombre:</Form.Label>
                                        <Form.Control value={this.state.nombre} onChange={e => { e.preventDefault(); this.handleInputChange("nombre", e.target.value) }} type="text" maxLength="60" />
                                    </Form.Group>
                                    <Form.Group>
                                        <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'En caso que la persona reportada no tenga apellido paterno se deben capturar cuatro equis (XXXX) y el campo "apellido materno" debe ser obligatorio y distinto a (XXXX).' })}><Form.Label>Apellido Paterno: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                                        <Form.Control value={this.state.apellidoPaterno} onChange={e => { e.preventDefault(); this.handleInputChange("apellidoPaterno", e.target.value) }} type="text" maxLength="60" />
                                    </Form.Group>
                                    <Form.Group>
                                        <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'En caso que la persona reportada no tenga apellido materno se deben capturar cuatro equis (XXXX).' })}><Form.Label>Apellido Materno: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                                        <Form.Control value={this.state.apellidoMaterno} onChange={e => { e.preventDefault(); this.handleInputChange("apellidoMaterno", e.target.value) }} type="text" maxLength="30" />
                                    </Form.Group>
                                    <Form.Group>
                                        <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'El campo es opcional siempre y cuando se cuente con RFC o fecha de nacimiento, pudiendo proporcionar los 3 si se cuenta con los mismos. Es obligatorio cuando no se cuente con fecha de nacimiento y RFC y es una operación principal.' })}><Form.Label>CURP: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                                        <Form.Control value={this.state.curp} onChange={e => { e.preventDefault(); this.handleInputChange("curp", e.target.value) }} type="text" maxLength="18" />
                                    </Form.Group>
                                </Fragment>
                                :
                                <Form.Group>
                                    <Form.Label>Razón social:</Form.Label>
                                    <Form.Control value={this.state.razonSocial} onChange={e => { e.preventDefault(); this.handleInputChange("razonSocial", e.target.value) }} type="text" maxLength="125" />
                                </Form.Group>
                        }
                        <Form.Group>
                            <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'El campo es opcional siempre y cuando se cuente con CURP o fecha de nacimiento, pudiendo proporcionar los 3 si se cuenta con los mismos. Es obligatorio cuando no se cuente con fecha de nacimiento y CURP y es una operación principal.' })}><Form.Label>RFC: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                            <Form.Control value={this.state.rfc} onChange={e => { e.preventDefault(); this.handleInputChange("rfc", e.target.value) }} type="text" maxLength="13" />
                        </Form.Group>
                        <Form.Group>
                            <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'El campo es obligatorio si los campos "RFC" y "CURP" se encuentran vacíos y es una operación principal. Formato AAAAMMDD. Debe ser menor al campo fecha de operación y mayor a 19000101.' })}><Form.Label>Fecha de {this.state.tipoPersona == 1 ? 'nacimiento' : 'constitución'}:<MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                            <Form.Control value={this.state.fechaNacimiento} onChange={e => { e.preventDefault(); this.handleNumInputChange("fechaNacimiento", e.target.value) }} type="text" maxLength="8" placeholder="Formato AAAAMMDD" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Domicilio:</Form.Label>
                            <Form.Control value={this.state.domicilio} onChange={e => { e.preventDefault(); this.handleInputChange("domicilio", e.target.value) }} type="text" maxLength="60" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Colonia:</Form.Label>
                            <Form.Control value={this.state.colonia} onChange={e => { e.preventDefault(); this.handleInputChange("colonia", e.target.value) }} type="text" maxLength="30" />
                        </Form.Group>
                        <Form.Group>
                            <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'La Ciudad o Población se debe capturar de acuerdo al catálogo que dé a conocer la Unidad de Inteligencia Financiera a través de la Comisión Nacional Bancaria y de Valores.' })}><Form.Label>Ciudad o Población: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                            <Form.Control value={this.state.ciudad} onChange={e => { e.preventDefault(); this.handleInputChange("ciudad", e.target.value) }} type="text" maxLength="8" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Teléfono:</Form.Label>
                            <Form.Control value={this.state.telefono} onChange={e => { e.preventDefault(); this.handleInputChange("telefono", e.target.value) }} type="text" maxLength="40" />
                        </Form.Group>
                        <Form.Group>
                            <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'La Actividad Económica se debe capturar de acuerdo al catálogo que dé a conocer la Unidad de Inteligencia Financiera a través de la Comisión Nacional Bancaria y de Valores.' })}><Form.Label>Actividad Económica: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                            <Form.Control value={this.state.actividadEconomica} onChange={e => { e.preventDefault(); this.handleInputChange("actividadEconomica", e.target.value) }} type="text" maxLength="7" />
                        </Form.Group>

                        {
                            this.state.tipoReporte != 1
                                ?
                                <Fragment>
                                    <Form.Group>
                                        <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'El campo debe medir máximo 4000 caracteres.' })}><Form.Label>Descripción de la Operación: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                                        <Form.Control value={this.state.descripcionOperacion} as="textarea" rows="3" onChange={e => { e.preventDefault(); this.handleInputChange("descripcionOperacion", e.target.value) }} maxLength="4000" />
                                    </Form.Group>
                                    <Form.Group>
                                        <OverlayTrigger trigger="hover" placement="right" overlay={MyPopover({ title: 'Ayuda', content: 'El campo debe medir máximo 4000 caracteres.' })}><Form.Label>Razones por las que el Acto u Operación se considera Inusual o Interna Preocupante: <MdInfo color="#007bff" /></Form.Label></OverlayTrigger>
                                        <Form.Control value={this.razonesOperacion} as="textarea" rows="3" onChange={e => { e.preventDefault(); this.handleInputChange("razonesOperacion", e.target.value) }} maxLength="4000" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Añadir Cuenta o Persona Relacionada:</Form.Label>
                                        <Form.Control as="select" defaultValue="no" onChange={e => { e.preventDefault(); this.handleInputChange("personaRelacionada", e.target.value) }} >
                                            <option value="no">No</option>
                                            <option value="si">Sí</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Fragment>
                                : null
                        }

                        {
                            this.state.personaRelacionada == 'si'
                                ?
                                <Fragment>
                                    <Form.Group>
                                        <Form.Label>Consecutivo de cuentas y/o personas relacionadas:</Form.Label>
                                        <Form.Control value={this.state.consecutivoCuentaRelacionada} onChange={e => { e.preventDefault(); this.handleInputChange("consecutivoCuentaRelacionada", e.target.value) }} type="text" maxLength="2" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Número de cuenta, contrato, operación, poliza o número de seguridad social:</Form.Label>
                                        <Form.Control value={this.state.numeroCuentaRelacionada} onChange={e => { e.preventDefault(); this.handleInputChange("numeroCuentaRelacionada", e.target.value) }} type="text" maxLength="16" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Clave del Sujeto Obligado:</Form.Label>
                                        <Form.Control value={this.state.claveSujetoObligado2} onChange={e => { e.preventDefault(); this.handleInputChange("claveSujetoObligado2", e.target.value) }} type="text" maxLength="7" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Nombre del titular de la cuenta o de la persona relacionada:</Form.Label>
                                        <Form.Control value={this.state.nombreRelacionada} onChange={e => { e.preventDefault(); this.handleInputChange("nombreRelacionada", e.target.value) }} type="text" maxLength="60" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Apellido paterno de la persona relacionada:</Form.Label>
                                        <Form.Control value={this.state.apellidoPaternoRelacionada} onChange={e => { e.preventDefault(); this.handleInputChange("apellidoPaternoRelacionada", e.target.value) }} type="text" maxLength="60" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Apellido materno de la persona relacionada:</Form.Label>
                                        <Form.Control value={this.state.apellidoMaternoRelacionado} onChange={e => { e.preventDefault(); this.handleInputChange("apellidoPaternoMelacionado", e.target.value) }} type="text" maxLength="30" />
                                    </Form.Group>
                                </Fragment>
                                : null
                        }
                        <Button onClick={this.handleSubmit} variant="success">
                            Generar archivo
                            </Button>

                    </Form>
                </Tab>
            )
        }

        return (
            <Fragment>
                <Row style={{ marginTop: 40 }}>
                    <Col sm={{ span: 12 }} md={{ span: 6, offset: 3 }}>
                        <h3>Generar Archivo de Reporte de Operaciones</h3>

                        <div style={{ marginTop: 40, marginBottom: 40, textAlign: 'center' }}>
                            <Button onClick={this.handleAddOp} size="md">Añadir Operación <MdAdd /></Button>
                        </div>


                        <Tabs justify variant="tabs" defaultActiveKey="op1">
                            {ops}
                        </Tabs>

                    </Col>
                </Row>
            </Fragment>
        )
    }
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

export default connect(mapStateToProps)(Report)