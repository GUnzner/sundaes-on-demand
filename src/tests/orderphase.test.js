import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

test("order phases for happy path", async () => {
  const { unmount } = render(<App />);
  const user = userEvent.setup();
  //add ice cream scoops and toppings
  const scoop = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  await user.clear(scoop);
  await user.type(scoop, "1");

  const mandms = await screen.findByRole("checkbox", { name: "M&Ms" });
  await user.click(mandms);

  //find and click order button
  const orderButton = screen.getByRole("button", { name: /order sundae/i });
  await user.click(orderButton);

  //check summary information based on order
  const grandTotal = screen.getByRole("heading", {
    name: "Order Summary",
  });
  expect(grandTotal).toBeInTheDocument();

  const scoopsHeading = screen.getByRole("heading", {
    name: "Scoops: $2.00",
  });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.getByRole("heading", {
    name: "Toppings: $1.50",
  });
  expect(toppingsHeading).toBeInTheDocument();

  //check summary option items
  expect(screen.getByText("1 Vanilla")).toBeInTheDocument();
  expect(screen.getByText("M&Ms")).toBeInTheDocument();

  //accept terms and conditions and click button to confirm order
  const tandc = screen.getByRole("checkbox", { name: /terms and conditions/i });
  await user.click(tandc);

  const confirmOrderButton = screen.getByRole("button", {
    name: /confirm order/i,
  });
  await user.click(confirmOrderButton);

  //confirm "Loading" text
  const loading = screen.getByText("Loading");
  expect(loading).toBeInTheDocument();
  const thankYou = await screen.findByRole("heading", { name: /thank you/i });
  expect(thankYou).toBeInTheDocument();
  const notLoading = screen.queryByText("Loading");
  expect(notLoading).not.toBeInTheDocument();

  //check order number on confirmation page
  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  //click "new order" button on confirmation page
  const newOrder = screen.getByRole("button", { name: /new Order/i });
  await user.click(newOrder);

  //check that scoops and toppings subtotals have been reset
  const scoopsTotal = await screen.findByText("Scoops total: §0.00");
  expect(scoopsTotal).toBeInTheDocument();
  const toppingsTotal = await screen.findByText("Toppings total: §0.00");
  expect(toppingsTotal).toBeInTheDocument();

  unmount();
});

test("conditional toppings section on summary page", async () => {
  const user = userEvent.setup();
  const { unmount } = render(<App />);

  const scoop = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  await user.clear(scoop);
  await user.type(scoop, "1");

  const orderButton = screen.getByRole("button", { name: /order sundae/i });
  await user.click(orderButton);

  const grandTotal = screen.getByRole("heading", {
    name: "Order Summary",
  });
  expect(grandTotal).toBeInTheDocument();

  const toppingsHeading = screen.queryByRole("heading", {
    name: "Toppings:",
  });
  expect(toppingsHeading).not.toBeInTheDocument();

  unmount();
});
