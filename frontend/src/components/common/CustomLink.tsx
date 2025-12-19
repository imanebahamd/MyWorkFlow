import { Link, type LinkProps } from 'react-router-dom';
import React from 'react';

const CustomLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link ref={ref} {...props} />
));

export default CustomLink;
