
import React, { useState, useMemo } from 'react'
import countryList from 'react-select-country-list'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Controller } from 'react-hook-form'




const CountrySelectField = ({name, label, control, error, required = false}:CountrySelectProps) => {
  const options = useMemo(() => countryList().getData(), [])

  return (
    <div className='space-y-2'>
      <label htmlFor='' className='form-label'>{label}</label>
      <Controller
      name = {name}
      control = {control}
      rules = {{required: required? `Please select ${label.toLowerCase()}`: false,}}
      render = {({field})=>(
          <Select value={field.value} onValueChange ={field.onChange}>
              <SelectTrigger className="select-trigger">
                  <SelectValue placeholder={"country"} />
              </SelectTrigger>
              <SelectContent className='bg-gray-800 border-gray-600 text-white'>
                  {options.map((option)=>(
                      <SelectItem value = {option.value} key = {option.value} className='focus:bg-ray-600 focus:text-white'>
                          <span>{option.label}</span>
                      </SelectItem>
                  ))}
              </SelectContent>
              <p className='text-xs text-gray-500'>Help us show market data and news relevant to you</p>
              {error&& <p className='text-sm text-red-500'>{error.message}</p>}
              
          </Select>
          
      )}
    />


    </div>
    
  )


}

export default CountrySelectField