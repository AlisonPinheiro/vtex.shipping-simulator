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
    // isValid,
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
    if(postalCode == null || postalCode.length <= 8) return 
    postalCode = postalCode.replace(/[^0-9]/g,'')

    const response = await fetch(
      `/api/checkout/pub/postal-code/BRA/${postalCode}`
    )
    const userData = await response.json()
    console.log(userData, 'userData')

    if (userData.city == '' && userData.street == '' && userData.state == '') {
      setCepError(true)
      console.log(cepError, 'cepError')
    } else {
      setCepError(false)
    }
  }

  useEffect(() => {
    console.log(address, 'address')
    checkCep(address.postalCode.value)
  }, [address])

  return (
    <div className={`${cepError ?  `${styles.errorShipping}` : ''}   ${styles.shippingSimulator}`}>
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
              <PostalCodeGetter
                onSubmit={onCalculateShipping}
              ></PostalCodeGetter>
            </AddressContainer>
          </AddressRules>
          <Button
            onClick={onCalculateShipping}
            className={styles.shippingCTA}
            disabled={cepError}
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
