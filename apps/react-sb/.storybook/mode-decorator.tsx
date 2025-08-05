import { useTwDarkMode } from "@forthtilliath/react-hooks/useTwDarkMode";

export const ModeDecorator = (Story: () => React.ReactNode) => {
  const [isDarkMode, toggleMode] = useTwDarkMode();

  // TODO: Replace by shadcn-ui button
  // TODO: Remove the button on preview mode (or fix toggle & bg color), just keep it on story mode

  return (
    <div className="w-full">
      <button
        onClick={toggleMode}
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          zIndex: 9999,
          padding: "8px 12px",
          backgroundColor: isDarkMode ? "#333" : "#fff",
          color: isDarkMode ? "#fff" : "#333",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isDarkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <Story />
    </div>
  );
};
