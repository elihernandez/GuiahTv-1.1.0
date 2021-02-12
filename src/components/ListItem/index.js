import React, { Fragment, useState, useContext } from 'react'
import { NavLink, useRouteMatch, useHistory } from 'react-router-dom'
import VodContext from '../../context/VodContext'
import RadioContext from '../../context/RadioContext'
import AudioContext from '../../context/AudioContext'
import { getContactInfo } from '../../services/getContactInfo'
import { getProgressMovie } from '../../js/Time'
import { limitString, isLimitString, isSerie, typeContent, replaceString } from '../../js/String'
import Tooltip from '@material-ui/core/Tooltip'
import LinearProgress from '@material-ui/core/LinearProgress'
import { CSSTransition } from 'react-transition-group'
import './styles.css'

export function Item({ data, posterType, listType }) {
      let Item = () => null
      const { url } = useRouteMatch()
      const { ContentType } = data
      const type = typeContent(ContentType)

      switch (listType) {
            case 'catalogue':
                  Item = <ItemCatalogue url={url} type={type} posterType={posterType} data={data} />
                  break
            case 'season':
                  Item = <ItemSeason url={url} posterType={posterType} data={data} />
                  break
            case 'radio':
                  Item = <ItemCard posterType={posterType} data={data} />
                  break
      }

      return Item
}

function ItemCatalogue({ url, type, posterType, data }) {
      const { Registro, ContentType, HDPosterUrlPortrait, HDPosterUrlLandscape, ResumePos, Length } = data
      const { dispatchVod } = useContext(VodContext)

      const handleClick = () => {
            if (isSerie(ContentType)) {
                  dispatchVod({ type: 'setSerie', payload: data })
            } else {
                  dispatchVod({ type: 'setMovie', payload: data })
            }
      }

      return (
            <NavLink to={`${url}/${type}/${Registro}`} className="item-link">
                  <div className="item" onClick={handleClick}>
                        <div className="background-item">
                              <Img posterType={posterType} imgPortrait={HDPosterUrlPortrait} imgLandscape={HDPosterUrlLandscape} />
                              {ResumePos &&
                                    <div className="progress-bar-content">
                                          <LinearProgress variant="determinate" value={getProgressMovie(ResumePos, Length)} />
                                    </div>
                              }
                        </div>
                  </div>
            </NavLink>
      )
}

function ItemSeason({ url, posterType, data }) {
      const { Title, Description, ContentType, HDPosterUrlPortrait, HDPosterUrlLandscape, ResumePos, Length } = data
      const { dispatchVod } = useContext(VodContext)

      const handleClick = () => {
            if (isSerie(ContentType)) {
                  dispatchVod({ type: 'setSerie', payload: data })
            } else {
                  dispatchVod({ type: 'setMovie', payload: data })
            }
      }

      return (
            <NavLink to={`${url}/video`} className="item-link">
                  <div className="item" onClick={handleClick}>
                        <div className="background-item">
                              <Img posterType={posterType} imgPortrait={HDPosterUrlPortrait} imgLandscape={HDPosterUrlLandscape} />
                              <ProgressBar resumePos={ResumePos} length={Length} />
                        </div>
                        <Info title={Title} description={Description} />
                  </div>
            </NavLink>
      )
}

function ItemCard({ posterType, data }) {
      const history = useHistory()
      const { Title, ContactID, Description, Registro, HDPosterUrlPortrait, HDPosterUrlLandscape, ResumePos, Length } = data
      const { dispatchRadio } = useContext(RadioContext)
      const { dispatchAudio } = useContext(AudioContext)
      const [contactInfo, setContactInfo] = useState([])
      const [moreInfoActive, setMoreInfoActive] = useState(false)
      const [readMoreActive, setReadMoreActive] = useState(false)

      const handleClick = (e) => {
            if (e.nativeEvent.target.tabIndex != 0) {
                  history.push(`/radio/${Registro}`)
                  dispatchRadio({ type: 'setCurrentStation', payload: data })
                  dispatchAudio({ type: 'setData', payload: data })
            }
      }

      return (
            <div className="item-link">
                  <div className="item" onClick={handleClick}>

                        <TitleItem title={Title} />
                        <div className="background-item">
                              <Img title={Title} posterType={posterType} imgPortrait={HDPosterUrlPortrait} imgLandscape={HDPosterUrlLandscape} />
                              {ResumePos &&
                                    <div className="progress-bar-content">
                                          <LinearProgress variant="determinate" value={getProgressMovie(ResumePos, Length)} />
                                    </div>
                              }
                        </div>
                        <DescriptionItem description={Description} />
                        <ContactInfo moreInfoActive={moreInfoActive} contactInfo={contactInfo} setMoreInfoActive={setMoreInfoActive} />
                        <ReadMore readMoreActive={readMoreActive} Name={Title} Description={Description} setReadMoreActive={setReadMoreActive} />
                        <Buttons contactId={ContactID} description={Description} setContactInfo={setContactInfo} setMoreInfoActive={setMoreInfoActive} setReadMoreActive={setReadMoreActive} />
                  </div>
            </div>
      )
}

function TitleItem({ title }) {
      return (
            <div className="title-content">
                  <h6 className="title-item">{title}</h6>
            </div>
      )
}

function DescriptionItem({ description }) {
      return (
            <div className="description-content">
                  <h3 className="description-item">{limitString(description, 80)}</h3>
            </div>
      )
}

function Img({ title, posterType, imgPortrait, imgLandscape }) {

      const handleError = (e) => {
            let srcImg = ''
            switch (posterType) {
                  case '0':
                        srcImg = 'build/assets/images/logos/guiahtv/vod-error-portrait.png'
                        break
                  case '1':
                        srcImg = 'build/assets/images/logos/guiahtv/GuiahAzulPerf.png'
                        break
                  default:
                        srcImg = 'build/assets/images/logos/guiahtv/GuiahAzulPerf.png'
                        break
            }
            e.nativeEvent.target.src = srcImg
            e.nativeEvent.target.classList.add("image-recover")
      }

      return (
            <Fragment>
                  {posterType == 0 &&
                        <img alt={`img-${title}`} onError={handleError} src={imgPortrait} />
                  }
                  {posterType == 1 &&
                        <img alt={`img-${title}`} onError={handleError} src={imgLandscape} />
                  }
            </Fragment>
      )
}

function ProgressBar({ resumePos, length }) {

      return (
            <Fragment>
                  {resumePos &&
                        <div className="progress-bar-content">
                              <LinearProgress variant="determinate" value={getProgressMovie(resumePos, length)} />
                        </div>
                  }
            </Fragment>
      )
}

function Info({ title, description }) {
      return (
            <div className="info-item">
                  <div className="group-name-item">
                        <h6 className="name-item">{title}</h6>
                  </div>
                  <div className="group-description-item">
                        <p className="description-item">{limitString(description, 80)}</p>
                  </div>
            </div>
      )
}

function Buttons({ contactId, description, setContactInfo, setMoreInfoActive, setReadMoreActive }) {
      const handleClickShowMoreInfo = () => {
            const getInfoContact = async () => {
                  try {
                        const data = await getContactInfo(contactId)
                        setContactInfo(data)
                        setMoreInfoActive(true)
                  } catch (e) {

                  }
            }

            getInfoContact()
      }

      const handleClickShowReadMore = () => {
            setReadMoreActive(true)
      }

      return (
            <div className="buttons-content">
                  <Tooltip title="Más info" placement="top-start">
                        <span tabIndex="0" onClick={handleClickShowMoreInfo}>
                              <i className="fas fa-info" tabIndex="0" />
                        </span>
                  </Tooltip>

                  {isLimitString(description, 80) &&
                        <Tooltip title="Leer más" placement="top-start">
                              <span tabIndex="0" onClick={handleClickShowReadMore}>
                                    <i className="fas fa-ellipsis-h" tabIndex="0" />
                              </span>
                        </Tooltip>
                  }
            </div>
      )
}

function ReadMore({ readMoreActive, Name, Description, setReadMoreActive }) {
      const handleClickHideReadMore = () => {
            setReadMoreActive(false)
      }

      return (
            <Fragment>
                  {     readMoreActive
                        ? <CSSTransition in={readMoreActive} timeout={100} classNames="fade" unmountOnExit>
                              <div className="contact-info-item" tabIndex="0">
                                    <div className="content-button-close" tabIndex="0">
                                          <span className="button-close" onClick={handleClickHideReadMore} tabIndex="0">
                                                <i className="fas fa-times" tabIndex="0" />
                                          </span>
                                    </div>
                                    <h2 className="title" tabIndex="0">{Name}</h2>
                                    <h3 className="description" tabIndex="0">{Description}</h3>
                              </div>
                        </CSSTransition>
                        : null
                  }
            </Fragment>
      )
}

function ContactInfo({ moreInfoActive, contactInfo, setMoreInfoActive }) {

      const handleClickHideMoreInfo = () => {
            setMoreInfoActive(false)
      }

      const handleClickFb = () => {
            window.location = `https://www.facebook.com/${contactInfo.ContactFb}`
      }

      const handleClickIg = () => {
            window.location = `https://www.instagram.com/${contactInfo.ContactIG}`
      }

      const handleClickTw = () => {
            window.location = `https://www.twitter.com/${contactInfo.ContactTw}`
      }

      const handleClickGm = () => {
            window.location = `https://www.google.com/maps/place/${replaceString(contactInfo.ContactLoc, ",", "+")}`
      }

      return (
            <Fragment>
                  {     moreInfoActive
                        ? <CSSTransition in={moreInfoActive} timeout={100} classNames="fade" unmountOnExit>
                              <div className="contact-info-item" tabIndex="0">
                                    <div className="content-button-close" tabIndex="0">
                                          <span className="button-close" onClick={handleClickHideMoreInfo} tabIndex="0">
                                                <i className="fas fa-times" tabIndex="0" />
                                          </span>
                                    </div>
                                    <h2 className="title" tabIndex="0">Información de {contactInfo.ContactTitle}</h2>
                                    <h3 className="description" tabIndex="0">{contactInfo.ContactDescription}</h3>
                                    {contactInfo.ContactFon &&
                                          <div className="content-phone" tabIndex="0">
                                                <i className="fas fa-phone-alt" tabIndex="0"></i>
                                                <p tabIndex="0">{contactInfo.ContactFon}</p>
                                          </div>
                                    }
                                    {contactInfo.ContactWeb &&
                                          <div className="content-web" tabIndex="0">
                                                <i className="fas fa-globe" tabIndex="0"></i>
                                                <p tabIndex="0">{contactInfo.ContactWeb}</p>
                                          </div>
                                    }
                                    <div className="content-social-media" tabIndex="0">
                                          {contactInfo.ContactFb &&
                                                <span className="span-icon" tabIndex="0" onClick={handleClickFb}>
                                                      <i className="fab fa-facebook-square" tabIndex="0" />
                                                </span>
                                          }
                                          {contactInfo.ContactIG &&
                                                <span className="span-icon" tabIndex="0" onClick={handleClickIg}>
                                                      <i className="fab fa-instagram" tabIndex="0" />
                                                </span>
                                          }
                                          {contactInfo.ContactTw &&
                                                <span className="span-icon" tabIndex="0" onClick={handleClickTw}>
                                                      <i className="fab fa-twitter-square" tabIndex="0" />
                                                </span>
                                          }
                                          {contactInfo.ContactLoc &&
                                                <span className="span-icon" tabIndex="0" onClick={handleClickGm}>
                                                      <i className="fas fa-map-marker-alt" tabIndex="0" />
                                                </span>
                                          }
                                    </div>
                              </div>
                        </CSSTransition>
                        : null
                  }
            </Fragment>
      )
}