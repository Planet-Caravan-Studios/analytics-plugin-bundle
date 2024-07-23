/* ============================================================ */
/*
  Advanced UTM Tracking
  - Allows UTM values to be used at any time during the user's session for better tracking and attribution.
  - Includes extra helper functions for including UTM data in forms and sending custom event data to Google Analytics
  
  WARNINGS:
  - Event Naming Rules for GA: https://support.google.com/analytics/answer/13316687?hl=en&ref_topic=13367860&sjid=17187452480426313666-NA#zippy=%2Cweb
  -- Avoid Shortlist: 'click', 'error', 'form_submit', 'form_start', 'file_download'
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
        console.log("===== utm-analytics.js file working!!! =====");
    } 
    

/* ===== =================== ===== */
/* ===== Top-Level Variables ===== */
/* ===== =================== ===== */
  // These variables are absolutely necessary for the GTM tags, 
  // and they MUST match the corresponding variables in GTM.
  const complexUtmEventName = "complex_utm_event";
  const simpleUtmEventName = 'dynamic_event_name';


/* ===== =================================== ===== */
/* ===== Main Function - Simple Event Pusher ===== */
/* ===== =================================== ===== */
  function SimpleUtmEvent(event_name){
    
    //console log tester
    if(devMode == true){
        console.groupCollapsed("===== Dynamically-Named Analytics Event Triggered =====");
            console.log("Event Name: [simple_utm_event]");
            console.log("Event Detail: ["+event_name+"]");
            console.log("NOTES: To QA events, look under: Google Analytics Container > Realtime > Event Count by Event Name");
        console.groupEnd();
    }

    try {
        //Push event to datalayer
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
        'event': simpleUtmEventName,
        'event_detail': event_name,
        });
        console.log("===== Dynamically-Named Analytics Event Pushed =====");
    } catch (e) {
        console.log("===== Dynamically-Named Analytics Event Error =====");
    }

    return false;
  };


/* ===== ==================================== ===== */
/* ===== Main Function - Complex Event Pusher ===== */
/* ===== ==================================== ===== */

  function ComplexUtmAnalyticsEvent(utm_campaign, utm_content, utm_medium, utm_source, utm_term, utm_state){
    //Set vars - event name & sub-parameters
      const eventName = complexUtmEventName; //static, do not update
      
      utm_campaign  = utm_campaign || "n_a"; //gives default/fallback value
      utm_content   = utm_content  || "n_a";
      utm_medium    = utm_medium   || "n_a";
      utm_source    = utm_source   || "n_a";
      utm_term      = utm_term     || "n_a";
      utm_state     = utm_state    || "n_a";

    //console log tester
      if(devMode == true){
        console.groupCollapsed("===== Custom UTM Analytics Event Triggered =====");
          console.log("Event Name: ["+eventName+"]");
          console.log("UTM Campaign: ["+utm_campaign+"]");
          console.log("UTM Content: ["+utm_content+"]");
          console.log("UTM Medium: ["+utm_medium+"]");
          console.log("UTM Source: ["+utm_source+"]");
          console.log("UTM Term: ["+utm_term+"]");
          console.log("UTM State (experimental): ["+utm_state+"]");
          console.log("NOTES: To QA events, look under: Google Analytics Container > Realtime > Event Count by Event Name > 'custom_utm_event' > 'Event Label'.");
        console.groupEnd();
      }

    //Push event to datalayer
      try {
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
            'event':        eventName,
            'utm_campaign': utm_campaign,
            'utm_content':  utm_content,
            'utm_medium':   utm_medium,
            'utm_source':   utm_source,
            'utm_term':     utm_term,
            'utm_state':    utm_state,
        });
        //console.log("===== Custom UTM Analytics Event Pushed =====");
      } catch (e) {
        //console.log("===== Custom UTM Analytics Event Error =====");
      }
    
    return false;
  };


/* ===== ==================================== ===== */
/* ===== Main Function - URL Parameter Logger ===== */
/* ===== ==================================== ===== */
  function parameterLogger(param) {
    var searchParams = new URLSearchParams(window.location.search); 
    var paramValue = "";
    var utm_state = "";

    if(searchParams.has(param)) {
      //if UTM parameters are present in URL
      //console.log("===== UTM values detected - in URL =====");
      utm_state = "url";
      paramValue = searchParams.get(param);
      sessionStorage.setItem(param, paramValue);
      localStorage.setItem(param, paramValue);

    }else if(sessionStorage.getItem(param)){
      //if UTM parameters are not present in URL, but are in SessionStorage
      //console.log("===== UTM values detected - in short-term session =====");
      utm_state = "session_short_term";
      paramValue = sessionStorage.getItem(param);

    }else if(localStorage.getItem(param)){
      //if UTM parameters are not present in URL or SessionStorage, but are in LocalStorage
      //console.log("===== UTM values detected - in long-term session =====");
      utm_state = "session_long_term";
      paramValue = localStorage.getItem(param);

    }
    //console.log("UTM detected: "+param+": "+paramValue+", utm_state: "+utm_state);

    //NOTES:
    //paramValue: actual value of the UTM
    //utm_state: context state of the individual value

    //return paramValue;
    return {paramValue, utm_state};
  };



  

/* ===== =============================================== ===== */
/* ===== Helper Functions | simple checks and formatting ===== */
/* ===== =============================================== ===== */
    
    //check if element exists
	function elementExists(selector) {
		return document.querySelector(selector) !== null;
	}

    /* ===== Get UTMS ===== */
    function GetUTMs(){
      /* ===== Grab UTMs ===== */
        let utm_source = parameterLogger("utm_source");
        let utm_medium = parameterLogger("utm_medium");
        let utm_campaign = parameterLogger("utm_campaign");
        let utm_term = parameterLogger("utm_term");
        let utm_content = parameterLogger("utm_content");
        let utm_state = utm_source.utm_state;

      /* ===== Formatting for Ease Of Use ===== */
        utm_source = utm_source.paramValue;
        utm_medium = utm_medium.paramValue;
        utm_campaign = utm_campaign.paramValue;
        utm_term = utm_term.paramValue;
        utm_content = utm_content.paramValue;
        //utm_state = utm_source.utm_state;

      /* ===== Package up data into a single object ===== */
        var utm_values = {
          utm_campaign : utm_campaign,
          utm_content  : utm_content,
          utm_medium   : utm_medium,
          utm_source   : utm_source,
          utm_term     : utm_term,
          utm_state    : utm_state,
        }

      /* ===== console log tester ===== */
        //if(devMode == true){
        //  console.groupCollapsed("===== UTM Tracking Present =====");
        //    console.log("utm_source: ["+utm_values.utm_source+"]");
        //    console.log("utm_medium: ["+utm_values.utm_medium+"]");
        //    console.log("utm_campaign: ["+utm_values.utm_campaign+"]");
        //    console.log("utm_term: ["+utm_values.utm_term+"]");
        //    console.log("utm_content: ["+utm_values.utm_content+"]");
        //    console.log("utm_state: ["+utm_values.utm_state+"]");
        //  console.groupEnd();
        //}
      
      /* ===== function output ===== */
        return utm_values;
    }

    /* ===== Determines if URL currently has a UTM present ===== */
    //UPDATE IN-PROGRESS
    function CheckForUtm(stateType){
      if(stateType == 'url'){
        if(GetUTMs().utm_state == "url"){
          //console.log("===== checkForUTM | [true] =====");
          return true;
        } else {
          //console.log("===== checkForUTM | [false] =====");
          return false;
        }
      } else if(stateType == 'session_short_term'){
        if(GetUTMs().utm_state == "session_short_term"){
            return true;
          } else {
            return false;
          }
      } else if(stateType == 'session_long_term'){
        if(GetUTMs().utm_state == "session_long_term"){
            return true;
          } else {
            return false;
          }
      } else{

      }
      
    }

    /* ===== Custom Simple Event with some UTM data ===== */
    function DetailedSimpleEvent(campaign, source){
        let eventName = "utm_landing--campaign_"+campaign+"--source_"+source;
        SimpleUtmEvent(eventName);
    }

    /* ===== Fill form fields with UTM data ===== */
    function UtmFormFill(utm_campaign, utm_content, utm_medium, utm_source, utm_term, utm_state) {
        //DOM element vars
        let inputUtmSource = document.querySelector('input[name="utm_source"]');
		let inputUtmMedium = document.querySelector('input[name="utm_medium"]');
		let inputUtmCampaign = document.querySelector('input[name="utm_campaign"]');
		let inputUtmTerm = document.querySelector('input[name="utm_term"]');
		let inputUtmContent = document.querySelector('input[name="utm_content"]');
		let inputUtmState = document.querySelector('input[name="utm_state"]');

        //set form field values to parameter variables
        inputUtmSource.value = utm_source;
        inputUtmMedium.value = utm_medium;
        inputUtmCampaign.value = utm_campaign;
        inputUtmTerm.value = utm_term;
        inputUtmContent.value = utm_content;
        inputUtmState.value = utm_state;

        return false;
    };

    function checkForUtmForm(){
        let checkedElement = 'input[name="utm_source"]';
        if(elementExists(checkedElement)){
            //Grab all values at once for efficiency
            let utm_values = GetUTMs();

            //Add UTM data to form fields
            let utm_campaign = utm_values.utm_campaign;
            let utm_content = utm_values.utm_content;
            let utm_medium = utm_values.utm_medium;
            let utm_source = utm_values.utm_source;
            let utm_term = utm_values.utm_term;
            let utm_state = utm_values.utm_state;
            UtmFormFill(utm_campaign, utm_content, utm_medium, utm_source, utm_term, utm_state);

            return false;
        } else {
            return false;
        }
    }


/* ===== ================================================= ===== */
/* ===== Auto-Run Functions | always run in the background ===== */
/* ===== ================================================= ===== */
    /* ===== Add UTMs to Forms ===== */
        //Run after DOM content load + delay for 3rd party form load-in 
        let pageLoadDelay = 1500; //in ms
        document.addEventListener("DOMContentLoaded", function(e){
            setTimeout(() => {
                checkForUtmForm()
            }, pageLoadDelay); //time in ms
        });

    /* ===== UTM Event Trigger ===== */ 
        //User lands on page with UTMs present in URL
        if(CheckForUtm('url')){
            //Grab all values at once for efficiency
            let utm_values = GetUTMs();

            //Complex Event push - all UTM data
            let utm_campaign = utm_values.utm_campaign;
            let utm_content = utm_values.utm_content;
            let utm_medium = utm_values.utm_medium;
            let utm_source = utm_values.utm_source;
            let utm_term = utm_values.utm_term;
            let utm_state = utm_values.utm_state;
            ComplexUtmAnalyticsEvent(utm_campaign, utm_content, utm_medium, utm_source, utm_term, utm_state);

            //Simple Event push - just an event name 
            SimpleUtmEvent("utm_landing");
            DetailedSimpleEvent(utm_campaign, utm_source);

        } else {
            //UTMs not present in current URL, do nothing
        }

        if(CheckForUtm('session_long_term')){
            let utm_values = GetUTMs();
            //Complex Event push - all UTM data
            let utm_campaign = utm_values.utm_campaign;
            let utm_content = utm_values.utm_content;
            let utm_medium = utm_values.utm_medium;
            let utm_source = utm_values.utm_source;
            let utm_term = utm_values.utm_term;
            let utm_state = utm_values.utm_state;

            let eventName = "utm_returning_user--campaign_"+utm_campaign+"--source_"+utm_source;
            SimpleUtmEvent(eventName);
        }

/* ===== ================================================= ===== */
/* ===== Manual Functions | Only run in certain conditions ===== */
/* ===== ================================================= ===== */
    

/* ===== END of file ===== */