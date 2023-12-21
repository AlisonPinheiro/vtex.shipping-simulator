import React from 'react'
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
    pricingMode
  } = props
  const intl = useIntl()

  // const price = pathOr(0, ['logisticsInfo', 0, 'slas', 0, 'price'], shipping)
  // const department = pathOr('', ['state', 'value'], address)
  // const city = pathOr('', ['city', 'value'], address)
  // const district = pathOr('', ['district', 'value'], address)

  if (!seller || !skuId) {
    return <ShippingSimulatorLoader {...loaderStyles} />
  }


  return (
    <>
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
              <PostalCodeGetter onSubmit={onCalculateShipping} />
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
    {pricingMode && <ShippingTable shipping={shipping} pricingMode={pricingMode} />}
    </>
  )
}

export default ShippingSimulator
