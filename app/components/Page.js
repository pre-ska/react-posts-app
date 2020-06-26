import React, { useEffect } from "react";
import Container from "./Container";

const Page = ({ title, children, wide }) => {
  useEffect(() => {
    document.title = `${title} | PostsApp`;
    window.scrollTo(0, 0);
  }, [title]);

  return <Container wide={wide}>{children}</Container>;
};

export default Page;
