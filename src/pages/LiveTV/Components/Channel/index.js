import React, { useRef } from 'react'
var moment = require('moment')
import './styles.css'

function shortString(string){
      if(string.length > 60){
            string = string.substring(0, 60)
            string = string + "..."
      }

      return string
}

function GetEventTime(start, end){
      // var resolvedOptions = Intl.DateTimeFormat().resolvedOptions();
      // var timezone = resolvedOptions.timeZone;
      var d = moment(start);
      
      var hh = moment(d).hours();
      var m = moment(d).minutes();
      var s = moment(d).seconds();
      var dd = " AM";
      var h = hh;
  
      if (h >= 12) {
      h = hh - 12;
      dd = " PM";
      }
      if (h == 0) {
      h = 12;
      }
  
      // h = h < 10 ? "0" + h : h;
  
      m = m < 10 ? "0" + m : m;
  
      s = s < 10 ? "0" + s : s;
  
      var StartTime = h + ":" + m + dd;
  
      var d = moment(end);
      var hh = moment(d).hours();
      var m = moment(d).minutes();
      var s = moment(d).seconds();
      var dd = " AM";
      var h = hh;
      
      if (h >= 12) {
          h = hh - 12;
          dd = " PM";
      }
      if (h == 0) {
          h = 12;
      }
  
      // h = h < 10 ? "0" + h : h;
  
      m = m < 10 ? "0" + m : m;
  
      s = s < 10 ? "0" + s : s;
  
      var EndTime = h + ":" + m + dd;
  
      return `${StartTime} - ${EndTime}`  
}

export function LiveTvChannel({dataChannel}){
      let {ContentType, Description, Id, Name, Poster, PreviewPoster, Url} = dataChannel
      let description = shortString(Description)
      let imgChannel = useRef(null)
      let className 

      if(Name == "Alma Vision TV"){
            className = "channel active"
      }else{
            className = "channel"
      }

      const handleError = (e) => {
            e.nativeEvent.target.src = 'build/assets/images/logos/guiahtv/error-tv-landscape.png'
      }

      return (
            <div className={className}>
                  <div className="channel-content">
                        <div className="title-content">
                              <h2 className="title-channel">
                                    {Name}
                              </h2>
                        </div>
                        <div className="poster-content">
                              <img ref={imgChannel} className="poster-channel" src={Poster} onError={handleError} />
                              <div className="content-play">
                                    <span>
                                          <i className="fas fa-pause"></i>
                                    </span>
                              </div>
                        </div>
                        <div className="description-content">
                              <p className="description-channel">{description}</p>
                        </div>
                        <div className="buttons-content">
                              <span><i className="fas fa-ellipsis-h"></i></span>
                        </div>
                  </div>
            </div>
      )
}

export function LiveTvEvent({dataChannel}){
      const {ContentType, Description, Id, Name, Poster, PreviewPoster, Url, Inicio, Fin} = dataChannel
      let durationEvent = GetEventTime(Inicio, Fin)
      let description = shortString(Description)
      let imgChannel = useRef(null)

      const handleError = (e) => {
            e.nativeEvent.target.src = 'build/assets/images/logos/guiahtv/error-tv-landscape.png'
      }

      return (
            <div className="channel">
                  <div className="channel-content">
                        <div className="title-content">
                              <h2 className="title-channel">
                                    {Name}
                              </h2>
                        </div>
                        <div className="poster-content">
                              <img ref={imgChannel} className="poster-channel" src={Poster} onError={handleError} />
                        </div>
                        <div className="progress-time-content">
                              <div className="progress-time-current"></div>
                        </div>
                        <div className="event-time-content">
                              <p className="event-time-channel">
                                    <i className="far fa-clock"></i>{durationEvent}
                              </p>
                              <div className="button-live">EN VIVO</div>
                        </div>
                        <div className="description-content">
                              <p className="description-channel">{description}</p>
                        </div>
                        <div className="buttons-content">
                              <span><i className="fas fa-ellipsis-h"></i></span>
                        </div>
                  </div>
            </div>
      )
}