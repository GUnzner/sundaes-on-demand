import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event/dist/types/setup";
import ScoopOption from "../scoopOption";

test("red input box for invalid scoop count", async () => {
  const user = userEvent.setup();
  render(<ScoopOption />);

  const scoop = await screen.findByRole("spinbutton", { name: "Vanilla" });
  await user.clear(scoop);
  await user.type(scoop, "-1");

  expect(scoop).toHaveClass("is-invalid");

  await user.clear(scoop);
  await user.type(scoop, "11");

  expect(scoop).toHaveClass("is-invalid");

  await user.clear(scoop);
  await user.type(scoop, "1.1");

  expect(scoop).toHaveClass("is-invalid");

  await user.clear(scoop);
  await user.type(scoop, "3");

  expect(scoop).not.toHaveClass("is-invalid");
});
