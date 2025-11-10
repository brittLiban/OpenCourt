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


});
