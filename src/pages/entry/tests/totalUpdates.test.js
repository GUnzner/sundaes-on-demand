import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../options";
import OrderEntry from "../OrderEntry";

test("update subtotal when scoops change", async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);
  const scoopSubtotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopSubtotal).toHaveTextContent("0.00");
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");
  expect(scoopSubtotal).toHaveTextContent("2.00");
  const chocoInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  await user.clear(chocoInput);
  await user.type(chocoInput, "2");
  expect(scoopSubtotal).toHaveTextContent("6.00");
});

test("update subtotal when toppings change", async () => {
  const user = userEvent.setup();
  render(<Options optionType="toppings" />);
  const toppingSubtotal = screen.getByText("Toppings total: $", {
    exact: false,
  });
  expect(toppingSubtotal).toHaveTextContent("0.00");
  const mandms = await screen.findByRole("checkbox", { name: "M&Ms" });
  await user.click(mandms);
  expect(toppingSubtotal).toHaveTextContent("1.50");
  const cherries = screen.getByRole("checkbox", { name: "Cherries" });
  await user.click(cherries);
  expect(toppingSubtotal).toHaveTextContent("3.00");
  await user.click(cherries);
  expect(toppingSubtotal).toHaveTextContent("1.50");
});

describe("grand total", () => {
  test("grand total starts at zero", () => {
    const { unmount } = render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });
    expect(grandTotal).toHaveTextContent("0.00");
    unmount();
  });
  test("grand total updates properly if scoop is added first", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");
    expect(grandTotal).toHaveTextContent("2.00");
    const mandms = await screen.findByRole("checkbox", { name: "M&Ms" });
    await user.click(mandms);
    expect(grandTotal).toHaveTextContent("3.50");
  });
  test("grand total updates properly if topping is added first", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });
    const mandms = await screen.findByRole("checkbox", { name: "M&Ms" });
    await user.click(mandms);
    expect(grandTotal).toHaveTextContent("1.50");
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");
    expect(grandTotal).toHaveTextContent("3.50");
    //"grand total updates properly if item is removed"
    await user.click(mandms);
    expect(grandTotal).toHaveTextContent("2.00");
  });
});
