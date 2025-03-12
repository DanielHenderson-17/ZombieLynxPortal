import React from "react";
import { truncateText } from "./truncateText";

export const renderMessageContent = (content, messages) => {
  if (!content) return null;

  // ✅ Build a map of Discord IDs to Names (convert IDs to strings for accurate lookup)
  const userMap = messages.reduce((acc, msg) => {
    acc[String(msg.discordUserId)] = msg.discordUserName; // Ensure keys are strings
    return acc;
  }, {});

  console.log("User Map:", userMap); // Debugging - Ensure the mapping is correct

  // ✅ Replace <@UserID> mentions with actual usernames
  content = content.replace(/<@(\d+)>/g, (match, userId) => {
    console.log(`Replacing mention: ${match} -> ${userMap[userId]}`); // Debugging
    return userMap[userId] ? `@${userMap[userId]}` : match; // Replace if found, else keep original
  });

  // **Check for YouTube links and embed them**
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
  const match = content.match(youtubeRegex);

  if (match) {
    const videoId = match[1];
    const truncatedLink = truncateText(content, 40);

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

  // **Fixing Discord Custom Emoji Handling (Prevents <a> wrapping)**
  const discordEmojiRegex = /<a?:(\w+):(\d+)>/g;
  content = content.replace(discordEmojiRegex, (match, name, id) => {
    const isAnimated = match.startsWith("<a:");
    const emojiUrl = `https://cdn.discordapp.com/emojis/${id}.${
      isAnimated ? "gif" : "png"
    }`;

    return `<img src="${emojiUrl}" alt="${name}" class="discord-emoji" 
             style="height: 32px; width: 32px; vertical-align: middle; display: inline-block;">`;
  });

  // **Convert general links AFTER fixing emojis**
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  content = content.replace(urlRegex, (url) => {
    const truncated = truncateText(url, 40);
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${truncated}</a>`;
  });

  // **Wrap content in a div to prevent escaping issues**
  return React.createElement("div", {
    dangerouslySetInnerHTML: { __html: content },
  });
};
