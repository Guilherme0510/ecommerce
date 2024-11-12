import React from 'react'

const Texto = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-2 items-center mb-3">
      <p className="text-gray-700 text-3xl"> 
        {text1} <span className="text-yellow-900 font-medium text-3xl">{text2}</span>
      </p>
      <p className="w-8 sm:w-16 h-[1px] sm:h-[2px] bg-yellow-700"></p>
    </div>
  )
}

export default Texto
