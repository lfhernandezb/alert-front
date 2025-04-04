import { InfraEvent } from '../../model/infra-event.model'
import { getAllEvents, getEventById, updateEvent } from '../../services/event.service'
import { useEffect, useRef } from 'react'
import { useEventStore } from '../../store/event-store'
import { Result } from '../../model/zabbix/response.model'
import { plainToInstance } from 'class-transformer'
import { DataOffice365 } from '../../model/wazuh/data-office365.model'
import { DataPkg } from '../../model/wazuh/data-pkg.model'
import { DataFw } from '../../model/wazuh/data-fw.model'
import { DataWin } from '../../model/wazuh/data-win.model'
import { Source } from '../../model/wazuh/source.model'

import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CPagination,
  CPaginationItem,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMagnifyingGlass, cilTrash, cilWarning } from '@coreui/icons'

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

  // flags to avoid run useEffect's on mount
  const isMounted1 = useRef(false); // Ref to track if the component has mounted
  const isMounted2 = useRef(false); // Ref to track if the component has mounted
  const isMounted3 = useRef(false); // Ref to track if the component has mounted
  const isMounted4 = useRef(false); // Ref to track if the component has mounted

  /* replaced by zuztand
  // events displayed in page
  const [displayedEvents, setDisplayedEvents] = useState<InfraEvent[]>([]);
  // events fetched from API and filtered
  const [events, setEvents] = useState<InfraEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false); // State for modal visibility
  const [escalateModalVisible, setEscalateModalVisible] = useState(false); // State for modal visibility
  const [discardModalVisible, setDiscardModalVisible] = useState(false); // State for modal visibility
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null); // State for selected event ID
  const [detail, setDetail] = useState<string>(''); // State for event details

  // State for checkboxes
  const [showAll, setShowAll] = useState(true);
  const [showActive, setShowActive] = useState(false);
  const [showEscalated, setShowEscalated] = useState(false);
  const [showDiscarded, setShowDiscarded] = useState(false);
  
  // State for events per page
  const [selectedEventsPerPage, setSelectedEventsPerPage] = useState<number>(1); // State for selected limit

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // const [eventsPerPage, setEventsPerPage] = useState(1);
  // const [totalEvents, setTotalEvents] = useState(0);
  */

    const {
      events,
      displayedEvents,
      selectedEventId,
      detail,
      detailModalVisible,
      escalateModalVisible,
      discardModalVisible,
      currentPage,
      selectedEventsPerPage,
      showAll,
      showActive,
      showEscalated,
      showDiscarded,
      totalPages,
      loading,
      error,
      scrollPosition,
      setScrollPosition,
      setEvents,
      setDisplayedEvents,
      setSelectedEventId,
      setDetail,
      setDetailModalVisible,
      setEscalateModalVisible,
      setDiscardModalVisible,
      setCurrentPage,
      setSelectedEventsPerPage,
      setLoading,
      setError,
      setShowActive,
      setShowEscalated,
      setShowDiscarded,
      setShowAll,
      setTotalPages, // Removed as it does not exist in EventStore

    } = useEventStore();
  


  // const navigate = useNavigate();

  const filterEvents = (events: InfraEvent[]) => {
    if (showAll) {
      return events;
    }

    return events.filter((event) => {
      if (showActive && event.status === 'active') return true;
      if (showEscalated && event.status === 'escalated') return true;
      if (showDiscarded && event.status === 'discarded') return true;
      return false;
    });
  }

  useEffect(() => {
    /*
    if (!isMounted1.current) {
      // Skip the first execution on mount
      isMounted1.current = true;
      return;
    }
    */
    console.log("useEffect 1");
    const fetchEvents = async () => {
      console.log("fetchEvents");
      // if a modal is open, do dot refresh events
      if (detailModalVisible || escalateModalVisible || discardModalVisible) {
        return;
      }
      // setLoading(true);
      try {
        const fetchedEvents: InfraEvent[] = await getAllEvents();

        // console.log('Fetched events:', fetchedEvents);
        // console.log('Fetched events number:', fetchedEvents.length);

        // Descending Order of severity
        const severitiesMap: { [key: string]: number } = {};
        Object.entries(severities).forEach(([key, value]) => {
          severitiesMap[key] = value;
        });
        // Sort events based on severity 
      
        fetchedEvents.sort((a, b) => (severitiesMap[b.severity || ''] || 0) - (severitiesMap[a.severity || ''] || 0));

        // console.log('Sorted events:', fetchedEvents);

        // filter events based on CFormCheck options checked
        const filteredEvents = filterEvents(fetchedEvents);



        // compare the id's of filteres events with the id's of events to see if they are the same
        const filteredEventsIds = filteredEvents.map(event => event.id);
        const eventsIds = events.map(event => event.id);
        console.log('Filtered events ids:', filteredEventsIds);
        console.log('Events ids:', eventsIds);
        // if they are the same, do not update the state
        if (JSON.stringify(filteredEventsIds) !== JSON.stringify(eventsIds)) {
          console.log('Filteres events are distincts to events');
          setEvents(filteredEvents);
        }

        // const allEvents = fetchedEvents.filter(event => event.status === 'all');
        // const escalatedEvents = fetchedEvents.filter(event => event.status === 'escalated');
        // const discardedEvents = fetchedEvents.filter(event => event.status === 'discarded');

        // pagination logic
   
        // const eventsPerPage = selectedEventsPerPage;
        // console.log('Selected events per page:', selectedEventsPerPage); // Log the selected value
        //    setTotalPages(Math.ceil(eventsArraySize / selectedEventsPerPage)); // Removed as setTotalPages is not defined
        // console.log('Current page:', currentPage); // Log the current page
        const startIndex = (currentPage - 1) * selectedEventsPerPage;
        const endIndex = startIndex + selectedEventsPerPage;
        const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

        // compare the id's of paginated events with the id's of displayed events to see if they are the same
        const displayedEventsIds = displayedEvents.map(event => event.id);
        const paginatedEventsIds = paginatedEvents.map(event => event.id);
        console.log('Displayed events ids:', displayedEventsIds);
        console.log('Paginated events ids:', paginatedEventsIds);
        // if they are the same, do not update the state
        if (JSON.stringify(displayedEventsIds) === JSON.stringify(paginatedEventsIds)) {
          console.log('Displayed events are the same as paginated events');
          // setLoading(false);
          return;
        }
        
        // eventually we could have loaded more or less events than before
        setTotalPages(Math.ceil(filteredEvents.length / selectedEventsPerPage));

        setDisplayedEvents(paginatedEvents);

        // setLoading(false);

        setError(null); // Clear any previous error
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Error fetching events');
        // setLoading(false);
      }
    };

  // Call fetchEvent immediately and set up an interval
    fetchEvents();
    const intervalId = setInterval(fetchEvents, 30000); // Call every 60 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [showAll, showActive, showEscalated, showDiscarded, detailModalVisible, escalateModalVisible, discardModalVisible]);
  
  useEffect(() => {
    if (!isMounted2.current) {
      // Skip the first execution on mount
      isMounted2.current = true;
      return;
    }

    console.log("useEffect 2");
    // console.log('Selected events per page:', selectedEventsPerPage); // Log the selected value
    // console.log('events lenght:', events.length); // Log the paginated events
    // const eventsPerPage = selectedEventsPerPage;
    setTotalPages(Math.ceil(events.length / selectedEventsPerPage));
    setCurrentPage(1); // Reset to the first page when eventsPerPage changes
    const startIndex = (0) * selectedEventsPerPage;
    const endIndex = startIndex + selectedEventsPerPage;
    const paginatedEvents = events.slice(startIndex, endIndex);

    // console.log('Paginated events:', paginatedEvents); // Log the paginated events
    // console.log('Total pages:', totalPages); // Log the total pages
    // console.log('Current page:', currentPage); // Log the current page
    // console.log('Paginated events lenght:', paginatedEvents.length); // Log the paginated events

    setDisplayedEvents(paginatedEvents);
  }, [selectedEventsPerPage]);
  
  useEffect(() => {
    if (!isMounted3.current) {
      // Skip the first execution on mount
      isMounted3.current = true;
      return;
    }

    console.log("useEffect 3");
    // console.log('Selected events per page:', selectedEventsPerPage); // Log the selected value
    // console.log('events lenght:', events.length); // Log the paginated events
    const startIndex = (currentPage - 1) * selectedEventsPerPage;
    const endIndex = startIndex + selectedEventsPerPage;
    const paginatedEvents = events.slice(startIndex, endIndex);

    // console.log('Paginated events:', paginatedEvents); // Log the paginated events
    // console.log('Total pages:', totalPages); // Log the total pages
    // console.log('Current page:', currentPage); // Log the current page
    // console.log('Paginated events lenght:', paginatedEvents.length); // Log the paginated events

    setDisplayedEvents(paginatedEvents);
  }, [currentPage]);

  useEffect(() => {
    /*
    if (!isMounted4.current) {
      // Skip the first execution on mount
      isMounted4.current = true;
      return;
    }
    */
    console.log("useEffect 4");
    console.log('Scroll position on useEffect 4:', scrollPosition); // Log the scroll position
    // Restore scroll position on page load
    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth', // 'auto' or 'smooth'
    });
      
      //0, scrollPosition, );

    // Save scroll position on scroll
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    /*
    window.addEventListener('focusin', () => {
      console.log('Page focused');
      // Restore scroll position when the page is focused
      window.scrollTo({
        top: scrollPosition,
        behavior: 'auto', // 'auto' or 'smooth'
      });
    });
    */
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  
  const handleCheckboxChange = (checkbox: string) => {
    switch (checkbox) {
      case 'all':
        setShowAll(true);
        setShowActive(false);
        setShowEscalated(false);
        setShowDiscarded(false);
        break;
      case 'active':
        setShowAll(false);
        setShowActive(!showActive);
        break;
      case 'escalated':
        setShowAll(false);
        setShowEscalated(!showEscalated);
        break;
      case 'discarded':
        setShowAll(false);
        setShowDiscarded(!showDiscarded);
        break;
      default:
        break;
    }
  };

  const handleEventsPerPageSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value, 10); // Convert the value to a number
    setSelectedEventsPerPage(selectedValue); // Update the state
    // console.log('Selected value:', selectedValue); // Log the selected value
    // Add any additional logic here, such as fetching data based on the selected limit
  };

  if (loading) {
    return <div>Cargando...</div>;
  }
  if (error) { 
    return <div>{error}</div>;
  }
  /*
  if (!events || events.length === 0) {
    return <div>En este momento no hay eventos activos</div>;
  }
  */

  const handleDetail = async (eventId: number) => {
    // console.log(`Detalle button clicked for event ID: ${eventId}`)
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

          // console.log('source', source);
          // console.log('source.rule', source.rule);

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
                  // console.log(eventDetail);
                }
                  break;
              case "2903": {
                  // Linux package
                  const dataPkg = plainToInstance(DataPkg, JSON.parse(JSON.stringify(data)), {
                    excludeExtraneousValues: false,
                  });
                  eventDetail += JSON.stringify(dataPkg, null, 2);
                  // console.log(eventDetail);
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
                    // console.log(alert);
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
    // console.log(`Confirmed escalation for event ID: ${selectedEventId}`);
    // Add your logic here (e.g., send an API request to escalate the event)
    // setDetailModalVisible(false); // Close the modal
    // setDetail(''); // Clear the details

    setEscalateModalVisible(true); // Show the modal
  };

  const handleDiscardDetail = () => {
    // console.log(`Confirmed escalation for event ID: ${selectedEventId}`);
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
    // console.log(`Descartar button clicked for event ID: ${eventId}`)
    // Add your logic here (e.g., remove the event from the list)
    setSelectedEventId(eventId); // Store the event ID
    setDiscardModalVisible(true); // Show the modal
  }

  const handleConfirmDiscard = async () => {
    // console.log(`Confirmed escalation for event ID: ${selectedEventId}`);
    // Add your logic here (e.g., send an API request to escalate the event)
    setDiscardModalVisible(false); // Close the modal

    if (detailModalVisible) {
      setDetailModalVisible(false); // Close the modal
      setDetail(''); // Clear the details
    }
    
    // Remove the event from the list
    // setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEventId));


    const updatedEvent = await updateEvent({id: selectedEventId!, status: 'discarded'}).then(() => {
      // console.log('Event discarded:', updatedEvent);
      // setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEventId));

      filterEvents(events);
    }).catch((error) => {
      console.error('Error discarding event:', error);
    });

    // Optionally, you can also show a success message or perform any other action
    // console.log(`Event with ID ${selectedEventId} discarded.`);
    // Reset selectedEventId
    setSelectedEventId(null);
  };

  const handleCancelDiscard = () => {
    setDiscardModalVisible(false); // Close the modal
  };

  const handleEscalate = (eventId: number) => {
    // console.log(`Escalar button clicked for event ID: ${eventId}`);
    setSelectedEventId(eventId); // Store the event ID
    setEscalateModalVisible(true); // Show the modal
  };

  const handleConfirmEscalate = async () => {
    // console.log(`Confirmed escalation for event ID: ${selectedEventId}`);
    // Add your logic here (e.g., send an API request to escalate the event)
    setEscalateModalVisible(false); // Close the modal

    if (detailModalVisible) {
      setDetailModalVisible(false); // Close the modal
      setDetail(''); // Clear the details
    }
    
    // Remove the event from the list
    // setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEventId));


    const updatedEvent = await updateEvent({id: selectedEventId!, status: 'escalated'}).then(() => {
      // console.log('Event escalated:', updatedEvent);
      // setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEventId));

      filterEvents(events);
    }).catch((error) => {
      console.error('Error discarding event:', error);
    });



    // Optionally, you can also show a success message or perform any other action
    // console.log(`Event with ID ${selectedEventId} discarded.`);
    // Reset selectedEventId
    setSelectedEventId(null);

  };

  const handleCancelEscalate = () => {
    setEscalateModalVisible(false); // Close the modal
  };


/*   const progressExample = [
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
  ] */
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
            {/*
            <CCardHeader>
              Eventos
              <CFormCheck
                inline
                id="inlineCheckboxAll"
                value="all"
                label="Todos"
                checked={showAll}
                onChange={() => handleCheckboxChange('all')}
              />
              <CFormCheck
                inline
                id="inlineCheckboxActive"
                value="active"
                label="Activos"
                checked={showActive}
                onChange={() => handleCheckboxChange('active')}
              />
              <CFormCheck
                inline
                id="inlineCheckboxEscalated"
                value="escalated"
                label="Escalados"
                checked={showEscalated}
                onChange={() => handleCheckboxChange('escalated')}
              />
              <CFormCheck
                inline
                id="inlineCheckboxDiscarded"
                value="discarded"
                label="Descartados"
                checked={showDiscarded}
                onChange={() => handleCheckboxChange('discarded')}
              />

              <CFormSelect aria-label="Default select example">
                <option>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3" disabled>Three</option>
              </CFormSelect>
            </CCardHeader>
            */}


{/*
### **Explanation**

1. **Flexbox Container**:
   - The `div` wrapping the `CFormCheck` and `CFormSelect` elements is styled with `d-flex` (CoreUI's utility class for flexbox).
   - `justify-content-between` ensures that the `CFormCheck` group is aligned to the left and the `CFormSelect` is aligned to the right.
   - `align-items-center` vertically aligns the elements in the center.

2. **Separate Sections**:
   - The `CFormCheck` elements are grouped in a `div` with `d-flex` to align them horizontally.
   - The `CFormSelect` is placed in the same flex container but positioned to the right using `justify-content-between`.

3. **Custom Width for `CFormSelect`**:
   - The `style={{ width: '200px' }}` ensures the dropdown has a fixed width. You can adjust this value as needed.

---

### **Result**
The `CFormCheck` elements will be aligned horizontally on the left, and the `CFormSelect` will be positioned to the right in the same row. This layout is responsive and works well with CoreUI's utility classes.

Similar code found with 1 license type

*/}
            
            <CCardHeader>
              
              <div className="d-flex justify-content-between align-items-center">
                {/* Left Section: CFormCheck */}
                <div className="d-flex">
                <span className="me-3">Eventos</span> {/* Add margin to the right */}
                  <CFormCheck
                    inline
                    id="inlineCheckboxAll"
                    value="all"
                    label="Todos"
                    checked={showAll}
                    onChange={() => handleCheckboxChange('all')}
                  />
                  <CFormCheck
                    inline
                    id="inlineCheckboxActive"
                    value="active"
                    label="Activos"
                    checked={showActive}
                    onChange={() => handleCheckboxChange('active')}
                  />
                  <CFormCheck
                    inline
                    id="inlineCheckboxEscalated"
                    value="escalated"
                    label="Escalados"
                    checked={showEscalated}
                    onChange={() => handleCheckboxChange('escalated')}
                  />
                  <CFormCheck
                    inline
                    id="inlineCheckboxDiscarded"
                    value="discarded"
                    label="Descartados"
                    checked={showDiscarded}
                    onChange={() => handleCheckboxChange('discarded')}
                  />
                </div>

                {/* Right Section: CFormSelect */}
                <div className="d-flex align-items-center">
                  <label htmlFor="eventLimit" className="me-2">
                    Eventos por Página:
                  </label>
                  <CFormSelect
                    id="eventLimit"
                    aria-label="Default select example"
                    style={{ width: '70px' }}
                    value={selectedEventsPerPage} // Bind the state to the select element
                    onChange={handleEventsPerPageSelectChange} // Attach the change handler
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                  </CFormSelect>
                </div>
              </div>
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

              <CPagination aria-label="Page navigation example">
                {/* Previous Button */}
                <CPaginationItem
                  aria-label="Previous"
                  disabled={currentPage === 1} // Disable if on the first page
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} // Decrement page
                >
                  &laquo;
                </CPaginationItem>

                {/* Dynamically Generate Page Items */}
                {Array.from({ length: totalPages }, (_, index) => (
                  <CPaginationItem
                    key={index + 1}
                    active={currentPage === index + 1} // Highlight the current page
                    onClick={() => setCurrentPage(index + 1)} // Set the current page
                  >
                    {index + 1}
                  </CPaginationItem>
                ))}

                {/* Next Button */}
                <CPaginationItem
                  aria-label="Next"
                  disabled={currentPage === totalPages} // Disable if on the last page
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} // Increment page
                >
                  &raquo;
                </CPaginationItem>
              </CPagination>

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
                  {displayedEvents.map((event) => (
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
                            variant="ghost"
                            onClick={() => handleDetail(event.id!)}
                          >
                            <CIcon icon={cilMagnifyingGlass} className="me-2" />
                          </CButton>
                          <CButton
                            color="primary"
                            variant="ghost"
                            onClick={() => handleEscalate(event.id!)}
                          >
                            <CIcon icon={cilWarning} className="me-2" />
                          </CButton>
                          <CButton
                            color="primary"
                            variant="ghost"
                            onClick={() => handleDismiss(event.id!)}
                          >
                            <CIcon icon={cilTrash} className="me-2" />
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
