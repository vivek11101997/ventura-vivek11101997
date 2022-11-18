import React from 'react'
import { useEffect } from 'react'
const InputOTP = props => {
  const register = props.register
  const setValue = props.setValue
  const otpArray = props.otpArray

  function inputEventListener () {
    try {
      let inputs = document.querySelectorAll('input')
      let values = Array(otpArray.length)
      inputs[0].focus()

      inputs.forEach((tag, index) => {
        tag.onkeyup = function (event) {
          const key = event.keyCode || event.charCode
          if (key == 8 && hasNoValue(index)) {
            if (index > 0) inputs[index - 1].focus()
          }
          //else if any input move focus to next or out
          else if (tag.value !== '') {
            index < inputs.length - 1 ? inputs[index + 1].focus() : tag.blur()
          }
          //add val to array to track prev values
          values[index] = event.target.value
        }

        tag.onpaste = function (event) {
          event.preventDefault()
          const clipData = event.clipboardData
            .getData('text/plain')
            .replace(/\D/g, '')
            .split('')
          fillData(index, clipData)
        }
      })

      function fillData (index, clipData) {
        let clipCount = 0
        const loopLength = clipData.length + index
        for (let i = index; i < loopLength; i++) {
          setValue(otpArray[i], clipData[clipCount])
          clipCount++
        }

        clipData && loopLength >= otpArray.length
          ? document.getElementById(otpArray[otpArray.length - 1]).focus()
          : document.getElementById(otpArray[loopLength]).focus()
      }
      function hasNoValue (index) {
        return !(values[index] || values[index] === 0)
      }
    } catch (e) {}
  }

  useEffect(() => {
    inputEventListener();
    return () => {
      document.querySelectorAll('input').onkeyup = null;
      document.querySelectorAll('input').onpaste = null;
  }
  }, [])

  return (
    <input
      className='otp'
      aria-label={props.id}
      id={props.id}
      type='text'
      min='0'
      max='9'
      step='1'
      autoComplete='off'
      maxLength={1}
      onKeyUp={props.checkValue}
      onInput={event => {
        setValue(props.id, event.target.value.replace(/\D/g, ''))
      }}
      {...register(props.id, {
        required: true
      })}
    />
  )
}
export default InputOTP
