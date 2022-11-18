import React from 'react'
import { useState } from 'react'
import ButtonUI from '../../ui/Button.component'
import InputOTP from '../otp/inputOtp'

const ReEnterPin = props => {
  const [pinNotMatched, setPinNotMatched] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const { register, setValue, watch } = props
  const otpArray = ['otpFirst', 'otpSecond', 'otpThird', 'otpFourth']
  const reEnterOtpArray = [
    'otpFirstAgain',
    'otpSecondAgain',
    'otpThirdAgain',
    'otpFourthAgain'
  ]
  const checkValue = () => {
    let arr1 = [],
      arr2 = [],
      count = 0
    let inputs = document.querySelectorAll('input')
    const validInputs = Array.from(inputs).filter(input => {
      input.value !== ''
    })

    otpArray.map(item => arr1.push(watch(item)))
    reEnterOtpArray.map(item => arr2.push(watch(item)))
    for (let i = 0; i < arr1.length; i++) {
      arr1[i] !== arr2[i] ? (count = count - 1) : (count = count + 1)
    }

    if (!arr2.includes('') && !arr1.includes('')) {
      count === arr1.length ? pinMatched() : pinDoesNotMatched()
    } else {
      setIsDisabled(true);
      setPinNotMatched(false)
    } 
  }
  const pinMatched = () => {
    setPinNotMatched(false)
    setIsDisabled(false)
  }
  const pinDoesNotMatched = () => {
    setPinNotMatched(true)
    setIsDisabled(true)
  }
  return (
    <>
      <div className='container'>
      <p className='subTitle opt2 animate'>Enter PIN</p>
        <div className='enterOTP row animate'>        
          {otpArray &&
            otpArray.map((item, index) => (
              <div className='col-3 ' key={index}>
                <InputOTP
                  id={item}
                  checkValue={checkValue}
                  otpArray={otpArray}
                  register={register}
                  setValue={setValue}
                />
              </div>
            ))}
        </div>

        <p className='subTitle opt2 animate'>Re-enter PIN</p>

        {pinNotMatched && (
          <span className='pinErrorMsg'>PIN does not match</span>
        )}
        <div
          className={`enterOTP row animate ${pinNotMatched &&
            'pinError'}`}
        >
          {reEnterOtpArray &&
            reEnterOtpArray.map((item, index) => (
              <div className='col-3 animate' key={index}>
                <InputOTP
                  id={item}
                  checkValue={checkValue}
                  otpArray={reEnterOtpArray}
                  register={register}
                  setValue={setValue}
                />
              </div>
            ))}
        </div>
        <div className='animate'>
          <ButtonUI type={'submit'} id='btn' disabled={isDisabled}>
            Set PIN
          </ButtonUI>
        </div>
      </div>
    </>
  )
}

export default ReEnterPin
