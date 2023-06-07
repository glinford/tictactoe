import { render, fireEvent, cleanup } from "@testing-library/react";
import Toggle from "../Toggle";

afterEach(cleanup);

test("renders Toggle with correct initial state and labels", () => {
    const { getByTestId } = render(<Toggle toggleStates={["Off", "On"]} testid="toggle-test" />);
    const toggleElement = getByTestId("toggle-test");

    const offElement = toggleElement.querySelector(".button-section.selected");
    expect(offElement).toHaveTextContent("Off");

    const onElement = toggleElement.querySelector(".button-section:not(.selected)");
    expect(onElement).toHaveTextContent("On");
});

test("correctly toggles state on click", () => {
    const mockOnToggle = jest.fn();

    const { getByTestId } = render(<Toggle toggleStates={["Off", "On"]} testid="toggle-test" onToggle={mockOnToggle} />);
    const toggleElement = getByTestId("toggle-test");

    fireEvent.click(toggleElement);

    expect(mockOnToggle).toHaveBeenCalledWith("On");

    const onElement = toggleElement.querySelector(".button-section.selected");
    expect(onElement).toHaveTextContent("On");

    const offElement = toggleElement.querySelector(".button-section:not(.selected)");
    expect(offElement).toHaveTextContent("Off");
});

test("correctly sets initial state according to choice prop", () => {
    const { getByTestId } = render(<Toggle toggleStates={["Off", "On"]} testid="toggle-test" choice="On" />);
    const toggleElement = getByTestId("toggle-test");

    const onElement = toggleElement.querySelector(".button-section.selected");
    expect(onElement).toHaveTextContent("On");
});
