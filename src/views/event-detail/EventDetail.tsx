// import classNames from 'classnames'

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
import { getEventById } from '../../services/event.service'
import { Source } from '../../model/wazuh/source.model';
import { InfraEvent } from '../../model/infra-event.model';
import { useParams } from 'react-router-dom';
import { plainToInstance } from 'class-transformer';
import { DataWin } from '../../model/wazuh/data-win.model';
import { DataFw } from '../../model/wazuh/data-fw.model';
import { DataPkg } from '../../model/wazuh/data-pkg.model';
import { DataOffice365 } from '../../model/wazuh/data-office365.model';
import { Result } from '../../model/zabbix/response.model'
import { useEffect, useState } from 'react'

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();

  return <EventDetailContent eventId={eventId} />;
};

const EventDetailContent = ({ eventId }: { eventId: string | undefined }) => {
  const [event, setEvent] = useState<InfraEvent | null>(null);
  const [detalle, setDetalle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setDetalle('Event ID not found');
        setLoading(false);
        return;
      }

      const fetchedEvent = await getEventById(parseInt(eventId));
      if (!fetchedEvent) {
        setDetalle('Event not found');
        setLoading(false);
        return;
      }

      setEvent(fetchedEvent);

      let detail = '';

      if (fetchedEvent.origin === 'wazuh') {

        // console.log('fetchedEvent.detail', fetchedEvent.detail);
        // console.log('fetchedEvent.detail', JSON.stringify(fetchedEvent.detail, null, 2)); 
        if (!fetchedEvent.detail) {
          setDetalle('Event detail not found');
          setLoading(false);
          return;
        }
        const source: Source = plainToInstance(Source, JSON.parse(fetchedEvent.detail), {
          excludeExtraneousValues: false,
        });

        console.log('source', source);
        console.log('source.rule', source.rule);

        if (!source || !source.rule || !source.agent) {
          setDetalle('Source not found');
          setLoading(false);
          return;
        }

        const { rule, agent, data, fullLog } = source;
        detail += `rule.id: ${rule.id}\n`;
        detail += `rule.description: ${rule.description}\n`;
        detail += `rule.level: ${rule.level}\n`;

        detail += `agent.id: ${agent.id}\n`;
        detail += `agent.name: ${agent.name}\n`;
        detail += `agent.ip: ${agent.ip}\n`;
        detail += `agent.os: ${agent.os}\n`;
        detail += `agent.status: ${agent.status}\n`;
        detail += `agent.version: ${agent.version}\n\n`;

        switch (rule.id) {
          case "60115":
            case "92650":
            case "92657": {
                // Windows alert
                const win = plainToInstance(DataWin, JSON.parse(JSON.stringify(data)), {
                  excludeExtraneousValues: false,
                });
                // console.log(win);
                detail += JSON.stringify(win, null, 2);
              }
                break;
            case "70021":
            case "70022": {
                // FW alert denied/permited traffic
                const dataFw = plainToInstance(DataFw, JSON.parse(JSON.stringify(data)), {
                  excludeExtraneousValues: false,
                });
                // console.log(dataFw);
                detail += JSON.stringify(dataFw, null, 2);
                console.log(detail);
              }
                break;
            case "2903": {
                // Linux package
                const dataPkg = plainToInstance(DataPkg, JSON.parse(JSON.stringify(data)), {
                  excludeExtraneousValues: false,
                });
                detail += JSON.stringify(dataPkg, null, 2);
                console.log(detail);
              }
                break;
            case "31151":
            case "1007":
            case "3333":
            case "31103":
            case "31510":
            case "594":
            case "750":
            case "31516": {
                  // related to servers, web servers, services, full_log
                  console.log(alert);
                  // console.log(fullLog);
                  detail += "full_log:\n";
                  detail += fullLog ? fullLog : "No hay detalles";
                  // console.log(detalle);
            }
                  break;
            case "91575": {
                // office365
                const dataOffice365 = plainToInstance(DataOffice365, JSON.parse(JSON.stringify(data)), {
                            excludeExtraneousValues: false,
                        });
                // console.log(dataOffice365);
                detail += JSON.stringify(dataOffice365, null, 2);
                }
                break;
            default:
              detail += 'No additional details available.';
              break;
        }
      } else if (fetchedEvent.origin === 'zabbix') {
        if (!fetchedEvent.detail) {
          setDetalle('Event detail not found');
          setLoading(false);
          return;
        }
        const result: Result = plainToInstance(Result, JSON.parse(fetchedEvent.detail), {
          excludeExtraneousValues: false,
        });

        detail += `host.name: ${fetchedEvent!.equipment!.name || "Desconocido"}\n`;
        detail += `host.ip: ${fetchedEvent!.equipment!.ip || "Desconocida"}\n\n`;

        detail += JSON.stringify(result, null, 2);
      } else {
        detail += 'Unknown origin';
      }

      setDetalle(detail);
      setLoading(false);
    };

    // Call fetchEvent immediately and set up an interval
    fetchEvent();
    // const intervalId = setInterval(fetchEvent, 60000); // Call every 60 seconds

    // Cleanup interval on component unmount
    // return () => clearInterval(intervalId);
  }, [eventId]);

  if (loading) {
    return <div>Loading...</div>;
  }


  return (

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Detalle de Alerta #{eventId}</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">Severidad: {event ? event.severity : 'N/A'}</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                    {event && (
                      <CTableRow key={event.id}>
                        <CTableDataCell>
                          <div>
                            Fecha: {event.timestamp?.toString()}
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    )}
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
  );
};
  
export default EventDetail;
