import React from 'react';
import { FormattedMessage } from 'react-intl';
import { GROUPED } from '../constants/PricingMode';
import ShippingTableRow from './ShippingTableRow';
import styles from '../shippingSimulator.css';

interface ShippingTableProps {
  shipping?: {
    logisticsInfo?: {
      itemIndex: string;
      slas: {
        id: string;
        friendlyName: string;
        price: number;
        shippingEstimate: string;
      }[];
    }[];
  };
  pricingMode?: string;
}

const ShippingTable: React.FC<ShippingTableProps> = ({ shipping, pricingMode }) => {
  if ((shipping?.logisticsInfo?.length ?? 0) === 0) {
    return null;
  }

  const slaList = shipping!.logisticsInfo!.reduce(
    (slas, info) => [...slas, ...info.slas],
    [] as {
      id: string;
      friendlyName: string;
      price: number;
      shippingEstimate: string;
    }[]
  );

  const slaSumValuesList: {
    id: string;
    friendlyName: string;
    price: number;
    shippingEstimate: string;
  }[] = [];

  if (pricingMode === GROUPED) {
    slaList.reduce(function (res, value) {
      if (!res[value.id]) {
        const { id, ...rest } = value;
        res[value.id] = { id, ...rest, price: 0 };
        slaSumValuesList.push(res[value.id]);
      }
  
      res[value.id].price += value.price;
  
      return res;
    }, {} as Record<string, any>);
  }

  if (slaList.length === 0) {
    return (
      <FormattedMessage id="store/shipping.empty-sla">
        {(text) => (
          <span className={`${styles.shippingNoMessage} dib t-small mt4`}>{text}</span>
        )}
      </FormattedMessage>
    );
  }

  return (
    <table className={`${styles.shippingTable} bt bb b--muted-4 c-muted-1 ph0 pv3 mt4 w-100`}>
      <thead className={`${styles.shippingTableHead} dn`}>
        <tr className={styles.shippingTableRow}>
          <th className={styles.shippingTableHeadDeliveryName}>
            <FormattedMessage id="store/shipping.deliveryName" />
          </th>
          <th className={styles.shippingTableHeadDeliveryEstimate}>
            <FormattedMessage id="store/shipping.deliveryEstimate" />
          </th>
          <th className={styles.shippingTableHeadDeliveryPrice}>
            <FormattedMessage id="store/shipping.deliveryPrice" />
          </th>
        </tr>
      </thead>
      <tbody className={styles.shippingTableBody}>
        {(pricingMode === GROUPED ? slaSumValuesList : slaList).map((shippingItem) => (
          <ShippingTableRow
            key={shippingItem.id}
            name={shippingItem.friendlyName}
            shippingEstimate={shippingItem.shippingEstimate}
            price={shippingItem.price}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ShippingTable;
