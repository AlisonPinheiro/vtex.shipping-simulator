import React from 'react';
import { useIntl } from 'react-intl';
import TranslateEstimate from 'vtex.shipping-estimate-translator/TranslateEstimate';
import classNames from 'classnames';
import styles from '../shippingSimulator.css';

interface ShippingTableRowProps {
  name?: string;
  shippingEstimate?: string;
  price?: number;
}

const ShippingTableRow: React.FC<ShippingTableRowProps> = ({ name, shippingEstimate, price }) => {
  const { formatMessage } = useIntl();
  const etaClassName = classNames(
    `${styles.shippingTableCell} ${styles.shippingTableCellDeliveryEstimate} pv1 ph3 t-small c-muted-2`,
    {
      tc: typeof shippingEstimate === 'undefined',
    }
  );

  const valueClassName = classNames(
    `${styles.shippingTableCell} ${styles.shippingTableCellDeliveryPrice} pv1 ph3 t-small c-muted-2`,
    {
      tc: typeof price === 'undefined',
    }
  );

  const formatCurrency = (value: number): string => {
    const stringValue = value.toFixed(2); // Garante duas casas decimais
    const [integerPart, decimalPart] = stringValue.split('.');
    const formattedValue = `R$${integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimalPart}`;
  
    return formattedValue;
  };

  let valueText;

  if (typeof price === 'undefined') {
    valueText = '-';
  } else if (price === 0) {
    valueText = formatMessage({ id: 'store/shipping.free' });
  } else {
    price = price / 100
    
    valueText = <span>{formatCurrency(price)}</span>;
  }

  return (
    <tr className={styles.shippingTableRow} key={name}>
      <td className={`${styles.shippingTableCell} ${styles.shippingTableCellDeliveryName} pv1 ph3 t-small`}>
        <label className={styles.shippingTableLabel}>
          <input
            className={`${styles.shippingTableRadioBtn} mr4`}
            name="shipping-option"
            type="radio"
            value={name}
          />
          {name}
        </label>
      </td>
      <td className={etaClassName}>
        <TranslateEstimate shippingEstimate={shippingEstimate} />
      </td>
      <td className={valueClassName}>{valueText}</td>
    </tr>
  );
};

export default ShippingTableRow;
