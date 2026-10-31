import { render, screen } from "@testing-library/react-native";
import { describe, expect, it } from "vitest";

import {
  screenElements as findAll,
  screenIcons,
} from "../../__mocks__/screenQueries.js";

import { Thumbnail } from "./Thumbnail.js";

describe("Thumbnail", () => {
  it("renders the photo when photoUri is set", async () => {
    await render(
      <Thumbnail photoUri="file://photo.jpg" placeholderIcon="cube-outline" />,
    );
    const images = findAll("Image");
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveProp("source", { uri: "file://photo.jpg" });
    expect(screenIcons()).toEqual([]);
  });

  it("renders the placeholder icon when there is no photo", async () => {
    await render(<Thumbnail photoUri={null} placeholderIcon="cube-outline" />);
    expect(findAll("Image")).toHaveLength(0);
    expect(screenIcons()).toEqual(["cube-outline"]);
  });

  it("applies custom styles over the defaults", async () => {
    await render(
      <Thumbnail
        photoUri={null}
        placeholderIcon="cube-outline"
        styles={{ iconColor: "#ff0000" }}
      />,
    );
    expect(findAll("Ionicons")[0]).toHaveProp("color", "#ff0000");
  });

  it("keeps the placeholder centered when only overriding its background color", async () => {
    await render(
      <Thumbnail
        photoUri={null}
        placeholderIcon="cube-outline"
        styles={{ placeholder: { backgroundColor: "#000000" } }}
      />,
    );
    expect(screen.root).toHaveStyle({
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000000",
    });
  });
});
