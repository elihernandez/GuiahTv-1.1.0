import React, { useEffect, useState } from 'react'
import { getButtonsMenu } from '../../services/getButtonsMenu'
import { useHistory } from "react-router-dom"
import './styles.css'

function Button({title, contentType, img}){
    const history = useHistory()
    const altImg = `${contentType}-image`

    const handleClick = () => {
        switch(contentType){
            case 'leon_livetv':
                history.push('/tv')
                break
            case 'leon_movies':
                history.push('/alacarta')
                break
            case 'leon_radio':
                history.push('/radio')
                break
            case 'leon_music':
                history.push('/musica')
                break
            case 'leon_kids':
                history.push('/zonakids')
                break
            default:
                break
        }
    }
    
    return (
        <li className="item-button focusable" onClick={handleClick}>
            <img className="image-button" src={img} alt={altImg}/>
            <p className="title-button">{title}</p>
        </li>
    )

}

export function ButtonsMenu(){
    const [buttons, setButtons] = useState(null)

    useEffect(() => {
        const requestButtons = async () => {
            try{
                const response = await getButtonsMenu()
                if(response.length == 1) throw new Error('No se pudo obtener la información.')
                setButtons(response)

                // Array.from(document.getElementsByClassName("item-button")).forEach(
                //     function(element) {
                //         element.addEventListener('sn:willmove', function(){
                //             console.log('Will move')
                //         })
                //     }
                // )
            }catch(e){
                console.log(e)
            }
        }

        requestButtons()
    }, [])

    return (
        <>
            {
                buttons 
                ?   <div className="buttons-sections">
                        <ul className="buttons-list">
                            {
                                buttons.map(({titulo, ContentType, PosterCardUrlLandscape}, index) => 
                                    <Button 
                                        key={ContentType}
                                        title={titulo}
                                        contentType={ContentType}
                                        img={PosterCardUrlLandscape}
                                    /> )
                            }
                        </ul>
                    </div>
                : null
            }
        </>
    )
}
