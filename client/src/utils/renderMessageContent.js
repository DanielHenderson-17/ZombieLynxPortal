import React from "react";
import { truncateText } from "./truncateText";

export const renderMessageContent = (content) => {
  if (!content) return null;

  // Check for YouTube links and embed them
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
  const match = content.match(youtubeRegex);

  if (match) {
    const videoId = match[1];
    const truncatedLink = truncateText(content, 50);

    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        React.createElement(
          "a",
          { href: content, target: "_blank", rel: "noopener noreferrer" },
          truncatedLink
        )
      ),
      React.createElement("iframe", {
        width: "300",
        height: "169",
        src: `https://www.youtube.com/embed/${videoId}`,
        frameBorder: "0",
        allow:
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        allowFullScreen: true,
        title: "YouTube Video",
        style: { borderRadius: "5px", marginTop: "5px" },
      })
    );
  }

  // Check for image links and display them
  const imageRegex = /\.(jpeg|jpg|gif|png|webp)$/i;
  if (imageRegex.test(content)) {
    return React.createElement(
      "div",
      { className: "mt-2" },
      React.createElement(
        "a",
        { href: content, target: "_blank", rel: "noopener noreferrer" },
        React.createElement("img", {
          src: content,
          alt: "Embedded Media",
          className: "message-img-preview",
          style: { maxWidth: "200px", borderRadius: "5px", marginTop: "5px" },
        })
      )
    );
  }

  // Convert general links to truncated hyperlinks
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return React.createElement("p", {
    dangerouslySetInnerHTML: {
      __html: content.replace(urlRegex, (url) => {
        const truncated = truncateText(url, 50);
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${truncated}</a>`;
      }),
    },
  });
};
