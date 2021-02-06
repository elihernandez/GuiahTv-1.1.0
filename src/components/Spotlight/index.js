import React, { useEffect, useState, useRef } from 'react'
import { getSpotlight } from '../../services/getSpotlight'
import CarouselClass from '../../classes/carouselCenterClass'
import { CSSTransition } from 'react-transition-group'
import './styles.css'

function IndicatorsItem({index}){
    var className = index == 0 ? 'carousel-item active' : 'carousel-item no-active'

    return (
        <li className={className} tabIndex="-1"></li>
    )
}

function CarouselIndicators({data}){
    return (
        <div className="carousel-indicators">
            {data &&
                <ul className="carousel-list">
                    { data.map(({Registro}, index) => <IndicatorsItem key={Registro} index={index} /> ) }
                </ul>
            }
        </div>
    )
}

function ContentItem({img, index}){
    const className = index == 0 ? 'carousel-item active' : 'carousel-item no-active'
    const altImg = `spotlight-image-${index}`
    return (
        <li className={className}>
            <img className="carousel-image" src={img} alt={altImg}/>
        </li> 
    )
}

function CarouselContent({data}){
    return(
        <div className="carousel-content">
            {data &&
                <ul className="carousel-list">
                    { data.map(({Registro, ImgLandscape}, index) => <ContentItem key={Registro} img={ImgLandscape} index={index} /> ) }
                </ul>
            }
        </div>
    )
}

export function Spotlight(){
    const carouselSpotlight = useRef(null)
    const [loading, setLoading] = useState(true)
    const [spotlight, setSpotlight] = useState(null)

    useEffect(() => {
        const requestSpotlight = async () => {
            try{
                setLoading(true)
                const response = await getSpotlight()
                if(!response.length) throw new Error('No se pudo obtener la información.')
                setSpotlight(response)
                carouselSpotlight.current = new CarouselClass(carouselSpotlight, 6500)
                setLoading(false)
            }catch(e){
                console.log(e)
            }
        }

        requestSpotlight()
    }, [])

    function handleClickControlPrev(){
        carouselSpotlight.current.prev()
    }
    
    function handleClickControlNext(){
        carouselSpotlight.current.next()
    }

    return (
       <div className="spotlight-wrapper">
            <CSSTransition in={!loading} timeout={100} classNames="fade">
                <div className="carousel-spotlight" ref={carouselSpotlight}>
                    <CarouselContent data={spotlight}/>
                    <CarouselIndicators data={spotlight}/>
                    <div className="carousel-control-prev" onClick={handleClickControlPrev}>
                        <i className="fas fa-angle-left"></i>
                    </div>
                    <div className="carousel-control-next" onClick={handleClickControlNext}>
                        <i className="fas fa-angle-right"></i>
                    </div>
                </div> 
            </CSSTransition>
        </div>
    )
}