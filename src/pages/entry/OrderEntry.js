import { formatCurrency } from "../../utilities";
import Options from "./options";
import { useOrderDetails } from "../../contexts/OrderDetails";
import Button from "react-bootstrap/esm/Button";

export default function OrderEntry({ setOrderPhase }) {
  const { totals } = useOrderDetails();
  const orderDisabled = totals.scoops === 0;
  return (
    <div>
      <h1>Design your Sundae!</h1>
      <Options optionType="scoops" />
      <Options optionType="toppings" />
      <h2>Grand Total: {formatCurrency(totals.scoops + totals.toppings)}</h2>
      <Button disabled={orderDisabled} onClick={() => setOrderPhase("review")}>
        Order Sundae!
      </Button>
    </div>
  );
}
