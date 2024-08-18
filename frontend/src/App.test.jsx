import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Simple mock for Auth0
vi.mock("@auth0/auth0-react", () => ({
  Auth0Provider: ({ children }) => children,
  useAuth0: () => ({
    isAuthenticated: false,
    isLoading: false,
    loginWithRedirect: vi.fn(),
  }),
}));

describe("App Component", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Check if the app renders the public home page
    expect(screen.getByText("Welcome to the Shopping List App")).toBeTruthy();
    expect(screen.getByText("Log In / Sign Up")).toBeTruthy();
  });
});
