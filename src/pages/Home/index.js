import React from 'react'
import { Spotlight } from '../../components/Spotlight/index'
import { ButtonsMenu } from '../../components/ButtonsMenu/index'
import './styles.css'

export function Home() {

    return (
        <div className="section-content w-padding-top">
            <div className="wrapper-home">
                <Spotlight />
                <ButtonsMenu />
            </div>
        </div>
    )
}