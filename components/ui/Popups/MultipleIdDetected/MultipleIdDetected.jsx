
import React from 'react'
import ButtonUI from '../../Button.component'

const MultipleIdDetected = ({errorMessage, setShowBrowserModal, showBrowserModal}) => {

    const handleClick=()=>{
        setShowBrowserModal(false);
    }
    return (
        <>
            <div className={"container popupMultiplClientID"}>
                <h1 className={"title"}>Multiple client IDs <br/>
                    detected</h1>
                <p className={"subTitle"}>
                    {
                    errorMessage
                    }
                </p>
                <ButtonUI
                    btnType="btn"
                    type={"submit"}
                    ariaLabel="Login using client ID"
                    onClick={handleClick}
                >
                    Login using client ID
                </ButtonUI>
            </div>
        </>
    )
}

export default MultipleIdDetected