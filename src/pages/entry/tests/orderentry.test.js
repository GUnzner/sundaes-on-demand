import {
  render,
  screen,
  waitFor,
} from "../../../test-utils/testing-library-utils";
import OrderEntry from "../OrderEntry";
import { rest } from "msw";
import { server } from "../../../mocks/server";
import { userEvent } from "@testing-library/user-event/dist/types/setup";

test("handles error for scoops and testing routes", async () => {
  server.resetHandlers(
    rest.get("http://localhost:3030/scoops", (req, res, ctx) =>
      res(ctx.status(500))
    ),
    rest.get("http://localhost:3030/toppings", (req, res, ctx) =>
      res(ctx.status(500))
    )
  );
  render(<OrderEntry setOrderPhase={jest.fn()} />);

  await waitFor(async () => {
    //need to add waitFor, if not he will have only found one when he runs this test
    const alerts = await screen.findAllByRole("alert");
    expect(alerts).toHaveLength(2);
  });
});

test("disable order button for no scoops", async () => {
  const user = userEvent.setup();
  render(<OrderEntry setOrderPhase={jest.fn()} />);

  const orderButton = screen.getByRole("button", { name: /order sundae/i });
  expect(orderButton).toBeDisabled();

  const scoop = await screen.findByRole("spinbutton", { name: "Vanilla" });
  await user.clear(scoop);
  await user.type(scoop, "1");

  expect(orderButton).toBeEnabled();

  await user.clear(scoop);
  await user.type(scoop, "0");
  expect(orderButton).toBeDisabled();
});
