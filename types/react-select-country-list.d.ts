declare module 'react-select-country-list' {
  type CountryOption = { value: string; label: string }

  export default function countryList(): {
    getData: () => CountryOption[]
  }
}
