import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Navbar from "./Navbar";

// Mock the Auth0 hook
const mockUseAuth0 = vi.fn();
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => mockUseAuth0(),
}));

// Mock the ManageCategoriesModal component
vi.mock("../category/ManageCategoriesModal", () => ({
  default: ({ isOpen, onClose }) => (isOpen ? <div>Mock Modal</div> : null),
}));

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

describe("Navbar Component", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
  });

  it("renders Home link when not authenticated", () => {
    mockUseAuth0.mockReturnValue({
      isAuthenticated: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.queryByText("Stores")).toBeFalsy();
    expect(screen.queryByText("Manage Categories")).toBeFalsy();
    expect(screen.queryByText("Log Out")).toBeFalsy();
  });

  it("renders authenticated menu items when authenticated", () => {
    mockUseAuth0.mockReturnValue({
      isAuthenticated: true,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.queryByText("Home")).toBeFalsy();
    expect(screen.getByText("Stores")).toBeTruthy();
    expect(screen.getByText("Manage Categories")).toBeTruthy();
    expect(screen.getByText("Log Out")).toBeTruthy();
  });

  it("opens category modal when Manage Categories is clicked", () => {
    mockUseAuth0.mockReturnValue({
      isAuthenticated: true,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Manage Categories"));
    expect(screen.getByText("Mock Modal")).toBeTruthy();
  });

  it("calls logout function when Log Out is clicked", () => {
    const mockLogout = vi.fn();
    mockUseAuth0.mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Log Out"));
    expect(mockLogout).toHaveBeenCalledWith({
      returnTo: window.location.origin,
    });
  });
});
