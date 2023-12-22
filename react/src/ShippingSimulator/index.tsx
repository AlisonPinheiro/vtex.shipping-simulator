import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  AddressContainer,
  AddressRules,
  PostalCodeGetter,
} from 'vtex.address-form'
import { StyleguideInput } from 'vtex.address-form/inputs'
import { Button } from 'vtex.styleguide'
import ShippingSimulatorLoader from './Loader'
import styles from './shippingSimulator.css'
// import { pathOr } from 'ramda'
import ShippingTable from './components/ShippingTable'

const ShippingSimulator = (props: any) => {
  const {
    country,
    address,
    onAddressChange,
    onCalculateShipping,
    loading,
    isValid,
    seller,
    loaderStyles,
    skuId,
    shipping,
    pricingMode,
  } = props
  const intl = useIntl()

  if (!seller || !skuId) {
    return <ShippingSimulatorLoader {...loaderStyles} />
  }

  const [cepError, setCepError] = useState<boolean>(false)

  const checkCep = async (postalCode: string) => {
    console.log(postalCode, 'postalCode')
    const response = await fetch(
      `/api/checkout/pub/postal-code/BRA/${postalCode}`
    )
    const userData = await response.json()
    console.log(userData, 'userData')

    if (userData.city == '' || userData.street == '') {
      setCepError(true)
      console.log(cepError, 'cepError')
    }
  }

  useEffect(() => {
    console.log(address)
    checkCep(address.postalCode.value)
  }, [address])

  return (
    <div className={`${cepError ? 'error-shipping' : ''} shippingSimulator`}>
      <>
        <div className={`${styles.shippingContainer} t-small c-on-base`}>
          <AddressRules country={country} shouldUseIOFetching>
            <AddressContainer
              Input={StyleguideInput}
              address={address}
              onChangeAddress={onAddressChange}
              autoCompletePostalCode
              disabled={loading}
            >
              <PostalCodeGetter onSubmit={onCalculateShipping}>

              </PostalCodeGetter>
              {cepError && (
                  <div className="vtex-input__error c-danger t-small mt3 lh-title">
                    CEP inválido.
                  </div>
                )}
            </AddressContainer>
          </AddressRules>
          <Button
            onClick={onCalculateShipping}
            className={styles.shippingCTA}
            disabled={!isValid}
            size="small"
            type="submit"
            block
            isLoading={loading}
          >
            {intl.formatMessage({ id: 'store/shipping.label' })}
          </Button>
        </div>
      </>
      <div className={cepError ? 'dn-ns' : ''}>
        <ShippingTable shipping={shipping} pricingMode={pricingMode} />
      </div>
    </div>
  )
}

export default ShippingSimulator
