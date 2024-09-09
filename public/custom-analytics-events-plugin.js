/* ============================================================ */
/*
  CUSTOM ANALYTICS EVENTS 
  - Connects to Google Analytics via Google Tag Manager
  
  WARNINGS:
  - Event Naming Rules for GA: https://support.google.com/analytics/answer/13316687?hl=en&ref_topic=13367860&sjid=17187452480426313666-NA#zippy=%2Cweb
  -- Shortlist: 'click', 'error', 'form_submit', 'form_start', 'file_download'
============================================================
  - Functions:

  -- General Event Pusher 
  --- what sends the events to GTM/GA
  --- "eventName" variable: MUST match the "Event contains" value in 
        the "Custom GA Event Trigger" trigger in Google Tag Manager. 
        This then triggers the "Custom GA Event Passer" tag that 
        sends the data to Google Analytics as an event.
  --- USAGE:
        //event settings
        let eventCat = "slide_navigation";
        let eventLab = slideViewEvent;
        let eventAct = "in_page_navigation";
        let eventVal = "n_a";
        AnalyticsEvent(eventCat, eventLab, eventAct, eventVal);

  -- UTM Event Pusher 
  --- modified event pusher
  --- "eventName" variable: uses 'custom_utm_event'
  --- note: 'utm_state' variable is non-standard and experimental
  --- USAGE:
        //event settings
        let utm_campaign = utm_values.utm_campaign;
        let utm_content = utm_values.utm_content;
        let utm_medium = utm_values.utm_medium;
        let utm_source = utm_values.utm_source;
        let utm_term = utm_values.utm_term;
        let utm_state = utm_values.utm_state;
        AnalyticsEventUTM(utm_campaign, utm_content, utm_medium, utm_source, utm_term, utm_state);

  -- URL Parameter Logger 
  --- grabs URL parameters and saves them to sessionStorage and 
        localStorage, keeping the values availble for later use
  --- sample URL: https://website.com?utm_source=test&utm_medium=test&utm_campaign=test&utm_term=test&utm_content=test

  -- Get UTMs 
  --- returns latest live or saved UTM data
  --- returns UTMs as single object, access like: 'utm_values.utm_campaign'
  --- USAGE:
        //Grab all values at once for efficiency
        let utm_values = GetUTMs();
        let utm_campaign = utm_values.utm_campaign;
        let utm_content = utm_values.utm_content;
        let utm_medium = utm_values.utm_medium;
        let utm_source = utm_values.utm_source;
        let utm_term = utm_values.utm_term;
        let utm_state = utm_values.utm_state;

  -- Misc. Helper Functions

  -- Run Functions / Triggers

*/
/* ============================================================ */

/* ===== ================= ===== */
/* ===== Starter Functions ===== */
/* ===== ================= ===== */

    // devMode - turns console.log snippets on and off
    let devMode = true;
    /* Example:
        if(devMode == true){
            //console logs
        } 
    */

    //console.log test script file connection
    if(devMode == true){
        console.log("===== custom-analtyics-event-plugin.js file working!!! =====");
    } 

/* ===== =================== ===== */
/* ===== Top-Level Variables ===== */
/* ===== =================== ===== */
  //These variables are absolutely necessary for the GTM tags, and they MUST match the corresponding variables in GTM.
  const analyticsEventName = "custom_ga_event";
  const utmAnalyticsEventName = "custom_utm_event";
  const customAnalyticsEventPrefix = "custom_event_";

/* ===== ==================================== ===== */
/* ===== Main Function - General Event Pusher ===== */
/* ===== ==================================== ===== */

  function AnalyticsEvent(eventCat, eventLab, eventAct, eventVal){
    //Set vars - event name & sub-parameters
    const eventName = analyticsEventName; //static, do not update
    eventCat = eventCat || 'no_category'; //gives default/fallback value
    eventLab = eventLab || 'no_label';
    eventAct = eventAct || 'no_action';
    eventVal = eventVal || 'no_value';

    //console log tester
    console.groupCollapsed("===== Custom Analytics Event Triggered =====");
      console.log("Event Name: ["+eventName+"]");
      console.log("Event Category: ["+eventCat+"]");
      console.log("Event Label: ["+eventLab+"]");
      console.log("Event Action: ["+eventAct+"]");
      console.log("Event Value: ["+eventVal+"]");
      console.log("NOTES: To QA events, look under: Google Analytics Container > Realtime > Event Count by Event Name > 'GAEvent' > 'Event Label'.");
    console.groupEnd();

    try {
     //Push event to datalayer
     window.dataLayer = window.dataLayer || [];
     dataLayer.push({
       'event':          eventName,
       'eventCategory':  eventCat,
       'eventAction':    eventAct,
       'eventLabel':     eventLab,
       'eventValue':     eventVal,
     });
     //console.log("===== Custom Analytics Event Pushed =====");
    } catch (e) {
     //console.log("===== Custom Analytics Event Error =====");
    }
  };


/* ===== =================================== ===== */
/* ===== Main Function - Simple Event Pusher ===== */
/* ===== =================================== ===== */

function SimpleAnalyticsEvent(event_name){
  //Set vars - event name & sub-parameters
  //const eventName = analyticsEventName; //static, do not update
  //eventCat = eventCat || 'no_category'; //gives default/fallback value
  //eventLab = eventLab || 'no_label';
  //eventAct = eventAct || 'no_action';
  //eventVal = eventVal || 'no_value';

  //event_name = customAnalyticsEventPrefix+event_name;

  //console log tester
  console.groupCollapsed("===== Dynamically-Named Analytics Event Triggered =====");
    console.log("Event Name: [dynamic_event_name]");
    console.log("Event Detail: ["+event_name+"]");
    console.log("NOTES: To QA events, look under: Google Analytics Container > Realtime > Event Count by Event Name");
  console.groupEnd();

  try {
   //Push event to datalayer
   window.dataLayer = window.dataLayer || [];
   dataLayer.push({
     'event': "dynamic_event_name",
     'event_detail': event_name,
   });
   console.log("===== Dynamically-Named Analytics Event Pushed =====");
  } catch (e) {
   console.log("===== Dynamically-Named Analytics Event Error =====");
  }
};  

/* ===== ====================== ===== */
/* ===== Misc. Helper Functions ===== */
/* ===== ====================== ===== */

  

/* ===== ========================================== ===== */
/* ===== RUN FUNCTIONS - TRIGGERS & EVENT LISTENERS ===== */
/* ===== ========================================== ===== */

/* ============================================================ */
/*
	Notes Comments Section
	//event settings
  let eventCat = "slide_navigation";
  let eventLab = slideViewEvent;
  let eventAct = "in_page_navigation";
  let eventVal = "n_a";
  AnalyticsEvent(eventCat, eventLab, eventAct, eventVal);
  SimpleAnalyticsEvent(slideViewEvent);
*/
/* ============================================================ */

  /* ===== Add EventListeners to all elements with inline analytics code ===== */ 

  let elements = document.querySelectorAll('[data-click-event]');
  elements.forEach(element => {
    element.addEventListener('click', function() {
      let event_name = element.getAttribute("data-click-event");
      SimpleAnalyticsEvent(event_name);
    }, false);
  });
/* ===== END of file ===== */