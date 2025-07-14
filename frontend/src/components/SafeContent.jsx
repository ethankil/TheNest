import React from "react";
import DOMPurify from "dompurify";

function SafeContent({ html }) {
  const cleanHTML = DOMPurify.sanitize(html);

  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
}

export default SafeContent;
