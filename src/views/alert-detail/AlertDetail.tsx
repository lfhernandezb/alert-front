// import classNames from 'classnames'

interface WazuhSeverity {
  id: number;
  name: string;
}

const severities: WazuhSeverity[] = [
  { id: 0, name: 'Baja' },
  { id: 1, name: 'Baja' },
  { id: 2, name: 'Baja' },
  { id: 3, name: 'Baja' },
  { id: 4, name: 'Baja' },
  { id: 5, name: 'Baja' },
  { id: 6, name: 'Baja' },
  { id: 7, name: 'Media' },
  { id: 8, name: 'Media' },
  { id: 9, name: 'Media' },
  { id: 10, name: 'Media' },
  { id: 11, name: 'Media' },
  { id: 12, name: 'Alta' },
  { id: 13, name: 'Alta' },
  { id: 14, name: 'Alta' },
  { id: 15, name: 'Crítica' },
  { id: 16, name: 'Crítica' },
]

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from '../../assets/images/avatars/1.jpg'
import avatar2 from '../../assets/images/avatars/2.jpg'
import avatar3 from '../../assets/images/avatars/3.jpg'
import avatar4 from '../../assets/images/avatars/4.jpg'
import avatar5 from '../../assets/images/avatars/5.jpg'
import avatar6 from '../../assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import { getAlertById, getAlerts } from '../../services/alert.service'
import { Source } from '../../model/wazuh/source.model';
import { Alert } from '../../model/wazuh/alert.model';
import { useParams } from 'react-router-dom';
import { plainToInstance } from 'class-transformer';
import { DataWin } from '../../model/wazuh/data-win.model';
import { DataFw } from '../../model/wazuh/data-fw.model';
import { DataPkg } from '../../model/wazuh/data-pkg.model';
import { DataOffice365 } from '../../model/wazuh/data-office365.model';

const AlertDetail = () => {
  const { alertId } = useParams<{ alertId: string }>();

  if (!alertId) {
    return <div>Alert ID not found</div>
  }

  const alert: Source | undefined = getAlertById(alertId);

  if (!alert) {
    return <div>Alert not found</div>
  }

  // console.log("source:");
  const agent = alert.agent;
  // console.log("agent:");
  const data = alert.data;
  //console.log(data);
  const rule = alert.rule;
  //console.log("rule:");
  const fullLog = alert.fullLog;
  //console.log("full_log:");

  let detalle: string = "";

  /*
  console.log("rule.id:" + rule!.id);
  console.log("rule.description:" + rule!.description);
  console.log("rule.level:" + rule!.level);

  console.log("agent.id:" + agent!.id);
  console.log("agent.name:" + agent!.name);
  console.log("agent.ip:" + agent!.ip);
  console.log("agent.os:" + agent!.os);
  console.log("agent.status:" + agent!.status);
  console.log("agent.version:" + agent!.version);
  */

  detalle += "rule.id:" + rule!.id + "\n";
  detalle += "rule.description:" + rule!.description + "\n";
  detalle += "rule.level:" + rule!.level + "\n";

  detalle += "agent.id:" + agent!.id + "\n";
  detalle += "agent.name:" + agent!.name + "\n";
  detalle += "agent.ip:" + agent!.ip + "\n";
  detalle += "agent.os:" + agent!.os + "\n";
  detalle += "agent.status:" + agent!.status + "\n";
  detalle += "agent.version:" + agent!.version + "\n\n";

  switch (rule!.id) {
      case "60115":
      case "92650":
      case "92657":
          // Windows alert
          const win = plainToInstance(DataWin, JSON.parse(JSON.stringify(data)), {
            excludeExtraneousValues: false,
          });
          // console.log(win);
          detalle += JSON.stringify(win, null, 2);
          break;
      case "70021":
      case "70022":
          // FW alert denied/permited traffic
          const dataFw = plainToInstance(DataFw, JSON.parse(JSON.stringify(data)), {
            excludeExtraneousValues: false,
          });
          // console.log(dataFw);
          detalle += JSON.stringify(dataFw, null, 2);
          console.log(detalle);
          break;
      case "2903":
          // Linux package
          const dataPkg = plainToInstance(DataPkg, JSON.parse(JSON.stringify(data)), {
            excludeExtraneousValues: false,
          });
          detalle += JSON.stringify(dataPkg, null, 2);
          console.log(detalle);
          break;
      case "31151":
      case "1007":
      case "3333":
      case "31103":
      case "31510":
      case "594":
      case "750":
      case "31516":
            // related to servers, web servers, services, full_log
            console.log(alert);
            // console.log(fullLog);
            detalle += "full_log:\n";
            detalle += fullLog ? fullLog : "No hay detalles";
            // console.log(detalle);
            break;
      case "91575":
          // office365
          const dataOffice365 = plainToInstance(DataOffice365, JSON.parse(JSON.stringify(data)), {
                      excludeExtraneousValues: false,
                  });
          // console.log(dataOffice365);
          detalle += JSON.stringify(dataOffice365, null, 2);
          break;
      default:
          console.log("******* No match, rule.id: " + rule!.id);
          break;
  }


  /*
  const handleDetail = (alertId: string) => {
    console.log(`Detalle button clicked for alert ID: ${alertId}`)
    // Add your logic here (e.g., navigate to a detail page or show a modal)
  }
  */
  return (
    <>
      {/* <WidgetsDropdown className="mb-4" /> */}
      {/*<CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Traffic
              </h4>
              <div className="small text-body-secondary">January - July 2023</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Day', 'Month', 'Year'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === 'Month'}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <MainChart />
        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={classNames({
                  'd-none d-xl-block': index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value} ({item.percent}%)
                </div>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard> */ }
      {/* <WidgetsBrand className="mb-4" withCharts /> */}
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Detalle de Aterta: {alertId}</CCardHeader>
            <CCardBody>
{/*               <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-info py-1 px-3">
                        <div className="text-body-secondary text-truncate small">New Clients</div>
                        <div className="fs-5 fw-semibold">9,123</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Recurring Clients
                        </div>
                        <div className="fs-5 fw-semibold">22,643</div>
                      </div>
                    </CCol>
                  </CRow>
                  <hr className="mt-0" />
                  {progressGroupExample1.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-prepend">
                        <span className="text-body-secondary small">{item.title}</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="info" value={item.value1} />
                        <CProgress thin color="danger" value={item.value2} />
                      </div>
                    </div>
                  ))}
                </CCol>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Pageviews</div>
                        <div className="fs-5 fw-semibold">78,623</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Organic</div>
                        <div className="fs-5 fw-semibold">49,123</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />

                  {progressGroupExample2.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">{item.value}%</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="warning" value={item.value} />
                      </div>
                    </div>
                  ))}

                  <div className="mb-5"></div>

                  {progressGroupExample3.map((item, index) => (
                    <div className="progress-group" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">
                          {item.value}{' '}
                          <span className="text-body-secondary small">({item.percent}%)</span>
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="success" value={item.percent} />
                      </div>
                    </div>
                  ))}
                </CCol>
              </CRow>

              <br />
 */}
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    {/* <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell> */}
                    <CTableHeaderCell className="bg-body-tertiary">Severidad: {alert.rule?.level !== undefined ? severities.find(severity => severity.id === alert.rule?.level)?.name || 'Unknown' : 'Unknown'}</CTableHeaderCell>
                    {/* <CTableHeaderCell className="bg-body-tertiary text-center">
                      Country
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Usage</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Payment Method
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Activity</CTableHeaderCell> */}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                    <CTableRow v-for="alert in alerts" key={alert.id}>
                      {/* <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell> */}
                      <CTableDataCell>
                        <div>
                          Fecha: {alert.sourceTimestamp}
                        </div>
                        {/*
                        <div className="small text-body-secondary text-nowrap">
                          {alert.sourceTimestamp}
                        </div>
                        */}
                      </CTableDataCell>
                      {/* <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-between text-nowrap">
                          <div className="fw-semibold">{item.usage.value}%</div>
                          <div className="ms-3">
                            <small className="text-body-secondary">{item.usage.period}</small>
                          </div>
                        </div>
                        <CProgress thin color={item.usage.color} value={item.usage.value} />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.payment.icon} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">Last login</div>
                        <div className="fw-semibold text-nowrap">{item.activity}</div>
                      </CTableDataCell> */}
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell colSpan={5}>
                        <div className="fw-semibold">
                           <pre style={{ whiteSpace: 'pre-wrap' }}>{detalle}</pre>
                        </div>
                      </CTableDataCell>
                    </CTableRow>

                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default AlertDetail
