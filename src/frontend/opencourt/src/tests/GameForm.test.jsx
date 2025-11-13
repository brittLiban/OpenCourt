import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GamesForm from "../components/GamesForm";
import { vi } from "vitest";

describe("GamesForm component", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders form inputs and button", () => {
    render(<GamesForm />);
    expect(screen.getByLabelText(/Game Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location ID/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add Game/i })).toBeInTheDocument();
  });

  it("submits form and clears inputs", async () => {
    render(<GamesForm />);
    const gameInput = screen.getByLabelText(/Game Name/i);
    const locationInput = screen.getByLabelText(/Location ID/i);
    const button = screen.getByRole("button", { name: /Add Game/i });

    await userEvent.type(gameInput, "Basketball");
    await userEvent.type(locationInput, "2");

    await userEvent.click(button);

    expect(global.fetch).toHaveBeenCalledWith("/api/games", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game_name: "Basketball", location_id: "2" }),
    }));

  });

  it("displays error when API returns error", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: true }),
      })
    );

    render(<GamesForm />);
    const button = screen.getByRole("button", { name: /Add Game/i });

    await userEvent.click(button);

    expect(await screen.findByText(/Invalid Input/i)).toBeInTheDocument();
  });
});
