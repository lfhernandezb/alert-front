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
  CFormCheck,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
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

import { useNavigate } from 'react-router-dom';
import { InfraEvent } from '../../model/infra-event.model'
import { getAllEvents, getEventById, updateEvent } from '../../services/event.service'
import { useEffect, useState } from 'react'
import { Result } from '../../model/zabbix/response.model'
import { plainToInstance } from 'class-transformer'
import { DataOffice365 } from '../../model/wazuh/data-office365.model'
import { DataPkg } from '../../model/wazuh/data-pkg.model'
import { DataFw } from '../../model/wazuh/data-fw.model'
import { DataWin } from '../../model/wazuh/data-win.model'
import { Source } from '../../model/wazuh/source.model'

const severities = {
  'Baja': 0,
  'Media': 1,
  'Alta': 2,
  'Crítica': 3,
};


const Dashboard = () => {

  return <DashboardContent />;
};

const DashboardContent = () => {
  const [events, setEvents] = useState<InfraEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false); // State for modal visibility
  const [escalateModalVisible, setEscalateModalVisible] = useState(false); // State for modal visibility
  const [discardModalVisible, setDiscardModalVisible] = useState(false); // State for modal visibility
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null); // State for selected event ID
  const [detail, setDetail] = useState<string>(''); // State for event details

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      // if a modal is open, do dot refresh events
      if (detailModalVisible || escalateModalVisible || discardModalVisible) {
        return;
      }
      setLoading(true);
      try {
        const fetchedEvents: InfraEvent[] = await getAllEvents();

        // Descending Order of severity
        const severitiesMap: { [key: string]: number } = {};
        Object.entries(severities).forEach(([key, value]) => {
          severitiesMap[key] = value;
        });
        // Sort events based on severity 
      
        fetchedEvents.sort((a, b) => (severitiesMap[b.severity || ''] || 0) - (severitiesMap[a.severity || ''] || 0));

        // filter events based on CFormCheck options checked

        if ((document.getElementById('inlineCheckboxAll') as HTMLInputElement)?.checked) {
          // allEvents = fetchedEvents;
        } else {
          let active: boolean = false;
          let escalated: boolean = false;
          let discarded: boolean = false;

          if ((document.getElementById('inlineCheckboxActive') as HTMLInputElement)?.checked) {
            active = true;
          }
          if ((document.getElementById('inlineCheckboxDiscarded') as HTMLInputElement)?.checked) {
            discarded = true;
          }
          if ((document.getElementById('inlineCheckboxEscalated') as HTMLInputElement)?.checked) {
            escalated = true;
          }

          if (active && escalated && discarded) {
            fetchedEvents.filter(event => event.status === 'active'|| event.status === 'escalated' || event.status === 'discarded');
          } else if (active && escalated && !discarded) {
            fetchedEvents.filter(event => event.status === 'active' || event.status === 'escalated');
          } else if (active && !escalated && discarded) {
            fetchedEvents.filter(event => event.status === 'active' || event.status === 'discarded');
          } else if (!active && escalated && discarded) {
            fetchedEvents.filter(event => event.status === 'escalated' || event.status === 'discarded');
          } else if (active && !escalated && !discarded) {
            fetchedEvents.filter(event => event.status === 'active');
          } else if (!active && escalated && !discarded) {
            fetchedEvents.filter(event => event.status === 'escalated');
          } else if (!active && !escalated && discarded) {
            fetchedEvents.filter(event => event.status === 'discarded');
          } else if (!active && !escalated && !discarded) {
            // No events to show
          }
        }

        // const allEvents = fetchedEvents.filter(event => event.status === 'all');
        // const escalatedEvents = fetchedEvents.filter(event => event.status === 'escalated');
        // const discardedEvents = fetchedEvents.filter(event => event.status === 'discarded');

        setEvents(fetchedEvents);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Error fetching events');
        setLoading(false);
      }
    };

  // Call fetchEvent immediately and set up an interval
    fetchEvents();
    const intervalId = setInterval(fetchEvents, 30000); // Call every 60 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  if (error) { 
    return <div>{error}</div>;
  }
  if (!events || events.length === 0) {
    return <div>En este momento no hay eventos activos</div>;
  }
   

  const handleDetail = async (eventId: number) => {
    console.log(`Detalle button clicked for event ID: ${eventId}`)
    // Add your logic here (e.g., navigate to a detail page or show a modal)

    // Detail in a separate page
    // navigate(`/dashboard/event-detail/${eventId}`);

    // Detail in a modal
    setSelectedEventId(eventId); // Store the event ID
    setDetailModalVisible(true); // Show the modal

    try {
      const fetchedEvent = await getEventById(eventId); // Fetch event details
      if (fetchedEvent) {







        let eventDetail = '';

        if (fetchedEvent.origin === 'wazuh') {

          // console.log('fetchedEvent.detail', fetchedEvent.detail);
          // console.log('fetchedEvent.detail', JSON.stringify(fetchedEvent.detail, null, 2)); 
          if (!fetchedEvent.detail) {
            setDetail('Event detail not found');
            setLoading(false);
            return;
          }
          const source: Source = plainToInstance(Source, JSON.parse(fetchedEvent.detail), {
            excludeExtraneousValues: false,
          });

          console.log('source', source);
          console.log('source.rule', source.rule);

          if (!source || !source.rule || !source.agent) {
            setDetail('Source not found');
            setLoading(false);
            return;
          }

          const { rule, agent, data, fullLog } = source;
          eventDetail += `rule.id: ${rule.id}\n`;
          eventDetail += `rule.description: ${rule.description}\n`;
          eventDetail += `rule.level: ${rule.level}\n`;

          eventDetail += `agent.id: ${agent.id}\n`;
          eventDetail += `agent.name: ${agent.name}\n`;
          eventDetail += `agent.ip: ${agent.ip}\n`;
          eventDetail += `agent.os: ${agent.os}\n`;
          eventDetail += `agent.status: ${agent.status}\n`;
          eventDetail += `agent.version: ${agent.version}\n\n`;

          switch (rule.id) {
            case "60115":
              case "92650":
              case "92657": {
                  // Windows alert
                  const win = plainToInstance(DataWin, JSON.parse(JSON.stringify(data)), {
                    excludeExtraneousValues: false,
                  });
                  // console.log(win);
                  eventDetail += JSON.stringify(win, null, 2);
                }
                  break;
              case "70021":
              case "70022": {
                  // FW alert denied/permited traffic
                  const dataFw = plainToInstance(DataFw, JSON.parse(JSON.stringify(data)), {
                    excludeExtraneousValues: false,
                  });
                  // console.log(dataFw);
                  eventDetail += JSON.stringify(dataFw, null, 2);
                  console.log(eventDetail);
                }
                  break;
              case "2903": {
                  // Linux package
                  const dataPkg = plainToInstance(DataPkg, JSON.parse(JSON.stringify(data)), {
                    excludeExtraneousValues: false,
                  });
                  eventDetail += JSON.stringify(dataPkg, null, 2);
                  console.log(eventDetail);
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
                    eventDetail += "full_log:\n";
                    eventDetail += fullLog ? fullLog : "No hay detalles";
                    // console.log(detalle);
              }
                    break;
              case "91575": {
                  // office365
                  const dataOffice365 = plainToInstance(DataOffice365, JSON.parse(JSON.stringify(data)), {
                              excludeExtraneousValues: false,
                          });
                  // console.log(dataOffice365);
                  eventDetail += JSON.stringify(dataOffice365, null, 2);
                  }
                  break;
              default:
                eventDetail += 'No additional details available.';
                break;
          }
        } else if (fetchedEvent.origin === 'zabbix') {
          if (!fetchedEvent.detail) {
            setDetail('Event detail not found');
            setLoading(false);
            return;
          }
          const result: Result = plainToInstance(Result, JSON.parse(fetchedEvent.detail), {
            excludeExtraneousValues: false,
          });

          eventDetail += `host.name: ${fetchedEvent!.equipment!.name || "Desconocido"}\n`;
          eventDetail += `host.ip: ${fetchedEvent!.equipment!.ip || "Desconocida"}\n\n`;

          eventDetail += JSON.stringify(result, null, 2);
        } else {
          eventDetail += 'Unknown origin';
        }







        setDetail(eventDetail); // Format and store details
        
      } else {
        setDetail('No details available for this event.');
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      setDetail('Error fetching event details.');
    }

  }

  const handleEscalateDetail = () => {
    console.log(`Confirmed escalation for event ID: ${selectedEventId}`);
    // Add your logic here (e.g., send an API request to escalate the event)
    // setDetailModalVisible(false); // Close the modal
    // setDetail(''); // Clear the details

    setEscalateModalVisible(true); // Show the modal
  };

  const handleDiscardDetail = () => {
    console.log(`Confirmed escalation for event ID: ${selectedEventId}`);
    // Add your logic here (e.g., send an API request to escalate the event)
    // setDetailModalVisible(false); // Close the modal
    // setDetail(''); // Clear the details

    setDiscardModalVisible(true); // Show the modal
  };

  const handleCloseDetail = () => {
    setDetailModalVisible(false); // Close the modal
    setDetail(''); // Clear the details
  };

  const handleDismiss = (eventId: number) => {
    console.log(`Descartar button clicked for event ID: ${eventId}`)
    // Add your logic here (e.g., remove the event from the list)
    setSelectedEventId(eventId); // Store the event ID
    setDiscardModalVisible(true); // Show the modal
  }

  const handleConfirmDiscard = async () => {
    console.log(`Confirmed escalation for event ID: ${selectedEventId}`);
    // Add your logic here (e.g., send an API request to escalate the event)
    setDiscardModalVisible(false); // Close the modal

    if (detailModalVisible) {
      setDetailModalVisible(false); // Close the modal
      setDetail(''); // Clear the details
    }
    
    // Remove the event from the list
    // setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEventId));


    const updatedEvent = await updateEvent({id: selectedEventId!, status: 'discarded'}).then((response) => {
      console.log('Event discarded:', updatedEvent);
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEventId));
    }).catch((error) => {
      console.error('Error discarding event:', error);
    });

    // Optionally, you can also show a success message or perform any other action
    console.log(`Event with ID ${selectedEventId} discarded.`);
    // Reset selectedEventId
    setSelectedEventId(null);
  };

  const handleCancelDiscard = () => {
    setDiscardModalVisible(false); // Close the modal
  };

  const handleEscalate = (eventId: number) => {
    console.log(`Escalar button clicked for event ID: ${eventId}`);
    setSelectedEventId(eventId); // Store the event ID
    setEscalateModalVisible(true); // Show the modal
  };

  const handleConfirmEscalate = async () => {
    console.log(`Confirmed escalation for event ID: ${selectedEventId}`);
    // Add your logic here (e.g., send an API request to escalate the event)
    setEscalateModalVisible(false); // Close the modal

    if (detailModalVisible) {
      setDetailModalVisible(false); // Close the modal
      setDetail(''); // Clear the details
    }
    
    // Remove the event from the list
    // setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEventId));


    const updatedEvent = await updateEvent({id: selectedEventId!, status: 'escalated'}).then((response) => {
      console.log('Event escalated:', updatedEvent);
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEventId));
    }).catch((error) => {
      console.error('Error discarding event:', error);
    });



    // Optionally, you can also show a success message or perform any other action
    console.log(`Event with ID ${selectedEventId} discarded.`);
    // Reset selectedEventId
    setSelectedEventId(null);

  };

  const handleCancelEscalate = () => {
    setEscalateModalVisible(false); // Close the modal
  };


  const progressExample = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]
  /*
  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'India', flag: cifIn },
      usage: {
        value: 74,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cibCcStripe },
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'France', flag: cifFr },
      usage: {
        value: 98,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cibCcPaypal },
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Spain', flag: cifEs },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Poland', flag: cifPl },
      usage: {
        value: 43,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cibCcAmex },
      activity: 'Last week',
    },
  ]
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
            <CCardHeader>
              Eventos
              <CFormCheck inline id="inlineCheckboxAll" value="option1" label="Todos" />
              <CFormCheck inline id="inlineCheckboxActive" value="option2" label="Activos" />
              <CFormCheck inline id="inlineCheckboxEscalated" value="option2" label="Escalados" />
              <CFormCheck inline id="inlineCheckboxDiscarded" value="option3" label="Descartados" />
            </CCardHeader>
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
                    <CTableHeaderCell className="bg-body-tertiary">Severidad</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Entidad</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Descripción</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Acciones</CTableHeaderCell>
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
                  {events.map((event) => (
                    <CTableRow v-for="event in events" key={event.id}>
                      {/* <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell> */}
                      <CTableDataCell>
                        <div>
                          {event.severity}
                        </div>
                        <div className="small text-body-secondary text-nowrap">
                          {event.timestamp?.toString()}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>
                          {event.equipment?.name || 'Nombre Desconocido'}
                        </div>
                        <div className="small text-body-secondary text-nowrap">
                          {event.equipment?.ip || 'IP Desconocida'}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{event.description}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButtonGroup role="group" aria-label="Basic example">
                          <CButton
                            color="primary"
                            variant="outline"
                            onClick={() => handleDetail(event.id!)}
                          >
                            Detalle
                          </CButton>
                          <CButton
                            color="primary"
                            variant="outline"
                            onClick={() => handleEscalate(event.id!)}
                          >
                            Escalar
                          </CButton>
                          <CButton
                            color="primary"
                            variant="outline"
                            onClick={() => handleDismiss(event.id!)}
                          >
                            Descartar
                          </CButton>
                        </CButtonGroup>
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
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal for Detail */}
      <CModal visible={detailModalVisible} onClose={handleCloseDetail}>
        <CModalHeader>Detalle de Evento #{selectedEventId}</CModalHeader>
        <CModalBody>
  
          <div className="fw-semibold">
            <pre style={{ whiteSpace: 'pre-wrap' }}>{detail}</pre>
          </div>
          
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleEscalateDetail}>
            Escalar
          </CButton>
          <CButton color="primary" onClick={handleDiscardDetail}>
            Descartar
          </CButton>
          <CButton color="secondary" onClick={handleCloseDetail}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal for Escalation */}
      <CModal visible={escalateModalVisible} onClose={handleCancelEscalate}>
        <CModalHeader>Confirmar Escalamiento</CModalHeader>
        <CModalBody>
          ¿Está seguro de que desea escalar el evento con ID {selectedEventId}?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCancelEscalate}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleConfirmEscalate}>
            Confirmar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal for Acknowledge/Discard */}
      <CModal visible={discardModalVisible} onClose={handleCancelDiscard}>
        <CModalHeader>Confirmar Descarte</CModalHeader>
        <CModalBody>
          ¿Está seguro de que desea descartar el evento con ID {selectedEventId}?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCancelDiscard}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleConfirmDiscard}>
            Confirmar
          </CButton>
        </CModalFooter>
      </CModal>



    </>
  )
}

export default Dashboard
